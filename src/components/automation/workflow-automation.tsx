"use client"

import { useState } from "react"
import { Zap, CheckCircle2, ListChecks, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { workflowService } from "@/lib/advanced-features-service"
import type { Workflow } from "@/types"

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const loadWorkflows = async () => {
    const list = await workflowService.getWorkflows()
    setWorkflows(list)
  }

  const handleCreateWorkflow = async () => {
    if (!name) {
      toast.error("Provide a workflow name")
      return
    }
    setLoading(true)
    try {
      const workflow = await workflowService.createWorkflow({
        name,
        description: "Automate order follow-up and team notifications",
        enabled: true,
        trigger: "new_order",
        actions: [
          { id: "action-1", type: "notify_team", label: "Notify team", params: { channel: "email" } },
        ],
      })
      setWorkflows([workflow, ...workflows])
      setName("")
      toast.success("Workflow created")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Zap className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Workflow Automation</h3>
            <p className="text-sm text-muted-foreground">Build custom automation flows for operations and customer lifecycle.</p>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-700">Automation</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <ListChecks className="size-4" /> Workflow Builder
          </CardTitle>
          <CardDescription className="text-xs">Create rules that trigger actions automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Workflow name" value={name} onChange={(event) => setName(event.target.value)} />
            <Button onClick={handleCreateWorkflow} disabled={loading} className="w-full">
              <Plus className="size-4 mr-2" /> {loading ? "Saving..." : "Create Workflow"}
            </Button>
          </div>
          <div className="space-y-3">
            {workflows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No workflows yet. Create one to automate follow-up, approvals, and messaging.
              </div>
            ) : (
              workflows.map((workflow) => (
                <div key={workflow.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{workflow.name}</p>
                      <p className="text-xs text-muted-foreground">Trigger: {workflow.trigger}</p>
                    </div>
                    <Badge className={workflow.enabled ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                      {workflow.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">{workflow.description}</div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle2 className="size-4" /> Workflow Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Use workflows to send alerts, update orders, assign tasks, and launch loyalty offers automatically.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-3">
              <p className="font-semibold">Triggered Automatically</p>
              <p className="mt-2 text-xs">Actions execute without manual intervention when conditions match.</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="font-semibold">Team Notifications</p>
              <p className="mt-2 text-xs">Notify operations, support, and finance when key events occur.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
