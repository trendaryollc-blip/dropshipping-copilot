import Link from 'next/link'
import { Store, Globe, CreditCard, Users } from "lucide-react"
import { MultiStore } from "@/components/multi-store"

export default function MultiStorePage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Store className="size-3" />
              Multi-Store
            </span>
            <h1 className="hero-title">Multi-Store Management</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Manage all your stores from a single unified dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Connect a new store',
            description: 'Add another storefront or marketplace channel.',
            href: '/multi-store',
            icon: Globe,
          },
          {
            title: 'Billing setup',
            description: 'Review payment and invoice settings.',
            href: '/admin/billing',
            icon: CreditCard,
          },
          {
            title: 'Brand controls',
            description: 'Customize brand identity for each store.',
            href: '/admin/branding',
            icon: Users,
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

      <MultiStore />
    </div>
  )
}