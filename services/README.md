# 🌐 Frontend Service Layer Architecture

The `services/` directory is the single source of truth for all network communication between the React presentation layer and the Django backend API.

---

## 1. Service Catalog

```text
services/
├── aiService.ts              # LLM tutor interactions, LaTeX explanations, Socratic prompts
├── api.ts                    # Core Axios client instance with JWT interceptor & base URL
├── authService.ts            # Login, registration, token refresh, profile retrieval
├── battleService.ts          # Synchronous 1v1 battle arena room creation & submit
├── curriculumService.ts      # Ethiopian curriculum tree, subject chapters, lesson readers
├── discoveryService.ts       # University scholarship matcher, career tracks, departments
├── learningEngineService.ts  # FSRS memory rating submission & study planner queue
├── notificationService.ts    # User notifications, badge count, mark as read
├── offlineSync.ts            # IndexedDB offline event queue & automatic online flusher
├── parentService.ts          # Parent dashboard metrics, child diagnostics, alerts
├── paymentService.ts         # Digital payments: Chapa checkout & Telebirr integration
├── practiceService.ts        # Dynamic practice drill generator & answer submission
├── schoolService.ts          # Enterprise B2B: Roster, transfers, report cards, proctor, rollover
└── studentService.ts         # Student dashboard, mock exam history, notes generator
```

---

## 2. Core HTTP Client Architecture (`api.ts`)

```typescript
// Interceptor Pattern
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

* **JWT Injection**: Automatically attaches `Bearer <token>` from Zustand `authStore` to outgoing requests.
* **Proxy Routing**: Routes `/api/...` through the Vite proxy during local development to avoid CORS issues.
* **Error Normalization**: Intercepts 401 Unauthorized responses to trigger automatic logout and credential clearing.

---

## 3. Enterprise B2B Endpoint Contracts (`schoolService.ts`)

| Function | Endpoint | Payload / Params | Purpose |
| :--- | :--- | :--- | :--- |
| `getSchoolStudents` | `GET /api/school/students/` | `?assigned_only=boolean` | Fetches candidates scoped to teacher's classrooms or all school cohorts. |
| `transferStudent` | `POST /api/school/students/{id}/transfer/` | `{ target_grade, target_section }` | Reallocates candidate to another classroom section entity. |
| `getTerminalReportCard` | `GET /api/school/report-card/{id}/` | `studentId` | Retrieves MoE 2-semester continuous assessment marks & rank. |
| `saveReportCardRemarks` | `POST /api/school/report-card/{id}/remarks/` | `{ conduct_grade, remarks }` | Persists homeroom educator remarks and conduct evaluation. |
| `getActiveProctorSessions`| `GET /api/school/proctor/active-sessions/` | None | Returns active candidate test telemetry, countdowns & tab switches. |
| `performProctorAction` | `POST /api/school/proctor/session-action/` | `{ student_id, action, ... }` | Executes proctor commands (`add_time`, `pause`, `submit`, `flag`). |
| `rolloverAcademicYear` | `POST /api/school/academic-year/rollover/` | `{ new_academic_year, ... }` | Promotes cohorts, archives graduates to alumni, frees seats. |
| `expandSchoolLicense` | `POST /api/school/license/expand/` | `{ additional_seats, ... }` | Expands candidate license seats & generates invoice. |

---

## 4. Offline Resilience Architecture (`offlineSync.ts`)

When network connectivity is interrupted:
1. `offlineDB.ts` caches pending question reviews and study events into local browser IndexedDB.
2. `offlineSync.ts` registers a `window.addEventListener('online')` handler.
3. Upon network reconnection, queued reviews are dispatched sequentially with exponential backoff to ensure zero lost candidate study telemetry.
