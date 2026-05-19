"use client"

import { useLoadFirestoreData } from "@/hooks/useLoadFirestoreData"

export function FirestoreDataLoader() {
  useLoadFirestoreData()
  return null
}
