# Finkison frontend

The frontend is the React web client for Finkison's student, teacher, family, and school experiences.

## Stack

- React 18 and TypeScript
- Vite 5 and React Router
- Zustand for shared client state
- Axios for API requests
- Tailwind CSS and shared UI components
- i18next resources for English, Amharic, and Afaan Oromoo

## Start locally

Requirements: Node.js 18 or newer and npm 9 or newer.

```sh
npm ci
npm run dev
```

Vite serves the app on port `5173` and proxies `/api` to the backend at `http://127.0.0.1:8000`. `VITE_API_BASE_URL` can override the API base when the client is deployed behind a different proxy.

## Common commands

```sh
npm run build
npm run preview
npm run lint
npm run type-check
npm test
npm run test:e2e
```

See `package.json` for the complete script list.

## Project structure

```text
Frontend/
├── App.tsx             # Application shell and route composition
├── components/         # Shared UI and student, teacher, school, and parent views
├── pages/              # Public pages and account entry pages
├── routes/             # Protected role-specific route trees
├── services/           # Domain API clients and shared Axios transport
├── store/              # Zustand stores
├── hooks/              # Shared React hooks
├── context/            # React context providers
├── i18n/               # Locale setup and translation dictionaries
├── styles/             # Global styles and design tokens
├── types/              # Shared TypeScript types
├── utils/              # Pure helper functions
└── docs/               # Architecture, design system, and deployment docs
```

## Product areas

- Students: curriculum, practice, exams, AI tutoring, learning progress, and study tools.
- Teachers: lessons, assignments, question banks, exams, and gradebook workflows.
- Schools: student and staff administration, sections, invitations, reporting, and settings.
- Families: linked student progress and communication.

Client route guards control navigation. The backend remains responsible for authorization and tenant isolation.

## Documentation

- [Architecture](docs/architecture.md)
- [Design system](docs/design_system.md)
- [Deployment](docs/deployment.md)
