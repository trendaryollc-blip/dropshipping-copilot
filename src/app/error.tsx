"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted-foreground/70">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <Button onClick={reset} variant="outline" className="rounded-xl">
        Try again
      </Button>
    </div>
  )
}