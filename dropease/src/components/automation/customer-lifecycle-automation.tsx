"use client"

import { useState } from "react"
import { Users, Mail, Calendar, Heart, Gift, RotateCcw } from "lucide-react"
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

interface LifecycleCampaign {
  id: string
  name: string
  trigger: "new_customer" | "birthday" | "inactive_customer" | "loyal_customer"
  enabled: boolean
  sequence: {
    email1: { subject: string; delay: number; template: string }
    email2?: { subject: string; delay: number; template: string }
    email3?: { subject: string; delay: number; template: string }
  }
  stats: {
    sent: number
    openRate: number
    conversionRate: number
  }
}

export function CustomerLifecycleAutomation() {
  const [campaigns, setCampaigns] = useState<LifecycleCampaign[]>([
    {
      id: "welcome-series",
      name: "Welcome Series",
      trigger: "new_customer",
      enabled: true,
      sequence: {
        email1: { subject: "Welcome to our store!", delay: 0, template: "welcome" },
        email2: { subject: "Your first discount - 10% off", delay: 1440, template: "discount" },
        email3: { subject: "How to get the most from our products", delay: 4320, template: "guide" },
      },
      stats: { sent: 245, openRate: 68, conversionRate: 12 },
    },
    {
      id: "birthday-campaign",
      name: "Birthday Campaign",
      trigger: "birthday",
      enabled: true,
      sequence: {
        email1: { subject: "Happy Birthday! Here's a special gift", delay: 0, template: "birthday" },
      },
      stats: { sent: 89, openRate: 82, conversionRate: 18 },
    },
    {
      id: "re-engagement",
      name: "Re-engagement Campaign",
      trigger: "inactive_customer",
      enabled: false,
      sequence: {
        email1: { subject: "We miss you! Come back for 15% off", delay: 0, template: "reengage" },
        email2: { subject: "Last chance - Your exclusive offer expires soon", delay: 2880, template: "final" },
      },
      stats: { sent: 0, openRate: 0, conversionRate: 0 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ))
    toast.success("Campaign status updated")
  }

  const handleTest = (campaign: LifecycleCampaign) => {
    toast.success(`Test sequence started for ${campaign.name}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Lifecycle Automation
          </h3>
          <p className="text-sm text-muted-foreground">
            Automate customer journeys from welcome to loyalty
          </p>
        </div>
        <Button>
          <Gift className="h-4 w-4 mr-2" />
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
                  <Badge variant={campaign.enabled ? "default" : "secondary"}>
                    {campaign.trigger.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(campaign)}
                  >
                    Test
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
                {/* Email Sequence */}
                <div>
                  <Label className="text-sm font-medium">Email Sequence</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{campaign.sequence.email1.subject}</div>
                        <div className="text-xs text-muted-foreground">
                          Sent immediately • Template: {campaign.sequence.email1.template}
                        </div>
                      </div>
                    </div>
                    {campaign.sequence.email2 && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-4 w-4 text-green-500" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{campaign.sequence.email2.subject}</div>
                          <div className="text-xs text-muted-foreground">
                            {campaign.sequence.email2.delay / 60}h delay • Template: {campaign.sequence.email2.template}
                          </div>
                        </div>
                      </div>
                    )}
                    {campaign.sequence.email3 && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-4 w-4 text-purple-500" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{campaign.sequence.email3.subject}</div>
                          <div className="text-xs text-muted-foreground">
                            {campaign.sequence.email3.delay / 60}h delay • Template: {campaign.sequence.email3.template}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{campaign.stats.sent}</div>
                    <div className="text-xs text-muted-foreground">Emails Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{campaign.stats.openRate}%</div>
                    <div className="text-xs text-muted-foreground">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{campaign.stats.conversionRate}%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
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