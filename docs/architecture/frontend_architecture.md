# 🏛️ Frontend Client Architecture & Offline-First Design

## 1. Overview
The Finkison Frontend client is a high-performance **Progressive Web App (PWA)** built with React 18, Vite 5, Tailwind CSS, and Zustand. It is specifically engineered to handle intermittent connectivity across Ethiopian regional networks through a multi-tier offline caching strategy.

---

## 2. Multi-Tier Offline Architecture
```text
┌────────────────────────────────────────────────────────┐
│                   React 18 UI Layer                    │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
       [Online: Direct API]      [Offline: Local Storage]
                │                        │
┌───────────────▼─────────┐    ┌─────────▼──────────────┐
│  Axios HTTP Service     │    │  IndexedDB (offlineDB) │
│  - JWT Bearer Injection │    │  - Queued Reviews      │
│  - API Versioning (/v1) │    │  - Queued Study Events │
└───────────────▲─────────┘    │  - Cached Lessons      │
                │              └─────────▲──────────────┘
                │                        │
┌───────────────▼────────────────────────▼──────────────┐
│        OfflineSyncService (Automatic Flusher)          │
│        - Listens to window 'online' event             │
│        - Flushes reviews with retry backoff           │
└───────────────────────────────────────────────────────┘
```

---

## 3. Cognitive Interface Components
1. **`SpacedReview.tsx`**: Active recall interface interacting with `learningStore.ts` and FSRS 4-tier ratings (`Again`, `Hard`, `Good`, `Easy`).
2. **`StudyPlanner.tsx`**: Daily study agenda with countdown to EUEE, score projection, and micro-task progress tracking.
3. **`KnowledgeMap.tsx`**: Prerequisite knowledge graph visualizer mapping concept dependencies across Grades 9–12.
4. **`PastPaperAnalyzer.tsx`**: 10-year EUEE question frequency analysis, speed-per-question target benchmarks, and university cutoff explorer.

---

## 4. Internationalization (i18n)
Managed by `react-i18next` with local fallback support:
- English: `i18n/en.json`
- Amharic: `i18n/am.json`
- Afaan Oromoo: `i18n/om.json`
Language selections persist across sessions in `localStorage`.
