import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.violation import RuleType


class ViolationOut(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    rule_type: RuleType
    description: str
    bounding_box_coordinates: Optional[dict] = None
    created_at: datetime
