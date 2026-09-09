import bcrypt, sqlite3

conn = sqlite3.connect('legallens.db')
c = conn.cursor()
hashed_pw = bcrypt.hashpw('HVW@23sih'.encode(), bcrypt.gensalt()).decode()
try:
    c.execute("""
        INSERT INTO users (id, email, username, hashed_password, full_name, role, is_active, is_verified, area_jurisdiction, created_at, updated_at)
        VALUES (lower(hex(randomblob(16))), 'dev@legallens.gov.in', 'dev_admin', ?, 'Developer Admin', 'ADMIN', 1, 1, 'National', datetime('now'), datetime('now'))
    """, (hashed_pw,))
    conn.commit()
    print('dev_admin created')
except Exception as e:
    print('dev_admin error:', e)
conn.close()
