"use client"

import { useState } from "react"
import { Calendar, Gift, Snowflake, Sun, Leaf, Flame, Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface SeasonalCampaign {
  id: string
  name: string
  enabled: boolean
  season: "winter" | "spring" | "summer" | "fall" | "holiday" | "back_to_school" | "custom"
  trigger: "date_range" | "event_based" | "demand_spike"
  schedule: {
    startDate: string
    endDate: string
    autoStart: boolean
    autoEnd: boolean
  }
  actions: {
    emailCampaigns: boolean
    priceAdjustments: boolean
    socialPosts: boolean
    productSpotlight: boolean
    discountCodes: string[]
  }
  stats: {
    campaignsRun: number
    revenueIncrease: number
    conversionBoost: number
    customerEngagement: number
  }
}

export function SeasonalCampaignAutomation() {
  const [campaigns, setCampaigns] = useState<SeasonalCampaign[]>([
    {
      id: "winter-holiday",
      name: "Winter Holiday Season",
      enabled: true,
      season: "winter",
      trigger: "date_range",
      schedule: {
        startDate: "2024-11-15",
        endDate: "2024-12-31",
        autoStart: true,
        autoEnd: true,
      },
      actions: {
        emailCampaigns: true,
        priceAdjustments: true,
        socialPosts: true,
        productSpotlight: true,
        discountCodes: ["HOLIDAY20", "WINTER15"],
      },
      stats: { campaignsRun: 3, revenueIncrease: 45000, conversionBoost: 25, customerEngagement: 78 },
    },
    {
      id: "summer-sale",
      name: "Summer Clearance Sale",
      enabled: true,
      season: "summer",
      trigger: "date_range",
      schedule: {
        startDate: "2024-07-01",
        endDate: "2024-07-31",
        autoStart: true,
        autoEnd: true,
      },
      actions: {
        emailCampaigns: true,
        priceAdjustments: true,
        socialPosts: false,
        productSpotlight: true,
        discountCodes: ["SUMMER30", "CLEARANCE25"],
      },
      stats: { campaignsRun: 2, revenueIncrease: 28500, conversionBoost: 18, customerEngagement: 65 },
    },
    {
      id: "back-to-school",
      name: "Back to School Promotion",
      enabled: false,
      season: "back_to_school",
      trigger: "date_range",
      schedule: {
        startDate: "2024-08-01",
        endDate: "2024-08-31",
        autoStart: false,
        autoEnd: true,
      },
      actions: {
        emailCampaigns: true,
        priceAdjustments: false,
        socialPosts: true,
        productSpotlight: true,
        discountCodes: ["BTS15"],
      },
      stats: { campaignsRun: 0, revenueIncrease: 0, conversionBoost: 0, customerEngagement: 0 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ))
    toast.success("Seasonal campaign updated")
  }

  const handleTest = (campaign: SeasonalCampaign) => {
    toast.success(`Test campaign activated for ${campaign.name}`)
  }

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case "winter": return <Snowflake className="h-4 w-4 text-blue-500" />
      case "spring": return <Leaf className="h-4 w-4 text-green-500" />
      case "summer": return <Sun className="h-4 w-4 text-yellow-500" />
      case "fall": return <Flame className="h-4 w-4 text-orange-500" />
      case "holiday": return <Gift className="h-4 w-4 text-red-500" />
      case "back_to_school": return <Target className="h-4 w-4 text-purple-500" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "date_range": return <Calendar className="h-4 w-4 text-green-500" />
      case "event_based": return <Gift className="h-4 w-4 text-purple-500" />
      case "demand_spike": return <TrendingUp className="h-4 w-4 text-orange-500" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seasonal Campaign Automation
          </h3>
          <p className="text-sm text-muted-foreground">
            Automatically launch marketing campaigns based on seasons and events
          </p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={campaign.enabled}
                      onCheckedChange={() => handleToggle(campaign.id)}
                    />
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getSeasonIcon(campaign.season)}
                    {campaign.season.replace("_", " ")}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getTriggerIcon(campaign.trigger)}
                    {campaign.trigger.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(campaign)}
                  >
                    Test Campaign
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(campaign.id)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Schedule */}
                <div>
                  <Label className="text-sm font-medium">Campaign Schedule</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>
                      <div className="font-medium">{new Date(campaign.schedule.startDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End Date:</span>
                      <div className="font-medium">{new Date(campaign.schedule.endDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auto Start:</span>
                      <div className="font-medium">{campaign.schedule.autoStart ? "Yes" : "No"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auto End:</span>
                      <div className="font-medium">{campaign.schedule.autoEnd ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <Label className="text-sm font-medium">Automated Actions</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {campaign.actions.emailCampaigns && (
                      <Badge variant="secondary">📧 Email Campaigns</Badge>
                    )}
                    {campaign.actions.priceAdjustments && (
                      <Badge variant="secondary">💰 Price Adjustments</Badge>
                    )}
                    {campaign.actions.socialPosts && (
                      <Badge variant="secondary">📱 Social Posts</Badge>
                    )}
                    {campaign.actions.productSpotlight && (
                      <Badge variant="secondary">⭐ Product Spotlight</Badge>
                    )}
                    {campaign.actions.discountCodes.map((code) => (
                      <Badge key={code} variant="outline" className="bg-green-50 text-green-700">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{campaign.stats.campaignsRun}</div>
                    <div className="text-xs text-muted-foreground">Campaigns Run</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${campaign.stats.revenueIncrease.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Revenue Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">+{campaign.stats.conversionBoost}%</div>
                    <div className="text-xs text-muted-foreground">Conversion Boost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{campaign.stats.customerEngagement}%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
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