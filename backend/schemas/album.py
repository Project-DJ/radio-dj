"""Album schema for the API"""

from pydantic import BaseModel, Field

class Album(BaseModel):
    """Album schema for the API"""
    id: int = Field(..., description="The unique identifier of the album")
    title: str = Field(..., description="The title of the album")
    artist: str = Field(..., description="The artist of the album")