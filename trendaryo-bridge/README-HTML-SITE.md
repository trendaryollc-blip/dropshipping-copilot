# Trendaryo HTML + Node site (your setup)

Your Trendaryo folder has **HTML pages** + **`api`** / **`backend`** — not Next.js.

**Do NOT create an `app` folder.** Use the Express file below.

---

## Step 1 — Copy one file into Trendaryo

**From (DropEase project):**

`trendaryo-bridge/express/automation-sync.js`

**To (Trendaryo project):**

`api/automation-sync.js`

(If you already have an `api` folder, put it there. If your server code lives in `backend`, use `backend/automation-sync.js` instead.)

---

## Step 2 — Connect it in your main server file

Find the file that **starts your Node server** (often one of these):

- `backend/server.js`
- `backend/index.js`
- `js/server.js`
- `api/index.js`
- `server.js` (root)

Open it and add **near the top** (after `require('dotenv').config()` if you have it):

```javascript
const automationSync = require('./api/automation-sync')
// OR if file is in backend folder:
// const automationSync = require('./automation-sync')
```

Add **after** you create `const app = express()`:

```javascript
app.use('/api/automation-sync', automationSync)
```

**Adjust the path** in `require(...)` so it matches where you saved `automation-sync.js`.

---

## Step 3 — Add the API key to Trendaryo `.env`

Open Trendaryo's **`.env`** file (same folder as `package.json` or root).

Add this line (use the key from DropEase `secrets/dropease-trendaryo-api-key.txt`):

```env
DROPEASE_API_KEY=de_yOgcXdY71eSd1O1f0X9wgG4uXPLx3-Si3l80-3NuENA
```

Save the file. Restart the Trendaryo server after changing `.env`.

---

## Step 4 — Firebase Admin (if not already set up)

In Trendaryo folder terminal:

```bash
npm install firebase-admin
```

In `.env`, add Firebase service account JSON **or** point to a key file your project already uses.

Example (JSON as one line in `.env` — common on hosting):

```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

(Use the real JSON from Firebase Console → Project settings → Service accounts → Generate key.)

---

## Step 5 — Deploy / restart

1. Restart local server, **or**
2. Redeploy to wherever trendaryo.com runs (Vercel, VPS, etc.)
3. On hosting panel, add env var **`DROPEASE_API_KEY`** with the same key value.

---

## Step 6 — Test

Browser or curl:

```
https://trendaryo.com/api/automation-sync/products
```

Header: `x-api-key: YOUR_DROPEASE_API_KEY`

You should get JSON (product list) or `401` if the key is wrong.

From DropEase: `npm run dev` → open `http://localhost:3000/api/trendaryo/test-connection`
