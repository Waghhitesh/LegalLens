"""
Notifications Router — area-based violation alerts for officers.
"""
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.audit_log import AuditLog, AuditStatus
from app.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])


GLOBAL_NOTIFICATIONS = []

def append_notification(notif: dict):
    GLOBAL_NOTIFICATIONS.insert(0, notif)

@router.get("")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20,
):
    """Return recent failed audits as notifications for the current officer."""
    since = datetime.utcnow() - timedelta(days=7)
    query = db.query(AuditLog).filter(
        AuditLog.status == AuditStatus.FAIL,
        AuditLog.completed_at >= since,
    ).order_by(AuditLog.completed_at.desc()).limit(limit)
    
    audits = query.all()
    notifications = list(GLOBAL_NOTIFICATIONS)
    for a in audits:
        product_name = getattr(a, 'product_name', None) or (a.product.url[:50] if a.product and a.product.url else 'Unknown Product')
        notifications.append({
            "id": str(a.id),
            "type": "violation_alert",
            "title": f"Non-compliant product detected",
            "message": f"{product_name} — Score: {a.compliance_score or 0:.0f}/100",
            "audit_id": str(a.id),
            "score": a.compliance_score or 0,
            "location": getattr(a, 'location_address', None) or "Location not recorded",
            "timestamp": a.completed_at.isoformat() if a.completed_at else datetime.utcnow().isoformat(),
            "severity": "HIGH" if (a.compliance_score or 0) < 40 else "MEDIUM",
        })
    
    # Sort and limit
    notifications.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    notifications = notifications[:limit]
    
    return {"notifications": notifications, "count": len(notifications), "unread": len(notifications)}
