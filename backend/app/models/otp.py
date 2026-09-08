import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.types import Uuid as UUID

from app.db.database import Base


class OTPRecord(Base):
    __tablename__ = "otp_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    target = Column(String, nullable=False, index=True)  # email or mobile
    otp_code = Column(String(6), nullable=False)
    purpose = Column(String, nullable=False)  # "register" | "reset"
    is_used = Column(Boolean, default=False, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
