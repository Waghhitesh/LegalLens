import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.user import UserRole


class OTPRequest(BaseModel):
    target: str  # email or phone
    purpose: str = "register"


class OTPVerify(BaseModel):
    target: str
    code: str
    purpose: str = "register"


class RegisterRequest(BaseModel):
    username: str
    password: str
    otp_target: str
    otp_code: str
    role: UserRole = UserRole.CITIZEN
    full_name: Optional[str] = None
    organisation: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole


class UserOut(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    username: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    role: UserRole
    full_name: Optional[str] = None
    organisation: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
