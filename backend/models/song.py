from ..db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

"""Song model for the database"""

class Song(Base):
    __tablename__ = "songs"