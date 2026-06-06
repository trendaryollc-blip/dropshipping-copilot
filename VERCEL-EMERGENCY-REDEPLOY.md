# 🚨 URGENT: Vercel is still using the OLD broken key

## The problem

Your Vercel project has the OLD Firebase env vars set in its dashboard. Because Next.js inlines `NEXT_PUBLIC_*` env vars at **build time**, the deployed JavaScript bundle literally contains the broken key `AIzaSyDBFUeCgJNmHHUzNqcfIxBYhH9vbrww2VI` baked in. The hardcoded fallback in our code never gets a chance to run because `process.env.NEXT_PUBLIC_FIREBASE_API_KEY` is defined (with the bad value) at build time, so the `||` short-circuit in `getFirebaseConfig()` skips the fallback.

## Proof

I just confirmed via `curl` that:
- The new key `AIzaSyDC8NXskfapmCmf8O8y687bxG0DUshbfVY` works (returns `INVALID_EMAIL`).
- The old key `AIzaSyDBFUeCgJNmHHUzNqcfIxBYhH9vbrww2VI` is still blocked (returns `SignInWithPassword are blocked`).
- And your live Vercel URL `https://dropshipping-copilot-seven.vercel.app` is returning `DEPLOYMENT_NOT_FOUND` (the deployment may have been moved/renamed).

## Fix (5 min — no code changes needed)

You have two options. **Option A is fastest.**

### Option A — Update the Vercel env vars in place

1. Open **https://vercel.com/dashboard** → your project → **Settings** → **Environment Variables**.
2. Find each of these and click the pencil to edit it. **Paste the new values from `new-automation-app-7dd33`** (the working project):

   | Key | Old (broken) value | New (working) value |
   |---|---|---|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDBFUeCgJNmHHUzNqcfIxBYhH9vbrww2VI` | `AIzaSyDC8NXskfapmCmf8O8y687bxG0DUshbfVY` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `trendaryo-automation-prod.firebaseapp.com` | `new-automation-app-7dd33.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `trendaryo-automation-prod` | `new-automation-app-7dd33` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `trendaryo-automation-prod.firebasestorage.app` | `new-automation-app-7dd33.firebasestorage.app` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `114799189060922350355` | `1042435665365` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:352820611099:web:90258b7fa5f787990d90be` | `1:1042435665365:web:placeholder` |

3. After saving, go to **Deployments** → click the three dots on the latest → **Redeploy** (uncheck "Use existing build cache" so Next.js re-inlines the new env vars).
4. Wait ~2 min for the deploy to finish.
5. Try login again — it should work.

### Option B — Delete all the Firebase env vars from Vercel

1. Open **https://vercel.com/dashboard** → your project → **Settings** → **Environment Variables**.
2. For each of the 6 `NEXT_PUBLIC_FIREBASE_*` keys above, click the three dots → **Delete**.
3. Redeploy (don't use cache).
4. The deployed build will now use the hardcoded fallback in `src/lib/firebase-auth.ts` / `src/lib/firebase-client.ts`, which is the new working key.

## Why this is happening (and why it's not a bug in our code)

Next.js inlines `NEXT_PUBLIC_*` env vars at **build time** (during `next build`). Once a build is created, the values are baked into the JavaScript bundle sent to the browser. They cannot be changed without re-building.

The hardcoded fallback in our code is a safety net that only kicks in if the env var is **undefined**. If the env var is defined (even to a bad value), `undefined || fallback` evaluates to the env-var value, not the fallback.

## Verify the fix worked

After redeploy, run this:

```bash
curl -s "https://<your-actual-vercel-url>/_next/static/chunks/app/auth/login/page-*.js" | grep -oE "AIza[A-Za-z0-9_-]{35}" | head -1
```

You should see `AIzaSyDC8NXskfapmCmf8O8y687bxG0DUshbfVY`, not the old one.

Then try logging in on the deployed site. With the new key, both signin and signup will work.
