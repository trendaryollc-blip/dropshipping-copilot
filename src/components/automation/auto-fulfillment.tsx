"use client"

import { useState } from "react"
import { Package, Clock, CheckCircle, AlertTriangle, Settings, Play, Pause } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import type { FulfillmentRule } from "@/types"

export function AutoFulfillment() {
  const [rule, setRule] = useState<FulfillmentRule>({
    id: "fulfillment-1",
    type: "fulfillment",
    name: "Auto-Fulfillment System",
    description: "Automatically process and fulfill orders based on your rules",
    status: "active",
    createdAt: "2024-01-10",
    lastRun: "2024-01-15 14:30",
    nextRun: "2024-01-15 15:00",
    enabled: true,
    conditions: {
      autoProcessOrders: true,
      autoGenerateTracking: true,
      notifyCustomer: true,
      notifySupplier: false,
      minOrderValue: 10,
      excludeWeekends: true,
    },
    stats: {
      ordersProcessed: 156,
      averageProcessingTime: "2.5 hours",
      successRate: 98.5,
    },
  })

  const handleToggle = () => {
    setRule(prev => ({
      ...prev,
      enabled: !prev.enabled,
      status: !prev.enabled ? "active" : "paused"
    }))
    toast.success(rule.enabled ? "Auto-fulfillment paused" : "Auto-fulfillment activated")
  }

  const handleConditionChange = (key: keyof FulfillmentRule["conditions"], value: boolean | number) => {
    setRule(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [key]: value }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Package className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Auto-Fulfillment System</h3>
            <p className="text-sm text-muted-foreground">Automate order processing and fulfillment</p>
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
            {rule.enabled ? <><Pause className="size-3.5 mr-1.5" /> Pause</> : <><Play className="size-3.5 mr-1.5" /> Activate</>}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Package className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.ordersProcessed}</p>
                <p className="text-xs text-muted-foreground">Orders Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.averageProcessingTime}</p>
                <p className="text-xs text-muted-foreground">Avg. Processing Time</p>
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
                <p className="text-2xl font-bold">{rule.stats.successRate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="size-4" />
            Fulfillment Rules
          </CardTitle>
          <CardDescription className="text-xs">
            Configure when and how orders are automatically fulfilled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Auto-Process Orders</Label>
              <p className="text-xs text-muted-foreground">Automatically process pending orders</p>
            </div>
            <Switch
              checked={rule.conditions.autoProcessOrders}
              onCheckedChange={(checked: boolean) => handleConditionChange("autoProcessOrders", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Auto-Generate Tracking</Label>
              <p className="text-xs text-muted-foreground">Generate tracking numbers automatically</p>
            </div>
            <Switch
              checked={rule.conditions.autoGenerateTracking}
              onCheckedChange={(checked: boolean) => handleConditionChange("autoGenerateTracking", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Notify Customer</Label>
              <p className="text-xs text-muted-foreground">Send email when order is shipped</p>
            </div>
            <Switch
              checked={rule.conditions.notifyCustomer}
              onCheckedChange={(checked: boolean) => handleConditionChange("notifyCustomer", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Notify Supplier</Label>
              <p className="text-xs text-muted-foreground">Alert supplier when new order comes in</p>
            </div>
            <Switch
              checked={rule.conditions.notifySupplier}
              onCheckedChange={(checked: boolean) => handleConditionChange("notifySupplier", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Minimum Order Value</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                value={rule.conditions.minOrderValue}
                onChange={(e) => handleConditionChange("minOrderValue", Number(e.target.value))}
                className="w-24 h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">Only auto-fulfill orders above this value</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Exclude Weekends</Label>
              <p className="text-xs text-muted-foreground">Pause auto-fulfillment on weekends</p>
            </div>
            <Switch
              checked={rule.conditions.excludeWeekends}
              onCheckedChange={(checked: boolean) => handleConditionChange("excludeWeekends", checked)}
            />
          </div>

          <div className="pt-4">
            <Button size="sm" onClick={() => toast.success("Fulfillment rules saved!")}>
              Save Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Fulfillment Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "ORD-1042", status: "completed", time: "2 min ago" },
              { id: "ORD-1041", status: "completed", time: "15 min ago" },
              { id: "ORD-1040", status: "completed", time: "1 hr ago" },
              { id: "ORD-1039", status: "pending", time: "2 hrs ago" },
            ].map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  {activity.status === "completed" ? (
                    <CheckCircle className="size-4 text-emerald-500" />
                  ) : (
                    <Clock className="size-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">{activity.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={activity.status === "completed" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"}>
                    {activity.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
