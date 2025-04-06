---
# Service Worker for Jekyll
---
var CACHE_NAME = 'start-{{ site.time | date: "%Y-%m-%d-%H:%M" }}';
var urlsToCache = [
  {% for file in site.static_files %}'{{ site.baseurl }}{{ file.path }}',
  {% endfor %}
  '/'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).then(
        response => {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            if (event.request.url.indexOf('http') !== 0) return;
            cache.put(event.request, responseToCache);
          });

          return response;
        }
      );
    }).catch(() => {
      return caches.match('/');
    })
  );
});

self.addEventListener('activate', event => {

  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
