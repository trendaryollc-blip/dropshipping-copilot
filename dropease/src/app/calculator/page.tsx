"use client"

import { useMemo, useState } from "react"
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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
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
  if (margin >= 30) return { label: "Excellent", color: "bg-green-100 text-green-700 border-green-200" }
  if (margin >= 20) return { label: "Good", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }
  if (margin >= 10) return { label: "Acceptable", color: "bg-amber-100 text-amber-700 border-amber-200" }
  if (margin >= 0) return { label: "Thin", color: "bg-orange-100 text-orange-700 border-orange-200" }
  return { label: "Loss", color: "bg-red-100 text-red-700 border-red-200" }
}

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<CalcInputs>(DEFAULTS)
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

  const costItems = [
    { label: "Product Cost", value: result.productCost, color: "bg-blue-500" },
    { label: "Shipping", value: result.shippingCost, color: "bg-purple-500" },
    { label: "Platform Fees", value: result.platformFees, color: "bg-amber-500" },
    { label: "Payment Fees", value: result.paymentFees, color: "bg-orange-500" },
    { label: "Ad Spend", value: result.adSpend, color: "bg-pink-500" },
    { label: "Return Allowance", value: result.returnCost, color: "bg-gray-400" },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Profit Margin Calculator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Calculate your true profit after all fees, shipping, and ad costs.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCw className="size-3.5" /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={copySummary}>
            <Copy className="size-3.5" /> Copy Summary
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* ── Inputs ── */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="size-4 text-primary" /> Input Parameters
            </CardTitle>
            <CardDescription className="text-xs">Enter your product's cost structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Revenue</p>
              <NumInput label="Your Selling Price" value={inputs.sellingPrice} onChange={set("sellingPrice")} icon={DollarSign} prefix="$" hint="What customers pay you" />
            </div>
            <div className="rounded-lg bg-muted/60 p-3 space-y-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Product Costs</p>
              <NumInput label="Product Cost (from supplier)" value={inputs.productCost} onChange={set("productCost")} icon={Package} prefix="$" />
              <NumInput label="Shipping Cost" value={inputs.shippingCost} onChange={set("shippingCost")} icon={Truck} prefix="$" />
            </div>
            <div className="rounded-lg bg-muted/60 p-3 space-y-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Fees</p>
              <NumInput label="Platform Fee (Shopify/eBay)" value={inputs.platformFee} onChange={set("platformFee")} icon={Percent} suffix="%" hint="e.g. 2.9% for Shopify" />
              <NumInput label="Payment Processing Fee" value={inputs.paymentFee} onChange={set("paymentFee")} icon={Percent} suffix="%" hint="e.g. 2.9% for Stripe/PayPal" />
              <NumInput label="Fixed Payment Fee" value={inputs.paymentFixed} onChange={set("paymentFixed")} icon={DollarSign} prefix="$" hint="e.g. $0.30 per transaction" />
            </div>
            <div className="rounded-lg bg-muted/60 p-3 space-y-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Variable Costs</p>
              <NumInput label="Ad Spend per Sale" value={inputs.adSpend} onChange={set("adSpend")} icon={Megaphone} prefix="$" hint="Average advertising cost per conversion" />
              <NumInput label="Return Rate" value={inputs.returnRate} onChange={set("returnRate")} icon={RefreshCw} suffix="%" hint="Estimated % of orders returned" />
            </div>
          </CardContent>
        </Card>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Net Profit", value: `$${result.netProfit.toFixed(2)}`, icon: DollarSign, positive: result.netProfit >= 0 },
              { label: "Profit Margin", value: `${result.profitMargin.toFixed(1)}%`, icon: Percent, positive: result.profitMargin >= 20 },
              { label: "ROI", value: `${result.roi.toFixed(1)}%`, icon: TrendingUp, positive: result.roi >= 50 },
              { label: "Break-even", value: `$${result.breakEvenPrice.toFixed(2)}`, icon: AlertTriangle, positive: inputs.sellingPrice > result.breakEvenPrice },
            ].map(({ label, value, icon: Icon, positive }) => (
              <div key={label} className="stat-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="section-label">{label}</p>
                  {positive ? (
                    <CheckCircle className="size-3.5 text-green-500" />
                  ) : (
                    <XCircle className="size-3.5 text-destructive" />
                  )}
                </div>
                <p className={cn("text-lg font-bold", positive ? "text-foreground" : "text-destructive")}>{value}</p>
              </div>
            ))}
          </div>

          {/* Profitability verdict */}
          <Card className={cn("border-2", result.netProfit >= 0 ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20")}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Profitability Assessment</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {result.netProfit >= 0
                    ? `You earn $${result.netProfit.toFixed(2)} per sale — aim for 20%+ margin for sustainability.`
                    : `You lose $${Math.abs(result.netProfit).toFixed(2)} per sale. Increase price or reduce costs.`}
                </p>
              </div>
              <Badge className={`text-xs border ${color}`}>{label}</Badge>
            </CardContent>
          </Card>

          {/* Cost breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cost Breakdown</CardTitle>
              <CardDescription className="text-xs">Where your revenue goes per sale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {costItems.map((item) => {
                const pct = result.grossRevenue > 0 ? (item.value / result.grossRevenue) * 100 : 0
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className={`size-2 rounded-full ${item.color}`} />
                        {item.label}
                      </span>
                      <span className="font-medium text-foreground">${item.value.toFixed(2)} ({pct.toFixed(1)}%)</span>
                    </div>
                    <Progress value={Math.min(pct, 100)} className="h-1.5" />
                  </div>
                )
              })}
              <div className="mt-2 border-t border-border pt-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Total Costs</span>
                  <span>${result.totalCosts.toFixed(2)} ({result.grossRevenue > 0 ? ((result.totalCosts / result.grossRevenue) * 100).toFixed(1) : 0}%)</span>
                </div>
                <div className="mt-1 flex justify-between text-xs font-bold text-primary">
                  <span>Your Profit</span>
                  <span>${result.netProfit.toFixed(2)} ({result.profitMargin.toFixed(1)}%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" /> Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
              ]
                .filter((r) => r.show)
                .map((r, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5">
                    <span className="text-base">{r.icon}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.text}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
