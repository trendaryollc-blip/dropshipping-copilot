# Firebase Login Troubleshooting — `API_KEY_SERVICE_BLOCKED` / `SignInWithPassword are blocked`

**The error you're seeing:**
> Firebase: Error (auth/requests-to-this-api-identitytoolkit-method-google.cloud.identitytoolkit.v1.authenticationservice.signinwithpassword-are-blocked.)

**Plain-English meaning:** Google is rejecting your login request *before it ever hits the Firebase Auth backend*. The API key you're using is blocked from calling the `identitytoolkit` `SignInWithPassword` method.

This is **NOT a bug in your code** — it's a configuration issue inside Google Cloud Console. There are two possible causes and two fixes; try them in order:

---

## Cause 1 (most common): the Identity Toolkit API is disabled

The Firebase project that owns your API key has the `identitytoolkit.googleapis.com` API turned off.

### Fix — enable it (2 min)

1. Open **https://console.cloud.google.com/** in the browser.
2. At the top of the page, switch the project selector to the project your API key belongs to. The error said `consumer: projects/1013540742624` — that's **`project-trendaryo`** (number `1013540742624`). So switch to that one.
   - If you're not sure, you can also try the project your `.env.local` points to: **`trendaryo-automation-prod`**.
3. In the left sidebar go to **APIs & Services → Library** (or click here: <https://console.cloud.google.com/apis/library>).
4. In the search box type **`Identity Toolkit API`**.
5. Click the result, then click the blue **ENABLE** button. Wait ~30 s for it to propagate.
6. Try the login again. It should now work.

---

## Cause 2: your API key has restrictions that block Identity Toolkit

If the API is already enabled but the error persists, the API key itself has an "API restrictions" list that doesn't include Identity Toolkit.

### Fix — allow Identity Toolkit on the key (2 min)

1. Open **https://console.cloud.google.com/apis/credentials** (with the same project selected).
2. Under **API Keys**, find the key that matches the `apiKey` value in your `.env.local` (your key starts with `AIzaSyDBFUeCgJNmHHUzNqcfIxBYhH9vbrww2VI`).
3. Click the key name to edit it.
4. Scroll to **API restrictions**.
5. Select either:
   - **Don't restrict key** (easy, but less secure), OR
   - **Restrict key** → then add **`Identity Toolkit API`** to the list of allowed APIs.
6. Click **Save**. Wait ~30 s.
7. Try the login again.

---

## Cause 3 (less common): the API key belongs to the wrong project

The error response had `consumer: projects/1013540742624`. Looking at the Firebase CLI project list, `1013540742624` is **`project-trendaryo`**, while your `.env.local` says your `authDomain`/`projectId` is **`trendaryo-automation-prod`** (number `352820611099`).

That means your **API key was created in `project-trendaryo`** but is being sent to **`trendaryo-automation-prod`**'s auth backend. The key is being rejected because Identity Toolkit isn't enabled in the project that owns the key.

**You have two options:**

### Option A — fix `project-trendaryo` (the project that owns the key)

Follow Cause 1 and Cause 2 above, but make sure you're in the **`project-trendaryo`** project (number `1013540742624`) when you do it. This is the fastest fix because it doesn't require changing any code.

### Option B — switch to a key that belongs to `trendaryo-automation-prod`

1. Open the Firebase console for **`trendaryo-automation-prod`**: <https://console.firebase.google.com/project/trendaryo-automation-prod/settings/general>
2. Scroll to **Your apps → Web app** → click the gear / config icon.
3. Copy the `apiKey` from the config snippet. It will start with `AIza…` but will be a *different* value from the one currently in `.env.local`.
4. Replace `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local` (and the hardcoded fallback in `src/lib/firebase-auth.ts`) with this new value.
5. Re-deploy.

---

## How to verify the fix worked

After enabling the API / fixing the key, run this from your terminal:

```bash
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBFUeCgJNmHHUzNqcfIxBYhH9vbrww2VI" \
  -H "Content-Type: application/json" \
  -d '{"email":"[email protected]","password":"any","returnSecureToken":true}'
```

You should now get a **`INVALID_LOGIN_CREDENTIALS`** error (because `[email protected]` doesn't exist) instead of the `are blocked` error. If you get `INVALID_LOGIN_CREDENTIALS`, the API is now working — your real users can sign up/sign in normally.

---

## Still stuck?

Open the browser DevTools → Network tab → try logging in → click the failed request to `identitytoolkit.googleapis.com` → check the **response** JSON. The `error.message` field will say exactly which API or restriction is blocking you.

If you'd rather not touch the Google Cloud Console, I can also build a tiny `/api/health/firebase` endpoint that does this check automatically on every Vercel deploy and surfaces the error on the dashboard — let me know.
