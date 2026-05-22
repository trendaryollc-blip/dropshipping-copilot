"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useCustomerStore } from "@/store/useCustomerStore"
import CustomerProfileView from "@/components/customers/customer-profile"
import {
  exportCustomersCSV,
  downloadCSV,
  importCustomersFromCSV,
  loadActivities,
  loadSegments,
  applySegmentRules,
  loadAutomations,
  findDuplicateCustomers,
  mergeCustomers,
  refreshAllLeadScores,
  sendEmail,
  sendSMS,
  enrichContact,
  unsubscribeCustomer,
  loadAuditLog,
  loadGdprRequests,
  requestGdprExport,
  requestGdprDeletion,
  syncCustomersFromAPI,
  getCurrentRole,
  setCurrentRole,
  hasPermission,
  logAudit,
} from "@/lib/crm-service"
import type { CustomerProfile, CrmRole } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Tab = "contacts" | "timeline" | "segments" | "automations" | "compliance" | "audit"

export default function CrmHub() {
  const customers = useCustomerStore((s) => s.customers)
  const load = useCustomerStore((s) => s.load)
  const updateCustomer = useCustomerStore((s) => s.updateCustomer)
  const [tab, setTab] = useState<Tab>("contacts")
  const [selected, setSelected] = useState<string | null>(null)
  const [activities, setActivities] = useState(loadActivities())
  const [segments] = useState(loadSegments())
  const [automations] = useState(loadAutomations())
  const [audit] = useState(loadAuditLog())
  const [gdpr] = useState(loadGdprRequests())
  const [role, setRole] = useState<CrmRole>(getCurrentRole())
  const [duplicates, setDuplicates] = useState<CustomerProfile[][]>([])
  const [status, setStatus] = useState("")

  useEffect(() => { load(); syncCustomersFromAPI().then(() => load()) }, [load])

  const refreshScores = useCallback(() => {
    const updated = refreshAllLeadScores(customers)
    updated.forEach((c) => updateCustomer(c.id, { leadScore: c.leadScore }))
    setStatus("Lead scores updated")
  }, [customers, updateCustomer])

  const handleImport = async (file: File) => {
    const text = await file.text()
    const imported = await importCustomersFromCSV(text)
    imported.forEach((c) => useCustomerStore.getState().addCustomer(c))
    logAudit("import_csv", role, { count: imported.length })
    setStatus(`Imported ${imported.length} contacts`)
  }

  const handleExport = () => {
    if (!hasPermission("export")) { setStatus("No permission"); return }
    downloadCSV(exportCustomersCSV(customers), `customers-${Date.now()}.csv`)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "contacts", label: "Contacts" },
    { id: "timeline", label: "Timeline" },
    { id: "segments", label: "Segments" },
    { id: "automations", label: "Automations" },
    { id: "compliance", label: "GDPR & Consent" },
    { id: "audit", label: "Audit Log" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((t) => (
          <Button key={t.id} variant={tab === t.id ? "default" : "outline"} size="sm" onClick={() => setTab(t.id)}>
            {t.label}
          </Button>
        ))}
        <select
          className="ml-auto rounded border px-2 py-1 text-sm"
          value={role}
          onChange={(e) => { setRole(e.target.value as CrmRole); setCurrentRole(e.target.value as CrmRole) }}
        >
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {status && <p className="text-sm text-muted-foreground">{status}</p>}

      {tab === "contacts" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded border px-3 py-1 text-sm hover:bg-accent">
              Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])} />
            </label>
            <Button size="sm" variant="outline" onClick={handleExport}>Export CSV</Button>
            <Button size="sm" variant="outline" onClick={refreshScores}>Refresh Lead Scores</Button>
            <Button size="sm" variant="outline" onClick={() => setDuplicates(findDuplicateCustomers(customers))}>Find Duplicates</Button>
          </div>

          {duplicates.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Duplicate Groups</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {duplicates.map((group, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span>{group.map((c) => c.email).join(" / ")}</span>
                    <Button size="sm" variant="outline" onClick={() => {
                      const [primary, ...rest] = group
                      const merged = mergeCustomers(primary.id, rest.map((c) => c.id), customers)
                      merged.forEach((c) => updateCustomer(c.id, c))
                      setDuplicates([])
                      setStatus("Merged duplicates")
                    }}>Merge</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className="rounded-lg border p-3 text-left transition hover:border-primary/40 hover:bg-accent/50"
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-muted-foreground">{c.email}</div>
                <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                  <span>{c.segment}</span>
                  <span>Score: {c.leadScore ?? "—"}</span>
                  {c.unsubscribed && <span className="text-destructive">Unsubscribed</span>}
                </div>
                <div className="mt-2 flex gap-1">
                  {hasPermission("email") && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); sendEmail(c.email, "welcome", c.id).then(() => setActivities(loadActivities())) }}>Email</Button>
                  )}
                  {hasPermission("sms") && c.phone && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); sendSMS(c.phone!, "Thanks for being a customer!", c.id) }}>SMS</Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); enrichContact(c).then((en) => updateCustomer(c.id, en)) }}>Enrich</Button>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="rounded-lg border p-4">
              <CustomerProfileView id={selected} onClose={() => setSelected(null)} />
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { unsubscribeCustomer(selected, customers); setStatus("Unsubscribed") }}>Unsubscribe</Button>
                <Button size="sm" variant="outline" onClick={() => { requestGdprExport(selected, customers); setStatus("GDPR export requested") }}>GDPR Export</Button>
                <Button size="sm" variant="destructive" onClick={() => { requestGdprDeletion(selected); setStatus("GDPR deletion scheduled") }}>Request Deletion</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "timeline" && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {activities.length === 0 && <p className="text-sm text-muted-foreground">No activities yet. Send an email or SMS to a contact.</p>}
          {activities.map((a) => (
            <div key={a.id} className="rounded border p-2 text-sm">
              <span className="font-medium capitalize">{a.type}</span> — {a.title}
              <div className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "segments" && (
        <div className="space-y-3">
          {segments.map((seg) => {
            const matched = applySegmentRules(customers, seg)
            return (
              <Card key={seg.id}>
                <CardHeader><CardTitle className="text-sm">{seg.name}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {seg.rules.length} rule(s) • {matched.length} matching contacts
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {tab === "automations" && (
        <div className="space-y-2">
          {automations.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded border p-3 text-sm">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-muted-foreground">{a.trigger} → {a.action}</div>
              </div>
              <span className={a.enabled ? "text-green-600" : "text-muted-foreground"}>{a.enabled ? "On" : "Off"}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "compliance" && (
        <div className="space-y-3 text-sm">
          <p>Manage unsubscribe, consent, and GDPR requests.</p>
          {gdpr.map((r) => (
            <div key={r.id} className="rounded border p-2">
              {r.type.toUpperCase()} — {r.status} — customer {r.customerId}
            </div>
          ))}
        </div>
      )}

      {tab === "audit" && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {audit.length === 0 && <p className="text-sm text-muted-foreground">Actions will appear here.</p>}
          {audit.map((e) => (
            <div key={e.id} className="rounded border p-2 text-sm">
              <span className="font-medium">{e.action}</span> by {e.actor}
              <div className="text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
