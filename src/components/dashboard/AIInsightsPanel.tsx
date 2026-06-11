"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface AIInsightsPanelProps {
  title: string
  description: string
  value: string
  trend: string
  icon: React.ReactNode
  link?: string
  linkText?: string
  trendColor?: "success" | "destructive"
}

export function AIInsightsPanel({
  title,
  description,
  value,
  trend,
  icon,
  link,
  linkText = "View Details"
}: AIInsightsPanelProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-row items-center space-x-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        {link && (
          <Link href={link} className="text-sm font-medium text-primary hover:underline">
            {linkText}
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
<div className="flex items-center mt-2">
  <Badge
    variant={trendColor === "destructive" ? "destructive" : trend.includes("↓") ? "destructive" : "secondary"}
    className={`text-xs px-2 py-1 rounded-full ${trendColor === "success" ? "bg-green-100 text-green-800" : trend.includes("↓") ? "bg-destructive/10" : ""}`}
  >
    {trend}
  </Badge>
</div>
      </CardContent>
    </Card>
  )
}