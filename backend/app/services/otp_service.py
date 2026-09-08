"""
OTP Service: generate, store, verify OTPs. Email/SMS sending.
"""
import random
import string
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.otp import OTPRecord


def _generate_code(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def create_otp_record(db: Session, target: str, purpose: str) -> str:
    code = _generate_code()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    record = OTPRecord(target=target, otp_code=code, purpose=purpose, expires_at=expires_at)
    db.add(record)
    db.commit()
    return code


def verify_otp(db: Session, target: str, code: str, purpose: str) -> bool:
    record = (
        db.query(OTPRecord)
        .filter(
            OTPRecord.target == target,
            OTPRecord.otp_code == code,
            OTPRecord.purpose == purpose,
            OTPRecord.is_used == False,
            OTPRecord.expires_at > datetime.utcnow(),
        )
        .first()
    )
    if not record:
        return False
    record.is_used = True
    db.commit()
    return True


async def send_email_otp(email: str, code: str, purpose: str) -> None:
    """Send OTP via SMTP (requires SMTP_USER/SMTP_PASSWORD configured)."""
    import smtplib
    from email.mime.text import MIMEText
    if not settings.SMTP_USER:
        # Dev mode: just print the OTP
        print(f"[DEV OTP] Target={email} Code={code} Purpose={purpose}")
        return
    msg = MIMEText(f"Your Legal Metrology Compliance System OTP is: {code}\n\nExpires in {settings.OTP_EXPIRE_MINUTES} minutes.")
    msg["Subject"] = f"LegalLens OTP: {code}"
    msg["From"] = settings.SMTP_USER
    msg["To"] = email
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)


async def send_sms_otp(mobile: str, code: str) -> None:
    """Send OTP via SMS. In dev mode, prints to console."""
    print(f"[DEV OTP] Target={mobile} Code={code}")
