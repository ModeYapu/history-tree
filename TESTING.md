# 🧪 测试文档

## 测试概览

本项目包含完整的测试套件，包括：
- **单元测试** (Jest) - 测试核心模块和工具函数
- **E2E测试** (Playwright) - 测试用户交互和页面功能
- **视觉回归测试** (Playwright) - 确保UI外观一致性

## 测试结构

```
history-tree/
├── tests/
│   ├── setup.js              # Jest测试设置
│   ├── unit/                 # 单元测试
│   │   ├── HistoryNode.test.js
│   │   ├── StateManager.test.js
│   │   └── EventBus.test.js
│   └── e2e/                  # E2E测试
│       ├── app.spec.js
│       └── visual.spec.js
├── jest.config.js            # Jest配置
├── playwright.config.js      # Playwright配置
└── package.json              # 测试依赖和脚本
```

## 安装依赖

```bash
cd /root/.openclaw/workspace/history-tree
npm install
```

## 运行测试

### 单元测试

```bash
# 运行所有单元测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

**覆盖率报告位置**: `coverage/index.html`

### E2E测试

```bash
# 运行所有E2E测试
npm run test:e2e

# 使用UI模式（推荐调试）
npm run test:e2e:ui

# 运行特定浏览器
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**E2E测试报告位置**: `playwright-report/index.html`

### 运行所有测试

```bash
npm run test:all
```

## 测试内容

### 📦 单元测试

#### HistoryNode.test.js
- ✅ 节点创建和初始化
- ✅ ID生成
- ✅ 日期格式化（公元前/公元后）
- ✅ 浏览和点赞计数
- ✅ JSON序列化/反序列化
- ✅ 嵌套子节点处理
- ✅ 元数据管理
- ✅ 关系数据处理
- ✅ 多媒体数据

#### StateManager.test.js
- ✅ 状态获取（完整/嵌套）
- ✅ 状态设置
- ✅ 批量更新
- ✅ 状态监听（watch）
- ✅ 状态重置
- ✅ 历史记录
- ✅ 嵌套值操作
- ✅ Silent模式

#### EventBus.test.js
- ✅ 事件订阅（on）
- ✅ 一次性订阅（once）
- ✅ 取消订阅（off）
- ✅ 事件触发（emit）
- ✅ 上下文绑定
- ✅ 多监听器支持
- ✅ 事件清理
- ✅ 预定义事件类型

### 🌐 E2E测试

#### app.spec.js
- ✅ 应用加载
  - 页面加载成功
  - 导航栏显示
  - 树形视图渲染
- ✅ 树形交互
  - 节点显示
  - 节点点击
  - 缩放功能
  - 拖拽功能
- ✅ 搜索功能
  - 搜索框存在
  - 搜索执行
- ✅ 筛选功能
  - 筛选面板
  - 时期筛选
- ✅ 视图切换
  - 视图切换按钮
  - 网络视图切换
- ✅ 响应式设计
  - 移动端 (375x667)
  - 平板端 (768x1024)
  - 桌面端 (1920x1080)
- ✅ 性能测试
  - 初始加载 < 3秒
  - 交互响应 < 100ms

#### visual.spec.js
- ✅ 视觉回归测试
  - 首页快照
  - 树形视图快照
  - 移动端快照
  - 导航栏快照
- ✅ 交互视觉测试
  - 节点悬停效果
  - 搜索框焦点状态
- ✅ 跨浏览器测试
  - Chromium
  - Firefox
  - WebKit

## 测试覆盖率目标

| 类型 | 目标 | 当前 |
|------|------|------|
| 语句覆盖率 | 80% | - |
| 分支覆盖率 | 75% | - |
| 函数覆盖率 | 85% | - |
| 行覆盖率 | 80% | - |

## 持续集成

测试可以在CI/CD流程中自动运行：

```yaml
# GitHub Actions示例
- name: Run tests
  run: |
    npm install
    npm run test:all
```

## 调试测试

### Jest调试

```bash
# 详细输出
npm test -- --verbose

# 调试特定测试
npm test -- --testNamePattern="HistoryNode"

# 更新快照
npm test -- -u
```

### Playwright调试

```bash
# UI模式
npm run test:e2e:ui

# 调试模式
npx playwright test --debug

# 查看trace
npx playwright show-trace trace.zip

# headed模式（显示浏览器）
npx playwright test --headed
```

## 编写新测试

### 单元测试模板

```javascript
describe('ModuleName', () => {
  beforeEach(() => {
    // 设置
  });

  afterEach(() => {
    // 清理
  });

  test('应该做某事', () => {
    // 准备
    const input = 'test';
    
    // 执行
    const result = module.function(input);
    
    // 断言
    expect(result).toBe('expected');
  });
});
```

### E2E测试模板

```javascript
import { test, expect } from '@playwright/test';

test.describe('功能名称', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('应该做某事', async ({ page }) => {
    // 准备
    const element = page.locator('.selector');
    
    // 执行
    await element.click();
    
    // 断言
    await expect(element).toBeVisible();
  });
});
```

## 测试最佳实践

1. **独立性**: 每个测试应该独立，不依赖其他测试
2. **可读性**: 测试名称应该清晰描述测试内容
3. **快速**: 单元测试应该快速执行
4. **覆盖**: 测试应该覆盖正常和异常情况
5. **维护**: 保持测试与代码同步更新

## 常见问题

### Q: 测试失败怎么办？

1. 检查错误信息
2. 使用调试模式
3. 检查测试环境
4. 更新快照（如果是视觉测试）

### Q: 如何测试异步代码？

```javascript
// Jest
test('异步测试', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});

// Playwright
test('异步测试', async ({ page }) => {
  await page.click('button');
  await page.waitForSelector('.result');
});
```

### Q: 如何Mock外部依赖？

```javascript
jest.mock('./externalModule', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'test' }))
}));
```

## 测试报告

测试完成后会生成以下报告：

- **Jest**: `coverage/lcov-report/index.html`
- **Playwright**: `playwright-report/index.html`

打开HTML文件查看详细报告。

---

**测试状态**: ✅ 测试框架已配置  
**最后更新**: 2026-03-01
