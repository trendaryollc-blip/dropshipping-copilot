import { test, expect } from '@playwright/test'

test.describe("Orders Page", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/orders")
    const currentUrl = page.url()
    expect(currentUrl).toContain("/auth/login")
  })

  test("login page should be accessible", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})