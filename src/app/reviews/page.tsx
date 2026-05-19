import ReviewsManager from "@/components/reviews/reviews-manager"
import { AIActionButton } from "@/components/AIActionButton"

export const metadata = { title: "Reviews - DropEase" }

export default function ReviewsPage() {
  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews & Ratings Manager</h1>
        <AIActionButton
          task="seo_optimization"
          input={{ productName: "Review Analysis", niche: "Customer Feedback" }}
          label="AI Review Insights"
        />
      </div>
      <ReviewsManager />
    </main>
  )
}
