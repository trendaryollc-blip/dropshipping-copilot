"use client"

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useLoadFirestoreData() {
  const loadFromFirestore = useAppStore((state) => state.loadFromFirestore)

  useEffect(() => {
    loadFromFirestore()
  }, [loadFromFirestore])

  return true
}