"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { AI } from "@/lib/ai"

interface AIActionProps {
  task: AutomationTask
  input: unknown
  label?: string
  variant?: "default" | "outline" | "secondary"
  size?: "sm" | "default" | "lg"
  onSuccess?: (result: unknown) => void
}

export function AIActionButton({
  task,
  input,
  label,
  variant = "outline",
  size = "sm",
  onSuccess,
}: AIActionProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const result = await AI.runTask(task, input as Parameters<typeof AI.runTask>[1])
      toast.success(`${task.replace("_", " ")} completed successfully`)
      onSuccess?.(result)
    } catch (error) {
      toast.error(`Failed to run ${task}`)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {label || "Run AI"}
    </Button>
  )
}
