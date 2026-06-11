"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface InsightsFooterCardProps {
  title: string
  description: string
  icon: React.ReactNode
  link?: string
  linkText?: string
}

export function InsightsFooterCard({
  title,
  description,
  icon,
  link,
  linkText = "View Details"
}: InsightsFooterCardProps) {
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
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}