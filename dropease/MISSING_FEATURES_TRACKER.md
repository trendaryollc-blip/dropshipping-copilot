# Missing Features Tracker — DropEase

This document lists the 72 missing features required to consider the product "feature-complete". As I implement each feature I will tick it off here.

## CRM (13)
- [ ] Contact import/export (CSV/XLSX)
- [ ] Email sending + deliverability integration
- [ ] SMS sending integration
- [ ] Unified activity timeline (interactions)
- [ ] Advanced segmentation rule-builder
- [ ] Automations (lifecycle email sequences)
- [ ] Contact enrichment (lookup APIs)
- [ ] Lead scoring
- [ ] Contact merge / duplicate detection
- [ ] Unsubscribe / consent management
- [ ] Roles & permissions for CRM access
- [ ] Audit logs for contact changes
- [ ] GDPR export/delete hooks

# Shipping & Carriers (15)
 - [x] Carrier adapters (mock scaffolding)
 - [ ] Real-time rate quotes by zone
 - [x] Label generation (HTML placeholder) and batch printing
 - [x] Tracking & webhook synchronization (mock delivery)
- [x] Shipping zones & rules editor
- [x] Rate comparison engine (best-rate selection - mocked)
- [ ] Customs paperwork / HS codes
- [x] Return labels & RMA flow (basic RMA creation)
- [x] Carrier account management UI
- [ ] Shipping cost caching & fallbacks
- [x] Manifest printing (CSV export)
- [ ] Multi-package support
- [ ] Insurance handling
- [x] Rate card import/export (CSV)
- [x] Shipping analytics (basic)

## Shipping — Small features implemented
- [x] Rate caching (localStorage)
- [x] Customs CSV export (manifest)
- [x] HS-code placeholder support in manifest export


## Shipping — New Scaffolding
- [x] Adapter registry and mock UPS/FedEx adapters
- [x] Real-time rate quotes wired to adapters (mock)
- [x] Multi-package shipment UI (creates shipments with packages)
- [x] Insurance calculation placeholder
- [x] PDF label placeholder generation

## Reviews & Ratings Manager (11)
- [ ] Platform adapters (Shopify/Amazon/eBay/Trustpilot)
- [x] CSV import/export of reviews
- [x] Moderation workflow (approve/flag/remove)
- [x] In-app reply drafting and templates
- [ ] Bulk reply / templating
- [ ] Review feed with alerts
- [x] Sentiment analysis and trends (placeholder)
- [ ] Review widget for storefront
- [ ] Automated review solicitation emails
- [ ] Duplicate detection & moderation history
- [x] Exportable reports (CSV)

## Reviews — Small features implemented
- [x] Reply templates
- [x] Duplicate detection (basic)

## Profit & Loss Dashboard (10)
- [x] Per-SKU COGS and landed cost inputs (basic)
- [x] Platform fee calculators (presets)
- [ ] Ad spend integrations (Facebook/Google) for attribution
- [ ] Per-product net profit over time
- [ ] Inventory carrying cost and returns impact
- [ ] Multi-currency support and FX handling
- [ ] Cost attribution rules and presets
- [ ] Forecasted P&L and trends
- [x] CSV export of P&L
- [ ] Integration with payment gateways for reconciliation

## Integrations & Data Flow (5)
- [ ] Two-way Shopify sync (products/orders/inventory)
- [ ] Amazon full sync (orders/products/fees)
- [ ] Webhook subscription and public API
- [ ] Payment gateway reconciliation connectors
- [ ] Ad platform connectors (basic ingest)

## Integration Manager (mock)
- [x] Shopify mock adapter
- [x] Amazon mock adapter
- [x] Integrations manager UI
- [ ] Real two-way sync
- [ ] Payment/ad connector scaffolds

## Background Processing & Scalability (3)
- [ ] Job queue and worker system (syncs/imports)
- [ ] Retry and backoff policies for connectors
- [ ] Bulk import/export streaming support

## Testing, CI & Observability (5)
- [ ] Unit tests for new services
- [ ] Integration tests (APIs and stores)
- [ ] E2E tests (Playwright/Cypress)
- [ ] CI pipeline configuration
- [ ] Logging & error monitoring integration (Sentry)
- [x] Unit tests for core services (vitest)
- [ ] Integration tests (APIs and stores)
- [ ] E2E tests (Playwright/Cypress)
- [x] CI pipeline configuration (GitHub Actions)
- [ ] Logging & error monitoring integration (Sentry)

## Developer Experience & Docs (5)
- [ ] OpenAPI / REST docs
- [ ] Example env/config and mock adapters
- [ ] Migration and upgrade docs
- [ ] Developer onboarding README
- [ ] CONTRIBUTING.md + code style/linting rules

## UX, Accessibility & Internationalization (5)
- [ ] Responsive mobile UI checks and fixes
- [ ] Accessibility (WCAG) compliance fixes
- [ ] Internationalization (i18n) framework
- [ ] Localized date/currency formatting
- [ ] In-app help and onboarding content

---

Current status: Shipping Hub scaffolded (carrier hub, zone editor, shipping service). I'll update checkboxes as features are implemented.
