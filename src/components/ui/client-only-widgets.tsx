"use client"

import { LazyStockAlert } from "@/components/lazy-component"
import { PWARegister } from "@/components/pwa-register"
import { FirestoreTestLoader } from "@/components/FirestoreTestLoader"
import { FirestoreDataLoader } from "@/components/FirestoreDataLoader"
import { RouteLoadingIndicator } from "@/components/ui/route-loading-indicator"

export function ClientOnlyWidgets() {
  return (
    <>
      <RouteLoadingIndicator />
      <LazyStockAlert />
      <PWARegister />
      <FirestoreTestLoader />
      <FirestoreDataLoader />
    </>
  )
}
