# Wireframes & UX Blueprint - PersonalOS

PersonalOS uses a dark-first, obsidian glassmorphism visual language inspired by Apple, Linear, Raycast, and Vercel.

---

## 1. Master Application Layout Architecture

```
+-----------------------------------------------------------------------------------+
|  [Logo] PersonalOS   [Search Ctrl+K         ]  (Theme)  (Notifications)  (User Avatar)|
+------------------+----------------------------------------------------------------+
|                  |                                                                |
|  SIDEBAR         |  MAIN CONTENT AREA                                             |
|  - Dashboard     |  +----------------------------------------------------------+  |
|  - Journal       |  | Header Banner / Telemetry Greeting                       |  |
|  - Habits        |  +----------------------------------------------------------+  |
|  - Sleep         |                                                                |
|  - Water         |  +-------------+ +-------------+ +-------------+ +-------------+ |
|  - Goals         |  | Water Stat  | | Sleep Stat  | | Habits Stat | | Goals Stat  | |
|  - Settings      |  | 2,250 / 3000| | 7h 45m (88%)| | 5/6 Complete| | 4 Active    | |
|                  |  +-------------+ +-------------+ +-------------+ +-------------+ |
|  --------------- |                                                                |
|  [Collapse <]    |  +---------------------------+ +----------------------------+  |
|  [User Status]   |  | Weekly Hydration & Sleep  | | Active Habits & Checklist  |  |
|                  |  | [Chart Widget Visualizer] | | [x] Morning Hydration      |  |
|                  |  |                           | | [ ] Deep Work 90m         |  |
|                  |  +---------------------------+ +----------------------------+  |
|                  |                                                                |
|                  |  +----------------------------------------------------------+  |
|                  |  | Recent Reflection / Journal Feed Snippet                 |  |
|                  |  +----------------------------------------------------------+  |
+------------------+----------------------------------------------------------------+
```

---

## 2. Dashboard Stat Card Blueprint

```
+---------------------------------------------------------+
| (Icon) Water Hydration                     (Badge: 75%) |
|                                                         |
|  2,250 ml / 3,000 ml Goal                               |
|  [========================================.......]       |
|                                                         |
|  + Quick Log: [+250ml]  [+500ml]  [+ Custom Log]      |
+---------------------------------------------------------+
```

---

## 3. Habit Matrix & Grid Blueprint

```
+-----------------------------------------------------------------------------------+
| Habits Tracker                                       [ + Create New Habit ]       |
+-----------------------------------------------------------------------------------+
| HABIT NAME          FREQUENCY   STREAK   MON   TUE   WED   THU   FRI   SAT   SUN  |
+-----------------------------------------------------------------------------------+
| Morning Hydration   Daily       14 Days  [X]   [X]   [X]   [X]   [X]   [ ]   [ ]  |
| 90m Deep Coding     Weekdays    5 Days   [X]   [X]   [X]   [X]   [X]   [-]   [-]  |
| Read 20 Pages       Daily       8 Days   [X]   [X]   [X]   [X]   [ ]   [ ]   [ ]  |
| Evening Meditation  Daily       21 Days  [X]   [X]   [X]   [X]   [X]   [X]   [X]  |
+-----------------------------------------------------------------------------------+
```

---

## 4. Dark Glassmorphism Design Tokens

- **Background Canvas**: `#090a0f` (Deep Obsidian)
- **Glass Panel Surface**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(16px)`
- **Glass Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Glass Glow Accent**: `0 0 20px rgba(139, 92, 246, 0.15)` (Violet subtle ambient highlight)
- **Primary Text**: `#f8fafc` (Slate 50)
- **Secondary Text**: `#94a3b8` (Slate 400)
- **Accent Palette**:
  - Cyan (Water): `#06b6d4`
  - Violet (Journal/Sleep): `#8b5cf6`
  - Emerald (Habits): `#10b981`
  - Amber (Goals): `#f59e0b`
