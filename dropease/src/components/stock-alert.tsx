"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStockAlerts } from "@/hooks/use-websocket"
import type { StockAlert } from "@/lib/websocket"

export function StockAlertBanner() {
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useStockAlerts((alert) => {
    if (!dismissed.has(alert.productId)) {
      setAlerts(prev => [...prev, alert])
    }
  })

  const dismissAlert = (productId: string) => {
    setDismissed(prev => new Set([...prev, productId]))
    setAlerts(prev => prev.filter(alert => alert.productId !== productId))
  }

  const activeAlerts = alerts.filter(alert => !dismissed.has(alert.productId))

  if (activeAlerts.length === 0) return null

  return (
    <div className="fixed top-16 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      {activeAlerts.map((alert) => (
        <Card key={alert.productId} className="mb-3 border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
                <AlertTriangle className="size-4" />
                Low Stock Alert
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.productId)}
                className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800"
              >
                <X className="size-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-900">
                {alert.productName}
              </p>
              <div className="flex items-center justify-between text-xs text-amber-700">
                <span>Current Stock: {alert.currentStock}</span>
                <span>Threshold: {alert.threshold}</span>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={() => {
                  // Navigate to supplier or reorder
                  window.location.href = `/suppliers`
                }}
              >
                Reorder Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
