import { test, expect } from '@playwright/test'

test.describe('Sign Language Translation', () => {
  test('should display homepage with title', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('文字轉手語網站')
  })

  test('should have input form and button', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()
    
    const button = page.locator('button[type="submit"]')
    await expect(button).toBeVisible()
    await expect(button).toContainText('生成手語圖片')
  })

  test('should enable submit button when text is entered', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.locator('textarea')
    const button = page.locator('button[type="submit"]')
    
    await expect(button).toBeDisabled()
    
    await textarea.fill('你好')
    await expect(button).toBeEnabled()
  })

  // This test requires mock or actual API
  test.skip('should translate text and show result', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.locator('textarea')
    const button = page.locator('button[type="submit"]')
    
    await textarea.fill('我喜歡學習手語')
    await button.click()
    
    // Wait for loading to complete
    await page.waitForSelector('text=正在生成手語圖片...', { state: 'hidden', timeout: 30000 })
    
    // Check if result is displayed
    await expect(page.locator('text=原始文字')).toBeVisible()
    await expect(page.locator('text=TSL Gloss')).toBeVisible()
    await expect(page.locator('text=手語圖片')).toBeVisible()
  })
})
