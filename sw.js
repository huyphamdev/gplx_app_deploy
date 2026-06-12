const CACHE_NAME = 'gplx-app-v39';
const OFFLINE_URL = './';

const STATIC_ASSETS = [
  './',
  './index.html',
  './site.webmanifest',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './apple-touch-icon.png',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './favicon.ico',
  './css/app.css',
  './css/segment.css',
  './css/font-awesome/css/all.min.css',
  './js/jquery.js',
  './js/angular.js',
  './js/angular-route.js',
  './js/angular-touch.js',
  './js/angular-animate.js',
  './js/angular-sanitize.js',
  './js/fastclick.js',
  './js/toastr.js',
  './images/signs/signR310a.png',
  './images/signs/signR310b.png',
  './images/signs/signR310c.png',
  './js/full-questions.min.js',
  './js/full-94-questions.min.js',
  './js/full-exams.min.js',
  './js/global-const.js',
  './js/main.js',
  './js/services.js',
  './controllers/routes.js',
  './controllers/home.js',
  './views/home.html',
  './views/list.html',
  './views/random.html',
  './views/list-wrong.html',
  './views/list-exam.html',
  './views/list-topic.html',
  './views/details.html',
  './views/question.html',
  './views/exam.html',
  './views/setting.html',
  './views/reset.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('[SW] Some static assets failed to cache:', err);
        });
      })
      .then(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          console.log('[SW] Caching data assets');
          return Promise.all(
            DATA_ASSETS.map((url) =>
              fetch(url, { cache: 'reload' })
                .then((response) => {
                  if (response.ok) {
                    return cache.put(url, response);
                  }
                })
                .catch((err) => console.warn('[SW] Failed to cache:', url, err))
            )
          );
        });
      })
      .then(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          console.log('[SW] Caching views');
          return Promise.all(
            VIEW_ASSETS.map((url) =>
              fetch(url, { cache: 'reload' })
                .then((response) => {
                  if (response.ok) {
                    return cache.put(url, response);
                  }
                })
                .catch((err) => console.warn('[SW] Failed to cache view:', url, err))
            )
          );
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin !== location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            fetchAndCache(request);
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              if (response && response.status === 200 && response.type === 'cors') {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            }

            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          })
          .catch(() => {
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#ddd" width="200" height="200"/><text fill="#999" x="50%" y="50%" text-anchor="middle" dy=".3em">Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
});

function fetchAndCache(request) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
    })
    .catch(() => {
    });
}

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data === 'clearCache') {
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }).then(() => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage('cacheCleared');
        });
      });
    });
  }
});
