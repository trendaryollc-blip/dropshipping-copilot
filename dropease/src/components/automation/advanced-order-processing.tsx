"use client"

import { useState } from "react"
import { Workflow, CheckCircle, Clock, AlertTriangle, ArrowRight, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface OrderWorkflow {
  id: string
  name: string
  enabled: boolean
  trigger: "new_order" | "high_value_order" | "international_order" | "custom"
  steps: {
    id: string
    name: string
    type: "approval" | "quality_check" | "fraud_check" | "customs_clearance" | "notification"
    assignee?: string
    autoAdvance: boolean
    timeLimit?: number // minutes
  }[]
  stats: {
    ordersProcessed: number
    avgProcessingTime: number
    approvalsRequired: number
    automatedSteps: number
  }
}

export function AdvancedOrderProcessing() {
  const [workflows, setWorkflows] = useState<OrderWorkflow[]>([
    {
      id: "standard-orders",
      name: "Standard Order Processing",
      enabled: true,
      trigger: "new_order",
      steps: [
        {
          id: "fraud-check",
          name: "Fraud Detection",
          type: "fraud_check",
          autoAdvance: true,
          timeLimit: 5,
        },
        {
          id: "quality-check",
          name: "Product Quality Check",
          type: "quality_check",
          assignee: "quality_team",
          autoAdvance: false,
          timeLimit: 30,
        },
        {
          id: "supplier-notification",
          name: "Notify Supplier",
          type: "notification",
          autoAdvance: true,
          timeLimit: 10,
        },
      ],
      stats: { ordersProcessed: 1247, avgProcessingTime: 45, approvalsRequired: 234, automatedSteps: 892 },
    },
    {
      id: "high-value-orders",
      name: "High-Value Order Approval",
      enabled: true,
      trigger: "high_value_order",
      steps: [
        {
          id: "manager-approval",
          name: "Manager Approval",
          type: "approval",
          assignee: "manager",
          autoAdvance: false,
          timeLimit: 60,
        },
        {
          id: "fraud-check",
          name: "Enhanced Fraud Check",
          type: "fraud_check",
          autoAdvance: true,
          timeLimit: 10,
        },
        {
          id: "insurance-check",
          name: "Insurance Coverage",
          type: "custom",
          autoAdvance: true,
          timeLimit: 15,
        },
      ],
      stats: { ordersProcessed: 89, avgProcessingTime: 120, approvalsRequired: 89, automatedSteps: 178 },
    },
    {
      id: "international-orders",
      name: "International Shipping",
      enabled: true,
      trigger: "international_order",
      steps: [
        {
          id: "customs-clearance",
          name: "Customs Documentation",
          type: "customs_clearance",
          assignee: "shipping_team",
          autoAdvance: false,
          timeLimit: 120,
        },
        {
          id: "duty-calculation",
          name: "Duty & Tax Calculation",
          type: "custom",
          autoAdvance: true,
          timeLimit: 30,
        },
        {
          id: "carrier-notification",
          name: "International Carrier",
          type: "notification",
          autoAdvance: true,
          timeLimit: 15,
        },
      ],
      stats: { ordersProcessed: 156, avgProcessingTime: 180, approvalsRequired: 45, automatedSteps: 312 },
    },
  ])

  const [editing, setEditing] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setWorkflows(workflows.map(w =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ))
    toast.success("Order workflow updated")
  }

  const handleTest = (workflow: OrderWorkflow) => {
    toast.success(`Test order processed through ${workflow.name}`)
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "approval": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "quality_check": return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "fraud_check": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "customs_clearance": return <Workflow className="h-4 w-4 text-blue-500" />
      case "notification": return <Clock className="h-4 w-4 text-purple-500" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Advanced Order Processing
          </h3>
          <p className="text-sm text-muted-foreground">
            Multi-step automated workflows for complex order processing
          </p>
        </div>
        <Button>
          <Workflow className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.enabled}
                      onCheckedChange={() => handleToggle(workflow.id)}
                    />
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                  </div>
                  <Badge variant="outline">
                    {workflow.trigger.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(workflow)}
                  >
                    Test Workflow
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(workflow.id)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Workflow Steps */}
                <div>
                  <Label className="text-sm font-medium">Workflow Steps</Label>
                  <div className="mt-3 space-y-2">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStepIcon(step.type)}
                          <span className="text-sm font-medium">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {step.assignee && (
                            <Badge variant="secondary" className="text-xs">
                              {step.assignee}
                            </Badge>
                          )}
                          {step.timeLimit && (
                            <span>{step.timeLimit}m limit</span>
                          )}
                          {step.autoAdvance ? (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Auto
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Manual
                            </Badge>
                          )}
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{workflow.stats.ordersProcessed}</div>
                    <div className="text-xs text-muted-foreground">Orders Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{workflow.stats.avgProcessingTime}m</div>
                    <div className="text-xs text-muted-foreground">Avg Processing Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{workflow.stats.approvalsRequired}</div>
                    <div className="text-xs text-muted-foreground">Approvals Required</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{workflow.stats.automatedSteps}</div>
                    <div className="text-xs text-muted-foreground">Automated Steps</div>
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