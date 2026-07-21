from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.water import WaterLog
from app.schemas.water import WaterLogCreate, WaterLogRead, WaterSummary

router = APIRouter()


@router.get("/today", response_model=WaterSummary)
async def get_today_water(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = datetime.now(timezone.utc).date()
    result = await db.execute(
        select(func.sum(WaterLog.amount_ml), func.count(WaterLog.id)).where(
            WaterLog.user_id == current_user.id,
            func.date(WaterLog.logged_at) == today,
            WaterLog.deleted_at.is_(None),
        )
    )
    total_ml, log_count = result.one()
    total = total_ml or 0
    target = 3000
    percentage = min(round((total / target) * 100.0, 1), 100.0)

    return WaterSummary(
        date=str(today),
        total_ml=total,
        target_ml=target,
        percentage=percentage,
        log_count=log_count or 0,
    )


@router.post("", response_model=WaterLogRead, status_code=status.HTTP_201_CREATED)
async def log_water(
    log_in: WaterLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    logged_at = log_in.logged_at or datetime.now(timezone.utc)
    water_log = WaterLog(
        user_id=current_user.id,
        amount_ml=log_in.amount_ml,
        logged_at=logged_at,
        target_ml=log_in.target_ml or 3000,
    )
    db.add(water_log)
    await db.commit()
    await db.refresh(water_log)
    return water_log


@router.get("", response_model=List[WaterLogRead])
async def list_water_logs(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(WaterLog).where(
        WaterLog.user_id == current_user.id,
        WaterLog.deleted_at.is_(None),
    ).order_by(WaterLog.logged_at.desc()).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()
