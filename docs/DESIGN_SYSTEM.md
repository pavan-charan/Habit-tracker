# Design System & Component Inventory - PersonalOS

PersonalOS uses a custom dark glassmorphism design system built on **Tailwind CSS**, **Framer Motion**, and **shadcn/ui** patterns.

---

## 1. Design Tokens & Palette

### Dark Obsidian Theme Variables
- `--bg-canvas`: `hsl(230, 25%, 5%)` (`#090a0f`)
- `--bg-surface`: `rgba(255, 255, 255, 0.03)`
- `--bg-surface-hover`: `rgba(255, 255, 255, 0.06)`
- `--border-glass`: `rgba(255, 255, 255, 0.08)`
- `--border-glass-glow`: `rgba(139, 92, 246, 0.3)`

### Telemetry Domain Colors
- **Water / Hydration**: Cyan (`#06b6d4`, `hsl(188, 94%, 43%)`)
- **Sleep & Recovery**: Violet (`#8b5cf6`, `hsl(258, 90%, 66%)`)
- **Habits**: Emerald (`#10b981`, `hsl(158, 64%, 52%)`)
- **Goals & Milestones**: Amber (`#f59e0b`, `hsl(38, 92%, 50%)`)
- **Journal & Mood**: Rose (`#f43f5e`, `hsl(351, 89%, 60%)`)

---

## 2. Component Inventory

| Category | Component Name | Description & Usage |
|---|---|---|
| **Layout** | `Sidebar` | Collapsible sidebar navigation with active indicator & user status |
| | `Header` | Top header with search bar, notifications, and profile menu |
| | `MainLayout` | Glassmorphic page wrapper with responsive container grid |
| **Primitives** | `Button` | Glass variant, primary gradient variant, outline variant |
| | `Card` | Glass card with subtle border glow and Framer Motion hover |
| | `StatCard` | Telemetry indicator card with progress delta & sparkline/ring |
| | `Input` | Dark glass input field with icon support & error states |
| | `Dialog / Modal` | Accessible backdrop-blur dialog overlay for actions |
| | `Table` | Modern dark data table with hover highlighting |
| | `Tabs` | Segmented pill tab switcher |
| **Feedback** | `Skeleton` | Shimmer animated skeleton loader for data cards |
| | `EmptyState` | Descriptive empty state visual with icon & CTA button |
| | `ErrorState` | Error fallback component with retry trigger |
| **Telemetry** | `HydrationRing` | Animated SVG radial progress indicator |
| | `HabitGrid` | Multi-day habit check-in consistency matrix |
| | `QualityRating` | Interactive 5-star / icon score selector |
| | `TelemetryChart` | Custom dark-first chart widget for sleep & water trends |
