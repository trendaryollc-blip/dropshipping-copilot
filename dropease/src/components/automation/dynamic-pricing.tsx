"use client"

import { useState } from "react"
import { TrendingUp, DollarSign, Target, Zap, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface DynamicPricingRule {
  id: string
  name: string
  enabled: boolean
  trigger: "demand_high" | "demand_low" | "competitor_price" | "inventory_low" | "seasonal"
  conditions: {
    threshold: number
    adjustmentType: "percentage" | "fixed"
    adjustmentValue: number
    minPrice?: number
    maxPrice?: number
  }
  stats: {
    adjustments: number
    revenueImpact: number
    avgPriceChange: number
  }
}

export function DynamicPricing() {
  const [rules, setRules] = useState<DynamicPricingRule[]>([
    {
      id: "high-demand",
      name: "High Demand Surge",
      enabled: true,
      trigger: "demand_high",
      conditions: {
        threshold: 50, // 50% increase in searches
        adjustmentType: "percentage",
        adjustmentValue: 15, // +15%
        maxPrice: 200,
      },
      stats: { adjustments: 23, revenueImpact: 1850, avgPriceChange: 12.5 },
    },
    {
      id: "competitor-match",
      name: "Competitor Price Match",
      enabled: true,
      trigger: "competitor_price",
      conditions: {
        threshold: 5, // $5 difference
        adjustmentType: "fixed",
        adjustmentValue: -2, // -$2
        minPrice: 10,
      },
      stats: { adjustments: 67, revenueImpact: -340, avgPriceChange: -2.1 },
    },
    {
      id: "clearance",
      name: "Low Inventory Clearance",
      enabled: false,
      trigger: "inventory_low",
      conditions: {
        threshold: 5, // 5 items left
        adjustmentType: "percentage",
        adjustmentValue: -25, // -25%
        minPrice: 5,
      },
      stats: { adjustments: 0, revenueImpact: 0, avgPriceChange: 0 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setRules(rules.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
    toast.success("Pricing rule updated")
  }

  const handleTest = (rule: DynamicPricingRule) => {
    toast.success(`Test pricing adjustment applied for ${rule.name}`)
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "demand_high": return <TrendingUp className="h-4 w-4 text-green-500" />
      case "demand_low": return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      case "competitor_price": return <Target className="h-4 w-4 text-blue-500" />
      case "inventory_low": return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "seasonal": return <Zap className="h-4 w-4 text-purple-500" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Dynamic Pricing
          </h3>
          <p className="text-sm text-muted-foreground">
            Automatically adjust prices based on market conditions
          </p>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
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
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(rule)}
                  >
                    Test
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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Conditions */}
                <div>
                  <Label className="text-sm font-medium">Conditions</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Trigger Threshold:</span>
                      <div className="font-medium">
                        {rule.trigger === "competitor_price" ? `$${rule.conditions.threshold}` :
                         rule.trigger === "inventory_low" ? `${rule.conditions.threshold} items` :
                         `${rule.conditions.threshold}%`}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price Adjustment:</span>
                      <div className="font-medium">
                        {rule.conditions.adjustmentType === "percentage" ?
                          `${rule.conditions.adjustmentValue > 0 ? "+" : ""}${rule.conditions.adjustmentValue}%` :
                          `${rule.conditions.adjustmentValue > 0 ? "+" : ""}$${rule.conditions.adjustmentValue}`}
                      </div>
                    </div>
                    {rule.conditions.minPrice && (
                      <div>
                        <span className="text-muted-foreground">Min Price:</span>
                        <div className="font-medium">${rule.conditions.minPrice}</div>
                      </div>
                    )}
                    {rule.conditions.maxPrice && (
                      <div>
                        <span className="text-muted-foreground">Max Price:</span>
                        <div className="font-medium">${rule.conditions.maxPrice}</div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{rule.stats.adjustments}</div>
                    <div className="text-xs text-muted-foreground">Adjustments Made</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${rule.stats.revenueImpact >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {rule.stats.revenueImpact >= 0 ? "+" : ""}${rule.stats.revenueImpact}
                    </div>
                    <div className="text-xs text-muted-foreground">Revenue Impact</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${rule.stats.avgPriceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {rule.stats.avgPriceChange >= 0 ? "+" : ""}{rule.stats.avgPriceChange}%
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Price Change</div>
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