import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');

  // 等待页面加载
  await page.waitForLoadState('networkidle');

  // 验证页面标题存在
  const title = await page.title();
  expect(title).toBeTruthy();
});

test('page loads successfully', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
});
