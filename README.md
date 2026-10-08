# 🇪🇹 Finkison Frontend — Academic Operating System (PWA)

Enterprise React 18 + TypeScript Progressive Web App (PWA) for **Finkison**, Ethiopia's premier learning engine designed to prepare Grade 9–12 students to score **500+ out of 600** on the Ethiopian University Entrance Examination (EUEE).

---

## 🌟 Key Up Learn-Grade Capabilities
- **🧠 Spaced Repetition (SRS)**: Active recall cards scheduled dynamically via the FSRS algorithm (`/student/spaced-review`).
- **📅 AI Daily Study Planner**: Personalized daily review agenda with real-time countdown to the EUEE exam (`/student/study-plan`).
- **🕸️ Curriculum Knowledge Graph**: Interactive prerequisite tree visualizer mapping foundational Grade 9–10 concepts to high-yield Grade 12 units (`/student/knowledge-map`).
- **📊 10-Year EUEE Past Paper Intelligence**: Historical topic frequency heatmap, speed-per-question target benchmarks, and university cutoff calibration (`/student/past-papers`).
- **📶 Offline-First Architecture**: Intermittent internet resilience with IndexedDB local caching, Service Worker asset caching (`/sw.js`), and automatic background sync.
- **🌐 Trilingual Localization**: Full UI and explanation support in English, Amharic (አማርኛ), and Afaan Oromoo.
- **⚔️ 1v1 Battle Arena**: Live multi-player quiz competitions with ELO rating progression.
- **🤖 Socratic AI Tutor**: Chat with an AI mentor calibrated to the Ethiopian National Curriculum.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application runs at `http://localhost:5173`. API requests to `/api/*` are automatically proxied to the Django backend at `http://127.0.0.1:8000`.

### 3. Run Test Suite
```bash
npm test -- --run
```

### 4. Build for Production
```bash
npm run build
```
Generates an optimized bundle with automatic code splitting in `dist/`.

---

## 📂 Project Structure
```text
Frontend/
├── components/
│   ├── auth/            # Phone + OTP & Multi-tenant Login/Register
│   ├── layouts/         # StudentLayout, ParentLayout, SchoolLayout
│   ├── parent/          # ParentDashboard, ChildDetailView, AlertsPanel
│   ├── school/          # SchoolDashboard, StudentTable, ClassView
│   ├── shared/          # ErrorBoundary, MainNav, SideNav, TopNav, Toast
│   └── student/         # StudyPlanner, SpacedReview, KnowledgeMap, PastPaperAnalyzer, etc.
├── docs/                # Architecture specifications & runbooks
├── hooks/               # Custom React hooks
├── i18n/                # Localization resources (en.json, am.json, om.json)
├── pages/               # Route pages (Lazy loaded for optimal performance)
├── public/              # manifest.json, sw.js, offline.html, icons
├── services/            # Axios API services & offlineSync
├── store/               # Zustand stores (learningStore, authStore, battleStore)
├── utils/               # offlineDB (IndexedDB), localization, score calculators
└── __tests__/           # Vitest unit test suites
```

---

## 🐳 Docker Deployment
```bash
docker build -t finkison-frontend .
docker run -p 80:80 finkison-frontend
```
Nginx serves the production single-page application with caching headers and proxy pass support.