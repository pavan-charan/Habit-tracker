import uuid
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.habit import Habit, HabitLog
    from app.models.journal import JournalEntry
    from app.models.water import WaterLog
    from app.models.sleep import SleepLog
    from app.models.goal import Goal, GoalProgress
    from app.models.settings import UserSettings
    from app.models.notification import Notification
    from app.models.audit import AuditLog


class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="user", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    profile: Mapped[Optional["Profile"]] = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    settings: Mapped[Optional["UserSettings"]] = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    habits: Mapped[List["Habit"]] = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    habit_logs: Mapped[List["HabitLog"]] = relationship("HabitLog", back_populates="user", cascade="all, delete-orphan")
    journal_entries: Mapped[List["JournalEntry"]] = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")
    water_logs: Mapped[List["WaterLog"]] = relationship("WaterLog", back_populates="user", cascade="all, delete-orphan")
    sleep_logs: Mapped[List["SleepLog"]] = relationship("SleepLog", back_populates="user", cascade="all, delete-orphan")
    goals: Mapped[List["Goal"]] = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    goal_progress: Mapped[List["GoalProgress"]] = relationship("GoalProgress", back_populates="user", cascade="all, delete-orphan")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    timezone: Mapped[str] = mapped_column(String(100), default="UTC", nullable=False)
    units_preference: Mapped[dict] = mapped_column(JSONB, default=lambda: {"system": "metric", "water": "ml"}, nullable=False)
    theme: Mapped[str] = mapped_column(String(50), default="dark", nullable=False)
    language: Mapped[str] = mapped_column(String(10), default="en", nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="profile")
