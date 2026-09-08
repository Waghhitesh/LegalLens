import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.types import Uuid as UUID

from app.db.database import Base


class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    ADMIN = "ADMIN"
    GOVERNMENT_OFFICIAL = "GOVERNMENT_OFFICIAL"
    COMPANY = "COMPANY"
    SHOPKEEPER = "SHOPKEEPER"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=True, index=True)
    mobile = Column(String, unique=True, nullable=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CITIZEN)
    full_name = Column(String, nullable=True)
    organisation = Column(String, nullable=True)
    area_jurisdiction = Column(String, nullable=True)  # e.g. 'Maharashtra', 'Delhi NCR'
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
