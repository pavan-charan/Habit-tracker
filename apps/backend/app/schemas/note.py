from datetime import datetime
import uuid
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str
    tags: Optional[List[str]] = Field(default_factory=list)


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None


class NoteRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    content: str
    tags: List[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
