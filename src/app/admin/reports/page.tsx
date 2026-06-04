"use client"

import { useEffect, useState } from "react"
import { FileText, Clock, ArrowRight, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { loadScheduledReports, runScheduledReport, saveScheduledReport } from "@/lib/reporting-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Awaited<ReturnType<typeof loadScheduledReports>>>([])
  const [newName, setNewName] = useState("")
  const [newFrequency, setNewFrequency] = useState<"daily" | "weekly" | "monthly">("weekly")

  useEffect(() => {
    loadScheduledReports().then(setReports)
  }, [])

  const handleRun = async (id: string) => {
    const result = await runScheduledReport(id)
    if (result.success) {
      setReports((prev) => prev.map((report) => report.id === id ? { ...report, lastRunAt: new Date().toISOString() } : report))
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return toast.error("Enter a report name")
    const saved = await saveScheduledReport({
      id: `rpt-${Date.now()}`,
      name: newName,
      reportType: "custom",
      frequency: newFrequency,
      recipients: ["reports@dropease.com"],
      enabled: true,
      lastRunAt: null,
    })
    setReports((prev) => [saved, ...prev])
    setNewName("")
    toast.success("Scheduled report created")
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Reporting Automation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Schedule sales, compliance, and inventory reports for your team automatically.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create a Scheduled Report</CardTitle>
            <CardDescription>Send automated reports to finance, operations, or legal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs font-medium">Report Name</Label>
              <Input value={newName} onChange={(event) => setNewName(event.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-medium">Frequency</Label>
              <Select value={newFrequency} onValueChange={(value) => setNewFrequency(value as "daily" | "weekly" | "monthly") }>
                <SelectTrigger className="w-full"><SelectValue placeholder="Frequency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreate}>
              <Repeat className="mr-2 h-4 w-4" /> Schedule Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Running Reports</CardTitle>
            <CardDescription>Review and run existing scheduled reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.frequency} • {report.reportType}</p>
                  </div>
                  <Button size="sm" onClick={() => handleRun(report.id)}>
                    <ArrowRight className="mr-2 h-4 w-4" /> Run
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Last run: {report.lastRunAt ? new Date(report.lastRunAt).toLocaleString() : "Not yet"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <FileText className="size-5 text-primary" />
          <div>
            <p className="font-semibold">Compliance reporting automation</p>
            <p className="mt-1">Create scheduled reports for GDPR, tax, or inventory audits and deliver them by email.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
