# Monorepo Folder Structure - PersonalOS

```
todolist/
├── apps/
│   ├── backend/                    # FastAPI Microservice
│   │   ├── alembic/                # DB Migrations
│   │   │   ├── versions/
│   │   │   └── env.py
│   │   ├── app/
│   │   │   ├── api/                # API Versioning
│   │   │   │   └── v1/             # Endpoint Routers
│   │   │   │       ├── auth.py
│   │   │   │       ├── habits.py
│   │   │   │       ├── sleep.py
│   │   │   │       ├── water.py
│   │   │   │       ├── journal.py
│   │   │   │       ├── goals.py
│   │   │   │       ├── settings.py
│   │   │   │       └── stats.py
│   │   │   ├── core/               # System Core Modules
│   │   │   │   ├── config.py       # Pydantic Settings
│   │   │   │   ├── database.py     # SQLAlchemy Async Engine & Session
│   │   │   │   ├── security.py     # JWT & Password Hashing
│   │   │   │   └── middleware.py   # CORS & Exception Handlers
│   │   │   ├── crud/               # Query Layer
│   │   │   ├── models/             # SQLAlchemy 2.0 Models
│   │   │   ├── schemas/            # Pydantic v2 Schemas
│   │   │   └── main.py             # FastAPI App Factory
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   └── web/                        # Next.js 15 Frontend
│       ├── public/                 # Static Assets
│       ├── src/
│       │   ├── app/                # App Router Routes
│       │   │   ├── (auth)/         # Auth Group (/login, /register)
│       │   │   ├── (dashboard)/    # Dashboard Shell & Features
│       │   │   │   ├── dashboard/
│       │   │   │   ├── habits/
│       │   │   │   ├── journal/
│       │   │   │   ├── sleep/
│       │   │   │   ├── water/
│       │   │   │   ├── goals/
│       │   │   │   └── settings/
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/         # Shared UI Primitives
│       │   │   ├── ui/             # Glassmorphism & Core Components
│       │   │   ├── layout/         # Sidebar, Header, User Menu
│       │   │   └── charts/         # Modern Telemetry Visualizers
│       │   ├── features/           # Independent Feature Modules
│       │   ├── hooks/              # Custom React Hooks
│       │   ├── lib/                # API Client, Utils, Zod Schemas
│       │   ├── styles/             # Tailwind & CSS Variables
│       │   └── types/              # TypeScript Models
│       ├── Dockerfile
│       └── package.json
│
├── packages/                       # Shared Monorepo Packages
│   ├── ui/                         # Shared UI Token Exports
│   ├── types/                      # Shared Entity & DTO Specs
│   └── config/                     # Shared ESLint/Tailwind Presets
│
├── docker/
│   └── docker-compose.yml          # Container Orchestration
│
├── docs/                           # Documentation Suite
│   ├── PRD.md
│   ├── USER_FLOWS.md
│   ├── WIREFRAMES.md
│   ├── DATABASE_ERD.md
│   ├── API_SPECIFICATION.md
│   ├── FOLDER_STRUCTURE.md
│   ├── DESIGN_SYSTEM.md
│   └── INSTALLATION.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
