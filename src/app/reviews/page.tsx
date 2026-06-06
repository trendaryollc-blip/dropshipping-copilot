import { Star } from "lucide-react"
import ReviewsManager from "@/components/reviews/reviews-manager"
import { AIActionButton } from "@/components/AIActionButton"

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

      <ReviewsManager />
    </div>
  )
}
