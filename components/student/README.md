# 🎓 Student Examination & Cognitive Mastery Components

This directory houses the candidate learning runtime, timed national entrance examination simulator, AI tutor drawer, and gamified study tools.

---

## 1. Component Map

```text
components/student/
├── AITutorChat.tsx           # Contextual AI tutor drawer with LaTeX step-by-step math solver
├── Achievements.tsx          # Badges, study streaks, and ESSLCE milestone tracker
├── BattleArena.tsx           # Real-time peer-to-peer 1v1 question combat arena
├── Dashboard.tsx             # Candidate home: daily study tasks, predicted scores, recent mocks
├── DepartmentsExplorer.tsx   # University stream selector (Natural vs Social) & faculty requirements
├── ExamHistory.tsx           # Historical exam logs, detailed review sheets, and question review
├── ExamSession.tsx           # Full-screen national examination simulator with anti-cheat telemetry
├── FormulaSheetModal.tsx     # Quick reference formula sheet for Physics, Chemistry & Math
├── KnowledgeMap.tsx          # Interactive curriculum knowledge graph across Grades 9–12
├── Leaderboard.tsx           # National, regional, and school rank tables
├── LessonReader.tsx          # Textbook reader with interactive comprehension checkpoints
├── NationalExamsHub.tsx      # National examination repository (2010–2024 E.C. past papers)
├── NotesGenerator.tsx        # Automated AI summary note generation & export
├── PastPaperAnalyzer.tsx     # Question frequency heatmap and high-yield topic benchmarks
├── PracticeSetup.tsx         # Configurable practice mode (custom subject, unit, difficulty)
├── Profile.tsx               # Candidate profile, target university, target score configuration
├── ScorePredictor.tsx        # Machine learning national entrance score projection engine
├── SessionResults.tsx        # Detailed test results, subject breakdown, and AI recommendations
├── SettingsPage.tsx          # Account settings, notification preferences, and password change
├── SpacedReview.tsx          # FSRS v4 active recall flashcards with 4-tier confidence rating
└── WeakAreaDashboard.tsx     # Target weak-area drills with automatic remediation suggestions
```

---

## 2. Key Architecture Patterns

### 2.1 Examination Session & Focus Telemetry (`ExamSession.tsx`)
* **State Management**:
  * Backed by `store/sessionStore.ts` storing active question index, chosen answers map, marked-for-review set, and timer seconds.
* **Integrity Telemetry**:
  * Window event listener tracks `visibilitychange` and `blur` events.
  * Every tab-switch triggers a focus loss counter and sends telemetry to the backend proctoring endpoint.
* **Offline Fallback**:
  * Saves candidate answers to IndexedDB (`offlineDB`) every 5 seconds to prevent data loss in the event of power or network drops.

### 2.2 FSRS Spaced Repetition Engine (`SpacedReview.tsx`)
* **4-Tier Feedback Loop**:
  * Candidates grade recalled concepts as `Again` ($r=1$), `Hard` ($r=2$), `Good` ($r=3$), or `Easy` ($r=4$).
  * Feeds into the backend Free Spaced Repetition Scheduler (FSRS) to calculate optimal next review intervals.

### 2.3 Contextual AI Tutor Assistant (`AITutorChat.tsx`)
* **Pedagogical Safeguards**:
  * Uses Socratic scaffolding rather than immediately giving away answers.
  * Embeds `MathText.tsx` for LaTeX math rendering ($e^{i\pi} + 1 = 0$) and structured chemical formula equations.

### 2.4 Synchronous 1v1 Battle Arena (`BattleArena.tsx`)
* **Real-Time Matchmaking**:
  * Candidates challenge peers to live 5-question speed drills.
  * Syncs countdowns, tracks live opponent scores, and awards XP rewards upon completion.
