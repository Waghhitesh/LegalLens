"""
Legacy Celery tasks file — kept for reference.
Audits now run synchronously in audit.py.
No Celery worker or Redis needed.
"""
# This file intentionally does not import celery to avoid requiring Redis.
# The audit pipeline now runs synchronously in app/routers/audit.py.
