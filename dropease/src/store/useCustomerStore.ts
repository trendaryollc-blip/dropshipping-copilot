"use client"
import { create } from "zustand"
import { nanoid } from "nanoid"
import { loadCustomersFromLocal, saveCustomersToLocal, generateMockCustomers } from "@/lib/crm-service"
import type { CustomerProfile } from "@/types"

interface CustomerRecord extends CustomerProfile {
  notes?: { id: string; text: string; createdAt: string }[]
  purchases?: { id: string; date: string; total: number; items: { productName: string; quantity: number }[] }[]
}

interface CustomerState {
  customers: CustomerRecord[]
  load: () => void
  addCustomer: (c: Omit<CustomerProfile, "id">) => void
  updateCustomer: (id: string, patch: Partial<CustomerProfile>) => void
  addNote: (id: string, text: string) => void
  addPurchase: (id: string, purchase: { total: number; items: { productName: string; quantity: number }[] }) => void
  calculateLTV: (id: string) => number
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  load: () => {
    const fromStorage = loadCustomersFromLocal()
    const initial = fromStorage.length ? fromStorage : generateMockCustomers()
    set({ customers: initial.map((c) => ({ ...c, notes: [], purchases: [] })) })
  },
  addCustomer: (c) =>
    set((state) => {
      const rec: CustomerRecord = { ...c, id: nanoid(), notes: [], purchases: [] }
      const customers = [rec, ...state.customers]
      saveCustomersToLocal(customers)
      return { customers }
    }),
    updateCustomer: (id, patch) =>
      set((state) => {
        const customers = state.customers.map((cu) => (cu.id === id ? { ...cu, ...patch } : cu))
        saveCustomersToLocal(customers)
        return { customers }
      }),
    addNote: (id, text) =>
      set((state) => {
        const customers = state.customers.map((cu) =>
          cu.id === id
            ? { ...cu, notes: [{ id: nanoid(), text, createdAt: new Date().toISOString() }, ...(cu.notes || [])] }
            : cu
        )
        saveCustomersToLocal(customers)
        return { customers }
      }),
    addPurchase: (id, purchase) =>
      set((state) => {
        const p = { id: nanoid(), date: new Date().toISOString().split("T")[0], total: purchase.total, items: purchase.items }
      const customers = state.customers.map((cu) => (cu.id === id ? { ...cu, purchases: [p, ...(cu.purchases || [])], orders: (cu.orders || 0) + 1, lifetimeValue: (cu.lifetimeValue || 0) + purchase.total, lastOrderDate: new Date().toISOString().split("T")[0] } : cu))
      saveCustomersToLocal(customers)
      return { customers }
    }),
  calculateLTV: (id) => {
    const cu = get().customers.find((c) => c.id === id)
    if (!cu) return 0
    const purchasesTotal = (cu.purchases || []).reduce((s, p) => s + p.total, 0)
    return Math.round((purchasesTotal + (cu.lifetimeValue || 0)) * 100) / 100
  },
}))
