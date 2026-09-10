import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models.audit_log import AuditStatus
from app.schemas.violation import ViolationOut
from app.schemas.product import ProductOut


class AuditTaskAccepted(BaseModel):
    product_id: uuid.UUID
    audit_id: uuid.UUID
    task_id: str
    status: AuditStatus = AuditStatus.PENDING


class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    product_id: uuid.UUID
    product: Optional[ProductOut] = None
    physical_mrp: Optional[float] = None
    physical_net_weight: Optional[str] = None
    physical_manufacturer: Optional[str] = None
    physical_country_of_origin: Optional[str] = None
    physical_consumer_care: Optional[str] = None
    detected_font_height_mm: Optional[float] = None
    mfg_date: Optional[str] = None
    batch_number: Optional[str] = None
    fssai_license: Optional[str] = None
    ingredients: Optional[str] = None
    nutritional_info: Optional[str] = None
    ocr_raw_text: Optional[str] = None
    expiry_date: Optional[str] = None
    compliance_score: Optional[float] = None
    status: AuditStatus
    created_at: datetime
    completed_at: Optional[datetime] = None
    violations: List[ViolationOut] = []


class DashboardStats(BaseModel):
    total_audits: int
    total_pass: int
    total_fail: int
    pass_rate: float
    violations_by_rule: dict
    audits_last_7_days: list
