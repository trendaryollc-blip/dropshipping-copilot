import { test, expect } from '@playwright/test'

test('homepage loads and can navigate to orders', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/DropEase/)
  await expect(page.getByText('Order Tracker')).toBeVisible()
  await page.click('text=Order Tracker')
  await expect(page).toHaveURL(/orders/)
  await expect(page.getByRole('heading', { name: 'Order Tracker' })).toBeVisible()
})
