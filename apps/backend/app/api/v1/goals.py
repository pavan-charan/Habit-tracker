import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.goal import Goal, GoalProgress
from app.models.user import User
from app.schemas.goal import (
    GoalCreate,
    GoalProgressCreate,
    GoalProgressRead,
    GoalRead,
    GoalUpdate,
)

router = APIRouter()


@router.get("", response_model=List[GoalRead])
async def list_goals(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Goal).options(selectinload(Goal.progress_history)).where(
        Goal.user_id == current_user.id,
        Goal.deleted_at.is_(None),
    )
    if status_filter:
        query = query.where(Goal.status == status_filter)

    query = query.order_by(Goal.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal_in: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    goal = Goal(user_id=current_user.id, **goal_in.model_dump())
    db.add(goal)
    await db.commit()
    await db.refresh(goal)
    return goal


@router.get("/{goal_id}", response_model=GoalRead)
async def get_goal(
    goal_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Goal).options(selectinload(Goal.progress_history)).where(
            Goal.id == goal_id,
            Goal.user_id == current_user.id,
            Goal.deleted_at.is_(None),
        )
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.put("/{goal_id}", response_model=GoalRead)
async def update_goal(
    goal_id: uuid.UUID,
    goal_in: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Goal).options(selectinload(Goal.progress_history)).where(
            Goal.id == goal_id,
            Goal.user_id == current_user.id,
            Goal.deleted_at.is_(None),
        )
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    for field, value in goal_in.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)

    await db.commit()
    await db.refresh(goal)
    return goal


@router.post("/{goal_id}/progress", response_model=GoalProgressRead)
async def log_goal_progress(
    goal_id: uuid.UUID,
    progress_in: GoalProgressCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Goal).where(
            Goal.id == goal_id,
            Goal.user_id == current_user.id,
            Goal.deleted_at.is_(None),
        )
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.progress_percentage = min(max(goal.progress_percentage + progress_in.progress_delta, 0.0), 100.0)
    if goal.progress_percentage >= 100.0:
        goal.status = "completed"

    progress_log = GoalProgress(
        goal_id=goal.id,
        user_id=current_user.id,
        progress_delta=progress_in.progress_delta,
        notes=progress_in.notes,
    )
    db.add(progress_log)
    await db.commit()
    await db.refresh(progress_log)
    return progress_log


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Goal).where(
            Goal.id == goal_id,
            Goal.user_id == current_user.id,
            Goal.deleted_at.is_(None),
        )
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.soft_delete()
    await db.commit()
    return None
