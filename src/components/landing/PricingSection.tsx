"use client"

import Link from "next/link"
import { Check, Sparkles } from "lucide-react"
import { Reveal } from "./Reveal"

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Explore the platform with core research and listing tools.",
    cta: "Start free",
    href: "/auth/register",
    features: ["5 product research searches/day", "10 AI listings/month", "1 connected store", "Basic supplier matching", "Community support"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/month",
    description: "For operators ready to scale with full automation and analytics.",
    cta: "Start 14-day trial",
    href: "/auth/register",
    features: ["Unlimited product research", "Unlimited AI listings", "3 connected stores", "Advanced supplier matching", "Order automation", "Profit & analytics dashboard", "Priority support"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description: "For multi-store operators and teams who need maximum throughput.",
    cta: "Contact sales",
    href: "/auth/register",
    features: ["Everything in Growth", "10 connected stores", "Team collaboration (5 seats)", "Custom integrations", "Dedicated account manager", "SLA & uptime guarantee", "Advanced API access"],
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" aria-hidden="true" />
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl text-center mx-auto">
          <p className="section-label">Simple, transparent pricing</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            No hidden fees. No surprises. Pick a plan that matches your store size and ambition.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-[2rem] border p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-violet-500/40 bg-violet-500/10 shadow-2xl shadow-violet-500/15 lg:-mt-4 lg:mb-4"
                  : "border-white/40 bg-white/60 shadow-lg shadow-slate-950/5 dark:border-white/10 dark:bg-white/5"
              }`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-fuchsia-500/20">
                    <Sparkles className="size-3.5" />
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">{plan.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{plan.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight text-slate-950 dark:text-white">{plan.price}</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{plan.period}</span>
                </div>
              </div>

              <Link
                href={plan.href}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-xl shadow-fuchsia-500/20 hover:shadow-[0_28px_80px_rgba(217,70,239,0.28)]"
                    : "bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-500 dark:text-emerald-300" />
                    <span className="text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          All plans include 14-day free trial. No credit card required to start.
        </p>
      </Reveal>
    </section>
  )
}
