"use client"

import { useEffect } from "react"

export function FirestoreTestLoader() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@/lib/test-firestore")
      import("@/lib/seed-firestore")
    }
  }, [])

  return null
}
