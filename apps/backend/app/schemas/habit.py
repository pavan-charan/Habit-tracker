from datetime import datetime
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class HabitCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    category: str = "health"
    frequency: str = "daily"
    color: str = "#10b981"
    icon: str = "check-circle"
    target_count: int = Field(default=1, ge=1)


class HabitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    target_count: Optional[int] = None
    is_archived: Optional[bool] = None


class HabitLogCreate(BaseModel):
    completed_at: datetime
    status: str = "completed"
    count: int = 1
    notes: Optional[str] = None


class HabitLogRead(BaseModel):
    id: uuid.UUID
    habit_id: uuid.UUID
    user_id: uuid.UUID
    completed_at: datetime
    status: str
    count: int
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HabitRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    category: str
    frequency: str
    color: str
    icon: str
    target_count: int
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
