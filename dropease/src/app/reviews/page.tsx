import ReviewsManager from "@/components/reviews/reviews-manager"

export const metadata = { title: "Reviews - DropEase" }

export default function ReviewsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reviews & Ratings Manager</h1>
      <ReviewsManager />
    </main>
  )
}
