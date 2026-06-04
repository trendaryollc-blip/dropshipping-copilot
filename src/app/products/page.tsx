"use client"

import { useState } from "react"
import { Search, TrendingUp, CheckCircle, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress, ProgressIndicator } from "@/components/ui/progress"
import { products } from "@/lib/mock-data"
import { useAppStore } from "@/store/useAppStore"
import { toast } from "sonner"
import { AIActionButton } from "@/components/AIActionButton"
import type { CompetitionLevel, Product } from "@/types"

const NICHES = ["All", "Electronics", "Fashion", "Home & Garden", "Beauty", "Sports"]
const COMPETITION = ["All", "low", "medium", "high"]

const competitionConfig: Record<CompetitionLevel, { label: string; class: string }> = {
  low: { label: "Low", class: "bg-success-light text-success border-success" },
  medium: { label: "Medium", class: "bg-warning-light text-warning border-warning" },
  high: { label: "High", class: "bg-destructive-light text-destructive border-destructive" },
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [niche, setNiche] = useState("All")
  const [competition, setCompetition] = useState("All")
  const { importProduct, products: myProducts } = useAppStore()

  const importedIds = new Set(myProducts.map((p) => p.id))

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchNiche = niche === "All" || p.niche === niche
    const matchComp = competition === "All" || p.competition === competition
    return matchSearch && matchNiche && matchComp
  })

  function handleImport(product: Product) {
    if (importedIds.has(product.id)) return
    importProduct(product)
    toast.success(`"${product.name}" imported to My Products!`)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Product Research</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover winning products with high demand and low competition.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {NICHES.map((n) => (
            <button
              key={n}
              onClick={() => setNiche(n)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                niche === n
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMPETITION.map((c) => (
            <button
              key={c}
              onClick={() => setCompetition(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                competition === c
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {c === "All" ? "All Competition" : `${c.charAt(0).toUpperCase() + c.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} products found</p>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => {
          const comp = competitionConfig[product.competition]
          const isImported = importedIds.has(product.id)
          return (
            <div key={product.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className={`absolute right-2 top-2 text-[10px] border ${comp.class}`}>
                  {comp.label} Competition
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-3.5">
                <div>
                  <p className="text-xs text-muted-foreground">{product.niche}</p>
                  <p className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{product.name}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">${product.priceRange.min}–${product.priceRange.max}</span>
                  <span>{product.supplierName}</span>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <TrendingUp className="size-3" /> Trend Score
                    </span>
                    <span className="text-[11px] font-semibold text-foreground">{product.trendScore}/100</span>
                  </div>
                  <Progress value={product.trendScore} className="h-1.5" />
                </div>
                <div className="mt-auto flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 flex-1 text-xs"
                    variant={isImported ? "outline" : "default"}
                    onClick={() => handleImport(product)}
                    disabled={isImported}
                  >
                    {isImported ? "Imported" : "Import Product"}
                  </Button>
                  <AIActionButton
                    task="product_description"
                    input={{
                      productName: product.name,
                      niche: product.niche,
                      features: ["High quality", "Trending", "Good reviews"],
                      priceRange: product.priceRange,
                    }}
                    label="AI"
                    onSuccess={(result) => {
                      toast.success("Description generated!")
                      console.log("AI Description:", result)
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Search className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No products match your filters.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setNiche("All"); setCompetition("All") }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
