# 🚀 Production Go-Live Checklist — One-Click Away From Live

**Status:** ✅ All code is written, built, verified, and pushed to GitHub.  
**What's left:** Only manual configuration steps that require **YOUR API keys and accounts**.

---

## ⏱️ Estimated Time: 30-45 Minutes

---

## ▢ Step 1: Set Environment Variables in Vercel (10 min)

Go to [Vercel Dashboard](https://vercel.com) → Your Project → **Settings → Environment Variables**

Add ALL of these (use the `.env.example` file as reference):

### 🔴 Required (App Will Not Work Without These)
| Variable | What It Is | Where To Get It |
|----------|-----------|-----------------|
| `TRENDARYO_API_KEY` | Shared secret between DropEase & Trendaryo | **You choose** — generate a random string like `openssl rand -hex 32` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Firebase Console → Authentication |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Firebase Console → Storage |

### 🟡 AI Providers (Needed for AI Features to Be Real)
| Variable | Free? | Where To Get It |
|----------|-------|-----------------|
| `ZAI_API_KEY` | ✅ Yes (free quota) | [Zhipu AI (Z.AI) Console](https://open.bigmodel.cn/) — Register, create API key |
| `GROQ_API_KEY` | ✅ Yes (free tier) | [Groq Console](https://console.groq.com/) — Register, create API key |
| `CLOUDFLARE_AI_API_KEY` | ✅ Yes (free tier) | Cloudflare Dashboard → Workers & Pages → AI |
| `CLOUDFLARE_ACCOUNT_ID` | ✅ Yes | Cloudflare Dashboard → Right side under "Account ID" |
| `HUGGINGFACE_API_KEY` | ✅ Yes (free tier) | [Hugging Face](https://huggingface.co/settings/tokens) |
| `OPENROUTER_API_KEY` | ⚠️ Limited free credits | [OpenRouter](https://openrouter.ai/keys) |

### 🟢 Communication (For Real Email/SMS)
| Variable | Free? | Where To Get It |
|----------|-------|-----------------|
| `RESEND_API_KEY` | ✅ Yes (100 emails/day free) | [Resend](https://resend.com) → API Keys |
| `TWILIO_ACCOUNT_SID` | 💰 Paid (small cost per SMS) | [Twilio Console](https://console.twilio.com) |
| `TWILIO_AUTH_TOKEN` | 💰 Paid | Twilio Console |
| `TWILIO_PHONE_NUMBER` | 💰 Paid | Buy a number from Twilio |

### 🔵 Production & Monitoring
| Variable | Free? | Where To Get It |
|----------|-------|-----------------|
| `CRON_SECRET` | ✅ **Choose any strong password** | You generate this yourself (e.g. `my-secret-cron-token-123`) |
| `ADMIN_EMAIL` | ✅ Your own email | Your email address (for receiving low stock alerts) |

---

## ▢ Step 2: Set the Same API Key in Trendaryo (5 min)

DropEase and Trendaryo need to share a **matching API key** to communicate:

1. Go to your **Trendaryo project** on Vercel
2. Add environment variable: `DROPEASE_API_KEY` = **same value** as `TRENDARYO_API_KEY` from Step 1
3. **Deploy Trendaryo** so the env var takes effect

---

## ▢ Step 3: Deploy DropEase to Vercel (5 min)

```bash
# Option A: Auto-deploy from GitHub
# Go to https://vercel.com → Import Project → Select "dropshipping-copilot" → Deploy

# Option B: Manual deploy from your computer
npm run build
npx vercel --prod
```

---

## ▢ Step 4: Deploy Firestore Security Rules (2 min)

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

---

## ▢ Step 5: Configure Vercel Cron Jobs (2 min)

**Important:** Cron jobs require a **Vercel Hobby** (free) or **Pro** plan.

1. Go to Vercel Dashboard → Your Project → **Settings → Cron Jobs**
2. Add these 3 jobs:

| Cron Job | Schedule | Endpoint |
|----------|----------|----------|
| Sync Prices | Every 6 hours | `https://your-app.vercel.app/api/cron/sync-prices` |
| Check Automation Rules | Every 15 minutes | `https://your-app.vercel.app/api/cron/check-automation-rules` |
| Check Low Stock | Every 12 hours | `https://your-app.vercel.app/api/cron/check-low-stock` |

3. Add `Authorization: Bearer YOUR_CRON_SECRET` header to each

---

## ▢ Step 6 (Optional): Set Up Stripe for Payments (15 min)

If you want to accept payments for DropEase Pro subscriptions:

1. Create a [Stripe Account](https://stripe.com)
2. Get your **Publishable Key** and **Secret Key** from Stripe Dashboard
3. Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` in Vercel

---

## ▢ Step 7 (Optional): Install Sentry for Error Monitoring (2 min)

```bash
npm install @sentry/nextjs
```

Then set `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_AUTH_TOKEN` in Vercel env vars.

---

## 📋 Quick Visual Reference

```
┌─────────────────────────────────────────────────────────┐
│                  ONE-Click Go-Live                       │
│                                                          │
│  Step 1 ─── Set 15+ env vars in Vercel ─── 10 min     │
│  Step 2 ─── Set DROPEASE_API_KEY in Trendaryo ── 5 min│
│  Step 3 ─── Deploy DropEase to Vercel ────── 5 min     │
│  Step 4 ─── Deploy Firestore rules ───────── 2 min     │
│  Step 5 ─── Configure 3 Cron Jobs ────────── 2 min     │
│  Step 6 ─── (Opt) Set up Stripe ──────────── 15 min    │
│  Step 7 ─── (Opt) Install Sentry ─────────── 2 min     │
│                                                          │
│  ⏱️ TOTAL: 30-45 minutes                              │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ After You Complete These Steps

Your DropEase Copilot will be **fully live in production** with:
- ✅ Real AI-powered product descriptions, SEO, fraud detection, pricing
- ✅ Real email notifications (order confirmations, abandoned cart)
- ✅ Real SMS alerts (order updates, low stock)
- ✅ Automatic price syncing with Trendaryo
- ✅ Auto-fulfillment engine (processes orders automatically)
- ✅ Health monitoring and error tracking
- ✅ Revenue and profit dashboards using real data
- ✅ 3 automated cron jobs running 24/7

**You're literally one config step away from going live.** 🚀