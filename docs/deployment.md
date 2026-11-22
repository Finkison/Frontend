# Frontend deployment

## Local development

Run the Vite client with `npm ci` and `npm run dev`. Vite serves on port `5173` and proxies `/api` to `http://127.0.0.1:8000`.

## Production Docker deployment

The frontend Dockerfile has two stages: Node builds the static bundle, then Nginx serves it. The production backend Compose stack builds the frontend and API together so the frontend's `/api/` proxy can resolve the `backend` service on the private Docker network.

From `Backend/`, configure `.env` using `.env.example` and start the stack:

```sh
docker compose up --build -d
```

The frontend Nginx service listens on the host's loopback address at `FRONTEND_PORT` (default `8080`). Point the public TLS reverse proxy at that port. The outer proxy must preserve the original host and set `X-Forwarded-Proto` and `X-Forwarded-For`; frontend Nginx forwards those trusted values to Django. The backend API is also bound to loopback on `BACKEND_PORT` (default `8000`) for controlled host-side access.

Frontend Nginx applies a Content Security Policy and browser security headers to the app and API proxy. The policy permits the documented same-origin `/api` deployment and the Google Fonts assets used by the interface. If `VITE_API_BASE_URL` points to a separate API origin, add that exact HTTPS origin to `connect-src` in `nginx/security-headers.conf` before deployment.

The frontend Docker build runs `npm run build`, which type-checks with TypeScript before Vite creates `dist/`. Unit and end-to-end suites are separate contributor commands and are not run by the Dockerfile.

## Nginx behavior

- `/api/` is proxied to Django over the private Compose network.
- `/assets/` uses a one-year immutable cache lifetime for content-hashed files.
- `/index.html` uses `no-cache, no-store, must-revalidate` so new deployments load the current asset manifest.
- Other client routes fall back to `index.html` for React Router navigation.
- Gzip compression is enabled for text, JavaScript, CSS, JSON, and SVG responses.

If deploying the image outside the supplied Compose stack, attach it to a network that can resolve the backend host expected by `nginx.conf`, or update the proxy target as part of that deployment configuration.
