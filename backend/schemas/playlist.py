"""Playlist schema for the API"""

from pydantic import BaseModel, Field

class Playlist(BaseModel):
    """Playlist schema for the API"""
    id: int = Field(..., description="The unique identifier of the playlist")
    name: str = Field(..., description="The name of the playlist")
    description: str = Field(..., description="The description of the playlist")
    user_id: int = Field(..., description="The ID of the user who owns the playlist")