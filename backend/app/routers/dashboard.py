"""
Dashboard Router — aggregated compliance stats.
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.audit_log import AuditLog, AuditStatus
from app.models.violation import Violation, RuleType
from app.schemas.audit import DashboardStats

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_audits = db.query(func.count(AuditLog.id)).scalar() or 0
    total_pass = db.query(func.count(AuditLog.id)).filter(AuditLog.status == AuditStatus.PASS_).scalar() or 0
    total_fail = db.query(func.count(AuditLog.id)).filter(AuditLog.status == AuditStatus.FAIL).scalar() or 0
    pass_rate = round((total_pass / total_audits) * 100, 2) if total_audits else 0.0

    rows = db.query(Violation.rule_type, func.count(Violation.id)).group_by(Violation.rule_type).all()
    violations_by_rule = {r.value: c for r, c in rows}
    for rule in RuleType:
        violations_by_rule.setdefault(rule.value, 0)

    since = datetime.utcnow() - timedelta(days=7)
    daily = (
        db.query(func.date(AuditLog.created_at), func.count(AuditLog.id))
        .filter(AuditLog.created_at >= since)
        .group_by(func.date(AuditLog.created_at))
        .order_by(func.date(AuditLog.created_at))
        .all()
    )
    audits_last_7_days = [{"date": str(d), "count": c} for d, c in daily]

    return DashboardStats(
        total_audits=total_audits, total_pass=total_pass, total_fail=total_fail,
        pass_rate=pass_rate, violations_by_rule=violations_by_rule,
        audits_last_7_days=audits_last_7_days,
    )


@router.get("/recent-audits")
def get_recent_audits(limit: int = 10, db: Session = Depends(get_db)):
    audits = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": str(a.id),
            "status": a.status.value,
            "compliance_score": a.compliance_score,
            "product_url": a.product.url if a.product else None,
            "violation_count": len(a.violations),
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in audits
    ]
