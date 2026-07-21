import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteCreate, NoteRead, NoteUpdate

router = APIRouter()


@router.get("", response_model=List[NoteRead])
async def list_notes(
    tag: Optional[str] = Query(None, description="Filter by tag"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Note).where(
        Note.user_id == current_user.id,
        Note.deleted_at.is_(None),
    )
    if tag:
        query = query.where(Note.tags.any(tag))
    if search:
        query = query.where(
            Note.title.ilike(f"%{search}%") | Note.content.ilike(f"%{search}%")
        )

    query = query.order_by(Note.updated_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_in: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = note_in.model_dump()
    if data.get("tags") is None:
        data["tags"] = []
    note = Note(user_id=current_user.id, **data)
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note


@router.get("/{note_id}", response_model=NoteRead)
async def get_note(
    note_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Note).where(
            Note.id == note_id,
            Note.user_id == current_user.id,
            Note.deleted_at.is_(None),
        )
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/{note_id}", response_model=NoteRead)
async def update_note(
    note_id: uuid.UUID,
    note_in: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Note).where(
            Note.id == note_id,
            Note.user_id == current_user.id,
            Note.deleted_at.is_(None),
        )
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    for field, value in note_in.model_dump(exclude_unset=True).items():
        setattr(note, field, value)

    await db.commit()
    await db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Note).where(
            Note.id == note_id,
            Note.user_id == current_user.id,
            Note.deleted_at.is_(None),
        )
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    note.soft_delete()
    await db.commit()
    return None
