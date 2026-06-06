"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Truck,
  CreditCard,
  BarChart3,
  MessageCircle,
  Gift,
  Zap,
  ClipboardCheck,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  DollarSign,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { AIActionButton } from "@/components/AIActionButton"
import {
  crmService,
  shippingService,
  paymentService,
  abTestingService,
  smsService,
  pricingService,
  affiliateService,
  workflowService,
} from "@/lib/advanced-features-service"
import type {
  CustomerProfile,
  CustomerSegment,
  PaymentGatewayConfig,
  PaymentTransaction,
  ShippingRate,
  ShipmentTracking,
  ABTest,
  SMSCampaign,
  PricingRule,
  PricingRecommendation,
  AffiliateMember,
  Workflow,
} from "@/types"

export function BusinessOperations() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([])
  const [segments, setSegments] = useState<CustomerSegment[]>([])
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([])
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([])
  const [tracking, setTracking] = useState<ShipmentTracking | null>(null)
  const [abTests, setABTests] = useState<ABTest[]>([])
  const [campaigns, setCampaigns] = useState<SMSCampaign[]>([])
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([])
  const [affiliates, setAffiliates] = useState<AffiliateMember[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState<"fedex" | "ups" | "dhl" | "usps" | "custom">("fedex")
  const [newSMSName, setNewSMSName] = useState("")
  const [newSMSMessage, setNewSMSMessage] = useState("")
  const [newRuleName, setNewRuleName] = useState("")
  const [newAffiliateEmail, setNewAffiliateEmail] = useState("")
  const [workflowName, setWorkflowName] = useState("")

  useEffect(() => {
    async function load() {
      const [customerList, segmentList, gatewayList, transactionList, rateList, testList, smsList, pricingRuleList, priceRecommendations, affiliateList, workflowList] = await Promise.all([
        crmService.getCustomers(),
        crmService.getCustomerSegments(),
        paymentService.getPaymentGateways(),
        paymentService.getRecentTransactions(),
        shippingService.getShippingRates("US", "CA", 2.5),
        abTestingService.getABTests(),
        smsService.getCampaigns(),
        pricingService.getPricingRules(),
        pricingService.getPricingRecommendations("prod_123"),
        affiliateService.getAffiliates(),
        workflowService.getWorkflows(),
      ])

      setCustomers(customerList)
      setSegments(segmentList)
      setGateways(gatewayList)
      setTransactions(transactionList)
      setShippingRates(rateList)
      setABTests(testList)
      setCampaigns(smsList)
      setPricingRules(pricingRuleList)
      setRecommendations(priceRecommendations)
      setAffiliates(affiliateList)
      setWorkflows(workflowList)
    }

    load()
  }, [])

  const handleTrackShipment = async () => {
    if (!trackingNumber) {
      toast.error("Enter a tracking number")
      return
    }
    const result = await shippingService.trackShipment(trackingNumber, carrier)
    setTracking(result)
    toast.success("Shipment tracking loaded")
  }

  const handleCreateSMSCampaign = async () => {
    if (!newSMSName || !newSMSMessage) {
      toast.error("Fill out the SMS campaign fields")
      return
    }
    const newCampaign = await smsService.createSMSCampaign({
      name: newSMSName,
      message: newSMSMessage,
      trigger: "new_order",
      status: "draft",
      recipients: 320,
    })
    setCampaigns([newCampaign, ...campaigns])
    setNewSMSName("")
    setNewSMSMessage("")
    toast.success("SMS campaign created")
  }

  const handleCreatePricingRule = async () => {
    if (!newRuleName) {
      toast.error("Enter a pricing rule name")
      return
    }
    const rule = await pricingService.createPricingRule({
      name: newRuleName,
      type: "competitive",
      targetMargin: 30,
      minPrice: 18,
      maxPrice: 49,
      active: true,
      description: "Auto-adjust price to stay competitive while protecting margin",
    })
    setPricingRules([rule, ...pricingRules])
    setNewRuleName("")
    toast.success("Pricing rule saved")
  }

  const handleInviteAffiliate = async () => {
    if (!newAffiliateEmail) {
      toast.error("Enter an affiliate email")
      return
    }
    const invite = await affiliateService.inviteAffiliate(newAffiliateEmail)
    setAffiliates([invite, ...affiliates])
    setNewAffiliateEmail("")
    toast.success("Affiliate invited")
  }

  const handleCreateWorkflow = async () => {
    if (!workflowName) {
      toast.error("Enter workflow name")
      return
    }
    const workflow = await workflowService.createWorkflow({
      name: workflowName,
      description: "Automatically notify the team for high-priority orders",
      enabled: true,
      trigger: "high_value_order",
      actions: [
        { id: "action-1", type: "notify_team", label: "Notify team", params: { channel: "slack" } },
      ],
    })
    setWorkflows([workflow, ...workflows])
    setWorkflowName("")
    toast.success("Workflow created")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Business Operations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage customers, shipping, payments, and business automation in one place.
          </p>
        </div>
        <AIActionButton
          task="order_processing"
          input={{
            orderId: "BIZ-ANALYSIS",
            customerName: "Business Overview",
            totalAmount: 1500,
            items: [{ name: "Business Analysis", quantity: 1, price: 1500 }],
          }}
          label="AI Business Insights"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="size-4" /> Customer CRM
            </CardTitle>
            <CardDescription className="text-xs">Overview of top customers and segments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {segments.slice(0, 2).map((segment) => (
                <div key={segment.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold">{segment.name}</p>
                  <p className="text-xs text-muted-foreground">{segment.criteria}</p>
                  <p className="mt-2 text-sm">{segment.size} customers</p>
                </div>
              ))}
            </div>
            {customers.slice(0, 3).map((customer) => (
              <div key={customer.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                  <Badge className="bg-primary-light text-primary">{customer.segment}</Badge>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                  <span>Value: ${customer.lifetimeValue.toFixed(2)}</span>
                  <span>Orders: {customer.orders}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Truck className="size-4" /> Shipping Integration
            </CardTitle>
            <CardDescription className="text-xs">Compare rates and track packages in real time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {shippingRates.slice(0, 2).map((rate) => (
                <div key={`${rate.provider}-${rate.service}`} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold">{rate.provider.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{rate.service}</p>
                  <p className="mt-2 text-sm">${rate.cost.toFixed(2)} · {rate.estimatedDelivery}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <Select value={carrier} onValueChange={(value) => setCarrier(value as any)}>
                  <SelectTrigger className="w-full h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="dhl">DHL</SelectItem>
                    <SelectItem value="usps">USPS</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Tracking number"
                  value={trackingNumber}
                  onChange={(event) => setTrackingNumber(event.target.value)}
                />
              </div>
              <Button onClick={handleTrackShipment} className="w-full">
                Track Shipment
              </Button>
              {tracking ? (
                <div className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-semibold">{tracking.provider.toUpperCase()} • {tracking.trackingNumber}</p>
                  <p className="text-muted-foreground">Status: {tracking.status}</p>
                  <div className="mt-2 space-y-2">
                    {tracking.events.map((event) => (
                      <div key={event.timestamp} className="flex justify-between gap-3">
                        <span>{event.description}</span>
                        <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="size-4" /> Payment Processing
            </CardTitle>
            <CardDescription className="text-xs">Gateway status, transaction reconciliation, and payouts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {gateways.map((gateway) => (
                <div key={gateway.provider} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold">{gateway.provider.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{gateway.accountName}</p>
                  <p className="mt-2 text-sm">{gateway.connected ? "Connected" : "Disconnected"}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recent Transactions</p>
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{transaction.customerName}</p>
                      <p className="text-xs text-muted-foreground">{transaction.orderId}</p>
                    </div>
                    <Badge className="bg-success-light text-success">{transaction.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm">${transaction.amount.toFixed(2)} • {transaction.gateway.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="size-4" /> A/B Testing
            </CardTitle>
            <CardDescription className="text-xs">Measure conversion lift and optimize your product pages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {abTests.slice(0, 2).map((test) => (
              <div key={test.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{test.name}</p>
                  <Badge className="bg-primary-light text-primary">{test.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{test.description}</p>
                <div className="mt-3 text-sm text-muted-foreground">
                  {test.variants.length} variants • Confidence {test.confidence}%
                </div>
              </div>
            ))}
            <Button
              onClick={async () => {
                const newTest = await abTestingService.createABTest({
                  name: "Homepage Hero Test",
                  description: "Compare two product page headlines.",
                  variants: [
                    { id: "v1", name: "Hero A", trafficSplit: 50, conversions: 0, revenue: 0, active: true },
                    { id: "v2", name: "Hero B", trafficSplit: 50, conversions: 0, revenue: 0, active: false },
                  ],
                })
                setABTests([newTest, ...abTests])
                toast.success("A/B test created")
              }}
            >
              Create Test
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageCircle className="size-4" /> SMS Marketing
            </CardTitle>
            <CardDescription className="text-xs">Automate SMS notifications and campaign follow-up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Campaign name"
                value={newSMSName}
                onChange={(event) => setNewSMSName(event.target.value)}
              />
              <Textarea
                placeholder="Message content"
                value={newSMSMessage}
                onChange={(event) => setNewSMSMessage(event.target.value)}
                className="min-h-[120px]"
              />
              <Button onClick={handleCreateSMSCampaign} className="w-full">
                Create SMS Campaign
              </Button>
            </div>
            <div className="space-y-3">
              {campaigns.slice(0, 2).map((campaign) => (
                <div key={campaign.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{campaign.name}</p>
                    <Badge className="bg-primary-light text-primary">{campaign.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{campaign.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Gift className="size-4" /> Affiliate Program
            </CardTitle>
            <CardDescription className="text-xs">Recruit affiliates, track referrals, and pay commissions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {affiliates.slice(0, 2).map((affiliate) => (
                <div key={affiliate.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{affiliate.name}</p>
                      <p className="text-xs text-muted-foreground">{affiliate.email}</p>
                    </div>
                    <Badge className="bg-success-light text-success">{affiliate.status}</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {affiliate.referrals} referrals • ${affiliate.earned.toFixed(2)} earned
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <Input
                placeholder="Affiliate email"
                value={newAffiliateEmail}
                onChange={(event) => setNewAffiliateEmail(event.target.value)}
              />
              <Button onClick={handleInviteAffiliate} className="w-full">
                Invite Affiliate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="size-4" /> Dynamic Pricing
            </CardTitle>
            <CardDescription className="text-xs">Create pricing rules and monitor recommended prices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {recommendations.slice(0, 2).map((recommendation) => (
                <div key={recommendation.productId} className="rounded-lg border border-border p-3">
                  <p className="font-semibold">Product {recommendation.productId}</p>
                  <p className="text-xs text-muted-foreground">Current ${recommendation.currentPrice.toFixed(2)}</p>
                  <p className="mt-2 text-sm">Recommended ${recommendation.recommendedPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <Input
                placeholder="New pricing rule name"
                value={newRuleName}
                onChange={(event) => setNewRuleName(event.target.value)}
              />
              <Button onClick={handleCreatePricingRule} className="w-full">
                Add Pricing Rule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ClipboardCheck className="size-4" /> Workflow Automation
            </CardTitle>
            <CardDescription className="text-xs">Build business workflows to trigger notifications, tasks, and approvals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Workflow name"
                value={workflowName}
                onChange={(event) => setWorkflowName(event.target.value)}
              />
              <Button onClick={handleCreateWorkflow} className="w-full">
                Create Workflow
              </Button>
            </div>
            {workflows.slice(0, 3).map((workflow) => (
              <div key={workflow.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{workflow.name}</p>
                  <Badge className="bg-success-light text-success">{workflow.enabled ? "Enabled" : "Paused"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Trigger: {workflow.trigger}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
