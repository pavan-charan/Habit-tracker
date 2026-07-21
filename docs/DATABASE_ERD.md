# Database ER Diagram & Data Dictionary - PersonalOS

PersonalOS uses **PostgreSQL 16** with **UUID v4 primary keys**, soft deletes (`deleted_at`), enterprise audit logging, and foreign key indexing across all entities.

---

## 1. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o| PROFILES : "has"
    USERS ||--o| SETTINGS : "configures"
    USERS ||--o{ HABITS : "tracks"
    HABITS ||--o{ HABIT_LOGS : "logs"
    USERS ||--o{ JOURNAL_ENTRIES : "writes"
    USERS ||--o{ WATER_LOGS : "logs"
    USERS ||--o{ SLEEP_LOGS : "records"
    USERS ||--o{ GOALS : "sets"
    GOALS ||--o{ GOAL_PROGRESS : "tracks"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "generates"

    USERS {
        uuid id PK
        string email UK
        string hashed_password
        string role
        boolean is_active
        boolean is_verified
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    PROFILES {
        uuid id PK
        uuid user_id FK
        string full_name
        string avatar_url
        text bio
        string timezone
        jsonb units_preference
        string theme
        string language
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    HABITS {
        uuid id PK
        uuid user_id FK
        string title
        text description
        string category
        string frequency
        string color
        string icon
        integer target_count
        boolean is_archived
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    HABIT_LOGS {
        uuid id PK
        uuid habit_id FK
        uuid user_id FK
        timestamp completed_at
        string status
        integer count
        text notes
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    JOURNAL_ENTRIES {
        uuid id PK
        uuid user_id FK
        string title
        text content
        string mood
        jsonb tags
        date entry_date
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    WATER_LOGS {
        uuid id PK
        uuid user_id FK
        integer amount_ml
        timestamp logged_at
        integer target_ml
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    SLEEP_LOGS {
        uuid id PK
        uuid user_id FK
        timestamp sleep_start
        timestamp sleep_end
        integer duration_minutes
        integer quality_rating
        text notes
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    GOALS {
        uuid id PK
        uuid user_id FK
        string title
        text description
        string category
        date target_date
        string status
        float progress_percentage
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    GOAL_PROGRESS {
        uuid id PK
        uuid goal_id FK
        uuid user_id FK
        float progress_delta
        text notes
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    SETTINGS {
        uuid id PK
        uuid user_id FK
        string theme
        string timezone
        string unit_system
        string language
        jsonb notification_prefs
        jsonb privacy_prefs
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string title
        text message
        string type
        boolean is_read
        timestamp read_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string entity_type
        uuid entity_id
        string ip_address
        string user_agent
        jsonb details
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
```

---

## 2. Global Column Conventions

All 12 tables implement standardized tracking fields:

- `id`: `UUID` (v4 generated via PostgreSQL `gen_random_uuid()` or Python `uuid4()`). Primary Key.
- `created_at`: `TIMESTAMPTZ` default `NOW()`. Indexed.
- `updated_at`: `TIMESTAMPTZ` default `NOW()`, auto-updated on record mutation.
- `deleted_at`: `TIMESTAMPTZ`, NULLABLE. Used for soft delete filtering (`WHERE deleted_at IS NULL`). Indexed.
