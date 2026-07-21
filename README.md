# PersonalOS — Your AI-Powered Personal Operating System

> **Phase 1: Production-Ready Modular Foundation**

PersonalOS is an all-in-one life telemetry system integrating health, productivity, learning, finance, habits, goal management, daily reflections, and personal analytics. Inspired by Apple, Linear, Raycast, Vercel, and Notion, it features a modern, dark-first obsidian glassmorphism aesthetic built for speed, elegance, and future AI plugin scalability.

---

## 🌟 Key Highlights (Phase 1)

- **Modular Monorepo Architecture**: Clean separation between `apps/web` (Next.js 15), `apps/backend` (FastAPI), `packages/ui`, and `packages/types`.
- **Async Telemetry Backend**: FastAPI service using SQLAlchemy 2.0 Async, Pydantic v2 schemas, Alembic migrations, and JWT Authentication with Role-Based Access Control.
- **Glassmorphism UI Engine**: Dark-first default palette, Framer Motion micro-interactions, custom interactive charts, and reusable component primitives.
- **Full Domain Tracking**: Hydration tracking, sleep telemetry, habit consistency matrices, journal reflections with mood tagging, OKR goal roadmaps, and account preferences.
- **Enterprise Data Architecture**: All database models utilize UUID primary keys, automatic `created_at`/`updated_at`, soft deletes (`deleted_at`), and structured audit logging.
- **One-Command Docker Deployment**: Ready to launch in seconds via `docker-compose up -d --build`.

---

## 🛠️ Technology Stack

| Layer | Tech |
|---|---|
| **Frontend App** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion |
| **State & Fetching** | TanStack Query v5, React Hook Form, Zod validation |
| **Backend Service** | FastAPI, Python 3.11+, Pydantic v2, PyJWT, Passlib |
| **Database & Cache** | PostgreSQL 16 (SQLAlchemy 2.0 Async), Redis 7, Alembic |
| **Infrastructure** | Docker, Docker Compose |

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs) directory:

- [Product Requirements Document (PRD)](./docs/PRD.md)
- [User Flows & Journeys](./docs/USER_FLOWS.md)
- [Wireframes & UX Blueprint](./docs/WIREFRAMES.md)
- [Database ER Diagram & Data Dictionary](./docs/DATABASE_ERD.md)
- [REST API Specification](./docs/API_SPECIFICATION.md)
- [Monorepo Folder Structure Guide](./docs/FOLDER_STRUCTURE.md)
- [Design System & Component Inventory](./docs/DESIGN_SYSTEM.md)
- [Installation & Setup Guide](./docs/INSTALLATION.md)

---

## 🚀 Quickstart

Run with Docker Compose:

```bash
cp .env.example .env
docker-compose up -d --build
```

Access the frontend at `http://localhost:3000` and API documentation at `http://localhost:8000/docs`.

---

## 📄 License

MIT © PersonalOS Team
