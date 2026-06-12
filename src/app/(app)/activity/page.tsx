"use client"

import { useMemo, useState } from "react"
import type { ActivityItem } from "@/types"
import Link from "next/link"
import { Package2, Users, ShoppingCart, FileText, RotateCcw, Bot, ArrowLeft, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { recentActivity } from "@/lib/mock-data"
import { useActivity } from "@/hooks/useData"

const activityAccent: Record<ActivityItem["type"], string> = {
  import: "bg-emerald-400",
  order: "bg-cyan-400",
  supplier: "bg-violet-400",
  description: "bg-fuchsia-400",
  automation: "bg-amber-400",
  return: "bg-rose-400",
}

const activityIconMap: Record<ActivityItem["type"], React.ReactNode> = {
  import: <Package2 className="size-5" />,
  order: <ShoppingCart className="size-5" />,
  supplier: <Users className="size-5" />,
  description: <FileText className="size-5" />,
  automation: <Bot className="size-5" />,
  return: <RotateCcw className="size-5" />,
}

const activityTypes: Array<ActivityItem["type"] | "all"> = ["all", "import", "order", "supplier", "description", "automation", "return"]

const extraActivity: ActivityItem[] = [
  { id: "6", type: "import", message: 'Imported "Bamboo Cutting Board Set" to My Products', time: "4 hrs ago" },
  { id: "7", type: "supplier", message: 'Connected "EcoSupply" as a verified supplier', time: "5 hrs ago" },
  { id: "8", type: "description", message: 'Generated description for "Reusable Water Bottle"', time: "6 hrs ago" },
  { id: "9", type: "order", message: "Order #ORD-1035 marked as Delivered", time: "8 hrs ago" },
  { id: "10", type: "import", message: 'Imported "Essential Oil Diffuser" to My Products', time: "10 hrs ago" },
  { id: "11", type: "supplier", message: 'Trust score updated for "BeautyPro" — now 4.6', time: "12 hrs ago" },
  { id: "12", type: "order", message: "New order #ORD-1031 received from James C.", time: "14 hrs ago" },
  { id: "13", type: "import", message: 'Imported "Candle Making Kit" to My Products', time: "16 hrs ago" },
  { id: "14", type: "return", message: "Return request #RET-44 approved for ORD-1037", time: "18 hrs ago" },
  { id: "15", type: "automation", message: '"Low Stock Alert" rule triggered for "Foldable Travel Bag"', time: "20 hrs ago" },
]

const formatDisplayType = (type: ActivityItem["type"]) => type.charAt(0).toUpperCase() + type.slice(1)

export default function ActivityPage() {
  const { activity } = useActivity()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<ActivityItem["type"] | "all">("all")
  const [visibleCount, setVisibleCount] = useState(8)

  const allActivity = useMemo(() => {
    return activity.length > 0 ? activity : [...recentActivity, ...extraActivity]
  }, [activity])

  const counts = useMemo(() => {
    const initial: Record<ActivityItem["type"] | "all", number> = {
      all: 0,
      import: 0,
      order: 0,
      supplier: 0,
      description: 0,
      automation: 0,
      return: 0,
    }
    allActivity.forEach((item) => {
      initial.all += 1
      initial[item.type] += 1
    })
    return initial
  }, [allActivity])

  const filteredActivity = useMemo(() => {
    return allActivity.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter
      const matchesSearch = !search || item.message.toLowerCase().includes(search.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [allActivity, search, typeFilter])

  const visibleActivity = filteredActivity.slice(0, visibleCount)
  const canLoadMore = visibleActivity.length < filteredActivity.length

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Bot className="size-3" />
              Activity
            </span>
            <h1 className="hero-title">Activity Feed</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Review recent product imports, order updates, supplier actions, and automation events in one elegant page.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/40 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:border-primary/20 hover:bg-card/60 hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> Back to Dashboard
          </Link>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-border/50 bg-card/60 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">Total Activity</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{counts.all}</p>
              </div>
              <div className="rounded-3xl bg-emerald-500/10 p-3 text-emerald-600">
                <Sparkles className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground/70">Events captured across the dashboard, products, suppliers, and automation routines.</p>
          </div>

          <div className="rounded-3xl border border-border/50 bg-card/60 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">Orders & Returns</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{counts.order + counts.return}</p>
              </div>
              <div className="rounded-3xl bg-cyan-500/10 p-3 text-cyan-600">
                <ShoppingCart className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground/70">Order statuses and return requests that moved your business forward.</p>
          </div>

          <div className="rounded-3xl border border-border/50 bg-card/60 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">Imports & Suppliers</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{counts.import + counts.supplier}</p>
              </div>
              <div className="rounded-3xl bg-violet-500/10 p-3 text-violet-600">
                <Users className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground/70">New supplier connections, imported listings, and trust score updates.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/60 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">Activity insights</p>
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl bg-card/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-foreground">Most active event</p>
                <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-amber-700">
                  {formatDisplayType(
                    Object.keys(counts).reduce((current, key) => {
                      if (key === "all") return current
                      return counts[key as ActivityItem["type"]] > counts[current as ActivityItem["type"]] ? (key as ActivityItem["type"]) : (current as ActivityItem["type"])
                    }, "import") as ActivityItem["type"]
                  )}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground/70">The feed is driven by product imports and supplier updates that keep your catalog fresh.</p>
            </div>
            <div className="rounded-3xl bg-card/50 p-4">
              <p className="text-sm font-semibold text-foreground">Automation triggers</p>
              <p className="mt-2 text-sm text-muted-foreground/70">{counts.automation} automation event{counts.automation === 1 ? "" : "s"} captured in the latest activity log.</p>
            </div>
            <div className="rounded-3xl bg-card/50 p-4">
              <p className="text-sm font-semibold text-foreground">Search-ready</p>
              <p className="mt-2 text-sm text-muted-foreground/70">Use the filter bar to isolate orders, supplier events, or automation alerts instantly.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-border/50 bg-card/60 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">Feed controls</p>
            <h2 className="mt-2 text-lg font-bold text-foreground">Search, filter & segment</h2>
            <p className="mt-1 text-sm text-muted-foreground/70">Find the exact activity entries you need, then scan the latest action history with confidence.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search activity..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-[250px]"
            />
            <Button
              variant="outline"
              className="min-w-[140px]"
              onClick={() => {
                setSearch("")
                setTypeFilter("all")
                setVisibleCount(8)
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {activityTypes.map((type) => {
            const isSelected = typeFilter === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/50 bg-card text-muted-foreground hover:border-primary/70 hover:bg-primary/5"
                }`}
              >
                {type === "all" ? "All" : formatDisplayType(type)}{type !== "all" ? ` (${counts[type]})` : ""}
              </button>
            )
          })}
        </div>
      </section>

      <div className="space-y-4">
        {visibleActivity.map((item) => {
          const accent = activityAccent[item.type] || "bg-muted"
          const icon = activityIconMap[item.type] || <Package2 className="size-5" />
          return (
            <div
              key={item.id}
              className="grid gap-4 rounded-[28px] border border-border bg-card-solid p-5 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.20)] transition duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${accent} text-white shadow-lg shadow-[rgba(0,0,0,0.12)]`}>
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-foreground">{item.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.time}</span>
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{formatDisplayType(item.type)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {canLoadMore ? (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setVisibleCount((count) => count + 8)}>
            Load more activity
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/50 bg-card/60 p-6 text-center text-sm text-muted-foreground">
          Showing all available activity entries.
        </div>
      )}
    </div>
  )
}
