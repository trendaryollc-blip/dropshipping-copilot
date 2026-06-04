"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Activity, Zap } from "lucide-react"
import { apiSecurityService } from "@/lib/encryption-service"

interface RateLimitStatus {
  apiCalls: { used: number; limit: number; resetAt: string }
  search: { used: number; limit: number; resetAt: string }
  download: { used: number; limit: number; resetAt: string }
  export: { used: number; limit: number; resetAt: string }
}

export function RateLimitDashboard() {
  const [status, setStatus] = useState<RateLimitStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRateLimitStatus()
  }, [])

  const loadRateLimitStatus = async () => {
    try {
      const data = await apiSecurityService.getRateLimitStatus("user_id")
      setStatus(data)
    } catch (error) {
      console.error("Failed to load rate limit status:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !status) {
    return <div>Loading...</div>
  }

  const getProgressColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const RateLimitCard = ({
    title,
    data,
    icon: Icon,
  }: {
    title: string
    data: { used: number; limit: number; resetAt: string }
    icon: React.ReactNode
  }) => {
    const percentage = (data.used / data.limit) * 100
    const isWarning = percentage >= 75
    const isCritical = percentage >= 90

    return (
      <Card className={`p-4 ${isCritical ? "border-destructive bg-destructive/10" : isWarning ? "border-warning bg-warning/10" : ""}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {Icon}
            <h4 className="font-medium text-sm">{title}</h4>
          </div>
          <Badge variant={isCritical ? "destructive" : isWarning ? "secondary" : "default"}>
            {data.used} / {data.limit}
          </Badge>
        </div>

        <Progress value={percentage} className="mb-2" />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{Math.round(percentage)}% used</span>
          <span>Resets: {new Date(data.resetAt).toLocaleTimeString()}</span>
        </div>

        {isCritical && (
          <div className="mt-3 text-xs text-destructive bg-destructive/10 p-2 rounded">
            ⚠️ Rate limit nearly exceeded
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">API Rate Limits</h3>
        <p className="text-sm text-muted-foreground">Monitor your usage across different API endpoints</p>
      </div>

      {/* Critical Alert */}
      {(status.apiCalls.used / status.apiCalls.limit) * 100 >= 90 && (
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            You're approaching your API rate limit. Upgrade your plan or optimize your requests.
          </AlertDescription>
        </Alert>
      )}

      {/* Rate Limit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RateLimitCard
          title="API Calls"
          data={status.apiCalls}
          icon={<Zap className="h-5 w-5 text-blue-500" />}
        />
        <RateLimitCard
          title="Search Queries"
          data={status.search}
          icon={<Activity className="h-5 w-5 text-green-500" />}
        />
        <RateLimitCard
          title="Downloads"
          data={status.download}
          icon={<Activity className="h-5 w-5 text-purple-500" />}
        />
        <RateLimitCard
          title="Exports"
          data={status.export}
          icon={<Activity className="h-5 w-5 text-orange-500" />}
        />
      </div>

      {/* Usage Tips */}
      <Card className="p-4 bg-primary-light/20 border-primary/20">
        <h4 className="font-medium text-sm mb-2">💡 Tips to Optimize API Usage</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use batch operations instead of individual requests</li>
          <li>• Cache frequently accessed data</li>
          <li>• Implement pagination for large result sets</li>
          <li>• Upgrade to Pro plan for higher limits</li>
        </ul>
      </Card>
    </div>
  )
}
