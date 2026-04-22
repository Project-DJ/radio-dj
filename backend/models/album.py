from ..db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

"""Album model for the database"""

class Album(Base):
    __tablename__ = "albums"