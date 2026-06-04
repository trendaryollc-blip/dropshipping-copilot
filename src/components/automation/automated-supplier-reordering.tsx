"use client"

import { useState } from "react"
import { Truck, Package, AlertTriangle, RefreshCw, DollarSign, Clock, TrendingUp, Calendar, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ReorderRule {
  id: string
  name: string
  enabled: boolean
  supplierId: string
  supplierName: string
  trigger: "low_stock" | "sales_velocity" | "seasonal_demand" | "manual_threshold"
  conditions: {
    minStockLevel: number
    reorderQuantity: number
    leadTime: number // days
    safetyStock: number
    autoReorder: boolean
  }
  stats: {
    autoReorders: number
    manualOverrides: number
    stockoutsPrevented: number
    costSavings: number
  }
}

export function AutomatedSupplierReordering() {
  const [rules, setRules] = useState<ReorderRule[]>([
    {
      id: "supplier-a-reorder",
      name: "Supplier A - Auto Reorder",
      enabled: true,
      supplierId: "supplier-a",
      supplierName: "Global Electronics Ltd",
      trigger: "low_stock",
      conditions: {
        minStockLevel: 10,
        reorderQuantity: 50,
        leadTime: 7,
        safetyStock: 20,
        autoReorder: true,
      },
      stats: { autoReorders: 23, manualOverrides: 3, stockoutsPrevented: 5, costSavings: 1250 },
    },
    {
      id: "supplier-b-velocity",
      name: "Supplier B - Sales Velocity",
      enabled: true,
      supplierId: "supplier-b",
      supplierName: "Fashion Forward Inc",
      trigger: "sales_velocity",
      conditions: {
        minStockLevel: 25,
        reorderQuantity: 100,
        leadTime: 14,
        safetyStock: 50,
        autoReorder: false,
      },
      stats: { autoReorders: 0, manualOverrides: 12, stockoutsPrevented: 8, costSavings: 2100 },
    },
    {
      id: "supplier-c-seasonal",
      name: "Supplier C - Seasonal Demand",
      enabled: false,
      supplierId: "supplier-c",
      supplierName: "Home & Garden Co",
      trigger: "seasonal_demand",
      conditions: {
        minStockLevel: 15,
        reorderQuantity: 75,
        leadTime: 21,
        safetyStock: 30,
        autoReorder: true,
      },
      stats: { autoReorders: 0, manualOverrides: 0, stockoutsPrevented: 0, costSavings: 0 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setRules(rules.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
    toast.success("Reorder rule updated")
  }

  const handleTest = (rule: ReorderRule) => {
    toast.success(`Test reorder placed with ${rule.supplierName}`)
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "low_stock": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "sales_velocity": return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "seasonal_demand": return <Calendar className="h-4 w-4 text-green-500" />
      case "manual_threshold": return <Settings className="h-4 w-4 text-gray-500" />
      default: return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Automated Supplier Reordering
          </h3>
          <p className="text-sm text-muted-foreground">
            Automatically reorder products from suppliers based on inventory levels
          </p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid gap-6">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggle(rule.id)}
                    />
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTriggerIcon(rule.trigger)}
                    {rule.trigger.replace("_", " ")}
                  </Badge>
                  {rule.conditions.autoReorder ? (
                    <Badge variant="default" className="bg-success-light text-success">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Auto-Reorder
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Manual Review
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(rule)}
                  >
                    Test Reorder
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(rule.id)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <CardDescription className="mt-2">
                Supplier: {rule.supplierName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Conditions */}
                <div>
                  <Label className="text-sm font-medium">Reorder Conditions</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Min Stock Level:</span>
                      <div className="font-medium">{rule.conditions.minStockLevel} units</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reorder Quantity:</span>
                      <div className="font-medium">{rule.conditions.reorderQuantity} units</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lead Time:</span>
                      <div className="font-medium">{rule.conditions.leadTime} days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Safety Stock:</span>
                      <div className="font-medium">{rule.conditions.safetyStock} units</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{rule.stats.autoReorders}</div>
                    <div className="text-xs text-muted-foreground">Auto Reorders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{rule.stats.manualOverrides}</div>
                    <div className="text-xs text-muted-foreground">Manual Overrides</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{rule.stats.stockoutsPrevented}</div>
                    <div className="text-xs text-muted-foreground">Stockouts Prevented</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${rule.stats.costSavings}</div>
                    <div className="text-xs text-muted-foreground">Cost Savings</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}