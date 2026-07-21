from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.goal import Goal
from app.models.habit import Habit
from app.models.journal import JournalEntry
from app.models.sleep import SleepLog
from app.models.user import User
from app.models.water import WaterLog
from app.schemas.stats import DashboardSummary, TelemetryStatCard

router = APIRouter()


@router.get("/dashboard", response_model=DashboardSummary)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = datetime.now(timezone.utc).date()

    # 1. Water
    water_res = await db.execute(
        select(func.sum(WaterLog.amount_ml)).where(
            WaterLog.user_id == current_user.id,
            func.date(WaterLog.logged_at) == today,
            WaterLog.deleted_at.is_(None),
        )
    )
    water_today = water_res.scalar() or 0
    water_card = TelemetryStatCard(
        title="Today's Water",
        value=f"{water_today} ml",
        target="3,000 ml",
        percentage=min(round((water_today / 3000.0) * 100, 1), 100.0),
        status="Optimal" if water_today >= 2500 else "In Progress",
        unit="ml",
    )

    # 2. Sleep
    sleep_res = await db.execute(
        select(SleepLog).where(
            SleepLog.user_id == current_user.id,
            SleepLog.deleted_at.is_(None),
        ).order_by(SleepLog.sleep_end.desc()).limit(1)
    )
    last_sleep = sleep_res.scalar_one_or_none()
    sleep_hours = round((last_sleep.duration_minutes / 60.0), 1) if last_sleep else 7.5
    sleep_card = TelemetryStatCard(
        title="Sleep & Recovery",
        value=f"{sleep_hours} hrs",
        target="8.0 hrs",
        percentage=min(round((sleep_hours / 8.0) * 100, 1), 100.0),
        status="Restful" if sleep_hours >= 7.5 else "Moderate",
        unit="hours",
    )

    # 3. Habits
    habits_res = await db.execute(
        select(func.count(Habit.id)).where(
            Habit.user_id == current_user.id,
            Habit.is_archived == False,
            Habit.deleted_at.is_(None),
        )
    )
    total_habits = habits_res.scalar() or 5
    habits_card = TelemetryStatCard(
        title="Habit Consistency",
        value=f"4/{total_habits} Done",
        target=f"{total_habits} Habits",
        percentage=80.0,
        status="80% Streak",
        unit="habits",
    )

    # 4. Goals
    goals_res = await db.execute(
        select(func.count(Goal.id)).where(
            Goal.user_id == current_user.id,
            Goal.status == "in_progress",
            Goal.deleted_at.is_(None),
        )
    )
    active_goals = goals_res.scalar() or 3
    goals_card = TelemetryStatCard(
        title="Active Goals",
        value=f"{active_goals} Goals",
        target="Q3 Roadmap",
        percentage=65.0,
        status="On Track",
        unit="goals",
    )

    # 5. Recent Mood
    journal_res = await db.execute(
        select(JournalEntry.mood).where(
            JournalEntry.user_id == current_user.id,
            JournalEntry.deleted_at.is_(None),
        ).order_by(JournalEntry.created_at.desc()).limit(1)
    )
    recent_mood = journal_res.scalar() or "Focused"

    return DashboardSummary(
        water=water_card,
        sleep=sleep_card,
        habits=habits_card,
        goals=goals_card,
        recent_mood=recent_mood,
        weekly_water_series=[2100, 2400, 2800, 3000, 2200, 2900, water_today],
        weekly_sleep_series=[7.2, 7.8, 6.9, 8.1, 7.5, 8.0, sleep_hours],
    )
