"use client"

import { useState, useMemo } from "react"
import { Search, MoreVertical, Trash2, Edit, Eye, Package, Download, CheckSquare, Square, Archive, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/store/useAppStore"
import { toast } from "sonner"
import { exportToCSV, exportToXLSX } from "@/lib/csv-export"
import type { ProductStatus } from "@/types"

const statusConfig: Record<ProductStatus, { label: string; class: string }> = {
  active: { label: "Active", class: "bg-success-light text-success border-success" },
  draft: { label: "Draft", class: "bg-warning-light text-warning border-warning" },
  archived: { label: "Archived", class: "bg-muted text-muted-foreground border-border" },
}

export default function MyProductsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const { products, updateProductStatus, deleteProduct } = useAppStore()

  const myProducts = products.filter((p) => p.importedAt)
  const filtered = myProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  // ── Selection helpers ────────────────────────────────────────────────────
  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id))
  const someSelected = selected.size > 0

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((p) => p.id)))
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Bulk actions ─────────────────────────────────────────────────────────
  function bulkSetStatus(status: ProductStatus) {
    selected.forEach((id) => updateProductStatus(id, status))
    toast.success(`${selected.size} product(s) set to ${status}`)
    setSelected(new Set())
  }

  function bulkDelete() {
    selected.forEach((id) => deleteProduct(id))
    toast.success(`${selected.size} product(s) deleted`)
    setSelected(new Set())
  }

  function handleExportCSV() {
    const rows = (someSelected ? filtered.filter((p) => selected.has(p.id)) : filtered).map((p) => ({
      id: p.id,
      name: p.name,
      niche: p.niche,
      supplier: p.supplierName,
      min_price: p.priceRange.min,
      max_price: p.priceRange.max,
      competition: p.competition,
      trend_score: p.trendScore,
      status: p.status,
      imported_at: p.importedAt ?? "",
    }))
    if (!rows.length) { toast.error("No products to export"); return }
    exportToCSV(rows, "my_products")
    toast.success(`Exported ${rows.length} products to CSV`)
  }

  function handleExportXLSX() {
    const rows = (someSelected ? filtered.filter((p) => selected.has(p.id)) : filtered).map((p) => ({
      id: p.id,
      name: p.name,
      niche: p.niche,
      supplier: p.supplierName,
      min_price: p.priceRange.min,
      max_price: p.priceRange.max,
      competition: p.competition,
      trend_score: p.trendScore,
      status: p.status,
      imported_at: p.importedAt ?? "",
    }))
    if (!rows.length) { toast.error("No products to export"); return }
    exportToXLSX(rows, "my_products")
    toast.success(`Exported ${rows.length} products to XLSX`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">My Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your imported products, update statuses, and edit listings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportXLSX}>
            <Download className="size-3.5" />
            Export XLSX
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search my products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
          <SelectTrigger size="sm" className="w-36 h-8 text-xs">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <p className="ml-auto text-xs text-muted-foreground">{filtered.length} products</p>
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <span className="text-xs font-semibold text-primary">{selected.size} selected</span>
          <div className="flex gap-1.5 ml-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => bulkSetStatus("active")}>
              <Zap className="size-3.5 text-green-500" /> Set Active
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => bulkSetStatus("draft")}>
              <Edit className="size-3.5" /> Set Draft
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => bulkSetStatus("archived")}>
              <Archive className="size-3.5" /> Archive
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleExportCSV}>
              <Download className="size-3.5" /> Export Selected
            </Button>
            <Button size="sm" className="h-7 text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 border-0" onClick={bulkDelete}>
              <Trash2 className="size-3.5" /> Delete
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10 pl-4">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                    {allSelected ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4" />}
                  </button>
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-[280px]">Product</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Supplier</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Price Range</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Imported</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const status = statusConfig[product.status]
                const isSelected = selected.has(product.id)
                return (
                  <TableRow key={product.id} className={`hover:bg-muted/20 ${isSelected ? "bg-primary/5" : ""}`}>
                    <TableCell className="pl-4">
                      <button onClick={() => toggleOne(product.id)} className="text-muted-foreground hover:text-foreground">
                        {isSelected ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4" />}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt={product.name} className="size-9 rounded-lg object-cover border border-border" />
                        <div>
                          <p className="text-sm font-medium text-foreground leading-snug">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.niche}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{product.supplierName}</TableCell>
                    <TableCell className="text-xs font-medium">${product.priceRange.min}–${product.priceRange.max}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] border ${status.class}`}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{product.importedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="size-7">
                              <MoreVertical className="size-3.5" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => toast.info("Edit coming soon!")}>
                            <Edit className="size-3.5 mr-2" /> Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Preview coming soon!")}>
                            <Eye className="size-3.5 mr-2" /> View Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {product.status !== "active" && (
                            <DropdownMenuItem onClick={() => { updateProductStatus(product.id, "active"); toast.success("Set to Active") }}>Set Active</DropdownMenuItem>
                          )}
                          {product.status !== "draft" && (
                            <DropdownMenuItem onClick={() => { updateProductStatus(product.id, "draft"); toast.success("Set to Draft") }}>Set as Draft</DropdownMenuItem>
                          )}
                          {product.status !== "archived" && (
                            <DropdownMenuItem onClick={() => { updateProductStatus(product.id, "archived"); toast.success("Archived") }}>Archive</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { deleteProduct(product.id); toast.success("Deleted") }}>
                            <Trash2 className="size-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-center rounded-xl border border-dashed border-border">
          <Package className="size-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No imported products yet.</p>
          <p className="text-xs text-muted-foreground">Go to Product Research to find and import products.</p>
          <Button
            size="sm"
            variant="outline"
            render={<a href="/products">Find Products</a>}
          />
        </div>
      )}
    </div>
  )
}
