import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

""" Note:
Using SQLAlchemy for database interactions. 
The database URL is loaded from env file.
we use sessionmake to create a session factory,
get_db is a dependency that provides a database session for each request.
connect_args is required for SQLite to allow multiple threads
"""

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", connect_args={"check_same_thread": False})

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


