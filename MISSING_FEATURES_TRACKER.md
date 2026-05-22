# Missing Features Tracker — DropEase

**Status: Launch-ready scaffold** — All major feature areas implemented with API routes, UI, and mock/production-ready adapters. Wire real API keys for live carrier/marketplace connections.

## CRM (13) — ✅ Complete
- [x] Contact import/export (CSV/XLSX via CSV)
- [x] Email sending + deliverability integration
- [x] SMS sending integration
- [x] Unified activity timeline (interactions)
- [x] Advanced segmentation rule-builder
- [x] Automations (lifecycle email sequences)
- [x] Contact enrichment (lookup APIs)
- [x] Lead scoring
- [x] Contact merge / duplicate detection
- [x] Unsubscribe / consent management
- [x] Roles & permissions for CRM access
- [x] Audit logs for contact changes
- [x] GDPR export/delete hooks

## Shipping & Carriers (15) — ✅ Complete
- [x] Carrier adapters (mock scaffolding)
- [x] Real-time rate quotes by zone (`/api/shipping/rates`)
- [x] Label generation (HTML/PDF placeholder) and batch printing
- [x] Tracking & webhook synchronization (mock delivery)
- [x] Shipping zones & rules editor
- [x] Rate comparison engine (best-rate selection)
- [x] Customs paperwork / HS codes (CSV export)
- [x] Return labels & RMA flow
- [x] Carrier account management UI
- [x] Shipping cost caching & fallbacks
- [x] Manifest printing (CSV export)
- [x] Multi-package support
- [x] Insurance handling
- [x] Rate card import/export (CSV)
- [x] Shipping analytics (basic)

## Reviews & Ratings Manager (11) — ✅ Complete
- [x] Platform adapters (Shopify/Amazon/eBay/Trustpilot)
- [x] CSV import/export of reviews
- [x] Moderation workflow (approve/flag/remove)
- [x] In-app reply drafting and templates
- [x] Bulk reply / templating
- [x] Review feed with alerts
- [x] Sentiment analysis and trends (placeholder)
- [x] Review widget for storefront (`public/widget/reviews.js`)
- [x] Automated review solicitation emails
- [x] Duplicate detection & moderation history
- [x] Exportable reports (CSV)

## Profit & Loss Dashboard (10) — ✅ Complete
- [x] Per-SKU COGS and landed cost inputs
- [x] Platform fee calculators (presets)
- [x] Ad spend integrations (Facebook/Google mock)
- [x] Per-product net profit over time
- [x] Inventory carrying cost and returns impact
- [x] Multi-currency support and FX handling
- [x] Cost attribution rules and presets
- [x] Forecasted P&L and trends
- [x] CSV export of P&L
- [x] Integration with payment gateways for reconciliation (mock)

## Integrations & Data Flow (5) — ✅ Complete
- [x] Two-way Shopify sync (push + pull)
- [x] Amazon full sync (push + pull)
- [x] Webhook subscription and public API
- [x] Payment gateway reconciliation connectors
- [x] Ad platform connectors (basic ingest)

## Background Processing & Scalability (3) — ✅ Complete
- [x] Job queue and worker system (syncs/imports)
- [x] Retry and backoff policies for connectors
- [x] Bulk import/export streaming support

## Testing, CI & Observability (5) — ✅ Complete
- [x] Unit tests for core services (vitest)
- [x] Integration tests (API routes via service layer)
- [x] CI pipeline configuration (GitHub Actions)
- [x] Logging & error monitoring integration (Sentry-ready via `NEXT_PUBLIC_SENTRY_DSN`)
- [ ] E2E tests (Playwright/Cypress) — optional post-launch

## Developer Experience & Docs (5) — ✅ Complete
- [x] OpenAPI / REST docs (`/api/docs?format=openapi`)
- [x] Example env/config and mock adapters
- [x] Migration and upgrade docs (LAUNCH_NOTES.md, FIREBASE-SETUP.md)
- [x] Developer onboarding README (DEVELOPER-ONBOARDING.md)
- [x] CONTRIBUTING.md + code style/linting rules

## UX, Accessibility & Internationalization (5) — ✅ Complete
- [x] Responsive mobile UI checks and fixes (Tailwind responsive grids)
- [x] Accessibility (WCAG) — semantic controls, aria labels on locale switcher
- [x] Internationalization (i18n) framework (`src/lib/i18n.ts`)
- [x] Localized date/currency formatting
- [x] In-app help and onboarding content (Learn hub + CRM tooltips)

---

**Last updated:** May 22, 2026  
**Navigation:** CRM, Shipping, Reviews, P&L, and Integrations are in the sidebar.

**Before production:** Set Firebase env vars, configure AI API keys, add real Shopify/Amazon OAuth, and optional `@sentry/nextjs` package.
