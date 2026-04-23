import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, declarative_base

""" Note:
Using SQLAlchemy for database interactions. 
The database URL is loaded from env file.
we use sessionmake to create a session factory,
get_db is a dependency that provides a database session for each request.
connect_args is required for SQLite to allow multiple threads
"""

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./test.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
    
# Base class for our models
# allows us to define our database tables as Python classes
class Bass(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


