"use client"
import { create } from "zustand"
import { nanoid } from "nanoid"
import { loadReviewsFromLocal, saveReviewsToLocal, generateMockReviews, importReviewsFromCSV, exportReviewsToCSV } from "@/lib/reviews-service"
import type { ProductReview } from "@/types"

interface ReviewsState {
  reviews: ProductReview[]
  load: () => void
  addReview: (r: Omit<ProductReview, 'id' | 'createdAt' | 'moderated'>) => void
  approve: (id: string) => void
  flag: (id: string) => void
  remove: (id: string) => void
  reply: (id: string, author: string, message: string) => void
  importCSV: (file: File) => Promise<void>
  exportCSV: () => string | null
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],
  load: () => {
    const fromStorage = loadReviewsFromLocal()
    const initial = fromStorage.length ? fromStorage : generateMockReviews()
    set({ reviews: initial })
  },
  addReview: (r) => {
    const rev: ProductReview = { id: nanoid(), ...r, createdAt: new Date().toISOString(), moderated: 'pending', replies: [] }
    set((state) => { const next = [rev, ...state.reviews]; saveReviewsToLocal(next); return { reviews: next } })
  },
  approve: (id) => set((state) => { const next = state.reviews.map(r => r.id === id ? { ...r, moderated: 'approved' as const } : r); saveReviewsToLocal(next); return { reviews: next } }),
  flag: (id) => set((state) => { const next = state.reviews.map(r => r.id === id ? { ...r, moderated: 'flagged' as const } : r); saveReviewsToLocal(next); return { reviews: next } }),
  remove: (id) => set((state) => { const next = state.reviews.map(r => r.id === id ? { ...r, moderated: 'removed' as const } : r); saveReviewsToLocal(next); return { reviews: next } }),
  reply: (id, author, message) => set((state) => { const next = state.reviews.map(r => r.id === id ? { ...r, replies: [{ id: nanoid(), author, message, createdAt: new Date().toISOString() }, ...(r.replies || [])] } : r); saveReviewsToLocal(next); return { reviews: next } }),
  importCSV: async (file) => {
    const imported = await importReviewsFromCSV(file)
    set((state) => { const next = [...imported, ...state.reviews]; saveReviewsToLocal(next); return { reviews: next } })
  },
  exportCSV: () => {
    const state = get()
    try {
      return exportReviewsToCSV(state.reviews)
    } catch (e) {
      console.error(e)
      return null
    }
  }
}))
