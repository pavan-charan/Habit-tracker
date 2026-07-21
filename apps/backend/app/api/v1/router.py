from fastapi import APIRouter

from app.api.v1 import auth, goals, habits, journal, settings, sleep, stats, users, water

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(habits.router, prefix="/habits", tags=["habits"])
api_router.include_router(sleep.router, prefix="/sleep", tags=["sleep"])
api_router.include_router(water.router, prefix="/water", tags=["water"])
api_router.include_router(journal.router, prefix="/journal", tags=["journal"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
