from ..db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

"""Song model for the database"""

class Song(Base):
    __tablename__ = "songs"

    #required fields
    id = Column(Integer, primary_key=True, index=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    artist = Column(String, index=True, nullable=False)
    album = Column(String, index=True, nullable=False)
    duration_ms = Column(Integer, nullable=False)

    #optional fields
    artist_genre = Column(String, index=True)
    release_date = Column(String, index=True)

    #relationships
    playlists = relationship("Playlist", secondary="playlist_songs", back_populates="songs")
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="songs")

    #timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
