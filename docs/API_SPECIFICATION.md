# REST API Specification - PersonalOS (v1)

**Base URL**: `/api/v1`  
**Authentication Header**: `Authorization: Bearer <jwt_token>`  
**Content-Type**: `application/json`

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /auth/register`
Create a new user account.
- **Request Body**:
  ```json
  {
    "email": "user@personalos.dev",
    "password": "SecurePassword123!",
    "full_name": "Alex Vance"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "d9f8a1...",
    "token_type": "bearer",
    "user": {
      "id": "c1f7b0a8-3b9e-4a6f-8c1d-9e2f3a4b5c6d",
      "email": "user@personalos.dev",
      "role": "user",
      "full_name": "Alex Vance"
    }
  }
  ```

### `POST /auth/login`
Authenticate user and retrieve tokens.
- **Request Body**:
  ```json
  {
    "email": "user@personalos.dev",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK)**: Token object.

### `POST /auth/refresh`
Refresh access token.
- **Request Body**: `{"refresh_token": "..."}`
- **Response (200 OK)**: New access token.

---

## 2. Telemetry & Feature Endpoints

### Habits (`/api/v1/habits`)
- `GET /habits`: List user habits (`?archived=false`)
- `POST /habits`: Create new habit
- `GET /habits/{id}`: Fetch habit details
- `PUT /habits/{id}`: Update habit
- `DELETE /habits/{id}`: Soft delete habit
- `POST /habits/{id}/logs`: Log habit completion for date

### Sleep (`/api/v1/sleep`)
- `GET /sleep`: List sleep logs
- `POST /sleep`: Record sleep session (`sleep_start`, `sleep_end`, `quality_rating`, `notes`)
- `GET /sleep/stats`: Get sleep quality & duration averages

### Water (`/api/v1/water`)
- `GET /water/today`: Get current day hydration telemetry & target
- `POST /water`: Log hydration entry (`amount_ml`)
- `DELETE /water/{id}`: Remove log entry

### Journal (`/api/v1/journal`)
- `GET /journal`: List reflections (`?mood=happy&tag=focus`)
- `POST /journal`: Create entry (`title`, `content`, `mood`, `tags`)
- `PUT /journal/{id}`: Edit reflection entry
- `DELETE /journal/{id}`: Soft delete entry

### Goals (`/api/v1/goals`)
- `GET /goals`: List goals (`?status=in_progress`)
- `POST /goals`: Create goal (`title`, `target_date`, `category`)
- `POST /goals/{id}/progress`: Record progress delta (`progress_delta`, `notes`)
- `DELETE /goals/{id}`: Soft delete goal

### Stats & Dashboard (`/api/v1/stats`)
- `GET /stats/dashboard`: Aggregate life telemetry payload for current user

### Settings (`/api/v1/settings`)
- `GET /settings`: Fetch user settings
- `PUT /settings`: Update theme, timezone, units, notification preferences
