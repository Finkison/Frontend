# 🏷️ TypeScript Type System & Data Contracts

The `types/` directory defines the strict TypeScript contracts governing the frontend codebase, API response envelopes, and domain models.

---

## 1. Type Declarations Map

```text
types/
├── api.ts          # Generic ApiResponse<T>, pagination, and error payload structures
├── auth.ts         # User, Role (STUDENT, TEACHER, PRINCIPAL, PARENT, ADMIN), AuthState
├── battle.ts       # BattleRoom, Participant, ChallengeQuestion, BattleStatus
├── curriculum.ts   # Subject, Chapter, Unit, LearningObjective, ConceptNode
├── exam.ts         # Question, Choice, ExamSession, SectionScore, QuestionAttempt
├── index.ts        # Barrel export uniting common domain models
├── payment.ts      # Transaction, Invoice, PaymentMethod (Telebirr, CBE, Chapa)
└── student.ts      # StudentProfile, StudyPlan, PredictedScore, WeakAreaMetric
```

---

## 2. Core Domain Contracts

### 2.1 Role Hierarchy & Permissions (`auth.ts`)
```typescript
export type UserRole = "STUDENT" | "TEACHER" | "PRINCIPAL" | "PARENT" | "ADMIN" | "ALUMNI";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  school_id?: string;
  school_name?: string;
  grade?: string;
  section?: string;
  avatar?: string;
}
```

### 2.2 Terminal Continuous Assessment Report Card Contract
```typescript
export interface SubjectReportEntry {
  subject: string;
  test1_score: number;      // 10%
  midterm_score: number;    // 20%
  assignment_score: number; // 10%
  final_score: number;      // 60%
  sem1_total: number;       // 100%
  sem2_total: number;       // 100%
  annual_average: number;   // Average of sem1 & sem2
  letter_grade: string;     // A+, A, B, C, D, F
  class_average: number;
}
```

---

## 3. Engineering Guidelines

1. **Zero Runtime Impact**: Keep files inside `types/` strictly pure TypeScript type definitions and interfaces. Do not declare runtime implementations here.
2. **Backend Mirroring**: When modifying Django models or Ninja schemas in `Backend/`, immediately update the corresponding TypeScript interface in `Frontend/types/` to maintain 100% type safety.
