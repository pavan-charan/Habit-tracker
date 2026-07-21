from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.sleep import SleepLog
from app.models.user import User
from app.schemas.sleep import SleepLogCreate, SleepLogRead, SleepStats

router = APIRouter()


@router.get("", response_model=List[SleepLogRead])
async def list_sleep_logs(
    limit: int = 30,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(SleepLog).where(
        SleepLog.user_id == current_user.id,
        SleepLog.deleted_at.is_(None),
    ).order_by(SleepLog.sleep_end.desc()).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=SleepLogRead, status_code=status.HTTP_201_CREATED)
async def create_sleep_log(
    log_in: SleepLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    duration_minutes = int((log_in.sleep_end - log_in.sleep_start).total_seconds() / 60)
    if duration_minutes <= 0:
        raise HTTPException(status_code=400, detail="sleep_end must be after sleep_start")

    sleep_log = SleepLog(
        user_id=current_user.id,
        duration_minutes=duration_minutes,
        **log_in.model_dump(),
    )
    db.add(sleep_log)
    await db.commit()
    await db.refresh(sleep_log)
    return sleep_log


@router.get("/stats", response_model=SleepStats)
async def get_sleep_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(
            func.count(SleepLog.id),
            func.avg(SleepLog.duration_minutes),
            func.avg(SleepLog.quality_rating),
        ).where(SleepLog.user_id == current_user.id, SleepLog.deleted_at.is_(None))
    )
    count, avg_duration, avg_quality = result.one()
    avg_hours = round((avg_duration or 0) / 60.0, 1)
    avg_qual = round(float(avg_quality or 0), 1)

    return SleepStats(
        average_duration_hours=avg_hours,
        average_quality=avg_qual,
        total_logs=count or 0,
    )
