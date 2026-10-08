# 📱 Frontend PWA Deployment & CDN Runbook

## 1. Production Build
```bash
npm ci
npm run build
```
Generates production artifacts in `dist/` with code-split vendor and route chunks.

---

## 2. Docker Container Deployment
```bash
docker build -t finkison-frontend:latest .
docker run -d -p 80:80 --name finkison_frontend finkison-frontend:latest
```
Nginx is preconfigured (`nginx.conf`) to handle:
- Client-side SPA routing (`try_files $uri $uri/ /index.html`)
- Gzip compression on static assets
- Cache-Control headers for hashed bundles (`Cache-Control "public, max-age=31536000, immutable"`)
- No-cache policy on `index.html` and `sw.js` for instant updates

---

## 3. Service Worker Verification
1. Open Chrome DevTools $\rightarrow$ Application $\rightarrow$ Service Workers.
2. Verify `/sw.js` is registered and active.
3. Switch network to **Offline** and refresh: verify that `offline.html` or cached shell renders gracefully.
