# 🏛️ Finkison Master Frontend Architecture & Engineering Blueprint

This document represents the authoritative, enterprise-grade architectural blueprint for the Finkison web client. It is required reading for all frontend engineers, tech leads, and QA specialists working on the platform.

---

## 1. Executive System Overview

Finkison is a mission-critical, enterprise B2B and B2C EdTech platform built for Ethiopian secondary education (Grades 9–12), national entrance examination prep (ESSLCE), and school management. 

### Technology Stack
* **Framework**: React 18.2 with TypeScript 5.3 (Strict Type Checking)
* **Build System**: Vite 5 with Rollup code-splitting & manual chunks
* **State Management**: Zustand 4.4 with local storage persistence
* **Routing**: React Router v6 with declarative ProtectedRoute wrappers
* **Styling**: Vanilla CSS & Tailwind CSS 3.4 with custom Ethiopian institutional palette
* **Internationalization**: `i18next` & `react-i18next` (English, Amharic, Afaan Oromoo)
* **Mathematics Rendering**: KaTeX / MathJax through `MathText.tsx`
* **Test Runner**: Vitest 1.6 with JSDOM environment

---

## 2. Multi-Tier Client Topology

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                            │
│  [Student Portal]      [School B2B Suite]      [Guardian Oversight]    │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
                    ▼                               ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│     Global State (Zustand)           │  │     Client Persistence       │
│  - authStore (JWT / Role / User)     │  │  - localStorage (Auth token) │
│  - sessionStore (Exam telemetry)     │  │  - indexedDB (offlineDB)     │
│  - learningStore (FSRS flashcards)   │  │  - CacheStorage (PWA SW)     │
└───────────────────┬──────────────────┘  └──────────────▲───────────────┘
                    │                                    │
                    ▼                                    │
┌────────────────────────────────────────────────────────┴───────────────┐
│                     Network & Sync Abstraction                         │
│  - api.ts (Axios + JWT Bearer Injection + 401 Interceptors)            │
│  - offlineSync.ts (Background sync queue with exponential retry)       │
└───────────────────┬────────────────────────────────────────────────────┘
                    │
                    ▼
          [Django Ninja REST API] (http://127.0.0.1:8000/api/)
```

---

## 3. Role-Based Access Control (RBAC) Architecture

The application enforces strict client-side role guardrails matching the backend security model:

```typescript
export type UserRole = "STUDENT" | "TEACHER" | "PRINCIPAL" | "PARENT" | "ADMIN" | "ALUMNI";
```

### Route Guard Matrix
| Role | Permitted Route Trees | Redirect Upon Access Violation |
| :--- | :--- | :--- |
| `STUDENT` | `/student/*` | `/login` |
| `TEACHER` | `/school/*` (Scoped to assigned classes) | `/login` |
| `PRINCIPAL` | `/school/*` (Full institutional governance) | `/login` |
| `ADMIN` | `/school/*` (Full system configuration) | `/login` |
| `PARENT` | `/parent/*` | `/login` |
| `ALUMNI` | Read-only profile / historical transcripts | `/login` |

### Multi-Tenant Institutional Scoping
Teachers and school administrators operate within a multi-tenant institutional isolation boundary:
1. `assigned_only` flag filters candidate rosters strictly to educator-assigned sections.
2. Section transfer requests trigger transactional reallocation between `Classroom` entities.
3. Candidate seat license meters track enrolled students vs. purchased capacity.

---

## 4. Ethiopian MoE Continuous Assessment Standard

Finkison implements the official **Ethiopian Ministry of Education (MoE) 2-Semester Continuous Assessment Standard**:

$$\text{Semester Score} = \text{Test 1 (10\%)} + \text{Midterm (20\%)} + \text{Assignment (10\%)} + \text{Final Exam (60\%)} = 100\%$$

$$\text{Annual Average} = \frac{\text{Semester 1 Total} + \text{Semester 2 Total}}{2}$$

### Grading Scale Matrix
* $90\% - 100\% \implies \mathbf{A^+}$ (Outstanding Mastery)
* $85\% - 89\% \implies \mathbf{A}$ (Exemplary)
* $75\% - 84\% \implies \mathbf{B}$ (Proficient)
* $60\% - 74\% \implies \mathbf{C}$ (Satisfactory)
* $50\% - 59\% \implies \mathbf{D}$ (Marginal Pass)
* $< 50\% \implies \mathbf{F}$ (Academic Probation / Failure)

---

## 5. Live Examination Proctoring Engine

The live proctor console (`/school/proctor`) operates on a resilient heartbeat telemetry protocol:

```text
Student Browser                         Proctor Console (Educator)
      │                                             │
      ├───── Exam Started (Timer Running) ─────────►│
      │                                             │
      ├───── Focus Loss / Tab Switch Detected ─────►│ (Increments Violation Count)
      │                                             │
      │◄──── Remote Command: +10 Min Extra Time ────┤
      │                                             │
      │◄──── Remote Command: Freeze / Pause ────────┤
      │                                             │
      │◄──── Remote Command: Force Submit ──────────┤
```

---

## 6. Offline-First Resilience (IndexedDB & Service Worker)

To support students facing intermittent power or internet access in Ethiopian regional areas:
1. **Service Worker (`public/sw.js`)**: Caches static assets, HTML shells, and fonts.
2. **IndexedDB (`offlineDB.ts`)**: Caches in-progress question attempts and FSRS reviews.
3. **Sync Daemon (`offlineSync.ts`)**: Flushes offline queues automatically when `navigator.onLine` fires, ensuring candidate study progress is never lost.

---

## 7. Performance & Code Splitting Benchmarks

* **Vite Rollup Manual Chunks**:
  * `vendor-react`: React, React DOM, React Router.
  * `vendor-icons`: Lucide React SVG icon tree.
  * `vendor-utils`: Axios, Zustand, i18next.
* **Gzip Target**: Main vendor bundle under 60 kB gzipped; initial page load under 1.2s on 3G connections.

---

## 8. Development & Contribution Standards

1. Run `npm test` before submitting pull requests.
2. Run `npm run build` to verify zero TypeScript compilation issues.
3. Keep business logic in `services/` and domain types in `types/`.
