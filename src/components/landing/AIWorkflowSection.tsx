import { BrainCircuit, Package, PenLine, Rocket, Truck } from "lucide-react"
import { Reveal } from "./Reveal"

const steps = [
  { icon: BrainCircuit, title: "Research", desc: "AI scans demand, competition, margins, and trend velocity to surface product opportunities.", tag: "Signal" },
  { icon: Truck, title: "Source", desc: "Match products with reliable suppliers, shipping options, and profit-friendly pricing.", tag: "Supplier" },
  { icon: PenLine, title: "List", desc: "Generate SEO-ready titles, descriptions, ads, and creative angles in seconds.", tag: "Listing" },
  { icon: Rocket, title: "Scale", desc: "Automate order flow, inventory alerts, pricing checks, and growth insights.", tag: "Growth" },
]

export function AIWorkflowSection() {
  return (
    <section id="workflow" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" aria-hidden="true" />
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="section-label">AI automation workflow</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            From product idea to automated growth.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Every step is designed to remove manual work and help you make faster, smarter decisions.
          </p>
        </div>

        <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="landing-step-card relative rounded-[2rem] border border-white/40 bg-white/60 p-6 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-500/20">
                    <Icon className="size-7" />
                  </div>
                  <span className="rounded-full bg-slate-950/5 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-600 dark:bg-white/10 dark:text-slate-200">{step.tag}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-500">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.desc}</p>
              </div>
            )
          })}
        </div>

        <Reveal className="mt-10 rounded-[2rem] border border-violet-500/20 bg-violet-500/10 p-6 text-center backdrop-blur-xl dark:border-violet-300/10" delay={120}>
          <p className="text-lg font-bold text-violet-700 dark:text-violet-200">
            <Package className="inline-block mr-2 size-5" />
            One connected system for research, sourcing, listing, fulfillment, and growth.
          </p>
        </Reveal>
      </Reveal>
    </section>
  )
}
