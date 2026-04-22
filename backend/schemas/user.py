"""User schema for the API"""

from pydantic import BaseModel, Field

class User(BaseModel):
    """User schema for the API"""
    id: int = Field(..., description="The unique identifier of the user")
    username: str = Field(..., description="The username of the user")
