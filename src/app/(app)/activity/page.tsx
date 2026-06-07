import type { ActivityItem } from "@/types"
import Link from "next/link"
import { Package2, Users, ShoppingCart, FileText, RotateCcw, Bot, ArrowLeft } from "lucide-react"
import { recentActivity } from "@/lib/mock-data"

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

export default function ActivityPage() {
  // Extend mock data so "Load more" shows new activity items
  const allActivity: ActivityItem[] = [
    ...recentActivity,
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

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Bot className="size-3" />
              Activity
            </span>
            <h1 className="hero-title">All Recent Activity</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Track all actions across your store in real time.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-3" /> Back to Dashboard
          </Link>
        </div>
      </section>

      <div className="space-y-4">
        {allActivity.map((item) => {
          const accent = activityAccent[item.type] || "bg-muted"
          const icon = activityIconMap[item.type] || <Package2 className="size-5" />
          const displayType = item.type.charAt(0).toUpperCase() + item.type.slice(1)
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-[28px] border border-border bg-card-solid p-4 shadow-[0_8px_36px_-20px_rgba(212,168,83,0.15)] transition duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accent} text-white shadow-lg shadow-[rgba(0,0,0,0.10)]`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.message}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{item.time}</span>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {displayType}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
