# 工具类使用文档

本项目提供了一套完整的工具类，用于增强代码安全性、性能和可维护性。

## 📚 可用工具类

### 1. SecurityUtils - 安全工具类
防止XSS攻击和其他安全漏洞

**主要功能：**
- 安全的DOM操作
- HTML内容清理
- 用户输入验证
- URL和CSS安全检查

**使用示例：**
```javascript
// 安全地设置内容
SecurityUtils.setSafeContent(element, userInput, false);

// 清理HTML
const cleanHTML = SecurityUtils.sanitizeHTML(dangerousHTML);

// 创建安全元素
const button = SecurityUtils.createStyledElement('button', {
    padding: '10px 20px',
    background: '#D4A853'
}, '点击我');
```

### 2. ResourceManager - 资源管理器
防止内存泄漏，自动管理资源

**主要功能：**
- 自动管理事件监听器
- 定时器管理
- 观察者管理
- 请求取消

**使用示例：**
```javascript
class MyComponent {
    constructor() {
        this.resources = new ResourceManager();
    }

    init() {
        // 添加事件监听器
        this.resources.addEventListener(element, 'click', this.handleClick);

        // 添加定时器
        this.resources.setTimeout(() => {
            console.log('定时任务');
        }, 1000);

        // 发起网络请求
        const data = await this.resources.fetch('/api/data');
    }

    destroy() {
        // 清理所有资源
        this.resources.cleanup();
    }
}
```

### 3. ErrorHandler - 错误处理工具类
统一的错误处理和日志记录

**主要功能：**
- 用户友好的错误消息
- 详细的错误日志
- 监控服务集成
- 错误重试机制

**使用示例：**
```javascript
// 基本错误处理
try {
    await riskyOperation();
} catch (error) {
    ErrorHandler.handle(error, 'MyComponent.operation');
}

// 异步包装器
const safeOperation = ErrorHandler.asyncWrapper(riskyOperation, 'context');
await safeOperation();

// 重试机制
const result = await ErrorHandler.retry(
    () => fetch('/api/data'),
    3,  // 最大重试次数
    1000 // 延迟时间
);
```

### 4. StyleManager - 样式管理器
统一样式管理，减少代码重复

**主要功能：**
- 预定义样式
- 快速创建元素
- 响应式设计支持
- 动画效果

**使用示例：**
```javascript
// 应用预定义样式
const button = StyleManager.createStyledElement('button', 'primaryButton', '确定');

// 创建自定义样式元素
const card = StyleManager.createStyledElement('div', {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px'
}, '卡片内容');

// 快速创建常见元素
const input = StyleManager.createInput('请输入内容');
const message = StyleManager.createMessage('这是一条消息', 'user');
```

### 5. ConfigManager - 配置管理器
安全管理环境变量和配置

**主要功能：**
- 环境变量管理
- 配置验证
- 安全的API配置
- 功能开关

**使用示例：**
```javascript
// 初始化配置管理器
configManager.initialize({
    env: process.env,
    requiredEnvVars: ['API_KEY', 'DATABASE_URL']
});

// 获取配置
const appName = configManager.get('app.name');
const apiTimeout = configManager.get('app.apiTimeout', 30000);

// 检查功能是否启用
if (configManager.isFeatureEnabled('aiChat')) {
    // 启用AI聊天功能
}
```

### 6. PerformanceOptimizer - 性能优化工具
优化DOM操作和动画性能

**主要功能：**
- DOM操作批处理
- 虚拟滚动
- 图片懒加载
- 性能监控

**使用示例：**
```javascript
// 批处理DOM操作
await performanceOptimizer.batch((fragment) => {
    const items = data.map(item => createItemElement(item));
    items.forEach(item => fragment.appendChild(item));
});

// 虚拟滚动
const { visibleItems, offsetY } = PerformanceOptimizer.virtualScroll(
    allItems,
    itemHeight,
    containerHeight,
    scrollTop
);

// 图片懒加载
PerformanceOptimizer.lazyLoadImages('img[data-src]', (img) => {
    console.log('图片已加载:', img.src);
});
```

## 🎯 最佳实践

### 错误处理
```javascript
// ❌ 不好的做法
try {
    await riskyOperation();
} catch (error) {
    console.error(error);
    alert('错误：' + error.message); // 可能泄露敏感信息
}

// ✅ 好的做法
try {
    await riskyOperation();
} catch (error) {
    ErrorHandler.handle(error, 'Component.operation', true);
}
```

### 资源管理
```javascript
// ❌ 不好的做法
class Component {
    init() {
        element.addEventListener('click', this.handleClick);
        setTimeout(() => this.update(), 1000);
    }
    // 没有清理方法
}

// ✅ 好的做法
class Component {
    constructor() {
        this.resources = new ResourceManager();
    }

    init() {
        this.resources.addEventListener(element, 'click', this.handleClick);
        this.resources.setTimeout(() => this.update(), 1000);
    }

    destroy() {
        this.resources.cleanup();
    }
}
```

### DOM操作
```javascript
// ❌ 不好的做法
element.innerHTML = userInput; // XSS风险

// ✅ 好的做法
SecurityUtils.setSafeContent(element, userInput, false);

// ✅ 或者使用textContent
element.textContent = userInput;
```

## 📋 集成检查清单

在使用这些工具类时，请确保：

1. **在HTML中引入工具类**
```html
<script src="src/utils/SecurityUtils.js"></script>
<script src="src/utils/ResourceManager.js"></script>
<script src="src/utils/ErrorHandler.js"></script>
<script src="src/utils/StyleManager.js"></script>
<script src="src/utils/ConfigManager.js"></script>
<script src="src/utils/PerformanceOptimizer.js"></script>
```

2. **在应用启动时初始化配置管理器**
```javascript
// 在 main.js 中
configManager.initialize({
    env: window.ENV || {},
    requiredEnvVars: []
});
```

3. **设置全局错误处理**
```javascript
// 在应用启动时
ErrorHandler.setupGlobalHandlers();
```

4. **在组件销毁时清理资源**
```javascript
// 在每个组件的destroy方法中
destroy() {
    if (this.resources) {
        this.resources.cleanup();
    }
}
```

## 🔧 配置建议

### 环境变量配置
创建 `.env` 文件（不要提交到版本控制）：
```env
# AI服务
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# 应用配置
NODE_ENV=development
API_TIMEOUT=30000
```

### 功能开关
```javascript
configManager.initialize({
    env: {
        FEATURE_AI_CHAT: 'true',
        FEATURE_3D_VIEW: 'true',
        FEATURE_EXPORT: 'true'
    }
});
```

## 📊 性能监控

使用性能优化工具监控应用性能：

```javascript
// 获取性能报告
const report = performanceOptimizer.getPerformanceReport();
console.log('性能指标:', report.metrics);
console.log('优化建议:', report.recommendations);

// 监控性能变化
PerformanceOptimizer.monitorPerformance((metrics) => {
    console.log('内存使用:', metrics.memory.usedJSHeapSize / 1024 / 1024, 'MB');
}, 5000);
```

## 🛡️ 安全检查清单

- [ ] 所有用户输入都经过清理
- [ ] 不使用innerHTML设置用户内容
- [ ] API密钥不在客户端代码中硬编码
- [ ] 所有事件监听器都被正确清理
- [ ] 错误消息不泄露敏感信息
- [ ] 所有网络请求都有超时控制
- [ ] 使用CSRF保护

通过使用这些工具类，您可以显著提高代码的安全性、性能和可维护性。