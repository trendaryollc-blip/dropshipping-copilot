"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, PenLine, Package, Check, X, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { products as initialProducts } from "@/lib/mock-data"
import { AIActionButton } from "@/components/AIActionButton"
import type { Product, ProductStatus } from "@/types"

// ─── Types ────────────────────────────────────────────────────────────────────

type PriceEditMode = "percent" | "fixed" | "set"
type StatusFilter = ProductStatus | "all"

interface EditableProduct extends Product {
  displayPrice: number
  stock: number
}

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-100" },
  draft: { label: "Draft", color: "text-amber-700", bg: "bg-amber-100" },
  archived: { label: "Archived", color: "text-gray-600", bg: "bg-gray-100" },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const seededStock = (id: string): number => {
  const seed = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (seed % 191) + 10
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BulkEditPage() {
  const [products, setProducts] = useState<EditableProduct[]>(() =>
    initialProducts.map(p => ({
      ...p,
      displayPrice: p.priceRange.max,
      stock: seededStock(p.id),
    }))
  )
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [aiResults, setAiResults] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [panelOpen, setPanelOpen] = useState(false)

  // Edit panel state
  const [priceMode, setPriceMode] = useState<PriceEditMode>("percent")
  const [priceValue, setPriceValue] = useState("")
  const [newStatus, setNewStatus] = useState<ProductStatus>("active")
  const [stockValue, setStockValue] = useState("")

  // Indeterminate checkbox ref
  const allCheckRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(
    () =>
      products.filter(
        p =>
          (statusFilter === "all" || p.status === statusFilter) &&
          p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search, statusFilter]
  )

  const selectedInFiltered = filtered.filter(p => selected.has(p.id))
  const allSelected = filtered.length > 0 && selectedInFiltered.length === filtered.length
  const someSelected = selectedInFiltered.length > 0 && !allSelected
  const selectedCount = selectedInFiltered.length

  useEffect(() => {
    if (allCheckRef.current) {
      allCheckRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  const toggleAll = () => {
    setSelected(prev => {
      const next = new Set(prev)
      if (allSelected) {
        filtered.forEach(p => next.delete(p.id))
      } else {
        filtered.forEach(p => next.add(p.id))
      }
      return next
    })
  }

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const clearSelection = () => {
    setSelected(new Set())
    setPanelOpen(false)
  }

  const applyChanges = () => {
    const targetIds = new Set(selectedInFiltered.map(p => p.id))
    if (targetIds.size === 0) { toast.error("No products selected"); return }

    setProducts(prev =>
      prev.map(p => {
        if (!targetIds.has(p.id)) return p
        let price = p.displayPrice
        const adj = parseFloat(priceValue)
        if (priceValue && !isNaN(adj)) {
          if (priceMode === "percent") price = p.displayPrice * (1 + adj / 100)
          else if (priceMode === "fixed") price = p.displayPrice + adj
          else price = adj
          price = Math.max(0.01, parseFloat(price.toFixed(2)))
        }
        const stock = stockValue && !isNaN(parseInt(stockValue))
          ? Math.max(0, parseInt(stockValue))
          : p.stock
        return { ...p, displayPrice: price, status: newStatus, stock }
      })
    )

    toast.success(`Changes applied to ${targetIds.size} product${targetIds.size > 1 ? "s" : ""}`)
    clearSelection()
    setPriceValue("")
    setStockValue("")
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Bulk Edit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit prices, stock, and status for multiple products at once.
          </p>
        </div>
        <AIActionButton
          task="product_description"
          input={{
            productName: "Bulk Products",
            niche: "General",
            features: ["High quality", "Trending"],
            priceRange: { min: 20, max: 100 },
          }}
          label="AI Bulk Descriptions"
          onSuccess={(result) => {
            setAiResults([...aiResults, result])
            toast.success("AI descriptions generated for bulk!")
          }}
         />
        {selectedCount > 0 && (
          <Button onClick={() => setPanelOpen(o => !o)} className="shrink-0">
            <PenLine className="size-4 mr-1.5" />
            Edit {selectedCount} Selected
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Package className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Check className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{selectedCount}</p>
                <p className="text-xs text-muted-foreground">Currently Selected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <PenLine className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.status === "active").length}
                </p>
                <p className="text-xs text-muted-foreground">Active Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Edit Panel */}
      {panelOpen && selectedCount > 0 && (
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Bulk Edit Panel
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Changes will apply to {selectedCount} selected product{selectedCount > 1 ? "s" : ""}
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setPanelOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Price Adjustment */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Price Adjustment
                </Label>
                <div className="flex gap-2 items-center">
                  <div className="flex rounded-lg border border-input overflow-hidden shrink-0">
                    {(["percent", "fixed", "set"] as PriceEditMode[]).map(m => (
                      <button
                        key={m}
                        onClick={() => setPriceMode(m)}
                        className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          priceMode === m
                            ? "bg-primary text-primary-foreground"
                            : "bg-transparent text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {m === "percent" ? "%" : m === "fixed" ? "+$" : "=$"}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={
                      priceMode === "percent" ? "e.g. 10" : priceMode === "fixed" ? "+5.00" : "29.99"
                    }
                    value={priceValue}
                    onChange={e => setPriceValue(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {priceMode === "percent" && "Adjust price by percentage (+ or -)"}
                  {priceMode === "fixed" && "Add or subtract a fixed dollar amount"}
                  {priceMode === "set" && "Set an exact price for all selected products"}
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Set Status
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {(["active", "draft", "archived"] as ProductStatus[]).map(s => {
                    const sc = statusConfig[s]
                    return (
                      <button
                        key={s}
                        onClick={() => setNewStatus(s)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          newStatus === s
                            ? `${sc.bg} ${sc.color} border-transparent`
                            : "border-border text-muted-foreground hover:border-foreground/40"
                        }`}
                      >
                        {sc.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground">All selected products will be set to this status</p>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="bulk-stock" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Set Stock Quantity
                </Label>
                <Input
                  id="bulk-stock"
                  type="number"
                  min="0"
                  placeholder="e.g. 100"
                  value={stockValue}
                  onChange={e => setStockValue(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">Leave empty to keep current stock levels</p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="flex items-center gap-3">
              <Button onClick={applyChanges}>
                <Check className="size-3.5 mr-1.5" />
                Apply to {selectedCount} Product{selectedCount > 1 ? "s" : ""}
              </Button>
              <Button variant="outline" onClick={clearSelection}>
                <X className="size-3.5 mr-1.5" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            {/* Status filter buttons */}
            <div className="flex items-center gap-1.5">
              {(["all", "active", "draft", "archived"] as const).map(s => {
                const label = s === "all" ? "All" : statusConfig[s].label
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            {someSelected || allSelected ? (
              <Button variant="outline" size="sm" onClick={clearSelection}>
                <X className="size-3.5 mr-1" />
                Deselect All
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-4">
                  <input
                    ref={allCheckRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="size-4 rounded cursor-pointer accent-primary"
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Trend Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(product => {
                const isSelected = selected.has(product.id)
                const sc = statusConfig[product.status]
                return (
                  <TableRow
                    key={product.id}
                    onClick={() => toggleOne(product.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-muted/40"}`}
                  >
                    {/* Checkbox */}
                    <TableCell className="pl-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(product.id)}
                        onClick={e => e.stopPropagation()}
                        className="size-4 rounded cursor-pointer accent-primary"
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>

                    {/* Product */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-9 rounded-lg object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{product.supplierName}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-xs text-muted-foreground">{product.niche}</TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="text-right text-sm font-semibold">
                      ${product.displayPrice.toFixed(2)}
                    </TableCell>

                    {/* Stock */}
                    <TableCell className="text-right">
                      <span className={`text-sm font-medium ${product.stock <= 10 ? "text-red-600" : product.stock <= 30 ? "text-amber-600" : "text-foreground"}`}>
                        {product.stock}
                      </span>
                    </TableCell>

                    {/* Trend Score */}
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-semibold">{product.trendScore}</span>
                        <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              product.trendScore >= 80 ? "bg-emerald-500" :
                              product.trendScore >= 60 ? "bg-amber-500" : "bg-muted-foreground/50"
                            }`}
                            style={{ width: `${product.trendScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-sm text-muted-foreground">
              <Package className="size-10 text-muted-foreground/40" />
              <p>No products match your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
