from ..db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

"""Playlist model for the database"""

class Playlist(Base):
    __tablename__ = "playlists"