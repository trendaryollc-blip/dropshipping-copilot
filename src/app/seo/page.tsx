"use client"

import { useState, useMemo } from "react"
import { Search, Copy, Check, Tag, Globe, Eye, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AIActionButton } from "@/components/AIActionButton"

const KEYWORD_SUGGESTIONS: Record<string, string[]> = {
  electronics: ["wireless", "bluetooth", "noise cancelling", "fast charging", "USB-C", "smart", "portable", "waterproof"],
  fashion: ["trending", "minimalist", "premium", "lightweight", "adjustable", "one size fits all", "unisex", "stylish"],
  "home & garden": ["eco-friendly", "durable", "easy to clean", "modern design", "multi-purpose", "space-saving", "aesthetic"],
  beauty: ["cruelty-free", "vegan", "natural", "dermatologist tested", "anti-aging", "hydrating", "organic"],
  sports: ["professional grade", "high intensity", "durable", "ergonomic", "performance", "workout", "gym"],
  default: ["premium quality", "fast shipping", "best seller", "limited edition", "free returns", "satisfaction guaranteed"],
}

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
    <div className="space-y-5">
      <div>
        <h1 className="page-header">SEO Tools</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Optimize your product listings for search engines and drive more organic traffic.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="size-4 text-primary" /> Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <p className="text-[11px] text-muted-foreground mb-2">💡 Suggested keywords – click to add:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((kw) => (
                  <button key={kw} onClick={() => addKeyword(kw)} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    + {kw}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={generate}>
                <Search className="size-3.5" /> Generate SEO Tags
              </Button>
              <AIActionButton
                task="seo_optimization"
                input={{
                  productName,
                  niche: category,
                  targetKeywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
                }}
                label="AI"
                onSuccess={(result) => {
                  if (result.optimizedTitle) setMetaTitle(result.optimizedTitle)
                  if (result.metaDescription) setMetaDesc(result.metaDescription)
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="size-4 text-primary" /> SEO Score
            </CardTitle>
            <CardDescription className="text-xs">Based on Google's meta tag best practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={cn("flex size-16 items-center justify-center rounded-full text-xl font-bold",
                overallScore >= 80 ? "bg-green-100 text-green-700" :
                overallScore >= 50 ? "bg-amber-100 text-amber-700" :
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
                  {ok ? <CheckCircle className="size-3.5 text-green-500 shrink-0" /> : <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />}
                  <span className={ok ? "text-foreground" : "text-muted-foreground"}>{text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generated tags */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="size-4 text-primary" /> Generated Meta Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Meta Title <span className={cn("ml-2 text-[10px]", metaTitle.length > 60 ? "text-destructive" : "text-muted-foreground")}>{metaTitle.length}/60</span></Label>
                <Button variant="ghost" size="icon-sm" onClick={titleCopy.copy} disabled={!metaTitle}>
                  {titleCopy.copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </Button>
              </div>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Your page title will appear here..." className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Meta Description <span className={cn("ml-2 text-[10px]", metaDesc.length > 160 ? "text-destructive" : "text-muted-foreground")}>{metaDesc.length}/160</span></Label>
                <Button variant="ghost" size="icon-sm" onClick={descCopy.copy} disabled={!metaDesc}>
                  {descCopy.copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </Button>
              </div>
              <Textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Your meta description will appear here..." rows={3} className="text-sm resize-none" />
            </div>

            {/* Google preview */}
            {metaTitle && (
              <div className="rounded-xl border border-border bg-card p-4">
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
                <p className="text-xs font-medium text-muted-foreground mb-2">Ready-to-paste HTML tags:</p>
                <pre className="rounded-lg bg-muted p-3 text-[11px] font-mono text-foreground overflow-x-auto">
{`<title>${metaTitle}</title>
<meta name="description" content="${metaDesc}" />
<meta property="og:title" content="${metaTitle}" />
<meta property="og:description" content="${metaDesc}" />
<meta name="keywords" content="${keywords}" />`}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
