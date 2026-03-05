/**
 * 历史之树 - 视觉回归测试
 */

import { test, expect } from '@playwright/test';

test.describe('视觉测试', () => {
  test('首页快照', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#app', { timeout: 10000 });
    
    // 等待动画完成
    await page.waitForTimeout(2000);
    
    // 全页面截图
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 1000
    });
  });

  test('树形视图快照', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('svg, canvas', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    const treeContainer = page.locator('#tree-container, .tree-container, svg').first();
    
    if (await treeContainer.isVisible()) {
      await expect(treeContainer).toHaveScreenshot('tree-view.png', {
        maxDiffPixels: 500
      });
    }
  });

  test('移动端快照', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#app', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('mobile-view.png', {
      fullPage: true,
      maxDiffPixels: 1000
    });
  });

  test('导航栏快照', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('nav, .navbar, .nav', { timeout: 10000 });
    
    const navbar = page.locator('nav, .navbar, .nav').first();
    
    if (await navbar.isVisible()) {
      await expect(navbar).toHaveScreenshot('navbar.png', {
        maxDiffPixels: 200
      });
    }
  });
});

test.describe('交互视觉测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('svg, canvas', { timeout: 10000 });
  });

  test('节点悬停效果', async ({ page }) => {
    const node = page.locator('.node, g.node').first();
    
    if (await node.isVisible()) {
      await node.hover();
      await page.waitForTimeout(300);
      
      await expect(node).toHaveScreenshot('node-hover.png', {
        maxDiffPixels: 200
      });
    }
  });

  test('搜索框焦点状态', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.focus();
      await page.waitForTimeout(300);
      
      await expect(searchInput).toHaveScreenshot('search-focused.png', {
        maxDiffPixels: 100
      });
    }
  });
});

test.describe('跨浏览器视觉测试', () => {
  test('Chromium - 首页外观', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', '仅在Chromium运行');
    
    await page.goto('/');
    await page.waitForSelector('#app', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('chromium-homepage.png', {
      maxDiffPixels: 1000
    });
  });

  test('Firefox - 首页外观', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', '仅在Firefox运行');
    
    await page.goto('/');
    await page.waitForSelector('#app', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('firefox-homepage.png', {
      maxDiffPixels: 1000
    });
  });

  test('WebKit - 首页外观', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', '仅在WebKit运行');
    
    await page.goto('/');
    await page.waitForSelector('#app', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('webkit-homepage.png', {
      maxDiffPixels: 1000
    });
  });
});
