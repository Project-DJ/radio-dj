from ..db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

"""User model for the database"""

class User(Base):
    __tablename__ = "users"