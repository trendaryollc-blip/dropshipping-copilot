# Your Trendaryo `api` folder — what it means

You described something like this:

```
api/
  automation-sync     ← file OR folder
  index               ← file
  orders/             ← folder
    id                ← file (should be named [id].js on Vercel)
  products/           ← folder
    id                ← file
```

That is a **serverless API** layout (Vercel / similar). **Do not create an `app` folder.**

---

## What DropEase needs (exact URLs)

| What DropEase calls | URL on trendaryo.com |
|---------------------|----------------------|
| List products | `GET /api/automation-sync/products` |
| Update one product | `PATCH /api/automation-sync/products/PRODUCT_ID` |
| List orders | `GET /api/automation-sync/orders` |
| Create order | `POST /api/automation-sync/orders` |
| Update order | `PATCH /api/automation-sync/orders/ORDER_ID` |

Everything must start with **`/api/automation-sync/`** (not only `/api/products/`).

---

## Target folder layout (copy from DropEase)

After setup, Trendaryo `api` should look like:

```
api/
  _lib/
    check-api-key.js
    firebase.js
  automation-sync/
    products.js
    products/
      [id].js          ← name must be [id].js not id.js
    orders.js
    orders/
      [id].js
```

Copy from DropEase project:

`dropshipping-copilot/trendaryo-bridge/vercel-api/`

Paste **into** Trendaryo’s `api/` folder (merge with what you have).

---

## What to do with your OLD files

| Your existing item | Action |
|--------------------|--------|
| `api/index.js` | Keep if your site uses it for other things |
| `api/automation-sync` (old file) | Open it — if empty or broken, delete after new folder works |
| `api/products/` + `api/orders/` at **top level** | Wrong URL for DropEase — keep for store site if needed, but DropEase uses `api/automation-sync/products` |
| File named `id` inside folders | Rename to **`[id].js`** (brackets matter on Vercel) |

---

## Steps (order matters)

1. Open DropEase → `trendaryo-bridge/vercel-api/` → copy whole folder contents into Trendaryo `api/`.
2. Rename any `id` file to `[id].js` under `products` and `orders`.
3. Add to Trendaryo `.env`: `DROPEASE_API_KEY=...` (same as DropEase key).
4. `npm install firebase-admin` in Trendaryo folder.
5. Deploy / restart Trendaryo.
6. Test: DropEase `npm run dev` → `http://localhost:3000/api/trendaryo/test-connection`
