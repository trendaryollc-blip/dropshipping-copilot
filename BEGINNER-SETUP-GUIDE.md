# DropEase — Simple Setup Guide (For Non-Developers)

**Who this is for:** You run Trendaryo (your store) and DropEase (your automation dashboard). You are **not** expected to know coding. This guide explains what is still “fake” in the app, which **passwords for websites** (called API keys) you need, and **exactly where to click** to get them.

**Last updated:** May 22, 2026

---

## Table of contents

1. [Words you will see (simple glossary)](#1-words-you-will-see-simple-glossary)
2. [What is still missing (honest list)](#2-what-is-still-missing-honest-list)
3. [The one file that holds all your secrets](#3-the-one-file-that-holds-all-your-secrets)
4. [Priority: what to set up first](#4-priority-what-to-set-up-first)
5. [Step-by-step: every key and how to get it](#5-step-by-step-every-key-and-how-to-get-it)
6. [Putting keys on Vercel (your live website)](#6-putting-keys-on-vercel-your-live-website)
7. [Connecting DropEase to Trendaryo](#7-connecting-dropease-to-trendaryo)
8. [Optional services (when you are ready)](#8-optional-services-when-you-are-ready)
9. [Final checklist before you go live](#9-final-checklist-before-you-go-live)
10. [When something breaks](#10-when-something-breaks)

---

## 1. Words you will see (simple glossary)

| Word | Plain English |
|------|----------------|
| **API key** | A long secret password that lets *your* app talk to *another* company’s service (AI, email, Shopify, etc.). Treat it like a bank password — never post it on social media or commit it to GitHub. |
| **`.env.local`** | A private text file on your computer that stores all those secrets. The app reads it when you run locally. It is **not** uploaded to GitHub if `.gitignore` is correct. |
| **Vercel** | The company that hosts your DropEase website on the internet. You paste the same secrets there under “Environment Variables”. |
| **Firebase** | Google’s database + login system. Your products, orders, and users can live here. |
| **Mock / simulated** | The app *pretends* something worked (fake order, fake email sent) so you can click around. It is **not** real until you add real keys. |
| **OAuth** | “Log in with Shopify” style connection — safer than copying passwords. Not fully built yet for Shopify/Amazon in DropEase (still mock). |
| **Webhook** | When something happens (new order), one website automatically tells another website. |
| **Trendaryo** | Your customer-facing store (trendaryo.com). |
| **DropEase** | This project — your admin / automation dashboard. |

---

## 2. What is still missing (honest list)

Your project **looks complete** in the menus, but several parts only work with **demo data** until you add real accounts and keys.

### Still using demo / fake data (until Firebase + pages are wired)

- Dashboard home (`/`)
- Product Research (`/products`)
- Supplier Finder (`/suppliers`)
- Order Tracker (`/orders`)
- Bulk Edit, Activity feed, some Learn articles

**Fix:** Add Firebase keys (Section 5A). Over time, those pages should load from the database instead of built-in demo lists.

### Built in the app but needs a real company account behind it

| Feature in app | What you see today | What you need for real use |
|----------------|-------------------|----------------------------|
| AI descriptions, SEO, pricing | Works if keys are valid; otherwise generic text | AI keys (Section 5B) — **Z.AI + Groq** recommended first |
| Shopify / Amazon sync | Buttons work; data is sample | Shopify Partner + Amazon Seller accounts (Section 8) |
| Shipping labels & rates | Estimated prices, printable placeholders | Shippo, EasyPost, or carrier accounts (Section 8) |
| CRM email & SMS | “Sent” in the app; not a real inbox | Resend/SendGrid + Twilio (Section 8) |
| Reviews from Shopify, etc. | Sample reviews imported | Store API access (Section 8) |
| Background jobs | Resets when server sleeps | Paid Redis or Vercel Cron setup (later) |

### Nice to have later

- Playwright E2E tests (automatic click-testing)
- Sentry (error alerts) — key ready, package optional
- PostgreSQL, Cloudinary — not in this project yet

---

## 3. The one file that holds all your secrets

### On your computer

1. Open your project folder: `dropshipping-copilot`
2. Create a file named **`.env.local`** in that folder (same level as `package.json`)
3. Copy everything from **`.env.example`** in the same folder
4. Replace every `your-...-here` with real values from the sections below

**Windows tip:** If you cannot create a file starting with a dot, open Notepad → Save As → file name: `.env.local` → “Save as type: All files”.

### Never do this

- Do not put `.env.local` on Facebook, Discord, or screenshots
- Do not commit it to GitHub (it should stay private)

---

## 4. Priority: what to set up first

Do these in order. Stop and test after each block if you can.

| Priority | What | Why |
|----------|------|-----|
| **P0 — Must** | Firebase (5A) | Real database; without it the app uses fake products/orders |
| **P0 — Must** | Trendaryo URL + secret key (5C) | Lets DropEase talk to your live store |
| **P1 — Strongly recommended** | Z.AI + Groq (5B) | AI features you use every day (descriptions, orders, SEO) |
| **P1** | Cloudflare AI + Hugging Face (5B) | Fraud check + image analysis (free tiers) |
| **P2 — When you sell for real** | Email (Resend), payments (Stripe), SMS (Twilio) | Customers get real messages |
| **P3 — Growth** | Shopify, carriers, ads, Sentry | Scale and automation |

---

## 5. Step-by-step: every key and how to get it

Below: **Variable name** = exact line you put in `.env.local`  
**Used for** = which part of DropEase needs it

---

### 5A — Firebase (database & login) — **START HERE**

**Used for:** Saving products, orders, users, automation rules. Without these, DropEase shows **demo data**.

| Variable name | Example shape | Required? |
|---------------|---------------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | long string | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `something.firebaseapp.com` | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `trendaryo-automation-prod` | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `something.appspot.com` | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | numbers | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123:web:abc` | Yes |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | whole JSON blob | Only for advanced server tools |

#### How to get Firebase values (click-by-click)

1. Open a browser and go to: **https://console.firebase.google.com**
2. Sign in with the **same Google account** you use for Trendaryo (if possible).
3. Click your project name (e.g. `trendaryo-automation-prod`).  
   - If you are unsure which project: open Trendaryo’s Firebase settings and use the **same** project ID.
4. Click the **gear icon** ⚙️ next to “Project Overview” → **Project settings**.
5. Scroll to **“Your apps”**.
6. If you see a web app `</>` already, click it. If not:
   - Click **“Add app”** → choose **Web** `</>`
   - Nickname: `dropease`
   - Click **Register app**
7. You will see a code block like `firebaseConfig = { apiKey: "...", ... }`.
8. Copy each value into `.env.local`:

   | From Firebase screen | Put in `.env.local` |
   |---------------------|---------------------|
   | `apiKey` | `NEXT_PUBLIC_FIREBASE_API_KEY` |
   | `authDomain` | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
   | `projectId` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
   | `storageBucket` | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
   | `messagingSenderId` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
   | `appId` | `NEXT_PUBLIC_FIREBASE_APP_ID` |

9. **Save** the file. Restart the app (`npm run dev`).

**Cost:** Free tier is enough to start. Heavy traffic may need Firebase “Blaze” (pay as you go).

**Common mistake:** Wrong `PROJECT_ID` — DropEase writes to a different database than Trendaryo. Confirm with your developer which project both apps should share.

---

### 5B — AI providers (smart text, pricing, fraud)

DropEase uses **different AI companies** for different jobs. You can start with **two** and add more later.

| Variable name | Used for in DropEase | Priority |
|---------------|----------------------|----------|
| `ZAI_API_KEY` | Product descriptions, SEO, competitors, returns | **Get first** |
| `GROQ_API_KEY` | Order processing / analysis | **Get first** |
| `OPENROUTER_API_KEY` | Dynamic pricing | Optional (needs credits) |
| `CLOUDFLARE_AI_API_KEY` | Fraud detection | Recommended (free tier) |
| `CLOUDFLARE_ACCOUNT_ID` | Fraud detection (pairs with key above) | With Cloudflare |
| `HUGGINGFACE_API_KEY` | Product image analysis | Optional |
| `GOOGLE_AI_API_KEY` | Descriptions (backup) | Optional — often out of funds |
| `DEEPSEEK_API_KEY` | SEO / competitors (backup) | Optional — often out of credits |
| `NEXT_PUBLIC_OPENAI_API_KEY` | Legacy AI panel | Optional |

---

#### Z.AI (Zhipu / GLM) — **ZAI_API_KEY**

**Used for:** Description AI, SEO Tools, Competitor Tracker, Returns AI (main brain today).

1. Go to **https://open.bigmodel.cn** or the Z.AI / GLM provider site you signed up with.
2. Create an account (email or phone).
3. Open **API Keys** or **控制台 → API Key** (Chinese console).
4. Click **Create API Key** / **生成 API Key**.
5. Copy the key (often starts with letters/numbers, no spaces).
6. In `.env.local` add:
   ```
   ZAI_API_KEY=paste-your-key-here
   ```
7. Save. In DropEase open **Description AI** or **SEO** and run one test.

**Cost:** Free quota exists; watch usage in their dashboard.

---

#### Groq — **GROQ_API_KEY**

**Used for:** Order Tracker AI when you analyze orders.

1. Go to **https://console.groq.com**
2. Sign up (Google or email).
3. Left menu → **API Keys**.
4. Click **Create API Key** → name it `dropease`.
5. Copy the key (starts with `gsk_`).
6. Add to `.env.local`:
   ```
   GROQ_API_KEY=gsk_xxxxxxxx
   ```

**Cost:** Generous free tier for testing.

---

#### OpenRouter — **OPENROUTER_API_KEY**

**Used for:** Profit Calculator / dynamic pricing suggestions.

1. Go to **https://openrouter.ai**
2. Sign in → profile → **Keys**.
3. Create key → copy (starts with `sk-or-`).
4. Add:
   ```
   OPENROUTER_API_KEY=sk-or-xxxxxxxx
   ```
5. Add a few dollars of credit if pricing returns errors.

---

#### Cloudflare AI — **CLOUDFLARE_AI_API_KEY** + **CLOUDFLARE_ACCOUNT_ID**

**Used for:** Fraud-style checks on orders (when wired).

1. Go to **https://dash.cloudflare.com** and sign up.
2. Add your domain OR skip domain and use Workers AI only.
3. On the right sidebar of the dashboard, find **Account ID** — copy it.
4. Left menu → **Workers & Pages** → **AI** (or **Workers AI**).
5. Create an API token / Workers AI token as shown in their docs (token often starts with `cf_` or similar).
6. Add:
   ```
   CLOUDFLARE_ACCOUNT_ID=your-account-id
   CLOUDFLARE_AI_API_KEY=your-token
   ```

**Cost:** Free tier available.

---

#### Hugging Face — **HUGGINGFACE_API_KEY**

**Used for:** Image-related AI analysis.

1. Go to **https://huggingface.co**
2. Sign up → click your profile picture → **Settings**.
3. Left side → **Access Tokens**.
4. **New token** → role “Read” is enough → copy (`hf_...`).
5. Add:
   ```
   HUGGINGFACE_API_KEY=hf_xxxxxxxx
   ```

**Cost:** Free for light use.

---

#### Google AI (Gemini) — **GOOGLE_AI_API_KEY** (optional)

1. Go to **https://aistudio.google.com** or Google AI Studio.
2. Sign in → **Get API key** → create key in a Google Cloud project.
3. Billing may be required for continued use.
4. Add `GOOGLE_AI_API_KEY=...`

**Note:** Your project docs say this account may be **out of funds** — Z.AI replaces it for descriptions.

---

#### DeepSeek — **DEEPSEEK_API_KEY** (optional)

1. Go to **https://platform.deepseek.com**
2. Register → API keys → create key.
3. Add `DEEPSEEK_API_KEY=...`

**Note:** Often shows “insufficient balance” — use Z.AI instead for SEO/competitors.

---

### 5C — Trendaryo store connection — **CRITICAL FOR YOUR BUSINESS**

**Used for:** Syncing products, prices, and orders between **Trendaryo** (store) and **DropEase** (this app).

| Variable name | What it is |
|---------------|------------|
| `TRENDARYO_API_URL` | The web address of your live Trendaryo site |
| `TRENDARYO_API_KEY` | A secret password **you invent** — same on both apps |

#### How to set the Trendaryo secret (you create it — no website sells this)

1. Think of a long random password, e.g. 40+ characters.  
   Example tool: https://passwordsgenerator.net (copy a 40-character password).
2. On your **computer**, open Trendaryo’s project `.env` or `.env.local` file and add:
   ```
   DROPEASE_API_KEY=the-same-long-password-you-chose
   ```
3. In **DropEase** `.env.local` add:
   ```
   TRENDARYO_API_URL=https://trendaryo.com
   TRENDARYO_API_KEY=the-same-long-password-you-chose
   ```
   Replace the URL with your real Trendaryo URL if different (e.g. `https://your-app.vercel.app`).

4. **Deploy both** apps after saving (Trendaryo + DropEase on Vercel) with these variables.

**Important:** `TRENDARYO_API_KEY` (DropEase) and `DROPEASE_API_KEY` (Trendaryo) must be **identical**. They are two names for the same secret handshake.

**How to test:** Ask a technical friend to call Trendaryo’s sync endpoint with header `x-api-key: your-secret`. Or use Postman (see INTEGRATION_GUIDE.md).

---

### 5D — Error monitoring (optional) — **NEXT_PUBLIC_SENTRY_DSN**

**Used for:** Email alerts when the live site crashes.

1. Go to **https://sentry.io** → sign up.
2. Create a project → platform **Next.js**.
3. Copy the **DSN** (looks like `https://xxx@xxx.ingest.sentry.io/xxx`).
4. Add:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
   ```
5. Installing the full Sentry package is a developer step — the key alone prepares the app.

**Cost:** Free tier for small projects.

---

### 5E — WebSocket (optional) — **NEXT_PUBLIC_WS_URL**

**Used for:** Live order updates in the browser. Default: `ws://localhost:8080` for local dev.

For production you need a real-time server — skip until a developer sets one up.

---

## 6. Putting keys on Vercel (your live website)

After `.env.local` works on your computer, mirror everything on Vercel:

1. Go to **https://vercel.com** → log in.
2. Open your **DropEase** project.
3. Click **Settings** → **Environment Variables**.
4. For **each** line in `.env.local`:
   - **Key:** e.g. `ZAI_API_KEY` (exact spelling, case-sensitive)
   - **Value:** paste the secret
   - **Environment:** check Production, Preview, Development
   - Click **Save**
5. Go to **Deployments** → latest deployment → **⋯** menu → **Redeploy** (so new keys load).

Repeat for **Trendaryo’s** Vercel project with `DROPEASE_API_KEY` and Firebase vars for that app.

---

## 7. Connecting DropEase to Trendaryo

Simple picture:

```
Customer buys on Trendaryo
        ↓
Trendaryo saves order in Firebase
        ↓
DropEase reads/syncs via TRENDARYO_API_URL + matching secret key
        ↓
You fulfill via supplier / automation in DropEase
```

**You must have:**

- Firebase pointing at the correct project (or a agreed sync API)
- Matching secret keys (Section 5C)
- Trendaryo API routes deployed (`/api/automation-sync/...`) — see `INTEGRATION_GUIDE.md`

**Price sync:** DropEase can scrape live prices from trendaryo.com when you run sync from the API — needs your site publicly online.

---

## 8. Optional services (when you are ready)

These are **not** in your `.env.example` yet but are what professionals add for a real shop.

### Email (order confirmations, CRM emails)

| Service | Sign up | What you get |
|---------|---------|----------------|
| **Resend** | https://resend.com | API key, easy for developers |
| **SendGrid** | https://sendgrid.com | API key, free tier |

*Today CRM “Send email” in DropEase is simulated until a developer connects Resend/SendGrid.*

### SMS

| Service | Sign up |
|---------|---------|
| **Twilio** | https://twilio.com → Account SID + Auth Token + phone number |

### Payments (if DropEase charges you for Pro plan)

| Service | Sign up |
|---------|---------|
| **Stripe** | https://dashboard.stripe.com → API keys (publishable + secret) |
| **Razorpay** | For India — https://razorpay.com |

### Shopify (real sync, not mock)

1. https://partners.shopify.com → create partner account (free).
2. Create a **development store** or connect a real store.
3. Create an **app** → get **API key** and **API secret**.
4. OAuth install flow — **requires a developer** to finish in code.

### Shipping (real labels)

| Service | Sign up |
|---------|---------|
| **Shippo** | https://goshippo.com |
| **EasyPost** | https://www.easypost.com |

### Facebook / Google ads (real P&L ad spend)

- Facebook: https://business.facebook.com → Marketing API (advanced)
- Google Ads API (advanced; usually needs developer approval)

---

## 9. Final checklist before you go live

Print this and tick boxes.

### Must have

- [ ] Created `.env.local` from `.env.example`
- [ ] All 6 `NEXT_PUBLIC_FIREBASE_*` values filled from Firebase console
- [ ] `TRENDARYO_API_URL` = your real store URL
- [ ] `TRENDARYO_API_KEY` = same secret as `DROPEASE_API_KEY` on Trendaryo
- [ ] `ZAI_API_KEY` and `GROQ_API_KEY` added and tested
- [ ] Same variables added on **Vercel** for DropEase
- [ ] Redeployed DropEase after adding variables
- [ ] Opened DropEase in browser — login works, no constant errors

### Should have soon

- [ ] `CLOUDFLARE_AI_API_KEY` + `CLOUDFLARE_ACCOUNT_ID`
- [ ] `OPENROUTER_API_KEY` with a little credit (for pricing tool)
- [ ] `HUGGINGFACE_API_KEY` (if you use image features)
- [ ] Confirmed which Firebase project Trendaryo and DropEase share

### Later

- [ ] Real email provider (Resend/SendGrid)
- [ ] Real Shopify / supplier / shipping accounts
- [ ] Sentry DSN for error alerts
- [ ] Vercel Cron for automatic price sync (developer task)

---

## 10. When something breaks

| Symptom | Likely cause | What to do |
|---------|--------------|------------|
| Products/orders never change | Firebase keys missing or wrong project | Redo Section 5A |
| AI buttons return generic / error text | Missing or expired AI key | Check Z.AI / Groq dashboard balance |
| Trendaryo sync does nothing | `TRENDARYO_API_KEY` mismatch or wrong URL | Redo Section 5C; redeploy both apps |
| Works on laptop, not on live site | Vercel env vars not set | Section 6 + Redeploy |
| “Insufficient balance” / 402 errors | That AI provider has no money | Use Z.AI; ignore DeepSeek/Google until paid |

**Get help:** Copy the error message (screenshot or text) and which page you clicked. Share with your developer or paste into Cursor chat.

---

## Quick reference — copy-paste template

See the file **`.env.example`** in this folder for a blank template with every variable name.

**Recommended minimum to start:**

```env
# Firebase (Section 5A)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Trendaryo (Section 5C)
TRENDARYO_API_URL=https://trendaryo.com
TRENDARYO_API_KEY=

# AI — minimum (Section 5B)
ZAI_API_KEY=
GROQ_API_KEY=
```

---

## Related docs in this project

| File | Purpose |
|------|---------|
| `FIREBASE-SETUP.md` | More Firebase detail |
| `TRENDARYO_INTEGRATION_ENV.md` | Trendaryo env vars only |
| `LAUNCH_NOTES.md` | Deploy checklist |
| `INTEGRATION_GUIDE.md` | API endpoints for developers |
| `COMPLETE_PROJECT_CONTEXT.md` | Full technical picture |
| `MISSING_FEATURES_TRACKER.md` | Feature list (scaffold vs real) |

---

**You are not expected to code.** Your job is to **create accounts**, **copy keys** into `.env.local` and **Vercel**, and **keep secrets safe**. A developer (or Cursor agent) connects the optional services (email, Shopify, shipping) when you are ready.

Good luck with Trendaryo and DropEase.
