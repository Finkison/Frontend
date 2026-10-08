# 🧩 Frontend Components Architecture

Welcome to the Finkison Frontend Component Architecture guide. This document establishes structural conventions, design token rules, and component isolation patterns for all engineers contributing to the presentation layer.

---

## 1. Directory Topology

The `components/` directory is strictly partitioned by functional domain and role-based access boundaries:

```text
components/
├── auth/           # Authentication, role onboarding, credentials setup
├── layouts/        # Shell layouts per role (Student, School, Parent)
├── parent/         # Guardian dashboard, child diagnostics, teacher messaging
├── school/         # Enterprise B2B: Principal, School Admin & Teacher portals
├── shared/         # Reusable atomic & molecular UI components
└── student/        # Examination engine, AI tutor, learning tools, battle arena
```

---

## 2. Design Tokens & Visual Hierarchy

All components adhere to Finkison's Institutional Ethiopian Visual System:

* **Primary Corporate**: Imperial Navy (`#0F2744`, `bg-slate-900`) — Institutional credibility, header bars, and primary CTAs.
* **Secondary Brand**: Solomonic Gold (`#C9920A`, `amber-500`, `amber-400`) — Academic achievement, badges, and national exam honors.
* **Tertiary Semantic**: 
  * Forest Teal / Emerald (`emerald-600`) — Success, high mastery (>75%), positive proctoring status.
  * Crimson / Rose (`rose-600`) — At-risk candidates (<350 score), cheating flags, destructive actions.
  * Indigo / Violet (`indigo-600`) — Academic rollover wizard, AI suggestions, curriculum maps.
* **Typography**:
  * Headings: `font-serif` (Playfair / Merriweather aesthetic) for institutional and certificate headers.
  * Body: `font-sans` (Inter) for ultra-clear candidate legibility.
  * Technical / Numbers: `font-mono` for candidate roll numbers, session PINs, and scores.

---

## 3. Role-Based Component Isolation

| Subdirectory | Target Audience | Primary Capabilities |
| :--- | :--- | :--- |
| `components/school/` | Principals, Admins, Teachers | Classroom RBAC, Section transfers, MoE Report Cards, Live proctoring, Rollover wizard. |
| `components/student/` | Candidates (Grades 9–12) | National exam drills, focus-loss tracking, FSRS spaced review, AI tutor, Battle arena. |
| `components/parent/` | Guardians | Continuous assessment visibility, term rank inspection, attendance logs, educator direct chat. |
| `components/layouts/` | All authenticated users | Persistent navigation sidebars, breadcrumbs, notification bells, profile dropdowns. |
| `components/shared/` | Shared across all modules | MathText LaTeX renderer, Toast notifications, Modal frames, Skeleton loaders. |

---

## 4. Engineering Conventions for Team Members

1. **Strict TypeScript Typing**: No `any` for props. Every component must declare an explicit `interface Props` or `type Props`.
2. **Accessible Form Controls**: All inputs must feature explicit `label` elements, `aria-*` tags where applicable, and responsive focus rings (`focus:border-amber-500 outline-none`).
3. **Print Media Styles**: Any component generating physical documents (Report Cards, Credential Slips) must implement `@media print` rules:
   * Use Tailwind's `print:hidden` for modals, buttons, and navigation.
   * Use `print:border-solid print:bg-white` for print borders and backgrounds.
4. **Resilient Loading & Empty States**:
   * Wrap asynchronous queries with `SkeletonLoader` or spinners.
   * Provide informative empty states with descriptive helper text and recovery actions when arrays are empty.
