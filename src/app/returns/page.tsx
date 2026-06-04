"use client"

import { useState } from "react"
import { Package, CheckCircle, XCircle, DollarSign, RotateCcw, Search, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIActionButton } from "@/components/AIActionButton"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { ReturnRequest, ReturnStatus } from "@/types"

interface ReturnWithAI extends ReturnRequest { aiRecommendation: string }

const INITIAL_RETURNS: ReturnRequest[] = [
  { id: "RET-001", orderId: "ORD-1040", productName: "Bamboo Cutting Board Set", productImage: "https://picsum.photos/seed/bamboo/60/60", customer: "Emily Chen", reason: "damaged", status: "requested", requestedAt: "2024-01-16", amount: 19.99, notes: "Product arrived cracked on one side." },
  { id: "RET-002", orderId: "ORD-1039", productName: "Facial Roller Massager", productImage: "https://picsum.photos/seed/roller/60/60", customer: "Aisha Khan", reason: "not_as_described", status: "approved", requestedAt: "2024-01-15", amount: 16.99, notes: "Color was different from the listing." },
  { id: "RET-003", orderId: "ORD-1038", productName: "Resistance Band Set", productImage: "https://picsum.photos/seed/bands/60/60", customer: "Luca Romano", reason: "changed_mind", status: "refunded", requestedAt: "2024-01-13", resolvedAt: "2024-01-14", amount: 27.99 },
  { id: "RET-004", orderId: "ORD-1037", productName: "Essential Oil Diffuser", productImage: "https://picsum.photos/seed/diffuser/60/60", customer: "Priya Sharma", reason: "quality_issue", status: "denied", requestedAt: "2024-01-12", resolvedAt: "2024-01-13", amount: 31.99, notes: "Used for 10+ days before reporting." },
  { id: "RET-005", orderId: "ORD-1041", productName: "Foldable Travel Bag", productImage: "https://picsum.photos/seed/bag/60/60", customer: "James Cooper", reason: "wrong_item", status: "requested", requestedAt: "2024-01-17", amount: 24.99, notes: "Received black bag but ordered navy blue." },
]

const statusConfig: Record<ReturnStatus, { label: string; class: string }> = {
  requested: { label: "Requested", class: "bg-warning-light text-warning border-warning" },
  approved: { label: "Approved", class: "bg-primary-light text-primary border-primary" },
  refunded: { label: "Refunded", class: "bg-success-light text-success border-success" },
  denied: { label: "Denied", class: "bg-destructive-light text-destructive border-destructive" },
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
  const [aiDecisions, setAiDecisions] = useState<ReturnWithAI[]>([])
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

  async function reviewReturnsWithAI() {
    const pending = returns.filter(r => r.status === "requested")
    if (pending.length === 0) { toast.info("No pending returns to review"); return }
    toast.loading("AI is reviewing returns...", { id: "ai-returns" })
    try {
      const { analyzeReturnsWithDeepSeek } = await import("@/lib/ai/deepseek-returns")
      const results = await analyzeReturnsWithDeepSeek(pending)
      const merged = pending.map(r => {
        const dec = results.find(d => d.id === r.id)
        return { ...r, aiRecommendation: dec ? `${dec.recommendation.toUpperCase()} (${dec.confidence}) — ${dec.suggestedAction}` : "Pending" }
      })
      setAiDecisions(merged)
      toast.success(`Reviewed ${results.length} returns!`, { id: "ai-returns" })
    } catch (e) {
      toast.error("AI review failed. Check API key.", { id: "ai-returns" })
    }
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
          { label: "Total Returns", value: stats.total, icon: RotateCcw, color: "bg-primary-light text-primary" },
          { label: "Action Needed", value: stats.requested, icon: Package, color: "bg-warning-light text-warning" },
          { label: "Refunds Issued", value: stats.refunded, icon: CheckCircle, color: "bg-success-light text-success" },
          { label: "$ Refunded", value: `$${stats.totalRefunded.toFixed(2)}`, icon: DollarSign, color: "bg-accent-light text-accent" },
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
        <div className="ml-auto flex gap-2 items-center">
          <p className="text-xs text-muted-foreground mr-2">{filtered.length} returns</p>
          <AIActionButton
            task="returns_review"
            input={{ returns: returns.filter(r => r.status === "requested") }}
            label="AI Auto-Review"
            onSuccess={(result) => {
              toast.success("AI recommendations ready", { id: "ai-returns" })
            }}
          />
        </div>
      </div>

      {aiDecisions.length > 0 && (
        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> AI Return Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiDecisions.map((ret) => (
              <div key={ret.id} className="text-xs flex justify-between items-start gap-3">
                <span className="truncate">{ret.productName}</span>
                <span className="font-medium text-primary whitespace-nowrap">{ret.aiRecommendation}</span>
              </div>
            ))}
          </CardContent>
          <Button onClick={() => setAiDecisions([])} size="sm" variant="ghost" className="w-full mt-1">Dismiss</Button>
        </Card>
      )}

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
