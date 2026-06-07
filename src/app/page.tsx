"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Zap, Search, Users, FileText, ShoppingCart, TrendingUp, Star, ArrowRight, Moon, Sun, Menu, X, CheckCircle, BarChart3, Sparkles } from "lucide-react"

const FEATURES = [
  {
    icon: Search,
    title: "Product Research",
    desc: "Discover trending products with high margins and low competition using AI-powered analysis.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Users,
    title: "Supplier Finder",
    desc: "Connect with verified, reliable suppliers worldwide. Get the best prices and fast shipping.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: FileText,
    title: "AI Description Generator",
    desc: "Create compelling product copy in seconds with AI. SEO-optimized and conversion-focused.",
    color: "from-violet-400 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Track revenue, orders, and supplier performance with real-time dashboards and insights.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: ShoppingCart,
    title: "Order Management",
    desc: "Monitor and fulfill orders seamlessly. Track shipments and manage returns in one place.",
    color: "from-fuchsia-400 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    desc: "Stay ahead with competitor tracking, niche trends, and pricing optimization tools.",
    color: "from-rose-400 to-red-500",
  },
]

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Dropshipping Entrepreneur", text: "DropEase transformed my product research. I went from spending hours to just minutes finding winning products.", avatar: "https://i.pravatar.cc/80?u=sarah", rating: 5 },
  { name: "Marcus Johnson", role: "E-commerce Store Owner", text: "The AI description generator alone saved me hundreds of hours. Best tool in my stack.", avatar: "https://i.pravatar.cc/80?u=marcus", rating: 5 },
  { name: "Priya Sharma", role: "Full-time Dropshipper", text: "From zero to first sale in 3 days. The supplier finder is incredibly accurate.", avatar: "https://i.pravatar.cc/80?u=priya", rating: 5 },
]

const STATS = [
  { value: "50K+", label: "Products Researched" },
  { value: "10K+", label: "Active Users" },
  { value: "98%", label: "Supplier Match Rate" },
  { value: "4.9★", label: "User Rating" },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm" : "bg-transparent"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Zap className="size-5" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">DropEase</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Pricing</a>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                Sign In
              </Link>
              <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02]">
                Get Started Free
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              {mobileMenu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
            <div className="space-y-1 px-4 py-4">
              <a href="#features" onClick={() => setMobileMenu(false)} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">Features</a>
              <a href="#testimonials" onClick={() => setMobileMenu(false)} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">Testimonials</a>
              <a href="#pricing" onClick={() => setMobileMenu(false)} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">Pricing</a>
              <div className="pt-3 space-y-2">
                <Link href="/auth/login" className="block w-full text-center rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Sign In</Link>
                <Link href="/auth/register" className="block w-full text-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg">Get Started Free</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 dark:bg-violet-500/20 px-4 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
              <Sparkles className="size-3.5" />
              Your Dropshipping Command Center
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Find, source, and sell{" "}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                winning products
              </span>{" "}
              with AI
            </h1>

            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              DropEase is the all-in-one AI-powered dropshipping platform. Research products, find suppliers, 
              generate descriptions, manage orders, and scale your business — all from one beautiful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/30 hover:scale-[1.02]">
                Start Your Journey
                <ArrowRight className="size-4" />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-300 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800">
                See Features
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="size-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="size-4 text-emerald-500" />
                Free tier available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-12 border-y border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-950/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300 mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">scale your business</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Powerful tools designed for modern dropshippers. Research, source, list, and fulfill — all in one place.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="group relative overflow-hidden rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-200/50 dark:hover:border-violet-800/50 hover:-translate-y-1">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 sm:py-24 bg-white/50 dark:bg-gray-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300 mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Start in minutes, not days</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Sign Up Free", desc: "Create your account in seconds. No credit card required. Start with our generous free tier.", icon: Sparkles },
              { step: "02", title: "Find Products", desc: "Use AI-powered research to discover trending products with high margins and low competition.", icon: Search },
              { step: "03", title: "Launch & Scale", desc: "Connect with suppliers, generate descriptions, manage orders, and grow your business.", icon: TrendingUp },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="relative text-center p-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-200/50 dark:border-violet-800/50 mb-6">
                    <Icon className="size-7 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-violet-600 dark:text-violet-400 uppercase">{item.step}</span>
                  <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 mb-4">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Loved by dropshippers worldwide</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (<Star key={i} className="size-4 fill-amber-400 text-amber-400" />))}
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="size-10 rounded-full ring-2 ring-violet-500/20" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-br from-violet-600/5 via-fuchsia-600/5 to-amber-600/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to transform your dropshipping business?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">Join thousands of successful dropshippers using DropEase to find winning products and scale their stores.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-violet-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  Start Free
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10">
                  Sign In
                </Link>
              </div>
              <p className="mt-4 text-sm text-white/60">Free tier forever. No credit card required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-950/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                <Zap className="size-3.5" />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">DropEase</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} DropEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}