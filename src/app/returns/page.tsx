"use client"

import { useState } from "react"
import { Package, CheckCircle, XCircle, DollarSign, RotateCcw, Search, Sparkles } from "lucide-react"
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
  requested: { label: "Requested", class: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  approved: { label: "Approved", class: "bg-primary/10 text-primary border-primary/20" },
  refunded: { label: "Refunded", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  denied: { label: "Denied", class: "bg-red-500/10 text-red-600 border-red-500/20" },
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
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Package className="size-3" />
              Returns Manager
            </span>
            <h1 className="hero-title">Returns & Refunds</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Manage customer return requests and issue refunds with one click.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total Returns", value: stats.total, icon: RotateCcw, color: "bg-primary/10 text-primary" },
          { label: "Action Needed", value: stats.requested, icon: Package, color: "bg-amber-500/10 text-amber-600" },
          { label: "Refunds Issued", value: stats.refunded, icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "$ Refunded", value: `$${stats.totalRefunded.toFixed(2)}`, icon: DollarSign, color: "bg-amber-500/10 text-amber-600" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`stat-card card-interactive animate-in delay-${Math.min(i % 8 + 1, 8)}`}>
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
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-1">
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />
        
        <div className="relative z-10 flex flex-wrap items-center gap-3">
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
              onSuccess={() => {
                toast.success("AI recommendations ready", { id: "ai-returns" })
              }}
            />
          </div>
        </div>
      </div>

      {aiDecisions.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 backdrop-blur-sm animate-in delay-2">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">AI Return Recommendations</h3>
            </div>
            <div className="space-y-2">
              {aiDecisions.map((ret) => (
                <div key={ret.id} className="text-xs flex justify-between items-start gap-3">
                  <span className="truncate">{ret.productName}</span>
                  <span className="font-medium text-primary whitespace-nowrap">{ret.aiRecommendation}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setAiDecisions([])} size="sm" variant="ghost" className="w-full rounded-xl mt-1">Dismiss</Button>
          </div>
        </div>
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
              <div key={ret.id} className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm hover:shadow-sm transition-all duration-300 animate-in">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                          <Button size="sm" className="h-7 text-xs rounded-xl" onClick={() => updateStatus(ret.id, "approved")}>
                            <CheckCircle className="size-3.5" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl" onClick={() => updateStatus(ret.id, "denied")}>
                            <XCircle className="size-3.5" /> Deny
                          </Button>
                        </>
                      )}
                      {ret.status === "approved" && (
                        <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 rounded-xl" onClick={() => updateStatus(ret.id, "refunded")}>
                          <DollarSign className="size-3.5" /> Issue Refund
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
