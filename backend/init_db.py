"""Recreate DB schema and seed demo users."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

# Delete old DB
if os.path.exists("legallens.db"):
    os.remove("legallens.db")
    print("Deleted old legallens.db")

# Recreate all tables
from app.db.database import Base, engine
from app.models import user, audit_log, product, violation, otp

Base.metadata.create_all(bind=engine)
print("DB schema created OK")

# Seed demo users
import bcrypt
import sqlite3

conn = sqlite3.connect("legallens.db")
c = conn.cursor()

users = [
    ("r.sharma",     "rsharma@legalmetrology.gov.in",  "ADMIN",               "Rajesh Sharma",      "Maharashtra"),
    ("p.verma",      "pverma@legalmetrology.gov.in",   "GOVERNMENT_OFFICIAL", "Priya Verma",        "Delhi NCR"),
    ("a.gupta",      "agupta@legalmetrology.gov.in",   "GOVERNMENT_OFFICIAL", "Amit Gupta",         "Karnataka"),
    ("manufacturer1","quality@bharatfoods.in",         "COMPANY",             "Bharat Foods QC",    "Maharashtra"),
    ("shop.owner",   "shop@example.com",               "SHOPKEEPER",          "Vikram Singh",       "Gujarat"),
    ("demo_inspector","demo@legallens.gov.in",         "ADMIN",               "Demo Inspector",     "Delhi NCR"),
]

hashed_pw = bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode()

for username, email, role, full_name, area in users:
    try:
        c.execute("""
            INSERT INTO users (id, email, username, hashed_password, full_name, role, is_active, is_verified, area_jurisdiction, created_at, updated_at)
            VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, 1, 1, ?, datetime('now'), datetime('now'))
        """, (email, username, hashed_pw, full_name, role, area))
        print(f"  + Created user: {username} ({role})")
    except sqlite3.IntegrityError as e:
        print(f"  - Skipped {username}: {e}")

conn.commit()
conn.close()
print("\nDatabase seeded successfully!")
print("\nDemo credentials (all use password: password123):")
for username, _, role, full_name, area in users:
    print(f"  {username:20s}  {role:22s}  {area}")
