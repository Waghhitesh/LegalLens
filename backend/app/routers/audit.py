"""
Audit Router — core inspection endpoints.
All audits run SYNCHRONOUSLY — no Celery/Redis needed.
"""
import os
import uuid
import shutil
import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.config import settings
from app.models.product import Product, SourceType
from app.models.audit_log import AuditLog, AuditStatus
from app.models.violation import Violation
from app.schemas.product import ProductURLSubmit
from app.schemas.audit import AuditTaskAccepted, AuditLogOut
from app.services.pdf_generator import generate_legal_notice_pdf
from app.services import scraper, ai_pipeline, reconciliation

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/audit", tags=["audit"])
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


def _run_ai_and_reconcile(db: Session, product: Product, audit: AuditLog, image_path: str | None):
    """AI pipeline -> reconciliation -> persist violations + score."""
    physical_data = {}
    field_bounding_boxes = {}
    font_height = None

    if image_path and os.path.exists(image_path):
        try:
            cropped = ai_pipeline.crop_pdp(image_path)
            extracted = ai_pipeline.extract_label_data(cropped)
            field_bounding_boxes = extracted.get("field_bounding_boxes", {})
            font_height = ai_pipeline.calculate_font_height(cropped)

            physical_data = {
                "physical_mrp": extracted.get("mrp"),
                "physical_net_weight": extracted.get("net_weight"),
                "physical_manufacturer": extracted.get("manufacturer"),
                "physical_country_of_origin": extracted.get("country_of_origin"),
                "physical_consumer_care": extracted.get("consumer_care"),
            }
            audit.physical_mrp = physical_data["physical_mrp"]
            audit.physical_net_weight = physical_data["physical_net_weight"]
            audit.physical_manufacturer = physical_data["physical_manufacturer"]
            audit.physical_country_of_origin = physical_data["physical_country_of_origin"]
            audit.physical_consumer_care = physical_data["physical_consumer_care"]
            audit.detected_font_height_mm = font_height
        except Exception as e:
            logger.error(f"AI pipeline error: {e}", exc_info=True)

    violations = reconciliation.run_all_checks(
        scraped_mrp=product.scraped_mrp,
        physical_data=physical_data,
        detected_font_height_mm=font_height,
        field_bounding_boxes=field_bounding_boxes,
    )

    for v in violations:
        db.add(Violation(
            audit_log_id=audit.id,
            rule_type=v["rule_type"],
            description=v["description"],
            bounding_box_coordinates=v.get("bounding_box_coordinates"),
        ))

    score = reconciliation.calculate_compliance_score(violations)
    audit.compliance_score = score
    audit.status = AuditStatus.PASS_ if score >= 70 else AuditStatus.FAIL
    audit.completed_at = datetime.utcnow()
    db.commit()


@router.post("/url", response_model=AuditTaskAccepted, status_code=202)
def audit_from_url(payload: ProductURLSubmit, db: Session = Depends(get_db)):
    """Submit an e-commerce URL for compliance audit."""
    product = Product(url=str(payload.url), source_type=SourceType.URL_SCRAPE)
    db.add(product)
    db.commit()
    db.refresh(product)

    audit = AuditLog(product_id=product.id, status=AuditStatus.PROCESSING)
    db.add(audit)
    db.commit()
    db.refresh(audit)

    try:
        scraped = scraper.scrape_product_page(str(payload.url))
        product.scraped_mrp = scraped.mrp
        product.scraped_net_weight = scraped.net_weight
        product.scraped_manufacturer = scraped.manufacturer
        product.scraped_country_of_origin = scraped.country_of_origin
        product.scraped_consumer_care = scraped.consumer_care

        image_path = None
        if scraped.image_url:
            image_path = os.path.join(settings.UPLOAD_DIR, f"{product.id}.jpg")
            try:
                scraper.download_image(scraped.image_url, image_path)
                product.package_image_path = image_path
            except Exception as e:
                logger.warning(f"Image download failed: {e}")
                image_path = None
        db.commit()
        _run_ai_and_reconcile(db, product, audit, image_path)
    except Exception as e:
        logger.error(f"URL audit failed: {e}", exc_info=True)
        audit.status = AuditStatus.ERROR
        audit.completed_at = datetime.utcnow()
        db.commit()

    db.refresh(audit)
    return AuditTaskAccepted(
        product_id=product.id, audit_id=audit.id, task_id="sync", status=audit.status
    )


@router.post("/upload", response_model=AuditTaskAccepted, status_code=202)
def audit_from_upload(
    barcode: str = Form(None),
    file: UploadFile = File(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    """Upload a physical package image for field-inspector audit."""
    upload = file or image
    if not upload:
        raise HTTPException(status_code=422, detail="Provide image as 'file' or 'image' field.")

    product = Product(barcode=barcode or "", source_type=SourceType.FIELD_UPLOAD)
    db.add(product)
    db.commit()
    db.refresh(product)

    ext = os.path.splitext(upload.filename or "")[1] or ".jpg"
    image_path = os.path.join(settings.UPLOAD_DIR, f"{product.id}{ext}")
    with open(image_path, "wb") as f:
        shutil.copyfileobj(upload.file, f)
    product.package_image_path = image_path
    db.commit()

    audit = AuditLog(product_id=product.id, status=AuditStatus.PROCESSING)
    db.add(audit)
    db.commit()
    db.refresh(audit)

    try:
        _run_ai_and_reconcile(db, product, audit, image_path)
    except Exception as e:
        logger.error(f"Upload audit failed: {e}", exc_info=True)
        audit.status = AuditStatus.ERROR
        audit.completed_at = datetime.utcnow()
        db.commit()

    db.refresh(audit)
    return AuditTaskAccepted(
        product_id=product.id, audit_id=audit.id, task_id="sync", status=audit.status
    )


@router.post("/bulk-upload", status_code=202)
def audit_bulk_upload(images: list[UploadFile] = File(...), db: Session = Depends(get_db)):
    """Bulk-scan multiple package images (warehouse/shelf inspection)."""
    accepted = []
    for upload in images:
        product = Product(source_type=SourceType.FIELD_UPLOAD)
        db.add(product)
        db.commit()
        db.refresh(product)

        ext = os.path.splitext(upload.filename or "")[1] or ".jpg"
        image_path = os.path.join(settings.UPLOAD_DIR, f"{product.id}{ext}")
        with open(image_path, "wb") as f:
            shutil.copyfileobj(upload.file, f)
        product.package_image_path = image_path
        db.commit()

        audit = AuditLog(product_id=product.id, status=AuditStatus.PROCESSING)
        db.add(audit)
        db.commit()
        db.refresh(audit)

        try:
            _run_ai_and_reconcile(db, product, audit, image_path)
        except Exception as e:
            audit.status = AuditStatus.ERROR
            db.commit()

        accepted.append({"filename": upload.filename, "product_id": str(product.id), "audit_id": str(audit.id), "status": audit.status.value})

    return {"accepted": accepted, "count": len(accepted)}


@router.get("/{audit_id}", response_model=AuditLogOut)
def get_audit(audit_id: uuid.UUID, db: Session = Depends(get_db)):
    audit = db.query(AuditLog).filter(AuditLog.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    return audit


@router.get("/{audit_id}/report")
def get_audit_report(audit_id: uuid.UUID, db: Session = Depends(get_db)):
    audit = db.query(AuditLog).filter(AuditLog.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    violations = [
        {"rule_type": v.rule_type.value if hasattr(v.rule_type, "value") else str(v.rule_type),
         "description": v.description}
        for v in audit.violations
    ]
    product_url = audit.product.url or f"Field Upload - Barcode: {audit.product.barcode}"
    pdf_path = generate_legal_notice_pdf(
        audit_id=str(audit.id), product_url=product_url,
        violations=violations, compliance_score=audit.compliance_score or 0
    )
    return FileResponse(pdf_path, media_type="application/pdf",
                        filename=f"legal_notice_{audit.id}.pdf")
