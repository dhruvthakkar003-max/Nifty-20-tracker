/* Nifty Top-20 PWA – works on GitHub Pages (root or /repo/) */
const CACHE = "nifty-top20-gh-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  // Do not cache live market / proxy traffic
  if (
    url.includes("finance.yahoo.com") ||
    url.includes("cors.dev") ||
    url.includes("corsproxy") ||
    url.includes("allorigins")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          if (event.request.method === "GET" && res.ok) {
            try {
              const u = new URL(event.request.url);
              if (u.origin === self.location.origin) {
                const clone = res.clone();
                caches.open(CACHE).then((c) => c.put(event.request, clone));
              }
            } catch (_) {}
          }
          return res;
        })
        .catch(() => cached || caches.match("./index.html"));
    })
  );
});
