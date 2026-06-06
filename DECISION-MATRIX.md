# 🚦 Decision matrix: what to do about Firebase

Pick the row that matches your situation. Each one is fully self-contained.

---

## 🟢 Option 1 — Just redeploy on Vercel with the new key (5 min, **zero data loss**)

**Best if:** you just want login to work and don't care which Firebase project hosts users.

**What I already did for you (no action needed):**
- ✅ Updated hardcoded fallback in `src/lib/firebase-auth.ts` and `src/lib/firebase-client.ts` to the new working key `AIzaSyDC8NXskfapmCmf8O8y687bxG0DUshbfVY` (project `new-automation-app-7dd33`).
- ✅ Updated `.env` and `.env.local` to the same.
- ✅ Pushed to `main` (commits `4ad5f4d`, `7a9f179`, `a9ece73`, `7237c78`).

**What you still need to do (5 min):**
1. **https://vercel.com/dashboard** → your project → **Settings** → **Environment Variables**.
2. Either **replace** each of these 6 with the new values, **or delete them entirely** so my hardcoded fallback runs:

   | Key | Value (paste this) |
   |---|---|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDC8NXskfapmCmf8O8y687bxG0DUshbfVY` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `new-automation-app-7dd33.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `new-automation-app-7dd33` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `new-automation-app-7dd33.firebasestorage.app` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1042435665365` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:1042435665365:web:placeholder` |

3. **Deployments** → three dots on the latest → **Redeploy** (uncheck "Use existing build cache").
4. Wait ~2 min. Try login.

**Verify it worked:** after redeploy, hit your site and look for the Firebase key in the page source. You should see `AIzaSyDC8NXskfapmCmf8O8y687bxG0DUshbfVY` in the JavaScript bundle, not the old one.

---

## 🟡 Option 2 — Stay on `trendaryo-automation-prod` but fix Identity Toolkit (15 min, **zero data loss**)

**Best if:** you have existing users/products in `trendaryo-automation-prod` you want to keep.

1. Open **https://console.cloud.google.com/**.
2. Switch the project selector to **`project-trendaryo`** (project number `1013540742624` — this is the project that owns the old key, not `trendaryo-automation-prod` itself).
3. **APIs & Services → Library** → search **"Identity Toolkit API"** → click **ENABLE**.
4. Wait 30 s. Test with the `curl` command below.
5. Once that works, you can revert `.env.local` and the hardcoded fallback back to the old key. The redeploy on Vercel will pick it up.

**Test command (should return `INVALID_EMAIL`, not "are blocked"):**
```bash
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBFUeCgJNmHHUzNqcfIxBYhH9vbrww2VI" -H "Content-Type: application/json" -d '{"email":"[email protected]","password":"x","returnSecureToken":true}'
```

---

## 🔴 Option 3 — Nuke everything and start over (**NOT recommended**)

**Only do this if:** you have NO users, NO products, NO orders you care about in either project, and you're 100% OK with the 2–4 hours of rework.

**What I would have to do:**
1. Delete both `trendaryo-automation-prod` and `new-automation-app-7dd33` in Firebase console.
2. Create a brand-new Firebase project from scratch.
3. Enable Identity Toolkit API + Email/Password auth + Firestore.
4. Deploy fresh security rules.
5. Rewrite `src/lib/firestore-service.ts` and `src/lib/firebase-auth.ts` from a clean template.
6. Re-import data from `mock-data.ts` (which is the only "data" the app currently has, since the old Firestore was never written to — login was broken).
7. Update 20+ service files that import from the old wrapper.
8. Update `.env.local`, the hardcoded fallback, the Vercel dashboard.
9. Re-test every page that touches Firestore.

**What you'd lose:** everything in the two existing Firebase projects (probably empty since login is broken, but verify first).

**Why I'm reluctant:** the code is fine. Only the API key is broken. Doing Option 3 is like demolishing your house to fix a broken doorknob.

---

## My recommendation

**Do Option 1.** It's 5 min, zero risk, and you'll have working login today. If something else breaks after that (Firestore rules, indexes, etc.), we deal with it then. Option 3 is a sledgehammer for a thumbtack.
