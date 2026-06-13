import Link from 'next/link'
import IntegrationManager from '@/components/integrations/integration-manager'

export const metadata = { title: 'Integrations - DropEase' }

export default function IntegrationsPage() {
  return (
    <main className="space-y-6 p-6">
      <section className="space-y-6 rounded-3xl border border-border/50 bg-card/60 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Integrations
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Platform Integrations</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Connect your store platforms, sync orders and product listings, and keep every integration working smoothly.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/reports" className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary">
              View reports
            </Link>
            <Link href="/admin/billing" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">
              Billing settings
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Connect a store',
              description: 'Add Shopify, Amazon or other sales channels.',
              href: '/multi-store',
            },
            {
              title: 'Sync orders',
              description: 'Make sure every sale updates your dashboard.',
              href: '/orders',
            },
            {
              title: 'Review webhooks',
              description: 'Track integration events and automation triggers.',
              href: '/admin/reports',
            },
          ].map((card) => (
            <Link key={card.href} href={card.href} className="group rounded-3xl border border-border/70 bg-background p-5 transition hover:border-emerald-400 hover:bg-emerald-50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{card.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                </div>
                <span className="text-primary">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <IntegrationManager />
    </main>
  )
}
