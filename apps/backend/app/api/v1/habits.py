import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.habit import Habit, HabitLog
from app.models.user import User
from app.schemas.habit import HabitCreate, HabitLogCreate, HabitLogRead, HabitRead, HabitUpdate

router = APIRouter()


@router.get("", response_model=List[HabitRead])
async def list_habits(
    archived: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Habit).where(
        Habit.user_id == current_user.id,
        Habit.is_archived == archived,
        Habit.deleted_at.is_(None),
    ).order_by(Habit.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=HabitRead, status_code=status.HTTP_201_CREATED)
async def create_habit(
    habit_in: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    habit = Habit(user_id=current_user.id, **habit_in.model_dump())
    db.add(habit)
    await db.commit()
    await db.refresh(habit)
    return habit


@router.get("/{habit_id}", response_model=HabitRead)
async def get_habit(
    habit_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Habit).where(
            Habit.id == habit_id,
            Habit.user_id == current_user.id,
            Habit.deleted_at.is_(None),
        )
    )
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.put("/{habit_id}", response_model=HabitRead)
async def update_habit(
    habit_id: uuid.UUID,
    habit_in: HabitUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Habit).where(
            Habit.id == habit_id,
            Habit.user_id == current_user.id,
            Habit.deleted_at.is_(None),
        )
    )
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    for field, value in habit_in.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)

    await db.commit()
    await db.refresh(habit)
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Habit).where(
            Habit.id == habit_id,
            Habit.user_id == current_user.id,
            Habit.deleted_at.is_(None),
        )
    )
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    habit.soft_delete()
    await db.commit()
    return None


@router.post("/{habit_id}/log", response_model=HabitLogRead)
async def log_habit(
    habit_id: uuid.UUID,
    log_in: HabitLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Habit).where(
            Habit.id == habit_id,
            Habit.user_id == current_user.id,
            Habit.deleted_at.is_(None),
        )
    )
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    habit_log = HabitLog(
        habit_id=habit.id,
        user_id=current_user.id,
        **log_in.model_dump(),
    )
    db.add(habit_log)
    await db.commit()
    await db.refresh(habit_log)
    return habit_log
