import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, DateTime, Enum
from sqlalchemy.types import Uuid as UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class SourceType(str, enum.Enum):
    URL_SCRAPE = "URL_SCRAPE"
    FIELD_UPLOAD = "FIELD_UPLOAD"


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(String, nullable=True, index=True)
    barcode = Column(String, nullable=True, index=True)
    source_type = Column(Enum(SourceType), nullable=False, default=SourceType.URL_SCRAPE)

    # Scraped from e-commerce listing
    scraped_mrp = Column(Float, nullable=True)
    scraped_net_weight = Column(String, nullable=True)
    scraped_manufacturer = Column(String, nullable=True)
    scraped_country_of_origin = Column(String, nullable=True)
    scraped_consumer_care = Column(String, nullable=True)

    # Physical package image
    package_image_path = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    audit_logs = relationship("AuditLog", back_populates="product", cascade="all, delete-orphan")
