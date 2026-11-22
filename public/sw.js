const CACHE_NAME = "finkison-v2-static";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icon.svg",
  "/logo-192.png",
  "/logo-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        await Promise.all(
          STATIC_ASSETS.map((asset) =>
            cache.add(asset).catch((err) => {
              console.warn(`[SW] Pre-caching asset omitted or failed for ${asset}:`, err);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
          .filter((key) => key.startsWith("finkison-"))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and WebSocket connections
  if (request.method !== "GET" || url.protocol.startsWith("ws")) {
    return;
  }

  // Never store authenticated or personal API responses on a shared device.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  // Navigation requests: Network first with an app-shell fallback when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedShell = await caches.match("/index.html") || await caches.match("/");
        return cachedShell || new Response("Finkison is unavailable offline.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      })
    );
    return;
  }

  // Cache only build assets, never arbitrary same-origin documents or downloads.
  if (!["script", "style", "image", "font", "worker"].includes(request.destination)) {
    return;
  }

  // Static assets: Cache first with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
