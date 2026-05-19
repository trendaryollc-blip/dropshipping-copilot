"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration)
        toast.success("PWA service worker registered")
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error)
      })
  }, [])

  return null
}
