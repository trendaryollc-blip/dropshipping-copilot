// DropEase Service Worker - v3
// Increment this version when deploying to force cache refresh
const CACHE_VERSION = 'dropease-v3'
const CACHE_NAME = CACHE_VERSION
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json',
]

// Force new service worker to activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION)
  // Delete all old caches immediately on install
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
      // Delete any caches that don't match current version
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log('[SW] Deleting old cache:', key)
              return caches.delete(key)
            })
        )
      )
    ])
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated version:', CACHE_VERSION)
  event.waitUntil(
    Promise.all([
      // Clean up any remaining old caches
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      ),
      // Claim all clients immediately
      self.clients.claim()
    ])
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  // Only handle GET requests
  if (request.method !== 'GET') return
  
  const url = new URL(request.url)
  
  // Never cache API calls
  if (url.pathname.startsWith('/api/')) return
  
  // Never cache dynamic app pages
  if (url.pathname.match(/^\/(app|auth|dashboard|products|suppliers|orders|customers|analytics|marketing|inventory)/)) return

  // Never cache HTML navigations - always fetch fresh
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => caches.match('/'))
    )
    return
  }

  // Network-first strategy for all other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful same-origin static assets
        if (response.ok && response.type === 'basic') {
          const contentType = response.headers.get('content-type') || ''
          // Only cache images, fonts, CSS and JS files
          if (
            contentType.startsWith('image/') ||
            contentType.startsWith('font/') ||
            contentType.includes('javascript') ||
            contentType.includes('css')
          ) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})