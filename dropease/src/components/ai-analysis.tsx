"use client"

import { useState } from "react"
import { TrendingUp, DollarSign, Users, Search, BarChart3, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "sonner"
import aiService, { type AIAnalysis } from "@/lib/ai-service"

export function AIAnalysisCard({ productName, category }: { productName: string; category: string }) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeProduct = async () => {
    if (!productName || !category) {
      toast.error("Please enter product name and category")
      return
    }

    setLoading(true)
    try {
      const result = await aiService.analyzeProduct(productName, category)
      setAnalysis(result)
      toast.success("Product analysis completed!")
    } catch (error) {
      toast.error("Failed to analyze product")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-4" />
            Analyzing Product...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-4" />
          AI Product Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={analysis.trending ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {analysis.trending ? "🔥 Trending" : "📊 Stable"}
                  </Badge>
                  <span className="text-sm font-medium">Market Demand</span>
                </div>
                <div className="text-2xl font-bold">
                  {analysis.marketDemand === 'high' ? 'High' : analysis.marketDemand === 'medium' ? 'Medium' : 'Low'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={
                    analysis.competition === 'low' ? "bg-green-100 text-green-700" :
                    analysis.competition === 'medium' ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }>
                    {analysis.competition === 'low' ? "🟢 Low" : analysis.competition === 'medium' ? "🟡 Medium" : "🔴 High"}
                  </Badge>
                  <span className="text-sm font-medium">Competition</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {analysis.competition === 'low' ? 'Easy market entry' :
                   analysis.competition === 'medium' ? 'Moderate competition' :
                   'Highly competitive market'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recommended Price</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${analysis.recommendedPrice}</div>
                  <div className="text-xs text-muted-foreground">AI Optimized</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Competitor Analysis</span>
                <div className="space-y-1">
                  {analysis.competitorPrices.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{competitor.name}</span>
                      <span className="font-medium">${competitor.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <span className="text-sm font-medium">SEO Keywords</span>
              <div className="flex flex-wrap gap-1">
                {analysis.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={analyzeProduct}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze Product"}
              </Button>
              <Button variant="outline" className="w-full">
                View Full Report
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
