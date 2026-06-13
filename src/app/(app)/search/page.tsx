import Link from 'next/link'
import { Search, Zap, Users, Package, BookOpen } from "lucide-react"
import { AdvancedSearch } from "@/components/advanced-search"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SEARCH_METRICS = [
  { label: "Products found", value: "12,430", icon: Package },
  { label: "Customer records", value: "4,890", icon: Users },
  { label: "Saved searches", value: "18", icon: Zap },
  { label: "Current filters", value: "7 active", icon: Search },
]

const QUICK_SEARCHES = [
  "Top suppliers",
  "High-margin products",
  "Active orders",
  "Fast shipping",
  "New arrivals",
]

const RECENT_SEARCHES = [
  "Best dropshipping products",
  "Low-risk suppliers",
  "Summer trend ideas",
]

export default function SearchPage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Search className="size-3" />
              Search
            </span>
            <h1 className="hero-title">Advanced Search</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Find products, orders, customers, and suppliers across your entire store.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {SEARCH_METRICS.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="rounded-3xl border border-border/70 bg-background p-5">
                <div className="flex items-center gap-3 text-primary">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-3xl border border-border/70 bg-background p-6">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Quick Search</p>
              <p className="mt-1 text-sm text-muted-foreground">Search faster by launching a preset query or using the search launcher below.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input placeholder="Search by keyword, supplier, order ID..." aria-label="Search input" />
              <Button>Start search</Button>
            </div>

            <div className="space-y-3 rounded-3xl border border-border/70 bg-card p-4">
              <p className="text-sm font-semibold text-foreground">Search presets</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SEARCHES.map((query) => (
                  <Link
                    key={query}
                    href={`/search?query=${encodeURIComponent(query)}`}
                    className="rounded-full border border-border/70 bg-muted px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/70 hover:text-foreground"
                  >
                    {query}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-muted/50 p-4">
              <p className="text-sm font-semibold text-foreground">Search tips</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Use product and supplier filters to narrow results quickly.</li>
                <li>• Try exact item names and shipping terms together.</li>
                <li>• Save work by reusing queries that already performed well.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border/70 bg-background p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Recent searches</p>
            <p className="mt-1 text-sm text-muted-foreground">Resume a query you used recently.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {RECENT_SEARCHES.map((query) => (
            <Link
              key={query}
              href={`/search?query=${encodeURIComponent(query)}`}
              className="rounded-3xl border border-border/70 bg-card/80 px-4 py-3 text-sm text-foreground transition hover:border-primary/70 hover:bg-primary/5"
            >
              {query}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Search Products',
            description: 'Use filters to surface winning products fast.',
            href: '/products',
            icon: Package,
          },
          {
            title: 'Search Customers',
            description: 'Find orders and customer records instantly.',
            href: '/customers',
            icon: Users,
          },
          {
            title: 'Learning resources',
            description: 'Learn how to use search for faster insights.',
            href: '/learn',
            icon: BookOpen,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.title} href={item.href} className="group rounded-3xl border border-border/70 bg-background p-5 transition hover:border-primary/70 hover:bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </section>

      <AdvancedSearch />
    </div>
  )
}