Launch Ready — Notes & Checklist

**New — Non-developer guide:** See **`BEGINNER-SETUP-GUIDE.md`** for plain-English steps on every API key, what is still mock, and how to connect Trendaryo. Copy **`.env.example`** → **`.env.local`** and fill it in using that guide.

This branch contains the set of changes prepared to make the project ready for launch (local testing, CI, and Firestore integration mock-ready).

What was added/changed:
- `src/lib/firebase-client.ts` — Firestore client wrapper (mock fallback when envs missing).
- `src/lib/firestore-service.ts` — Minimal get/set wrapper with mock mode.
- `.env.example` — Example Firebase envs to copy for local/Vercel use.
- `src/test/setup.ts` — test setup (already present) to polyfill browser globals for Vitest.
- `dropease/README.md` — updated with launch checklist and Vercel steps.
- `.github/workflows/ci.yml` — CI workflow to run tests on push/PR.
- `package.json` — pragmatic `overrides` for `postcss` to address advisory and some dependency adjustments.

Checklist before pushing to GitHub / Deploying to Vercel
1. Review `LAUNCH_NOTES.md` and `dropease/README.md`.
2. Copy `.env.example` → `.env.local` and fill in real Firebase values, or configure Vercel project envs with the same keys.
3. If you need server admin access, create a Firebase service account and add it as `FIREBASE_SERVICE_ACCOUNT_JSON` in Vercel.
4. Run tests locally: `npm ci && npm test`.
5. Run the branch creation script below to create branch `launch-ready` with the prepared changes.
6. Push branch and open a PR; CI will run tests.

Files to inspect carefully:
- `package.json` — ensure `overrides` are acceptable; consider scheduling a full `next` major upgrade later.
- `postcss.config.mjs` — config updated earlier; review Tailwind/PostCSS integration for your production needs.

Contact:
If anything fails after pushing, copy the failing CI logs here and I will help fix regressions.
