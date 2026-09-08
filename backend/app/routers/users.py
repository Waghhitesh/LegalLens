"""
Users Router — Admin user management + export.
"""
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import UserOut
from app.services.auth_service import require_admin
from app.services.export_service import export_users_csv

router = APIRouter(prefix="/api/v1/users", tags=["users"])


class UserUpdate(BaseModel):
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    full_name: Optional[str] = None
    organisation: Optional[str] = None


@router.get("", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/{user_id}", response_model=UserOut)
def update_user(user_id: uuid.UUID, payload: UserUpdate, db: Session = Depends(get_db),
               _: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(user, field, val)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: uuid.UUID, db: Session = Depends(get_db),
               _: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()


@router.get("/export/{fmt}")
def export_users(fmt: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    users = db.query(User).all()
    if fmt == "csv":
        path = export_users_csv(users)
        return FileResponse(path, media_type="text/csv", filename="users.csv")
    raise HTTPException(status_code=400, detail="Unsupported format. Use 'csv'.")
