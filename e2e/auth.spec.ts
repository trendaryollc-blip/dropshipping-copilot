import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/');
    // Should redirect to login page since not authenticated
    await expect(page).toHaveURL(/.*auth\/login/);
    await expect(page.locator('h1, h2').filter({ hasText: /login|sign in/i }).first()).toBeVisible();
  });

  test('should show login form with required fields', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check form elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('button[type="submit"]').click();
    
    // Should show validation messages
    await expect(page.locator('text=required')).toBeVisible();
  });

  test('should have link to register page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check for register/sign up link
    const registerLink = page.locator('a').filter({ hasText: /register|sign up|create account/i });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('href', /register/);
  });
});

test.describe('Dashboard (Authenticated)', () => {
  test.skip(() => true, 'Requires authenticated session - skip until auth setup is configured');

  test('should load dashboard with key metrics', async ({ page }) => {
    await page.goto('/');
    
    // Check for dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();
    await expect(page.locator('text=Orders')).toBeVisible();
  });
});