"""Playlist schema for the API"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class PlaylistBase(BaseModel):
    """Playlist schema for the API"""
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = Field(None, description="The unique identifier of the playlist")
    name: str = Field(..., description="The name of the playlist")
    description: str = Field(..., description="The description of the playlist")
    target_bpm: Optional[float] = Field(None, description="The target BPM for this playlist")
