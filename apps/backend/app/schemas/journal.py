from datetime import date, datetime
import uuid
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class JournalCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)
    mood: str = "neutral"
    tags: List[str] = Field(default_factory=list)
    entry_date: Optional[date] = None


class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    tags: Optional[List[str]] = None


class JournalRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    content: str
    mood: str
    tags: List[str]
    entry_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
