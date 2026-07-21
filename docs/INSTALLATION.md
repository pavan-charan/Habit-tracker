# Installation & Setup Guide - PersonalOS

This guide covers running **PersonalOS** locally via Docker Compose or manual development setup.

---

## Prerequisites

- **Docker & Docker Compose**: Docker Desktop 4.20+
- **Node.js**: v20+ and `npm` / `pnpm`
- **Python**: 3.11+ (for backend local development)
- **PostgreSQL**: 16 (if running backend outside Docker)

---

## 1. Quickstart with Docker Compose (Recommended)

Run the entire application stack (Frontend, Backend API, PostgreSQL, Redis) with one command:

```bash
# 1. Clone or navigate to project directory
cd todolist

# 2. Copy environment file
cp .env.example .env

# 3. Launch Docker Compose
docker-compose up -d --build

# 4. Access Services:
# Frontend Web App: http://localhost:3000
# Backend API & Swagger Docs: http://localhost:8000/docs
```

---

## 2. Local Manual Development Setup

### Backend (FastAPI) Setup

```bash
# Navigate to backend app
cd apps/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start FastAPI dev server
uvicorn app.main:app --reload --port 8000
```

### Frontend (Next.js 15) Setup

```bash
# Navigate to web app
cd apps/web

# Install dependencies
npm install

# Start Next.js dev server
npm run dev
# App will run at http://localhost:3000
```

---

## 3. Environment Variables Reference

See `.env.example` at root for the complete environment variables list.
Key variables:
- `DATABASE_URL`: `postgresql+asyncpg://personalos:personalos_secret_password@localhost:5432/personalos_db`
- `SECRET_KEY`: Minimum 32-character secret key for JWT signatures
- `NEXT_PUBLIC_API_URL`: `http://localhost:8000/api/v1`
