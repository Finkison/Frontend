# 🏫 School & B2B Institutional Governance Components

This directory contains enterprise-grade B2B institutional components tailored for Ethiopian secondary school administrators (`PRINCIPAL`, `ADMIN`) and educators (`TEACHER`, `HOMEROOM EDUCATOR`).

---

## 1. Key Component Blueprint

```text
components/school/
├── ClassView.tsx               # Section roster diagnostics, grade distribution, subject benchmarks
├── LiveProctorConsole.tsx      # Real-time candidate exam telemetry and remote intervention
├── ReportsExport.tsx           # CSV & institutional grade matrix export engine
├── SchoolDashboard.tsx         # Executive metrics: national percentile, at-risk candidates, capacity
├── SchoolSettings.tsx          # Seat licensing (Telebirr/CBE) & Academic Year Rollover Wizard
├── StudentTable.tsx            # Candidate roster, section transfer modal & printable credential slips
├── TeacherPortal.tsx           # Teacher workspace: curriculum units, homework, and assignment authoring
└── TerminalReportCardModal.tsx # Ethiopian Ministry of Education Terminal Report Card (10/20/10/60)
```

---

## 2. Deep Dive: Core Enterprise Capabilities

### 2.1 Section Isolation & Teacher RBAC (`StudentTable.tsx`)
* **"My Classes" vs "All Cohorts" Toggle**:
  * Educators can toggle `assignedOnly` state which appends `?assigned_only=true` to `/api/school/students/`.
  * Isolates candidate rosters strictly to classes bound in `TeacherProfile.assigned_classrooms`.
* **Candidate Section Transfer Modal**:
  * Facilitates transferring candidates between grade tiers and section letters (e.g., Grade 12 Section A to C).
  * Automatically coordinates with backend `POST /api/school/students/{id}/transfer/` to re-assign or create `Classroom` entities.

### 2.2 Ethiopian MoE Terminal Report Card (`TerminalReportCardModal.tsx`)
* **National Continuous Assessment Standard**:
  * Adheres strictly to Ethiopian secondary curriculum guidelines:
    $$\text{Semester Total} = \text{Test 1 (10\%)} + \text{Midterm (20\%)} + \text{Assignment (10\%)} + \text{Final Exam (60\%)} = 100\%$$
  * Computes Semester 1 & 2 averages, annual composite, and Ethiopian letter grades ($A^+, A, B, C, D, F$).
  * Class section ranking (e.g., Rank 4 of 48) and promotion status.
* **Conduct & Pedagogical Evaluation**:
  * Conduct grading (`A (Exemplary)`, `B`, `C`), days present/absent out of 180 academic calendar days.
  * Teacher remarks editable and syncable via `POST /api/school/report-card/{id}/remarks/`.
* **Print Ready Layout**:
  * Styled with Ethiopian coat-of-arms header, Solomonic Gold borders, official school seal stamp placeholder, and Principal signature block formatted for standard A4 paper printing.

### 2.3 Real-Time Exam Proctoring Console (`LiveProctorConsole.tsx`)
* **Telemetry Monitoring**:
  * Polling heartbeat (`/api/school/proctor/active-sessions/`) monitoring active exam takers.
  * Telemetry tracks current question index, countdown timer, tab-switch violations, and focus loss events.
* **Remote Proctor Interventions**:
  * `add_time`: Remotely grants +10 minutes to candidate exam clock.
  * `pause` / `resume`: Freezes candidate timer and user interface during disciplinary reviews.
  * `force_submit`: Automatically terminates and calculates score for compromised sessions.
  * `flag_cheating`: Marks session with high-contrast integrity alerts.

### 2.4 Academic Year Rollover & Cohort Archival Wizard (`SchoolSettings.tsx`)
* **Cohort Promotion Pipeline**:
  * Automatically advances continuing student tiers (Grade 9 $\rightarrow$ 10 $\rightarrow$ 11 $\rightarrow$ 12).
* **Graduation & Alumni Archival**:
  * Permanently transitions Grade 12 candidates to `ALUMNI` records, releasing occupied seat licenses back to the school pool.
* **Security Guardrail**:
  * High-impact execution modal protected by two-factor text confirmation (`CONFIRM ROLLOVER`).

---

## 3. Communication & Service Layer Integration

All components in this directory interface directly with:
* `services/schoolService.ts`: B2B API bindings with typed error handling and toast notifications.
* `store/authStore.ts`: Role-based privilege checks (`isPrincipalOrAdmin`, `isTeacher`).
