self.addEventListener('install', (event) => {
  self.skipWaiting()
  console.log('DropEase PWA Service Worker installed')
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
  console.log('DropEase PWA Service Worker activated')
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.open('dropease-v1').then((cache) =>
      cache.match(event.request).then((cachedResponse) =>
        cachedResponse || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone())
          return response
        })
      )
    )
  )
})
