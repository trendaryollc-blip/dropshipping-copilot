# 🚀 Vercel Environment Variables — Bulk Import Guide

This guide helps you deploy **DropEase** to Vercel with all environment variables configured in one go.
Vercel supports **bulk importing** environment variables from a `.env`-formatted file.

---

## 📦 Quick Deploy: Copy & Import

### Step 1: Copy the `.env` block below

Select ALL of this text, copy it. This contains every environment variable your app needs, with `replace_this_with_your_key` placeholders for the ones you need to fill in.

```env
# ── 1. GROQ (Order Processing) ──
# Get key: https://console.groq.com/keys
# Free tier: 30 req/min
GROQ_API_KEY=replace_this_with_your_groq_api_key

# ── 2. COHERE (Product Descriptions, Competitor Analysis) ──
# Get key: https://dashboard.cohere.com/api-keys
# Free tier: 100 req/day trial
COHERE_API_KEY=replace_this_with_your_cohere_api_key

# ── 3. DEEPSEEK (SEO Optimization) ──
# Get key: https://platform.deepseek.com/api_keys
# Free tier: ¥5M token free quota
DEEPSEEK_API_KEY=replace_this_with_your_deepseek_api_key

# ── 4. OPENROUTER (Dynamic Pricing) ──
# Get key: https://openrouter.ai/keys
# Free tier: $1 free credit
OPENROUTER_API_KEY=replace_this_with_your_openrouter_api_key

# ── 5. CLOUDFLARE AI (Fraud Detection) ──
# Get key: https://dash.cloudflare.com/profile/api-tokens
# Free tier: 10k req/day
CLOUDFLARE_AI_API_KEY=replace_this_with_your_cloudflare_ai_api_key
CLOUDFLARE_ACCOUNT_ID=replace_this_with_your_cloudflare_account_id

# ── 6. MISTRAL AI (Image Analysis) ──
# Get key: https://console.mistral.ai/api-keys/
# Free tier: 500k tokens free
MISTRAL_API_KEY=replace_this_with_your_mistral_api_key

# ── 7. SERPAPI (Returns & Reviews) ──
# Get key: https://serpapi.com/manage-api-key
# Free tier: 100 searches/month
SERPAPI_API_KEY=replace_this_with_your_serpapi_api_key

# ── 8. ELEVENLABS (Text-to-Speech - optional) ──
ELEVENLABS_API_KEY=replace_this_with_your_elevenlabs_api_key

# ── 9. GOOGLE AI (Fallback for all AI tasks) ──
# Get key: https://aistudio.google.com/app/apikey
# Free tier: 60 req/min (Gemini free tier)
GOOGLE_AI_API_KEY=replace_this_with_your_google_ai_api_key

# ── 10. CJ DROPSHIPPING (Product Sourcing & Fulfillment) ──
CJ_API_KEY=replace_this_with_your_cj_api_key

# ── 11. ALIEXPRESS (Product Research & Pricing) ──
ALIEXPRESS_APP_KEY=replace_this_with_your_aliexpress_app_key
ALIEXPRESS_APP_SECRET=replace_this_with_your_aliexpress_app_secret
ALIEXPRESS_CALLBACK_URL=https://dropshipping-copilot-seven.vercel.app

# ── 12b. ZENDROP (US-Based Dropshipping & Fast Shipping) ──
# Get key: https://www.zendrop.com/ → Dashboard → API
ZENDROP_API_KEY=replace_this_with_your_zendrop_api_key

# ── 12c. SPOCKET (US/EU Suppliers & Branded Invoicing) ──
# Get key: https://www.spocket.co/ → Dashboard → Integrations → API
SPOCKET_API_KEY=replace_this_with_your_spocket_api_key

# ── 12d. MODALYST (Marketplace with Independent Brands) ──
# Get key: https://www.modalyst.co/ → Settings → API
MODALYST_API_KEY=replace_this_with_your_modalyst_api_key

# ── 12e. PRINTFUL (Print-on-Demand & Custom Products) ──
# Get key: https://www.printful.com/ → Settings → API
PRINTFUL_API_KEY=replace_this_with_your_printful_api_key

# ── 12f. SCRAPERAPI (Product Hunting & Competitor Analysis) ──
# Get key: https://www.scraperapi.com/  Free: 5000 API credits/month
SCRAPER_API_KEY=replace_this_with_your_scraperapi_key

# ── 12. RESEND (Transactional Emails) ⚠️ REQUIRED ──
# Get key: https://resend.com/api-keys
# Free tier: 100 emails/day
RESEND_API_KEY=replace_this_with_your_resend_api_key
EMAIL_FROM=DropEase <notifications@dropease.com>

# ── 13. STRIPE (Payments & Subscriptions) ⚠️ REQUIRED ──
# Get keys: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=replace_this_with_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=replace_this_with_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=replace_this_with_your_stripe_webhook_secret

# ── 14. TWILIO (SMS Notifications) ──
# Get creds: https://console.twilio.com
TWILIO_ACCOUNT_SID=replace_this_with_your_twilio_sid
TWILIO_AUTH_TOKEN=replace_this_with_your_twilio_auth_token
TWILIO_FROM_NUMBER=replace_this_with_your_twilio_phone_number

# ── 15. SENTRY (Error Monitoring) ──
# Get DSN: https://sentry.io/settings/projects/
NEXT_PUBLIC_SENTRY_DSN=replace_this_with_your_sentry_dsn

# ── 16. CRON JOBS SECRET ⚠️ SET THIS ──
# Generate a random string: openssl rand -hex 32
CRON_SECRET=replace_this_with_a_random_secret_string

# ── 17. APPLICATION URLs ⚠️ UPDATE THESE ──
NEXT_PUBLIC_APP_URL=https://dropshipping-copilot-seven.vercel.app
NEXT_PUBLIC_SITE_URL=https://dropshipping-copilot-seven.vercel.app

# ── 18. TRENDARYO INTEGRATION (Product Import) ──
TRENDARYO_BASE_URL=https://trendaryo.com
TRENDARYO_API_URL=https://api.trendaryo.com
TRENDARYO_API_KEY=replace_this_with_your_trendaryo_api_key

# ── 19. FIREBASE (Auth & Database) ──
# These are pre-configured for your Firebase project: automation-copilot-62b12
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCuxoy9erTCoB_QYARF724PC513tDWL8jQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=automation-copilot-62b12.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=automation-copilot-62b12
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=automation-copilot-62b12.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=140344348376
NEXT_PUBLIC_FIREBASE_APP_ID=1:140344348376:web:8ff56d66a593eaf6ec11ad
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HCCW1FQET4

# ── 20. FIREBASE SERVICE ACCOUNT (Server-side Auth) ⚠️ REQUIRED ──
# Download from: Firebase Console > Project Settings > Service Accounts > Generate new private key
# Then copy the entire JSON as a single line and paste it here
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"automation-copilot-62b12",...}

# ── 21. VERCEl KV (Rate Limiting) ──
# These are set AUTOMATICALLY when you add the Vercel KV integration
# No need to manually set these
# KV_URL=
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
```

---

### Step 2: Fill in your real API keys

Open a text editor (Notepad, VS Code), paste the text above, and do a **Find & Replace**:
- Replace ALL `replace_this_with_your_...` with your actual keys
- Replace the URLs in section #17 with your actual Vercel domain
- Replace `CRON_SECRET` with a random string
- Replace `FIREBASE_SERVICE_ACCOUNT_KEY` with your full Firebase service account JSON

---

### Step 3: Import into Vercel

1. Go to **[Vercel Dashboard](https://vercel.com)** → Your project → **Settings** → **Environment Variables**
2. Click **"Import .env"** (or **"Bulk Import"**) button
3. **Paste the entire content** from Step 2 into the text field
4. Click **"Import"**
5. Make sure to select all environments:
   - [x] **Production**
   - [x] **Preview**
   - [x] **Development**
6. Click **"Save"**

---

### Step 4: Add Vercel KV (for production rate limiting)

1. Go to **Vercel Dashboard** → **Storage** → **Create Database**
2. Choose **"Upstash Redis"** (or Vercel KV)
3. Select your project and click **"Connect"**
4. Vercel will automatically add `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` to your env vars
5. **Redeploy** your project

---

### Step 5: Deploy

```bash
git add .
git commit -m "Ready for production"
git push
```

Vercel will automatically pick up the changes and deploy.
Or go to your Vercel Dashboard → **Deployments** → **Redeploy**.

---

## 🔑 Where to Get Each API Key

| # | Service | Sign Up URL | What You Need | Free Tier |
|---|---------|------------|---------------|-----------|
| 1 | **Groq** | https://console.groq.com/keys | API Key | 30 req/min |
| 2 | **Cohere** | https://dashboard.cohere.com/api-keys | API Key | 100 req/day |
| 3 | **DeepSeek** | https://platform.deepseek.com/ | API Key | ¥5M tokens |
| 4 | **OpenRouter** | https://openrouter.ai/keys | API Key | $1 credit |
| 5 | **Cloudflare AI** | https://dash.cloudflare.com/ | API Key + Account ID | 10k req/day |
| 6 | **Mistral AI** | https://console.mistral.ai/ | API Key | 500k tokens |
| 7 | **SerpAPI** | https://serpapi.com/ | API Key | 100 searches/mo |
| 8 | **Google AI** | https://aistudio.google.com/ | API Key | 60 req/min |
| 9 | **Resend** | https://resend.com/ | API Key | 100 emails/day |
| 10 | **Stripe** | https://dashboard.stripe.com/ | Secret Key + Publishable Key + Webhook Secret | Pay-as-you-go |
| 11 | **Twilio** | https://console.twilio.com/ | Account SID + Auth Token + Phone # | $15 credit |
| 12 | **Sentry** | https://sentry.io/ | DSN | 5k events/month |
| 13 | **CJ Dropshipping** | https://cjdropshipping.com/ | API Key | Free |
| 14 | **AliExpress** | https://developers.aliexpress.com/ | App Key + Secret | Free |
| 15 | **Zendrop** | https://www.zendrop.com/ | API Key | Free |
| 16 | **Spocket** | https://www.spocket.co/ | API Key | Free |
| 17 | **Modalyst** | https://www.modalyst.co/ | API Key | Free |
| 18 | **Printful** | https://www.printful.com/ | API Key | Free |

---

## ⚠️ Critical: Revoke Old Exposed Keys

The previous `.env` file contained **real API keys** that were committed to the repository.
**IMMEDIATELY revoke and regenerate** these keys from their respective dashboards:

- `GROQ_API_KEY` (was: `[REDACTED]`)
- `COHERE_API_KEY` (was: `[REDACTED]`)
- `DEEPSEEK_API_KEY` (was: `[REDACTED]`)
- `OPENROUTER_API_KEY` (was: `[REDACTED]`)
- `CLOUDFLARE_AI_API_KEY` (was: `[REDACTED]`)
- `MISTRAL_API_KEY` (was: `[REDACTED]`)
- `SERPAPI_API_KEY` (was: `[REDACTED]`)
- `ELEVENLABS_API_KEY` (was: `[REDACTED]`)
- `TRENDARYO_API_KEY` (was: `[REDACTED]`)
- `CJ_API_KEY` (was: `[REDACTED]`)
- `ALIEXPRESS_APP_KEY` (was: `[REDACTED]`)
- `ALIEXPRESS_APP_SECRET` (was: `[REDACTED]`)

> ⚠️ The Firebase API key is public by design (it's a client-side SDK key restricted by Firebase config), so it does NOT need to be revoked.

---

## ✅ Verification Checklist

After deploying, confirm everything works:

- [ ] Visit `https://your-domain.vercel.app/api/health` — should return `"status": "healthy"` or `"degraded"`
- [ ] Visit `https://your-domain.vercel.app/sitemap.xml` — should return valid XML with your domain
- [ ] Visit `https://your-domain.vercel.app/auth/login` — login form should render
- [ ] Login page links to Terms & Privacy pages
- [ ] 404 page renders styled error (not blank)
- [ ] Run: `npx playwright test` — E2E tests pass

---

## 🛠 Troubleshooting

**Build fails with "accountSid must start with AC"**
→ Twilio credentials are placeholders. Either set real ones or leave them empty — code now handles missing creds gracefully.

**Cron jobs return 401**
→ `CRON_SECRET` doesn't match between `.env` and `vercel.json`. Make sure they're the same value.

**"Cannot find module '@vercel/kv'"**
→ Run `npm install @vercel/kv` locally (already done) and redeploy.

**Emails not sending**
→ Set `RESEND_API_KEY` to a valid key. Check Resend dashboard for delivery logs.