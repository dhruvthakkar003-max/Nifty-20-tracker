/* Nifty Top-20 – offline shell cache */
const CACHE = "nifty-top20-v1";
const ASSETS = [
  "./nifty_strategy_app.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  // Never cache live market data / proxies
  if (
    url.includes("finance.yahoo.com") ||
    url.includes("cors.dev") ||
    url.includes("corsproxy") ||
    url.includes("allorigins")
  ) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        // cache same-origin static only
        try {
          const u = new URL(e.request.url);
          if (u.origin === self.location.origin && e.request.method === "GET") {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
        } catch (_) {}
        return res;
      }).catch(() => cached);
    })
  );
});
