"use client"

import { useState } from "react"
import { Search, ShieldCheck, ArrowUp, ArrowDown, Globe, Users, DollarSign, TrendingUp, Filter, Plus, ExternalLink, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { CompetitorProduct } from "@/types"

const mockCompetitors: CompetitorProduct[] = [
  {
    id: "comp-1",
    competitorName: "AliExpress",
    productName: "Wireless Earbuds Pro",
    url: "https://aliexpress.com/item/1005001234567890.html",
    currentPrice: 12.99,
    previousPrice: 15.99,
    ourPrice: 18.99,
    lastChecked: "2024-01-15",
    priceHistory: [
      { date: "2024-01-01", price: 15.99 },
      { date: "2024-01-08", price: 14.99 },
      { date: "2024-01-15", price: 12.99 },
    ],
  },
  {
    id: "comp-2",
    competitorName: "Amazon",
    productName: "Bluetooth Earbuds",
    url: "https://amazon.com/dp/B0XXXXXXX",
    currentPrice: 24.99,
    ourPrice: 18.99,
    lastChecked: "2024-01-15",
    priceHistory: [
      { date: "2024-01-01", price: 29.99 },
      { date: "2024-01-15", price: 24.99 },
    ],
  },
  {
    id: "comp-3",
    competitorName: "eBay",
    productName: "Wireless Earbuds",
    url: "https://ebay.com/itm/123456789",
    currentPrice: 14.50,
    ourPrice: 18.99,
    lastChecked: "2024-01-14",
    priceHistory: [
      { date: "2024-01-01", price: 16.99 },
      { date: "2024-01-08", price: 15.50 },
      { date: "2024-01-14", price: 14.50 },
    ],
  },
  {
    id: "comp-4",
    competitorName: "Walmart",
    productName: "Active Noise Cancelling Earbuds",
    url: "https://walmart.com/ip/123456789",
    currentPrice: 39.99,
    ourPrice: 18.99,
    lastChecked: "2024-01-13",
    priceHistory: [
      { date: "2024-01-01", price: 45.99 },
      { date: "2024-01-13", price: 39.99 },
    ],
  },
]

export function CompetitorTrackerHub() {
  const [competitors, setCompetitors] = useState<CompetitorProduct[]>(mockCompetitors)
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState<"all" | string>("all")

  const filtered = competitors
    .filter(c =>
      c.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.competitorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(c => platformFilter === "all" || c.competitorName.toLowerCase().includes(platformFilter.toLowerCase()))

  const avgPriceDiff = competitors.filter(c => c.ourPrice && c.currentPrice)
    .reduce((s, c) => s + ((c.ourPrice! - c.currentPrice) / c.currentPrice * 100), 0) / competitors.length

  const cheaperCount = competitors.filter(c => c.ourPrice && c.currentPrice && c.ourPrice < c.currentPrice).length

  const RELATED_TOOLS = [
    {
      href: "/products",
      icon: TrendingUp,
      label: "Product Research",
      description: "Find price comparison targets",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      badge: "Discover",
    },
    {
      href: "/automation",
      icon: ShieldCheck,
      label: "Price Monitoring",
      description: "Auto-track competitor prices",
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
      iconBg: "bg-amber-500/10 text-amber-600",
      badge: "Automation",
    },
    {
      href: "/trends",
      icon: TrendingUp,
      label: "Niche Trends",
      description: "Spot market opportunities",
      color: "from-sky-500/10 to-blue-500/10 border-sky-500/20 hover:border-sky-500/50",
      iconBg: "bg-sky-500/10 text-sky-600",
      badge: "Insights",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <ShieldCheck className="size-3" />
              Competitors
            </span>
            <h1 className="hero-title">Competitor Analysis</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Compare your products against top competitors and uncover opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Tracked Products", value: competitors.length, icon: ShieldCheck, color: "bg-primary/10 text-primary" },
          { label: "Price Advantage", value: cheaperCount, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Avg. Diff.", value: `${Math.round(avgPriceDiff)}%`, icon: DollarSign, color: "bg-amber-500/10 text-amber-600" },
          { label: "Platforms", value: 4, icon: Globe, color: "bg-indigo-500/10 text-indigo-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <div className={cn("flex size-8 items-center justify-center rounded-lg", color)}>
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {label === "Tracked Products" ? "Monitored" : label === "Price Advantage" ? "We're cheaper" : label === "Platforms" ? "Watched" : "vs competition"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search competitors or products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="aliexpress">AliExpress</SelectItem>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="ebay">eBay</SelectItem>
              <SelectItem value="walmart">Walmart</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* Competitor Table */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Competitor</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Our Price</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((comp) => {
                const priceDiff = comp.ourPrice && comp.currentPrice
                  ? ((comp.ourPrice - comp.currentPrice) / comp.currentPrice * 100)
                  : 0
                return (
                  <TableRow key={comp.id}>
                    <TableCell>
                      <div className="font-medium text-sm max-w-[180px] truncate">{comp.productName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{comp.competitorName}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${comp.currentPrice.toFixed(2)}</span>
                      {comp.previousPrice && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (was ${comp.previousPrice.toFixed(2)})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${comp.ourPrice?.toFixed(2) ?? "—"}</span>
                    </TableCell>
                    <TableCell>
                      {comp.ourPrice ? (
                        <span className={cn(
                          "flex items-center gap-1 text-sm font-medium",
                          priceDiff < 0 ? "text-emerald-600" : "text-red-500"
                        )}>
                          {priceDiff < 0 ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />}
                          {Math.abs(priceDiff).toFixed(0)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{comp.lastChecked}</span>
                    </TableCell>
                    <TableCell>
                      <a href={comp.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No competitors match your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Tools */}
      <section className="space-y-4 animate-in delay-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Related Tools</h2>
          <span className="text-xs text-muted-foreground">— optimize pricing</span>
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