"use client"

import { useState } from "react"
import { Package, Search, Star, TrendingUp, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIActionButton } from "@/components/AIActionButton"
import { toast } from "sonner"
import { products } from "@/lib/mock-data"

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const query = search.toLowerCase().trim()
  const searchWords = query ? query.split(/\s+/) : []

  const filtered = products.filter((p) => {
    // Match if ANY search word appears in name, niche, or supplier
    const searchableText = `${p.name} ${p.niche} ${p.supplierName ?? ""} ${p.competition} ${p.status}`.toLowerCase()
    const matchSearch = searchWords.length === 0 || searchWords.some((word) => searchableText.includes(word))
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Package className="size-3" />
              Products
            </span>
            <h1 className="hero-title">Find winning products</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Discover trending products with high margins and low competition for your dropshipping store.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border/30 bg-card/40 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-mono text-lg font-bold text-foreground">{filtered.length}</span>
            <span className="text-xs text-muted-foreground/60">products</span>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="space-y-3 animate-in delay-1">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-2xl border-border/50 bg-card/50 pl-9 text-sm backdrop-blur-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "active", "draft", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 border ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card/50 text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="mb-3 h-40 w-full rounded-xl object-cover border border-border/20"
            />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
              <p className="text-xs text-muted-foreground/60">{product.niche}</p>

              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  ${product.priceRange.min}–${product.priceRange.max}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold">{product.trendScore}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={`text-[10px] ${
                  product.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : product.status === "draft"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-muted text-muted-foreground border-border"
                }`}>
                  {product.status}
                </Badge>
                <span className="text-[10px] text-muted-foreground/40 capitalize">{product.competition}</span>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full h-8 rounded-xl text-xs mt-1"
                onClick={() => {
                  toast.success(`Imported "${product.name}" to My Products!`)
                }}
              >
                <Package className="mr-1 size-3" />
                Import to My Products
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Search className="size-7 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No products match "{search}"</p>
          <p className="text-xs text-muted-foreground/60">Try searching by product name, category, or supplier (e.g. "earbuds", "fashion", "electronics")</p>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { setSearch(""); setStatusFilter("all") }}>
            Clear Search & Show All Products
          </Button>
        </div>
      )}
    </div>
  )
}
