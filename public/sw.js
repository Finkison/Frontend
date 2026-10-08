/**
 * Finkison PWA Service Worker
 * Provides offline-first caching for Ethiopian students with intermittent connectivity.
 */

const CACHE_NAME = "finkison-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/offline.html",
  "/finkison-logo.svg",
  "/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests (mutations are handled by IndexedDB queue)
  if (req.method !== "GET") return;

  // Don't cache WebSocket or external analytics
  if (url.protocol === "ws:" || url.protocol === "wss:") return;

  // HTML navigation: Network-first, fallback to offline.html
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match("/offline.html").then((res) => {
          return res || caches.match("/");
        });
      })
    );
    return;
  }

  // API or static assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
