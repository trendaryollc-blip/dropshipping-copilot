const CACHE_NAME = 'dropease-v2'
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json',
]

// Only cache same-origin static assets, never cache API calls
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  // Only cache GET requests to same-origin static assets
  if (request.method !== 'GET') return
  if (request.url.includes('/api/')) return

  event.respondWith(
    caches.match(request).then((cached) => {
      // Network-first strategy for navigation, cache-first for static assets
      if (request.mode === 'navigate') {
        return fetch(request).catch(() => cached || caches.match('/'))
      }
      return cached || fetch(request).then((response) => {
        // Only cache successful same-origin responses
        if (response.ok && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
