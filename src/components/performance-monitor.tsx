"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  bundleSize: number
}

export function PerformanceMonitor({ onClose }: { onClose: () => void }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Measure performance metrics
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.fetchStart
      
      // Memory usage (if available)
      const memory = (performance as any).memory
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0 // MB

      // Simulate bundle size (in real app, this would come from build stats)
      const bundleSize = 2.5 // MB

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(performance.now()),
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        bundleSize
      })
    }

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
      return () => window.removeEventListener('load', measurePerformance)
    }
  }, [])

  if (!metrics) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs space-y-1 z-50">
      <div className="flex items-center gap-2">
        <span className="font-medium">Performance</span>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <div>Load: {metrics.loadTime}ms</div>
        <div>Render: {metrics.renderTime}ms</div>
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Bundle: {metrics.bundleSize}MB</div>
      </div>
    </div>
  )
}

// Toggle button for performance monitor
export function PerformanceToggle() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs z-40 hover:bg-black/90"
        >
          📊 Perf
        </button>
      )}
      {isVisible && <PerformanceMonitor onClose={() => setIsVisible(false)} />}
    </>
  )
}
