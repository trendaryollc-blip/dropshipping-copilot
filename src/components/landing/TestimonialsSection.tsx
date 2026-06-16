"use client"

import { Star } from "lucide-react"
import { Reveal } from "./Reveal"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Dropshipping entrepreneur, $1.2M GMV",
    text: "DropEase found products I would have missed for weeks. The AI scores made product selection feel much less random, and I cut my research time by 80%.",
    initials: "SC",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "E-commerce store owner, 4 stores",
    text: "The listing generator and supplier matching saved me hours every day. It feels like having a research team in one dashboard. My conversion rate jumped 24%.",
    initials: "MJ",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Full-time dropshipper, 2 years",
    text: "I finally have one place for research, orders, analytics, and automation. The workflow is simple but powerful. I scaled from $5K to $45K/month in 6 months.",
    initials: "PS",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" aria-hidden="true" />
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl text-center mx-auto">
          <p className="section-label">Customer proof</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Loved by operators who move fast.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Real dropshippers use DropEase to cut research time, improve decisions, and launch faster.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="group relative rounded-[2rem] border border-white/50 bg-white/70 p-6 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
              <div className="absolute inset-x-0 top-0 h-1 rounded-[2rem] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mb-6 flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} className="size-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 text-sm font-black text-white shadow-lg">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-black text-slate-950 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
