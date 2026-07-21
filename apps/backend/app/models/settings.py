import uuid
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    theme: Mapped[str] = mapped_column(String(50), default="dark", nullable=False)
    timezone: Mapped[str] = mapped_column(String(100), default="UTC", nullable=False)
    unit_system: Mapped[str] = mapped_column(String(50), default="metric", nullable=False)
    language: Mapped[str] = mapped_column(String(10), default="en", nullable=False)
    notification_prefs: Mapped[dict] = mapped_column(
        JSONB,
        default=lambda: {"email_summary": True, "habit_reminders": True, "water_reminders": True},
        nullable=False,
    )
    privacy_prefs: Mapped[dict] = mapped_column(
        JSONB,
        default=lambda: {"public_profile": False, "telemetry_sharing": False},
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="settings")
