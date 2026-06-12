"use client"

import { useState } from "react"
import Link from "next/link"
import { Copy, RefreshCw, FileText, Sparkles, Check, TrendingUp, DollarSign, Zap, ArrowRight, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
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

const RELATED_TOOLS = [
  {
    href: "/calculator",
    icon: DollarSign,
    label: "Profit Calculator",
    description: "Calculate profit margins and compare platforms",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50",
    iconBg: "bg-blue-500/10 text-blue-600",
    badge: "Finance",
  },
  {
    href: "/seo",
    icon: TrendingUp,
    label: "SEO Tools",
    description: "Optimize your listings for search engines",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    badge: "Ranking",
  },
  {
    href: "/bulk-edit",
    icon: FileText,
    label: "Bulk Edit",
    description: "Update multiple products at once",
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/50",
    iconBg: "bg-violet-500/10 text-violet-600",
    badge: "Efficiency",
  },
  {
    href: "/automation",
    icon: Zap,
    label: "Automation",
    description: "Automate your business operations",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-600",
    badge: "Workflow",
  },
]

export default function DescriptionPage() {
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [features, setFeatures] = useState("")
  const [tone, setTone] = useState("professional")
  const [generated, setGenerated] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [descriptionsGenerated, setDescriptionsGenerated] = useState(0)

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
        features: features.split(",").map(f => f.trim()),
        targetAudience: "General consumers",
        tone: tone as "professional" | "casual" | "persuasive" | "playful",
        keywords: features.split(",").map(f => f.trim())
      }

      const description = await aiService.generateDescription(request)
      setGenerated(description)
      setDescriptionsGenerated(prev => prev + 1)
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
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Sparkles className="size-3" />
              AI Content Generator
            </span>
            <h1 className="hero-title">Description Generator</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Generate professional product descriptions in seconds using advanced AI.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Stats Overview ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{descriptionsGenerated}</p>
                <p className="text-xs text-muted-foreground">Descriptions Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-success-light text-success">
                <FileText className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{generated ? wordCount : "—"}</p>
                <p className="text-xs text-muted-foreground">Current Word Count</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-xs text-muted-foreground">AI Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-warning-light text-warning">
                <Zap className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">3x</p>
                <p className="text-xs text-muted-foreground">Faster Than Manual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input Form */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-1">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Product Details</h3>
            </div>
            <p className="text-xs text-muted-foreground/70">Fill in the details below to generate a tailored description.</p>

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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tone</Label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
              >
                {Object.entries(TONE_DESCRIPTIONS).map(([key]) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
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

            <Button
              className="w-full rounded-xl"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <><RefreshCw className="size-3.5 animate-spin mr-1.5" /> Generating...</>
              ) : (
                <><Sparkles className="size-3.5 mr-1.5" /> Generate Description</>
              )}
            </Button>
          </div>
        </div>

        {/* AI Analysis */}
        <AIAnalysisCard productName={productName} category={category} />

        {/* Test AI Features */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-2">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Test AI Features</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => testAIFeatures().testProductAnalysis()}
                variant="outline"
                size="sm"
                className="w-full rounded-xl"
              >
                🧠 Test Product Analysis
              </Button>
              <Button
                onClick={() => testAIFeatures().testDescriptionGeneration()}
                variant="outline"
                size="sm"
                className="w-full rounded-xl"
              >
                ✍️ Test Description Generator
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => testAIFeatures().testPriceOptimization()}
                variant="outline"
                size="sm"
                className="w-full rounded-xl"
              >
                💰 Test Price Optimization
              </Button>
              <Button
                onClick={() => testAIFeatures().testCompetitionAnalysis()}
                variant="outline"
                size="sm"
                className="w-full rounded-xl"
              >
                📊 Test Competition Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-3">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Generated Description</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs rounded-xl"
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

            <div className="space-y-3">
              <div className="p-4 bg-card/50 rounded-xl border border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Word Count</span>
                  <Badge variant="secondary" className="text-xs">{wordCount} words</Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {generated || "Your generated description will appear here..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Related Tools ═══ */}
      <section className="space-y-4 animate-in">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Related Tools</h2>
          <span className="text-xs text-muted-foreground">— maximize your product's potential</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED_TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
                  tool.color
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex size-9 items-center justify-center rounded-xl", tool.iconBg)}>
                      <Icon className="size-4" />
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wide">{tool.badge}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tool.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary/80 group-hover:text-primary transition-colors">
                    Open Tool <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}