"""Playlist schema for the API"""

from pydantic import BaseModel, ConfigDict, Field

class PlaylistBase(BaseModel):
    """Playlist schema for the API"""
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="The unique identifier of the playlist")
    name: str = Field(..., description="The name of the playlist")
    description: str = Field(..., description="The description of the playlist")
