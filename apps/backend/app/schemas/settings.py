import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict


class SettingsRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    theme: str
    timezone: str
    unit_system: str
    language: str
    notification_prefs: dict
    privacy_prefs: dict

    model_config = ConfigDict(from_attributes=True)


class SettingsUpdate(BaseModel):
    theme: Optional[str] = None
    timezone: Optional[str] = None
    unit_system: Optional[str] = None
    language: Optional[str] = None
    notification_prefs: Optional[dict] = None
    privacy_prefs: Optional[dict] = None
