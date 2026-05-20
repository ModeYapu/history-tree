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

// Mock Leaflet before loading MapView
global.L = {
  map: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    invalidateSize: jest.fn(),
    flyTo: jest.fn(),
    hasLayer: jest.fn(() => true),
    on: jest.fn(),
    off: jest.fn(),
    setView: jest.fn(),
    getBounds: jest.fn(() => ({ pad: jest.fn() })),
    getZoom: jest.fn(() => 5),
    addLayer: jest.fn(),
    removeLayer: jest.fn()
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(() => ({ addTo: jest.fn() }))
  })),
  circleMarker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
    on: jest.fn(),
    setStyle: jest.fn(),
    remove: jest.fn(),
    openPopup: jest.fn(),
    setLatLng: jest.fn(),
    getLatLng: jest.fn()
  })),
  control: {
    zoom: jest.fn(() => ({ addTo: jest.fn() })),
    scale: jest.fn(() => ({ addTo: jest.fn() }))
  }
};

// Load new modules
global.window = global;
try { require('../src/views/MapView.js'); } catch (e) { console.warn('Failed to load MapView:', e.message); }
try { require('../src/services/QuizEngine.js'); } catch (e) { console.warn('Failed to load QuizEngine:', e.message); }
try { require('../src/plugins/TimelinePlugin.js'); } catch (e) { console.warn('Failed to load TimelinePlugin:', e.message); }

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