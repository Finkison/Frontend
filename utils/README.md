# 🛠️ Frontend Utilities & Shared Helpers

This directory contains standalone, pure utility functions and client storage adapters.

---

## 1. Utility Modules

```text
utils/
├── dateHelpers.ts    # Date formatting, Ethiopian/Gregorian calendar reconciliation
├── localization.ts  # Regional language formatting, number formatting, Amharic numerals
└── offlineDB.ts      # IndexedDB storage adapter for local offline resilience
```

---

## 2. Technical Specifications

### 2.1 IndexedDB Offline Adapter (`offlineDB.ts`)
* Uses browser-native `indexedDB` with object stores:
  * `offline_reviews`: Queued FSRS card reviews.
  * `offline_sessions`: In-progress exam answer sheets.
  * `cached_curriculum`: Offline chapters and revision guides.
* Exposes transactional CRUD methods: `saveOfflineAttempt()`, `getPendingSyncQueue()`, `clearSyncedAttempts()`.

### 2.2 Date & Calendar Helpers (`dateHelpers.ts`)
* Formats ISO dates into human-readable exam countdown strings (e.g., *"142 days until ESSLCE"*).
* Bridges conversions between the Gregorian calendar and the Ethiopian Calendar (E.C.).

### 2.3 Localization Helper (`localization.ts`)
* Provides localized currency string formatters (e.g., `14,000 ETB`).
* Handles RTL/LTR text direction and language preference detection.
