"""Create an admin user for testing"""
import sys
sys.path.insert(0, '.')

from app.database import SessionLocal, Base, engine
from app.models.user import User
import bcrypt

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_admin():
    db = SessionLocal()

    try:
        # Check if admin already exists
        existing = db.query(User).filter(User.email == "admin@brandsgalaxy.com").first()
        if existing:
            print("Admin user already exists!")
            print(f"Email: admin@brandsgalaxy.com")
            return

        # Create admin user
        admin = User(
            email="admin@brandsgalaxy.com",
            password_hash=hash_password("admin123"),
            full_name="Admin User",
            is_admin=True,
            is_active=True,
            email_verified=True
        )

        db.add(admin)
        db.commit()

        print("Admin user created successfully!")
        print("-" * 40)
        print(f"Email: admin@brandsgalaxy.com")
        print(f"Password: admin123")
        print("-" * 40)

    except Exception as e:
        db.rollback()
        print(f"Error creating admin: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
