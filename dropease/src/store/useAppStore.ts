"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"
import { products as initialProducts, orders as initialOrders, stores as initialStores } from "@/lib/mock-data"
import type { Product, Order, ProductStatus, Store, StoreStatus, AutomationRule, AutomationStatus } from "@/types"

interface AppState {
  products: Product[]
  orders: Order[]
  stores: Store[]
  automationRules: AutomationRule[]
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  updateProductStatus: (id: string, status: ProductStatus) => void
  deleteProduct: (id: string) => void
  importProduct: (product: Product) => void
  addStore: (store: Omit<Store, "id" | "connectedAt">) => void
  updateStoreStatus: (id: string, status: StoreStatus) => void
  deleteStore: (id: string) => void
  updateAutomationStatus: (id: string, status: AutomationStatus) => void
  toggleAutomationEnabled: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
  products: initialProducts,
  orders: initialOrders,
  stores: initialStores,
  automationRules: [],
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  updateProductStatus: (id, status) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, status } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  importProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...product, status: "draft", importedAt: new Date().toISOString().split("T")[0] },
      ],
    })),
  addStore: (store) =>
    set((state) => ({
      stores: [
        ...state.stores,
        { ...store, id: nanoid(), connectedAt: new Date().toISOString().split("T")[0] },
      ],
    })),
  updateStoreStatus: (id, status) =>
    set((state) => ({
      stores: state.stores.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    })),
  deleteStore: (id) =>
    set((state) => ({
      stores: state.stores.filter((s) => s.id !== id),
    })),
  updateAutomationStatus: (id, status) =>
    set((state) => ({
      automationRules: state.automationRules.map((rule) =>
        rule.id === id ? { ...rule, status } : rule
      ),
    })),
toggleAutomationEnabled: (id) =>
     set((state) => ({
       automationRules: state.automationRules.map((rule) =>
         rule.id === id ? { ...rule, enabled: !rule.enabled, status: rule.enabled ? "paused" : "active" } : rule
       ),
     })),
  }),
  { name: "dropease-storage" }
))
