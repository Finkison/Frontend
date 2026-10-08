# 📄 Frontend Routing & Page Architecture

This directory defines top-level route views, role-scoped route bundles, and application entry points.

---

## 1. Directory Structure

```text
pages/
├── AboutPage.tsx      # Platform overview, pedagogical mission, national exam vision
├── AcademicsPage.tsx  # Curriculum framework explorer (Natural & Social sciences)
├── LandingPage.tsx    # High-converting landing page with Solomonic branding
├── LoginPage.tsx      # Dual-mode authentication (Phone/PIN or Email/Password)
├── NotFoundPage.tsx   # Institutional 404 error page with navigation fallbacks
├── ParentRoutes.tsx   # Protected route bundle for /parent/*
├── RegisterPage.tsx   # Multi-tier registration (Candidate, School, Guardian)
├── SchoolRoutes.tsx   # Protected route bundle for /school/*
├── StudentRoutes.tsx  # Protected route bundle for /student/*
└── TeamPage.tsx       # Leadership & engineering team credits
```

---

## 2. Role-Based Routing Architecture

Routing is managed by **React Router v6**. Entry routing is partitioned in `App.tsx` and delegates to role-specific route managers:

```text
[Incoming Request]
        │
        ├── /login, /register, /, /about ───► Public Pages
        │
        └── /student/*, /school/*, /parent/*
                │
                ▼
        [ProtectedRoute] ──── Check isAuthenticated & role
                │
                ├── /student/* ──► <StudentLayout> ──► <StudentRoutes />
                ├── /school/*  ──► <SchoolLayout>  ──► <SchoolRoutes />
                └── /parent/*  ──► <ParentLayout>  ──► <ParentRoutes />
```

---

## 3. Route Inventory by Role

### 3.1 School Institutional Routes (`SchoolRoutes.tsx`)
* `/school/dashboard`: Executive overview, national percentile, seat capacity meter.
* `/school/students`: Candidate enrollment roster, section transfer modal, credential slips.
* `/school/proctor`: Real-time exam proctoring console with remote candidate controls.
* `/school/settings`: Seat licensing expansion and Academic Year Rollover Wizard.
* `/school/classes/:grade/:section`: Classroom section diagnostic roster.
* `/school/reports`: Grade export and PDF/CSV generation.

### 3.2 Student Routes (`StudentRoutes.tsx`)
* `/student/dashboard`: Daily study agenda, predicted scores, streak status.
* `/student/exam/:examId`: Full-screen timed national entrance mock exam simulator.
* `/student/practice`: Custom practice mode with instant explanations.
* `/student/review`: FSRS active recall flashcard review.
* `/student/battle`: Real-time 1v1 battle arena.
* `/student/planner`: Personalized national exam countdown and study calendar.
* `/student/knowledge-map`: Curriculum prerequisite graph visualizer.
* `/student/past-papers`: 10-year national exam question frequency analysis.

### 3.3 Parent Routes (`ParentRoutes.tsx`)
* `/parent/dashboard`: Multi-child continuous assessment cards and school links.
* `/parent/child/:studentId`: Deep-dive subject performance and attendance ledger.
* `/parent/alerts`: Low grade (<50%), absenteeism, and disciplinary flags.
* `/parent/messages`: Direct messaging with homeroom teachers.
