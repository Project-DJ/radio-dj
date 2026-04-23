"""User schema for the API"""

from pydantic import BaseModel, ConfigDict, Field

class User(BaseModel):
    """User schema for the API"""
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="The unique identifier of the user")
    username: str = Field(..., description="The username of the user")
