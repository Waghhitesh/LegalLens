import uuid
from typing import Optional
from pydantic import BaseModel, HttpUrl
from app.models.product import SourceType


class ProductURLSubmit(BaseModel):
    url: HttpUrl
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    location_address: Optional[str] = None
    product_name: Optional[str] = None
    brand_name: Optional[str] = None


class ProductOut(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    url: Optional[str] = None
    barcode: Optional[str] = None
    source_type: SourceType
    scraped_mrp: Optional[float] = None
    scraped_net_weight: Optional[str] = None
    scraped_manufacturer: Optional[str] = None
    scraped_country_of_origin: Optional[str] = None
    scraped_consumer_care: Optional[str] = None
    package_image_path: Optional[str] = None
