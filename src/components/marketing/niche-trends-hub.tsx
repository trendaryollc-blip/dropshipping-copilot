"use client"

import { useState } from "react"
import { TrendingUp, ArrowUp, ArrowDown, Search, Filter, Plus, Star, Zap, Megaphone, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { NicheTrend } from "@/types"

const mockTrends: NicheTrend[] = [
  { niche: "Wireless Earbuds", trendScore: 92, weeklyChange: 15.3, searchVolume: "128K", competition: "high", topProducts: ["prod-1", "prod-2"], peakSeason: "Q4", emoji: "🎧" },
  { niche: "Eco Water Bottles", trendScore: 87, weeklyChange: 8.7, searchVolume: "84K", competition: "medium", topProducts: ["prod-3"], peakSeason: "Summer", emoji: "🌱" },
  { niche: "Resistance Bands", trendScore: 85, weeklyChange: 12.1, searchVolume: "65K", competition: "low", topProducts: ["prod-4", "prod-5"], peakSeason: "Year-round", emoji: "💪" },
  { niche: "LED Strip Lights", trendScore: 78, weeklyChange: 5.4, searchVolume: "92K", competition: "high", topProducts: ["prod-6"], peakSeason: "Q1", emoji: "💡" },
  { niche: "Portable Blenders", trendScore: 75, weeklyChange: 3.8, searchVolume: "45K", competition: "medium", topProducts: ["prod-7"], peakSeason: "Summer", emoji: "🍓" },
  { niche: "Phone Gimbal", trendScore: 72, weeklyChange: 9.2, searchVolume: "32K", competition: "high", topProducts: ["prod-8"], peakSeason: "Q4", emoji: "📱" },
  { niche: "Gaming Mouse", trendScore: 68, weeklyChange: -2.1, searchVolume: "110K", competition: "high", topProducts: ["prod-9"], peakSeason: "Year-round", emoji: "🖱️" },
  { niche: "Yoga Mats", trendScore: 65, weeklyChange: 4.5, searchVolume: "78K", competition: "medium", topProducts: ["prod-10"], peakSeason: "Spring", emoji: "🧘" },
]

export function NicheTrendsHub() {
  const [trends, setTrends] = useState<NicheTrend[]>(mockTrends)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [sortBy, setSortBy] = useState<"trend" | "volume" | "change">("trend")

  const filtered = trends
    .filter(t => t.niche.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(t => categoryFilter === "all" || t.competition === categoryFilter)
    .sort((a, b) => {
      if (sortBy === "trend") return b.trendScore - a.trendScore
      if (sortBy === "volume") return parseInt(b.searchVolume) - parseInt(a.searchVolume)
      return b.weeklyChange - a.weeklyChange
    })

  const avgTrendScore = trends.reduce((s, t) => s + t.trendScore, 0) / trends.length
  const risingCount = trends.filter(t => t.weeklyChange > 5).length
  const hotNiches = trends.filter(t => t.trendScore >= 80).length

  const RELATED_TOOLS = [
    {
      href: "/campaigns",
      icon: Megaphone,
      label: "Ad Campaigns",
      description: "Promote trending products",
      color: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20 hover:border-indigo-500/50",
      iconBg: "bg-indigo-500/10 text-indigo-600",
      badge: "Ads",
    },
    {
      href: "/products",
      icon: Search,
      label: "Product Research",
      description: "Find trending products",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      badge: "Discover",
    },
    {
      href: "/automation",
      icon: TrendingUp,
      label: "Automation",
      description: "Automate trend alerts",
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
      iconBg: "bg-amber-500/10 text-amber-600",
      badge: "Workflow",
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
              <TrendingUp className="size-3" />
              Trends
            </span>
            <h1 className="hero-title">Niche Trends</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Discover emerging product trends and seasonal demand spikes.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Trending Niches", value: trends.length, icon: TrendingUp, color: "bg-primary/10 text-primary" },
          { label: "Hot Trends (80+)", value: hotNiches, icon: Star, color: "bg-amber-500/10 text-amber-600" },
          { label: "Avg. Trend Score", value: avgTrendScore.toFixed(0), icon: Zap, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Rising Fast", value: risingCount, icon: ArrowUp, color: "bg-indigo-500/10 text-indigo-600" },
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
                {label === "Trending Niches" ? "Total tracked" : label === "Hot Trends (80+)" ? "High demand" : label === "Rising Fast" ? "Strong growth" : "Market health"}
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
            placeholder="Search niches..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={v => setCategoryFilter(v as any)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by competition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Competition</SelectItem>
              <SelectItem value="high">High Competition</SelectItem>
              <SelectItem value="medium">Medium Competition</SelectItem>
              <SelectItem value="low">Low Competition</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trend">Trend Score</SelectItem>
              <SelectItem value="volume">Search Volume</SelectItem>
              <SelectItem value="change">Weekly Change</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* Trends Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((trend) => (
          <Card key={trend.niche} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-card border text-2xl">
                    {trend.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{trend.niche}</p>
                    <p className="text-xs text-muted-foreground">{trend.searchVolume} searches</p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "text-xs",
                    trend.trendScore >= 80 ? "bg-emerald-100 text-emerald-700" :
                    trend.trendScore >= 60 ? "bg-amber-100 text-amber-700" :
                    "bg-muted text-muted-foreground"
                  )}
                >
                  {trend.trendScore}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weekly Change</span>
                  <span className={cn(
                    "flex items-center gap-1 font-medium",
                    trend.weeklyChange > 0 ? "text-emerald-600" : trend.weeklyChange < 0 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {trend.weeklyChange > 0 ? <ArrowUp className="size-3" /> : trend.weeklyChange < 0 ? <ArrowDown className="size-3" /> : null}
                    {Math.abs(trend.weeklyChange)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Competition</span>
                  <Badge variant={trend.competition === "high" ? "destructive" : trend.competition === "medium" ? "secondary" : "outline"} className="text-xs">
                    {trend.competition}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peak Season</span>
                  <span className="font-medium">{trend.peakSeason}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View Products ({trend.topProducts.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No trends match your search criteria.</p>
        </div>
      )}

      {/* Related Tools */}
      <section className="space-y-4 animate-in delay-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Related Tools</h2>
          <span className="text-xs text-muted-foreground">— act on trends</span>
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