import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdCampaignsHub } from "@/components/marketing/ad-campaigns-hub"

export const metadata = { title: "Ad Campaigns - DropEase" }

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <AdCampaignsHub />
    </div>
  )
}