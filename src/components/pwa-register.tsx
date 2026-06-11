"use client"

import { useEffect } from "react"

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    // First, unregister any existing service workers
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        // Unregister old service worker immediately
        registration.unregister().then(() => {
          console.log("[SW] Old service worker unregistered")
          // Clear all caches
          caches.keys().then((keys) => {
            keys.forEach((key) => {
              caches.delete(key)
            })
          })
        })
      }
    })

    // Then register the new service worker
    // The { scope: '/' } ensures it covers the entire site
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("[SW] Service worker registered:", registration.scope)

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("[SW] New version available - refreshing...")
                // Force reload to use new version immediately
                window.location.reload()
              }
            })
          }
        })
      })
      .catch((error) => {
        console.warn("[SW] Service worker registration failed:", error)
        // Silently fail – service worker is optional
      })

    // Listen for controller change (new service worker activated)
    let refreshing = false
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true
        console.log("[SW] Controller changed - page will reload")
        window.location.reload()
      }
    })
  }, [])

  return null
}