This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Launch checklist (pre-deploy tasks done for you)

- Tests: Vitest unit tests are included and pass locally. Run `npm test` to verify.
- Environment: `.env.example` added with Firebase / Firestore placeholders — replace with real values before deploying.
- Firestore: lightweight client wrapper at `src/lib/firebase-client.ts` and `src/lib/firestore-service.ts` provide real Firestore calls when envs are present, otherwise return safe mock data.
- CI: GitHub Actions workflow added at `.github/workflows/ci.yml` to run tests on push/PR.

## Deploying to Vercel (steps)

1. Create a Vercel account and link your GitHub repository.
2. Add environment variables in the Vercel project settings by copying values from your Firebase console. Use the keys from `.env.example` (prefix `NEXT_PUBLIC_...`).
3. If you need server-side Firebase admin access, add `FIREBASE_SERVICE_ACCOUNT_JSON` in Vercel secrets (do not store service account JSON in the repo).
4. Deploy from the Vercel dashboard — Vercel will run the build using the `dev`/`build` scripts defined in `package.json`.

## Local testing with mock Firestore

If you do not provide Firebase envs, the app will run in "mock mode" for Firestore (no remote reads/writes). To run locally:

```bash
cp .env.example .env.local
# edit .env.local with real values if you have them, otherwise leave placeholders for mock mode
npm install
npm run dev
```

## Replacing mocks with real credentials

- Replace placeholders in `.env.local` or set environment variables in Vercel project settings.
- For server-side admin operations, create a Firebase service account JSON, then add it as a Vercel secret `FIREBASE_SERVICE_ACCOUNT_JSON` and reference it in server code.

## Notes and recommendations

- I added an `overrides` entry for `postcss` to address a known advisory; this is a pragmatic short-term mitigation. Consider upgrading `next` and related deps on a maintenance window for a long-term fix.
- Run full end-to-end/manual QA after deploying (payments, external integrations, OpenAI API usage), and replace all mock keys.

