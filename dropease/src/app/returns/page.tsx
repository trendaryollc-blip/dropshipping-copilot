"use client"

import { useState } from "react"
import { Package, CheckCircle, XCircle, DollarSign, RotateCcw, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { ReturnRequest, ReturnStatus } from "@/types"

const INITIAL_RETURNS: ReturnRequest[] = [
  { id: "RET-001", orderId: "ORD-1040", productName: "Bamboo Cutting Board Set", productImage: "https://picsum.photos/seed/bamboo/60/60", customer: "Emily Chen", reason: "damaged", status: "requested", requestedAt: "2024-01-16", amount: 19.99, notes: "Product arrived cracked on one side." },
  { id: "RET-002", orderId: "ORD-1039", productName: "Facial Roller Massager", productImage: "https://picsum.photos/seed/roller/60/60", customer: "Aisha Khan", reason: "not_as_described", status: "approved", requestedAt: "2024-01-15", amount: 16.99, notes: "Color was different from the listing." },
  { id: "RET-003", orderId: "ORD-1038", productName: "Resistance Band Set", productImage: "https://picsum.photos/seed/bands/60/60", customer: "Luca Romano", reason: "changed_mind", status: "refunded", requestedAt: "2024-01-13", resolvedAt: "2024-01-14", amount: 27.99 },
  { id: "RET-004", orderId: "ORD-1037", productName: "Essential Oil Diffuser", productImage: "https://picsum.photos/seed/diffuser/60/60", customer: "Priya Sharma", reason: "quality_issue", status: "denied", requestedAt: "2024-01-12", resolvedAt: "2024-01-13", amount: 31.99, notes: "Used for 10+ days before reporting." },
  { id: "RET-005", orderId: "ORD-1041", productName: "Foldable Travel Bag", productImage: "https://picsum.photos/seed/bag/60/60", customer: "James Cooper", reason: "wrong_item", status: "requested", requestedAt: "2024-01-17", amount: 24.99, notes: "Received black bag but ordered navy blue." },
]

const statusConfig: Record<ReturnStatus, { label: string; class: string }> = {
  requested: { label: "Requested", class: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "Approved", class: "bg-blue-100 text-blue-700 border-blue-200" },
  refunded: { label: "Refunded", class: "bg-green-100 text-green-700 border-green-200" },
  denied: { label: "Denied", class: "bg-red-100 text-red-700 border-red-200" },
}

const reasonLabel: Record<string, string> = {
  damaged: "Arrived Damaged",
  wrong_item: "Wrong Item",
  not_as_described: "Not as Described",
  changed_mind: "Changed Mind",
  quality_issue: "Quality Issue",
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>(INITIAL_RETURNS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = returns.filter((r) => {
    const matchSearch =
      r.orderId.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || r.status === statusFilter
    return matchSearch && matchStatus
  })

  function updateStatus(id: string, status: ReturnStatus) {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status, resolvedAt: status !== "requested" ? new Date().toISOString().split("T")[0] : undefined }
          : r
      )
    )
    const messages: Record<ReturnStatus, string> = {
      approved: "Return approved – awaiting item",
      refunded: "Refund issued to customer",
      denied: "Return request denied",
      requested: "Status updated",
    }
    toast.success(messages[status])
  }

  const stats = {
    total: returns.length,
    requested: returns.filter((r) => r.status === "requested").length,
    refunded: returns.filter((r) => r.status === "refunded").length,
    totalRefunded: returns.filter((r) => r.status === "refunded").reduce((s, r) => s + r.amount, 0),
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Returns & Refunds</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage customer return requests and issue refunds with one click.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total Returns", value: stats.total, icon: RotateCcw, color: "bg-blue-100 text-blue-600" },
          { label: "Action Needed", value: stats.requested, icon: Package, color: "bg-amber-100 text-amber-600" },
          { label: "Refunds Issued", value: stats.refunded, icon: CheckCircle, color: "bg-green-100 text-green-600" },
          { label: "$ Refunded", value: `$${stats.totalRefunded.toFixed(2)}`, icon: DollarSign, color: "bg-purple-100 text-purple-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card flex items-center gap-3">
            <div className={`flex size-9 items-center justify-center rounded-lg ${color}`}>
              <Icon className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search returns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
          <SelectTrigger size="sm" className="w-40 h-8 text-xs">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
        <p className="ml-auto text-xs text-muted-foreground">{filtered.length} returns</p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 rounded-xl border border-dashed border-border text-center">
          <RotateCcw className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No returns found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ret) => {
            const status = statusConfig[ret.status]
            return (
              <Card key={ret.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <img src={ret.productImage} alt={ret.productName} className="size-12 rounded-lg object-cover border border-border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold">{ret.productName}</p>
                        <Badge className={`text-[10px] border ${status.class}`}>{status.label}</Badge>
                      </div>
                      <div className="grid gap-x-6 gap-y-0.5 text-xs text-muted-foreground sm:grid-cols-3">
                        <span>Order: <span className="font-mono text-primary">{ret.orderId}</span></span>
                        <span>Customer: <span className="text-foreground">{ret.customer}</span></span>
                        <span>Reason: <span className="text-foreground">{reasonLabel[ret.reason]}</span></span>
                        <span>Requested: {ret.requestedAt}</span>
                        {ret.resolvedAt && <span>Resolved: {ret.resolvedAt}</span>}
                        <span>Amount: <span className="font-semibold text-foreground">${ret.amount.toFixed(2)}</span></span>
                      </div>
                      {ret.notes && (
                        <p className="mt-1.5 text-xs text-muted-foreground italic">"{ret.notes}"</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {ret.status === "requested" && (
                        <>
                          <Button size="sm" className="h-7 text-xs" onClick={() => updateStatus(ret.id, "approved")}>
                            <CheckCircle className="size-3.5" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => updateStatus(ret.id, "denied")}>
                            <XCircle className="size-3.5" /> Deny
                          </Button>
                        </>
                      )}
                      {ret.status === "approved" && (
                        <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => updateStatus(ret.id, "refunded")}>
                          <DollarSign className="size-3.5" /> Issue Refund
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
