"use client"

import { useEffect, useState } from "react"
import Router from "next/router"

export function RouteLoadingIndicator() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleStart = () => {
      setVisible(true)
      setProgress(10)
    }

    const handleFinish = () => {
      setProgress(100)
      window.setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 250)
    }

    Router.events.on("routeChangeStart", handleStart)
    Router.events.on("routeChangeComplete", handleFinish)
    Router.events.on("routeChangeError", handleFinish)

    return () => {
      Router.events.off("routeChangeStart", handleStart)
      Router.events.off("routeChangeComplete", handleFinish)
      Router.events.off("routeChangeError", handleFinish)
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + 8, 90))
    }, 220)

    return () => window.clearInterval(interval)
  }, [visible])

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
