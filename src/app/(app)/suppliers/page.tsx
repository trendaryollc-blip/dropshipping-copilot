"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, Clock, CheckCircle, Package, Users, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { AIActionButton } from "@/components/AIActionButton"
import { useSuppliers } from "@/hooks/useData"

const CATEGORIES = ["All", "Electronics", "Fashion", "Home & Garden", "Beauty", "Sports", "Pet Supplies"]
const COUNTRIES = ["All", "China", "USA", "Turkey", "South Korea", "Germany"]

export default function SuppliersPage() {
  const { suppliers, loading } = useSuppliers()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [country, setCountry] = useState("All")
  const router = useRouter()

  const filtered = suppliers.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "All" || s.categories.some((c) => c === category)
    const matchCountry = country === "All" || s.country === country
    return matchSearch && matchCat && matchCountry
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
              <Users className="size-3" />
              Supplier Finder
            </span>
            <h1 className="hero-title">Find trusted partners</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Discover reliable suppliers with high ratings, fast response times, and verified status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border/30 bg-card/40 px-4 py-2 text-sm backdrop-blur-sm">
              <span className="font-mono text-lg font-bold text-foreground">{filtered.length}</span>
              <span className="text-xs text-muted-foreground/60">suppliers</span>
            </div>
            <AIActionButton
              task="order_processing"
              input={{
                orderId: "SUPPLIER-ANALYSIS",
                customerName: "Supplier Evaluation",
                totalAmount: 500,
                items: [{ name: "Supplier Analysis", quantity: 1, price: 500 }],
              }}
              label="AI Analysis"
            />
          </div>
        </div>
      </section>

      {/* ═══ Filters ═══ */}
      <section className="space-y-3 animate-in delay-1">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-2xl border-border/50 bg-card/50 pl-9 text-sm backdrop-blur-sm transition-all duration-300 focus:border-primary/30 focus:bg-card/70"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 border ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                  : "bg-card/50 text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground hover:bg-card/70"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="self-center text-xs text-muted-foreground/30">|</span>
          {COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 border ${
                country === c
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-card/50 text-muted-foreground border-border/50 hover:text-foreground hover:bg-card/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ Supplier Grid ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((supplier, i) => (
          <div
            key={supplier.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/suppliers/${supplier.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                router.push(`/suppliers/${supplier.id}`)
              }
            }}
            className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:bg-card/80 card-interactive animate-in delay-${Math.min(i % 8 + 1, 8)}`}
          >
            {/* Hover glow */}
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />

            <div className="relative z-10">
              <div className="flex items-start gap-3">
                <Avatar className="size-12 rounded-2xl border border-border/30 ring-2 ring-primary/5">
                  <AvatarImage src={supplier.avatar} alt={supplier.name} />
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary">
                    {supplier.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-bold text-foreground">{supplier.name}</p>
                    {supplier.verified && (
                      <CheckCircle className="size-3.5 shrink-0 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground/60">{supplier.country}</p>
                </div>
              </div>

              {/* Trust Score */}
              <div className="mt-3 flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-3.5 ${i < Math.floor(supplier.trustScore) ? "fill-amber-400 text-amber-400" : "fill-muted/30 text-muted-foreground/20"}`} />
                ))}
                <span className="ml-0.5 font-mono text-xs font-bold text-foreground">{supplier.trustScore}</span>
                {supplier.verified && (
                  <Badge className="ml-auto border-emerald-500/20 bg-emerald-500/10 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Verified
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-card/50 p-2.5 border border-border/20">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                    <Clock className="size-3 text-primary/60" /> Response
                  </div>
                  <p className="mt-0.5 font-mono text-xs font-bold text-foreground">{supplier.responseTime}</p>
                </div>
                <div className="rounded-xl bg-card/50 p-2.5 border border-border/20">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                    <Package className="size-3 text-primary/60" /> Products
                  </div>
                  <p className="mt-0.5 font-mono text-xs font-bold text-foreground">{supplier.totalProducts.toLocaleString()}</p>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-3 flex flex-wrap gap-1">
                {supplier.categories.map((cat) => (
                  <span key={cat} className="rounded-lg border border-primary/10 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary/70">
                    {cat}
                  </span>
                ))}
              </div>

              <Button
                size="sm"
                className="mt-4 h-9 w-full rounded-xl text-xs font-semibold"
                onClick={(e) => { e.stopPropagation(); toast.success(`Contact request sent to ${supplier.name}!`) }}
              >
                <Send className="mr-1.5 size-3" /> Contact Supplier
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Empty State ═══ */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center animate-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground/40">
            <Search className="size-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">No suppliers found</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Try adjusting your filters or search term</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { setSearch(""); setCategory("All"); setCountry("All") }}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}