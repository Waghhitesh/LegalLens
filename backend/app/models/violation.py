import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.types import Uuid as UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class RuleType(str, enum.Enum):
    RULE_6_MANDATORY_DECLARATION = "RULE_6_MANDATORY_DECLARATION"
    RULE_7_FONT_LEGIBILITY = "RULE_7_FONT_LEGIBILITY"
    OVERCHARGING = "OVERCHARGING"


class Violation(Base):
    __tablename__ = "violations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_log_id = Column(UUID(as_uuid=True), ForeignKey("audit_logs.id"), nullable=False)
    rule_type = Column(Enum(RuleType), nullable=False)
    description = Column(String, nullable=False)
    bounding_box_coordinates = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    audit_log = relationship("AuditLog", back_populates="violations")
