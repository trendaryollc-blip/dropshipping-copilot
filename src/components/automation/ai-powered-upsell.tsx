"use client"

import { useState } from "react"
import { Sparkles, Target, ShoppingCart, TrendingUp, Brain, Zap, CheckCircle, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface UpsellRule {
  id: string
  name: string
  enabled: boolean
  trigger: "cart_addition" | "checkout_view" | "order_complete" | "browsing_behavior"
  aiEngine: "openai" | "claude" | "custom"
  conditions: {
    minCartValue: number
    maxRecommendations: number
    recommendationType: "upsell" | "cross_sell" | "bundle"
    personalizationLevel: "basic" | "advanced" | "premium"
  }
  stats: {
    recommendationsShown: number
    recommendationsClicked: number
    additionalRevenue: number
    conversionRate: number
  }
}

export function AiPoweredUpsell() {
  const [rules, setRules] = useState<UpsellRule[]>([
    {
      id: "cart-upsell",
      name: "Cart Upsell Recommendations",
      enabled: true,
      trigger: "cart_addition",
      aiEngine: "openai",
      conditions: {
        minCartValue: 50,
        maxRecommendations: 3,
        recommendationType: "upsell",
        personalizationLevel: "advanced",
      },
      stats: { recommendationsShown: 1247, recommendationsClicked: 186, additionalRevenue: 3420, conversionRate: 14.9 },
    },
    {
      id: "checkout-cross-sell",
      name: "Checkout Cross-Sell",
      enabled: true,
      trigger: "checkout_view",
      aiEngine: "claude",
      conditions: {
        minCartValue: 25,
        maxRecommendations: 2,
        recommendationType: "cross_sell",
        personalizationLevel: "premium",
      },
      stats: { recommendationsShown: 892, recommendationsClicked: 134, additionalRevenue: 2150, conversionRate: 15.0 },
    },
    {
      id: "post-purchase-bundle",
      name: "Post-Purchase Bundles",
      enabled: false,
      trigger: "order_complete",
      aiEngine: "openai",
      conditions: {
        minCartValue: 0,
        maxRecommendations: 1,
        recommendationType: "bundle",
        personalizationLevel: "basic",
      },
      stats: { recommendationsShown: 0, recommendationsClicked: 0, additionalRevenue: 0, conversionRate: 0 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setRules(rules.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
    toast.success("AI upsell rule updated")
  }

  const handleTest = (rule: UpsellRule) => {
    toast.success(`AI recommendations generated for ${rule.name}`)
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "cart_addition": return <ShoppingCart className="h-4 w-4 text-green-500" />
      case "checkout_view": return <Target className="h-4 w-4 text-blue-500" />
      case "order_complete": return <CheckCircle className="h-4 w-4 text-purple-500" />
      case "browsing_behavior": return <TrendingUp className="h-4 w-4 text-orange-500" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  const getAiEngineIcon = (engine: string) => {
    switch (engine) {
      case "openai": return <Brain className="h-4 w-4 text-green-500" />
      case "claude": return <Zap className="h-4 w-4 text-orange-500" />
      case "custom": return <Settings className="h-4 w-4 text-blue-500" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Upsell/Cross-sell
          </h3>
          <p className="text-sm text-muted-foreground">
            Use AI to recommend products and increase average order value
          </p>
        </div>
        <Button>
          <Brain className="h-4 w-4 mr-2" />
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
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getAiEngineIcon(rule.aiEngine)}
                    {rule.aiEngine}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(rule)}
                  >
                    Test AI
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
                  <Label className="text-sm font-medium">AI Configuration</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Min Cart Value:</span>
                      <div className="font-medium">${rule.conditions.minCartValue}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Recommendations:</span>
                      <div className="font-medium">{rule.conditions.maxRecommendations}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <div className="font-medium capitalize">{rule.conditions.recommendationType.replace("_", " ")}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Personalization:</span>
                      <div className="font-medium capitalize">{rule.conditions.personalizationLevel}</div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                    <Brain className="h-4 w-4" />
                    AI Insights
                  </div>
                  <div className="mt-1 text-xs text-purple-600">
                    {rule.conditions.recommendationType === "upsell" &&
                      "Recommending higher-priced alternatives and premium versions"}
                    {rule.conditions.recommendationType === "cross_sell" &&
                      "Suggesting complementary products that pair well together"}
                    {rule.conditions.recommendationType === "bundle" &&
                      "Creating curated bundles with discount incentives"}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{rule.stats.recommendationsShown.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Recommendations Shown</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{rule.stats.recommendationsClicked}</div>
                    <div className="text-xs text-muted-foreground">Recommendations Clicked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${rule.stats.additionalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Additional Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{rule.stats.conversionRate}%</div>
                    <div className="text-xs text-muted-foreground">Conversion Rate</div>
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