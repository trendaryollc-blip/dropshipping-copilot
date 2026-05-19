"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Minus, Search, Flame, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { AIActionButton } from "@/components/AIActionButton"
import type { NicheTrend } from "@/types"

const trends: NicheTrend[] = [
  { niche: "Electronics", trendScore: 94, weeklyChange: 8, searchVolume: "2.4M/mo", competition: "medium", topProducts: ["Wireless Earbuds", "Smart Watches", "Phone Holders"], peakSeason: "Nov–Dec (Black Friday)", emoji: "📱" },
  { niche: "Home & Garden", trendScore: 88, weeklyChange: 12, searchVolume: "1.8M/mo", competition: "low", topProducts: ["LED Lamps", "Plant Pots", "Storage Organizers"], peakSeason: "Mar–May (Spring)", emoji: "🏡" },
  { niche: "Sports & Fitness", trendScore: 85, weeklyChange: 6, searchVolume: "3.1M/mo", competition: "medium", topProducts: ["Resistance Bands", "Water Bottles", "Yoga Mats"], peakSeason: "Jan–Feb (New Year), Sep–Oct", emoji: "🏋️" },
  { niche: "Beauty & Skincare", trendScore: 83, weeklyChange: 5, searchVolume: "2.9M/mo", competition: "high", topProducts: ["Face Rollers", "LED Masks", "Oil Diffusers"], peakSeason: "Year-round (peaks Valentine's)", emoji: "✨" },
  { niche: "Fashion & Accessories", trendScore: 79, weeklyChange: -3, searchVolume: "4.2M/mo", competition: "high", topProducts: ["Watch Bands", "Travel Bags", "Magnetic Wallets"], peakSeason: "Oct–Dec", emoji: "👗" },
  { niche: "Pet Supplies", trendScore: 77, weeklyChange: 9, searchVolume: "980K/mo", competition: "low", topProducts: ["Pet Cameras", "Grooming Sets", "Interactive Toys"], peakSeason: "Year-round", emoji: "🐾" },
  { niche: "Baby & Kids", trendScore: 74, weeklyChange: 4, searchVolume: "1.2M/mo", competition: "medium", topProducts: ["Teething Toys", "Night Lights", "Educational Kits"], peakSeason: "Dec (Christmas)", emoji: "👶" },
  { niche: "Eco & Sustainability", trendScore: 72, weeklyChange: 14, searchVolume: "620K/mo", competition: "low", topProducts: ["Reusable Bags", "Bamboo Products", "Solar Gadgets"], peakSeason: "Apr (Earth Day), Year-round", emoji: "🌿" },
  { niche: "Office & Productivity", trendScore: 68, weeklyChange: 2, searchVolume: "850K/mo", competition: "medium", topProducts: ["Desk Organizers", "Cable Managers", "Monitor Stands"], peakSeason: "Aug–Sep (Back to work)", emoji: "💼" },
  { niche: "Toys & Games", trendScore: 65, weeklyChange: -5, searchVolume: "1.5M/mo", competition: "high", topProducts: ["Fidget Spinners", "Puzzle Sets", "RC Cars"], peakSeason: "Nov–Dec", emoji: "🎮" },
]

export default function TrendsPage() {
  const [search, setSearch] = useState("")
  const [aiInsights, setAiInsights] = useState<any>(null)

  const filtered = trends.filter((t) => t.niche.toLowerCase().includes(search.toLowerCase()))
  const sorted = [...filtered].sort((a, b) => b.trendScore - a.trendScore)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Niche Trends</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover emerging product niches with high growth potential.
          </p>
        </div>
        <AIActionButton
          task="seo_optimization"
          input={{ productName: "Market Analysis", niche: "General" }}
          label="AI Trend Analysis"
          onSuccess={setAiInsights}
        />
      </div>

      {/* Top 3 hot niches */}
      <div className="grid gap-3 sm:grid-cols-3">
        {sorted.slice(0, 3).map((t, i) => (
          <Card key={t.niche} className={cn("border-2", i === 0 ? "border-primary/40 bg-primary/5" : "border-border")}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold">{t.niche}</p>
                      {i === 0 && <Flame className="size-3.5 text-orange-500" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{t.searchVolume} searches</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">{t.trendScore}</p>
                  <p className="text-[10px] text-muted-foreground">/ 100</p>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={t.trendScore} className="h-1.5" />
              </div>
              <div className="mt-2 flex items-center gap-1">
                {t.weeklyChange > 0 ? (
                  <TrendingUp className="size-3.5 text-green-500" />
                ) : t.weeklyChange < 0 ? (
                  <TrendingDown className="size-3.5 text-red-500" />
                ) : (
                  <Minus className="size-3.5 text-muted-foreground" />
                )}
                <span className={cn("text-xs font-medium", t.weeklyChange > 0 ? "text-green-600" : t.weeklyChange < 0 ? "text-red-600" : "text-muted-foreground")}>
                  {t.weeklyChange > 0 ? "+" : ""}{t.weeklyChange}% this week
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + full list */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search niches..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <p className="text-xs text-muted-foreground">{sorted.length} niches</p>
      </div>

      <div className="space-y-3">
        {sorted.map((trend, idx) => {
          const compConfig = { low: "bg-green-100 text-green-700 border-green-200", medium: "bg-amber-100 text-amber-700 border-amber-200", high: "bg-red-100 text-red-700 border-red-200" }
          return (
            <Card key={trend.niche} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    #{idx + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-base">{trend.emoji}</span>
                      <p className="text-sm font-semibold">{trend.niche}</p>
                      <Badge className={`text-[10px] border ${compConfig[trend.competition]}`}>
                        {trend.competition} competition
                      </Badge>
                      {trend.weeklyChange >= 10 && (
                        <Badge className="text-[10px] bg-orange-100 text-orange-700 border border-orange-200">
                          🔥 Hot
                        </Badge>
                      )}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 mt-2">
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-0.5">Top Products</p>
                        <div className="flex flex-wrap gap-1">
                          {trend.topProducts.map((p) => (
                            <span key={p} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{p}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-0.5">Peak Season</p>
                        <p className="text-xs text-foreground">{trend.peakSeason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-bold text-foreground">{trend.trendScore}</p>
                    <div className="flex items-center justify-end gap-0.5 mt-0.5">
                      {trend.weeklyChange > 0 ? (
                        <TrendingUp className="size-3 text-green-500" />
                      ) : (
                        <TrendingDown className="size-3 text-red-500" />
                      )}
                      <span className={cn("text-[11px] font-medium", trend.weeklyChange > 0 ? "text-green-600" : "text-red-600")}>
                        {trend.weeklyChange > 0 ? "+" : ""}{trend.weeklyChange}%
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{trend.searchVolume}</p>
                  </div>
                </div>

                {/* Trend bar */}
                <div className="mt-3">
                  <Progress value={trend.trendScore} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
