"use client";

import { useEffect, useState } from "react";

interface Webhook { id: string; name: string; url: string; events: string[]; isActive: boolean; failureCount: number }
interface Delivery { id: string; event: string; responseStatus: number; retryCount: number; deliveredAt: string; nextRetryAt?: string }

const allEvents = ["order.created", "order.updated", "order.shipped", "order.delivered", "order.refunded", "product.created", "product.updated", "automation.completed", "automation.failed"];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["order.created"]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    fetch("/api/webhooks").then((response) => response.json()).then((data) => setWebhooks(data.webhooks ?? []));
  }, []);

  async function addWebhook() {
    if (!url) return;
    const webhook = { name: "Custom webhook", url, events, isActive: true, failureCount: 0 };
    await fetch("/api/webhooks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(webhook) });
    setWebhooks((current) => [{ id: `webhook-${Date.now()}`, ...webhook }, ...current]);
    setUrl("");
  }

  function testWebhook(webhook: Webhook) {
    setDeliveries((current) => [{ id: `delivery-${Date.now()}`, event: webhook.events[0] ?? "test", responseStatus: 200, retryCount: 0, deliveredAt: new Date().toISOString() }, ...current]);
  }

  function toggleEvent(eventName: string) {
    setEvents((current) => current.includes(eventName) ? current.filter((event) => event !== eventName) : [...current, eventName]);
  }

  return (
    <div className="space-y-8">
      <header><h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Webhooks</h1><p className="mt-1.5 text-sm text-zinc-400">Signed webhook payloads, event subscriptions, test deliveries, and placeholder retry history.</p></header>
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex flex-wrap gap-3"><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/webhook" className="min-w-[300px] flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" /><button onClick={addWebhook} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950">Add webhook</button></div>
        <div className="flex flex-wrap gap-2">{allEvents.map((eventName) => <button key={eventName} onClick={() => toggleEvent(eventName)} className={`rounded px-2 py-1 text-xs ${events.includes(eventName) ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-400"}`}>{eventName}</button>)}</div>
      </section>
      <section className="space-y-3">{webhooks.map((webhook) => <article key={webhook.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"><div className="flex justify-between gap-3"><div><h2 className="font-medium text-zinc-100">{webhook.name}</h2><p className="mt-1 text-sm text-zinc-500">{webhook.url}</p></div><span className={webhook.isActive ? "text-xs text-emerald-300" : "text-xs text-zinc-500"}>{webhook.isActive ? "Active" : "Paused"}</span></div><p className="mt-3 text-xs text-zinc-500">Events: {webhook.events.join(", ")} · Failures: {webhook.failureCount}</p><button onClick={() => testWebhook(webhook)} className="mt-4 rounded-lg border border-zinc-700 px-3 py-2 text-sm">Send test</button></article>)}</section>
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"><h2 className="font-medium text-zinc-100">Delivery history</h2><div className="mt-3 space-y-2">{deliveries.length === 0 ? <p className="text-sm text-zinc-500">No test deliveries yet.</p> : deliveries.map((delivery) => <div key={delivery.id} className="flex justify-between rounded bg-zinc-950 p-3 text-sm"><span>{delivery.event}</span><span>{delivery.responseStatus} · retry {delivery.retryCount}</span></div>)}</div></section>
    </div>
  );
}
