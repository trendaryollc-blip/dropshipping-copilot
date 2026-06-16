"use client"

import { useState } from "react"
import {
  Settings, Package, DollarSign, Mail, AlertTriangle, Zap,
  MessageCircle, ShoppingCart, Users, Upload, Share2, Workflow,
  Truck, Sparkles, Calendar, Shield, ChevronLeft, ChevronRight, Globe,
  BarChart3, Clock, Play, Pause, TrendingUp, Filter as FilterIcon,
  Download, RefreshCw, ExternalLink, Plus, Trash2, CheckCircle,
  Menu, X,
} from "lucide-react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
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

type TabItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
  description: string
}

const tabs: TabItem[] = [
  { id: "fulfillment", label: "Auto-Fulfillment", icon: Package, color: "text-emerald-600", bg: "bg-emerald-100", description: "Automatically process and fulfill orders based on your rules" },
  { id: "price", label: "Price Monitoring", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-100", description: "Track competitor prices and receive real-time alerts" },
  { id: "email", label: "Email Marketing", icon: Mail, color: "text-purple-600", bg: "bg-purple-100", description: "Send automated marketing and transactional emails" },
  { id: "inventory", label: "Inventory Mgmt", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100", description: "Monitor stock levels and trigger reorders automatically" },
  { id: "sms", label: "SMS Marketing", icon: MessageCircle, color: "text-cyan-600", bg: "bg-cyan-100", description: "Send automated text messages to your customers" },
  { id: "workflow", label: "Workflow Automation", icon: Zap, color: "text-teal-600", bg: "bg-teal-100", description: "Build custom automation workflows with conditional logic" },
  { id: "cart", label: "Abandoned Cart", icon: ShoppingCart, color: "text-red-600", bg: "bg-red-100", description: "Recover lost sales from abandoned shopping carts" },
  { id: "lifecycle", label: "Customer Lifecycle", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100", description: "Automate customer journeys based on behavior and events" },
  { id: "dynamic-pricing", label: "Dynamic Pricing", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-100", description: "Automatically adjust prices based on demand and competition" },
  { id: "listing", label: "Product Listing", icon: Upload, color: "text-green-600", bg: "bg-green-100", description: "Auto-generate and optimize product listings across channels" },
  { id: "social", label: "Social Media", icon: Share2, color: "text-pink-600", bg: "bg-pink-100", description: "Schedule and automate social media posts and engagement" },
  { id: "order", label: "Order Processing", icon: Workflow, color: "text-violet-600", bg: "bg-violet-100", description: "Advanced order routing, splitting, and processing rules" },
  { id: "supplier", label: "Supplier Reordering", icon: Truck, color: "text-amber-600", bg: "bg-amber-100", description: "Automate supplier purchase orders and stock replenishment" },
  { id: "upsell", label: "AI Upsell & Cross-sell", icon: Sparkles, color: "text-rose-600", bg: "bg-rose-100", description: "AI-powered product recommendations to increase order value" },
  { id: "seasonal", label: "Seasonal Campaigns", icon: Calendar, color: "text-sky-600", bg: "bg-sky-100", description: "Schedule and automate seasonal promotions and campaigns" },
  { id: "compliance", label: "Compliance Reports", icon: Shield, color: "text-gray-600", bg: "bg-gray-100", description: "Generate compliance reports and audit logs automatically" },
  { id: "ai-hub", label: "AI Automation Hub", icon: Sparkles, color: "text-violet-600", bg: "bg-violet-100", description: "Access all AI models for different automation tasks" },
  { id: "trendaryo", label: "Trendaryo Sync", icon: Globe, color: "text-blue-600", bg: "bg-blue-100", description: "Manually sync products, prices, and stock with Trendaryo" },
]

// Group tabs into categories
const categories = [
  {
    name: "Operations",
    items: ["fulfillment", "order", "supplier", "inventory"],
  },
  {
    name: "Marketing & Sales",
    items: ["email", "sms", "cart", "lifecycle", "social", "seasonal"],
  },
  {
    name: "Pricing & Products",
    items: ["price", "dynamic-pricing", "listing", "upsell"],
  },
  {
    name: "Advanced",
    items: ["workflow", "compliance", "ai-hub", "trendaryo"],
  },
]

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState("fulfillment")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeTabData = tabs.find(t => t.id === activeTab)!

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-0">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 border-r border-border/60 bg-card/40 backdrop-blur-sm transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden md:w-16 md:overflow-visible"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
            <div className={cn("flex items-center gap-2", !sidebarOpen && "md:hidden")}>
              <div className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10">
                <Zap className="size-3.5 text-violet-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                Automations
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
            </Button>
          </div>

          {/* Sidebar Navigation */}
          <ScrollArea className="flex-1 px-2 py-3">
            <nav className="space-y-5">
              {categories.map((category) => (
                <div key={category.name}>
                  <p className={cn(
                    "mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50",
                    !sidebarOpen && "md:sr-only"
                  )}>
                    {category.name}
                  </p>
                  <div className="space-y-0.5">
                    {category.items.map((tabId) => {
                      const tab = tabs.find(t => t.id === tabId)!
                      const isActive = activeTab === tab.id
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-all duration-150",
                            isActive
                              ? "bg-violet-500/10 text-violet-700 dark:text-violet-300 font-medium"
                              : "text-muted-foreground/70 hover:bg-accent/50 hover:text-foreground/80"
                          )}
                        >
                          <div className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
                            isActive ? `${tab.bg} ${tab.color}` : "bg-muted/50 text-muted-foreground/60"
                          )}>
                            <tab.icon className="size-3.5" />
                          </div>
                          <span className={cn("truncate", !sidebarOpen && "md:sr-only")}>
                            {tab.label}
                          </span>
                          {isActive && (
                            <div className="ml-auto size-1.5 rounded-full bg-violet-500" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer - Quick Stats */}
          <div className={cn(
            "border-t border-border/40 p-3",
            !sidebarOpen && "md:hidden"
          )}>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">16 Active</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {tabs.length} Tools
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-violet-500/5 via-transparent to-primary/5 p-6 animate-in">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                    <Zap className="size-2.5" />
                    Automation
                  </span>
                </div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {activeTabData.label}
                </h1>
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
                  {activeTabData.description}
                </p>
              </div>

              {/* Prev / Next Navigation */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => {
                    const idx = tabs.findIndex(t => t.id === activeTab)
                    if (idx > 0) setActiveTab(tabs[idx - 1].id)
                  }}
                  disabled={tabs.findIndex(t => t.id === activeTab) === 0}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3rem] text-center">
                  {tabs.findIndex(t => t.id === activeTab) + 1} / {tabs.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => {
                    const idx = tabs.findIndex(t => t.id === activeTab)
                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id)
                  }}
                  disabled={tabs.findIndex(t => t.id === activeTab) === tabs.length - 1}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Quick Stats Row */}
          <div className="grid gap-3 sm:grid-cols-4">
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">Active Automations</CardTitle>
                <Zap className="size-3.5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">16</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">Orders Processed</CardTitle>
                <Package className="size-3.5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">156</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">Emails Sent</CardTitle>
                <Mail className="size-3.5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">342</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">Alerts Triggered</CardTitle>
                <AlertTriangle className="size-3.5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">18</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Tool Content Panel */}
          <div className="rounded-xl border border-border/60 bg-card shadow-sm">
            {/* Panel Header */}
            <div className="flex items-center gap-3 border-b border-border/40 px-5 py-4">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${activeTabData.bg} ${activeTabData.color}`}>
                <activeTabData.icon className="size-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">{activeTabData.label}</h2>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-medium h-5">
                    <span className="mr-1 size-1.5 rounded-full bg-emerald-500 inline-block" />
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-5">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}