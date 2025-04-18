const CACHE_NAME = 'app-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

const FILES_TO_CACHE = [
  './index.html',
  './main.js',
  './style.css',
  './timer.js',
  './Resource/favicon-96x96.png',
  './Resource/favicon.svg',
  './Resource/favicon.ico',
  './Resource/apple-touch-icon.png',
  './Resource/web-app-manifest-192x192.png',
  './Resource/web-app-manifest-512x512.png',
];
// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME && cache !== DYNAMIC_CACHE)
          .map((cache) => caches.delete(cache))
      );
    }).then(() => self.clients.claim()) 
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Fallback for offline
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
