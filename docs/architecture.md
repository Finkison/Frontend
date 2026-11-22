# Frontend architecture

This document records the current Finkison web client structure and the conventions for adding features.

## Runtime

- React 18, TypeScript, Vite, and React Router
- Zustand for in-memory authentication state and persisted, non-authoritative profile display data
- Axios through `services/api.ts` for API requests, bearer-token attachment, access-token refresh, and common error messages
- Tailwind CSS with shared styles and components
- i18next resources in `i18n/` for English, Amharic, and Afaan Oromoo

The shared API client reads `VITE_API_BASE_URL` and normalizes it to `/api/v1`. Its default `/api` works with the same-origin proxy, and values already ending in `/v1` are preserved. API requests use the versioned routes; the streaming AI request shares the same token refresh behavior.

## Main directories

```text
Frontend/
├── App.tsx             # Public shell and route composition
├── components/         # Shared and role-specific UI
├── pages/              # Public and account-entry pages
├── routes/             # Protected student, parent, teacher, and school route trees
├── services/           # API clients and domain requests
├── store/              # Zustand stores
├── hooks/              # Shared React hooks
├── context/            # React context providers
├── i18n/               # Locale dictionaries and setup
├── styles/             # Global styles and design tokens
├── types/              # Shared TypeScript types
├── utils/               # Formatting and other pure helpers
└── docs/               # Frontend engineering documentation
```

Components are grouped by shared UI or product role (`student`, `teacher`, `school`, and `parent`). Public pages such as the landing, pricing, schools, teachers, students, and families pages live under `pages/`.

## Authentication and authorization

`store/authStore.ts` holds the current client session. The short-lived access token stays in memory, while the rotating refresh token is held in an HttpOnly, SameSite cookie scoped to the auth API. `services/api.ts` sends credentials for refresh and attaches the access token to protected requests; streaming requests use its authenticated fetch helper. At startup, the app refreshes the session and loads `/auth/me` before enabling protected routes. A one-time migration accepts a legacy localStorage refresh token, rotates it into the cookie, and removes the browser-readable copy. Logout revokes the current access token and clears the cookie.

`ProtectedRoute` and route role lists control client navigation only. They do not secure data; every protected operation must also enforce role and tenant authorization in the backend. Do not derive a user's permissions from a client-editable role selector.

## Naming and feature conventions

- React components and pages use `PascalCase.tsx`.
- Hooks use `useName.ts` and begin with `use`.
- API clients use descriptive domain names such as `studentService.ts`; keep HTTP behavior in the shared API client.
- Keep shared primitives in `components/ui/` and role-specific workflows in the matching role directory.
- Use descriptive route names and visible labels. Keep route aliases only for compatibility and redirect them to one canonical destination.
- `components/navigation/navigationConfig.ts` is the canonical portal navigation source. `constants/navigationManifest.ts` only adapts that configuration for existing consumers; portal access role lists live in `constants/routes.ts`.
- Add UI copy to locale dictionaries instead of hardcoding new user-visible strings in multiple components.

## Known architecture work

1. The API currently supports versioned and unversioned routes; frontend services use `/api/v1`. Keep backend aliases until external client usage has been checked and a deprecation date is published.
2. Client route guards are a usability layer and must remain aligned with backend authorization without being treated as a security control.
3. Keep API response types close to the service functions so pages do not need to infer multiple unrelated response shapes.
4. Maintain locale entries for new navigation and product language, and use font coverage that supports all shipped scripts.
5. Scholarship discovery, university-program directories, technology tracks, and related application workflows have been removed from the current product scope.
6. Teacher past-paper workflows can save mapped questions with an optional private PDF, and provide school-scoped file downloads. Automatic document extraction and OCR are not available. Grade 12 student past-paper attempts use persisted practice sessions, server-side scoring, and localized answer review. The server restricts submitted answers to the questions assigned to that session and requires a complete answer set before completion.
7. Frontend Nginx now sends a same-origin Content Security Policy and standard browser security headers. Keep `connect-src` aligned with deployment and review policy violations before adding external scripts. An active XSS can still use an in-memory access token until it expires even though it cannot read the refresh cookie; dependency review remains ongoing work.
8. The service worker caches the app shell and static assets only; it deliberately skips API responses. Lessons, practice sets, and response syncing are not available offline yet. Add explicit user-selected learning packs with account-scoped local storage and a clear sync policy before promising offline learning.
