"""Song schema for the API"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class SongBase(BaseModel):
    """Song schema for the API"""
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = Field(None, description="The unique identifier of the song")
    title: str = Field(..., description="The title of the song")
    artist: str = Field(..., description="The artist of the song")
    album: str = Field(..., description="The album of the song")
    duration_ms: int = Field(..., description="The duration of the song in milliseconds")
    bpm: Optional[float] = Field(None, description="The BPM of the song")
    owner_id: int = Field(..., description="The ID of the user who owns the song")
