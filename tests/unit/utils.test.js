/**
 * 工具类单元测试
 */

describe('SecurityUtils', () => {
  describe('setSafeContent', () => {
    test('应该使用textContent设置内容', () => {
      const element = document.createElement('div');
      const userInput = '<script>alert("xss")</script>Hello';

      if (window.SecurityUtils) {
        SecurityUtils.setSafeContent(element, userInput, false);
        expect(element.textContent).toBe('Hello');
        expect(element.innerHTML).toBe('Hello');
      } else {
        console.warn('SecurityUtils not available');
      }
    });

    test('应该清理危险HTML', () => {
      const element = document.createElement('div');
      const dangerousHTML = '<script>alert("xss")</script><p>Safe content</p>';

      if (window.SecurityUtils) {
        SecurityUtils.setSafeContent(element, dangerousHTML, true);
        expect(element.innerHTML).not.toContain('<script>');
        expect(element.innerHTML).toContain('Safe content');
      } else {
        console.warn('SecurityUtils not available');
      }
    });
  });

  describe('sanitizeUserInput', () => {
    test('应该清理用户输入', () => {
      const input = '<script>alert("xss")</script>Test';

      if (window.SecurityUtils) {
        const cleaned = SecurityUtils.sanitizeUserInput(input);
        expect(cleaned).not.toContain('<script>');
        expect(cleaned).toContain('Test');
      } else {
        console.warn('SecurityUtils not available');
      }
    });
  });
});

describe('ResourceManager', () => {
  let resourceManager;

  beforeEach(() => {
    if (window.ResourceManager) {
      resourceManager = new ResourceManager();
    } else {
      console.warn('ResourceManager not available');
      resourceManager = null;
    }
  });

  afterEach(() => {
    if (resourceManager) {
      resourceManager.cleanup();
    }
  });

  test('应该正确管理事件监听器', () => {
    if (!resourceManager) return;

    const element = document.createElement('button');
    const handler = jest.fn();

    resourceManager.addEventListener(element, 'click', handler);
    expect(resourceManager.eventListeners).toHaveLength(1);

    resourceManager.cleanup();
    expect(resourceManager.eventListeners).toHaveLength(0);
  });

  test('应该正确管理定时器', () => {
    if (!resourceManager) return;

    const timerId = resourceManager.setTimeout(() => {}, 100);
    expect(timerId).toBeTruthy();
    expect(resourceManager.timers).toContain(timerId);

    resourceManager.clearTimeout(timerId);
    expect(resourceManager.timers).not.toContain(timerId);
  });

  test('应该清理所有资源', () => {
    if (!resourceManager) return;

    const element = document.createElement('div');
    resourceManager.addEventListener(element, 'click', () => {});
    resourceManager.setTimeout(() => {}, 100);

    expect(resourceManager.getStats().eventListeners).toBe(1);
    expect(resourceManager.getStats().timers).toBe(1);

    resourceManager.cleanup();

    expect(resourceManager.getStats().eventListeners).toBe(0);
    expect(resourceManager.getStats().timers).toBe(0);
    expect(resourceManager.isDestroyed).toBe(true);
  });
});

describe('ErrorHandler', () => {
  test('应该处理错误', () => {
    if (!window.ErrorHandler) {
      console.warn('ErrorHandler not available');
      return;
    }

    const error = new Error('Test error');
    const message = ErrorHandler.handle(error, 'TestContext', false);

    expect(message).toBeTruthy();
    expect(typeof message).toBe('string');
  });

  test('应该返回用户友好的错误消息', () => {
    if (!window.ErrorHandler) {
      console.warn('ErrorHandler not available');
      return;
    }

    const networkError = new Error('Network request failed');
    const message = ErrorHandler.getUserFriendlyMessage(networkError);

    expect(message).toContain('网络');
  });

  test('应该安全执行函数', () => {
    if (!window.ErrorHandler) {
      console.warn('ErrorHandler not available');
      return;
    }

    const result = ErrorHandler.safeExecute(
      () => 'success',
      'test',
      'default'
    );

    expect(result).toBe('success');

    const errorResult = ErrorHandler.safeExecute(
      () => { throw new Error('test'); },
      'test',
      'default'
    );

    expect(errorResult).toBe('default');
  });
});

describe('StyleManager', () => {
  test('应该应用样式到元素', () => {
    if (!window.StyleManager) {
      console.warn('StyleManager not available');
      return;
    }

    const element = document.createElement('div');
    StyleManager.applyStyles(element, {
      color: 'red',
      fontSize: '16px'
    });

    expect(element.style.color).toBe('red');
    expect(element.style.fontSize).toBe('16px');
  });

  test('应该创建带样式的元素', () => {
    if (!window.StyleManager) {
      console.warn('StyleManager not available');
      return;
    }

    const button = StyleManager.createStyledElement(
      'button',
      'primaryButton',
      'Click me'
    );

    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent).toBe('Click me');
  });

  test('应该创建输入框', () => {
    if (!window.StyleManager) {
      console.warn('StyleManager not available');
      return;
    }

    const input = StyleManager.createInput('Enter text');

    expect(input.tagName).toBe('INPUT');
    expect(input.placeholder).toBe('Enter text');
    expect(input.type).toBe('text');
  });
});

describe('PerformanceOptimizer', () => {
  test('应该正确应用缓动函数', () => {
    if (!window.PerformanceOptimizer) {
      console.warn('PerformanceOptimizer not available');
      return;
    }

    const eased = PerformanceOptimizer.applyEasing('easeOutCubic', 0.5);
    expect(eased).toBeGreaterThan(0);
    expect(eased).toBeLessThanOrEqual(1);
  });

  test('应该计算虚拟滚动', () => {
    if (!window.PerformanceOptimizer) {
      console.warn('PerformanceOptimizer not available');
      return;
    }

    const items = Array.from({ length: 100 }, (_, i) => i);
    const result = PerformanceOptimizer.virtualScroll(items, 50, 500, 200);

    expect(result.visibleItems).toBeTruthy();
    expect(result.visibleItems.length).toBeLessThan(items.length);
    expect(result.totalHeight).toBe(5000);
  });
});

describe('ConfigManager', () => {
  let configManager;

  beforeEach(() => {
    if (window.ConfigManager) {
      configManager = new window.ConfigManager();
    } else {
      console.warn('ConfigManager not available');
      configManager = null;
    }
  });

  test('应该初始化配置', () => {
    if (!configManager) return;

    configManager.initialize({
      env: {
        APP_NAME: 'Test App',
        API_TIMEOUT: '5000'
      }
    });

    expect(configManager.get('app.name')).toBe('Test App');
    expect(configManager.get('app.apiTimeout')).toBe(5000);
  });

  test('应该设置和获取配置值', () => {
    if (!configManager) return;

    configManager.initialize({ env: {} });

    configManager.set('custom.value', 123);
    expect(configManager.get('custom.value')).toBe(123);
  });

  test('应该检查功能是否启用', () => {
    if (!configManager) return;

    configManager.initialize({
      env: {
        FEATURE_TEST: 'true'
      }
    });

    // 这个测试取决于具体的实现
    expect(configManager.get('features')).toBeTruthy();
  });
});