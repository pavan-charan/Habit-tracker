from datetime import datetime
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class ProfileRead(BaseModel):
    id: uuid.UUID
    full_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    timezone: str
    units_preference: dict
    theme: str
    language: str

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None
    units_preference: Optional[dict] = None
    theme: Optional[str] = None
    language: Optional[str] = None


class UserRead(BaseModel):
    id: uuid.UUID
    email: EmailStr
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    profile: Optional[ProfileRead] = None

    model_config = ConfigDict(from_attributes=True)
