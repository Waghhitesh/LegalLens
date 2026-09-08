"""
Export Service — dump audit/user data to CSV for the admin panel.
"""
import csv
import io
import os
from datetime import datetime

from app.core.config import settings


def export_users_csv(users: list) -> str:
    os.makedirs(settings.EXPORTS_DIR, exist_ok=True)
    path = os.path.join(settings.EXPORTS_DIR, f"users_{datetime.utcnow():%Y%m%d_%H%M%S}.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "id", "username", "email", "mobile", "role",
            "full_name", "organisation", "is_active", "is_verified", "created_at"
        ])
        writer.writeheader()
        for u in users:
            writer.writerow({
                "id": str(u.id),
                "username": u.username,
                "email": u.email or "",
                "mobile": u.mobile or "",
                "role": u.role.value,
                "full_name": u.full_name or "",
                "organisation": u.organisation or "",
                "is_active": u.is_active,
                "is_verified": u.is_verified,
                "created_at": u.created_at.strftime("%Y-%m-%d %H:%M") if u.created_at else "",
            })
    return path


def export_audits_csv(audits: list) -> str:
    os.makedirs(settings.EXPORTS_DIR, exist_ok=True)
    path = os.path.join(settings.EXPORTS_DIR, f"audits_{datetime.utcnow():%Y%m%d_%H%M%S}.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "audit_id", "product_url", "status", "compliance_score",
            "violation_count", "created_at", "completed_at"
        ])
        writer.writeheader()
        for a in audits:
            writer.writerow({
                "audit_id": str(a.id),
                "product_url": getattr(a.product, "url", "") or "",
                "status": a.status.value,
                "compliance_score": a.compliance_score or 0,
                "violation_count": len(a.violations),
                "created_at": a.created_at.strftime("%Y-%m-%d %H:%M") if a.created_at else "",
                "completed_at": a.completed_at.strftime("%Y-%m-%d %H:%M") if a.completed_at else "",
            })
    return path
