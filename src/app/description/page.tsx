"use client"

import { useState } from "react"
import { Copy, RefreshCw, FileText, Sparkles, Check, TrendingUp, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import aiService, { type AIDescriptionRequest, type AIAnalysis, type AIPriceOptimization } from "@/lib/ai-service"
import { AIAnalysisCard } from "@/components/ai-analysis"
import { testAIFeatures } from "@/lib/ai-test"

const TONE_DESCRIPTIONS = {
  professional: "Formal and authoritative, ideal for electronics and business products.",
  casual: "Friendly and conversational, great for lifestyle and home products.",
  persuasive: "Benefit-focused and compelling, maximizes conversion rates.",
  playful: "Fun and energetic, perfect for toys, gifts, and fashion accessories.",
}

const CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Beauty", "Sports", "Toys", "Pet Supplies", "Jewelry"]

export default function DescriptionPage() {
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [features, setFeatures] = useState("")
  const [tone, setTone] = useState("professional")
  const [generated, setGenerated] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!productName || !category) {
      toast.error("Please enter a product name and category.")
      return
    }
    setLoading(true)
    
    try {
      const request: AIDescriptionRequest = {
        productName,
        category,
        features: features.split(',').map(f => f.trim()),
        targetAudience: "General consumers",
        tone: tone as 'professional' | 'casual' | 'persuasive' | 'playful',
        keywords: features.split(',').map(f => f.trim())
      }
      
      const description = await aiService.generateDescription(request)
      setGenerated(description)
      toast.success("AI description generated!")
    } catch (error) {
      toast.error("Failed to generate description")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = generated ? generated.split(/\s+/).filter(Boolean).length : 0

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Description Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate professional product descriptions in seconds.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Product Details
            </CardTitle>
            <CardDescription className="text-xs">Fill in the details below to generate a tailored description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Product Name *</Label>
              <Input
                placeholder='e.g. "Wireless Earbuds Pro"'
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Category *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value || "professional")}>
                <SelectTrigger size="sm" className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TONE_DESCRIPTIONS).map(([key]) => (
                    <SelectItem key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">{TONE_DESCRIPTIONS[tone as keyof typeof TONE_DESCRIPTIONS]}</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Key Features <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
              <Textarea
                placeholder='e.g. "Active noise cancellation, 30hr battery, IPX5 waterproof"'
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="text-sm resize-none"
                rows={3}
              />
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <><RefreshCw className="size-3.5 animate-spin mr-1.5" /> Generating...</>
              ) : (
                <><Sparkles className="size-3.5 mr-1.5" /> Generate Description</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <AIAnalysisCard productName={productName} category={category} />

        {/* Test AI Features */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Test AI Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => testAIFeatures().testProductAnalysis()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                🧠 Test Product Analysis
              </Button>
              <Button 
                onClick={() => testAIFeatures().testDescriptionGeneration()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                ✍️ Test Description Generator
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => testAIFeatures().testPriceOptimization()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                💰 Test Price Optimization
              </Button>
              <Button 
                onClick={() => testAIFeatures().testCompetitionAnalysis()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                📊 Test Competition Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                Generated Description
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleCopy}
                disabled={!generated || copied}
              >
                {copied ? (
                  <>
                    <Check className="size-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm leading-relaxed">{generated || "Your generated description will appear here..."}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
