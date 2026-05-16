"use client"
import { create } from "zustand"
import { loadFinanceFromLocal, saveFinanceToLocal } from "@/lib/finance-service"
import type { ProductCost } from "@/lib/finance-service"

interface FinanceState {
  productCosts: ProductCost[]
  load: () => void
  setCost: (c: ProductCost) => void
}

export const useFinanceStore = create<FinanceState>((set) => ({
  productCosts: [],
  load: () => {
    const s = loadFinanceFromLocal()
    set({ productCosts: s.productCosts })
  },
  setCost: (c) => set((state) => { const next = [c, ...state.productCosts.filter(p => p.productId !== c.productId)]; saveFinanceToLocal({ productCosts: next }); return { productCosts: next } }),
}))
