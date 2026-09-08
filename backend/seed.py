import sqlite3
import bcrypt

def seed():
    conn = sqlite3.connect('D:/sih-legal-metrology/backend/legallens.db')
    c = conn.cursor()
    
    users = [
        ('r.sharma', 'rsharma@legalmetrology.gov.in', 'ADMIN', 'Rajesh Sharma'),
        ('p.verma', 'pverma@legalmetrology.gov.in', 'GOVERNMENT_OFFICIAL', 'Priya Verma'),
        ('manufacturer1', 'quality@bharatfoods.in', 'COMPANY', 'Bharat Foods QC'),
        ('shop.owner', 'shop@example.com', 'SHOPKEEPER', 'Vikram Singh'),
        ('demo_inspector', 'demo@example.com', 'ADMIN', 'Demo Inspector')
    ]
    
    # default password is 'password123'
    hashed_password = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    for username, email, role, full_name in users:
        try:
            c.execute('''
                INSERT INTO users (id, email, username, hashed_password, full_name, role, is_active)
                VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, 1)
            ''', (email, username, hashed_password, full_name, role))
        except sqlite3.IntegrityError:
            pass # Already exists
            
    conn.commit()
    conn.close()
    print("Database seeded with demo users.")

if __name__ == "__main__":
    seed()
