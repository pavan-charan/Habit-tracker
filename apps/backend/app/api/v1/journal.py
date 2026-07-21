from datetime import date
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.journal import JournalEntry
from app.models.user import User
from app.schemas.journal import JournalCreate, JournalRead, JournalUpdate

router = APIRouter()


@router.get("", response_model=List[JournalRead])
async def list_journal_entries(
    mood: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(JournalEntry).where(
        JournalEntry.user_id == current_user.id,
        JournalEntry.deleted_at.is_(None),
    )
    if mood:
        query = query.where(JournalEntry.mood == mood)

    query = query.order_by(JournalEntry.entry_date.desc(), JournalEntry.created_at.desc()).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=JournalRead, status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    entry_in: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entry_date = entry_in.entry_date or date.today()
    journal = JournalEntry(
        user_id=current_user.id,
        title=entry_in.title,
        content=entry_in.content,
        mood=entry_in.mood,
        tags=entry_in.tags,
        entry_date=entry_date,
    )
    db.add(journal)
    await db.commit()
    await db.refresh(journal)
    return journal


@router.get("/{entry_id}", response_model=JournalRead)
async def get_journal_entry(
    entry_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(JournalEntry).where(
            JournalEntry.id == entry_id,
            JournalEntry.user_id == current_user.id,
            JournalEntry.deleted_at.is_(None),
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return entry


@router.put("/{entry_id}", response_model=JournalRead)
async def update_journal_entry(
    entry_id: uuid.UUID,
    entry_in: JournalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(JournalEntry).where(
            JournalEntry.id == entry_id,
            JournalEntry.user_id == current_user.id,
            JournalEntry.deleted_at.is_(None),
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    for field, value in entry_in.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)

    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_entry(
    entry_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(JournalEntry).where(
            JournalEntry.id == entry_id,
            JournalEntry.user_id == current_user.id,
            JournalEntry.deleted_at.is_(None),
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    entry.soft_delete()
    await db.commit()
    return None
