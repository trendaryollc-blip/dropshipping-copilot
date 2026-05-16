# Developer Onboarding

DropEase is a Next.js app that uses TypeScript, Tailwind, Zustand, and Vitest. This file provides the essential steps for new developers.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to preview.

## Key folders

- `src/app/` - Page routes and app-level layouts.
- `src/components/` - Reusable UI components and feature screens.
- `src/lib/` - Service layers, integrations, and helper utilities.
- `src/store/` - Zustand state stores.
- `src/types/` - Shared TypeScript interfaces.
- `src/__tests__/` - Unit tests.

## Connecting stores and integrations

- The app includes Shopify, Amazon, eBay, and Trustpilot integration scaffolds.
- Payment connectors support Stripe and PayPal.
- Ad connectors support Google Ads and Facebook Ads.
- Webhook subscriptions can be registered through `/api/webhooks`.

## Testing and validation

- Run tests with `npm test`.
- Check linting with `npm run lint`.

## Deployment notes

- Deploy to Vercel using the `main` branch.
- Set environment variables in Vercel if you add real API keys or services.
- The public API docs are available at `/api/docs`.
