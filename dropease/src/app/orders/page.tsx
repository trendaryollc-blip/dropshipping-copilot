"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock, XCircle, RefreshCw, Wifi, Download, CheckSquare, Square, RotateCcw } from "lucide-react"
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
import { exportToCSV } from "@/lib/csv-export"
import { AIActionButton } from "@/components/AIActionButton"
import type { OrderStatus } from "@/types"
import { useOrderUpdates, useWebSocket } from "@/hooks/use-websocket"
import { testRealTimeFeatures } from "@/lib/websocket-test"
import Link from "next/link"

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; class: string }> = {
  pending: { label: "Pending", icon: Clock, class: "bg-amber-100 text-amber-700 border-amber-200" },
  processing: { label: "Processing", icon: RefreshCw, class: "bg-blue-100 text-blue-700 border-blue-200" },
  shipped: { label: "Shipped", icon: Truck, class: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "Delivered", icon: CheckCircle, class: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", icon: XCircle, class: "bg-red-100 text-red-700 border-red-200" },
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

  // ── Selection ────────────────────────────────────────────────────────────
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

  // ── CSV Export ───────────────────────────────────────────────────────────
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

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Order Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage all your dropshipping orders in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className={`size-4 ${isConnected() ? "text-green-500" : "text-gray-400"}`} />
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {isConnected() ? "Real-time active" : "Offline"}
          </span>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="size-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(Object.entries(statusCounts) as [string, number][]).filter(([k]) => k !== "all").map(([status, count]) => {
          const cfg = statusConfig[status as OrderStatus]
          const Icon = cfg.icon
          return (
            <div key={status} className={`stat-card flex items-center gap-3 cursor-pointer ${statusFilter === status ? "ring-2 ring-primary" : ""}`} onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}>
              <div className={`flex size-8 items-center justify-center rounded-lg ${cfg.class}`}>
                <Icon className="size-3.5" />
              </div>
              <div>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-[11px] text-muted-foreground">{cfg.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => { testRealTimeFeatures(); toast.success("Real-time test started!") }} className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded text-sm border">
          🧪 Test Real-Time
        </button>
        <Link href="/returns" className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded text-sm border flex items-center gap-1.5">
          <RotateCcw className="size-3.5" /> Returns & Refunds
        </Link>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
          <SelectTrigger size="sm" className="w-36 h-8 text-xs">
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
        <p className="ml-auto text-xs text-muted-foreground">{filtered.length} orders</p>
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <span className="text-xs font-semibold text-primary">{selected.size} selected</span>
          <Button size="sm" variant="outline" className="h-7 text-xs ml-2" onClick={handleExportCSV}>
            <Download className="size-3.5" /> Export Selected
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-10 pl-4">
                <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                  {allSelected ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4" />}
                </button>
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Order ID</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Product</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Customer</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Total</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Tracking</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Est. Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => {
              const status = statusConfig[order.status]
              const Icon = status.icon
              const isSelected = selected.has(order.id)
              return (
                <TableRow key={order.id} className={`hover:bg-muted/20 ${isSelected ? "bg-primary/5" : ""}`}>
                  <TableCell className="pl-4">
                    <button onClick={() => toggleOne(order.id)} className="text-muted-foreground hover:text-foreground">
                      {isSelected ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4" />}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium text-primary">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <img src={order.productImage} alt={order.productName} className="size-8 rounded-md object-cover border border-border" />
                      <div>
                        <p className="text-xs font-medium text-foreground leading-snug">{order.productName}</p>
                        <p className="text-[11px] text-muted-foreground">Qty: {order.quantity}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{order.customer}</TableCell>
                  <TableCell className="text-xs font-semibold">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`flex w-fit items-center gap-1 text-[10px] border ${status.class}`}>
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
                       <span className="text-[11px] text-muted-foreground">—</span>
                     )}
                   </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{order.estimatedDelivery}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Package className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No orders match your search.</p>
        </div>
      )}
    </div>
  )
}
