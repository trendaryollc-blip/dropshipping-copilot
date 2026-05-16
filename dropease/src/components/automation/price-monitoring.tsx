"use client"

import { useState } from "react"
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle, Bell, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { PriceMonitoringRule, PriceAlert, PriceAlertCondition } from "@/types"

export function PriceMonitoring() {
  const [rule, setRule] = useState<PriceMonitoringRule>({
    id: "price-monitor-1",
    type: "price_monitoring",
    name: "Price Monitoring System",
    description: "Track competitor prices and get alerts on changes",
    status: "active",
    createdAt: "2024-01-10",
    lastRun: "2024-01-15 10:00",
    nextRun: "2024-01-15 14:00",
    enabled: true,
    conditions: {
      productIds: ["1", "2", "3"],
      checkInterval: 6,
      alertCondition: "below",
      thresholdValue: 15,
      competitorUrls: ["https://example.com/product1", "https://example.com/product2"],
    },
    stats: {
      alertsTriggered: 23,
      priceChangesDetected: 45,
      lastCheck: "2024-01-15 10:00",
    },
  })

  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: "alert-1",
      productId: "1",
      productName: "Wireless Earbuds Pro",
      oldPrice: 25,
      newPrice: 18,
      changePercentage: -28,
      condition: "below",
      threshold: 20,
      triggeredAt: "2024-01-15 09:30",
      acknowledged: false,
    },
    {
      id: "alert-2",
      productId: "2",
      productName: "Minimalist Watch Band",
      oldPrice: 12,
      newPrice: 14,
      changePercentage: 16.7,
      condition: "above",
      threshold: 15,
      triggeredAt: "2024-01-15 08:15",
      acknowledged: true,
    },
  ])

  const handleToggle = () => {
    setRule(prev => ({
      ...prev,
      enabled: !prev.enabled,
      status: !prev.enabled ? "active" : "paused"
    }))
    toast.success(rule.enabled ? "Price monitoring paused" : "Price monitoring activated")
  }

  const handleConditionChange = (key: keyof PriceMonitoringRule["conditions"], value: any) => {
    setRule(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [key]: value }
    }))
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
    toast.success("Alert acknowledged")
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    toast.success("Alert deleted")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <DollarSign className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Price Monitoring</h3>
            <p className="text-sm text-muted-foreground">Track competitor pricing changes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={rule.enabled ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
            {rule.enabled ? "Active" : "Paused"}
          </Badge>
          <Button
            variant={rule.enabled ? "outline" : "default"}
            size="sm"
            onClick={handleToggle}
          >
            {rule.enabled ? "Pause" : "Activate"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Bell className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.alertsTriggered}</p>
                <p className="text-xs text-muted-foreground">Alerts Triggered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.priceChangesDetected}</p>
                <p className="text-xs text-muted-foreground">Price Changes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <DollarSign className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.conditions.checkInterval}h</p>
                <p className="text-xs text-muted-foreground">Check Interval</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="size-4" />
            Monitoring Rules
          </CardTitle>
          <CardDescription className="text-xs">
            Configure when to trigger price alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Check Interval</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={rule.conditions.checkInterval}
                onChange={(e) => handleConditionChange("checkInterval", Number(e.target.value))}
                className="w-24 h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">hours between price checks</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Alert Condition</Label>
            <Select
              value={rule.conditions.alertCondition}
              onValueChange={(value) => value && handleConditionChange("alertCondition", value as PriceAlertCondition)}
            >
              <SelectTrigger className="w-48 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below">Price drops below</SelectItem>
                <SelectItem value="above">Price rises above</SelectItem>
                <SelectItem value="percentage_change">Percentage change</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Threshold Value</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                value={rule.conditions.thresholdValue}
                onChange={(e) => handleConditionChange("thresholdValue", Number(e.target.value))}
                className="w-24 h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">trigger alert when price reaches this value</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Competitor URLs</Label>
            <div className="space-y-2">
              {rule.conditions.competitorUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...rule.conditions.competitorUrls]
                      newUrls[index] = e.target.value
                      handleConditionChange("competitorUrls", newUrls)
                    }}
                    className="flex-1 h-8 text-sm"
                    placeholder="https://example.com/product"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => {
                      const newUrls = rule.conditions.competitorUrls.filter((_, i) => i !== index)
                      handleConditionChange("competitorUrls", newUrls)
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleConditionChange("competitorUrls", [...rule.conditions.competitorUrls, ""])}
              >
                <Plus className="size-3.5 mr-1.5" /> Add Competitor URL
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button size="sm" onClick={() => toast.success("Monitoring rules saved!")}>
              Save Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Price Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Recent Price Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${alert.acknowledged ? "bg-muted/30" : "bg-amber-50 border-amber-200"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{alert.productName}</p>
                      {!alert.acknowledged && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">New</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">${alert.oldPrice} → ${alert.newPrice}</span>
                      <span className={`font-medium ${alert.changePercentage < 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {alert.changePercentage < 0 ? <TrendingDown className="inline size-3 mr-0.5" /> : <TrendingUp className="inline size-3 mr-0.5" />}
                        {Math.abs(alert.changePercentage).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{alert.triggeredAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
