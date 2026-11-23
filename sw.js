/* Network-first for app shell so GitHub Pages install always opens the real UI */
const CACHE = "nifty-top20-gh-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = req.url;

  if (
    url.includes("finance.yahoo.com") ||
    url.includes("cors.dev") ||
    url.includes("corsproxy") ||
    url.includes("allorigins") ||
    url.includes("cdn.tailwindcss.com") ||
    url.includes("cdn.jsdelivr.net")
  ) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((c) => c || caches.match("./index.html") || caches.match("./"))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (req.method === "GET" && res.ok) {
          try {
            if (new URL(url).origin === self.location.origin) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
          } catch (_) {}
        }
        return res;
      });
    })
  );
});
