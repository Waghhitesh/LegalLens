"""
Notifications Router — area-based violation alerts for officers.
"""
import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.audit_log import AuditLog, AuditStatus

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])
bearer = HTTPBearer(auto_error=False)

GLOBAL_NOTIFICATIONS = []

def append_notification(notif: dict):
    GLOBAL_NOTIFICATIONS.insert(0, notif)

@router.get("")
def get_notifications(
    db: Session = Depends(get_db),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer),
    limit: int = 20,
):
    """Return recent failed audits as notifications. Works with or without auth."""
    since = datetime.utcnow() - timedelta(days=7)
    try:
        audits = db.query(AuditLog).filter(
            AuditLog.status == AuditStatus.FAIL,
            AuditLog.completed_at >= since,
        ).order_by(AuditLog.completed_at.desc()).limit(limit).all()
    except Exception:
        audits = []

    notifications = list(GLOBAL_NOTIFICATIONS)
    for a in audits:
        product_name = getattr(a, 'product_name', None) or 'Unknown Product'
        notifications.append({
            "id": str(a.id),
            "type": "violation_alert",
            "title": "Non-compliant product detected",
            "message": f"{product_name} — Score: {a.compliance_score or 0:.0f}/100",
            "audit_id": str(a.id),
            "score": a.compliance_score or 0,
            "location": getattr(a, 'location_address', None) or "Location not recorded",
            "timestamp": a.completed_at.isoformat() if a.completed_at else datetime.utcnow().isoformat(),
            "severity": "HIGH" if (a.compliance_score or 0) < 40 else "MEDIUM",
        })

    notifications.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    notifications = notifications[:limit]
    return {"notifications": notifications, "count": len(notifications), "unread": len(notifications)}
