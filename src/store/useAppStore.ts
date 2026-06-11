"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Product, Order, AutomationRule, Supplier } from "@/types"
import { getCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firestore-service"

// Extend Product type with mock data
interface ProductWithMockData extends Product {
  stock?: number
  price?: number
}

interface AppState {
  products: ProductWithMockData[]
  orders: Order[]
  suppliers: Supplier[]
  automationRules: AutomationRule[]
  users: User[]
  loading: boolean
  error: string | null

  // Product actions
  getProducts: () => Promise<void>
  getProductsByStatus: (status: Product['status']) => Promise<void>
  getProductsBySupplier: (supplierName: string) => Promise<void>
  getProductsByNiche: (niche: string) => Promise<void>
  loadFromFirestore: () => Promise<void>
  importProduct: (productData: any) => Promise<void>
  updateProductStatus: (id: string, status: Product['status']) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  // Order actions
  getOrders: () => Promise<void>
  getOrdersByStatus: (status: Order['status']) => Promise<void>
  getOrdersByCustomer: (customer: string) => Promise<void>

  // Supplier actions
  getSuppliers: () => Promise<void>
  getVerifiedSuppliers: () => Promise<void>
  getSuppliersByCategory: (category: string) => Promise<void>
  getSuppliersByCountry: (country: string) => Promise<void>

  // Automation actions
  getAutomationRules: () => Promise<void>
  getActiveAutomationRules: () => Promise<void>
  getAutomationRulesByType: (type: AutomationRule['type']) => Promise<void>

  // User actions
  getUsers: () => Promise<void>
  getUserByEmail: (email: string) => Promise<User | null>
  getProUsers: () => Promise<void>
  getFreeUsers: () => Promise<void>
  getOnboardedUsers: () => Promise<void>
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      products: [],
      orders: [],
      suppliers: [],
      automationRules: [],
      users: [],
      loading: false,
      error: null,

      // Product actions
      getProducts: async () => {
        set({ loading: true, error: null })
        try {
          const products = await getCollection<ProductWithMockData>('copilot_products')
          set({ products })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load products' })
        } finally {
          set({ loading: false })
        }
      },

      getProductsByStatus: async (status) => {
        set({ loading: true, error: null })
        try {
          const products = await getCollection<ProductWithMockData>('copilot_products')
          set({ products: products.filter(p => p.status === status) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load products' })
        } finally {
          set({ loading: false })
        }
      },

      getProductsBySupplier: async (supplierName) => {
        set({ loading: true, error: null })
        try {
          const products = await getCollection<ProductWithMockData>('copilot_products')
          set({ products: products.filter(p => p.supplierName === supplierName) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load products' })
        } finally {
          set({ loading: false })
        }
      },

      getProductsByNiche: async (niche) => {
        set({ loading: true, error: null })
        try {
          const products = await getCollection<ProductWithMockData>('copilot_products')
          set({ products: products.filter(p => p.niche === niche) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load products' })
        } finally {
          set({ loading: false })
        }
      },

      loadFromFirestore: async () => {
        set({ loading: true, error: null })
        try {
          // Load all collections
          const [products, orders, suppliers, rules, users] = await Promise.all([
            getCollection<ProductWithMockData>('copilot_products'),
            getCollection<Order>('copilot_orders'),
            getCollection<Supplier>('copilot_suppliers'),
            getCollection<AutomationRule>('copilot_automation_rules'),
            getCollection<User>('copilot_users')
          ]);

          set({ products, orders, suppliers, automationRules: rules, users });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load data from Firestore' })
        } finally {
          set({ loading: false })
        }
      },

      importProduct: async (productData) => {
        set({ loading: true, error: null })
        try {
          // Add product to mock collection
          const newProduct = {
            ...productData,
            id: `prod-${Date.now()}`,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            priceRange: {
              min: Math.round(Math.random() * 100),
              max: Math.round(Math.random() * 100) + 100
            },
            stock: Math.floor(Math.random() * 100) + 1,
            price: Math.round((productData.priceRange.min + productData.priceRange.max) / 2)
          };

          await addDocument<ProductWithMockData>('copilot_products', newProduct);

          // Refresh products
          const products = await getCollection<ProductWithMockData>('copilot_products');
          set({ products });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to import product' })
        } finally {
          set({ loading: false })
        }
      },

      updateProductStatus: async (id, status) => {
        set({ loading: true, error: null })
        try {
          // Update product status in mock collection
          await updateDocument<ProductWithMockData>('copilot_products', id, { status });

          // Refresh products
          const products = await getCollection<ProductWithMockData>('copilot_products');
          set({ products });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to update product status' })
        } finally {
          set({ loading: false })
        }
      },

      deleteProduct: async (id) => {
        set({ loading: true, error: null })
        try {
          // Delete product from mock collection
          await deleteDocument<ProductWithMockData>('copilot_products', id);

          // Refresh products
          const products = await getCollection<ProductWithMockData>('copilot_products');
          set({ products });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to delete product' })
        } finally {
          set({ loading: false })
        }
      },

      // Order actions
      getOrders: async () => {
        set({ loading: true, error: null })
        try {
          const orders = await getCollection<Order>('copilot_orders')
          set({ orders })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load orders' })
        } finally {
          set({ loading: false })
        }
      },

      getOrdersByStatus: async (status) => {
        set({ loading: true, error: null })
        try {
          const orders = await getCollection<Order>('copilot_orders')
          set({ orders: orders.filter(o => o.status === status) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load orders' })
        } finally {
          set({ loading: false })
        }
      },

      getOrdersByCustomer: async (customer) => {
        set({ loading: true, error: null })
        try {
          const orders = await getCollection<Order>('copilot_orders')
          set({ orders: orders.filter(o => o.customer === customer) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load orders' })
        } finally {
          set({ loading: false })
        }
      },

      // Supplier actions
      getSuppliers: async () => {
        set({ loading: true, error: null })
        try {
          const suppliers = await getCollection<Supplier>('copilot_suppliers')
          set({ suppliers })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load suppliers' })
        } finally {
          set({ loading: false })
        }
      },

      getVerifiedSuppliers: async () => {
        set({ loading: true, error: null })
        try {
          const suppliers = await getCollection<Supplier>('copilot_suppliers')
          set({ suppliers: suppliers.filter(s => s.verified) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load suppliers' })
        } finally {
          set({ loading: false })
        }
      },

      getSuppliersByCategory: async (category) => {
        set({ loading: true, error: null })
        try {
          const suppliers = await getCollection<Supplier>('copilot_suppliers')
          set({ suppliers: suppliers.filter(s => s.categories.includes(category)) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load suppliers' })
        } finally {
          set({ loading: false })
        }
      },

      getSuppliersByCountry: async (country) => {
        set({ loading: true, error: null })
        try {
          const suppliers = await getCollection<Supplier>('copilot_suppliers')
          set({ suppliers: suppliers.filter(s => s.country === country) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load suppliers' })
        } finally {
          set({ loading: false })
        }
      },

      // Automation actions
      getAutomationRules: async () => {
        set({ loading: true, error: null })
        try {
          const rules = await getCollection<AutomationRule>('copilot_automation_rules')
          set({ automationRules: rules })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load automation rules' })
        } finally {
          set({ loading: false })
        }
      },

      getActiveAutomationRules: async () => {
        set({ loading: true, error: null })
        try {
          const rules = await getCollection<AutomationRule>('copilot_automation_rules')
          set({ automationRules: rules.filter(r => r.enabled) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load automation rules' })
        } finally {
          set({ loading: false })
        }
      },

      getAutomationRulesByType: async (type) => {
        set({ loading: true, error: null })
        try {
          const rules = await getCollection<AutomationRule>('copilot_automation_rules')
          set({ automationRules: rules.filter(r => r.type === type) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load automation rules' })
        } finally {
          set({ loading: false })
        }
      },

      // User actions
      getUsers: async () => {
        set({ loading: true, error: null })
        try {
          const users = await getCollection<User>('copilot_users')
          set({ users })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load users' })
        } finally {
          set({ loading: false })
        }
      },

      getUserByEmail: async (email) => {
        set({ loading: true, error: null })
        try {
          const users = await getCollection<User>('copilot_users')
          const user = users.find(u => u.email === email) || null
          set({ users: user ? [user] : [] })
          return user
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load user' })
          return null
        } finally {
          set({ loading: false })
        }
      },

      getProUsers: async () => {
        set({ loading: true, error: null })
        try {
          const users = await getCollection<User>('copilot_users')
          set({ users: users.filter(u => u.plan === 'pro') })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load users' })
        } finally {
          set({ loading: false })
        }
      },

      getFreeUsers: async () => {
        set({ loading: true, error: null })
        try {
          const users = await getCollection<User>('copilot_users')
          set({ users: users.filter(u => u.plan === 'free') })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load users' })
        } finally {
          set({ loading: false })
        }
      },

      getOnboardedUsers: async () => {
        set({ loading: true, error: null })
        try {
          const users = await getCollection<User>('copilot_users')
          set({ users: users.filter(u => u.isOnboarded) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load users' })
        } finally {
          set({ loading: false })
        }
      }
    }),
    {
      name: "dropease-app",
      partialize: (state) => ({
        products: state.products,
        orders: state.orders,
        suppliers: state.suppliers,
        automationRules: state.automationRules,
        users: state.users,
        loading: state.loading,
        error: state.error
      })
    }
  )
)