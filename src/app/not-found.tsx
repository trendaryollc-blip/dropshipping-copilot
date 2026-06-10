"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <svg className="size-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to the home page.
        </p>
      </div>
      <div className="flex gap-3 mt-4">
        <Button onClick={() => window.history.back()} variant="outline" className="rounded-xl">
          Go Back
        </Button>
        <Link href="/">
          <Button className="rounded-xl">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}