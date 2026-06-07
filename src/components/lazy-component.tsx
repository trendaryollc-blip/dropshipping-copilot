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
