from datetime import date, datetime
import uuid
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class GoalCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    category: str = "personal"
    target_date: Optional[date] = None
    progress_percentage: float = Field(default=0.0, ge=0.0, le=100.0)


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    target_date: Optional[date] = None
    status: Optional[str] = None
    progress_percentage: Optional[float] = None


class GoalProgressCreate(BaseModel):
    progress_delta: float
    notes: Optional[str] = None


class GoalProgressRead(BaseModel):
    id: uuid.UUID
    goal_id: uuid.UUID
    user_id: uuid.UUID
    progress_delta: float
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GoalRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    category: str
    target_date: Optional[date] = None
    status: str
    progress_percentage: float
    created_at: datetime
    updated_at: datetime
    progress_history: List[GoalProgressRead] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
