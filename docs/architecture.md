# 🏛️ Architecture Specification

This document provides the authoritative architectural blueprint for the Finkison web client.

---

## 1. System Overview

Finkison is a high-performance educational platform built for secondary education (Grades 9–12), national entrance examination prep (EUEE/ESSLCE), and school management.

### Technology Stack
- **Framework**: React 18.2 with TypeScript 5.3 (Strict Type Checking)
- **Build System**: Vite 5 with Rollup code-splitting & manual chunks
- **State Management**: Zustand 4.4 with local storage persistence
- **Routing**: React Router v6 with lazy-loaded route bundles and RBAC guards
- **Styling**: Vanilla CSS & Tailwind CSS 3.4 with custom academic design tokens
- **Internationalization**: `i18next` & `react-i18next` (English, Amharic, Afaan Oromoo)
- **Mathematics Rendering**: KaTeX / MathJax LaTeX formula rendering (`MathText.tsx`)
- **Test Runner**: Vitest 1.6 with JSDOM environment

---

## 2. Directory Topology

```text
Frontend/
├── App.tsx             # Root application shell, public routes, and suspense loader
├── main.tsx            # DOM mount point, theme, and query providers
├── components/         # Partitioned by role and domain
│   ├── auth/           # Onboarding and credentials
│   ├── landing/        # Public landing components (HeroCarousel, PricingSection)
│   ├── layouts/        # Role layout shells (StudentLayout, TeacherLayout, SchoolLayout, ParentLayout)
│   ├── navigation/     # AppShell, TopBar, Sidebar, Breadcrumbs, PublicNavbar
│   ├── parent/         # Guardian portal views
│   ├── school/         # School administration views
│   ├── science/        # Interactive STEM virtual labs
│   ├── shared/         # Essential shared UI (PageHeader, ErrorBoundary, MathText)
│   ├── student/        # Candidate learning and examination views
│   ├── teacher/        # Educator studio and evaluation views
│   ├── typography/     # SectionHeader, CardText, Meta
│   └── ui/             # Atomic design primitives (Button, Card, Input, Modal, Table, Toast)
├── docs/               # Standard engineering documentation
│   ├── architecture.md # This architecture specification
│   ├── design_system.md# Tokens, typography, colors, and accessibility
│   └── deployment.md   # Production builds, Docker, and Nginx edge delivery
├── hooks/              # Custom React hooks (useTheme, useScope)
├── pages/              # Standalone public route pages (Academics, AiFeatures, Schools, etc.)
├── routes/             # Role-based route bundles (StudentRoutes, TeacherRoutes, SchoolRoutes, ParentRoutes)
├── services/           # Typed API service clients
├── store/              # Zustand client stores (authStore, challengeStore, sessionStore, learningStore)
├── styles/             # Global CSS and design tokens
├── types/              # Domain TypeScript interfaces and types
└── utils/              # Pure utility functions (dateUtils, logger, localization)
```

---

## 3. Role-Based Access Control (RBAC)

The application enforces strict client-side role guardrails matching the backend security model:

```typescript
export type UserRole = "STUDENT" | "TEACHER" | "PRINCIPAL" | "PARENT" | "ADMIN" | "ALUMNI";
```

### Route Guard Matrix
| Role | Permitted Route Trees | Redirect Upon Access Violation |
| :--- | :--- | :--- |
| `STUDENT` | `/student/*`, `/challenges`, public routes | `/login` or `/student` |
| `TEACHER` | `/teacher/*`, `/school/assignments`, public routes | `/login` or `/teacher` |
| `PRINCIPAL` / `ADMIN` | `/school/*`, `/teacher/*`, public routes | `/login` or `/school` |
| `PARENT` | `/parent/*`, public routes | `/login` or `/parent` |

---

## 4. State Management Architecture

Zustand provides lightweight, boilerplate-free state management:

1. **`authStore.ts`**: Active JWT token, user profile, authenticated role, and school affiliation.
2. **`sessionStore.ts`**: Real-time examination session state, focus-loss anti-cheat telemetry, answers map, and countdown timers.
3. **`challengeStore.ts`**: Real-time peer quiz room matchmaking, live score counters, and round timers.
4. **`learningStore.ts`**: FSRS v4 active recall spaced-repetition queue and daily study streak counters.

---

## 5. Network & API Transport

All outbound network requests flow through the centralized Axios client (`services/api.ts`):
- Automatic `Authorization: Bearer <token>` header injection via request interceptors.
- Automatic 401 response handling and token refresh interceptors.
- Typed response unwrapping and unified error logging.
