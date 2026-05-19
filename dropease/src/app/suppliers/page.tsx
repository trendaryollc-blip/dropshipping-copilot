"use client"

import { useState } from "react"
import { Search, Star, Clock, CheckCircle, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { suppliers } from "@/lib/mock-data"
import { toast } from "sonner"
import { AIActionButton } from "@/components/AIActionButton"

const CATEGORIES = ["All", "Electronics", "Fashion", "Home & Garden", "Beauty", "Sports", "Pet Supplies"]
const COUNTRIES = ["All", "China", "USA", "Turkey", "South Korea", "Germany"]

export default function SuppliersPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [country, setCountry] = useState("All")

  const filtered = suppliers.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "All" || s.categories.some((c) => c === category)
    const matchCountry = country === "All" || s.country === country
    return matchSearch && matchCat && matchCountry
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Supplier Finder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find trusted suppliers with high ratings and fast response times.
          </p>
        </div>
        <AIActionButton
          task="order_processing"
          input={{
            orderId: "SUPPLIER-ANALYSIS",
            customerName: "Supplier Evaluation",
            totalAmount: 500,
            items: [{ name: "Supplier Analysis", quantity: 1, price: 500 }],
          }}
          label="AI Supplier Analysis"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                country === c
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} suppliers found</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((supplier) => (
          <div key={supplier.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
            <div className="flex items-start gap-3">
              <Avatar className="size-12 rounded-xl border border-border">
                <AvatarImage src={supplier.avatar} alt={supplier.name} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-sm font-bold">
                  {supplier.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-foreground">{supplier.name}</p>
                  {supplier.verified && (
                    <CheckCircle className="size-3.5 shrink-0 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{supplier.country}</p>
              </div>
            </div>

            {/* Trust Score */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3.5 ${i < Math.floor(supplier.trustScore) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"}`}
                />
              ))}
              <span className="text-xs font-medium text-foreground ml-0.5">{supplier.trustScore}</span>
              {supplier.verified && (
                <Badge className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200">
                  Verified
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/60 p-2">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" /> Response
                </div>
                <p className="mt-0.5 text-xs font-semibold text-foreground">{supplier.responseTime}</p>
              </div>
              <div className="rounded-lg bg-muted/60 p-2">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Package className="size-3" /> Products
                </div>
                <p className="mt-0.5 text-xs font-semibold text-foreground">{supplier.totalProducts.toLocaleString()}</p>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1">
              {supplier.categories.map((cat) => (
                <span key={cat} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground font-medium">
                  {cat}
                </span>
              ))}
            </div>

            <Button
              size="sm"
              className="mt-auto h-7 text-xs w-full"
              onClick={() => toast.success(`Contact request sent to ${supplier.name}!`)}
            >
              Contact Supplier
            </Button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Search className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No suppliers match your filters.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategory("All"); setCountry("All") }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
