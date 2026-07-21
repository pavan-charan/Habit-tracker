from datetime import datetime
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class SleepLogCreate(BaseModel):
    sleep_start: datetime
    sleep_end: datetime
    quality_rating: int = Field(ge=1, le=5, default=3)
    notes: Optional[str] = None


class SleepLogRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    sleep_start: datetime
    sleep_end: datetime
    duration_minutes: int
    quality_rating: int
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SleepStats(BaseModel):
    average_duration_hours: float
    average_quality: float
    total_logs: int
