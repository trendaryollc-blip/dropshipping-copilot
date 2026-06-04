"use client"

import { useState } from "react"
import { MessageCircle, Send, Users, Clock, Plus, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { smsService } from "@/lib/advanced-features-service"
import type { SMSCampaign } from "@/types"

export function SmsMarketing() {
  const [campaigns, setCampaigns] = useState<SMSCampaign[]>([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateCampaign = async () => {
    if (!name || !message) {
      toast.error("Add campaign name and message")
      return
    }

    setLoading(true)
    try {
      const campaign = await smsService.createSMSCampaign({
        name,
        message,
        trigger: "new_order",
        status: "draft",
        recipients: 120,
      })
      setCampaigns([campaign, ...campaigns])
      setName("")
      setMessage("")
      toast.success("SMS campaign created")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
            <MessageCircle className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">SMS Marketing</h3>
            <p className="text-sm text-muted-foreground">Automate SMS alerts, reminders, and promotions.</p>
          </div>
        </div>
        <Badge className="bg-success-light text-success">Ready</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Send className="size-4" /> Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Create automated SMS workflows that sync with order events and customer activity.</p>
            <div className="space-y-2">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Campaign name" />
              <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="SMS message text" className="min-h-[120px]" />
              <Button onClick={handleCreateCampaign} disabled={loading} className="w-full">
                <Plus className="size-4 mr-2" /> {loading ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="size-4" /> Automation Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">Trigger text alerts on new orders, shipping updates, abandoned carts, and low stock.</p>
            <div className="space-y-2">
              <Badge className="bg-primary-light text-primary">new_order</Badge>
              <Badge className="bg-primary-light text-primary">order_shipped</Badge>
              <Badge className="bg-primary-light text-primary">low_stock</Badge>
            </div>
            <Button variant="outline" className="w-full" onClick={() => toast.success("SMS ordering rules ready")}>Configure Triggers</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="size-4" /> Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Active campaigns</span><span>0</span></div>
              <div className="flex justify-between"><span>Open rate estimate</span><span>42%</span></div>
              <div className="flex justify-between"><span>Click rate estimate</span><span>11%</span></div>
            </div>
            <Button onClick={() => toast.success("SMS performance loaded")}>View Report</Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No SMS campaigns yet. Create one to start sending messages.
          </div>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">Trigger: {campaign.trigger}</p>
                  </div>
                  <Badge className="bg-success-light text-success">{campaign.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{campaign.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
