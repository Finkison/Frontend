# 🚀 Frontend Team Onboarding Guide

Welcome to the Finkison Frontend Engineering team! This guide will get you from zero to running the production frontend stack locally in under 5 minutes.

---

## 1. Prerequisites
* **Node.js**: v18.0.0 or higher (Node 20+ recommended)
* **Package Manager**: `npm` v9+
* **Browser**: Chrome, Firefox, or Edge with Developer Tools enabled

---

## 2. Quickstart Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. Access the web app:
   * **Local**: `http://localhost:5173/`
   * **Network**: `http://<your-lan-ip>:5173/` (Exposed across your Wi-Fi network)

---

## 3. Available NPM Scripts

* `npm run dev`: Starts Vite dev server with `--host` enabled.
* `npm run build`: Type-checks with `tsc` and builds production bundle into `dist/`.
* `npm test`: Runs Vitest unit and integration test suite once.
* `npm run typecheck`: Runs strict TypeScript validation (`tsc --noEmit`) without emitting files.
* `npm run preview`: Previews the production build locally.

---

## 4. Key Local Development Credentials (Demo)

| Role | Login Identifier | Default PIN |
| :--- | :--- | :--- |
| **Student** | `+251911234567` | `Candidate123!` |
| **Teacher** | `teacher@finkison.et` | `password123` |
| **Principal** | `principal@finkison.et` | `password123` |
| **Parent** | `+251912345678` | `Parent123!` |
