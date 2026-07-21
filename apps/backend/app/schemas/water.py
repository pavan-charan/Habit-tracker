from datetime import datetime
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class WaterLogCreate(BaseModel):
    amount_ml: int = Field(ge=1, le=5000, description="Water amount in milliliters")
    logged_at: Optional[datetime] = None
    target_ml: Optional[int] = 3000


class WaterLogRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    amount_ml: int
    logged_at: datetime
    target_ml: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WaterSummary(BaseModel):
    date: str
    total_ml: int
    target_ml: int
    percentage: float
    log_count: int
