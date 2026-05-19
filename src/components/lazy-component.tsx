"use client"

import { Suspense, lazy } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LazyComponentProps<T = Record<string, unknown>> {
  componentLoader: () => Promise<{ default: React.ComponentType<T> }>
  fallback?: React.ReactNode
  props?: T
}

export function LazyComponent<T extends Record<string, unknown>>({ 
  componentLoader, 
  fallback = <LoadingSpinner size="lg" />,
  props = {} as T
}: LazyComponentProps<T>) {
  const LazyComponent = lazy(componentLoader) as React.LazyExoticComponent<React.ComponentType<T>>

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Pre-defined lazy components for common heavy components
export const LazyAnalyticsDashboard = () => (
  <LazyComponent 
    componentLoader={async () => {
      const mod = await import("@/components/analytics-dashboard")
      return { default: mod.AnalyticsDashboard }
    }}
    fallback={<div className="h-96 flex items-center justify-center"><LoadingSpinner size="lg" /></div>}
  />
)

export const LazyAIAnalysis = (props: { productName: string; category: string }) => (
  <LazyComponent 
    componentLoader={async () => {
      const mod = await import("@/components/ai-analysis")
      return { default: mod.AIAnalysisCard }
    }}
    fallback={<div className="h-64 flex items-center justify-center"><LoadingSpinner size="md" /></div>}
    props={props}
  />
)

export const LazyStockAlert = () => (
  <LazyComponent 
    componentLoader={async () => {
      const mod = await import("@/components/stock-alert")
      return { default: mod.StockAlertBanner }
    }}
    fallback={<div className="h-12 flex items-center justify-center"><LoadingSpinner size="sm" /></div>}
  />
)
