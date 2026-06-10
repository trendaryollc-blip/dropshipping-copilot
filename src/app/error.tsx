"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    console.error("Application Error:", error)
    // Log to monitoring service (Sentry etc.)
    try {
      const w = window as Window & { gtag?: (...args: unknown[]) => void }
      if (w.gtag) {
        w.gtag("event", "exception", {
          description: error.message,
          fatal: true,
        })
      }
    } catch {
      // analytics not available
    }
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-10 w-10" />
      </div>

      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground/70 mb-4">
          {error.message || "An unexpected error occurred. Our team has been notified."}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={reset}
          variant="outline"
          className="rounded-xl gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/">
          <Button className="rounded-xl gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && (
        <Card className="w-full max-w-2xl p-4 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full mb-2"
          >
            {showDetails ? "Hide" : "Show"} Error Details
          </Button>
          {showDetails && (
            <div className="text-left space-y-2">
              <div>
                <strong className="text-sm font-semibold">Message:</strong>
                <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
              </div>
              {error.digest && (
                <div>
                  <strong className="text-sm font-semibold">Error ID:</strong>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{error.digest}</p>
                </div>
              )}
              {error.stack && (
                <div>
                  <strong className="text-sm font-semibold">Stack Trace:</strong>
                  <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      <div className="text-xs text-muted-foreground/50">
        Error ID: {error.digest || "N/A"}
      </div>
    </div>
  )
}
