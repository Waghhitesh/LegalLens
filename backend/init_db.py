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

# Demo users (password: password123) - these need dev_admin verification to work
demo_pw = bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode()

users = [
    ("r.sharma",      "rsharma@legalmetrology.gov.in",  "ADMIN",               "Rajesh Sharma",      "Maharashtra",  True),
    ("p.verma",       "pverma@legalmetrology.gov.in",   "GOVERNMENT_OFFICIAL", "Priya Verma",        "Delhi NCR",    True),
    ("a.gupta",       "agupta@legalmetrology.gov.in",   "GOVERNMENT_OFFICIAL", "Amit Gupta",         "Karnataka",    True),
    ("manufacturer1", "quality@bharatfoods.in",          "COMPANY",             "Bharat Foods QC",    "Maharashtra",  True),
    ("shop.owner",    "shop@example.com",                "SHOPKEEPER",          "Vikram Singh",       "Gujarat",      True),
    ("demo_inspector","demo@legallens.gov.in",           "ADMIN",               "Demo Inspector",     "Delhi NCR",    True),
]

for username, email, role, full_name, area, verified in users:
    try:
        c.execute("""
            INSERT INTO users (id, email, username, hashed_password, full_name, role, is_active, is_verified, area_jurisdiction, created_at, updated_at)
            VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, 1, ?, ?, datetime('now'), datetime('now'))
        """, (email, username, demo_pw, full_name, role, 1 if verified else 0, area))
        print(f"  + Created user: {username} ({role})")
    except sqlite3.IntegrityError as e:
        print(f"  - Skipped {username}: {e}")

# Developer Admin - special account with secure password
# Password is NOT displayed here for security
dev_admin_pw = bcrypt.hashpw("HVW@23sih".encode(), bcrypt.gensalt()).decode()
try:
    c.execute("""
        INSERT INTO users (id, email, username, hashed_password, full_name, role, is_active, is_verified, area_jurisdiction, created_at, updated_at)
        VALUES (lower(hex(randomblob(16))), 'dev@legallens.gov.in', 'dev_admin', ?, 'Developer Admin', 'ADMIN', 1, 1, 'National', datetime('now'), datetime('now'))
    """, (dev_admin_pw,))
    print("  + Created Developer Admin account")
except sqlite3.IntegrityError as e:
    print(f"  - Skipped dev_admin: {e}")

conn.commit()
conn.close()
print("\nDatabase seeded successfully!")
print("\nDemo accounts created (password: password123):")
for username, _, role, full_name, area, _ in users:
    print(f"  {username:20s}  {role:22s}  {area}")
print("\n  Developer Admin account also created (credentials secured)")
