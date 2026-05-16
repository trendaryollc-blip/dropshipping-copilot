"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, CheckCircle, AlertCircle, Download, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { gdprService } from "@/lib/compliance-service"
import { Textarea } from "@/components/ui/textarea"

export function GDPRComplianceManager() {
  const [complianceScore, setComplianceScore] = useState(92)
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<
    {
      id: string
      type: "export" | "deletion" | "rectification" | "portability" | "restrict" | "object"
      status: "pending" | "completed" | "rejected"
      createdAt: string
    }[]
  >([])

  const handleRequestDataExport = async () => {
    setLoading(true)
    try {
      const result = await gdprService.requestDataExport("user_id")
      setRequests([
        ...requests,
        {
          id: result.requestId,
          type: "export",
          status: "pending",
          createdAt: result.createdAt,
        },
      ])
      toast.success("Data export request submitted! You'll receive a download link within 7 days.")
    } catch (error) {
      toast.error("Failed to submit export request")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestDeletion = async () => {
    setLoading(true)
    try {
      const result = await gdprService.requestDeletion("user_id", "User requested account deletion")
      setRequests([
        ...requests,
        {
          id: result.requestId,
          type: "deletion",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ])
      toast.success("Account deletion request submitted. Account will be deleted in 30 days.")
    } catch (error) {
      toast.error("Failed to submit deletion request")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestDataPortability = async () => {
    setLoading(true)
    try {
      const result = await gdprService.requestDataPortability("user_id", "json")
      toast.success(`Data is ready for download! Download URL: ${result.dataUrl}`)
      toast("Expires in 7 days", { duration: 5000 })
    } catch (error) {
      toast.error("Failed to generate data portability file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Compliance Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-500" />
              GDPR Compliance Score
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Your platform compliance status</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">{complianceScore}%</div>
            <Badge className="mt-2 bg-green-100 text-green-800">Compliant</Badge>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="font-semibold">Data Processing</p>
            <p className="text-muted-foreground">✓ Documented</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="font-semibold">Privacy Policy</p>
            <p className="text-muted-foreground">✓ Updated</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="font-semibold">Security</p>
            <p className="text-muted-foreground">✓ Encrypted</p>
          </div>
        </div>
      </Card>

      {/* User Rights */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6">Your GDPR Rights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GDPRRightCard
            title="Right of Access"
            description="Request a copy of your personal data"
            icon={<Eye className="h-5 w-5" />}
            action="Export Data"
            onAction={handleRequestDataExport}
            loading={loading}
          />
          <GDPRRightCard
            title="Right to Portability"
            description="Get your data in machine-readable format"
            icon={<Download className="h-5 w-5" />}
            action="Download Data"
            onAction={handleRequestDataPortability}
            loading={loading}
          />
          <GDPRRightCard
            title="Right to Rectification"
            description="Request correction of inaccurate data"
            icon={<CheckCircle className="h-5 w-5" />}
            action="Request Correction"
            onAction={() => toast.info("Contact support to request data corrections")}
            loading={loading}
          />
          <GDPRRightCard
            title="Right to be Forgotten"
            description="Request complete account deletion"
            icon={<Trash2 className="h-5 w-5 text-red-500" />}
            action="Delete Account"
            onAction={handleRequestDeletion}
            loading={loading}
            danger
          />
        </div>
      </Card>

      {/* Active Requests */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Active GDPR Requests</h3>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active requests</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="capitalize">{req.type.replace("_", " ")}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === "pending" ? "secondary" : "default"}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Privacy Policy */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Privacy Policy</h3>
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm">
                  View Full Policy
                </Button>
              }
            />
            <DialogContent className="max-h-96 overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Privacy Policy</DialogTitle>
              </DialogHeader>
              <div className="text-sm space-y-4">
                <section>
                  <h4 className="font-semibold mb-2">1. Introduction</h4>
                  <p className="text-muted-foreground">
                    We are committed to protecting your privacy and ensuring transparent data practices.
                  </p>
                </section>
                <section>
                  <h4 className="font-semibold mb-2">2. Data We Collect</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Account information (name, email)</li>
                    <li>Transaction data</li>
                    <li>Usage analytics</li>
                  </ul>
                </section>
                <section>
                  <h4 className="font-semibold mb-2">3. Your Rights</h4>
                  <p className="text-muted-foreground">
                    Under GDPR, you have the right to access, rectify, and delete your data.
                  </p>
                </section>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </Card>

      {/* Consent Management */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Cookie & Consent Settings</h3>
        <div className="space-y-4">
          <ConsentToggle label="Essential Cookies" description="Required for basic functionality" enabled defaultChecked />
          <ConsentToggle label="Analytics Cookies" description="Help us understand how you use our service" defaultChecked />
          <ConsentToggle label="Marketing Cookies" description="Used for personalized advertising" />
          <ConsentToggle label="Third-Party Cookies" description="Cookies from external partners" />
        </div>
        <Button className="mt-6 w-full">Save Preferences</Button>
      </Card>
    </div>
  )
}

interface GDPRRightCardProps {
  title: string
  description: string
  icon: React.ReactNode
  action: string
  onAction: () => void
  loading: boolean
  danger?: boolean
}

function GDPRRightCard({ title, description, icon, action, onAction, loading, danger }: GDPRRightCardProps) {
  return (
    <div className={`border rounded-lg p-4 ${danger ? "border-red-300 bg-red-50" : ""}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={danger ? "text-red-500" : "text-blue-500"}>{icon}</div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={onAction}
        disabled={loading}
        variant={danger ? "destructive" : "default"}
        className="w-full"
      >
        {action}
      </Button>
    </div>
  )
}

interface ConsentToggleProps {
  label: string
  description: string
  enabled?: boolean
  defaultChecked?: boolean
}

function ConsentToggle({ label, description, enabled, defaultChecked }: ConsentToggleProps) {
  const [checked, setChecked] = useState(defaultChecked || false)

  return (
    <div className="flex items-start justify-between p-3 border rounded-lg">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={enabled || checked}
        onChange={(e) => setChecked(e.target.checked)}
        disabled={enabled}
        className="mt-1"
      />
    </div>
  )
}
