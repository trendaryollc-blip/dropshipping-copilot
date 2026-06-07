"use client"

import { useState } from "react"
import { Globe, RefreshCw, Upload, ArrowUpDown, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type SyncAction = "sync-products" | "sync-prices" | "sync-stock" | "pull-orders"

interface SyncResult {
  action: SyncAction
  success: boolean
  message: string
  timestamp: string
}

export function TrendaryoSync() {
  const [loading, setLoading] = useState<SyncAction | null>(null)
  const [lastResults, setLastResults] = useState<SyncResult[]>([])

  const runSync = async (action: SyncAction, label: string) => {
    setLoading(action)
    try {
      const res = await fetch("/api/trendaryo/import-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()

      const result: SyncResult = {
        action,
        success: data.success,
        message: data.success ? `${label} completed successfully` : (data.error || `${label} failed`),
        timestamp: new Date().toLocaleTimeString(),
      }
      setLastResults((prev) => [result, ...prev].slice(0, 10))

      if (data.success) {
        toast.success(`${label} completed!`)
      } else {
        toast.error(data.error || `${label} failed`)
      }
    } catch {
      const result: SyncResult = {
        action,
        success: false,
        message: "Failed to connect to Trendaryo API. Check your API key configuration.",
        timestamp: new Date().toLocaleTimeString(),
      }
      setLastResults((prev) => [result, ...prev].slice(0, 10))
      toast.error("Failed to connect to Trendaryo API")
    } finally {
      setLoading(null)
    }
  }

  const syncActions = [
    {
      id: "sync-products" as SyncAction,
      label: "Sync All Products",
      description: "Push all products from DropEase to your Trendaryo store",
      icon: Upload,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "sync-prices" as SyncAction,
      label: "Sync Prices",
      description: "Update product prices on Trendaryo to match DropEase",
      icon: ArrowUpDown,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: "sync-stock" as SyncAction,
      label: "Sync Stock Levels",
      description: "Update inventory counts on Trendaryo",
      icon: RefreshCw,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: "pull-orders" as SyncAction,
      label: "Pull Orders",
      description: "Fetch new orders from Trendaryo into DropEase",
      icon: ArrowUpDown,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Trendaryo Store Sync
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manually sync products, prices, stock, and orders between DropEase and your Trendaryo store at trendaryo.com.
        </p>
      </div>

      {/* Connection Status */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Globe className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Trendaryo API</p>
            <p className="text-xs text-muted-foreground">
              {process.env.NEXT_PUBLIC_TRENDARYO_URL
                ? `Connected to ${process.env.NEXT_PUBLIC_TRENDARYO_URL}`
                : "API key configured via environment variables"}
            </p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
            Configured
          </Badge>
        </CardContent>
      </Card>

      {/* Manual Sync Buttons */}
      <div className="grid gap-3 sm:grid-cols-2">
        {syncActions.map((action) => (
          <Card key={action.id} className="hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${action.bg} ${action.color}`}>
                  <action.icon className="size-4" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold">{action.label}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                size="sm"
                className="w-full rounded-xl text-xs"
                onClick={() => runSync(action.id, action.label)}
                disabled={loading !== null}
              >
                {loading === action.id ? (
                  <>
                    <Loader2 className="mr-1 size-3 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-1 size-3" />
                    Run Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync History */}
      {lastResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Sync Activity</CardTitle>
            <CardDescription>Last {lastResults.length} sync operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lastResults.map((result, i) => (
                <div
                  key={`${result.timestamp}-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-3 py-2 text-xs"
                >
                  {result.success ? (
                    <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="size-3.5 text-red-500 shrink-0" />
                  )}
                  <span className="flex-1 truncate">{result.message}</span>
                  <span className="text-muted-foreground tabular-nums shrink-0">{result.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}