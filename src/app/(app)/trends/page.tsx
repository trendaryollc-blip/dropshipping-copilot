import { TrendingUp } from "lucide-react"
import { NicheTrendsHub } from "@/components/marketing/niche-trends-hub"

export const metadata = { title: "Niche Trends - DropEase" }

export default function TrendsPage() {
  return (
    <div className="space-y-8">
      <NicheTrendsHub />
    </div>
  )
}