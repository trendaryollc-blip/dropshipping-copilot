"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"

// Mock API functions - in real app, these would make actual API calls
const mockApi = {
  fetchProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return Array.from({ length: 50 }, (_, i) => ({
      id: `product-${i}`,
      name: `Product ${i + 1}`,
      price: Math.random() * 100,
      category: ["Electronics", "Fashion", "Home", "Sports"][Math.floor(Math.random() * 4)],
      image: `https://picsum.photos/200/200?random=${i}`,
      views: Math.floor(Math.random() * 1000),
      sales: Math.floor(Math.random() * 100)
    }))
  },
  
  fetchOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return Array.from({ length: 100 }, (_, i) => ({
      id: `order-${i}`,
      customer: `Customer ${i + 1}`,
      total: Math.random() * 200,
      status: ["pending", "processing", "shipped", "delivered"][Math.floor(Math.random() * 4)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }))
  },

  fetchAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      totalRevenue: 45678,
      totalOrders: 1234,
      totalCustomers: 892,
      conversionRate: 3.2,
      salesByMonth: Array.from({ length: 12 }, (_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        revenue: Math.random() * 30000 + 10000,
        orders: Math.floor(Math.random() * 500 + 200)
      }))
    }
  },

  updateProduct: async (id: string, data: unknown) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { id, ...data }
  }
}

// Optimized hooks with React Query
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: mockApi.fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: mockApi.fetchOrders,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: mockApi.fetchAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => mockApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

// Lazy loading hook for images
export function useLazyImage(src: string) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.src = src
    
    img.onload = () => {
      setImageSrc(src)
      setLoaded(true)
    }
    
    img.onerror = () => {
      setError(true)
      setLoaded(true)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { loaded, error, imageSrc }
}

// Debounced search hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length)
  
  const visibleItems = items.slice(startIndex, endIndex)
  const totalHeight = items.length * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop)
  }
}
