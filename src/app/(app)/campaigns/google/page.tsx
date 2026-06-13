import { Megaphone, TrendingUp, MousePointer, ShoppingBag, Plus, Play, Pause, Trash2, DollarSign, BarChart3, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

type CampaignStatus = "active" | "paused" | "draft" | "ended"

interface AdCampaign {
  id: string
  name: string
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

const platformInfo = {
  label: "Google Ads",
  color: "text-primary",
  bg: "bg-primary/10",
  icon: Megaphone,
  description: "Search, display, and shopping ads across Google Search, YouTube, and the Google Display Network.",
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export const metadata = { title: "Google Ads - DropEase Campaigns" }

export default function GoogleCampaignsPage() {
  const campaigns: AdCampaign[] = [
    { id: "1", name: "Wireless Earbuds – Shopping", status: "active", budget: 50, spent: 41.80, roas: 3.8, impressions: 92000, clicks: 3100, ctr: 3.37, conversions: 34, startDate: "2024-01-08" },
    { id: "2", name: "Spring Sale – Search", status: "paused", budget: 35, spent: 35, roas: 3.2, impressions: 61000, clicks: 2200, ctr: 3.61, conversions: 28, startDate: "2024-01-01" },
  ]

  const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
    active: { label: "Active", color: "text-success", bg: "bg-success-light" },
    paused: { label: "Paused", color: "text-warning", bg: "bg-warning-light" },
    draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted" },
    ended: { label: "Ended", color: "text-destructive", bg: "bg-destructive-light" },
  }

  const totalSpend = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalRoas = campaigns.filter(c => c.roas > 0).reduce((s, c) => s + c.roas, 0) / campaigns.filter(c => c.roas > 0).length || 0
  const activeCount = campaigns.filter(c => c.status === "active").length

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Megaphone className="size-3" />
              Campaigns
            </span>
            <h1 className="hero-title">Google Ads</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              {platformInfo.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${platformInfo.bg} ${platformInfo.color} border-transparent`}>
              {activeCount} active campaigns
            </Badge>
            <Button className="shrink-0 rounded-xl">
              <ExternalLink className="size-4 mr-1.5" />
              Connect Google Ads
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpend.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROAS</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoas > 0 ? `${totalRoas.toFixed(1)}x` : "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">Return on ad spend</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MousePointer className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtNum(campaigns.reduce((s, c) => s + c.clicks, 0))}</div>
            <p className="text-xs text-muted-foreground mt-1">All campaigns</p>
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
            <div className="text-2xl font-bold">{campaigns.reduce((s, c) => s + c.conversions, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Attributed sales</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Budget/day</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Conv.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map(campaign => {
                const stat = statusConfig[campaign.status]
                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{campaign.name}</div>
                      <div className="text-xs text-muted-foreground">Since {campaign.startDate}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${stat.bg} ${stat.color} border-transparent text-xs`}>
                        {stat.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${campaign.budget}</TableCell>
                    <TableCell className="text-right">${campaign.spent.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {campaign.roas > 0 ? (
                        <span className={campaign.roas >= 3 ? "text-emerald-600 font-semibold" : "text-amber-600 font-medium"}>
                          {campaign.roas}x
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-right">{fmtNum(campaign.impressions)}</TableCell>
                    <TableCell className="text-right">{fmtNum(campaign.clicks)}</TableCell>
                    <TableCell className="text-right">{campaign.ctr > 0 ? `${campaign.ctr}%` : "—"}</TableCell>
                    <TableCell className="text-right font-medium">{campaign.conversions}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to All Campaigns
        </Link>
      </div>
    </div>
  )
}