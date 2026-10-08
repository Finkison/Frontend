# 👨‍👩‍👦 Parent & Guardian Oversight Components

This directory contains components providing parents and guardians with real-time academic transparency, attendance monitoring, and direct educator communication.

---

## 1. Directory Structure

```text
components/parent/
├── AlertsPanel.tsx       # Critical notifications: low scores (<50%), exam absences, fees
├── ChildDetailView.tsx   # Granular diagnostic performance profile for a specific student
├── ParentDashboard.tsx   # Multi-child overview cards, average scores, and school status
└── TeacherMessaging.tsx  # Direct two-way messaging channel with homeroom educators
```

---

## 2. Key Features

### 2.1 Multi-Child Oversight (`ParentDashboard.tsx`)
* Allows guardians with multiple enrolled children to switch between candidates effortlessly.
* Summarizes national exam target readiness, recent mock scores, and class attendance percentages.

### 2.2 Continuous Assessment Ledger (`ChildDetailView.tsx`)
* Displays the candidate's verified Ethiopian Ministry of Education assessment matrix:
  * Test 1 (10%), Midterm (20%), Assignment (10%), Final Exam (60%).
* Graphically visualizes subject-wise performance vs. class averages to identify areas needing private tutoring or study intervention.

### 2.3 Direct Educator Messaging (`TeacherMessaging.tsx`)
* Allows guardians to message homeroom teachers directly concerning candidate progress, behavior, or upcoming exam leave.
* Backed by `services/schoolService.ts` (`replySchoolMessage`, `getSchoolMessages`).
