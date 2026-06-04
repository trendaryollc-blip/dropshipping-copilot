"use client"

import { useState } from "react"
import { Mail, Send, Users, MousePointerClick, ShoppingCart, Percent, Plus, Edit, Trash2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { EmailMarketingRule, EmailCampaign, EmailTrigger } from "@/types"

export function EmailMarketing() {
  const [rule, setRule] = useState<EmailMarketingRule>({
    id: "email-marketing-1",
    type: "email_marketing",
    name: "Email Marketing Automation",
    description: "Automated email campaigns based on customer actions",
    status: "active",
    createdAt: "2024-01-10",
    lastRun: "2024-01-15 09:00",
    nextRun: "2024-01-15 12:00",
    enabled: true,
    conditions: {
      triggers: ["new_order", "order_shipped", "order_delivered"],
      template: "order_confirmation",
      sendDelay: 1,
      includeDiscount: true,
      discountValue: 10,
    },
    stats: {
      emailsSent: 342,
      openRate: 42.5,
      clickRate: 18.3,
      conversionRate: 8.7,
    },
  })

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: "campaign-1",
      name: "Welcome Series",
      subject: "Welcome to our store! Here's 10% off",
      trigger: "new_order",
      status: "sent",
      recipients: 156,
      sentAt: "2024-01-15",
      openRate: 45.2,
      clickRate: 21.5,
    },
    {
      id: "campaign-2",
      name: "Order Shipped Notification",
      subject: "Your order is on its way! 🚚",
      trigger: "order_shipped",
      status: "sent",
      recipients: 89,
      sentAt: "2024-01-14",
      openRate: 68.3,
      clickRate: 12.4,
    },
    {
      id: "campaign-3",
      name: "Abandoned Cart Recovery",
      subject: "Did you forget something? Complete your purchase",
      trigger: "abandoned_cart",
      status: "scheduled",
      recipients: 45,
      scheduledFor: "2024-01-16 10:00",
    },
  ])

  const handleToggle = () => {
    setRule(prev => ({
      ...prev,
      enabled: !prev.enabled,
      status: !prev.enabled ? "active" : "paused"
    }))
    toast.success(rule.enabled ? "Email marketing paused" : "Email marketing activated")
  }

  const handleConditionChange = (key: keyof EmailMarketingRule["conditions"], value: any) => {
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
          <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
            <Mail className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Email Marketing</h3>
            <p className="text-sm text-muted-foreground">Automated email campaigns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={rule.enabled ? "bg-success-light text-success border-success" : "bg-muted text-muted-foreground border-border"}>
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
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Send className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.emailsSent}</p>
                <p className="text-xs text-muted-foreground">Emails Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-success-light text-success">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.openRate}%</p>
                <p className="text-xs text-muted-foreground">Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <MousePointerClick className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.clickRate}%</p>
                <p className="text-xs text-muted-foreground">Click Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-warning-light text-warning">
                <ShoppingCart className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rule.stats.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="size-4" />
            Email Rules
          </CardTitle>
          <CardDescription className="text-xs">
            Configure automated email triggers and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Trigger Events</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "new_order", label: "New Order" },
                { value: "order_shipped", label: "Order Shipped" },
                { value: "order_delivered", label: "Order Delivered" },
                { value: "abandoned_cart", label: "Abandoned Cart" },
                { value: "low_stock", label: "Low Stock" },
              ].map((trigger) => (
                <button
                  key={trigger.value}
                  onClick={() => {
                    const triggers = rule.conditions.triggers.includes(trigger.value as EmailTrigger)
                      ? rule.conditions.triggers.filter(t => t !== trigger.value)
                      : [...rule.conditions.triggers, trigger.value as EmailTrigger]
                    handleConditionChange("triggers", triggers)
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    rule.conditions.triggers.includes(trigger.value as EmailTrigger)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {trigger.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Email Template</Label>
            <Select
              value={rule.conditions.template}
              onValueChange={(value) => handleConditionChange("template", value)}
            >
              <SelectTrigger className="w-64 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order_confirmation">Order Confirmation</SelectItem>
                <SelectItem value="shipping_notification">Shipping Notification</SelectItem>
                <SelectItem value="delivery_confirmation">Delivery Confirmation</SelectItem>
                <SelectItem value="abandoned_cart">Abandoned Cart Recovery</SelectItem>
                <SelectItem value="welcome">Welcome Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium">Send Delay</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={rule.conditions.sendDelay}
                onChange={(e) => handleConditionChange("sendDelay", Number(e.target.value))}
                className="w-24 h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">hours after trigger event</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Include Discount</Label>
              <p className="text-xs text-muted-foreground">Add discount code to emails</p>
            </div>
            <Switch
              checked={rule.conditions.includeDiscount}
              onCheckedChange={(checked: boolean) => handleConditionChange("includeDiscount", checked)}
            />
          </div>

          {rule.conditions.includeDiscount && (
            <>
              <Separator />
              <div className="space-y-2 py-2">
                <Label className="text-sm font-medium">Discount Value</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={rule.conditions.discountValue}
                    onChange={(e) => handleConditionChange("discountValue", Number(e.target.value))}
                    className="w-24 h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">% off</span>
                </div>
              </div>
            </>
          )}

          <div className="pt-4">
            <Button size="sm" onClick={() => toast.success("Email rules saved!")}>
              Save Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Send className="size-4" />
              Email Campaigns
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => toast.success("Create campaign modal coming soon!")}>
              <Plus className="size-3.5 mr-1.5" /> New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">{campaign.subject}</p>
                  </div>
                  <Badge className={
                    campaign.status === "sent" ? "bg-success-light text-success border-success" :
                    campaign.status === "scheduled" ? "bg-primary-light text-primary border-primary" :
                    "bg-muted text-muted-foreground border-border"
                  }>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="size-3" /> {campaign.recipients} recipients
                  </span>
                  {campaign.openRate && (
                    <span className="flex items-center gap-1">
                      <Users className="size-3" /> {campaign.openRate}% open
                    </span>
                  )}
                  {campaign.clickRate && (
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="size-3" /> {campaign.clickRate}% click
                    </span>
                  )}
                  {campaign.sentAt && <span>{campaign.sentAt}</span>}
                  {campaign.scheduledFor && <span>Scheduled: {campaign.scheduledFor}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Edit className="size-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">
                    <Trash2 className="size-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
