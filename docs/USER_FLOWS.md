# User Flows & Journeys - PersonalOS

## 1. Authentication & Onboarding Flow

```mermaid
graph TD
    A[Unauthenticated Visitor] --> B{Choose Action}
    B -->|Click Register| C[Registration Form]
    B -->|Click Login| D[Login Form]
    
    C -->|Submit Credentials| E[Zod Client Validation]
    E -->|Valid| F[FastAPI POST /auth/register]
    F -->|Success| G[Receive JWT Tokens]
    
    D -->|Submit Credentials| H[FastAPI POST /auth/login]
    H -->|Success| G
    
    G --> I[Store Tokens in Secure Storage / HTTP Cookie]
    I --> J[Redirect to /dashboard]
    J --> K[Authenticated PersonalOS Environment]
```

---

## 2. Daily Life Telemetry Flow (Hydration, Sleep, Habits)

```mermaid
graph TD
    A[Dashboard Overview] --> B{Select Quick Action}
    
    B -->|Log Water| C[Quick Water Dialog (+250ml / Custom)]
    C --> D[POST /api/v1/water]
    D --> E[Update Hydration Ring & Dashboard Stats]
    
    B -->|Check Habit| F[Toggle Habit Checkbox]
    F --> G[POST /api/v1/habits/{id}/log]
    G --> H[Update Streak Counter & Consistency Matrix]
    
    B -->|Log Sleep| I[Sleep Quality Modal]
    I --> J[POST /api/v1/sleep]
    J --> K[Update Sleep Telemetry Card]
```

---

## 3. Reflection & Knowledge Capture Flow (Journal)

```mermaid
graph TD
    A[Navigate to /journal] --> B[View Timeline & Mood History]
    B --> C[Click 'New Journal Entry']
    C --> D[Enter Title, Content, Select Mood & Tags]
    D --> E[Zod Form Validation]
    E -->|Valid| F[POST /api/v1/journal]
    F --> G[Revalidate Journal Cache via React Query]
    G --> H[Render Updated Timeline Entry with Glassmorphic Card]
```

---

## 4. Goal & Milestone Tracking Flow

```mermaid
graph TD
    A[Navigate to /goals] --> B[View Goal Roadmap & Progress Bars]
    B --> C[Click Goal Card]
    C --> D[Open Goal Detail Modal]
    D --> E[Add Progress Update Delta e.g. +10%]
    E --> F[POST /api/v1/goals/{id}/progress]
    F --> G[Recalculate Goal Progress & Update Status to 'In Progress' or 'Completed']
```

---

## 5. Settings & Profile Preferences Flow

```mermaid
graph TD
    A[Click Header User Avatar] --> B[Select Settings]
    B --> C[Navigate to /settings]
    C --> D{Select Settings Tab}
    D -->|Profile| E[Update Name, Bio, Timezone]
    D -->|Preferences| F[Change Unit System Metric/Imperial & Theme]
    D -->|Notifications| G[Toggle Email / System Notification preferences]
    E & F & G --> H[PUT /api/v1/settings]
    H --> I[Update Context State & Toast Confirmation]
```
