"use client"

import { useEffect } from "react"

/**
 * global-error.tsx — catches errors in the root layout itself.
 * This replaces the entire HTML shell, so it must include <html> and <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1rem",
          textAlign: "center",
          padding: "1rem",
          background: "#0f0f0f",
          color: "#fafafa",
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>

        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Critical Application Error
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#a1a1aa" }}>
            {error.message || "An unexpected error occurred. Please refresh the page."}
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#71717a", marginTop: "0.5rem" }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: "0.75rem",
            background: "transparent",
            border: "1px solid #3f3f46",
            color: "#fafafa",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
