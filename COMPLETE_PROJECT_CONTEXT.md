# DropEase + Trendaryo — Complete Project Concept & Context Document

**Last Updated:** May 21, 2026
**Purpose:** This document explains your entire business concept and codebase so any AI (or developer) can understand everything without needing prior conversation context.

---

## Table of Contents

1. [The Big Picture — What You Are Building](#1-the-big-picture)
2. [Business Concept & Goals](#2-business-concept--goals)
3. [The Two Apps](#3-the-two-apps)
4. [Complete Tech Stack](#4-complete-tech-stack)
5. [DropEase — Full Feature Breakdown](#5-dropease--full-feature-breakdown)
6. [AI Providers & What Each Does](#6-ai-providers--what-each-does)
7. [Database & Data Architecture](#7-database--data-architecture)
8. [Trendaryo Integration — How It Works](#8-trendaryo-integration--how-it-works)
9. [What Is Real vs. Mock/Simulated](#9-what-is-real-vs-mocksimulated)
10. [Complete File Map](#10-complete-file-map)
11. [Deployment & Environment Setup](#11-deployment--environment-setup)
12. [Step-by-Step Roadmap to Go Live](#12-step-by-step-roadmap-to-go-live)
13. [What Each AI API Key Does](#13-what-each-ai-api-key-does)
14. [Free Tier Status & Cost realities](#14-free-tier-status--cost-realities)
15. [Next Features To Add](#15-next-features-to-add)

---

## 1. The Big Picture

You are building **two interconnected apps** that together form a complete dropshipping business system:

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR BUSINESS MODEL                       │
│                                                               │
│  ┌──────────┐    syncs with    ┌────────────────────────┐   │
│  │  Trendaryo  │◄──────────────►│   DropEase Copilot     │   │
│  │  (Live Store)│   API + Scrape │  (Automation Backend)  │   │
│  └──────────┘                 └────────────────────────┘   │
│        ▲                                      ▲              │
│        │  customers buy                      │ AI + automation
│        │  from here                          │ runs here
│        │                                      │              │
│     Vercel +                              Vercel +            │
│     Cloudflare                          Firebase/Firestore    │
│     (trendaryo.com)                     (dropease on Vercel)  │
└─────────────────────────────────────────────────────────────┘
```

**Trendaryo** = Your customer-facing online store (like Shopify but built from scratch).
**DropEase** = Your automation brain — an AI-powered dashboard that runs in the background.

Together, they replace the need for expensive third-party dropshipping tools by:
- Finding winning products automatically
- Finding reliable suppliers
- Writing product descriptions with AI
- Auto-fulfilling orders
- Syncing prices and stock between supplier → DropEase → Trendaryo
- Running automation rules without manual work

---

## 2. Business Concept & Goals

### What is Dropshipping?
Dropshipping is an e-commerce business model where you sell products **without holding any inventory**. When a customer buys something from your store, you forward the order to a **supplier**, and the supplier ships the product directly to the customer. You keep the difference between the selling price and the supplier cost as your profit.

### What You Are Trying To Build

You want **end-to-end automation** for the entire dropshipping workflow so you don't have to do boring manual tasks:

**Manual workflow (before DropEase):**
1. Manually research products → spend hours on AliExpress, Amazon, Google Trends
2. Manually find suppliers → negotiate, check reviews
3. Manually write product descriptions → spend hours typing
4. Manually upload to store → copy-paste images and text
5. When customer orders → manually order from supplier
6. Manually update tracking → copy tracking numbers
7. Manually optimize prices → check competitors every day

**Automated workflow (with DropEase + Trendaryo):**
1. DropEase AI finds winning products → you confirm → auto-imports to Trendaryo
2. DropEase finds and connects to suppliers automatically
3. DropEase AI writes product descriptions in one click
4. Automation pushes products live to Trendaryo
5. Customer orders → DropEase auto-detects order → auto-places supplier order
6. DropEase auto-updates tracking → Trendaryo customer sees updates
7. AI monitors competitor prices → auto-adjusts your prices

### The Free-Tier Constraint
You are using **multiple AI providers' free tiers** because you cannot afford paid plans. This means:
- You switch between 7 different AI providers depending on the task
- Some providers run out of credits/free balance (e.g., Google AI, DeepSeek)
- You need to regularly check which keys still work and update the routing config
- This works well for testing but **needs paid plans for real production reliability**

---

## 3. The Two Apps

### App 1: Trendaryo (trendaryo.com)

| Property | Value |
|----------|-------|
| **Purpose** | Your live customer-facing Shopify-like store |
| **Built on** | Firebase Hosting + Firestore (separate Firebase project) |
| **Domain** | trendaryo.com (managed via Cloudflare) |
| **GitHub** | Separate repo: `D:\web sites\trendaryo live site` |
| **Database** | `trendaryo-automation-prod` Firebase project |
| **Features** | Product catalog, cart, checkout, orders, reviews, users, payments |
| **Collections** | products, orders, users, categories, reviews, cart, payments, coupons, settings, inventory_logs, analytics_events |

Trendaryo is where **real customers come, browse products, and place orders**. It is a full e-commerce store built entirely from scratch. You run it on its own Firebase project (completely separate from DropEase's Firebase).

### App 2: DropEase (this project — "dropshipping-copilot")

| Property | Value |
|----------|-------|
| **Purpose** | Your automation brain — dashboard + AI + supplier connections |
| **Built on** | Next.js 15 + React 19 + TypeScript + Tailwind CSS |
| **Hosted** | Vercel (currently on its own Vercel deployment) |
| **Database** | Firebase Firestore: project `trendaryo-automation-prod` |
| **Status** | Feature-complete in code, not yet fully live/connected |

DropEase is where **you (the business owner) log in to manage everything**: find products, connect suppliers, run automation, analyze data, and control what happens in Trendaryo.

### How They Connect

DropEase and Trendaryo connect via **two mechanisms**:

**Mechanism A: The Trendaryo API Client (DropEase → Trendaryo)**
- DropEase calls Trendaryo's REST API endpoints to push/pull data
- Endpoints: `/api/automation-sync/products`, `/api/automation-sync/orders`
- Secured with `x-api-key` header

**Mechanism B: The Web Scraper (DropEase → Trendaryo website)**
- DropEase scrapes live prices from `trendaryo.com` product pages
- Uses `jsdom` to parse HTML and extract current prices
- Scheduled to run on demand via `/api/trendaryo/sync-prices`

---

## 4. Complete Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | Full-stack React framework (App Router) |
| React | 19.2 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4.x | Styling |
| Zustand | 5.x | State management (client-side stores) |
| TanStack Query | 5.x | Server state & caching (React Query) |
| Next Themes | 0.4 | Dark/light theme |
| ShadCN/Radix UI | — | Pre-built accessible UI components |
| Lucide React | 1.x | Icon library |
| Sonner | 2.x | Toast notifications |
| Vaul | 1.x | Bottom sheet/drawer |

### Backend / Server
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 15.x | REST endpoints (serverless) |
| Firebase Admin | 13.x | Server-side Firebase access |
| Axios | 1.x | HTTP client for external APIs |
| JSDOM | — | Web scraping (server-side only) |

### Database & Auth
| Technology | Purpose |
|------------|---------|
| Firebase Firestore | Primary database for both apps |
| Firebase Auth | User authentication |
| Cloud Firestore Security Rules | Access control |

### AI Providers Used (7 total)
| Provider | Package | Used For |
|----------|---------|----------|
| Groq | `groq-sdk` | Order processing analysis |
| Z.AI (Zhipu/GLM) | direct HTTP | Product descriptions, SEO, competitor analysis, returns review |
| Google AI (AIMLAPI) | `@google/generative-ai` | Product descriptions (currently out of funds) |
| OpenRouter | `openai` SDK | Dynamic pricing |
| Cloudflare AI | direct HTTP | Fraud detection |
| Hugging Face | `huggingface` SDK | Product image analysis |
| DeepSeek | direct HTTP | SEO optimization / competitor analysis (currently out of credits) |

### Deployment
| Platform | Used For |
|----------|---------|
| Vercel | Hosting DropEase (Next.js app) |
| Vercel | Hosting Trendaryo (separate Firebase project) |
| Cloudflare | DNS + CDN for trendaryo.com |
| Firebase | Database + Auth for both apps |
| Firebase Hosting | Trendaryo deployment |
| GitHub | Code hosting |

---

## 5. DropEase — Full Feature Breakdown

DropEase has **35+ pages/routes** and **100+ features**. Here is every major section:

### 5.1 Dashboard (`/`)
- Revenue overview with trend badge
- Orders pending counter
- Suppliers connected counter
- Active order queue
- AI Insights panel (real-time analysis)
- Quick action tiles for all major features
- Recent activity feed

### 5.2 Find Products (`/products`)
- Product search by name or category
- Product cards showing: trend score, competition level, price range, supplier, niche
- Products have a `trendaryoUrl` field so the system knows which Trendaryo page to sync with
- AI product analysis: is this a winning product?
- Import products into "My Products"
- Filter by niche, competition, trend score

### 5.3 Find Suppliers (`/suppliers`)
- Supplier directory with trust score, country, response time, minimum order
- **Supplier Integration panel** — connect via API key/secret, view sync status
- **Rating & review system** — submit and view supplier reviews (1-5 star)
- **Direct messaging** — send messages to suppliers, see conversation history
- **Quote request system** — request bulk pricing quotes

### 5.4 Generate Description (`/description`)
- AI-powered product description writer
- Inputs: product name, category, features, target audience, tone, keywords
- Tones: professional, casual, persuasive, playful
- Powered by **Z.AI** (free tier)

### 5.5 Track Orders (`/orders`)
- Order list with status: pending, processing, shipped, delivered, cancelled
- AI fraud detection on orders (Cloudflare AI)
- Status updating
- Order detail view

### 5.6 Analytics (`/analytics`)
- Sales dashboard with charts
- Revenue over time
- Product performance
- Customer insights

### 5.7 SEO (`/seo`)
- AI-powered SEO optimization for product listings
- Keyword suggestions
- Meta title/description generation
- Powered by **Z.AI** (was DeepSeek, now out of credits)

### 5.8 My Products (`/my-products`)
- Products you've imported or created
- Edit status (active/draft/archived)
- View price/stock/trending score

### 5.9 Returns (`/returns`)
- Return request management
- AI-powered return fraud/reason analysis
- Status: requested → approved → refunded/denied
- Powered by **Z.AI**

### 5.10 Trends (`/trends`)
- Niche trend analysis
- Trend scores, weekly change %, search volume, competition level
- Peak season data
- Top products per niche
- Emojis for quick visual scanning

### 5.11 Competitors (`/competitors`)
- Add competitor products with their URLs
- Price history tracking
- AI competitor analysis (strengths, weaknesses, pricing strategies)
- Triggered via `/api/trendaryo/sync-prices` for automated scraping
- Powered by **Z.AI**

### 5.12 Shopify/Amazon Multi-Store(`/multi-store`)
- Connect multiple stores (Shopify, WooCommerce, BigCommerce, Magento, custom)
- Store sync status monitoring
- Product count and order count per store

### 5.13 Automation (`/automation`)
- Fulfillment automation: auto-process orders, auto-generate tracking, notify customer/supplier
- Price monitoring: track competitor prices, trigger alerts on threshold changes
- Email marketing: automated emails on triggers (new order, shipped, delivered, abandoned cart, low stock)
- Inventory management: low stock alerts, auto-reorder rules
- **Abandoned Cart Recovery:** automated email sequence with discount incentives
- **Customer Lifecycle Emails:** welcome, birthday, re-engagement campaigns
- **Dynamic Pricing:** demand/campaign/inventory-triggered price changes
- **Automated Product Listing:** auto-publish winning products based on AI criteria
- **Social Media Posting:** auto-posts to FB/IG/TikTok for new/trending products
- **Advanced Order Workflows:** multi-step approval → quality check → fraud check → customs
- **Automated Supplier Reordering:** auto-reorder when stock is low
- **AI Upsell/Cross-sell:** AI recommends related products at checkout
- **Seasonal Campaign Automation:** auto-run campaigns at specific seasons/events
- **Compliance Reporting Automation:** scheduled GDPR/tax/audit reports

### 5.14 Shipping (`/shipping`)
- Shipping adapter registry (UPS, FedEx, Shopify adapters scaffolded)
- Rate comparison engine
- Shipping zones editor
- Label generation placeholder
- Tracking & webhook sync
- Manifest printing (CSV export)
- Customs paperwork / HS code support

### 5.15 Business (`/business`)
- **SMS Marketing campaigns:** create and send SMS to customers
- **Pricing Rules:** competitive pricing, margin rules, seasonal pricing
- **Affiliate Program:** invite affiliates, track referrals and earnings
- **Profit Margin Calculator:** calculate profit, margin, break-even price
- **Supplier Bulk Orders:** submit large orders to suppliers
- **Supplier Quote Manager:** request and accept bids from suppliers

### 5.16 Integrations (`/integrations`)
- **Shopify** full sync (products + orders)
- **Amazon** full sync (products + orders)
- **Facebook & Instagram** posting
- **TikTok** posting
- **REST API** with key management
- **Trendaryo** connection settings

### 5.17 Finance (`/finance`)
- Payment gateway settings
- Payment transaction history
- Ad platform connection (Facebook Ads, Google Ads)
- Ad spend tracking
- P&L export (CSV)

### 5.18 Customers (`/customers`)
- Customer profile list
- Customer segmentation
- CRM service scaffolded (contact import, activity timeline, audit logs)

### 5.19 Activity (`/activity`)
- Live activity log
- Import, order, supplier, description, automation, return events

### 5.20 Learn Hub (`/learn`)
- Educational articles about dropshipping
- Categories: Getting Started, Product Research, Supplier Tips, Marketing, Scaling

### 5.21 Business Operations (`/campaigns`)
- Campaign management and tracking

### 5.22 Advanced Features (`/advanced-features` or `/advanced-features.tsx`)
- Onboarding Wizard: step-by-step guide for new users
- Product Variants: size, color, material options
- Discounts Manager: coupon codes, bulk discounts
- Market Insights: trend data, seasonality, competitor targeting
- Team Collaboration: invite team members, role-based access (Admin/Manager/Viewer)
- REST API Keys: generate keys for custom integrations
- Automated Reports: schedule sales/product reports by email

### 5.23 Security Settings (`/security-settings`)
- Two-Factor Authentication (TOTP/2FA) setup
- Backup recovery codes
- Password strength validation
- Active session monitoring
- Device tracking
- Revoke sessions

### 5.24 Reviews (`/reviews`)
- Product reviews and ratings
- Moderation workflow (approve/flag/remove)
- In-app reply drafting with templates
- Sentiment analysis (placeholder)
- CSV import/export

### 5.25 GDPR & Privacy (`/gdpr-compliance-manager`)
- Right of Access → data export
- Right to be Forgotten → account deletion
- Right to Rectification → data correction
- Right to Data Portability → export in portable format
- Cookie consent management
- Privacy Policy generator
- Data Processing Agreement (DPA) template

### 5.26 Notifications (`/notifications`)
- Order, product, supplier, system, alert notification types
- Toast-based notification system

### 5.27 Bulk Edit (`/bulk-edit`)
- Edit multiple products at once
- Status transitions, price updates in bulk

### 5.28 Search (`/search`)
- Global search across products, suppliers, orders

### 5.29 Mobile View (`/mobile`)
- Mobile-optimized dashboard view

### 5.30 Auth
- Login page (`/auth/login`)
- Register page (`/auth/register`)
- Firebase Authentication with email/password
- Auth guard protecting dashboard routes

---

## 6. AI Providers & What Each Does

The file `src/lib/ai/config.ts` defines the **central routing** that decides which AI handles which task:

```
Task                  Provider           Status               Why This Provider
───────────────────   ──────────────   ──────────────────   ──────────────────────────
order_processing      GROQ              ✅ Working          Fast inference, free tier
product_description   Z.AI (Zhipu)      ✅ Working          Free quota available
seo_optimization      Z.AI (Zhipu)      ✅ Working          Free quota available
dynamic_pricing       OPENROUTER        ⚠️ Limited          Has free tier, limited credits
fraud_detection       CLOUDFLARE        ✅ Working          Cloudflare AI free tier
image_analysis        HUGGINGFACE       ✅ Working          Free tier available
competitor_analysis   Z.AI (Zhipu)      ✅ Working          Free quota available
returns_review        Z.AI (Zhipu)      ✅ Working          Free quota available
```

### Previously Used But Now Out of Funds:

| Provider | Why Stopped | Was Used For |
|----------|------------|--------------|
| Google AI (AIMLAPI) | Out of funds | Product descriptions |
| DeepSeek | "402 Insufficient Balance" | SEO, competitor analysis |

### Why Z.AI Is the Workhorse:
Z.AI (Zhipu AI / GLM) gives you a **free quota** that is enough for moderate use. Most of your AI tasks now route through Z.AI because the others either ran out or have limited free tiers.

### What Each AI Provider Does in Practice:

**GROQ (`groq-order-processing.ts`):**
- Analyzes order data: detects unusual patterns, validates order completeness
- Used when orders come in — checks if an order looks like fraud or has issues

**Z.AI (`zai.ts`):**
- Writes compelling product descriptions from product details
- Optimizes product copy for SEO (adds keywords, meta tags)
- Analyzes competitors' pricing and strategy
- Reviews and categorizes return reasons

**OpenRouter (`openrouter-pricing.ts`):**
- Analyzes current price vs. competitor prices vs. demand
- Recommends optimal price points
- Reviews returns for refund legitimacy

**Cloudflare AI (`cloudflare-fraud.ts`):**
- Detects fraudulent orders: unusual addresses, rapid multiple orders, mismatched payment info

**Hugging Face (`huggingface-image.ts`):**
- Analyzes product images to extract price ranges, detect watermarks, suggest tags

---

## 7. Database & Data Architecture

### Firestore Collections Used by DropEase

All DropEase collections are aliased with the `dropease_` prefix to avoid collision with Trendaryo's data (which uses a completely separate Firebase project).

| Collection | Purpose | Key Fields |
|------------|---------|-----------|
| `dropease_products` | Your product catalog | id, name, niche, competition, trendScore, supplierName, status, trendaryoUrl, price, currency, priceLastUpdated |
| `dropease_suppliers` | Supplier info | id, name, avatar, categories, trustScore, responseTime, country, totalProducts, verified, minOrder |
| `dropease_orders` | Orders you manage | id, productName, customer, status, orderDate, trackingNumber, total, quantity |
| `dropease_users` | Your team accounts | id, name, email, plan, isOnboarded |
| `dropease_automation_rules` | Automation configurations | id, type, name, status, enabled, conditions, stats |

### How Data Syncs Between DropEase and Trendaryo

```
1. YOU find a product in DropEase
        ↓
2. DropEase stores it in dropease_products with a trendaryoUrl field
        ↓
3. DropEase scrapes trendaryo.com to get the LIVE price
   (POST /api/trendaryo/sync-prices)
        ↓
4. DropEase stores the live price in dropease_products.price
        ↓
5. Automation can then PUSH price updates back to Trendaryo
   (PATCH /api/automation-sync/products/:id)
```

### Trendaryo's Database (Separate Firebase Project: `trendaryo-automation-prod`)

Trendaryo has its own complete e-commerce database schema:

| Collection | Purpose |
|------------|---------|
| `products` | Full product catalog with images, variants, stock, pricing, SEO fields |
| `orders` | Customer orders with payment/shipping status |
| `users` | Customer accounts (Firebase Auth linked) |
| `categories` | Product categories (hierarchical) |
| `reviews` | Product ratings and customer feedback |
| `cart` | Shopping carts |
| `payments` | Payment transactions (Razorpay) |
| `coupons` | Discount codes |
| `settings` | Global store configuration |
| `inventory_logs` | Stock change audit trail |
| `analytics_events` | Event tracking |

Key integration fields already in Trendaryo's products:
- `automationLastSyncedAt` — when DropEase last synced this product
- `automationSource: "dropease"` — marks products coming from DropEase
- `automationSynced: true` — sync status flag

---

## 8. Trendaryo Integration — How It Works

### 8a. The DropEase → Trendaryo API Client

File: `src/lib/integrations/trendaryo-api.ts`

This is a class `TrendaryoAPI` that uses `axios` to call Trendaryo's API. It provides:

```
Method                    What It Does
─────────────────────     ──────────────────────────────────
connect()                 Checks if API key is configured
getAllProducts()          Gets all products from Trendaryo
getAllOrders()            Gets all orders from Trendaryo
updateProduct(id, data)   Updates price and/or stock in Trendaryo
createOrder(orderData)    Creates a new order in Trendaryo
updateOrderStatus(id, s)  Updates order status (pending→shipped etc.)
fetchProducts()           Adapter bridge method → getAllProducts
fetchOrders()             Adapter bridge method → getAllOrders
pushProduct(product)      Adapter bridge → updateProduct (pushes price)
pushOrder(order)          Adapter bridge → createOrder (pushes new order)
```

**Configuration:** Uses env vars `TRENDARYO_API_URL` + `TRENDARYO_API_KEY`
Currently: `TRENDARYO_API_URL=https://api.trendaryo.com`, `TRENDARYO_API_KEY=` (empty — not set yet)

### 8b. The Price Scraper

File: `src/lib/scrapers/trendaryo.ts`

The `TrendaryoScraper` class scrapes live prices from `trendaryo.com` by:
1. Fetching the product page HTML
2. Parsing with JSDOM
3. Trying multiple CSS selectors to find the price element
4. Falling back to regex pattern matching (₹ / INR / Rs.)
5. Returning the numeric price and currency

**Called by:** `POST /api/trendaryo/sync-prices` → `product-price-updater.ts`

### 8c. What Trendaryo Needs to Provide (API Side)

Trendaryo needs to expose these API endpoints for DropEase to call:

```
File needed: api/automation-sync.js (or as Next.js API route)
Base URL: https://api.trendaryo.com/api/automation-sync

GET  /products          → Return all products
PATCH /products/:id     → Update product { price?, stock? }
POST  /orders           → Create order { userId, items, total, shippingAddress }
PATCH /orders/:id       → Update order status { status: "shipped" }
```

This is a simple Express.js router (documented in `INTEGRATION_GUIDE.md`).

---

## 9. What Is Real vs. Mock/Simulated

This is the **most important section** for anyone working on this codebase. Many things look functional in the UI but are actually **simulated with mock data**.

### ✅ REAL (Fully Functional)

| Feature | How It Works |
|---------|-------------|
| **Firestore database** | Real Firebase Firestore reads/writes when `.env.local` is configured with real Firebase credentials |
| **Firebase Auth** | Real email/password authentication with Firebase Auth |
| **AI feature routing** | The `src/lib/ai/index.ts` router genuinely calls each AI provider's API (when keys are valid) |
| **Z.AI calls** | Actually makes HTTP requests to Z.AI API when `ZAI_API_KEY` is set |
| **Groq calls** | Actually calls Groq API for order processing |
| **Cloudflare AI calls** | Actually calls Cloudflare's AI endpoint for fraud detection |
| **HuggingFace image analysis** | Actually queries Hugging Face inference API |
| **OpenRouter pricing** | Actually calls OpenRouter for dynamic pricing |
| **Web scraping from Trendaryo** | Actually fetches and parses `trendaryo.com` pages server-side |
| **Price sync API** | `POST /api/trendaryo/sync-prices` is a real endpoint that runs the scraper and writes to Firestore |
| **REST API routes** | `/api/products`, `/api/orders`, `/api/suppliers`, `/api/automation` → real Firestore CRUD |
| **Zustand state** | Real client-side state with zustand/middleware persist to localStorage |
| **Real-time Firestore listeners** | `onSnapshot` listeners for live data updates (when Firebase configured) |
| **Mock data fallback** | When Firebase is not configured, the app gracefully falls back to mock data from `mock-data.ts` |

### ⚠️ SIMULATED / MOCK (UI Works But Data Is Fake)

These features **look functional in the interface** but are simulated with `setTimeout` and hardcoded responses — they do NOT talk to real external services or write to the database:

| Feature | File(s) | What Is Simulated |
|---------|---------|-------------------|
| **Supplier API connections** | `src/lib/supplier-service.ts` | `connectToSupplier()`, `getSupplierInventory()`, `getSupplierPricing()`, `placeBulkOrder()` all return fake data after a delay — no real API calls to suppliers |
| **Supplier messaging** | `communicationService` in `supplier-service.ts` | `sendMessage()`, `getConversation()`, `requestQuote()` → returns mock messages, no real sending |
| **Supplier quote system** | `supplier-quote-manager.tsx` | Quote creation/acceptance is UI-only, no real supplier communication |
| **Bulk order submission** | `bulkOrderService` in `supplier-service.ts` | Returns fake order ID, no real order placed with supplier |
| **Review system** | `ratingService` in `supplier-service.ts` | Ratings are calculated from mock reviews, not real supplier data |
| **OpenAI product analysis** | `ai-service.ts` | When `NEXT_PUBLIC_OPENAI_API_KEY` is empty → returns hardcoded mock responses. The OpenAI route is NOT set up (key is empty in `.env.local`) |
| **OpenAI description generation** | `ai-service.ts` | Same — mock responses when no key |
| **OpenAI price optimization** | `ai-service.ts` | Same — mock responses when no key |
| **OpenAI competitor analysis** | `ai-service.ts` | Same — mock responses when no key |
| **Social media posting** | `advanced-features-service.ts` | `postToSocialMedia()` posts to FB/IG — mostly simulated, no real Graph API connection |
| **Shopify/Amazon sync** | shopify-adapter.ts, amazon-adapter.ts | `fetchProducts()` and `syncProducts()` are mock implementations — no real OAuth or API calls to Shopify/Amazon |
| **Payment reconciliation** | finance-service.ts | Fake transaction data |
| **CRM contact enrichment** | crm-service.ts | Mock data, no real enrichment APIs |
| **Team member invitations** | advanced-features-service.ts | No real email sending |
| **Scheduled reports** | advanced-features-service.ts | Generate report but no real email sending |
| **Abandoned cart emails** | abandoned-cart-recovery.tsx | UI + mock stats, no real email sending |
| **Customer lifecycle emails** | customer-lifecycle-automation.tsx | UI + mock stats, no real email sending |
| **Automated compliance reporting** | automated-compliance-reporting.tsx | UI, no real PDF generation/email |

### Summary Table of What ISN'T Working Yet

| Category | Status |
|----------|--------|
| Real supplier API connections | ❌ Mock only |
| Real product ordering from suppliers | ❌ Mock only |
| Real supplier messaging | ❌ Mock only |
| Real social media posting | ❌ Mock only |
| Real email sending (anywhere) | ❌ Not implemented |
| Real Shopify/Amazon API sync | ❌ Mock only |
| OpenAI integration | ❌ Key not set; returns mocks |
| Payment gateway | ❌ Razorpay mentioned but not integrated |
| SMS sending | ❌ Not implemented |
| Webhook delivery | ❌ Only webhook subscription stored, not delivered |
| Real app storing to Trendaryo | ❌ TRENDARYO_API_KEY is empty |
| Real Google AI / DeepSeek | ❌ Out of credits/funds |

### What IS Connected to Real Data

| Category | Status |
|----------|--------|
| Firestore (DropEase own data) | ✅ Real when Firebase env configured |
| Z.AI descriptions & SEO | ✅ Real when ZAI_API_KEY works |
| Groq order analysis | ✅ Real when GROQ_API_KEY works |
| Cloudflare fraud detection | ✅ Real when key works |
| HuggingFace image analysis | ✅ Real when HF key works |
| OpenRouter pricing | ✅ Real when credits remain |
| Trendaryo price scraper | ✅ Real when trendaryo.com is reachable |
| Firebase Auth | ✅ Real when configured |

---

## 10. Complete File Map

### Root Configuration
```
.env.local                          All API keys (git-ignored, sensitive)
next.config.ts                      Next.js config (image domains, output tracing)
tailwind.config.js                  Tailwind CSS theme
tsconfig.json                       TypeScript compiler settings
package.json                        Project name: "dropease" — dependencies
package-lock.json                   Lock file
vercel.json                         Vercel deploy config
firebase.json                       Firebase deploy config
firebase.prod.json                  Firebase production config
firestore.indexes.json              Firestore composite indexes
firebase/firestore.rules.prod       Production security rules
firebase/firestore.rules.staging    Dev security rules
.gitignore                          Git ignore rules
eslint.config.mjs                   ESLint configuration
vitest.config.ts                    Test runner configuration
```

### Environment Variables (`.env.local`)
```
# Cloudflare AI
CLOUDFLARE_AI_API_KEY=cfut_...          Fraud detection
CLOUDFLARE_ACCOUNT_ID=43e4e7a8...       Cloudflare account

# Groq AI
GROQ_API_KEY=gsk_...                    Order processing

# Google / AIMLAPI
GOOGLE_AI_API_KEY=7128a0ba...           Product descriptions (OUT OF FUNDS)

# Zhipu AI (Z.AI) — primary free-tier AI
ZAI_API_KEY=be6aecf21...                Descriptions, SEO, competitors, returns

# HuggingFace
HUGGINGFACE_API_KEY=hf_W...             Image analysis

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...         Dynamic pricing (limited credits)

# DeepSeek (OUT OF FUNDS)
DEEPSEEK_API_KEY=sk-8c5e32...           SEO + competitors (402 error)

# SearchAtlas / Browse API
SEARCH_ATLAS_API_KEY=cfut_...           SEO (7-day trial)
BROWSE_API_KEY=cfut_...                 Browse API

# Firebase (client-side — NEXT_PUBLIC_ prefix means exposed to browser safely)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=trendaryo-automation-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=trendaryo-automation-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=trendaryo-automation-prod.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=352820611099
NEXT_PUBLIC_FIREBASE_APP_ID=1:352820611099:web:90258b7fa5f787990d90be

# WebSocket (not configured)
NEXT_PUBLIC_WS_URL=wss://...

# Trendaryo integration (API KEY IS EMPTY — not yet configured)
TRENDARYO_API_URL=https://api.trendaryo.com     ← This is NOT the right URL yet
TRENDARYO_API_KEY=                               ← NOT SET — empty

NODE_ENV=development
```

### Firebase Project Used
- **Project:** `trendaryo-automation-prod`
- **Auth Domain:** `trendaryo-automation-prod.firebaseapp.com`
- This is a **separate Firebase project** from Trendaryo's Firebase project
- Collections: `dropease_products`, `dropease_suppliers`, `dropease_orders`, `dropease_users`, `dropease_automation_rules`

### Source Directory Structure

```
src/
├── app/                          Next.js App Router pages
│   ├── layout.tsx               Root layout: sidebar, theme, auth guard, toaster
│   ├── loading.tsx              Loading skeleton
│   ├── page.tsx                 Dashboard homepage
│   ├── globals.css              Global styles
│   ├── activity/                Activity feed page
│   ├── analytics/               Analytics dashboard
│   ├── api/                     REST API routes
│   │   ├── products/route.ts    CRUD for dropease_products
│   │   ├── orders/route.ts      CRUD for dropease_orders
│   │   ├── suppliers/route.ts   CRUD for dropease_suppliers
│   │   ├── users/route.ts       CRUD for dropease_users
│   │   ├── automation/route.ts  CRUD for dropease_automation_rules
│   │   ├── trendaryo/           Trendaryo-specific endpoints
│   │   │   ├── single/          Single product sync
│   │   │   └── sync-prices/     Bulk price scraping → Firestore
│   │   ├── queue/               Background job processing
│   │   ├── webhooks/            Webhook subscription management
│   │   └── docs/                API documentation page
│   ├── auth/
│   │   ├── login/page.tsx       Login form
│   │   └── register/page.tsx    Registration form
│   ├── automation/              All automation rules UI pages
│   ├── bulk-edit/               Bulk product editing
│   ├── business/                SMS, pricing, affiliates, calculator
│   ├── calculator/              Profit margin calculator
│   ├── campaigns/               Campaign management
│   ├── competitors/             Competitor tracking + AI analysis
│   ├── customers/               Customer list + CRM
│   ├── description/             AI description generator
│   ├── finance/                 Payments, ad spend, P&L
│   ├── integrations/            Platform connection pages
│   ├── learn/                   Educational articles
│   ├── mobile/                  Mobile view preview
│   ├── multi-store/             Multi-store management
│   ├── my-products/             Your imported product catalog
│   ├── orders/                  Order management
│   ├── products/                Product search + analysis
│   ├── returns/                 Return management
│   ├── reviews/                 Review moderation
│   ├── search/                  Global search
│   ├── seo/                     SEO optimization tools
│   ├── shipping/                Shipping rate + label management
│   ├── suppliers/               Supplier discovery + integration
│   └── trends/                  Niche trend analysis
│
├── components/                   All React UI components
│   ├── ui/                      Pre-built UI primitives (buttons, cards, forms, etc.)
│   ├── dashboard/               DashboardCard, QuickActionTile, AIInsightsPanel, etc.
│   ├── automation/              10 automation component files
│   ├── layout/                  SidebarNav, HeaderBar
│   ├── business/                Business tools
│   ├── customers/               Customer management UI
│   ├── dashboard/               Dashboard widgets
│   ├── finance/                 Finance page components
│   ├── integrations/            Integration managers and adapters
│   ├── reviews/                 Review manager and moderation UI
│   ├── shipping/                Shipping and label UI
│   ├── advanced-features.tsx    Onboarding, variants, discounts, insights, teams, API, reports
│   ├── AIAnalysis.tsx           AI product analysis display
│   ├── AIActionButton.tsx       Reusable AI action trigger button
│   ├── analytics-dashboard.tsx  Analytics charts
│   ├── AuthGuard.tsx            Route protection for authenticated pages
│   ├── theme-provider.tsx       Dark/light theme context
│   ├── theme-toggle.tsx         Theme switcher
│   ├── bulk-order-manager.tsx   Bulk order UI
│   ├── gdpr-compliance-manager.tsx  GDPR compliance UI
│   ├── performance-monitor.tsx  Perf dashboard
│   ├── rate-limit-dashboard.tsx Rate limit monitoring
│   ├── security-settings.tsx    2FA, password, session management UI
│   ├── supplier-integration.tsx Supplier API + ratings + messaging
│   └── ... (25+ total)
│
├── lib/                         Business logic, services, utilities
│   ├── ai/                      AI provider modules + central router
│   │   ├── config.ts            Task→Provider mapping (the routing table)
│   │   ├── index.ts             Central AI.runTask() dispatcher
│   │   ├── groq-order-processing.ts  Order analysis via Groq
│   │   ├── zai.ts               Z.AI: description, SEO, competitor, returns
│   │   ├── openrouter-pricing.ts    Dynamic pricing via OpenRouter
│   │   ├── openrouter-returns.ts    Returns fraud via OpenRouter (fallback)
│   │   ├── cloudflare-fraud.ts      Fraud detection via Cloudflare AI
│   │   ├── huggingface-image.ts     Image analysis via Hugging Face
│   │   ├── deepseek-competitor.ts   Competitor analysis via DeepSeek (fallback)
│   │   ├── deepseek-returns.ts      Returns via DeepSeek (fallback)
│   │   ├── deepseek-seo.ts          SEO via DeepSeek (fallback)
│   │   ├── gemini-description.ts    Google AI descriptions (fallback)
│   │   ├── examples.ts              AI usage examples
│   │   └── verify-keys.ts           API key health check
│   │
│   ├── integrations/            External service adapters
│   │   ├── trendaryo-api.ts     Trendaryo API client (axios-based)
│   │   ├── shopify-adapter.ts   Shopify connection adapter
│   │   ├── amazon-adapter.ts    Amazon connection adapter
│   │   ├── ebay-adapter.ts      eBay connection adapter
│   │   ├── trustpilot-adapter.ts Review platform adapter
│   │   ├── index.ts             Adapter registry/exports
│   │   └── example.usage.ts     Integration examples
│   │
│   ├── scrapers/                Web scraping
│   │   ├── trendaryo.ts         Scrape product prices from trendaryo.com
│   │   └── (scraper root throws if called client-side — server-only)
│   │
│   ├── services/                Core Firestore service layer
│   │   ├── products-service.ts      Product CRUD + real-time listeners
│   │   ├── orders-service.ts        Order CRUD + real-time listeners
│   │   ├── suppliers-service.ts     Supplier CRUD + real-time listeners
│   │   ├── users-service.ts         User CRUD + real-time listeners
│   │   ├── automation-service.ts    Automation rule CRUD + helpers
│   │   └── product-price-updater.ts Scrape + sync prices from Trendaryo
│   │
│   ├── shipping-adapters/       Carrier adapter registry
│   │   ├── index.ts             Registry: UPS, FedEx, Shopify, generic mock
│   │   └── (adapter files)
│   │
│   ├── firestore-service.ts     Core Firestore CRUD + real-time + batch
│   ├── firebase-client.ts       Firebase app initialization
│   ├── firebase-auth.ts         Auth helpers
│   ├── ai-service.ts            Legacy OpenAI-based AI (falls back to mocks)
│   ├── supplier-service.ts      Supplier API, ratings, messaging, bulk orders
│   ├── auth-service.ts          2FA, password strength, session management
│   ├── encryption-service.ts    AES-256 encryption, rate limiting, audit logging
│   ├── compliance-service.ts    Tax, GDPR, privacy
│   ├── advanced-features-service.ts  All advanced: variants, discounts, insights, integrations, teams, API, reports
│   ├── integrations-service.ts  Third-party integrations management
│   ├── connectors-service.ts    Connector management
│   ├── crm-service.ts           CRM: contacts, segments, enrichment
│   ├── finance-service.ts       Payments, ad spend, P&L
│   ├── reviews-service.ts       Review management
│   ├── search-service.ts        Full-text search
│   ├── shipping-service.ts      Shipping rate comparison
│   ├── monitoring-service.ts    Health monitoring, heartbeat
│   ├── queue-service.ts         Background job queue
│   ├── streaming-service.ts     WebSocket/SSE streaming
│   ├── csv-export.ts            CSV download for P&L, reviews, etc.
│   ├── mock-data.ts             Demo data for dev mode when Firebase is off
│   ├── seed-firestore.ts        Seed script for initial Firestore data
│   ├── index.ts                 Service barrel export
│   ├── websocket.ts             WebSocket client
│   ├── utils.ts                 General utilities
│   └── test-firestore.ts        Firestore connection test
│
├── store/                       Zustand state stores (8 total)
│   ├── useAppStore.ts          Products, orders, stores, automation rules
│   ├── useAuthStore.ts         Auth state, user session
│   ├── useCustomerStore.ts     Customer data
│   ├── useFinanceStore.ts      Payment and ad data
│   ├── useNotificationStore.ts Notification preferences
│   ├── useReviewsStore.ts      Review moderation state
│   ├── useShipmentStore.ts     Shipping and tracking state
│   └── useShippingStore.ts     Shipping carrier/zone state
│
├── hooks/                       Custom React hooks
│   ├── use-mobile.ts           Mobile detection
│   ├── use-optimized-data.ts   Data optimization hook
│   ├── use-websocket.ts        WebSocket connection hook
│   └── useLoadFirestoreData.ts  Load Firestore data on mount
│
├── types/index.ts              All TypeScript type definitions (723 lines, 70+ types)
└── __tests__/                  Vitest unit tests
    ├── crm.test.ts
    ├── csv-export.test.ts
    ├── finance.test.ts
    ├── shipping.test.ts + shipping-extra.test.ts
    └── reviews.test.ts
```

---

## 11. Deployment & Environment Setup

### DropEase Is Currently Deployed Where?
- **Vercel** (from the project's GitHub repo)
- Firebase project: `trendaryo-automation-prod`
- Live URL is not confirmed in the code — check Vercel dashboard for the deployed URL

### Entrance Variables to Set (Vercel Dashboard → Project Settings → Environment Variables)

To make DropEase fully live, **every API key** listed in `.env.local` must be set as a Vercel environment variable. The Firebase vars are likely already set from deployment history.

### Trendaryo's `.env` Needs (on its own Firebase project)
```
DROPEASE_API_KEY=your-strong-secret-key-here    ← For the API endpoint
```
Plus Trendaryo needs its own Firebase config (separate from DropEase's Firebase).

---

## 12. Step-by-Step Roadmap to Go Live

### Phase 1: Fix the Basics (Urgent — Before Any Real Operations)

**Step 1 — Set up a real TRENDARYO_API_KEY**
- In your Trendaryo project's `.env`, add a strong random string as `DROPEASE_API_KEY`
- In DropEase's `.env.local`, set `TRENDARYO_API_KEY` to the **same** string
- Deploy DropEase to Vercel with this env var set
- **Without this, DropEase cannot communicate with Trendaryo at all**

**Step 2 — Fix the TRENDARYO_API_URL**
- Change `TRENDARYO_API_URL=https://api.trendaryo.com` to your actual Vercel deployment URL for DropEase
- This variable is used by `trendaryo-api.ts` to construct request URLs
- Note: the current value points to Trendaryo's main site, not DropEase's API

**Step 3 — Verify Firebase credentials are production-ready**
- Currently pointing at `trendaryo-automation-prod` — confirm this is the right project
- Confirm all Firestore security rules are deployed (`firebase deploy --only firestore:rules`)
- Confirm composite indexes are deployed (`firebase deploy --only firestore:indexes`)

**Step 4 — Set up Trendaryo API endpoints**
- Add the API endpoints (Express routes) to Trendaryo (`api/automation-sync.js`)
- Deploy to Firebase Hosting or Netlify
- Confirm endpoints work with Postman (use the `DROPEASE_API_KEY` header)

### Phase 2: Make Suppliers Real

All supplier operations are simulated. To make them real:

**Step 5 — Choose actual suppliers to connect**
- Find real suppliers (AliExpress, CJ Dropshipping, Spocket, Modalyst, etc.)
- Get their API keys/credentials
- Add a real connection flow in `supplier-service.ts` that calls real APIs instead of `setTimeout`

**Step 6 — Implement real quote/bulk order flow**
- Currently returns fake order IDs
- This depends on which supplier platforms you use — each has their own API docs

**Step 7 — Implement real messaging**
- Connect to supplier messaging APIs or use email/SMS
- Store real messages in Firestore `dropease_supplier_messages` collection

**Step 8 — Seed real supplier data**
- Replace `suppliers` from `mock-data.ts` with real data from Firestore

### Phase 3: Make AI Features Reliable

Your AI routing is set up but many providers have out-of-credits status:

**Step 9 — Keep using Z.AI (primary)**
- Z.AI free tier is your most reliable option right now
- Monitor usage at Z.AI dashboard
- Set up monitoring/alerting for credit exhaustion

**Step 10 — Decide on the primary AI provider long-term**
- When you can afford it: choose ONE primary provider (OpenAI, Anthropic, or Google)
- Simplify `TASK_AI_MAPPING` to route everything through one reliable provider
- This reduces complexity and failure points

**Step 11 — Set up OpenAI (optional, replace ai-service.ts mocks)**
- Get an OpenAI API key
- Add `NEXT_PUBLIC_OPENAI_API_KEY` to Vercel env vars
- The `ai-service.ts` already handles OpenAI — it just returns mocks when no key is set
- Once you add the key: product analysis, description, and price optimization all become real

**Step 12 — Fix DeepSeek / Google AI**
- DeepSeek returned 402 (out of credits) — wait for billing or find an alternative
- Google AI out of funds — either add credits or remove from routing config

### Phase 4: Connect Trendaryo ↔ DropEase Bi-Directionally

**Step 13 — Price sync automation**
- Run `POST /api/trendaryo/sync-prices` on a schedule (Vercel Cron Job)
- When a supplier price changes, DropEase scrapes Trendaryo to get the live price
- Currently: one-way sync (Trendaryo → DropEase)

**Step 14 — Push price changes back to Trendaryo**
- When DropEase AI recommends a new price, call `POST /api/automation-sync/products/:id` in Trendaryo
- Now: DropEase writes back to Trendaryo

**Step 15 — Auto-order flow**
- When a new order lands in Trendaryo → Trendaryo fires webhook → DropEase receives it
- DropEase auto-places order with supplier
- DropEase auto-updates Trendaryo with tracking number
- Files: `src/app/api/automation/route.ts`, trendaryo webhook endpoints

**Step 16 — Stock sync**
- When DropEase places order with supplier → supplier tells DropEase stock shipped
- DropEase updates Trendaryo stock count
- Trendaryo shows customer updated stock

### Phase 5: Go-Live Checklist

```
INFRASTRUCTURE
[ ] Vercel project created for DropEase
[ ] Vercel env vars set (all from .env.local)
[ ] Firebase security rules deployed
[ ] Firebase indexes deployed
[ ] Trendaryo API endpoint deployed
[ ] DROPEASE_API_KEY set in BOTH projects (same value)

DATA
[ ] Real suppliers connected (not mock)
[ ] Real products in dropease_products collection
[ ] Real products synced to Trendaryo products collection
[ ] Automation rules created in Firestore

TRENDARYO CONNECTION
[ ] TRENDARYO_API_KEY set in DropEase env
[ ] TRENDARYO_API_URL pointing to correct URL
[ ] Trendaryo API endpoints working (test with Postman)
[ ] Price scraping working (POST /api/trendaryo/sync-prices)
[ ] Price pushing working (patch to Trendaryo API)

AUTOMATION
[ ] At least one automation rule active
[ ] At least one price monitoring rule set up
[ ] Email sending set up (if using email marketing)

MONITORING
[ ] Error tracking set up (Sentry or similar)
[ ] API rate limit monitoring
[ ] AI provider health check (which keys are working)
```

---

## 13. What Each AI API Key Does

| Key | Provider | What It Does In This App |
|-----|----------|--------------------------|
| `ZAI_API_KEY` | Zhipu AI (Z.AI) | Writes product descriptions, SEO-optimizes listings, analyzes competitors, reviews returns |
| `GROQ_API_KEY` | Groq | Analyzes incoming orders for fraud/validity patterns |
| `OPENROUTER_API_KEY` | OpenRouter | Gets dynamic price recommendations based on competition data |
| `CLOUDFLARE_AI_API_KEY` | Cloudflare AI | Detects fraudulent orders |
| `HUGGINGFACE_API_KEY` | Hugging Face | Analyzes product images for tags, pricing, quality |
| `DEEPSEEK_API_KEY` | DeepSeek | (Currently broken — returned 402 Insufficient Balance) |
| `GOOGLE_AI_API_KEY` | Google AI/Vertex | (Currently broken — out of funds) |
| `SEARCH_ATLAS_API_KEY` | SearchAtlas | 7-day free trial for SEO keyword research |
| `BROWSE_API_KEY` | Browse API | Web searching for SEO (same key as SearchAtlas) |

### Where Each Key Is Used In the Code

```
ZAI_API_KEY
  → src/lib/ai/zai.ts
  → Used for: product descriptions, SEO optimization, competitor analysis, returns review
  → Called via: AI.runTask('product_description', ...), AI.runTask('seo_optimization', ...), etc.

GROQ_API_KEY
  → src/lib/ai/groq-order-processing.ts
  → Used for: analyzing order data for fraud/validity
  → Called via: AI.runTask('order_processing', ...)

OPENROUTER_API_KEY
  → src/lib/ai/openrouter-pricing.ts
  → Used for: dynamic price recommendation
  → Called via: AI.runTask('dynamic_pricing', ...)

CLOUDFLARE_AI_API_KEY
  → src/lib/ai/cloudflare-fraud.ts
  → Used for: fraud detection on orders
  → Called via: AI.runTask('fraud_detection', ...)

HUGGINGFACE_API_KEY
  → src/lib/ai/huggingface-image.ts
  → Used for: product image analysis
  → Called via: AI.runTask('image_analysis', ...)
```

---

## 14. Free Tier Status & Cost realities

| Provider | Free Tier Status | Notes |
|----------|-----------------|-------|
| Z.AI (Zhipu) | ✅ Working | Your primary AI — monitor usage |
| Groq | ✅ Working | Fast & generous free tier |
| Cloudflare AI | ✅ Working | Good for fraud detection |
| HuggingFace | ✅ Working | Free tier sufficient for image analysis |
| OpenRouter | ⚠️ Limited | Has free credits but limited — consume carefully |
| DeepSeek | ❌ 402 Error | Out of funds/credits |
| Google AI | ❌ Out of Funds | Needs billing enabled or remove from config |
| SearchAtlas | ⚠️ 7-day trial | Working now but trial expires |
| Firebase | ✅ Free tier | 50k reads/day free — fine for testing; may need Blaze plan for production |
| Vercel | ✅ Hobby (free) | 100GB bandwidth/month — fine for now; upgrade when traffic grows |

### When You're Ready to Pay for One AI Provider

Find the cheapest provider that gives you reliable service for all tasks. A single $10-20/month paid tier on one provider is better than juggling 7 free tiers.

Recommended order: Z.AI → OpenAI → Anthropic

---

## 15. Next Features To Add

Based on the MISSING_FEATURES_TRACKER.md and the existing code analysis:

### Real Integrations (Replace Mocks With Real APIs)

1. **Real supplier API connections** — Connect to a real dropshipping supplier API (AliExpress, CJ Dropshipping, Spocket, or Modalyst)
2. **Real email sending** — Set up Resend, SendGrid, or AWS SES for transactional emails (order confirmations, abandoned cart recovery emails)
3. **Real payment gateway** — Stripe or Razorpay integration for DropEase billing
4. **Real WhatsApp/SMS sending** — WhatsApp Business API or Twilio for order notifications
5. **Real Shopify/Amazon OAuth sync** — Currently mock; needs real OAuth flow and API integration
6. **Real social media posting** — Facebook Graph API, Instagram Basic Display, TikTok for Business APIs

### Data & Sync Improvements

7. **Auto-fulfillment engine** — Complete end-to-end: Trendaryo order → DropEase detects → auto-orders from supplier → auto-updates tracking → auto-notifies customer
8. **Stock sync loop** — Supplier stock changes → DropEase → Trendaryo in real-time
9. **Cron job for price scraping** — Vercel Cron Jobs to run `POST /api/trendaryo/sync-prices` every X hours
10. **Vercel Cron for automation rules** — Run automation checks on schedule (price monitoring, stock alerts)
11. **Webhook delivery** — When DropEase receives an order, fire webhook to your other services
12. **Image CDN for product images** — Currently using picsum.photos placeholders; need real CDN

### Business Features

13. **Profit dashboard** — Real P&L: actual supplier cost, actual shipping cost, actual ad spend
14. **Ad spend integration** — Connect real Facebook Ads + Google Ads accounts
15. **Real payment reconciliation** — Match orders against actual payment gateway transactions
16. **CSV product import** — Bulk import products from supplier CSV files
17. **Razorpay/Stripe subscription** — For DropEase Pro tier billing
18. **Invoice generation** — Auto-generate invoices for customer orders
19. **Returns management** → Real return shipping labels (Shippo, EasyPost)
20. **Multi-currency support** — Auto-convert prices based on customer location

### Testing & Quality Of Life

21. **Webhook testing tool** — Send test webhook payloads from the UI
22. **E2E tests** — Add Playwright for full user-flow testing
23. **Sentry error tracking** — Monitor production errors
24. **Health check page** — `/health` endpoint or UI page showing: AI provider status, Firebase connection, API latency
25. **API key rotator UI** — Let you switch AI providers from the UI when one runs out of credits
26. **AI cost estimator** — Show estimated cost per AI call for each provider

### Code Cleanup

27. **Consolidate AI imports** — `src/lib/ai/index.ts` and `src/lib/ai-service.ts` both handle AI. They are separate systems. Consider merging into one clean AI service.
28. **Remove dead provider modules** — When DeepSeek and Google AI are permanently out, remove their files and update `config.ts`
29. **Standardize naming** — Project is called "dropease" in `package.json` but "DropEase" in UI. Trendaryo calls it "dropshipping-copilot" in the repo folder name. Standardize.
30. **Add API key rotation for Trendaryo** — Periodic key rotation for the DropEase↔Trendaryo API secret

---

## Glossary

| Term | Simple Explanation |
|------|-------------------|
| **Dropshipping** | A business where you sell products online without keeping inventory; when a customer orders, a supplier ships it to them directly |
| **Trendaryo** | Your live online store where customers browse and buy products |
| **DropEase** | Your admin dashboard that finds products, connects suppliers, and runs automations |
| **Firestore** | Google's cloud database — stores your products, orders, users, etc. |
| **Next.js** | The web framework that serves both the frontend (what users see) and the API (backend logic) |
| **Zustand** | A lightweight tool for remembering data on the user's browser (like keeping a product in their cart) |
| **AI Provider** | A company that sells AI text/image processing as a service (Z.AI, OpenAI, Groq, etc.) |
| **API Key** | A secret password that lets your app "log in" to another app's service |
| **Free Tier** | A limited free plan offered by most tech companies for testing/development |
| **Scraper** | A piece of code that reads a website and extracts information (like current product prices) |
| **Webhook** | A way for one website to automatically notify another website when something happens (like a new order) |
| **Rate Limiting** | A safeguard that limits how many times your app can call an external API within a certain time |
| **2FA / TOTP** | Two-factor authentication — a second password (from an app like Google Authenticator) |
| **GDPR** | European privacy law that gives users rights over their personal data |
| **SKU** | Stock Keeping Unit — a unique ID for each product variant |
| **COGS** | Cost of Goods Sold — what it costs you to buy a product from the supplier |
| **OAuth** | A secure way to connect your app to someone else's account (e.g., linking a Shopify store) |

---

## Diagram: Complete System Architecture

```
┌──────────────┐       ┌─────────────────────────────────────────────────┐
│   CUSTOMER   │       │              TRENDARYO (trendaryo.com)           │
│              │       │   Firebase Hosting + Firestore                   │
│  Browses →   │──────►│  ┌──────────┐  ┌────────┐  ┌──────────┐      │
│  Orders →    │       │  │ products │  │ orders │  │  users   │      │
│              │◄──────│  └──────────┘  └────────┘  └──────────┘      │
└──────────────┘       └──────────────────────┬──────────────────────┘
    Cloudflare DNS                            │
                                              │ Webhook (new order)
                                              ▼
┌────────────────────────────────────────────────────────────────┐
│               DROPEASE (DropEase Copilot)                        │
│               Vercel + Firestore (dropease_ collections)         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  AI Router (src/lib/ai/)                              │      │
│  │  ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐    │      │
│  │  │ Z.AI  │ │  Groq  │ │ OpenRouter│ │Cloudflare│    │      │
│  │  │Descript│ │Orders  │ │  Pricing │ │ Fraud    │    │      │
│  │  │  SEO   │ │        │ │          │ │ Detect   │    │      │
│  │  │Competit│ │        │ │          │ │          │    │      │
│  │  │Returns │ │        │ │          │ │          │    │      │
│  │  └────────┘ └────────┘ └─────────┘ └──────────┘    │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Integrations Layer                                   │      │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────────┐    │      │
│  │  │ Trendaryo   │  │ Supplier │  │ Shopify /   │    │      │
│  │  │   API +     │  │ Service  │  │ Amazon Adapters│  │      │
│  │  │  Scraper   │  │(mock)    │  │  (mock)      │    │      │
│  │  └─────────────┘  └──────────┘  └─────────────┘    │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Products Svc│  │Orders Svc│  │Suppliers │  │Automation │    │
│  └────────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  35+ Page Routes: /products /suppliers /orders /automation│  │
│  │  /seo /competitors /trends /reviews /integrations /bulk-  │  │
│  │  edit /returns /finance /business /shipping /customers    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
           │
           │ Pushes prices/orders/staff back to
           ▼
    TRENDARYO API ENDPOINTS (must be built)
    ┌────────────────────────────────────┐
    │ GET  /products                     │
    │ PATCH /products/:id  {price,stock} │
    │ POST /orders                        │
    │ PATCH /orders/:id   {status}        │
    └────────────────────────────────────┘
           │
           │ reads from / writes to
           ▼
    Firebase Firestore (trendaryo products/orders)
```

---

## Files That Need To Be Built / Fixed To Go Live

### Highest Priority (Blocks Everything)

1. **Trendaryo API endpoints** — Create `api/automation-sync.js` in Trendaryo project and deploy
2. **Set `TRENDARYO_API_KEY`** in both Trendaryo (as `DROPEASE_API_KEY`) and DropEase `.env.local`
3. **Set `TRENDARYO_API_URL`** correctly in DropEase `.env.local`
4. **Deploy DropEase to Vercel** with all environment variables

### Medium Priority (Needed for Real Business Operations)

5. **Real supplier API connection code** — Replace mock in `supplier-service.ts`
6. **Set up email sending** — Resend or SendGrid for order confirmations and abandoned cart
7. **Connect OpenAI/Anthropic** as primary AI — Add real API key and update `TASK_AI_MAPPING`
8. **Automation scheduler** — Vercel Cron Jobs for price monitoring, stock alerts, order processing
9. **Real Shopify/Amazon connection** — OAuth flow + real API calls
10. **Error monitoring** — Sentry or LogRocket for production error tracking

### Lower Priority (Nice to Have)

11. **Payment gateway for DropEase** — Stripe/Paddle for billing Pro users
12. **Mobile app** — PWA or React Native companion
13. **Advanced export formats** — PDF reports, Excel, more
14. **Team features fully connected** — Real email invites
15. **Rate limit alerts** — Show which AI provider is running low

---

*This document covers every aspect of your DropEase + Trendaryo business system. Any AI that reads this will understand: what you're building, why you're building it, how the code works, what each AI provider does, what's real vs. mocked, what your database looks like, what environment variables each feature needs, and exactly what steps to take next.*
