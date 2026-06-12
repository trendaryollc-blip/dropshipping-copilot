import Link from "next/link"
import { Star, ShoppingCart, Tag, MessageSquare, BarChart3, Zap, ArrowRight } from "lucide-react"
import ReviewsManager from "@/components/reviews/reviews-manager"
import { AIActionButton } from "@/components/AIActionButton"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const RELATED_TOOLS = [
  {
    href: "/orders",
    icon: ShoppingCart,
    label: "Orders",
    description: "View order-linked reviews",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50",
    iconBg: "bg-blue-500/10 text-blue-600",
    badge: "Fulfillment",
  },
  {
    href: "/returns",
    icon: Tag,
    label: "Returns",
    description: "Handle review-disputed items",
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/50",
    iconBg: "bg-violet-500/10 text-violet-600",
    badge: "Support",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    label: "Analytics",
    description: "Analyze review trends",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    badge: "Insights",
  },
  {
    href: "/automation",
    icon: MessageSquare,
    label: "Automation",
    description: "Auto-request reviews",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-600",
    badge: "Workflow",
  },
]

const REVIEWS = [
  { id: "REV-001", product: "Bamboo Cutting Board Set", customer: "Emily Chen", rating: 5, comment: "Excellent quality!", date: "2024-01-15" },
  { id: "REV-002", product: "Facial Roller Massager", customer: "James Cooper", rating: 4, comment: "Good but shipping was slow", date: "2024-01-12" },
  { id: "REV-003", product: "Resistance Band Set", customer: "Priya Sharma", rating: 5, comment: "Love these bands!", date: "2024-01-10" },
]

export const metadata = { title: "Reviews - DropEase" }

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Star className="size-3" />
              Reviews
            </span>
            <h1 className="hero-title">Reviews & Ratings</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Monitor customer feedback and manage product reviews.
            </p>
          </div>
          <AIActionButton
            task="seo_optimization"
            input={{ productName: "Review Analysis", niche: "Customer Feedback" }}
            label="AI Review Insights"
          />
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total Reviews", value: REVIEWS.length, icon: Star, color: "bg-primary/10 text-primary" },
          { label: "Avg Rating", value: (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1), icon: Star, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "5-Star Reviews", value: REVIEWS.filter(r => r.rating === 5).length, icon: Star, color: "bg-amber-500/10 text-amber-600" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`stat-card card-interactive animate-in delay-${Math.min(i % 8 + 1, 8)}`}>
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

      <ReviewsManager />

      {/* Related Tools */}
      <section className="space-y-4 animate-in delay-2">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Related Tools</h2>
          <span className="text-xs text-muted-foreground">— maximize customer feedback</span>
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
