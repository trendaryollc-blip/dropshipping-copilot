import { test, expect } from '@playwright/test'

test.describe("Products Page", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/products")
    // Should be redirected to login
    const currentUrl = page.url()
    expect(currentUrl).toContain("/auth/login")
  })

  test("login page should be accessible", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.locator("h1, h2").first()).toBeVisible()
  })
})
</write_to_file>