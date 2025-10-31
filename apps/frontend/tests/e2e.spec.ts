import { test, expect } from '@playwright/test';

test.describe('Sign Language Generator E2E Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await expect(page.locator('h1')).toContainText('手語圖片生成器');
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.getByRole('button', { name: '生成手語圖片' })).toBeVisible();
  });

  test('should show error when submitting empty text', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.getByRole('button', { name: '生成手語圖片' }).click();
    
    // Should show error message
    await expect(page.locator('text=請輸入文字')).toBeVisible();
  });

  test('should generate sign language images for Chinese text', async ({ page }) => {
    // Start backend mock or ensure backend is running
    await page.goto('http://localhost:3000');
    
    // Input Chinese text
    await page.locator('textarea').fill('你好');
    
    // Click generate button
    await page.getByRole('button', { name: '生成手語圖片' }).click();
    
    // Wait for loading to complete
    await expect(page.locator('text=生成中...')).toBeVisible({ timeout: 2000 });
    
    // Should show TSL gloss
    await expect(page.locator('text=TSL Gloss:')).toBeVisible({ timeout: 30000 });
    
    // Should show generated images
    await expect(page.locator('img').first()).toBeVisible({ timeout: 30000 });
    
    // Should show feedback buttons
    await expect(page.getByRole('button', { name: '👍' })).toBeVisible();
    await expect(page.getByRole('button', { name: '👎' })).toBeVisible();
    await expect(page.getByRole('button', { name: '⚠️' })).toBeVisible();
  });

  test('should submit feedback successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Generate images first
    await page.locator('textarea').fill('測試');
    await page.getByRole('button', { name: '生成手語圖片' }).click();
    
    // Wait for images
    await expect(page.locator('img').first()).toBeVisible({ timeout: 30000 });
    
    // Click thumbs up feedback
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: '👍' }).first().click();
    
    // Should show success alert
    await expect(page.locator('text=感謝您的回饋')).toBeVisible({ timeout: 5000 });
  });
});
