import { Target } from "lucide-react"
import { CompetitorTrackerHub } from "@/components/marketing/competitor-tracker-hub"

export const metadata = { title: "Competitor Tracker - DropEase" }

export default function CompetitorsPage() {
  return (
    <div className="space-y-8">
      <CompetitorTrackerHub />
    </div>
  )
}