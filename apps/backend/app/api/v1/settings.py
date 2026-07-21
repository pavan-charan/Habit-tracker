from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.settings import UserSettings
from app.models.user import User
from app.schemas.settings import SettingsRead, SettingsUpdate

router = APIRouter()


@router.get("", response_model=SettingsRead)
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserSettings).where(UserSettings.user_id == current_user.id))
    user_settings = result.scalar_one_or_none()

    if not user_settings:
        user_settings = UserSettings(user_id=current_user.id)
        db.add(user_settings)
        await db.commit()
        await db.refresh(user_settings)

    return user_settings


@router.put("", response_model=SettingsRead)
async def update_settings(
    settings_in: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserSettings).where(UserSettings.user_id == current_user.id))
    user_settings = result.scalar_one_or_none()

    if not user_settings:
        user_settings = UserSettings(user_id=current_user.id)
        db.add(user_settings)

    for field, value in settings_in.model_dump(exclude_unset=True).items():
        setattr(user_settings, field, value)

    await db.commit()
    await db.refresh(user_settings)
    return user_settings
