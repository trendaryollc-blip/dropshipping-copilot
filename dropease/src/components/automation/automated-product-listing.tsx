"use client"

import { useState } from "react"
import { Package, Upload, CheckCircle, Clock, AlertCircle, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ListingRule {
  id: string
  name: string
  enabled: boolean
  trigger: "trend_score" | "profit_margin" | "demand_score" | "manual_review"
  conditions: {
    minTrendScore: number
    minProfitMargin: number
    minDemandScore: number
    autoPublish: boolean
    platforms: string[]
  }
  stats: {
    productsListed: number
    autoPublished: number
    pendingReview: number
    revenueGenerated: number
  }
}

export function AutomatedProductListing() {
  const [rules, setRules] = useState<ListingRule[]>([
    {
      id: "trending-products",
      name: "Trending Products Auto-List",
      enabled: true,
      trigger: "trend_score",
      conditions: {
        minTrendScore: 75,
        minProfitMargin: 30,
        minDemandScore: 60,
        autoPublish: true,
        platforms: ["shopify", "woocommerce"],
      },
      stats: { productsListed: 45, autoPublished: 38, pendingReview: 7, revenueGenerated: 12500 },
    },
    {
      id: "high-margin",
      name: "High Margin Products",
      enabled: true,
      trigger: "profit_margin",
      conditions: {
        minTrendScore: 50,
        minProfitMargin: 50,
        minDemandScore: 40,
        autoPublish: false,
        platforms: ["shopify"],
      },
      stats: { productsListed: 23, autoPublished: 0, pendingReview: 23, revenueGenerated: 8900 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setRules(rules.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
    toast.success("Listing rule updated")
  }

  const handleTest = (rule: ListingRule) => {
    toast.success(`Test listing created for ${rule.name}`)
  }

  const platforms = [
    { id: "shopify", name: "Shopify" },
    { id: "woocommerce", name: "WooCommerce" },
    { id: "bigcommerce", name: "BigCommerce" },
    { id: "etsy", name: "Etsy" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Automated Product Listing
          </h3>
          <p className="text-sm text-muted-foreground">
            Automatically list high-performing products to your stores
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
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
                  <Badge variant="outline">
                    {rule.trigger.replace("_", " ")}
                  </Badge>
                  {rule.conditions.autoPublish ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Auto-Publish
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
                  <Label className="text-sm font-medium">Listing Criteria</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Min Trend Score:</span>
                      <div className="font-medium">{rule.conditions.minTrendScore}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min Profit Margin:</span>
                      <div className="font-medium">{rule.conditions.minProfitMargin}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min Demand Score:</span>
                      <div className="font-medium">{rule.conditions.minDemandScore}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auto Publish:</span>
                      <div className="font-medium">{rule.conditions.autoPublish ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <Label className="text-sm font-medium">Target Platforms</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rule.conditions.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary">
                        {platforms.find(p => p.id === platform)?.name || platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{rule.stats.productsListed}</div>
                    <div className="text-xs text-muted-foreground">Products Listed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{rule.stats.autoPublished}</div>
                    <div className="text-xs text-muted-foreground">Auto-Published</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{rule.stats.pendingReview}</div>
                    <div className="text-xs text-muted-foreground">Pending Review</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${rule.stats.revenueGenerated.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Revenue Generated</div>
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