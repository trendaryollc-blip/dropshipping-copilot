"use client"

import { LazyAnalyticsDashboard } from "@/components/lazy-component"

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your store performance, customer insights, and sales trends.
        </p>
      </div>

      <LazyAnalyticsDashboard />
    </div>
  )
}
