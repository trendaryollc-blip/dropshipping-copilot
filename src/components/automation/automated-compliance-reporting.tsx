"use client"

import { useState } from "react"
import { FileText, Shield, AlertTriangle, CheckCircle, Calendar, Download, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ComplianceReport {
  id: string
  name: string
  enabled: boolean
  type: "gdpr" | "ccpa" | "tax" | "audit" | "custom"
  frequency: "monthly" | "quarterly" | "annually" | "on_demand"
  schedule: {
    nextRun: string
    lastRun?: string
    autoGenerate: boolean
    recipients: string[]
  }
  requirements: {
    dataRetention: boolean
    userConsent: boolean
    dataDeletion: boolean
    breachNotification: boolean
    taxCalculation: boolean
  }
  stats: {
    reportsGenerated: number
    complianceScore: number
    issuesFound: number
    autoResolved: number
  }
}

export function AutomatedComplianceReporting() {
  const [reports, setReports] = useState<ComplianceReport[]>([
    {
      id: "gdpr-monthly",
      name: "GDPR Compliance Report",
      enabled: true,
      type: "gdpr",
      frequency: "monthly",
      schedule: {
        nextRun: "2024-02-01",
        lastRun: "2024-01-01",
        autoGenerate: true,
        recipients: ["compliance@company.com", "legal@company.com"],
      },
      requirements: {
        dataRetention: true,
        userConsent: true,
        dataDeletion: true,
        breachNotification: true,
        taxCalculation: false,
      },
      stats: { reportsGenerated: 12, complianceScore: 98, issuesFound: 3, autoResolved: 2 },
    },
    {
      id: "tax-quarterly",
      name: "Tax Compliance Report",
      enabled: true,
      type: "tax",
      frequency: "quarterly",
      schedule: {
        nextRun: "2024-04-01",
        lastRun: "2024-01-01",
        autoGenerate: true,
        recipients: ["accounting@company.com", "tax@company.com"],
      },
      requirements: {
        dataRetention: false,
        userConsent: false,
        dataDeletion: false,
        breachNotification: false,
        taxCalculation: true,
      },
      stats: { reportsGenerated: 4, complianceScore: 100, issuesFound: 0, autoResolved: 0 },
    },
    {
      id: "audit-annual",
      name: "Annual Security Audit",
      enabled: false,
      type: "audit",
      frequency: "annually",
      schedule: {
        nextRun: "2025-01-01",
        lastRun: "2024-01-01",
        autoGenerate: false,
        recipients: ["security@company.com", "audit@company.com"],
      },
      requirements: {
        dataRetention: true,
        userConsent: false,
        dataDeletion: false,
        breachNotification: true,
        taxCalculation: false,
      },
      stats: { reportsGenerated: 1, complianceScore: 95, issuesFound: 8, autoResolved: 5 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setReports(reports.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
    toast.success("Compliance report updated")
  }

  const handleGenerate = (report: ComplianceReport) => {
    toast.success(`${report.name} generated and sent to recipients`)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "gdpr": return <Shield className="h-4 w-4 text-blue-500" />
      case "ccpa": return <Shield className="h-4 w-4 text-green-500" />
      case "tax": return <FileText className="h-4 w-4 text-orange-500" />
      case "audit": return <Eye className="h-4 w-4 text-purple-500" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 95) return "text-green-600"
    if (score >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Automated Compliance Reporting
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate and distribute compliance reports automatically
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={report.enabled}
                      onCheckedChange={() => handleToggle(report.id)}
                    />
                    <CardTitle className="text-base">{report.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTypeIcon(report.type)}
                    {report.type.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">
                    {report.frequency}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate(report)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Generate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(report.id)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Schedule */}
                <div>
                  <Label className="text-sm font-medium">Schedule & Recipients</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Next Run:</span>
                      <div className="font-medium">{new Date(report.schedule.nextRun).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auto Generate:</span>
                      <div className="font-medium">{report.schedule.autoGenerate ? "Yes" : "No"}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Recipients:</span>
                      <div className="font-medium">{report.schedule.recipients.join(", ")}</div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <Label className="text-sm font-medium">Compliance Requirements</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {report.requirements.dataRetention && (
                      <Badge variant="secondary">📁 Data Retention</Badge>
                    )}
                    {report.requirements.userConsent && (
                      <Badge variant="secondary">✅ User Consent</Badge>
                    )}
                    {report.requirements.dataDeletion && (
                      <Badge variant="secondary">🗑️ Data Deletion</Badge>
                    )}
                    {report.requirements.breachNotification && (
                      <Badge variant="secondary">🚨 Breach Notification</Badge>
                    )}
                    {report.requirements.taxCalculation && (
                      <Badge variant="secondary">💰 Tax Calculation</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{report.stats.reportsGenerated}</div>
                    <div className="text-xs text-muted-foreground">Reports Generated</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getComplianceColor(report.stats.complianceScore)}`}>
                      {report.stats.complianceScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Compliance Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{report.stats.issuesFound}</div>
                    <div className="text-xs text-muted-foreground">Issues Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{report.stats.autoResolved}</div>
                    <div className="text-xs text-muted-foreground">Auto Resolved</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}