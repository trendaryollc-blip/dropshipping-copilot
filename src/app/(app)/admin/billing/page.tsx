"use client"

import { useEffect, useState } from "react"
import { DollarSign, FileText, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { getBillingPlans, getInvoices, markInvoicePaid } from "@/lib/billing-service"

export default function AdminBillingPage() {
  const [plans, setPlans] = useState<Awaited<ReturnType<typeof getBillingPlans>>>([])
  const [invoices, setInvoices] = useState<Awaited<ReturnType<typeof getInvoices>>>([])

  useEffect(() => {
    getBillingPlans().then(setPlans)
    getInvoices().then(setInvoices)
  }, [])

  const handleMarkPaid = async (id: string) => {
    const updated = await markInvoicePaid(id)
    if (updated) {
      setInvoices((current) => current.map((invoice) => invoice.id === id ? updated : invoice))
      toast.success("Invoice marked paid")
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <DollarSign className="size-3" />
              Billing
            </span>
            <h1 className="hero-title">Billing & Invoices</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Manage subscriptions, invoices, and enterprise billing settings.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Offer tiered plans for enterprise customers and multi-store access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">{plan.interval} billing</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold">${plan.price}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Button className="mt-4 w-full" variant="secondary">
                  Choose {plan.name}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Track and reconcile recent customer invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{invoice.id}</p>
                    <p className="text-xs text-muted-foreground">{invoice.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{invoice.currency} {invoice.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{invoice.status}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Issued {new Date(invoice.issuedAt).toLocaleDateString()}</span>
                  <span>Due {new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
                {invoice.status !== "paid" && (
                  <Button className="mt-4" size="sm" onClick={() => handleMarkPaid(invoice.id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Paid
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <DollarSign className="size-5 text-primary" />
          <div>
            <p className="font-semibold">Enterprise billing placeholder</p>
            <p className="mt-1">Connect Stripe, PayPal, or Razorpay from Integrations for real billing updates.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
