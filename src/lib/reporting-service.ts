export type ReportType = "sales" | "compliance" | "inventory" | "custom"

export interface ScheduledReport {
  id: string
  name: string
  reportType: ReportType
  frequency: "daily" | "weekly" | "monthly"
  recipients: string[]
  enabled: boolean
  lastRunAt: string | null
}

const reports: ScheduledReport[] = [
  {
    id: "rpt-sales-001",
    name: "Weekly sales summary",
    reportType: "sales",
    frequency: "weekly",
    recipients: ["finance@dropease.com"],
    enabled: true,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "rpt-compliance-001",
    name: "Monthly compliance audit",
    reportType: "compliance",
    frequency: "monthly",
    recipients: ["legal@dropease.com"],
    enabled: false,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
]

export async function loadScheduledReports(): Promise<ScheduledReport[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...reports]), 200))
}

export async function saveScheduledReport(report: ScheduledReport): Promise<ScheduledReport> {
  const existing = reports.find((item) => item.id === report.id)
  if (existing) {
    Object.assign(existing, report)
  } else {
    reports.unshift(report)
  }
  return new Promise((resolve) => setTimeout(() => resolve({ ...report }), 200))
}

export async function runScheduledReport(reportId: string): Promise<{ success: boolean; message: string }> {
  const report = reports.find((item) => item.id === reportId)
  if (!report) {
    return { success: false, message: "Report not found" }
  }
  report.lastRunAt = new Date().toISOString()
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, message: `Report ${report.name} queued for delivery.` }), 300))
}
