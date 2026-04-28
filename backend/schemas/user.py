"""User schema for the API"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class UserBase(BaseModel):
    """User schema for the API"""
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = Field(None, description="The unique identifier of the user")
    username: str = Field(..., description="The username of the user")
    email: str = Field(..., description="The email of the user")
    password_hash: str = Field(..., description="The hashed password of the user")
