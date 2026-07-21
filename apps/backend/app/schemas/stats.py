from typing import List, Optional
from pydantic import BaseModel


class TelemetryStatCard(BaseModel):
    title: str
    value: str
    target: Optional[str] = None
    percentage: float
    status: str
    unit: str


class DashboardSummary(BaseModel):
    water: TelemetryStatCard
    sleep: TelemetryStatCard
    habits: TelemetryStatCard
    goals: TelemetryStatCard
    recent_mood: str
    weekly_water_series: List[int]
    weekly_sleep_series: List[float]
