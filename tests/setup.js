// Jest DOM 测试设置
// 使用require而不是import以避免ES模块问题

try {
  require('@testing-library/jest-dom');
} catch (e) {
  console.warn('@testing-library/jest-dom not available, skipping setup');
}

// 加载源码模块到全局
try {
  global.window = global;
  require('../src/core/EventBus.js');
  require('../src/models/HistoryNode.js');
  require('../src/core/StateManager.js');
} catch (e) {
  console.warn('Failed to load source modules:', e.message);
}

// Mock D3.js
global.d3 = {
  select: jest.fn(() => ({
    append: jest.fn(() => ({
      attr: jest.fn(() => ({
        style: jest.fn(() => ({
          text: jest.fn()
        }))
      }))
    })),
    selectAll: jest.fn(() => ({
      data: jest.fn(() => ({
        enter: jest.fn(() => ({
          append: jest.fn()
        })),
        exit: jest.fn(() => ({
          remove: jest.fn()
        }))
      }))
    }))
  })),
  tree: jest.fn(() => ({
    size: jest.fn(() => ({
      links: jest.fn(),
      nodes: jest.fn()
    }))
  })),
  hierarchy: jest.fn(() => ({
    descendants: jest.fn(() => []),
    links: jest.fn(() => [])
  })),
  zoom: jest.fn(() => ({
    on: jest.fn(),
    transform: jest.fn()
  })),
  drag: jest.fn(() => ({
    on: jest.fn()
  }))
};

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// 清理每个测试后的状态
afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});