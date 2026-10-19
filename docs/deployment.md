# 🚀 Deployment Runbook

This runbook outlines the standard procedures for building, testing, containerizing, and deploying the Finkison web client.

---

## 1. Quality Gate & Production Build

Execute the deterministic local validation pipeline before committing or deploying:

```bash
# 1. Type-check TypeScript codebase
npx tsc --noEmit

# 2. Run unit and compliance test suite
npm test

# 3. Generate production bundle
npm run build
```

The compiled output is generated in `dist/` with immutable content-hashed assets (e.g. `dist/assets/index-[hash].js`).

---

## 2. Docker Containerization

The production Docker image uses an optimized multi-stage build on top of `nginx:alpine`:

```bash
# Build container image
docker build -t finkison-frontend:latest .

# Run containerized instance locally
docker run -d -p 80:80 --name finkison_frontend finkison-frontend:latest
```

---

## 3. Nginx Edge Routing & Caching

The container runtime utilizes the following caching headers:

- **Entrypoints (`index.html`)**: Served with `Cache-Control: no-cache, no-store, must-revalidate` so users immediately receive updated bundles upon deployment.
- **Hashed Assets (`/assets/*`)**: Served with `Cache-Control: public, max-age=31536000, immutable` for maximal CDN cache hit ratio.
- **SPA Fallback**: Configured with `try_files $uri $uri/ /index.html;` to ensure client-side routes (`/student/*`, `/school/*`, `/teacher/*`, `/parent/*`) resolve without 404s.
- **Gzip Compression**: Enabled for text, JS, CSS, and SVG assets.
