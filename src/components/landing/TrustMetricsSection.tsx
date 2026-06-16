"use client"

import { useEffect, useRef, useState } from "react"
import { Reveal } from "./Reveal"

type Metric = {
  value: number
  suffix: string
  label: string
  decimals?: number
}

const metrics: Metric[] = [
  { value: 50, suffix: "K+", label: "Products researched" },
  { value: 10, suffix: "K+", label: "Active dropshippers" },
  { value: 3.2, suffix: "x", label: "Faster listing creation", decimals: 1 },
  { value: 98, suffix: "%", label: "Supplier match accuracy" },
]

const logos = [
  "Shopify",
  "AliExpress",
  "WooCommerce",
  "eBay",
  "Google",
  "TikTok Shop",
]

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)

export function TrustMetricsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (!("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="proof" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" aria-hidden="true" />
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="section-label">Trust signals</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Built for dropshippers who need speed and confidence.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            The platform combines AI research, supplier intelligence, automation, and analytics so every decision feels backed by data.
          </p>
        </div>

        <div className="mb-12">
          <p className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Trusted by operators on leading platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-60">
            {logos.map(logo => (
              <div key={logo} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/80 dark:bg-white/10">
                  <div className="h-4 w-4 rounded bg-slate-400/40 dark:bg-slate-500/40" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-200">{logo}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-1.5 shadow-sm ring-1 ring-slate-900/5 dark:bg-white/5 dark:ring-white/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              2,847 active users joined this week
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} visible={visible} delay={index * 100} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function MetricCard({ metric, visible, delay }: { metric: Metric; visible: boolean; delay: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!visible) return

    const start = performance.now()
    const duration = 1500
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(metric.value * easeOutCubic(progress))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [visible, metric])

  const formatted = metric.decimals ? count.toFixed(metric.decimals) : Math.round(count).toLocaleString()

  return (
    <div className="group relative rounded-[1.75rem] border border-white/50 bg-white/70 p-6 text-center shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl dark:border-white/10 dark:bg-white/5" style={{ transitionDelay: `${delay}ms` }}>
      <div className="absolute inset-x-0 top-0 h-1 rounded-[1.75rem] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <p className="text-5xl font-black tracking-tight text-slate-950 dark:text-white">
        {formatted}
        <span className="text-2xl text-violet-500">{metric.suffix}</span>
      </p>
      <p className="mt-3 text-sm font-bold text-slate-500 dark:text-slate-400">{metric.label}</p>
    </div>
  )
}
