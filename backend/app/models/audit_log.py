import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.types import Uuid as UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class AuditStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    PASS_ = "PASS"
    FAIL = "FAIL"
    ERROR = "ERROR"


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)

    physical_mrp = Column(Float, nullable=True)
    physical_net_weight = Column(String, nullable=True)
    physical_manufacturer = Column(String, nullable=True)
    physical_country_of_origin = Column(String, nullable=True)
    physical_consumer_care = Column(String, nullable=True)
    detected_font_height_mm = Column(Float, nullable=True)
    
    mfg_date = Column(String, nullable=True)
    batch_number = Column(String, nullable=True)
    fssai_license = Column(String, nullable=True)
    ingredients = Column(String, nullable=True)
    nutritional_info = Column(String, nullable=True)
    ocr_raw_text = Column(String, nullable=True)
    expiry_date = Column(String, nullable=True)

    compliance_score = Column(Float, nullable=True)
    status = Column(Enum(AuditStatus), nullable=False, default=AuditStatus.PENDING)

    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    location_address = Column(String, nullable=True)
    product_name = Column(String, nullable=True)
    brand_name = Column(String, nullable=True)
    scan_timestamp = Column(DateTime, default=datetime.utcnow)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    product = relationship("Product", back_populates="audit_logs")
    violations = relationship("Violation", back_populates="audit_log", cascade="all, delete-orphan")
