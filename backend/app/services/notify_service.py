"""
Notify Service — emails government officers when a HIGH-risk / non-compliant
audit is recorded. Reuses the same Gmail SMTP config as OTP emails.
"""
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


async def notify_officers_of_violation(audit_id: str, product_ref: str, compliance_score: float, violations: list) -> None:
    recipients = [e.strip() for e in settings.OFFICER_NOTIFY_EMAILS.split(",") if e.strip()]
    if not recipients or not settings.SMTP_USER:
        return  # not configured — silently skip in dev

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Legal Metrology] High-risk audit flagged — {product_ref}"
    msg["From"] = settings.SMTP_USER
    msg["To"] = ", ".join(recipients)

    rows = "".join(
        f"<li><b>{v.get('rule_type')}</b>: {v.get('description')}</li>" for v in violations
    ) or "<li>No itemised violations recorded.</li>"

    body = f"""
    <html><body style="font-family:sans-serif;">
      <h2 style="color:#7a1f1f;">Non-Compliant Product Flagged</h2>
      <p>Audit <b>{audit_id}</b> for <b>{product_ref}</b> scored
        <b>{compliance_score}/100</b> and requires review.</p>
      <ul>{rows}</ul>
      <p>Log in to the compliance dashboard to review evidence and issue a
      Section 39 notice.</p>
    </body></html>
    """
    msg.attach(MIMEText(body, "html"))

    await aiosmtplib.send(
        msg,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USER,
        password=settings.SMTP_PASSWORD,
        start_tls=True,
    )
