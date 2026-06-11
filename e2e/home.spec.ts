import { test, expect } from '@playwright/test'

test.describe('Home Page (Landing)', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    const title = await page.title()
    expect(title).toContain('DropEase')
  })

  test('should have navigation to auth pages', async ({ page }) => {
    await page.goto('/')
    const signInButton = page.locator('a').filter({ hasText: /sign in/i })
    await expect(signInButton.first()).toBeVisible()
  })

  test('should display features section', async ({ page }) => {
    await page.goto('/')
    const featuresLink = page.locator('a[href="#features"]')
    await expect(featuresLink.first()).toBeVisible()
  })
})
</write_to_file>