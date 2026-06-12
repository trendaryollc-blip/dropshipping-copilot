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
      <Reveal className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-6 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="section-label">Trust signals</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Built for dropshippers who need speed and confidence.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                The platform combines AI research, supplier intelligence, automation, and analytics so every decision feels backed by data.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {metrics.map((metric, index) => (
                <MetricCard key={metric.label} metric={metric} visible={visible} delay={index * 90} />
              ))}
            </div>
          </div>
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
    const duration = 1200
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
    <div className="rounded-[1.75rem] border border-white/40 bg-white/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 dark:border-white/10 dark:bg-white/5" style={{ transitionDelay: `${delay}ms` }}>
      <p className="text-5xl font-black tracking-tight text-slate-950 dark:text-white">
        {formatted}
        <span className="text-2xl text-violet-500">{metric.suffix}</span>
      </p>
      <p className="mt-3 text-sm font-bold text-slate-500 dark:text-slate-400">{metric.label}</p>
    </div>
  )
}
