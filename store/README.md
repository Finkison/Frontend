# 📦 Frontend State Management Architecture (Zustand)

Finkison uses **Zustand** for client-side state management. It provides lightweight, boilerplate-free, and hook-friendly state without the complexity of Redux or context re-render thrashing.

---

## 1. Store Inventory

```text
store/
├── authStore.ts      # Authentication tokens, user profile, and role state
├── battleStore.ts    # 1v1 battle arena matchmaking, score counters, opponent state
├── learningStore.ts  # FSRS memory rating state, study streak, and daily flashcards
└── sessionStore.ts   # Active mock/practice exam session, answer map, and timer
```

---

## 2. Store Specifications

### 2.1 Authentication Store (`authStore.ts`)
* **State Managed**:
  * `token`: Bearer JWT token string.
  * `user`: Authenticated user entity (name, role, grade, school).
  * `role`: User role (`STUDENT`, `TEACHER`, `PRINCIPAL`, `PARENT`, `ADMIN`).
  * `isAuthenticated`: Boolean authorization status.
* **Persistence**:
  * Uses Zustand `persist` middleware backed by `localStorage` under key `finkison_auth_storage`.
* **Actions**:
  * `login(user, token)`: Hydrates state, persists token, sets up Axios defaults.
  * `logout()`: Clears tokens, flushes cache, and resets application routing.
  * `switchRole(role)`: Allows dual-role demonstration testing.

### 2.2 Examination Session Store (`sessionStore.ts`)
* **State Managed**:
  * `sessionId`: Active examination run identifier.
  * `examTitle`: Title of current paper (e.g. *National Entrance Mock 2024*).
  * `questions`: List of exam questions with options, passages, and difficulty.
  * `currentIndex`: Active question zero-indexed pointer.
  * `answers`: Map of `Record<questionId, selectedOptionId>`.
  * `flaggedQuestions`: Set of question IDs marked for later review.
  * `timeRemaining`: Countdown timer in seconds.
  * `tabSwitchCount`: Anti-cheat violation tally.
* **Actions**:
  * `selectAnswer(questionId, optionId)`: Records answer and triggers background auto-save.
  * `toggleFlag(questionId)`: Toggles review bookmark.
  * `incrementTabSwitch()`: Records focus loss and signals anti-cheat logger.
  * `resetSession()`: Purges active session upon final submission.

### 2.3 Cognitive Learning Store (`learningStore.ts`)
* **State Managed**:
  * `dueCards`: Flashcards scheduled for review today via FSRS.
  * `currentCardIndex`: Active card pointer.
  * `dailyStreak`: Consecutive days of candidate practice.
  * `xpPoints`: Gamified reward points earned.
* **Actions**:
  * `rateCard(cardId, rating)`: Submits FSRS rating (1=Again, 2=Hard, 3=Good, 4=Easy), recalculates stability $S$ and retrievability $R$.

---

## 3. Best Practices for Engineers

1. **Selective Subscriptions**:
   * Always subscribe to atomic slices rather than the entire store to prevent unnecessary component re-renders:
     ```typescript
     // ✅ Recommended
     const role = useAuthStore((state) => state.role);

     // ❌ Avoid
     const { role } = useAuthStore();
     ```
2. **Side-Effect Isolation**:
   * API calls should live inside `services/`. Stores should only handle state mutation and local caching.
