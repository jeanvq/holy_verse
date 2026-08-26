// Service Worker for HolyVerse PWA - Optimized for Performance
const CACHE_NAME = 'holyverse-v27';
const STATIC_CACHE = 'holyverse-static-v15';
const DYNAMIC_CACHE = 'holyverse-dynamic-v15';
const IMAGE_CACHE = 'holyverse-images-v15';

const STATIC_ASSETS = [
  '',
  'index.html',
  'css/styles.css',
  'js/i18n.js',
  'js/api.js',
  'js/bot.js',
  'js/app.js',
  'js/yearplan.js',
  'js/auth.js',
  'js/bible.js',
  'assets/images/logo.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        const scopedAssets = STATIC_ASSETS.map((asset) => new URL(asset, self.registration.scope).toString());
        return cache.addAll(scopedAssets);
      }),
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('Service Worker: Image cache ready');
        return Promise.resolve();
      })
    ]).then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cache)) {
            console.log('Service Worker: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - optimized with smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests (mostly)
  if (url.origin !== location.origin) {
    // For API requests, use network first with timeout
    if (url.hostname.includes('api.scripture.api.bible') || url.hostname.includes('rest.api.bible')) {
      event.respondWith(
        Promise.race([
          fetch(request).then(response => {
            // Cache successful API responses
            if (response && response.status === 200) {
              const clonedResponse = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, clonedResponse);
              });
            }
            return response;
          }),
          new Promise(resolve => setTimeout(() => resolve(null), 8000)) // 8s timeout
        ]).catch(() => {
          // Fallback to cache if offline or timeout
          return caches.match(request);
        })
      );
      return;
    }
    
    // For other external resources, just fetch
    event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // For images, use cache first with network update
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(IMAGE_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          });

          return cachedResponse || fetchPromise;
        })
        .catch(() => {
          // Fallback placeholder if no cache
          return new Response('', { status: 503 });
        })
    );
    return;
  }

  // For HTML/CSS/JS, use network first to avoid stale auth/UI
  if (['document', 'script', 'style'].includes(request.destination)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          if (request.destination === 'document') {
            return caches.match(new URL('index.html', self.registration.scope));
          }
          return caches.match(request);
        })
    );
    return;
  }

  // For other requests, use cache first, fallback to network
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
          return caches.match(new URL('index.html', self.registration.scope));
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
