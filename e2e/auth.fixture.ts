/**
 * Playwright auth fixture for E2E tests.
 * 
 * Uses Firebase REST API to sign in with test credentials and set the auth session cookie.
 * This allows authenticated tests to run without manual setup.
 * 
 * Usage: Import `authTest` instead of `test` from Playwright.
 */

import { test as base } from '@playwright/test';

// Test user credentials — set these in your CI environment variables
const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'demo@dropease.com';
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || '';

export type AuthFixtures = {
  authenticatedPage: import('@playwright/test').Page;
};

/**
 * Extended test that auto-authenticates before running.
 */
export const authTest = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Skip auth if no test password is configured
    if (!TEST_PASSWORD) {
      console.warn('[AuthFixture] E2E_TEST_PASSWORD not set. Skipping authentication.');
      console.warn('[AuthFixture] Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD environment variables.');
      // Still run the test, it will be redirected to login
      await use(page);
      return;
    }

    try {
      // Use Firebase REST API to sign in
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        console.warn('[AuthFixture] NEXT_PUBLIC_FIREBASE_API_KEY not set. Cannot authenticate.');
        await use(page);
        return;
      }

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.warn(`[AuthFixture] Firebase auth failed: ${data.error?.message || 'unknown error'}`);
        await use(page);
        return;
      }

      // Set the auth token cookie that the middleware expects
      await page.context().addCookies([
        {
          name: '__session',
          value: data.idToken,
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          sameSite: 'Lax' as const,
        },
      ]);

      // Set localStorage token for client-side auth
      await page.goto('/');
      await page.evaluate((token: string) => {
        localStorage.setItem('authToken', token);
      }, data.idToken);
    } catch (error) {
      console.warn(`[AuthFixture] Failed to authenticate: ${(error as Error).message}`);
    }

    await use(page);
  },
});

export { expect } from '@playwright/test';
