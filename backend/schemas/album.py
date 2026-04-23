"""Album schema for the API"""

from pydantic import BaseModel, ConfigDict, Field

class Album(BaseModel):
    """Album schema for the API"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int = Field(..., description="The unique identifier of the album")
    title: str = Field(..., description="The title of the album")
    artist: str = Field(..., description="The artist of the album")