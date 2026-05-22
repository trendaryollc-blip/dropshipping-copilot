# Trendaryo API bridge (copy into trendaryo.com project)

DropEase calls `https://trendaryo.com/api/automation-sync/*` with header `x-api-key`.

## Which guide to use?

| Your Trendaryo project looks like… | Use |
|-----------------------------------|-----|
| HTML pages + `api` / `backend` / `js` folders | **`README-HTML-SITE.md`** + `express/automation-sync.js` |
| Next.js with `app/` folder | Copy `app/api/automation-sync/` below |
| Next.js with only `pages/` folder | Ask for `pages/api` version |

**Do not create an `app` folder** if your site is HTML + Node (see README-HTML-SITE.md).

---

## Next.js App Router (only if you have `app/` already)

## 1. Add env on Trendaryo (Vercel)

| Name | Value |
|------|--------|
| `DROPEASE_API_KEY` | Same as `TRENDARYO_API_KEY` in DropEase `.env.local` (see `secrets/dropease-trendaryo-api-key.txt`) |

Also ensure Firebase Admin can write to Trendaryo Firestore (service account JSON or Vercel integration).

## 2. Copy API routes

Copy the folder `trendaryo-bridge/app/api/automation-sync/` into your **Trendaryo** Next.js repo under `app/api/automation-sync/`.

## 3. Install firebase-admin (Trendaryo project only)

```bash
npm install firebase-admin
```

Set one of:

- `FIREBASE_SERVICE_ACCOUNT_JSON` — full service account JSON string (Vercel env), or
- `GOOGLE_APPLICATION_CREDENTIALS` — path to JSON file (local)

## 4. Redeploy Trendaryo, then test from DropEase

```bash
curl -H "x-api-key: YOUR_KEY" https://trendaryo.com/api/automation-sync/products
```

Or run DropEase dev server and open `GET /api/trendaryo/test-connection`.
