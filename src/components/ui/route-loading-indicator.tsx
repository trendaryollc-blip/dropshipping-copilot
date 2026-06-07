"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

/**
 * Route loading indicator compatible with Next.js App Router.
 * Uses pathname changes instead of the Pages Router `Router.events` API.
 */
export function RouteLoadingIndicator() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect route changes via pathname
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      // Route change completed
      setProgress(100)
      timeoutRef.current = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 250)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [pathname])

  // Show progress bar when navigating (triggered by link clicks)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]")
      if (!anchor) return
      const href = (anchor as HTMLAnchorElement).getAttribute("href")
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return
      // Internal navigation detected – start loading bar
      setVisible(true)
      setProgress(10)
    }

    document.addEventListener("click", handleClick, { capture: true })
    return () => document.removeEventListener("click", handleClick, { capture: true })
  }, [])

  // Animate progress while loading
  useEffect(() => {
    if (!visible) return

    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + 8, 90))
    }, 220)

    return () => window.clearInterval(interval)
  }, [visible])

  if (!visible && progress === 0) return null

  return (
    <div
      aria-hidden="true"
      className={
        "pointer-events-none fixed inset-x-0 top-0 z-50 h-1 overflow-hidden transition-opacity duration-200 " +
        (visible ? "opacity-100" : "opacity-0")
      }
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 shadow-lg transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
