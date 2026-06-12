"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Copy, Check, Tag, Globe, Eye, AlertTriangle, CheckCircle, Zap, ArrowRight, DollarSign, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { AIActionButton } from "@/components/AIActionButton"

const KEYWORD_SUGGESTIONS: Record<string, string[]> = {
  electronics: ["wireless", "bluetooth", "noise cancelling", "fast charging", "USB-C", "smart", "portable", "waterproof"],
  fashion: ["trending", "minimalist", "premium", "lightweight", "adjustable", "one size fits all", "unisex", "stylish"],
  "home & garden": ["eco-friendly", "durable", "easy to clean", "modern design", "multi-purpose", "space-saving", "aesthetic"],
  beauty: ["cruelty-free", "vegan", "natural", "dermatologist tested", "anti-aging", "hydrating", "organic"],
  sports: ["professional grade", "high intensity", "durable", "ergonomic", "performance", "workout", "gym"],
  default: ["premium quality", "fast shipping", "best seller", "limited edition", "free returns", "satisfaction guaranteed"],
}

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
    href: "/description",
    icon: FileText,
    label: "Description Generator",
    description: "Create compelling product descriptions",
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/50",
    iconBg: "bg-violet-500/10 text-violet-600",
    badge: "Content",
  },
  {
    href: "/bulk-edit",
    icon: FileText,
    label: "Bulk Edit",
    description: "Update multiple products at once",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-600",
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

function scoreTitle(title: string) {
  const len = title.length
  if (len >= 50 && len <= 60) return 100
  if (len >= 40 && len <= 70) return 75
  if (len >= 30) return 50
  return 25
}

function scoreDescription(desc: string) {
  const len = desc.length
  if (len >= 150 && len <= 160) return 100
  if (len >= 120 && len <= 180) return 75
  if (len >= 80) return 50
  return 25
}

function useCopy(text: string) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied!")
    setTimeout(() => setCopied(false), 2000)
  }
  return { copied, copy }
}

export default function SEOPage() {
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [keywords, setKeywords] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDesc, setMetaDesc] = useState("")
  const [tagsGenerated, setTagsGenerated] = useState(0)

  const titleScore = useMemo(() => scoreTitle(metaTitle), [metaTitle])
  const descScore = useMemo(() => scoreDescription(metaDesc), [metaDesc])
  const overallScore = Math.round((titleScore + descScore) / 2)

  const suggestions = useMemo(() => {
    const cat = category.toLowerCase()
    const base = KEYWORD_SUGGESTIONS[cat] || KEYWORD_SUGGESTIONS.default
    if (productName) {
      const words = productName.toLowerCase().split(" ")
      return [...new Set([...words.filter((w) => w.length > 3), ...base])].slice(0, 12)
    }
    return base.slice(0, 12)
  }, [productName, category])

  function generate() {
    if (!productName) { toast.error("Enter a product name first"); return }
    const kws = keywords || suggestions.slice(0, 3).join(", ")
    setMetaTitle(`${productName} – ${category ? `${category} | ` : ""}Buy Online with Free Shipping`)
    setMetaDesc(`Shop the best ${productName.toLowerCase()}. ${kws ? `Features: ${kws}. ` : ""}Free & fast shipping. 30-day returns. Order yours today!`)
    setTagsGenerated(prev => prev + 1)
    toast.success("SEO tags generated!")
  }

  function addKeyword(kw: string) {
    const current = keywords.split(",").map((k) => k.trim()).filter(Boolean)
    if (current.includes(kw)) return
    setKeywords([...current, kw].join(", "))
  }

  const titleCopy = useCopy(metaTitle)
  const descCopy = useCopy(metaDesc)

  return (
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Globe className="size-3" />
              SEO Optimizer
            </span>
            <h1 className="hero-title">SEO Tools</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Optimize your product listings for search engines and drive more organic traffic.
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
                <Tag className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tagsGenerated}</p>
                <p className="text-xs text-muted-foreground">SEO Tags Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-success-light text-success">
                <Globe className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallScore}/100</p>
                <p className="text-xs text-muted-foreground">SEO Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">SEO</p>
                <p className="text-xs text-muted-foreground">Optimization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Search className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{keywords.split(",").filter(Boolean).length}</p>
                <p className="text-xs text-muted-foreground">Keywords Added</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-1">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Product Details</h3>
            </div>
            <p className="text-xs text-muted-foreground/70">Enter your product information to generate SEO-optimized meta tags.</p>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Product Name *</Label>
              <Input placeholder='e.g. "Wireless Earbuds Pro"' value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Category</Label>
              <Input placeholder='e.g. "Electronics"' value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Focus Keywords <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
              <Textarea placeholder="bluetooth, wireless, noise cancelling..." value={keywords} onChange={(e) => setKeywords(e.target.value)} rows={2} className="text-sm resize-none" />
            </div>

            {/* Keyword suggestions */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">💡 Suggested keywords – click to add:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((kw) => (
                  <button key={kw} onClick={() => addKeyword(kw)} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    + {kw}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 rounded-xl" onClick={generate}>
                <Search className="size-3.5 mr-1.5" /> Generate SEO Tags
              </Button>
              <AIActionButton
                task="seo_optimization"
                input={{
                  productName,
                  niche: category,
                  targetKeywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
                }}
                label="AI"
                onSuccess={(result) => {
                  const seoResult = result as { optimizedTitle: string; metaDescription: string }
                  if (seoResult.optimizedTitle) setMetaTitle(seoResult.optimizedTitle)
                  if (seoResult.metaDescription) setMetaDesc(seoResult.metaDescription)
                }}
              />
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-2">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">SEO Score</h3>
            </div>
            <p className="text-xs text-muted-foreground/70">Based on Google's meta tag best practices</p>

            <div className="flex items-center gap-4">
              <div className={cn("flex size-16 items-center justify-center rounded-full text-xl font-bold",
                overallScore >= 80 ? "bg-emerald-500/10 text-emerald-600" :
                overallScore >= 50 ? "bg-amber-500/10 text-amber-600" :
                "bg-muted text-muted-foreground"
              )}>
                {overallScore}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {overallScore >= 80 ? "Excellent" : overallScore >= 50 ? "Needs Work" : "Not Scored Yet"}
                </p>
                <p className="text-xs text-muted-foreground">Out of 100 – target 80+</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Title Score</span>
                  <span className="font-medium">{titleScore}/100 ({metaTitle.length} chars)</span>
                </div>
                <Progress value={titleScore} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Description Score</span>
                  <span className="font-medium">{descScore}/100 ({metaDesc.length} chars)</span>
                </div>
                <Progress value={descScore} className="h-1.5" />
              </div>
            </div>

            {/* Hints */}
            <div className="space-y-1.5">
              {[
                { ok: metaTitle.length >= 50 && metaTitle.length <= 60, text: "Title: 50–60 characters (ideal)" },
                { ok: metaDesc.length >= 150 && metaDesc.length <= 160, text: "Description: 150–160 characters (ideal)" },
                { ok: keywords.length > 0, text: "At least one focus keyword defined" },
                { ok: metaTitle.toLowerCase().includes(productName.toLowerCase()) && productName.length > 0, text: "Product name appears in title" },
              ].map(({ ok, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs">
                  {ok ? <CheckCircle className="size-3.5 text-emerald-500 shrink-0" /> : <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />}
                  <span className={ok ? "text-foreground" : "text-muted-foreground"}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generated tags */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-3 lg:col-span-2">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Generated Meta Tags</h3>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Meta Title <span className={cn("ml-2 text-[10px]", metaTitle.length > 60 ? "text-destructive" : "text-muted-foreground")}>{metaTitle.length}/60</span></Label>
                <Button variant="ghost" size="sm" onClick={titleCopy.copy} disabled={!metaTitle} className="rounded-xl">
                  {titleCopy.copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </Button>
              </div>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Your page title will appear here..." className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Meta Description <span className={cn("ml-2 text-[10px]", metaDesc.length > 160 ? "text-destructive" : "text-muted-foreground")}>{metaDesc.length}/160</span></Label>
                <Button variant="ghost" size="sm" onClick={descCopy.copy} disabled={!metaDesc} className="rounded-xl">
                  {descCopy.copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </Button>
              </div>
              <Textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Your meta description will appear here..." rows={3} className="text-sm resize-none" />
            </div>

            {/* Google preview */}
            {metaTitle && (
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
                  <Globe className="size-3" /> Google Search Preview
                </p>
                <p className="text-base font-medium text-blue-600 dark:text-blue-400 truncate">{metaTitle}</p>
                <p className="text-xs text-green-700 dark:text-green-400 truncate">https://yourstore.com/products/...</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">{metaDesc || "Your meta description will appear here in Google search results."}</p>
              </div>
            )}

            {/* OG Tags */}
            {metaTitle && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Ready-to-paste HTML tags:</p>
                <pre className="rounded-lg bg-card/50 p-3 text-[11px] font-mono text-foreground overflow-x-auto border border-border/20">
{`<title>${metaTitle}</title>
<meta name="description" content="${metaDesc}" />
<meta property="og:title" content="${metaTitle}" />
<meta property="og:description" content="${metaDesc}" />
<meta name="keywords" content="${keywords}" />`}
                </pre>
              </div>
            )}
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