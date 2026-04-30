// Network-first Service Worker
const CACHE_NAME = "plz-team-finder-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./data/plz-map.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle GET
  if(req.method !== "GET") return;

  event.respondWith(
    fetch(req).then((res) => {
      // Cache successful same-origin requests
      const url = new URL(req.url);
      if(url.origin === self.location.origin && res.ok){
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
      }
      return res;
    }).catch(() => {
      return caches.match(req);
    })
  );
});
