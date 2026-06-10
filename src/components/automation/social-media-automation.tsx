"use client"

import { useEffect, useState } from "react"
import { Share2, Calendar, Image, MessageCircle, Heart, Repeat, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { connectSocialPlatform, getSocialConnections, scheduleSocialPost, SocialConnectionStatus } from "@/lib/social-posting-service"

interface SocialCampaign {
  id: string
  name: string
  enabled: boolean
  platform: "instagram" | "facebook" | "twitter" | "tiktok" | "pinterest"
  trigger: "new_product" | "trending_product" | "sale_event" | "scheduled"
  schedule: {
    frequency: "daily" | "weekly" | "custom"
    times: string[]
    daysOfWeek?: number[]
  }
  content: {
    template: string
    includeImage: boolean
    hashtags: string[]
    callToAction: string
  }
  stats: {
    postsPublished: number
    engagement: number
    reach: number
    clicks: number
  }
}

export function SocialMediaAutomation() {
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>([
    {
      id: "instagram-daily",
      name: "Instagram Daily Posts",
      enabled: true,
      platform: "instagram",
      trigger: "scheduled",
      schedule: {
        frequency: "daily",
        times: ["10:00", "15:00"],
      },
      content: {
        template: "Check out this amazing {product}! Perfect for {niche}. Link in bio! 👆",
        includeImage: true,
        hashtags: ["dropshipping", "ecommerce", "shopping"],
        callToAction: "Shop now",
      },
      stats: { postsPublished: 67, engagement: 1240, reach: 8500, clicks: 234 },
    },
    {
      id: "facebook-sales",
      name: "Facebook Sale Announcements",
      enabled: true,
      platform: "facebook",
      trigger: "sale_event",
      schedule: {
        frequency: "custom",
        times: ["09:00"],
      },
      content: {
        template: "🚨 FLASH SALE! {discount}% off on {product_category}! Limited time only!",
        includeImage: true,
        hashtags: ["sale", "discount", "deal"],
        callToAction: "Shop the sale",
      },
      stats: { postsPublished: 12, engagement: 890, reach: 12400, clicks: 456 },
    },
    {
      id: "tiktok-trending",
      name: "TikTok Trending Products",
      enabled: false,
      platform: "tiktok",
      trigger: "trending_product",
      schedule: {
        frequency: "weekly",
        times: ["14:00"],
        daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
      },
      content: {
        template: "POV: You find the perfect {product} for {price} 🤩 #Trending #Viral",
        includeImage: true,
        hashtags: ["tiktokshop", "viral", "trending"],
        callToAction: "Shop now",
      },
      stats: { postsPublished: 0, engagement: 0, reach: 0, clicks: 0 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)
  const [connections, setConnections] = useState<SocialConnectionStatus[]>([])

  useEffect(() => {
    getSocialConnections().then(setConnections)
  }, [])

  const handleConnect = async (platform: SocialConnectionStatus["platform"]) => {
    const updated = await connectSocialPlatform(platform)
    setConnections((current) => current.map((item) => item.platform === updated.platform ? updated : item))
    toast.success(`Connected ${platform} (mock)`)
  }

  const handleToggle = (id: string) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ))
    toast.success("Social campaign updated")
  }

  const handleTest = async (campaign: SocialCampaign) => {
    await scheduleSocialPost({
      platform: campaign.platform,
      caption: campaign.content.template,
      imageUrl: campaign.content.includeImage ? "https://picsum.photos/600/400" : undefined,
      hashtags: campaign.content.hashtags,
      callToAction: campaign.content.callToAction,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
    })
    toast.success(`Social post scheduled for ${campaign.platform}`)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <Image className="h-4 w-4 text-pink-500" />
      case "facebook": return <Share2 className="h-4 w-4 text-blue-500" />
      case "twitter": return <MessageCircle className="h-4 w-4 text-blue-400" />
      case "tiktok": return <Heart className="h-4 w-4 text-black" />
      case "pinterest": return <Image className="h-4 w-4 text-red-500" />
      default: return <Share2 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media Automation
          </h3>
          <p className="text-sm text-muted-foreground">
            Automatically post to social media when products go live or on schedule
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
                    {getPlatformIcon(campaign.platform)}
                    {campaign.platform}
                  </Badge>
                  <Badge variant="secondary">
                    {campaign.trigger.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(campaign)}
                  >
                    Test Post
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
                  <Label className="text-sm font-medium">Schedule</Label>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <div className="font-medium capitalize">{campaign.schedule.frequency}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Times:</span>
                      <div className="font-medium">{campaign.schedule.times.join(", ")}</div>
                    </div>
                    {campaign.schedule.daysOfWeek && (
                      <div>
                        <span className="text-muted-foreground">Days:</span>
                        <div className="font-medium">
                          {campaign.schedule.daysOfWeek.map(d =>
                            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]
                          ).join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                <div>
                  <Label className="text-sm font-medium">Content Template</Label>
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm">{campaign.content.template}</div>
                    <div className="mt-2 flex items-center gap-2">
                      {campaign.content.includeImage && (
                        <Badge variant="secondary" className="text-xs">
                          <Image className="h-3 w-3 mr-1" />
                          Image
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        CTA: {campaign.content.callToAction}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      #{campaign.content.hashtags.join(" #")}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{campaign.stats.postsPublished}</div>
                    <div className="text-xs text-muted-foreground">Posts Published</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{campaign.stats.engagement.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{campaign.stats.reach.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{campaign.stats.clicks}</div>
                    <div className="text-xs text-muted-foreground">Clicks</div>
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