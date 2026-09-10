import sys
sys.path.insert(0, ".")

import bcrypt
from app.db.database import SessionLocal, engine
from app.models import user as user_module  # ensure table exists
from app.models.user import User, UserRole

def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def seed():
    db = SessionLocal()
    try:
        demo_users = [
            {
                "username": "r.sharma",
                "email": "rsharma@legalmetrology.gov.in",
                "password": "password123",
                "role": UserRole.ADMIN,
                "full_name": "Rajesh Sharma",
            },
            {
                "username": "p.verma",
                "email": "pverma@legalmetrology.gov.in",
                "password": "password123",
                "role": UserRole.GOVERNMENT_OFFICIAL,
                "full_name": "Priya Verma",
            },
            {
                "username": "manufacturer1",
                "email": "quality@bharatfoods.in",
                "password": "password123",
                "role": UserRole.COMPANY,
                "full_name": "Bharat Foods QC",
            },
            {
                "username": "shop.owner",
                "email": "shop@example.com",
                "password": "password123",
                "role": UserRole.SHOPKEEPER,
                "full_name": "Vikram Singh",
            },
            {
                "username": "citizen1",
                "email": "consumer@gmail.com",
                "password": "password123",
                "role": UserRole.CITIZEN,
                "full_name": "Ananya Patel",
            },
            {
                "username": "demo_inspector",
                "email": "inspector@legalmetrology.gov.in",
                "password": "password123",
                "role": UserRole.ADMIN,
                "full_name": "Demo Inspector",
            },
            {
                "username": "dev_admin",
                "email": "dev@legallens.ai",
                "password": "HVW@23sih",
                "role": UserRole.ADMIN,
                "full_name": "Developer Admin",
            },
        ]

        for u in demo_users:
            existing = db.query(User).filter(User.username == u["username"]).first()
            if existing:
                # Update password hash and ensure verified
                existing.hashed_password = _hash(u["password"])
                existing.is_verified = True
                existing.is_active = True
                print(f"Updated: {u['username']}")
            else:
                new_user = User(
                    username=u["username"],
                    email=u["email"],
                    hashed_password=_hash(u["password"]),
                    role=u["role"],
                    full_name=u["full_name"],
                    is_active=True,
                    is_verified=True,
                )
                db.add(new_user)
                print(f"Created: {u['username']}")

        db.commit()
        print("\nAll demo users seeded successfully.")
        print("Login credentials: username=r.sharma, password=password123")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
