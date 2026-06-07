"use client"

import dynamic from "next/dynamic"
import { PWARegister } from "@/components/pwa-register"
import { FirestoreTestLoader } from "@/components/FirestoreTestLoader"

// Lazy-load heavy components that don't need to be on every page
const LazyStockAlert = dynamic(
  () => import("@/components/stock-alert").then((m) => m.StockAlertBanner),
  { ssr: false }
)

const FirestoreDataLoader = dynamic(
  () => import("@/components/FirestoreDataLoader").then((m) => m.FirestoreDataLoader),
  { ssr: false }
)

export function ClientOnlyWidgets() {
  return (
    <>
      <LazyStockAlert />
      <PWARegister />
      <FirestoreTestLoader />
      <FirestoreDataLoader />
    </>
  )
}