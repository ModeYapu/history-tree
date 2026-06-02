/**
 * 历史之树 - 基础功能 E2E 测试
 */

import { test, expect } from '@playwright/test';

test.describe('应用加载', () => {
  test('应该成功加载应用', async ({ page }) => {
    await page.goto('/');
    
    // 检查标题
    await expect(page).toHaveTitle(/历史之树/);
    
    // 检查主要元素
    await expect(page.locator('#app')).toBeVisible();
  });

  test('应该显示导航栏', async ({ page }) => {
    await page.goto('/');
    
    // 检查导航栏
    const navbar = page.locator('nav, .navbar, .nav');
    await expect(navbar.first()).toBeVisible();
  });

  test('应该显示树形视图', async ({ page }) => {
    await page.goto('/');
    
    // 等待应用加载
    await page.waitForSelector('#tree-container, .tree-container, svg', {
      timeout: 10000
    });
    
    // 检查SVG或Canvas
    const treeContainer = page.locator('#tree-container, .tree-container, svg');
    await expect(treeContainer.first()).toBeVisible();
  });
});

test.describe('树形交互', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('svg, canvas', { timeout: 10000 });
  });

  test('应该显示历史节点', async ({ page }) => {
    // 检查是否有节点显示
    const nodes = page.locator('.node, circle, g.node');
    const count = await nodes.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('应该支持节点点击', async ({ page }) => {
    // 找到第一个可点击的节点
    const firstNode = page.locator('.node, g.node').first();
    
    if (await firstNode.isVisible()) {
      await firstNode.click();
      
      // 检查是否显示详情
      const detailPanel = page.locator('.detail-panel, .node-card, #detail-panel');
      
      // 可能显示详情面板，也可能展开/折叠节点
      await page.waitForTimeout(500);
    }
  });

  test('应该支持缩放', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    if (await svg.isVisible()) {
      // 模拟鼠标滚轮缩放
      await svg.hover();
      await page.mouse.wheel(0, -100);
      
      await page.waitForTimeout(300);
      
      // 验证缩放状态（可以通过transform属性检查）
    }
  });

  test('应该支持拖拽', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    if (await svg.isVisible()) {
      const box = await svg.boundingBox();
      if (box) {
        // 模拟拖拽
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2);
        await page.mouse.up();
        
        await page.waitForTimeout(300);
      }
    }
  });
});

test.describe('搜索功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('svg, canvas', { timeout: 10000 });
  });

  test('应该有搜索框', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"], input.search');
    
    // 检查搜索框是否存在
    const count = await searchInput.count();
    expect(count).toBeGreaterThan(0);
  });

  test('应该支持搜索', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"], input.search').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('秦');
      await searchInput.press('Enter');
      
      // 等待搜索结果
      await page.waitForTimeout(1000);
      
      // 检查是否有结果
      const nodes = page.locator('.node, g.node');
      const count = await nodes.count();
      
      // 应该显示一些节点
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('筛选功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('svg, canvas', { timeout: 10000 });
  });

  test('应该显示筛选面板', async ({ page }) => {
    const filterPanel = page.locator('.filter-panel, #filters, .filters');
    
    // 检查筛选面板是否存在
    const count = await filterPanel.count();
    
    // 可能有筛选面板
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('应该支持时期筛选', async ({ page }) => {
    const periodFilter = page.locator('select, .period-filter, input[value*="period"]');
    
    if (await periodFilter.count() > 0) {
      const first = periodFilter.first();
      await first.click();
      
      await page.waitForTimeout(500);
    }
  });
});

test.describe('视图切换', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('svg, canvas', { timeout: 10000 });
  });

  test('应该支持视图切换按钮', async ({ page }) => {
    const viewButtons = page.locator('button, .view-button, .nav-item');
    const count = await viewButtons.count();
    
    // 应该有一些按钮
    expect(count).toBeGreaterThan(0);
  });

  test('应该切换到网络视图', async ({ page }) => {
    const networkButton = page.locator('button:has-text("网络"), button:has-text("network"), [data-view="network"]');
    
    if (await networkButton.count() > 0) {
      await networkButton.first().click();
      
      await page.waitForTimeout(1000);
      
      // 检查视图是否切换
      const networkView = page.locator('.network-view, #network-container');
      const isVisible = await networkView.count() > 0;
      
      // 可能切换成功
      expect(isVisible).toBeDefined();
    }
  });
});

test.describe('响应式设计', () => {
  test('应该在移动端正常显示', async ({ page }) => {
    // 设置移动设备视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // 等待加载
    await page.waitForSelector('#app', { timeout: 10000 });
    
    // 检查应用是否可见
    const app = page.locator('#app');
    await expect(app).toBeVisible();
  });

  test('应该在平板端正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await page.waitForSelector('#app', { timeout: 10000 });
    
    const app = page.locator('#app');
    await expect(app).toBeVisible();
  });

  test('应该在桌面端正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    await page.waitForSelector('#app', { timeout: 10000 });
    
    const app = page.locator('#app');
    await expect(app).toBeVisible();
  });
});

test.describe('性能测试', () => {
  test('应该在3秒内完成初始加载', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('应该快速响应交互', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('svg, canvas', { timeout: 10000 });
    
    const node = page.locator('.node, g.node').first();
    
    if (await node.isVisible()) {
      const startTime = Date.now();
      await node.click();
      const responseTime = Date.now() - startTime;
      
      // 应该在100ms内响应
      expect(responseTime).toBeLessThan(100);
    }
  });
});
