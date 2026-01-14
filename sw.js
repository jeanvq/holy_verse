// Service Worker for HolyVerse PWA
const CACHE_NAME = 'holyverse-v1';
const STATIC_CACHE = 'holyverse-static-v1';
const DYNAMIC_CACHE = 'holyverse-dynamic-v1';

const STATIC_ASSETS = [
  '/holy_verse/',
  '/holy_verse/index.html',
  '/holy_verse/css/styles.css',
  '/holy_verse/css/grid.css',
  '/holy_verse/css/bot.css',
  '/holy_verse/js/main.js',
  '/holy_verse/js/api.js',
  '/holy_verse/js/bot.js',
  '/holy_verse/js/i18n.js',
  '/holy_verse/js/utils.js',
  '/holy_verse/js/bot-enhancements.js',
  '/holy_verse/assets/images/logo.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('Service Worker: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // For API requests, use network first
    if (url.hostname.includes('api.scripture.api.bible')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache successful API responses
            const clonedResponse = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clonedResponse);
            });
            return response;
          })
          .catch(() => {
            // Fallback to cache if offline
            return caches.match(request);
          })
      );
      return;
    }
    
    // For other external resources, just fetch
    event.respondWith(fetch(request));
    return;
  }

  // For same-origin requests, use cache first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (request.destination === 'document') {
          return caches.match('/holy_verse/index.html');
        }
      })
  );
});

// Background sync for offline verse saves
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  // Placeholder for syncing favorites when back online
  console.log('Service Worker: Syncing favorites...');
}
