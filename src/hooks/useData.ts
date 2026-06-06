/**
 * Unified data hook — fetches from Firestore API when configured,
 * falls back to mock data when not.
 */
import { useState, useEffect } from 'react'
import { products, suppliers, orders, dashboardStats, recentActivity, learnArticles } from '@/lib/mock-data'
import type { Product, Supplier, Order, DashboardStats, ActivityItem, LearnArticle } from '@/types'

type DataType = 'products' | 'suppliers' | 'orders' | 'stats' | 'activity' | 'articles'

const mockData: Record<DataType, unknown[]> = {
  products: products as unknown[],
  suppliers: suppliers as unknown[],
  orders: orders as unknown[],
  stats: [dashboardStats] as unknown[],
  activity: recentActivity as unknown[],
  articles: learnArticles as unknown[],
}

async function fetchFromApi(endpoint: string): Promise<unknown[]> {
  try {
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : [data]
  } catch {
    return [] // Will trigger mock fallback
  }
}

export function useData<T>(type: DataType): { data: T[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function load() {
      // Try API first
      let result: unknown[] | null = null

      const apiMap: Record<string, string> = {
        products: '/api/products',
        suppliers: '/api/suppliers',
        orders: '/api/orders',
      }

      const endpoint = apiMap[type]
      if (endpoint) {
        result = await fetchFromApi(endpoint)
      }

      // Fall back to mock data
      if (!result || result.length === 0) {
        result = mockData[type] || []
      }

      if (!cancelled) {
        setData(result as T[])
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [type])

  return { data, loading, error }
}

// Convenience hooks
export function useProducts() {
  const { data, loading } = useData<Product>('products')
  return { products: data, loading }
}

export function useSuppliers() {
  const { data, loading } = useData<Supplier>('suppliers')
  return { suppliers: data, loading }
}

export function useOrders() {
  const { data, loading } = useData<Order>('orders')
  return { orders: data, loading }
}

export function useStats() {
  const { data } = useData<DashboardStats>('stats')
  return { stats: data[0] || dashboardStats }
}

export function useActivity() {
  const { data } = useData<ActivityItem>('activity')
  return { activity: data }
}

export function useArticles() {
  const { data } = useData<LearnArticle>('articles')
  return { articles: data }
}