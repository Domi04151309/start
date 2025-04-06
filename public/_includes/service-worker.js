const HEADER_CONTENT_TYPE = 'Content-Type';

const OFFLINE_CACHE_NAME = 'start-offline';

const OFFLINE_CACHE_CONTENT_TYPES = [
  'application/javascript',
  'font/',
  'image/',
  'text/css',
  'text/html'
];

/**
 * @param {Request} request
 * @returns {Promise<Response | null>}
 */
async function getResponse(request) {
  try {
    return await fetch(request);
  } catch {
    return null;
  }
}

/**
 * @param {Cache} offlineCache
 * @param {Request} request
 * @param {Response} response
 * @returns {Promise<void>}
 */
async function updateCache(offlineCache, request, response) {
  const promises = [];
  const hostname = new URL(request.url).hostname.toLocaleLowerCase();

  if (
    hostname !== 'localhost' &&
    OFFLINE_CACHE_CONTENT_TYPES.some(
      contentType => (
        response.headers.get(HEADER_CONTENT_TYPE) ?? ''
      ).toLowerCase().includes(contentType)
    )
  ) promises.push(offlineCache.put(request, response.clone()));

  await Promise.all(promises);
}

/**
 * @param {{request: Request}} event
 * @returns {Promise<Response|undefined>}
 */
async function onFetch(event) {
  const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
  const offlineCacheItem = await offlineCache.match(event.request);

  if (offlineCacheItem) return offlineCacheItem;

  const response = await getResponse(event.request);

  if (response === null) throw new Error('Invalid cache.');

  if (
    !response.ok ||
    !event.request.url.startsWith('http') ||
    event.request.method !== 'GET'
  ) return response;

  await updateCache(offlineCache, event.request, response);

  return response;
}

/**
 * @returns {Promise<void>}
 */
async function onActivate() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
}

// eslint-disable-next-line sonarjs/post-message
self.addEventListener('message', event => {
  // @ts-expect-error Missing worker types in context
  if (event.data.action === 'skipWaiting') globalThis.skipWaiting();
});

self.addEventListener('fetch', event => {
  // @ts-expect-error Missing worker types in context
  event.respondWith(onFetch(event));
});

self.addEventListener('activate', event => {
  // @ts-expect-error Missing worker types in context
  event.waitUntil(onActivate());
});
