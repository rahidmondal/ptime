const CACHE_NAME = 'app-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

const FILES_TO_CACHE = [
  './index.html',
  './main.js',
  './style.css',
  './timer.js',
  './Resource/Desktop_SS.png',
  './Resource/logo192.png',
  './Resource/logo512.png',
  './Resource/Mobile_SS.png',
];

// Install Event
self.addEventListener('install', async (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(FILES_TO_CACHE);
        console.log('Files cached successfully during install.');
      } catch (error) {
        console.error('Failed to cache files during install:', error);
      }
    })()
  );
});

// Activate Event
self.addEventListener('activate', async (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((cache) => cache !== CACHE_NAME && cache !== DYNAMIC_CACHE)
            .map((cache) => {
              console.log('Deleting old cache:', cache);
              return caches.delete(cache);
            })
        );
        await self.clients.claim();
        console.log('Service Worker activated and old caches cleared.');
      } catch (error) {
        console.error('Error during activation:', error);
      }
    })()
  );
});

// Fetch Event (Network-First Strategy)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return; 
  }

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        console.log(`Network request for '${event.request.url}' failed. Serving from cache. Error: ${error.message}`);
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

const limitCacheSize = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    limitCacheSize(cacheName, maxItems); 
  }
};