import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter()


@router.get("", response_model=List[TaskRead])
async def list_tasks(
    is_completed: Optional[bool] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Task).where(
        Task.user_id == current_user.id,
        Task.deleted_at.is_(None),
    )
    if is_completed is not None:
        query = query.where(Task.is_completed == is_completed)
    if priority:
        query = query.where(Task.priority == priority)
    if category:
        query = query.where(Task.category == category)

    query = query.order_by(Task.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task = Task(user_id=current_user.id, **task_in.model_dump())
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.id,
            Task.deleted_at.is_(None),
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: uuid.UUID,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.id,
            Task.deleted_at.is_(None),
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    updates = task_in.model_dump(exclude_unset=True)
    # Set completed_at timestamp when task is completed
    if updates.get("is_completed") is True and not task.is_completed:
        updates["completed_at"] = datetime.now(timezone.utc)
    elif updates.get("is_completed") is False:
        updates["completed_at"] = None

    for field, value in updates.items():
        setattr(task, field, value)

    await db.commit()
    await db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.id,
            Task.deleted_at.is_(None),
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.soft_delete()
    await db.commit()
    return None
