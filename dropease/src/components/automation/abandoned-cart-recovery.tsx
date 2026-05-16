"use client"

import { useState } from "react"
import { ShoppingCart, Mail, Clock, TrendingUp, Settings } from "lucide-react"
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

interface AbandonedCartRule {
  id: string
  name: string
  enabled: boolean
  triggerDelay: number // minutes after cart abandonment
  emailSequence: {
    firstEmail: { subject: string; delay: number }
    secondEmail: { subject: string; delay: number }
    thirdEmail: { subject: string; delay: number }
  }
  discountOffer: number
  stats: {
    cartsRecovered: number
    revenueRecovered: number
    recoveryRate: number
  }
}

export function AbandonedCartRecovery() {
  const [rule, setRule] = useState<AbandonedCartRule>({
    id: "abandoned-cart-1",
    name: "Abandoned Cart Recovery",
    enabled: true,
    triggerDelay: 60, // 1 hour
    emailSequence: {
      firstEmail: { subject: "Don't forget your items!", delay: 60 },
      secondEmail: { subject: "Your cart is waiting - 10% off!", delay: 1440 }, // 24 hours
      thirdEmail: { subject: "Last chance - Complete your order", delay: 4320 }, // 72 hours
    },
    discountOffer: 10,
    stats: {
      cartsRecovered: 45,
      revenueRecovered: 2850,
      recoveryRate: 3.2,
    },
  })

  const [editing, setEditing] = useState(false)

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success("Abandoned cart recovery settings saved!")
    setEditing(false)
  }

  const handleTest = () => {
    toast.success("Test email sequence triggered!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Abandoned Cart Recovery
          </h3>
          <p className="text-sm text-muted-foreground">
            Automatically recover lost sales with personalized email sequences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={rule.enabled}
            onCheckedChange={(enabled) => setRule({ ...rule, enabled })}
          />
          <Label>Enabled</Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Automation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trigger Delay (minutes)</Label>
              <Input
                type="number"
                value={rule.triggerDelay}
                onChange={(e) => setRule({ ...rule, triggerDelay: parseInt(e.target.value) })}
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Offer (%)</Label>
              <Input
                type="number"
                value={rule.discountOffer}
                onChange={(e) => setRule({ ...rule, discountOffer: parseInt(e.target.value) })}
                disabled={!editing}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Email Sequence</Label>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3" />
                  <span className="font-medium">First Email</span>
                  <Badge variant="secondary">{rule.emailSequence.firstEmail.delay}m delay</Badge>
                </div>
                <Input
                  placeholder="Subject line"
                  value={rule.emailSequence.firstEmail.subject}
                  onChange={(e) => setRule({
                    ...rule,
                    emailSequence: {
                      ...rule.emailSequence,
                      firstEmail: { ...rule.emailSequence.firstEmail, subject: e.target.value }
                    }
                  })}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3" />
                  <span className="font-medium">Second Email</span>
                  <Badge variant="secondary">{rule.emailSequence.secondEmail.delay}m delay</Badge>
                </div>
                <Input
                  placeholder="Subject line"
                  value={rule.emailSequence.secondEmail.subject}
                  onChange={(e) => setRule({
                    ...rule,
                    emailSequence: {
                      ...rule.emailSequence,
                      secondEmail: { ...rule.emailSequence.secondEmail, subject: e.target.value }
                    }
                  })}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3" />
                  <span className="font-medium">Third Email</span>
                  <Badge variant="secondary">{rule.emailSequence.thirdEmail.delay}m delay</Badge>
                </div>
                <Input
                  placeholder="Subject line"
                  value={rule.emailSequence.thirdEmail.subject}
                  onChange={(e) => setRule({
                    ...rule,
                    emailSequence: {
                      ...rule.emailSequence,
                      thirdEmail: { ...rule.emailSequence.thirdEmail, subject: e.target.value }
                    }
                  })}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              {!editing ? (
                <Button onClick={() => setEditing(true)} variant="outline">
                  Edit Settings
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button onClick={() => setEditing(false)} variant="outline">
                    Cancel
                  </Button>
                </>
              )}
              <Button onClick={handleTest} variant="secondary">
                Test Sequence
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recovery Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{rule.stats.cartsRecovered}</div>
                <div className="text-sm text-muted-foreground">Carts Recovered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">${rule.stats.revenueRecovered.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Revenue Recovered</div>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <div className="text-xl font-semibold">{rule.stats.recoveryRate}%</div>
              <div className="text-sm text-muted-foreground">Recovery Rate</div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Email Sequence Performance</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>First Email</span>
                  <span>65% open rate</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Second Email</span>
                  <span>45% open rate</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Third Email</span>
                  <span>32% open rate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}