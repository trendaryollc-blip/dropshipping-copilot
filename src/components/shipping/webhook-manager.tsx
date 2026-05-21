"use client"
import React, { useEffect, useState } from "react"
import { simulateWebhookEvent } from "@/lib/shipping-service"

export default function WebhookManager() {
  const [endpoints, setEndpoints] = useState<string[]>([])
  const [events, setEvents] = useState<unknown[]>([])
  const [url, setUrl] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dropease_shipping_webhooks_v1")
      if (raw) setEndpoints(JSON.parse(raw))
    } catch (e) {}
  }, [])

  function save(eps: string[]) {
    setEndpoints(eps)
    try { localStorage.setItem("dropease_shipping_webhooks_v1", JSON.stringify(eps)) } catch (e) {}
  }

  function addEndpoint() {
    if (!url) return
    const next = [url, ...endpoints]
    save(next)
    setUrl("")
  }

  function simulate(eventType = "shipment.updated") {
    const payload = { id: `EV-${Math.random().toString(36).slice(2,8)}`, type: eventType, timestamp: new Date().toISOString() }
    simulateWebhookEvent(eventType, payload, (envelope) => {
      setEvents((s) => [envelope, ...s].slice(0, 50))
    })
  }

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold">Webhook Manager</h3>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input placeholder="Webhook URL" value={url} onChange={(e) => setUrl(e.target.value)} className="border rounded p-2" />
        <div className="flex gap-2">
          <button onClick={addEndpoint} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          <button onClick={() => { save([]); setEvents([]) }} className="px-3 py-1 border rounded">Clear</button>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="font-medium">Registered Endpoints</h4>
        <ul className="mt-2 space-y-1">
          {endpoints.map((e, i) => (
            <li key={i} className="flex justify-between items-center p-1 border rounded">
              <div className="text-sm">{e}</div>
              <div className="flex gap-2">
                <button onClick={() => { const next = endpoints.filter((x) => x !== e); save(next) }} className="px-2 py-1 text-sm border rounded">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <h4 className="font-medium">Simulate Events</h4>
        <div className="flex gap-2 mt-2">
          <button onClick={() => simulate('shipment.created')} className="px-3 py-1 bg-green-600 text-white rounded">Shipment Created</button>
          <button onClick={() => simulate('shipment.updated')} className="px-3 py-1 bg-yellow-600 text-white rounded">Shipment Updated</button>
          <button onClick={() => simulate('shipment.delivered')} className="px-3 py-1 bg-indigo-600 text-white rounded">Shipment Delivered</button>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="font-medium">Recent Events (mock)</h4>
        <ul className="mt-2 space-y-2">
          {events.map((ev, i) => (
            <li key={i} className="text-sm border p-2 rounded"><pre className="whitespace-pre-wrap">{JSON.stringify(ev, null, 2)}</pre></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
