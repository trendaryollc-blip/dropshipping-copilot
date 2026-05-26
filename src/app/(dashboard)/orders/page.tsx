"use client";

import { useEffect, useState } from "react";
import { exportToCSV } from "@/lib/utils/export";
import { toast } from "@/components/Toast";

interface OrderItem { id: string; productName: string; quantity: number; unitPrice: number; supplier?: string }
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customer: { name: string; email: string };
  items: OrderItem[];
  totals: { total: number; subtotal: number; shipping: number; tax: number };
  refundReason?: string;
  createdAt: string;
}

interface ReturnRequest {
  orderId: string;
  reason: string;
  resolution: "refund" | "replacement" | "store_credit";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [returnRequest, setReturnRequest] = useState<ReturnRequest>({ orderId: "", reason: "", resolution: "refund" });
  const [template, setTemplate] = useState("Thanks for your order. Your tracking details will be updated shortly.");

  useEffect(() => {
    fetchOrders();
  }, [status]);

  async function fetchOrders() {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    const response = await fetch(`/api/orders?${params.toString()}`);
    const data = await response.json();
    setOrders(data.orders ?? []);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchOrders();
  }

  function bulkUpdateStatus(nextStatus: string) {
    const ids = filtered.map((o) => o.id);
    if (!ids.length) return;
    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds: ids, updates: { status: nextStatus } }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((current) =>
          current.map((order) => (ids.includes(order.id) ? { ...order, status: nextStatus } : order))
        );
        if (selected && ids.includes(selected.id)) {
          setSelected({ ...selected, status: nextStatus });
        }
      });
  }

  async function updateOrder(id: string, nextStatus: string) {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (!response.ok) return;
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status: nextStatus } : order)));
    setSelected((current) => (current?.id === id ? { ...current, status: nextStatus } : current));
  }

  function splitBySupplier(order: Order) {
    return order.items.reduce<Record<string, OrderItem[]>>((groups, item) => {
      const supplier = item.supplier ?? "custom";
      groups[supplier] = [...(groups[supplier] ?? []), item];
      return groups;
    }, {});
  }

  function createReturnRequest(order: Order) {
    setReturnRequest({ orderId: order.id, reason: order.refundReason ?? "Customer requested return/refund.", resolution: "refund" });
  }

  function bulkDeleteOrders() {
    const ids = filtered.map((o) => o.id);
    if (!ids.length || !confirm(`Delete ${ids.length} orders? This cannot be undone.`)) return;
    Promise.all(ids.map((id) => fetch(`/api/orders/${id}`, { method: "DELETE" })))
      .then(() => {
        setOrders((current) => current.filter((order) => !ids.includes(order.id)));
        toast("Orders deleted.", "success");
      })
      .catch(() => toast("Failed to delete orders.", "error"));
  }

  function saveReturnRequest() {
    if (!returnRequest.orderId) return;
    fetch(`/api/orders/${returnRequest.orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: returnRequest.resolution === "replacement" ? "processing" : "refund_requested",
        refundReason: returnRequest.reason,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((current) =>
          current.map((order) =>
            order.id === returnRequest.orderId
              ? {
                  ...order,
                  status: returnRequest.resolution === "replacement" ? "processing" : "refund_requested",
                  refundReason: returnRequest.reason,
                }
              : order
          )
        );
        setSelected(null);
        setReturnRequest({ orderId: "", reason: "", resolution: "refund" });
        toast("Return request saved.", "success");
      });
  }

  const filtered = orders;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Order management</h1><p className="mt-1.5 text-sm text-zinc-400">Details, supplier splitting, tracking, returns, refunds, and customer message templates.</p></div>
        <button onClick={() => exportToCSV("orders", filtered.map((order) => ({ order: order.orderNumber, status: order.status, customer: order.customer.name, total: order.totals.total })))} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm">Export CSV</button>
      </header>

      <section className="flex flex-wrap gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-[260px]">
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by order #, customer, or product..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm"
          />
          <button type="submit" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">Search</button>
          {search && <button type="button" onClick={() => { setSearch(""); fetchOrders(); }} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">Clear</button>}
        </form>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"><option value="all">All statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option><option value="refund_requested">Refund requested</option><option value="refunded">Refunded</option></select>
        <button onClick={() => bulkUpdateStatus("processing")} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm">Bulk process</button>
        <button onClick={() => bulkUpdateStatus("shipped")} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm">Bulk mark shipped</button>
        <button onClick={bulkDeleteOrders} className="rounded-lg border border-red-800 px-3 py-2 text-sm text-red-300 hover:bg-red-950/30">Bulk delete</button>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="font-medium text-zinc-100">Customer communication template</h2>
        <textarea value={template} onChange={(event) => setTemplate(event.target.value)} className="mt-3 min-h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm" />
      </section>

      <section className="space-y-3">
        {filtered.map((order) => (
          <article key={order.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h2 className="font-medium text-zinc-100">{order.orderNumber}</h2><p className="text-sm text-zinc-500">{order.customer.name} · {order.items.length} item(s)</p></div>
              <div className="flex flex-wrap items-center gap-3"><span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{order.status}</span><p className="font-semibold text-emerald-300">${order.totals.total.toFixed(2)}</p><button onClick={() => setSelected(order)} className="text-sm text-emerald-400">Details</button><button onClick={() => createReturnRequest(order)} className="text-sm text-amber-300">Return</button></div>
            </div>
          </article>
        ))}
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex justify-between border-b border-zinc-800 pb-3"><h2 className="text-lg font-medium text-zinc-50">{selected.orderNumber}</h2><button onClick={() => setSelected(null)}>Close</button></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><p className="text-xs text-zinc-500">Customer</p><p className="text-zinc-100">{selected.customer.name}</p><p className="text-sm text-zinc-500">{selected.customer.email}</p></div><div><p className="text-xs text-zinc-500">Total</p><p className="text-zinc-100">${selected.totals.total.toFixed(2)}</p></div></div>
            <div className="mt-5 space-y-2">{Object.entries(splitBySupplier(selected)).map(([supplier, items]) => <div key={supplier} className="rounded-lg bg-zinc-950 p-3"><p className="text-xs uppercase text-zinc-500">Supplier: {supplier}</p>{items.map((item) => <div key={item.id} className="mt-2 flex justify-between text-sm"><span>{item.productName} ×{item.quantity}</span><span>${(item.unitPrice * item.quantity).toFixed(2)}</span></div>)}</div>)}</div>
            {selected.refundReason && <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">Refund reason: {selected.refundReason}</div>}
            <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950 p-3"><p className="text-xs text-zinc-500">Message preview</p><p className="mt-2 text-sm text-zinc-300">{template}</p></div>
            <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => updateOrder(selected.id, "shipped")} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm">Mark shipped</button><button onClick={() => updateOrder(selected.id, "refunded")} className="rounded-lg border border-red-800 px-3 py-2 text-sm text-red-300">Approve refund</button></div>
          </div>
        </div>
      )}

      {returnRequest.orderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex justify-between border-b border-zinc-800 pb-3"><h2 className="text-lg font-medium text-zinc-50">Return / refund request</h2><button onClick={() => setReturnRequest({ orderId: "", reason: "", resolution: "refund" })}>Close</button></div>
            <textarea value={returnRequest.reason} onChange={(event) => setReturnRequest({ ...returnRequest, reason: event.target.value })} className="mt-4 min-h-28 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm" />
            <select value={returnRequest.resolution} onChange={(event) => setReturnRequest({ ...returnRequest, resolution: event.target.value as ReturnRequest["resolution"] })} className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"><option value="refund">Refund</option><option value="replacement">Replacement</option><option value="store_credit">Store credit</option></select>
            <button onClick={saveReturnRequest} className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950">Save request</button>
          </div>
        </div>
      )}
    </div>
  );
}
