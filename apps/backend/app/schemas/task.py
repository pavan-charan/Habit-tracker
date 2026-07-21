from datetime import date, datetime
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: str = Field(default="medium")
    category: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    category: Optional[str] = None


class TaskRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    is_completed: bool
    due_date: Optional[date] = None
    priority: str
    category: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
