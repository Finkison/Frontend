# Finkison Enterprise System Architecture & C4 Topology

## 1. System Context & Architecture Overview

Finkison is an enterprise-grade digital education and examination platform engineered for secondary candidates and institutional educators, supporting both domestic Ethiopian Entrance curricula (EUEE) and international candidates.

```mermaid
graph TD
    User([Candidate / Parent / School Admin / International Scholar])
    Web[Frontend SPA - React 18 + Vite 5 + TypeScript]
    Nginx[Reverse Proxy - Nginx Alpine]
    API[Django Ninja REST API - Python 3.12]
    PG[(PostgreSQL 16 Multi-Tenant Database)]
    Redis[(Redis 7 Distributed Cache & Lock)]
    Chapa[Chapa National Payment Gateway - ETB]
    Stripe[Stripe International Gateway - USD/EUR/GBP]
    Gemini[Google Gemini 1.5 Flash LLM]

    User -->|HTTPS| Web
    Web -->|API Calls + JWT| Nginx
    Nginx -->|Reverse Proxy /api/| API
    API -->|ACID Transactions & Multi-Tenancy| PG
    API -->|Session & Caching| Redis
    API -->|Domestic Mobile Money| Chapa
    API -->|Global Card Settlement| Stripe
    API -->|Socratic Inference & SSE| Gemini
```

---

## 2. Enterprise Component Specifications

### 2.1 Frontend Architecture (`Frontend/`)
- **Core Runtime:** React 18 with TypeScript 5 (Strict Mode).
- **Security & RBAC:**
  - `<ProtectedRoute />`: Enforces authentication and granular role validation (`STUDENT`, `PARENT`, `TEACHER`, `PRINCIPAL`, `ADMIN`).
- **State Management:**
  - `authStore.ts`: Authenticated profile with persistent `localStorage` synchronization and cryptographic JWT token management.
  - `sessionStore.ts`: Active exam state with crash-proof persistence and section partitioning.
  - `battleStore.ts`: 1v1 duel arena state, real-time score tracking, round synchronization, and AI bot sparring modes.
- **Internationalization & Localization:**
  - Trilingual engine (`en`: English, `am`: Amharic አማርኛ, `om`: Afaan Oromoo) via `i18next` and `useI18n`.
  - Dual-Calendar Engine (`localization.ts`): Seamless simultaneous rendering of Gregorian (G.C.) and Ethiopian (E.C.) dates.
  - Multi-Currency Formatter (`ETB`, `USD`, `EUR`, `GBP`).
- **Automated Testing Suite:**
  - Vitest + jsdom test suite verifying authentication state, localization formatting, and battle duel mechanics.

### 2.2 Backend Architecture (`Backend/`)
- **Framework:** Django 5 with Django Ninja (Pydantic type enforcement, OpenAPI 3.0 schema generation).
- **Domain-Driven Modular Monolith (`apps/core/routers/`):**
  - `auth_router.py`: RFC-7519 compliant JWT issuance, password verification, profile endpoints.
  - `parent_router.py`: Real child progress telemetry, database-persisted parent alerts, and parent-teacher messaging.
  - `school_router.py`: Multi-tenant school telemetry, class roster management, exam assignments, and live CSV export.
  - `payment_router.py`: Multi-gateway payment router supporting Chapa and Stripe with dynamic currencies (`ETB`, `USD`, `EUR`, `GBP`).
  - `portal_router.py`: Leaderboard with composite indexing, scholarships, university cutoffs, and health probes.
- **Multi-Tenancy & Institutional Entities:**
  - `School`, `Classroom`, `TeacherProfile`, `ParentProfile`, `ParentAlert`, `ParentTeacherMessage`, `ExamAssignment`.
- **Payment Gateway Abstraction (`payment_gateways/`):**
  - Pluggable Adapter Pattern: `ChapaGateway` for domestic mobile money (Telebirr, CBE Birr), `StripeGateway` for international cards (USD/EUR/GBP), unified under `get_payment_gateway()`.
- **High-Concurrency & Anti-Race Duel Engine (`apps/battles/`):**
  - ACID atomic answer submission utilizing `transaction.atomic()` and `select_for_update()` to prevent lost updates under concurrent submissions.

---

## 3. Data Flow Diagrams

### 3.1 Multi-Gateway Payment Flow (Domestic & International)
```mermaid
sequenceDiagram
    autonumber
    actor User as Candidate / Diaspora Sponsor
    participant Frontend as Finkison Frontend
    participant Backend as Django Ninja API
    participant Factory as PaymentGatewayFactory
    participant Gateway as Chapa (ETB) / Stripe (USD/EUR)

    User->>Frontend: Selects Plan & Currency (ETB / USD / EUR)
    Frontend->>Backend: POST /api/payments/initialize/ { currency, amount, plan }
    Backend->>Factory: get_payment_gateway(currency)
    Factory-->>Backend: GatewayAdapter (Chapa or Stripe)
    Backend->>Gateway: Initialize Checkout Session
    Gateway-->>Backend: { tx_ref, checkout_url }
    Backend-->>Frontend: { success: true, tx_ref, checkout_url, gateway }
    Frontend->>User: Redirects to secure checkout
    User->>Gateway: Authorizes payment
    Gateway->>Backend: Webhook IPN (HMAC-SHA256 Signature Verification)
    Backend->>Backend: Marks transaction SUCCESS, activates Pro subscription
    Frontend->>Backend: GET /api/payments/verify/{tx_ref}/
    Backend-->>Frontend: { status: "SUCCESS", tier: "Season Pass" }
    Frontend->>User: Displays celebratory active pass banner
```

### 3.2 Atomic 1v1 Battle Concurrency Flow
```mermaid
sequenceDiagram
    autonumber
    actor Host as Player 1 (Host)
    actor Opponent as Player 2 (Opponent)
    participant API as Django Ninja Battle API
    participant DB as PostgreSQL (select_for_update)

    par Simultaneous Answer Submission
        Host->>API: POST /api/battle/submit-answer/ (Answer Q2)
        Opponent->>API: POST /api/battle/submit-answer/ (Answer Q2)
    end
    API->>DB: BEGIN TRANSACTION (Row-Level Lock on BattleRoom)
    DB-->>API: Row Lock Granted
    API->>DB: Atomic Score Increment & Anti-Cheat Time Verification
    API->>DB: COMMIT TRANSACTION
    API-->>Host: { hostScore: 20, opponentScore: 10 }
    API-->>Opponent: { hostScore: 20, opponentScore: 10 }
```
