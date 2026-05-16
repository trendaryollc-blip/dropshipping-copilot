"use client"

import { useState } from "react"
import {
  Megaphone, TrendingUp, MousePointer, ShoppingBag, Plus,
  Play, Pause, Trash2, DollarSign,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// ─── Types ───────────────────────────────────────────────────────────────────

type AdPlatform = "google" | "meta" | "tiktok"
type CampaignStatus = "active" | "paused" | "draft" | "ended"
type PlatformFilter = "all" | AdPlatform

interface AdCampaign {
  id: string
  name: string
  platform: AdPlatform
  status: CampaignStatus
  budget: number
  spent: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  startDate: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialCampaigns: AdCampaign[] = [
  { id: "1", name: "Wireless Earbuds – Conversion", platform: "meta", status: "active", budget: 30, spent: 22.40, roas: 4.2, impressions: 48200, clicks: 1240, ctr: 2.57, conversions: 18, startDate: "2024-01-10" },
  { id: "2", name: "Spring Sale – Traffic", platform: "google", status: "active", budget: 50, spent: 41.80, roas: 3.8, impressions: 92000, clicks: 3100, ctr: 3.37, conversions: 34, startDate: "2024-01-08" },
  { id: "3", name: "Foldable Bag – Brand Awareness", platform: "tiktok", status: "active", budget: 20, spent: 18.60, roas: 2.1, impressions: 210000, clicks: 4800, ctr: 2.29, conversions: 9, startDate: "2024-01-12" },
  { id: "4", name: "Home Decor – Retargeting", platform: "meta", status: "paused", budget: 25, spent: 14.20, roas: 5.1, impressions: 22400, clicks: 680, ctr: 3.04, conversions: 12, startDate: "2024-01-05" },
  { id: "5", name: "Beauty Products – Video Ad", platform: "tiktok", status: "draft", budget: 40, spent: 0, roas: 0, impressions: 0, clicks: 0, ctr: 0, conversions: 0, startDate: "2024-01-20" },
  { id: "6", name: "Electronics – Shopping", platform: "google", status: "ended", budget: 35, spent: 35, roas: 3.2, impressions: 61000, clicks: 2200, ctr: 3.61, conversions: 28, startDate: "2024-01-01" },
  { id: "7", name: "Resistance Bands – Lookalike", platform: "meta", status: "active", budget: 15, spent: 11.20, roas: 3.5, impressions: 18500, clicks: 520, ctr: 2.81, conversions: 7, startDate: "2024-01-14" },
]

// ─── Config ────────────────────────────────────────────────────────────────────

const platformConfig: Record<AdPlatform, { label: string; color: string; bg: string }> = {
  google: { label: "Google Ads", color: "text-blue-700", bg: "bg-blue-100" },
  meta: { label: "Meta Ads", color: "text-indigo-700", bg: "bg-indigo-100" },
  tiktok: { label: "TikTok Ads", color: "text-pink-700", bg: "bg-pink-100" },
}

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-100" },
  paused: { label: "Paused", color: "text-amber-700", bg: "bg-amber-100" },
  draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },
  ended: { label: "Ended", color: "text-red-700", bg: "bg-red-100" },
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(initialCampaigns)
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPlatform, setNewPlatform] = useState<AdPlatform>("meta")
  const [newBudget, setNewBudget] = useState("")

  const filtered =
    platformFilter === "all" ? campaigns : campaigns.filter(c => c.platform === platformFilter)

  const totalSpend = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0)
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0)
  const roasCampaigns = campaigns.filter(c => c.roas > 0)
  const avgRoas = roasCampaigns.length
    ? roasCampaigns.reduce((s, c) => s + c.roas, 0) / roasCampaigns.length
    : 0

  const toggleStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id !== id) return c
        const next: CampaignStatus =
          c.status === "active" ? "paused" : c.status === "paused" ? "active" : c.status
        toast.success(`Campaign ${next === "active" ? "activated" : "paused"}`)
        return { ...c, status: next }
      })
    )
  }

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id))
    toast.success("Campaign deleted")
  }

  const handleCreate = () => {
    if (!newName.trim() || !newBudget) {
      toast.error("Please fill in all required fields")
      return
    }
    const campaign: AdCampaign = {
      id: String(Date.now()),
      name: newName.trim(),
      platform: newPlatform,
      status: "draft",
      budget: Number(newBudget),
      spent: 0, roas: 0, impressions: 0, clicks: 0, ctr: 0, conversions: 0,
      startDate: new Date().toISOString().slice(0, 10),
    }
    setCampaigns(prev => [campaign, ...prev])
    setCreateOpen(false)
    setNewName("")
    setNewBudget("")
    toast.success("Campaign created as draft")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Ad Campaign Manager</h1>
          <p className="text-muted-foreground">
            Track and optimize your Google, Meta, and TikTok ad campaigns in one place.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus className="size-4 mr-1.5" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ad Spend</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpend.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROAS</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRoas.toFixed(1)}x</div>
            <p className="text-xs text-muted-foreground mt-1">Return on ad spend</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <MousePointer className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtNum(totalClicks)}</div>
            <p className="text-xs text-muted-foreground mt-1">All campaigns combined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <ShoppingBag className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground mt-1">Attributed purchases</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Table */}
      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>Campaigns</CardTitle>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["all", "google", "meta", "tiktok"] as const).map(p => {
                const isAll = p === "all"
                const label = isAll ? "All Platforms" : platformConfig[p].label
                return (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      platformFilter === p
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Budget/day</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Conv.</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(campaign => {
                const plat = platformConfig[campaign.platform]
                const stat = statusConfig[campaign.status]
                const isRunnable = campaign.status === "active" || campaign.status === "paused"
                const spendPct =
                  campaign.budget > 0
                    ? Math.min(100, Math.round((campaign.spent / campaign.budget) * 100))
                    : 0
                return (
                  <TableRow key={campaign.id}>
                    <TableCell className="pl-4">
                      <div className="font-medium text-sm max-w-[200px] truncate">{campaign.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Since {campaign.startDate}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${plat.bg} ${plat.color} border-transparent text-xs`}>
                        {plat.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${stat.bg} ${stat.color} border-transparent text-xs`}>
                        {stat.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">${campaign.budget}</TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm">${campaign.spent.toFixed(2)}</div>
                      {campaign.budget > 0 && (
                        <div className="mt-1 h-1 w-16 rounded-full bg-muted ml-auto overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${spendPct}%` }}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {campaign.roas > 0 ? (
                        <span
                          className={
                            campaign.roas >= 3
                              ? "text-emerald-600 font-semibold"
                              : campaign.roas >= 2
                              ? "text-amber-600 font-medium"
                              : "text-red-500"
                          }
                        >
                          {campaign.roas}x
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {campaign.impressions > 0 ? fmtNum(campaign.impressions) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {campaign.clicks > 0 ? fmtNum(campaign.clicks) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {campaign.ctr > 0 ? `${campaign.ctr}%` : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {campaign.conversions > 0 ? campaign.conversions : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-0.5">
                        {isRunnable && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => toggleStatus(campaign.id)}
                          >
                            {campaign.status === "active" ? (
                              <Pause className="size-3.5 text-amber-600" />
                            ) : (
                              <Play className="size-3.5 text-emerald-600" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="size-3.5 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No campaigns found for the selected platform.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Performance Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(["google", "meta", "tiktok"] as AdPlatform[]).map(p => {
          const platCampaigns = campaigns.filter(c => c.platform === p && c.roas > 0)
          const avgR = platCampaigns.length
            ? platCampaigns.reduce((s, c) => s + c.roas, 0) / platCampaigns.length
            : 0
          const totalSpend = campaigns.filter(c => c.platform === p).reduce((s, c) => s + c.spent, 0)
          const active = campaigns.filter(c => c.platform === p && c.status === "active").length
          const plat = platformConfig[p]
          return (
            <Card key={p}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{plat.label}</CardTitle>
                  <Badge className={`${plat.bg} ${plat.color} border-transparent text-xs`}>
                    {active} active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. ROAS</span>
                  <span className={`font-semibold ${avgR >= 3 ? "text-emerald-600" : avgR >= 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {avgR > 0 ? `${avgR.toFixed(1)}x` : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Spend</span>
                  <span className="font-medium">${totalSpend.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new ad campaign. It will be saved as a draft until you activate it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Campaign Name *</Label>
              <Input
                id="c-name"
                placeholder="e.g. Summer Sale – Conversion"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Platform *</Label>
              <div className="flex gap-2">
                {(["google", "meta", "tiktok"] as AdPlatform[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewPlatform(p)}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                      newPlatform === p
                        ? `${platformConfig[p].bg} ${platformConfig[p].color} border-transparent`
                        : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    {platformConfig[p].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-budget">Daily Budget (USD) *</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="c-budget"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="20.00"
                  value={newBudget}
                  onChange={e => setNewBudget(e.target.value)}
                  className="pl-6"
                />
              </div>
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button onClick={handleCreate}>
              <Megaphone className="size-3.5 mr-1.5" />
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
