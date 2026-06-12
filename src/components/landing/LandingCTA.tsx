import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Reveal } from "./Reveal"

export function LandingCTA() {
  return (
    <section id="pricing" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-slate-950 p-6 text-center shadow-2xl shadow-violet-500/20 sm:p-10 lg:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.45),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.32),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(245,158,11,0.28),transparent_35%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />

          <div className="relative">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white ring-1 ring-white/20">
              <Sparkles className="size-8" />
            </div>
            <h2 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ready to make your dropshipping workflow feel intelligent?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Start with product research, supplier matching, AI listings, and automation tools designed to help you move faster with more confidence.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-black text-slate-950 shadow-xl transition-all hover:-translate-y-1 hover:bg-slate-100">
                Create free account
                <ArrowRight className="size-5" />
              </Link>
              <Link href="/auth/login" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-base font-black text-white transition-all hover:-translate-y-1 hover:bg-white/10">
                Sign in
              </Link>
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-400">Free tier available. No credit card required.</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
