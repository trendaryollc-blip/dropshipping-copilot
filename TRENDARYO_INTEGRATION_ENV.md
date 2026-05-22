# Trendaryo ↔ DropEase API key setup

## Keys (must match on both apps)

| App | Env variable | Purpose |
|-----|----------------|---------|
| **DropEase** (this repo) | `TRENDARYO_API_KEY` | Sends `x-api-key` when calling Trendaryo |
| **Trendaryo** (trendaryo.com) | `DROPEASE_API_KEY` | Validates incoming `x-api-key` |

Use the **same secret string** for both. Current key is stored in:

- `.env.local` → `TRENDARYO_API_KEY`
- `secrets/dropease-trendaryo-api-key.txt` (git-ignored)

Regenerate anytime:

```bash
npm run setup:trendaryo-key
```

## DropEase `.env.local`

```env
TRENDARYO_API_URL=https://trendaryo.com
TRENDARYO_API_KEY=<same-as-DROPEASE_API_KEY-on-trendaryo>
```

## Trendaryo (Vercel)

1. Project → **Settings** → **Environment Variables**
2. Add `DROPEASE_API_KEY` = value from `secrets/dropease-trendaryo-api-key.txt`
3. Deploy API routes from `trendaryo-bridge/` (see `trendaryo-bridge/README.md`)
4. Redeploy

## Test connection

With DropEase running (`npm run dev`):

```
GET http://localhost:3000/api/trendaryo/test-connection
```

Or:

```bash
curl -H "x-api-key: YOUR_KEY" https://trendaryo.com/api/automation-sync/products
```

## API endpoints (on Trendaryo)

| Method | Path |
|--------|------|
| GET | `/api/automation-sync/products` |
| PATCH | `/api/automation-sync/products/:id` |
| GET | `/api/automation-sync/orders` |
| POST | `/api/automation-sync/orders` |
| PATCH | `/api/automation-sync/orders/:id` |
