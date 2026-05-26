# Dropship Autopilot

MVP dashboard to automate common dropshipping workflows:

- **Winning products** — trend & niche research
- **Suppliers** — match products to suppliers
- **Product copy** — AI listing descriptions
- **Orders** — auto-fulfillment & tracking sync

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenRouter (AI for product research & copywriting)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Firebase (for storing API keys securely)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Trendaryo Store (your custom store)
TRENDARYO_API_URL=https://api.trendaryo.com
TRENDARYO_API_KEY=your-trendaryo-api-key

# Supplier APIs
CJ_API_KEY=your-cj-api-key
ZENDROP_API_KEY=your-zendrop-api-key
ALIEXPRESS_APP_KEY=your-aliexpress-app-key

# Research APIs
META_API_KEY=your-meta-api-key
```

## Project structure

```
src/
  app/(dashboard)/     # UI pages
  app/api/automation/  # Automation API routes
  app/api/settings/    # Settings API routes
  components/          # Shared UI
  lib/automation/      # Types, modules, runner (swap mocks for real APIs)
  lib/firebase.ts      # Firebase configuration
```

## Live integrations

| Module | Requires | Behavior |
|--------|----------|----------|
| Winning Products | OpenRouter key | AI product research (demo without key) |
| Suppliers | CJ key and/or OpenRouter | CJ catalog search, AI fallback |
| Product Copy | OpenRouter key | AI listing copy |
| Orders | Trendaryo URL + key | Fetches `/orders?status=unfulfilled` |
| Full Autopilot | OpenRouter (+ CJ optional) | Chains research → suppliers → copy |

API keys can be set in **Settings** (saved to Firestore) or in `.env.local` (server defaults).

## Trendaryo API contract

The orders module expects your store API to expose:

- `GET {TRENDARYO_API_URL}/orders?status=unfulfilled` — list orders
- `POST {TRENDARYO_API_URL}/orders/{id}/fulfill` — mark fulfilled (optional tracking in body)

Bearer token: `TRENDARYO_API_KEY`.

## Authentication

When `NEXT_PUBLIC_FIREBASE_*` keys are set:

- `/login` and `/register` — email/password and Google sign-in
- Session cookie (`__session`) — per-user API keys and automation history
- Dashboard routes require sign-in

Without client Firebase config, the app runs in **demo mode** (shared default user).

Enable **Email/Password** and **Google** sign-in in Firebase Console → Authentication.

## Scheduled product scans

Open **Schedules** in the sidebar (or `/schedules`):

- Enable scheduled scans and pick daily / weekly / monthly
- Set a default research query (e.g. `pet products`)
- **Run scan now** — runs immediately and saves products to your library
- **Cron endpoint** (production): `GET /api/cron/research-scan` with header `Authorization: Bearer CRON_SECRET`
  - Vercel: configured in `vercel.json` (daily at 09:00 UTC)
  - Local test: `curl -H "Authorization: Bearer your-secret" http://localhost:3000/api/cron/research-scan`

## Remaining for production

1. Zendrop & AliExpress direct APIs when keys are available
