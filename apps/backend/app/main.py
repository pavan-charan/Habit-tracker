from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import Base, engine
from app.core.middleware import setup_exception_handlers, setup_middleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup in development mode
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="PersonalOS - AI-Powered Personal Operating System (Phase 1 API)",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Setup CORS, Security Headers, Request Logging
setup_middleware(app)

# Setup Exception Handlers
setup_exception_handlers(app)

# Register Versioned API Routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["system"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
    }
