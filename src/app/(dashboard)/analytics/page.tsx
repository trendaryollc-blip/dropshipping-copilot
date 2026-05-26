"use client";

import { useEffect, useState } from "react";

interface AnalyticsResponse {
  summary: { revenue: number; orders: number; averageOrderValue: number; conversionRate: number; automationSuccessRate: number };
  topProducts: { name: string; sales: number; revenue: number }[];
  suppliers: { supplier: string; orders: number; onTimeRate: number; defectRate: number }[];
  daily: { date: string; revenue: number; orders: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    fetch("/api/analytics").then((response) => response.json()).then((data) => setAnalytics(data.analytics));
  }, []);

  if (!analytics) return <div className="text-sm text-zinc-400">Loading analytics...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Analytics & reports</h1>
        <p className="mt-1.5 text-sm text-zinc-400">Placeholder sales, product, supplier, and automation reporting.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Revenue" value={`$${analytics.summary.revenue.toLocaleString()}`} />
        <Metric label="Orders" value={analytics.summary.orders.toString()} />
        <Metric label="AOV" value={`$${analytics.summary.averageOrderValue.toFixed(2)}`} />
        <Metric label="Conversion" value={`${analytics.summary.conversionRate}%`} />
        <Metric label="Automation success" value={`${analytics.summary.automationSuccessRate}%`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top products">
          {analytics.topProducts.map((product) => (
            <div key={product.name} className="flex items-center justify-between border-b border-zinc-800 py-3 last:border-0">
              <div><p className="text-sm font-medium text-zinc-100">{product.name}</p><p className="text-xs text-zinc-500">{product.sales} sales</p></div>
              <p className="text-sm font-semibold text-emerald-300">${product.revenue.toLocaleString()}</p>
            </div>
          ))}
        </Panel>
        <Panel title="Supplier reliability">
          {analytics.suppliers.map((supplier) => (
            <div key={supplier.supplier} className="border-b border-zinc-800 py-3 last:border-0">
              <div className="flex justify-between text-sm"><span className="text-zinc-100">{supplier.supplier}</span><span className="text-emerald-300">{supplier.onTimeRate}% on-time</span></div>
              <p className="mt-1 text-xs text-zinc-500">{supplier.orders} orders · {supplier.defectRate}% defect rate</p>
            </div>
          ))}
        </Panel>
      </section>

      <Panel title="Daily performance">
        <div className="grid gap-3 sm:grid-cols-7">
          {analytics.daily.map((day) => (
            <div key={day.date} className="rounded-lg bg-zinc-950 p-3 text-center">
              <p className="text-xs text-zinc-500">{day.date}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-100">${day.revenue}</p>
              <p className="text-xs text-zinc-500">{day.orders} orders</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"><p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p><p className="mt-2 text-2xl font-semibold text-zinc-50">{value}</p></div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"><h2 className="font-medium text-zinc-100">{title}</h2><div className="mt-3">{children}</div></section>;
}
