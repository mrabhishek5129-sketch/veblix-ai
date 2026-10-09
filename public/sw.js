const CACHE_NAME = "ai-web-builder-v1";
const STATIC_CACHE = "static-v1";

const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/login",
  "/signup",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Ignore cache failures silently
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and API requests
  if (event.request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Offline fallback page
          if (event.request.destination === "document") {
            return caches.match("/") || new Response(
              `<!DOCTYPE html>
              <html lang="en">
              <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
              <title>Veblix AI — Offline</title>
              <style>
                body{margin:0;background:#090a0f;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;}
                .icon{font-size:64px;margin-bottom:16px;}
                h1{font-size:24px;margin-bottom:8px;background:linear-gradient(135deg,#a78bfa,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
                p{color:#9ca3af;font-size:14px;margin-bottom:24px;}
                button{background:#7c3aed;color:#fff;border:none;padding:12px 24px;border-radius:12px;font-size:14px;cursor:pointer;}
              </style></head>
              <body>
                <div>
                  <div class="icon">✨</div>
                  <h1>Veblix AI</h1>
                  <p>Aap offline hain. Internet connect karo.</p>
                  <button onclick="location.reload()">Retry karo</button>
                </div>
              </body></html>`,
              { headers: { "Content-Type": "text/html" } }
            );
          }
        });
      })
  );
});
