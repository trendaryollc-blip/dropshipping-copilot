"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock, XCircle, RefreshCw, Download, CheckSquare, Square, RotateCcw, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { orders } from "@/lib/mock-data"
import { toast } from "sonner"
import { exportToCSV, exportToXLSX } from "@/lib/csv-export"
import { AIActionButton } from "@/components/AIActionButton"
import type { OrderStatus } from "@/types"
import { useOrderUpdates, useWebSocket } from "@/hooks/use-websocket"
import { testRealTimeFeatures } from "@/lib/websocket-test"
import Link from "next/link"

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; class: string }> = {
  pending: { label: "Pending", icon: Clock, class: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  processing: { label: "Processing", icon: RefreshCw, class: "bg-primary/10 text-primary border-primary/20" },
  shipped: { label: "Shipped", icon: Truck, class: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  delivered: { label: "Delivered", icon: CheckCircle, class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, class: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
}

export default function OrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [realtimeOrders, setRealtimeOrders] = useState(orders)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const { isConnected } = useWebSocket()

  useOrderUpdates((data) => {
    setRealtimeOrders((prev) =>
      prev.map((order) =>
        order.id === data.orderId ? { ...order, status: data.status as OrderStatus } : order
      )
    )
    toast.info(`Order ${data.orderId} updated to ${data.status}`)
  })

  const filtered = realtimeOrders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusCounts = {
    all: realtimeOrders.length,
    pending: realtimeOrders.filter((o) => o.status === "pending").length,
    processing: realtimeOrders.filter((o) => o.status === "processing").length,
    shipped: realtimeOrders.filter((o) => o.status === "shipped").length,
    delivered: realtimeOrders.filter((o) => o.status === "delivered").length,
    cancelled: realtimeOrders.filter((o) => o.status === "cancelled").length,
  }

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id))
  const someSelected = selected.size > 0

  function toggleAll() {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(filtered.map((o) => o.id)))
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleExportCSV() {
    const rows = (someSelected ? filtered.filter((o) => selected.has(o.id)) : filtered).map((o) => ({
      order_id: o.id,
      product: o.productName,
      customer: o.customer,
      quantity: o.quantity,
      total: o.total,
      status: o.status,
      order_date: o.orderDate,
      estimated_delivery: o.estimatedDelivery,
      tracking_number: o.trackingNumber ?? "",
    }))
    if (!rows.length) { toast.error("No orders to export"); return }
    exportToCSV(rows, "orders")
    toast.success(`Exported ${rows.length} orders to CSV`)
  }

  function handleExportXLSX() {
    const rows = (someSelected ? filtered.filter((o) => selected.has(o.id)) : filtered).map((o) => ({
      order_id: o.id,
      product: o.productName,
      customer: o.customer,
      quantity: o.quantity,
      total: o.total,
      status: o.status,
      order_date: o.orderDate,
      estimated_delivery: o.estimatedDelivery,
      tracking_number: o.trackingNumber ?? "",
    }))
    if (!rows.length) { toast.error("No orders to export"); return }
    exportToXLSX(rows, "orders")
    toast.success(`Exported ${rows.length} orders to XLSX`)
  }

  return (
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              <ShoppingCart className="size-3" />
              Order Tracker
            </span>
            <h1 className="hero-title">Track every order</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Monitor and manage all your dropshipping orders with real-time updates in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border/30 bg-card/40 px-3 py-1.5 text-xs backdrop-blur-sm">
              <span className={`relative flex size-2`}>
                <span className={`absolute inline-flex size-full animate-ping rounded-full ${isConnected() ? "bg-emerald-400" : "bg-gray-400"} opacity-75`} />
                <span className={`relative inline-flex size-2 rounded-full ${isConnected() ? "bg-emerald-500" : "bg-gray-400"}`} />
              </span>
              <span className={`font-medium ${isConnected() ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                {isConnected() ? "Live sync" : "Offline"}
              </span>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-border/50 bg-card/50 text-xs" onClick={handleExportCSV}>
              <Download className="size-3.5" /> CSV
            </Button>
            <Button variant="secondary" size="sm" className="rounded-xl text-xs" onClick={handleExportXLSX}>
              <Download className="size-3.5" /> XLSX
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ Status Cards ═══ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 animate-in delay-1">
        {(Object.entries(statusCounts) as [string, number][]).filter(([k]) => k !== "all").map(([status, count]) => {
          const cfg = statusConfig[status as OrderStatus]
          const Icon = cfg.icon
          return (
            <button
              key={status}
              className={`group relative overflow-hidden rounded-2xl border bg-card/60 p-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
                statusFilter === status
                  ? "border-primary/30 bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-primary/20"
              }`}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex size-8 items-center justify-center rounded-lg ${cfg.class}`}>
                  <Icon className="size-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-mono text-lg font-bold text-foreground">{count}</p>
                  <p className="text-[10px] font-medium text-muted-foreground/60">{cfg.label}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ═══ Filters ═══ */}
      <div className="flex flex-wrap items-center gap-2.5 animate-in delay-2">
        <button
          onClick={() => { testRealTimeFeatures(); toast.success("Real-time test started!") }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/15"
        >
          <span>🧪</span> Test Real-Time
        </button>
        <Link
          href="/returns"
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 transition-all hover:bg-amber-500/15"
        >
          <RotateCcw className="size-3.5" /> Returns
        </Link>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-xl border-border/50 bg-card/50 pl-9 text-xs backdrop-blur-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
          <SelectTrigger size="sm" className="w-36 h-9 rounded-xl border-border/50 bg-card/50 text-xs">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
            <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
            <SelectItem value="processing">Processing ({statusCounts.processing})</SelectItem>
            <SelectItem value="shipped">Shipped ({statusCounts.shipped})</SelectItem>
            <SelectItem value="delivered">Delivered ({statusCounts.delivered})</SelectItem>
            <SelectItem value="cancelled">Cancelled ({statusCounts.cancelled})</SelectItem>
          </SelectContent>
        </Select>
        <p className="ml-auto font-mono text-xs text-muted-foreground/60">{filtered.length} orders</p>
      </div>

      {/* ═══ Bulk action bar ═══ */}
      {someSelected && (
        <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5 backdrop-blur-sm animate-in">
          <span className="text-xs font-bold text-primary">{selected.size} selected</span>
          <Button size="sm" variant="outline" className="h-7 rounded-xl text-xs" onClick={handleExportCSV}>
            <Download className="size-3.5" /> Export
          </Button>
          <Button size="sm" variant="ghost" className="h-7 rounded-xl text-xs ml-auto" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* ═══ Orders Table ═══ */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm animate-in delay-3">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="w-10 pl-4">
                <button onClick={toggleAll} className="text-muted-foreground/50 hover:text-foreground">
                  {allSelected ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4" />}
                </button>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Order</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Product</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Customer</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Total</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Status</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Tracking</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => {
              const status = statusConfig[order.status]
              const Icon = status.icon
              const isSelected = selected.has(order.id)
              return (
                <TableRow key={order.id} className={`border-border/20 transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-card/40"}`}>
                  <TableCell className="pl-4">
                    <button onClick={() => toggleOne(order.id)} className="text-muted-foreground/50 hover:text-foreground">
                      {isSelected ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4" />}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] font-semibold text-primary">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={order.productImage} alt={order.productName} className="size-8 rounded-lg object-cover border border-border/30" />
                      <div>
                        <p className="text-xs font-medium text-foreground leading-snug">{order.productName}</p>
                        <p className="text-[10px] text-muted-foreground/50">Qty: {order.quantity}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground/70">{order.customer}</TableCell>
                  <TableCell className="font-mono text-xs font-bold text-foreground">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`flex w-fit items-center gap-1 text-[10px] font-semibold border backdrop-blur-sm ${status.class}`}>
                      <Icon className="size-2.5" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <AIActionButton
                      task="fraud_detection"
                      input={{
                        orderAmount: order.total,
                        customerEmail: order.customer.toLowerCase().replace(/\s+/g, '') + '@example.com',
                        shippingCountry: 'US',
                      }}
                      label="AI"
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    {order.trackingNumber ? (
                      <button onClick={() => toast.success(`Tracking: ${order.trackingNumber}`)} className="font-mono text-[11px] text-primary hover:underline">
                        {order.trackingNumber}
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground/60">{order.estimatedDelivery}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* ═══ Empty State ═══ */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center animate-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground/40">
            <Package className="size-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">No orders found</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  )
}