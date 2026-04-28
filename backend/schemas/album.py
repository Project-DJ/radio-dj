"""Album schema for the API"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class Album(BaseModel):
    """Album schema for the API"""
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = Field(None, description="The unique identifier of the album")
    title: str = Field(..., description="The title of the album")
    artist: str = Field(..., description="The artist of the album")
    genre: Optional[str] = Field(None, description="The genre of the album")
    year: Optional[int] = Field(None, description="The release year of the album")
    cover: Optional[str] = Field(None, description="An emoji or URL for the album cover")
