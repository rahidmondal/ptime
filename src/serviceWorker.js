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

const handleInstall = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(FILES_TO_CACHE);
    console.log('Files cached successfully during install.');
  } catch (error) {
    console.error('Failed to cache files during install:', error);
  }
};

const handleActivate = async () => {
  try {
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
        console.log('Deleting old cache:', cacheName);
        await caches.delete(cacheName);
      }
    }
    await self.clients.claim();
    console.log('Service Worker activated and old caches cleared.');
  } catch (error) {
    console.error('Error during activation:', error);
  }
};

const handleFetch = async (event) => {
  try {
    const networkResponse = await fetch(event.request);
    const cache = await caches.open(DYNAMIC_CACHE);
    if (networkResponse && networkResponse.ok) {
      cache.put(event.request, networkResponse.clone());
    }
    return networkResponse; 
  } catch (error) {
    console.log(`Network request for '${event.request.url}' failed. Serving from cache. Error: ${error.message}`);
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    if (event.request.destination === 'document') {
      const offlineFallbackPage = await caches.match('./index.html');
      if (offlineFallbackPage) {
        return offlineFallbackPage;
      }
    }
  }
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(handleInstall());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(handleActivate());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(handleFetch(event));
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

const limitCacheSize = async (cacheName, maxItems) => {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      if (keys.length - 1 > maxItems) { 
          await limitCacheSize(cacheName, maxItems);
      }
    }
  } catch (error) {
    console.error(`Error in limitCacheSize for ${cacheName}:`, error);
  }
};