/**
 * Unified data hook — fetches from API.
 * Production mode: no mock fallback.
 */
import { useState, useEffect } from 'react'
import type { Product, Supplier, Order, DashboardStats, ActivityItem, LearnArticle } from '@/types'

type DataType = 'products' | 'suppliers' | 'orders' | 'stats' | 'activity' | 'articles'

async function fetchFromApi(endpoint: string): Promise<unknown[]> {
  try {
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : [data]
  } catch (error) {
    console.error(`[useData] Failed to load ${endpoint}:`, error)
    return []
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
      const apiMap: Record<string, string> = {
        products: '/api/products',
        suppliers: '/api/suppliers',
        orders: '/api/orders',
      }

      const endpoint = apiMap[type]
      if (!endpoint) {
        if (!cancelled) {
          setData([])
          setLoading(false)
        }
        return
      }

      const result = await fetchFromApi(endpoint)

      if (!cancelled) {
        setData(result as T[])
        setLoading(false)
        setError(null)
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
  return { stats: data[0] || null }
}

export function useActivity() {
  const { data } = useData<ActivityItem>('activity')
  return { activity: data }
}

export function useArticles() {
  const { data } = useData<LearnArticle>('articles')
  return { articles: data }
}