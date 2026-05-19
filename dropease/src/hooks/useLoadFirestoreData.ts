"use client"

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useLoadFirestoreData() {
  const loadFromFirestore = useAppStore((state) => state.loadFromFirestore)
  const isLoadedFromFirestore = useAppStore((state) => state.isLoadedFromFirestore)

  useEffect(() => {
    if (!isLoadedFromFirestore) {
      loadFromFirestore()
    }
  }, [isLoadedFromFirestore, loadFromFirestore])

  return isLoadedFromFirestore
}
