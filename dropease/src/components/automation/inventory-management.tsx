"use client"

import { useState } from "react"
import { Package, AlertTriangle, RefreshCw, ShoppingCart, CheckCircle, Plus, Trash2 } from "lucide-react"
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
import type { InventoryRule, InventoryAlert, InventoryAlertLevel } from "@/types"

export function InventoryManagement() {
  const [rule, setRule] = useState<InventoryRule>({
    id: "inventory-1",
    type: "inventory",
    name: "Inventory Management",
    description: "Monitor stock levels and automate reorders",
    status: "active",
    createdAt: "2024-01-10",
    lastRun: "2024-01-15 08:00",
    nextRun: "2024-01-15 12:00",
    enabled: true,
    conditions: {
      productIds: ["1", "2", "3", "4"],
      lowStockThreshold: 10,
      criticalStockThreshold: 5,
      autoReorder: true,
      reorderQuantity: 50,
      alertLevel: "low",
    },
    stats: {
      alertsTriggered: 18,
      autoReordersPlaced: 12,
      stockoutsPrevented: 8,
    },
  })

  const [alerts, setAlerts] = useState<InventoryAlert[]>([
    {
      id: "alert-1",
      productId: "1",
      productName: "Wireless Earbuds Pro",
      currentStock: 8,
      threshold: 10,
      level: "low",
      triggeredAt: "2024-01-15 07:30",
      acknowledged: false,
      autoReorderPlaced: true,
    },
    {
      id: "alert-2",
      productId: "3",
      productName: "Portable LED Desk Lamp",
      currentStock: 3,
      threshold: 5,
      level: "critical",
      triggeredAt: "2024-01-15 06:15",
      acknowledged: false,
      autoReorderPlaced: true,
    },
    {
      id: "alert-3",
      productId: "5",
      productName: "Resistance Band Set",
      currentStock: 0,
      threshold: 5,
      level: "out_of_stock",
      triggeredAt: "2024-01-14 22:00",
      acknowledged: true,
      autoReorderPlaced: true,
    },
  ])

  const handleToggle = () => {
    setRule(prev => ({
      ...prev,
      enabled: !prev.enabled,
      status: !prev.enabled ? "active" : "paused"
    }))
    toast.success(rule.enabled ? "Inventory management paused" : "Inventory management activated")
  }

  const handleConditionChange = (key: keyof InventoryRule["conditions"], value: any) => {
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

  const getAlertLevelColor = (level: InventoryAlertLevel) => {
    switch (level) {
      case "low":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "critical":
        return "bg-red-100 text-red-700 border-red-200"
      case "out_of_stock":
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
            <Package className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Inventory Management</h3>
            <p className="text-sm text-muted-foreground">Monitor stock levels and automate reorders</p>
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
                <AlertTriangle className="size-4" />
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
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <ShoppingCart className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.autoReordersPlaced}</p>
                <p className="text-xs text-muted-foreground">Auto Reorders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircle className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.stockoutsPrevented}</p>
                <p className="text-xs text-muted-foreground">Stockouts Prevented</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="size-4" />
            Inventory Rules
          </CardTitle>
          <CardDescription className="text-xs">
            Configure stock thresholds and reorder settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Low Stock Threshold</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={rule.conditions.lowStockThreshold}
                onChange={(e) => handleConditionChange("lowStockThreshold", Number(e.target.value))}
                className="w-24 h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">units - trigger alert when stock drops below this</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Critical Stock Threshold</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={rule.conditions.criticalStockThreshold}
                onChange={(e) => handleConditionChange("criticalStockThreshold", Number(e.target.value))}
                className="w-24 h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">units - urgent alert level</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Auto Reorder</Label>
              <p className="text-xs text-muted-foreground">Automatically place reorder when stock is low</p>
            </div>
            <Switch
              checked={rule.conditions.autoReorder}
              onCheckedChange={(checked: boolean) => handleConditionChange("autoReorder", checked)}
            />
          </div>

          {rule.conditions.autoReorder && (
            <>
              <Separator />
              <div className="space-y-2 py-2">
                <Label className="text-sm font-medium">Reorder Quantity</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={rule.conditions.reorderQuantity}
                    onChange={(e) => handleConditionChange("reorderQuantity", Number(e.target.value))}
                    className="w-24 h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">units to reorder each time</span>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Alert Level</Label>
            <Select
              value={rule.conditions.alertLevel}
              onValueChange={(value) => value && handleConditionChange("alertLevel", value as InventoryAlertLevel)}
            >
              <SelectTrigger className="w-48 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Stock Only</SelectItem>
                <SelectItem value="critical">Critical & Low</SelectItem>
                <SelectItem value="out_of_stock">All Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button size="sm" onClick={() => toast.success("Inventory rules saved!")}>
              Save Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Inventory Alerts
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
                      <Badge className={`text-[10px] ${getAlertLevelColor(alert.level)}`}>
                        {alert.level.replace("_", " ").toUpperCase()}
                      </Badge>
                      {!alert.acknowledged && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">New</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">Stock: {alert.currentStock} / Threshold: {alert.threshold}</span>
                      {alert.autoReorderPlaced && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <ShoppingCart className="size-3" /> Auto reorder placed
                        </span>
                      )}
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
