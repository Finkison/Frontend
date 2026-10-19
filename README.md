# Finkison Frontend

Enterprise-grade frontend for Ethiopian University Entrance Exam (EUEE) preparation platform.

## Tech Stack

- **Framework**: React 18.2 + TypeScript 5.3
- **Build Tool**: Vite 5
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Chart.js + React-ChartJS-2
- **Animations**: Framer Motion

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.development

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format with Prettier
npm run format:check     # Check formatting

# Testing
npm run test             # Run unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # E2E tests with Playwright

# Analysis
npm run analyze          # Bundle size analysis
```

## Project Structure

```text
Frontend/
├── components/          # Domain-partitioned UI components
│   ├── auth/            # Authentication & onboarding components
│   ├── landing/         # Public landing page sections & interactive hero
│   ├── layouts/         # Layout shells (StudentLayout, TeacherLayout, SchoolLayout, ParentLayout)
│   ├── navigation/      # Navigation bars, sidebar, and app shells
│   ├── parent/          # Parent portal views
│   ├── school/          # School administration views
│   ├── science/         # Interactive STEM virtual labs
│   ├── shared/          # Shared components (PageHeader, ErrorBoundary, MathText)
│   ├── student/         # Candidate examination & learning views
│   ├── teacher/         # Educator studio & assessment views
│   ├── typography/      # Text primitives (SectionHeader, CardText, Meta)
│   └── ui/              # Design system primitives (Button, Card, Input, Modal, Table, Toast)
├── docs/                # Canonical documentation
│   ├── architecture.md  # Client architecture, state management & routing
│   ├── design_system.md # Color tokens, typography, accessibility & layout
│   └── deployment.md    # Production builds, Docker & Nginx edge configuration
├── hooks/               # Custom React hooks
├── pages/               # Top-level route pages (Academics, AiFeatures, Schools, etc.)
├── routes/              # Role-isolated route trees (StudentRoutes, TeacherRoutes, etc.)
├── services/            # Typed REST API service bindings
├── store/               # Zustand state stores (authStore, challengeStore, sessionStore, etc.)
├── styles/              # Global styles & Tailwind configuration
├── types/               # TypeScript domain type definitions
└── utils/               # Pure utility helpers
```

## Documentation

* [Frontend Architecture Specification](docs/architecture.md)
* [Design System & Accessibility Standards (WCAG 2.2 AA)](docs/design_system.md)
* [Frontend Deployment Runbook](docs/deployment.md)


## Features

### Student Portal
- Dashboard with progress tracking
- Exam taking interface with anti-cheat
- Practice questions
- Performance analytics

### School Portal
- Student management
- Class & exam assignment
- Analytics dashboard
- Bulk operations

### Parent Portal
- Child monitoring
- Progress reports
- Communication with school

### Core Features
- JWT authentication with refresh tokens
- Responsive design (mobile-first)
- Dark mode ready
- Internationalization ready

## Environment Variables

See `.env.example` for all available variables.

Key variables:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket URL
- `VITE_ENABLE_ANALYTICS` - Enable analytics

## Build for Production

```bash
# Build
npm run build

# Preview build locally
npm run preview

# Deploy dist/ folder to your hosting
```

## Performance

- Initial bundle size: < 200KB gzipped
- Code splitting by route
- Lazy loading of heavy components
- Image optimization
- API response caching
- Service worker caching

## Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Follow TypeScript strict mode (no `any` types)
2. Use ESLint + Prettier for code style
3. Write unit tests for utilities and hooks
4. Test on mobile devices
5. Ensure accessibility (WCAG 2.1 AA)

## Architecture Decisions

- **Zustand over Redux**: Simpler API, less boilerplate, better TypeScript support
- **Vite over Webpack**: Faster builds, better DX, modern defaults
- **Tailwind over CSS-in-JS**: Utility-first, smaller bundle, better performance
- **Axios over Fetch**: Interceptors, better error handling, request cancellation
- **IndexedDB over LocalStorage**: More storage, structured data, async API

## License

Proprietary - Finkison EdTech Platform
