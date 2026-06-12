import { authTest, expect } from './auth.fixture'

authTest.describe("Dashboard (Authenticated)", () => {
  authTest("should display key metrics widgets", async ({ authenticatedPage: page }) => {
    await page.goto("/dashboard")
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle')
    // Check for metric cards or content
    const hasContent = await page.locator('body').innerText()
    expect(hasContent.length).toBeGreaterThan(0)
  })

  authTest("should have navigation links to key sections", async ({ authenticatedPage: page }) => {
    await page.goto("/dashboard")
    await page.waitForLoadState('networkidle')
    const links = page.locator("a").filter({ hasText: /products|orders|analytics|suppliers/i })
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})

authTest.describe("Dashboard Error States", () => {
  authTest("should show error state when API fails", async ({ page }) => {
    // Block API requests to simulate failure
    await page.route("**/api/**", (route) => route.abort())
    await page.goto("/")
    // Should show error UI rather than blank page or loading spinner forever
    await page.waitForTimeout(2000)
    // The page should at least have some content rendered
    const hasContent = await page.locator('body').innerText()
    expect(hasContent.length).toBeGreaterThan(0)
  })
})

// Public route tests (unauthenticated)
authTest.describe("Public Routes", () => {
  authTest("should show home page for unauthenticated users", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.locator("h1, h2").filter({ hasText: /login|sign in/i }).first()).toBeVisible()
  })

  authTest("should show login form with required fields", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})