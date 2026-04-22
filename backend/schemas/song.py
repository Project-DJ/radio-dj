"""Song schema for the API"""

from pydantic import BaseModel, Field

class Song(BaseModel):
    """Song schema for the API"""
    id: int = Field(..., description="The unique identifier of the song")
    title: str = Field(..., description="The title of the song")
    artist: str = Field(..., description="The artist of the song")
    album: str = Field(..., description="The album of the song")
    duration: int = Field(..., description="The duration of the song in seconds")
    user_id: int = Field(..., description="The ID of the user who owns the song")