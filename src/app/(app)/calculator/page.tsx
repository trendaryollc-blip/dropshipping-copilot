"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  Percent,
  Megaphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calculator,
  RefreshCw,
  Copy,
  Sparkles,
  FileText,
  Tag,
  PenLine,
  Search,
  Bookmark,
  ChevronRight,
  BarChart3,
  ShoppingBag,
  Store,
  ShoppingCart,
  Zap,
  Info,
  ArrowRight,
  Target,
  PlusCircle,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { AIActionButton } from "@/components/AIActionButton"
import type { MarginResult } from "@/types"

interface CalcInputs {
  productCost: number
  sellingPrice: number
  shippingCost: number
  platformFee: number
  paymentFee: number
  paymentFixed: number
  adSpend: number
  returnRate: number
}

const DEFAULTS: CalcInputs = {
  productCost: 12,
  sellingPrice: 39.99,
  shippingCost: 3.5,
  platformFee: 2.9,
  paymentFee: 2.9,
  paymentFixed: 0.3,
  adSpend: 5,
  returnRate: 2,
}

const PLATFORM_PRESETS = [
  {
    name: "Shopify",
    emoji: "🛍️",
    color: "from-green-500/10 to-emerald-500/10 border-green-500/20 hover:border-green-500/40",
    iconColor: "text-green-600",
    platformFee: 2.0,
    paymentFee: 2.9,
    paymentFixed: 0.3,
    description: "Basic plan + Shopify Payments",
  },
  {
    name: "Amazon",
    emoji: "📦",
    color: "from-orange-500/10 to-amber-500/10 border-orange-500/20 hover:border-orange-500/40",
    iconColor: "text-orange-600",
    platformFee: 15,
    paymentFee: 0,
    paymentFixed: 0,
    description: "Referral fee varies by category",
  },
  {
    name: "eBay",
    emoji: "🔴",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40",
    iconColor: "text-blue-600",
    platformFee: 12.9,
    paymentFee: 2.7,
    paymentFixed: 0.3,
    description: "Final value fee + managed payments",
  },
  {
    name: "Etsy",
    emoji: "🎨",
    color: "from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/40",
    iconColor: "text-rose-600",
    platformFee: 6.5,
    paymentFee: 3.0,
    paymentFixed: 0.25,
    description: "Transaction fee + payment processing",
  },
  {
    name: "WooCommerce",
    emoji: "🌐",
    color: "from-purple-500/10 to-violet-500/10 border-purple-500/20 hover:border-purple-500/40",
    iconColor: "text-purple-600",
    platformFee: 0,
    paymentFee: 2.9,
    paymentFixed: 0.3,
    description: "No platform fee, just payment processing",
  },
  {
    name: "TikTok Shop",
    emoji: "🎵",
    color: "from-pink-500/10 to-fuchsia-500/10 border-pink-500/20 hover:border-pink-500/40",
    iconColor: "text-pink-600",
    platformFee: 5.0,
    paymentFee: 2.0,
    paymentFixed: 0,
    description: "Commission + payment processing",
  },
]

interface SavedScenario {
  id: string
  name: string
  inputs: CalcInputs
  result: MarginResult
}

function computeMargin(inputs: CalcInputs): MarginResult {
  const { productCost, sellingPrice, shippingCost, platformFee, paymentFee, paymentFixed, adSpend, returnRate } = inputs
  const grossRevenue = sellingPrice
  const platformFees = (sellingPrice * platformFee) / 100
  const paymentFees = (sellingPrice * paymentFee) / 100 + paymentFixed
  const returnCost = (sellingPrice * returnRate) / 100
  const totalCosts = productCost + shippingCost + platformFees + paymentFees + adSpend + returnCost
  const netProfit = grossRevenue - totalCosts
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0
  const roi = productCost + shippingCost > 0 ? (netProfit / (productCost + shippingCost)) * 100 : 0
  const breakEvenPrice = totalCosts

  return {
    grossRevenue,
    productCost,
    shippingCost,
    platformFees,
    paymentFees,
    adSpend,
    returnCost,
    totalCosts,
    netProfit,
    profitMargin,
    roi,
    breakEvenPrice,
  }
}

function NumInput({
  label,
  value,
  onChange,
  icon: Icon,
  prefix,
  suffix,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  icon: React.ElementType
  prefix?: string
  suffix?: string
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-medium">
        <Icon className="size-3.5 text-muted-foreground" />
        {label}
      </Label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-2.5 text-xs text-muted-foreground pointer-events-none">{prefix}</span>
        )}
        <Input
          type="number"
          min={0}
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={cn("text-sm", prefix && "pl-6", suffix && "pr-8")}
        />
        {suffix && (
          <span className="absolute right-2.5 text-xs text-muted-foreground pointer-events-none">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function profitLabel(margin: number) {
  if (margin >= 30) return { label: "Excellent", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
  if (margin >= 20) return { label: "Good", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
  if (margin >= 10) return { label: "Acceptable", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  if (margin >= 0) return { label: "Thin", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  return { label: "Loss", color: "bg-red-500/10 text-red-600 border-red-500/20" }
}

const RELATED_TOOLS = [
  {
    href: "/description",
    icon: Sparkles,
    label: "Description AI",
    description: "Generate compelling product descriptions that convert",
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/50",
    iconBg: "bg-violet-500/10 text-violet-600",
    badge: "AI-Powered",
  },
  {
    href: "/seo",
    icon: Tag,
    label: "SEO Tools",
    description: "Optimize your listings for Google & marketplace search",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50",
    iconBg: "bg-blue-500/10 text-blue-600",
    badge: "Ranking",
  },
  {
    href: "/bulk-edit",
    icon: PenLine,
    label: "Bulk Edit",
    description: "Update prices, stock & status for multiple products at once",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    badge: "Efficiency",
  },
  {
    href: "/products",
    icon: Search,
    label: "Product Research",
    description: "Find winning products with high profit potential",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-600",
    badge: "Research",
  },
]

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<CalcInputs>(DEFAULTS)
  const [scenarios, setScenarios] = useState<SavedScenario[]>([])
  const [scenarioName, setScenarioName] = useState("")
  const result = useMemo(() => computeMargin(inputs), [inputs])
  const { label, color } = profitLabel(result.profitMargin)

  function set(key: keyof CalcInputs) {
    return (v: number) => setInputs((prev) => ({ ...prev, [key]: v }))
  }

  function reset() {
    setInputs(DEFAULTS)
    toast.info("Reset to defaults")
  }

  function copySummary() {
    const txt = [
      `Profit Margin Calculator – DropEase`,
      `Selling Price: $${result.grossRevenue.toFixed(2)}`,
      `Product Cost: $${result.productCost.toFixed(2)}`,
      `Net Profit: $${result.netProfit.toFixed(2)}`,
      `Profit Margin: ${result.profitMargin.toFixed(1)}%`,
      `ROI: ${result.roi.toFixed(1)}%`,
      `Break-even: $${result.breakEvenPrice.toFixed(2)}`,
    ].join("\n")
    navigator.clipboard.writeText(txt)
    toast.success("Summary copied to clipboard!")
  }

  function applyPreset(preset: typeof PLATFORM_PRESETS[0]) {
    setInputs(prev => ({
      ...prev,
      platformFee: preset.platformFee,
      paymentFee: preset.paymentFee,
      paymentFixed: preset.paymentFixed,
    }))
    toast.success(`${preset.name} fee structure applied!`)
  }

  function saveScenario() {
    const name = scenarioName.trim() || `Scenario ${scenarios.length + 1}`
    setScenarios(prev => [
      { id: Date.now().toString(), name, inputs: { ...inputs }, result: { ...result } },
      ...prev.slice(0, 2),
    ])
    setScenarioName("")
    toast.success(`"${name}" saved!`)
  }

  function deleteScenario(id: string) {
    setScenarios(prev => prev.filter(s => s.id !== id))
    toast.info("Scenario removed")
  }

  const costItems = [
    { label: "Product Cost", value: result.productCost, color: "bg-blue-500" },
    { label: "Shipping", value: result.shippingCost, color: "bg-purple-500" },
    { label: "Platform Fees", value: result.platformFees, color: "bg-amber-500" },
    { label: "Payment Fees", value: result.paymentFees, color: "bg-orange-500" },
    { label: "Ad Spend", value: result.adSpend, color: "bg-pink-500" },
    { label: "Return Allowance", value: result.returnCost, color: "bg-gray-400" },
  ]

  return (
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Calculator className="size-3" />
              Profit Calculator
            </span>
            <h1 className="hero-title">Profit Margin Calculator</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Calculate your true profit after all fees, shipping, and ad costs. Compare platforms and save scenarios.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={reset} className="rounded-xl">
              <RefreshCw className="mr-1.5 size-3.5" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={copySummary} className="rounded-xl">
              <Copy className="mr-1.5 size-3.5" /> Copy Summary
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ Platform Fee Presets ═══ */}
      <section className="space-y-3 animate-in">
        <div className="flex items-center gap-2">
          <Store className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Quick Platform Presets</h2>
          <span className="text-xs text-muted-foreground">— click any platform to auto-fill fee structure</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PLATFORM_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
                preset.color
              )}
            >
              <div className="space-y-2">
                <span className="text-2xl">{preset.emoji}</span>
                <div>
                  <p className={cn("text-sm font-bold", preset.iconColor)}>{preset.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{preset.description}</p>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  Fee: {preset.platformFee}%
                </div>
              </div>
              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 size-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* ── Inputs ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in">
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Input Parameters</h3>
              </div>
              <p className="text-xs text-muted-foreground/70">Enter your product's cost structure</p>
              
              <div className="rounded-xl bg-card/50 p-4 border border-border/30">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Revenue</p>
                <NumInput label="Your Selling Price" value={inputs.sellingPrice} onChange={set("sellingPrice")} icon={DollarSign} prefix="$" hint="What customers pay you" />
              </div>
              
              <div className="rounded-xl bg-card/50 p-4 border border-border/30 space-y-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Product Costs</p>
                <NumInput label="Product Cost (from supplier)" value={inputs.productCost} onChange={set("productCost")} icon={Package} prefix="$" />
                <NumInput label="Shipping Cost" value={inputs.shippingCost} onChange={set("shippingCost")} icon={Truck} prefix="$" />
              </div>
              
              <div className="rounded-xl bg-card/50 p-4 border border-border/30 space-y-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Fees</p>
                <NumInput label="Platform Fee" value={inputs.platformFee} onChange={set("platformFee")} icon={Percent} suffix="%" hint="e.g. 2.9% for Shopify, 15% for Amazon" />
                <NumInput label="Payment Processing Fee" value={inputs.paymentFee} onChange={set("paymentFee")} icon={Percent} suffix="%" hint="e.g. 2.9% for Stripe/PayPal" />
                <NumInput label="Fixed Payment Fee" value={inputs.paymentFixed} onChange={set("paymentFixed")} icon={DollarSign} prefix="$" hint="e.g. $0.30 per transaction" />
              </div>
              
              <div className="rounded-xl bg-card/50 p-4 border border-border/30 space-y-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Variable Costs</p>
                <NumInput label="Ad Spend per Sale" value={inputs.adSpend} onChange={set("adSpend")} icon={Megaphone} prefix="$" hint="Average advertising cost per conversion" />
                <NumInput label="Return Rate" value={inputs.returnRate} onChange={set("returnRate")} icon={RefreshCw} suffix="%" hint="Estimated % of orders returned" />
              </div>
              
              <AIActionButton
                task="dynamic_pricing"
                input={{
                  productName: "Your Product",
                  currentPrice: inputs.sellingPrice,
                  competitorPrices: [inputs.sellingPrice * 0.95, inputs.sellingPrice * 1.05],
                  demandScore: 75,
                  inventoryLevel: 60,
                  marginTarget: 30,
                }}
                label="Get AI Pricing Recommendation"
                variant="default"
                onSuccess={(result) => {
                  toast.success(`Recommended price: $${(result as { recommendedPrice: number }).recommendedPrice}`)
                }}
              />
            </div>
          </div>

          {/* ── Save Scenario ── */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in">
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <Bookmark className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Save Scenario</h3>
              </div>
              <p className="text-xs text-muted-foreground/70">Save your current inputs to compare later (max 3)</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Scenario name (e.g. Shopify Summer)"
                  value={scenarioName}
                  onChange={e => setScenarioName(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" onClick={saveScenario} disabled={scenarios.length >= 3} className="shrink-0 rounded-xl">
                  <PlusCircle className="size-3.5 mr-1" /> Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Net Profit", value: `$${result.netProfit.toFixed(2)}`, icon: DollarSign, positive: result.netProfit >= 0 },
              { label: "Profit Margin", value: `${result.profitMargin.toFixed(1)}%`, icon: Percent, positive: result.profitMargin >= 20 },
              { label: "ROI", value: `${result.roi.toFixed(1)}%`, icon: TrendingUp, positive: result.roi >= 50 },
              { label: "Break-even", value: `$${result.breakEvenPrice.toFixed(2)}`, icon: AlertTriangle, positive: inputs.sellingPrice > result.breakEvenPrice },
            ].map(({ label, value, icon: Icon, positive }, i) => (
              <div key={label} className={`stat-card card-interactive animate-in delay-${Math.min(i % 8 + 1, 8)}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="section-label">{label}</p>
                  {positive ? (
                    <CheckCircle className="size-3.5 text-emerald-500" />
                  ) : (
                    <XCircle className="size-3.5 text-destructive" />
                  )}
                </div>
                <p className={cn("text-lg font-bold", positive ? "text-foreground" : "text-destructive")}>{value}</p>
              </div>
            ))}
          </div>

          {/* Profitability verdict */}
          <div className={`relative overflow-hidden rounded-2xl border-2 p-5 backdrop-blur-sm animate-in delay-1 ${
            result.netProfit >= 0 
              ? "border-emerald-200/50 bg-emerald-500/5 dark:border-emerald-900/50 dark:bg-emerald-950/20" 
              : "border-red-200/50 bg-red-500/5 dark:border-red-900/50 dark:bg-red-950/20"
          }`}>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Profitability Assessment</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {result.netProfit >= 0
                    ? `You earn $${result.netProfit.toFixed(2)} per sale — aim for 20%+ margin for sustainability.`
                    : `You lose $${Math.abs(result.netProfit).toFixed(2)} per sale. Increase price or reduce costs.`}
                </p>
              </div>
              <Badge className={`text-xs font-semibold ${color}`}>{label}</Badge>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-2">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Cost Breakdown</h3>
              </div>
              <p className="text-xs text-muted-foreground/70">Where your revenue goes per sale</p>
              
              <div className="space-y-3">
                {costItems.map((item) => {
                  const pct = result.grossRevenue > 0 ? (item.value / result.grossRevenue) * 100 : 0
                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className={`size-2 rounded-full ${item.color}`} />
                          {item.label}
                        </span>
                        <span className="font-mono text-xs font-bold text-foreground">${item.value.toFixed(2)} ({pct.toFixed(1)}%)</span>
                      </div>
                      <Progress value={Math.min(pct, 100)} className="h-1.5" />
                    </div>
                  )
                })}
                <div className="mt-2 border-t border-border/30 pt-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Total Costs</span>
                    <span className="font-mono text-xs font-bold text-foreground">${result.totalCosts.toFixed(2)} ({result.grossRevenue > 0 ? ((result.totalCosts / result.grossRevenue) * 100).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs font-bold text-primary">
                    <span>Your Profit</span>
                    <span className="font-mono text-xs font-bold text-foreground">${result.netProfit.toFixed(2)} ({result.profitMargin.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-3">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Smart Recommendations</h3>
              </div>
              
              <div className="space-y-2">
                {[
                  {
                    show: result.profitMargin < 20,
                    icon: "💰",
                    text: `Try selling at $${(result.totalCosts / 0.75).toFixed(2)} to achieve a 25% profit margin.`,
                  },
                  {
                    show: inputs.adSpend > result.netProfit * 0.5 && result.netProfit > 0,
                    icon: "📢",
                    text: "Ad spend is eating more than half your profit. Consider organic growth strategies.",
                  },
                  {
                    show: inputs.platformFee > 5,
                    icon: "🏪",
                    text: "Your platform fee is high. Consider building your own Shopify store for lower rates.",
                  },
                  {
                    show: result.profitMargin >= 30,
                    icon: "✅",
                    text: "Excellent margins! This product looks financially viable for scaling.",
                  },
                  {
                    show: result.netProfit < 0,
                    icon: "⚠️",
                    text: `Increase selling price by at least $${(result.totalCosts - inputs.sellingPrice).toFixed(2)} to break even.`,
                  },
                  {
                    show: true,
                    icon: "🎯",
                    text: `Target selling price for 30% margin: $${(result.totalCosts / 0.70).toFixed(2)}`,
                  },
                ]
                  .filter((r) => r.show)
                  .map((r, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-xl bg-card/50 p-2.5 border border-border/20">
                      <span className="text-base">{r.icon}</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{r.text}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Profitability Targets */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-4">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Pricing Targets</h3>
              </div>
              <p className="text-xs text-muted-foreground/70">Required selling prices to hit common margin goals</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[15, 20, 25, 30].map(targetMargin => {
                  const requiredPrice = result.totalCosts > 0 
                    ? result.totalCosts / (1 - targetMargin / 100)
                    : 0
                  const isCurrent = Math.abs(result.profitMargin - targetMargin) < 2
                  return (
                    <div key={targetMargin} className={cn(
                      "rounded-xl border p-3 text-center transition-colors",
                      isCurrent 
                        ? "border-primary/40 bg-primary/5" 
                        : "border-border/30 bg-card/50"
                    )}>
                      <p className={cn("text-xs font-bold", isCurrent ? "text-primary" : "text-muted-foreground")}>{targetMargin}% Margin</p>
                      <p className="text-sm font-bold text-foreground mt-1">${requiredPrice.toFixed(2)}</p>
                      {isCurrent && <Badge className="mt-1 text-[9px] bg-primary/10 text-primary border-primary/20">≈ Current</Badge>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Saved Scenarios Comparison ═══ */}
      {scenarios.length > 0 && (
        <section className="space-y-3 animate-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Saved Scenarios</h2>
              <Badge variant="secondary" className="text-xs">{scenarios.length}/3</Badge>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {scenarios.map((scenario) => {
              const { label: sLabel, color: sColor } = profitLabel(scenario.result.profitMargin)
              return (
                <div key={scenario.id} className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{scenario.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Sell @ ${scenario.inputs.sellingPrice.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => deleteScenario(scenario.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Net Profit", value: `$${scenario.result.netProfit.toFixed(2)}` },
                      { label: "Margin", value: `${scenario.result.profitMargin.toFixed(1)}%` },
                      { label: "ROI", value: `${scenario.result.roi.toFixed(1)}%` },
                      { label: "Total Costs", value: `$${scenario.result.totalCosts.toFixed(2)}` },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-semibold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/30 flex justify-between items-center">
                    <Badge className={cn("text-[10px]", sColor)}>{sLabel}</Badge>
                    <button
                      onClick={() => { setInputs(scenario.inputs); toast.success(`Loaded "${scenario.name}"`) }}
                      className="text-xs text-primary hover:underline"
                    >
                      Load
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══ Profitability Tips ═══ */}
      <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in">
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Info className="size-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-foreground">Profitability Benchmarks</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { range: "< 10%", label: "Unsustainable", desc: "Too thin for long-term growth or ad spend", color: "border-red-500/30 bg-red-500/5 text-red-600" },
              { range: "10–20%", label: "Acceptable", desc: "Works for high-volume items with low returns", color: "border-amber-500/30 bg-amber-500/5 text-amber-600" },
              { range: "20–30%", label: "Healthy", desc: "Industry standard for sustainable dropshipping", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600" },
              { range: "30%+", label: "Excellent", desc: "Scale aggressively with confidence", color: "border-primary/30 bg-primary/5 text-primary" },
            ].map(item => (
              <div key={item.range} className={cn("rounded-xl border p-3", item.color)}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold">{item.range}</p>
                  <Badge className={cn("text-[10px] border", item.color)}>{item.label}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Related Tools ═══ */}
      <section className="space-y-4 animate-in">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Related Tools</h2>
          <span className="text-xs text-muted-foreground">— maximize your product's potential</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED_TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
                  tool.color
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex size-9 items-center justify-center rounded-xl", tool.iconBg)}>
                      <Icon className="size-4" />
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wide">{tool.badge}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tool.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary/80 group-hover:text-primary transition-colors">
                    Open Tool <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
