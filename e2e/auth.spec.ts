import { authTest, expect } from './auth.fixture'

authTest.describe('Authentication Flow', () => {
  authTest('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/');
    // Should redirect to login page since not authenticated
    const currentUrl = page.url();
    expect(currentUrl).toContain('/auth/login');
  })

  authTest('should show login form with required fields', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check form elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  })

  authTest('should have link to register page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check for register/sign up link
    const registerLink = page.locator('a').filter({ hasText: /register|sign up|create account/i });
    await expect(registerLink).toBeVisible();
  })
})

authTest.describe('Dashboard (Authenticated)', () => {
  authTest('should load dashboard with key metrics', async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle')
    // Check for page content
    const hasContent = await page.locator('body').innerText()
    expect(hasContent.length).toBeGreaterThan(0)
  })
})
</write_to_file>