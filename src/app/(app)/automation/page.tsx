"use client"

import { useState } from "react"
import {
  Settings, Package, DollarSign, Mail, AlertTriangle, Zap,
  MessageCircle, ShoppingCart, Users, Upload, Share2, Workflow,
  Truck, Sparkles, Calendar, Shield, ChevronLeft, ChevronRight, Globe,
  BarChart3, Clock, Play, Pause, TrendingUp, Filter as FilterIcon,
  Download, RefreshCw, ExternalLink, Plus, Trash2, CheckCircle,
} from "lucide-react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AutoFulfillment } from "@/components/automation/auto-fulfillment"
import { PriceMonitoring } from "@/components/automation/price-monitoring"
import { EmailMarketing } from "@/components/automation/email-marketing"
import { InventoryManagement } from "@/components/automation/inventory-management"
import { SmsMarketing } from "@/components/automation/sms-marketing"
import { WorkflowAutomation } from "@/components/automation/workflow-automation"
import { AbandonedCartRecovery } from "@/components/automation/abandoned-cart-recovery"
import { CustomerLifecycleAutomation } from "@/components/automation/customer-lifecycle-automation"
import { DynamicPricing } from "@/components/automation/dynamic-pricing"
import { AutomatedProductListing } from "@/components/automation/automated-product-listing"
import { SocialMediaAutomation } from "@/components/automation/social-media-automation"
import { AdvancedOrderProcessing } from "@/components/automation/advanced-order-processing"
import { AutomatedSupplierReordering } from "@/components/automation/automated-supplier-reordering"
import { AiPoweredUpsell } from "@/components/automation/ai-powered-upsell"
import { SeasonalCampaignAutomation } from "@/components/automation/seasonal-campaign-automation"
import { AutomatedComplianceReporting } from "@/components/automation/automated-compliance-reporting"
import { AIActionButton } from "@/components/AIActionButton"
import { TrendaryoSync } from "@/components/automation/trendaryo-sync"

const tabs = [
  { id: "fulfillment", label: "Auto-Fulfillment", icon: Package, color: "text-success", bg: "bg-success-light", description: "Automatically process and fulfill orders based on your rules" },
  { id: "price", label: "Price Monitoring", icon: DollarSign, color: "text-primary", bg: "bg-primary-light", description: "Track competitor prices and receive real-time alerts" },
  { id: "email", label: "Email Marketing", icon: Mail, color: "text-accent", bg: "bg-accent-light", description: "Send automated marketing and transactional emails" },
  { id: "inventory", label: "Inventory Management", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100", description: "Monitor stock levels and trigger reorders automatically" },
  { id: "sms", label: "SMS Marketing", icon: MessageCircle, color: "text-cyan-600", bg: "bg-cyan-100", description: "Send automated text messages to your customers" },
  { id: "workflow", label: "Workflow Automation", icon: Zap, color: "text-teal-600", bg: "bg-teal-100", description: "Build custom automation workflows with conditional logic" },
  { id: "cart", label: "Abandoned Cart Recovery", icon: ShoppingCart, color: "text-destructive", bg: "bg-destructive-light", description: "Recover lost sales from abandoned shopping carts" },
  { id: "lifecycle", label: "Customer Lifecycle", icon: Users, color: "text-primary", bg: "bg-primary-light", description: "Automate customer journeys based on behavior and events" },
  { id: "dynamic-pricing", label: "Dynamic Pricing", icon: DollarSign, color: "text-warning", bg: "bg-warning-light", description: "Automatically adjust prices based on demand and competition" },
  { id: "listing", label: "Product Listing", icon: Upload, color: "text-success", bg: "bg-success-light", description: "Auto-generate and optimize product listings across channels" },
  { id: "social", label: "Social Media", icon: Share2, color: "text-pink-600", bg: "bg-pink-100", description: "Schedule and automate social media posts and engagement" },
  { id: "order", label: "Order Processing", icon: Workflow, color: "text-accent", bg: "bg-accent-light", description: "Advanced order routing, splitting, and processing rules" },
  { id: "supplier", label: "Supplier Reordering", icon: Truck, color: "text-warning", bg: "bg-warning-light", description: "Automate supplier purchase orders and stock replenishment" },
  { id: "upsell", label: "AI Upsell & Cross-sell", icon: Sparkles, color: "text-rose-600", bg: "bg-rose-100", description: "AI-powered product recommendations to increase order value" },
  { id: "seasonal", label: "Seasonal Campaigns", icon: Calendar, color: "text-sky-600", bg: "bg-sky-100", description: "Schedule and automate seasonal promotions and campaigns" },
  { id: "compliance", label: "Compliance Reporting", icon: Shield, color: "text-muted-foreground", bg: "bg-muted", description: "Generate compliance reports and audit logs automatically" },
  { id: "ai-hub", label: "AI Automation Hub", icon: Sparkles, color: "text-accent", bg: "bg-accent-light", description: "Access all AI models for different automation tasks" },
  { id: "trendaryo", label: "Trendaryo Sync", icon: Globe, color: "text-blue-600", bg: "bg-blue-100", description: "Manually sync products, prices, and stock with Trendaryo" },
]

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState("fulfillment")

  const activeIndex = tabs.findIndex(t => t.id === activeTab)
  const activeTabData = tabs[activeIndex]

  const goPrev = () => {
    if (activeIndex > 0) setActiveTab(tabs[activeIndex - 1].id)
  }
  const goNext = () => {
    if (activeIndex < tabs.length - 1) setActiveTab(tabs[activeIndex + 1].id)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Zap className="size-3" />
              Automation
            </span>
            <h1 className="hero-title">Automation Tools</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Automate your dropshipping workflow with powerful automation rules, AI insights, and performance tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-success-light text-success">
              <Zap className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Auto-Processed</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Package className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Mail className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground mt-1">Automated campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Triggered</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-warning-light text-warning">
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">Price & inventory alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Recovery Rate</p>
                <p className="text-2xl font-bold">3.2%</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Abandoned cart recovery</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => setActiveTab('cart')}>
              <ExternalLink className="size-3 mr-1" />
              View Details
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <DollarSign className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Revenue Saved</p>
                <p className="text-2xl font-bold">$2,850</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">From price monitoring</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => setActiveTab('price')}>
              <ExternalLink className="size-3 mr-1" />
              View Details
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Package className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Stock Protected</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Auto-reorders placed</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => setActiveTab('supplier')}>
              <ExternalLink className="size-3 mr-1" />
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* All Automation Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Automation Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tabs.map(({ id, label, icon: Icon, color, bg, description }) => (
            <Card
              key={id}
              className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                activeTab === id
                  ? "ring-2 ring-primary shadow-md"
                  : "hover:ring-1 hover:ring-border"
              }`}
              onClick={() => setActiveTab(id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
                    <Icon className="size-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold leading-snug">{label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Automation Detail Panel */}
      <Card className="overflow-hidden">
        {/* Panel Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${activeTabData.bg} ${activeTabData.color}`}>
              <activeTabData.icon className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold leading-tight">
                  {activeTabData.label}
                </h2>
                <Badge className="bg-success-light text-success border-success text-xs font-medium">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                {activeTabData.description}
              </p>
            </div>
          </div>

          {/* Prev / Next Navigation */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">
              {activeIndex + 1} / {tabs.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={goPrev}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">Previous tool</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={goNext}
                disabled={activeIndex === tabs.length - 1}
              >
                <ChevronRight className="size-4" />
                <span className="sr-only">Next tool</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Panel Content */}
        <CardContent className="pt-6 pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="fulfillment"><AutoFulfillment /></TabsContent>
            <TabsContent value="price"><PriceMonitoring /></TabsContent>
            <TabsContent value="email"><EmailMarketing /></TabsContent>
            <TabsContent value="inventory"><InventoryManagement /></TabsContent>
            <TabsContent value="sms"><SmsMarketing /></TabsContent>
            <TabsContent value="workflow"><WorkflowAutomation /></TabsContent>
            <TabsContent value="cart"><AbandonedCartRecovery /></TabsContent>
            <TabsContent value="lifecycle"><CustomerLifecycleAutomation /></TabsContent>
            <TabsContent value="dynamic-pricing"><DynamicPricing /></TabsContent>
            <TabsContent value="listing"><AutomatedProductListing /></TabsContent>
            <TabsContent value="social"><SocialMediaAutomation /></TabsContent>
            <TabsContent value="order"><AdvancedOrderProcessing /></TabsContent>
            <TabsContent value="supplier"><AutomatedSupplierReordering /></TabsContent>
            <TabsContent value="upsell"><AiPoweredUpsell /></TabsContent>
            <TabsContent value="seasonal"><SeasonalCampaignAutomation /></TabsContent>
            <TabsContent value="compliance"><AutomatedComplianceReporting /></TabsContent>
            <TabsContent value="trendaryo"><TrendaryoSync /></TabsContent>
            <TabsContent value="ai-hub">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-600" />
                    AI Automation Hub
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access specialized AI models for different automation tasks.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Order Processing (Groq)</CardTitle></CardHeader>
                    <CardContent>
                      <AIActionButton task="order_processing" input={{orderId:"ORD-1",customerName:"Demo",totalAmount:99,items:[{name:"Item",quantity:1,price:99}]}} label="Run Order AI" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Descriptions (Gemini)</CardTitle></CardHeader>
                    <CardContent>
                      <AIActionButton task="product_description" input={{productName:"Demo",niche:"Electronics",features:["Premium"],priceRange:{min:49,max:79}}} label="Generate Description" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-sm">SEO (DeepSeek)</CardTitle></CardHeader>
                    <CardContent>
                      <AIActionButton task="seo_optimization" input={{productName:"Demo",niche:"Fashion"}} label="Optimize SEO" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Pricing (OpenRouter)</CardTitle></CardHeader>
                    <CardContent>
                      <AIActionButton task="dynamic_pricing" input={{productName:"Demo",currentPrice:99,competitorPrices:[89,109],demandScore:80,inventoryLevel:50,marginTarget:35}} label="Get Pricing" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Fraud (Cloudflare)</CardTitle></CardHeader>
                    <CardContent>
                      <AIActionButton task="fraud_detection" input={{orderAmount:199,customerEmail:"test@example.com",shippingCountry:"US"}} label="Check Risk" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Image Analysis (HF)</CardTitle></CardHeader>
                    <CardContent>
                      <AIActionButton task="image_analysis" input={{imageUrl:"https://picsum.photos/200",productName:"Demo"}} label="Analyze Image" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}