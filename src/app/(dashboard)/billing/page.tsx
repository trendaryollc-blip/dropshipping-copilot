"use client";

import { useEffect, useState } from "react";

interface Billing { plan: string; usage: Record<string, number>; limits: Record<string, number> }

const plans = [
  { id: "free", price: "$0", description: "Basic testing and demo usage" },
  { id: "starter", price: "$29/mo", description: "Small store automation" },
  { id: "professional", price: "$79/mo", description: "Growing store with team workflows" },
  { id: "enterprise", price: "Custom", description: "High-volume operations and support" },
];

export default function BillingPage() {
  const [billing, setBilling] = useState<Billing | null>(null);

  useEffect(() => {
    fetch("/api/billing").then((response) => response.json()).then((data) => setBilling(data.billing));
  }, []);

  if (!billing) return <div className="text-sm text-zinc-400">Loading billing...</div>;

  return (
    <div className="space-y-8">
      <header><h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Billing & usage</h1><p className="mt-1.5 text-sm text-zinc-400">Stripe-ready plan scaffold, usage metering, limits, invoices, and placeholder checkout actions.</p></header>
      <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5"><p className="text-xs uppercase tracking-wide text-emerald-300">Current plan</p><h2 className="mt-2 text-2xl font-semibold capitalize text-zinc-50">{billing.plan}</h2></section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{plans.map((plan) => <article key={plan.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"><h2 className="font-medium capitalize text-zinc-100">{plan.id}</h2><p className="mt-2 text-2xl font-semibold text-zinc-50">{plan.price}</p><p className="mt-2 text-sm text-zinc-500">{plan.description}</p><button className="mt-4 rounded-lg border border-zinc-700 px-3 py-2 text-sm">Placeholder checkout</button></article>)}</section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(billing.usage).map(([key, value]) => { const limit = billing.limits[key] ?? 0; const percent = limit ? Math.min(100, Math.round((value / limit) * 100)) : 0; return <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"><p className="text-xs uppercase tracking-wide text-zinc-500">{key}</p><p className="mt-2 text-xl font-semibold text-zinc-50">{value}</p><div className="mt-3 h-2 rounded bg-zinc-800"><div className="h-2 rounded bg-emerald-500" style={{ width: `${percent}%` }} /></div><p className="mt-1 text-xs text-zinc-500">{percent}% of limit</p></div>; })}</section>
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"><h2 className="font-medium text-zinc-100">Invoice history</h2><div className="mt-3 space-y-2">{["INV-placeholder-001", "INV-placeholder-002"].map((invoice) => <div key={invoice} className="flex justify-between rounded bg-zinc-950 p-3 text-sm"><span>{invoice}</span><span className="text-emerald-300">Paid</span></div>)}</div></section>
    </div>
  );
}
