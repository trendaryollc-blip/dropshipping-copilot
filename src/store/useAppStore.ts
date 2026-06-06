"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"
import { products as initialProducts, orders as initialOrders, stores as initialStores } from "@/lib/mock-data"
import { getCollection } from "@/lib/firestore-service"
import type { Product, Order, ProductStatus, Store, StoreStatus, AutomationRule, AutomationStatus } from "@/types"

interface AppState {
  products: Product[]
  orders: Order[]
  stores: Store[]
  automationRules: AutomationRule[]
  sidebarOpen: boolean
  isLoadedFromFirestore: boolean
  setSidebarOpen: (open: boolean) => void
  loadFromFirestore: () => Promise<void>
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
  isLoadedFromFirestore: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  loadFromFirestore: async () => {
    try {
      // Load products from Firestore
      const fsProducts = await getCollection('copilot_products') as Product[]
      if (fsProducts && fsProducts.length > 0) {
        set({ products: fsProducts, isLoadedFromFirestore: true })
        console.log('[AppStore] Loaded products from Firestore')
      }

      // Load orders from Firestore
      const fsOrders = await getCollection('copilot_orders') as Order[]
      if (fsOrders && fsOrders.length > 0) {
        set({ orders: fsOrders })
        console.log('[AppStore] Loaded orders from Firestore')
      }

    } catch (error) {
      console.warn('[AppStore] Could not load from Firestore, using mock data', error)
    }
  },
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
