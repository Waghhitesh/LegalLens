"""
Auth Router — Direct login + OTP-based registration.
Includes dev-mode direct register (no OTP needed) for hackathon.
"""
import re
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, UserRole
from app.models.otp import OTPRecord
from app.schemas.auth import OTPRequest, OTPVerify, RegisterRequest, DirectRegisterRequest, LoginRequest, Token, UserOut
from app.services.otp_service import create_otp_record, verify_otp, send_email_otp, send_sms_otp
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _is_email(t: str) -> bool:
    return bool(EMAIL_RE.match(t))


@router.post("/otp/request", status_code=202)
async def request_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    code = create_otp_record(db, target=payload.target, purpose=payload.purpose)
    channel = "console"
    try:
        if _is_email(payload.target):
            await send_email_otp(payload.target, code, payload.purpose)
            channel = "email"
        else:
            await send_sms_otp(payload.target, code)
            channel = "sms"
    except Exception:
        # In dev mode, OTP is printed to console — return it in response for hackathon
        pass
    import logging
    logging.getLogger(__name__).info(f"DEV OTP for {payload.target}: {code}")
    return {
        "detail": f"OTP sent via {channel}.",
        "dev_otp": code,  # Only expose in dev — remove in production
        "expires_in_minutes": 10
    }


@router.post("/otp/verify")
def verify_otp_ep(payload: OTPVerify, db: Session = Depends(get_db)):
    record = db.query(OTPRecord).filter(
        OTPRecord.target == payload.target,
        OTPRecord.otp_code == payload.code,
        OTPRecord.purpose == payload.purpose,
        OTPRecord.is_used == False,
        OTPRecord.expires_at > datetime.utcnow(),
    ).first()
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"valid": True}


@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if not verify_otp(db, target=payload.otp_target, code=payload.otp_code, purpose="register"):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=409, detail="Username already taken")
    is_email = _is_email(payload.otp_target)
    user = User(
        username=payload.username,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        full_name=payload.full_name,
        organisation=payload.organisation,
        email=payload.email or (payload.otp_target if is_email else None),
        mobile=payload.mobile or (payload.otp_target if not is_email else None),
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/register-direct", response_model=UserOut, status_code=201)
def register_direct(payload: DirectRegisterRequest, db: Session = Depends(get_db)):
    """Dev/hackathon mode: register without OTP verification."""
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=409, detail="Username already taken")
    if payload.email and db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(
        username=payload.username,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        full_name=payload.full_name,
        organisation=payload.organisation,
        email=payload.email,
        mobile=payload.mobile,
        is_verified=True,
        area_jurisdiction=payload.area_jurisdiction,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == payload.username) | (User.email == payload.username)
    ).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled. Contact administrator.")
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return Token(access_token=token, role=user.role, username=user.username, full_name=user.full_name)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
