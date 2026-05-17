"use client"

import { useState } from "react"
import { nanoid } from "nanoid"
import { Plus, TrendingDown, TrendingUp, Minus, ExternalLink, Trash2, RefreshCw, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { CompetitorProduct } from "@/types"

const INITIAL_COMPETITORS: CompetitorProduct[] = [
  {
    id: "1",
    competitorName: "AliExpress Store",
    productName: "Wireless Earbuds Pro",
    url: "https://aliexpress.com/item/earbuds",
    currentPrice: 28.99,
    previousPrice: 32.5,
    ourPrice: 39.99,
    lastChecked: "2 hours ago",
    priceHistory: [
      { date: "Jan 8", price: 32.5 },
      { date: "Jan 9", price: 31.0 },
      { date: "Jan 10", price: 30.0 },
      { date: "Jan 11", price: 30.0 },
      { date: "Jan 12", price: 28.99 },
    ],
  },
  {
    id: "2",
    competitorName: "eBay Seller",
    productName: "Foldable Travel Bag",
    url: "https://ebay.com/itm/bag",
    currentPrice: 22.5,
    previousPrice: 22.5,
    ourPrice: 27.99,
    lastChecked: "5 hours ago",
    priceHistory: [
      { date: "Jan 8", price: 24.0 },
      { date: "Jan 9", price: 23.0 },
      { date: "Jan 10", price: 22.5 },
      { date: "Jan 11", price: 22.5 },
      { date: "Jan 12", price: 22.5 },
    ],
  },
  {
    id: "3",
    competitorName: "Amazon Seller",
    productName: "Facial Roller Massager",
    url: "https://amazon.com/dp/roller",
    currentPrice: 19.99,
    previousPrice: 16.99,
    ourPrice: 16.99,
    lastChecked: "1 day ago",
    priceHistory: [
      { date: "Jan 8", price: 16.99 },
      { date: "Jan 9", price: 16.99 },
      { date: "Jan 10", price: 18.0 },
      { date: "Jan 11", price: 19.0 },
      { date: "Jan 12", price: 19.99 },
    ],
  },
]

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorProduct[]>(INITIAL_COMPETITORS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ competitorName: "", productName: "", url: "", currentPrice: "", ourPrice: "" })

  function addCompetitor() {
    if (!form.competitorName || !form.productName || !form.currentPrice) {
      toast.error("Please fill all required fields")
      return
    }
    const price = parseFloat(form.currentPrice)
    const newComp: CompetitorProduct = {
      id: nanoid(),
      competitorName: form.competitorName,
      productName: form.productName,
      url: form.url,
      currentPrice: price,
      ourPrice: form.ourPrice ? parseFloat(form.ourPrice) : undefined,
      lastChecked: "Just now",
      priceHistory: [{ date: new Date().toLocaleDateString("en", { month: "short", day: "numeric" }), price }],
    }
    setCompetitors((prev) => [newComp, ...prev])
    setForm({ competitorName: "", productName: "", url: "", currentPrice: "", ourPrice: "" })
    setDialogOpen(false)
    toast.success("Competitor added!")
  }

  function remove(id: string) {
    setCompetitors((prev) => prev.filter((c) => c.id !== id))
    toast.success("Competitor removed")
  }

  function refresh(id: string) {
    setCompetitors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, lastChecked: "Just now" } : c))
    )
    toast.info("Price refreshed")
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Competitor Price Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor competitors' prices and stay ahead with smart alerts.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="size-3.5" /> Add Competitor
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Track a Competitor</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Competitor Name *</Label>
                <Input placeholder="e.g. Amazon Seller" value={form.competitorName} onChange={(e) => setForm((f) => ({ ...f, competitorName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Product Name *</Label>
                <Input placeholder="e.g. Wireless Earbuds Pro" value={form.productName} onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Product URL</Label>
                <Input placeholder="https://..." value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Their Price * ($)</Label>
                  <Input type="number" placeholder="0.00" value={form.currentPrice} onChange={(e) => setForm((f) => ({ ...f, currentPrice: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Our Price ($)</Label>
                  <Input type="number" placeholder="0.00" value={form.ourPrice} onChange={(e) => setForm((f) => ({ ...f, ourPrice: e.target.value }))} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addCompetitor}>Add Competitor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Tracking", value: competitors.length, icon: Bell, color: "bg-blue-100 text-blue-600" },
          { label: "We're Cheaper", value: competitors.filter((c) => c.ourPrice && c.ourPrice < c.currentPrice).length, icon: TrendingDown, color: "bg-green-100 text-green-600" },
          { label: "They're Cheaper", value: competitors.filter((c) => c.ourPrice && c.currentPrice < c.ourPrice).length, icon: TrendingUp, color: "bg-red-100 text-red-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card flex items-center gap-3">
            <div className={`flex size-9 items-center justify-center rounded-lg ${color}`}>
              <Icon className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {competitors.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 rounded-xl border border-dashed border-border text-center">
          <TrendingDown className="size-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No competitors tracked yet</p>
          <p className="text-xs text-muted-foreground">Add competitors to monitor their prices</p>
        </div>
      ) : (
        <div className="space-y-3">
          {competitors.map((comp) => {
            const priceDiff = comp.ourPrice ? comp.currentPrice - comp.ourPrice : null
            const weAreCheaper = priceDiff !== null && priceDiff > 0
            const theyAreCheaper = priceDiff !== null && priceDiff < 0
            const priceChanged = comp.previousPrice && comp.currentPrice !== comp.previousPrice
            const priceDropped = comp.previousPrice && comp.currentPrice < comp.previousPrice

            return (
              <Card key={comp.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold">{comp.productName}</p>
                        {weAreCheaper && <Badge className="text-[10px] bg-green-100 text-green-700 border border-green-200">We're cheaper</Badge>}
                        {theyAreCheaper && <Badge className="text-[10px] bg-red-100 text-red-700 border border-red-200">They're cheaper</Badge>}
                        {priceDropped && priceChanged && <Badge className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200">Price dropped ↓</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{comp.competitorName}</p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">Their Price</p>
                          <p className={cn("text-base font-bold", theyAreCheaper ? "text-red-600" : "text-foreground")}>${comp.currentPrice.toFixed(2)}</p>
                          {priceChanged && comp.previousPrice && (
                            <p className="text-[10px] text-muted-foreground line-through">${comp.previousPrice.toFixed(2)}</p>
                          )}
                        </div>
                        {comp.ourPrice && (
                          <div>
                            <p className="text-muted-foreground">Our Price</p>
                            <p className={cn("text-base font-bold", weAreCheaper ? "text-green-600" : "text-foreground")}>${comp.ourPrice.toFixed(2)}</p>
                          </div>
                        )}
                        {priceDiff !== null && (
                          <div>
                            <p className="text-muted-foreground">Difference</p>
                            <p className={cn("text-base font-bold", weAreCheaper ? "text-green-600" : theyAreCheaper ? "text-red-600" : "text-muted-foreground")}>
                              {priceDiff > 0 ? "+" : ""}{priceDiff.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Mini price history */}
                      <div className="mt-3">
                        <p className="text-[11px] text-muted-foreground mb-1">Price History (last 5 checks)</p>
                        <div className="flex items-end gap-1 h-8">
                          {comp.priceHistory.map((h, i) => {
                            const max = Math.max(...comp.priceHistory.map((p) => p.price))
                            const min = Math.min(...comp.priceHistory.map((p) => p.price))
                            const range = max - min || 1
                            const height = ((h.price - min) / range) * 24 + 8
                            const isLatest = i === comp.priceHistory.length - 1
                            return (
                              <div key={i} className="flex flex-col items-center gap-0.5">
                                <div
                                  style={{ height: `${height}px` }}
                                  className={cn("w-6 rounded-sm", isLatest ? "bg-primary" : "bg-muted-foreground/30")}
                                  title={`${h.date}: $${h.price}`}
                                />
                                <span className="text-[9px] text-muted-foreground">{h.date.split(" ")[1]}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => refresh(comp.id)} title="Refresh price">
                          <RefreshCw className="size-3.5" />
                        </Button>
                        {comp.url && (
                          <a href={comp.url} target="_blank" rel="noopener noreferrer" title="Visit page" className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                        <Button variant="ghost" size="icon-sm" onClick={() => remove(comp.id)} title="Remove" className="text-destructive hover:text-destructive">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Checked: {comp.lastChecked}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
