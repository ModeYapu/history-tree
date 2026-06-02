/**
 * MapView 地图视图单元测试
 */

describe('MapView', () => {
  let MapView;
  let mockApp;
  let mockContainer;
  let mapView;

  const mockNodes = new Map([
    ['node1', {
      id: 'node1',
      name: '秦朝统一',
      time: { year: -221, displayDate: '公元前221年' },
      location: { coordinates: [108.9, 34.2], name: '西安' },
      category: { primary: 'politics' },
      metadata: { importance: 5 },
      summary: '秦始皇统一六国'
    }],
    ['node2', {
      id: 'node2',
      name: '唐朝建立',
      time: { year: 618, displayDate: '618年' },
      location: { coordinates: [108.9, 34.2], name: '西安' },
      category: { primary: 'politics' },
      metadata: { importance: 4 },
      summary: '李渊建立唐朝'
    }],
    ['node3', {
      id: 'node3',
      name: '宋朝建立',
      time: { year: 960, displayDate: '960年' },
      location: { coordinates: [116.4, 39.9], name: '开封' },
      category: { primary: 'culture' },
      metadata: { importance: 3 },
      summary: '赵匡胤陈桥兵变'
    }]
  ]);

  beforeAll(() => {
    MapView = window.MapView;
  });

  beforeEach(() => {
    // Mock app
    mockApp = {
      options: { container: '#app' },
      eventBus: {
        on: jest.fn(),
        emit: jest.fn(),
        off: jest.fn()
      },
      dataService: {
        nodes: mockNodes,
        getNode: jest.fn((id) => mockNodes.get(id)),
        filter: jest.fn(() => Array.from(mockNodes.values()))
      }
    };

    // Mock container
    mockContainer = document.createElement('div');
    mockContainer.id = 'app';
    document.body.appendChild(mockContainer);

    // Mock Leaflet
    const createMarkerMock = () => {
      const marker = {
        addTo: jest.fn(),
        bindPopup: jest.fn(),
        bindTooltip: jest.fn(),
        on: jest.fn(),
        setStyle: jest.fn(),
        remove: jest.fn(),
        openPopup: jest.fn()
      };
      marker.addTo.mockReturnValue(marker); // chainable
      marker.bindPopup.mockReturnValue(marker); // chainable
      marker.bindTooltip.mockReturnValue(marker); // chainable
      return marker;
    };

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
        getBounds: jest.fn(() => ({ pad: jest.fn(() => ({ getCenter: jest.fn() })) })),
        getZoom: jest.fn(() => 5),
        addLayer: jest.fn(),
        removeLayer: jest.fn()
      })),
      tileLayer: jest.fn(() => ({
        addTo: jest.fn(function() { return this; })
      })),
      circleMarker: jest.fn(() => createMarkerMock()),
      divIcon: jest.fn(() => ({ options: {} })),
      icon: jest.fn(() => ({ options: {} })),
      marker: jest.fn(() => createMarkerMock()),
      layerGroup: jest.fn(() => ({
        addTo: jest.fn(),
        addLayer: jest.fn(),
        removeLayer: jest.fn(),
        clearLayers: jest.fn(),
        eachLayer: jest.fn()
      })),
      popup: jest.fn(() => ({
        setLatLng: jest.fn(),
        setContent: jest.fn(),
        openOn: jest.fn(),
        addTo: jest.fn()
      })),
      control: {
        zoom: jest.fn(() => ({ addTo: jest.fn() })),
        scale: jest.fn(() => ({ addTo: jest.fn() }))
      },
      polygon: jest.fn(() => ({
        addTo: jest.fn(function() { return this; }),
        bindTooltip: jest.fn(function() { return this; }),
        remove: jest.fn()
      })),
      polyline: jest.fn(() => ({
        addTo: jest.fn(function() { return this; }),
        bindTooltip: jest.fn(function() { return this; }),
        remove: jest.fn()
      })),
      rectangle: jest.fn(() => ({
        addTo: jest.fn(function() { return this; }),
        setBounds: jest.fn(function() { return this; })
      }))
    };

    mapView = new MapView(mockApp);
  });

  afterEach(() => {
    if (mockContainer && mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }
    if (mapView) {
      mapView.removeEventListeners();
    }
  });

  describe('constructor()', () => {
    test('应该初始化配置', () => {
      expect(mapView.config.center).toEqual([35, 105]);
      expect(mapView.config.zoom).toBe(4);
      expect(mapView.config.minZoom).toBe(2);
      expect(mapView.config.maxZoom).toBe(18);
    });

    test('应该初始化时间范围', () => {
      expect(mapView.timeRange.start).toBe(-3000);
      expect(mapView.timeRange.end).toBe(2024);
    });

    test('应该初始化筛选器', () => {
      expect(mapView.filters.category).toBeNull();
      expect(mapView.filters.period).toBeNull();
      expect(mapView.filters.minImportance).toBe(0);
    });

    test('应该定义历史时期', () => {
      expect(mapView.periods).toHaveLength(7);
      expect(mapView.periods[0].name).toBe('春秋');
      expect(mapView.periods[6].name).toBe('近现代');
    });
  });

  describe('show()', () => {
    test('应该创建地图容器', () => {
      mapView.show();
      expect(mapView.container).not.toBeNull();
      expect(mapView.container.className).toBe('map-view');
    });

    test('应该初始化地图', () => {
      mapView.show();
      expect(global.L.map).toHaveBeenCalled();
    });

    test('应该设置事件监听', () => {
      mapView.show();
      expect(mapView.eventListeners.length).toBeGreaterThan(0);
    });

    test('应该触发view:ready事件', () => {
      mapView.show();
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('view:ready', { view: 'map' });
    });
  });

  describe('hide()', () => {
    test('应该移除事件监听器', () => {
      mapView.show();
      const listenersCount = mapView.eventListeners.length;
      mapView.hide();
      expect(mapView.eventListeners.length).toBe(0);
    });

    test('应该移除地图', () => {
      mapView.show();
      mapView.hide();
      expect(mapView.map).toBeNull();
    });

    test('应该移除容器', () => {
      mapView.show();
      mapView.hide();
      const container = document.querySelector('.map-view');
      expect(container).toBeNull();
    });
  });

  describe('formatYear()', () => {
    test('应该正确格式化公元前年份', () => {
      expect(mapView.formatYear(-221)).toBe('公元前221年');
    });

    test('应该正确格式化公元后年份', () => {
      expect(mapView.formatYear(618)).toBe('618年');
    });

    test('应该正确格式化0年', () => {
      expect(mapView.formatYear(0)).toBe('0年');
    });
  });

  describe('percentForYear()', () => {
    test('应该正确计算年份百分比', () => {
      expect(mapView.percentForYear(-3000)).toBe(0);
      expect(mapView.percentForYear(2024)).toBeCloseTo(100, 1);
    });

    test('应该正确计算中间年份', () => {
      const percent = mapView.percentForYear(0);
      expect(percent).toBeGreaterThan(50);
      expect(percent).toBeLessThan(70);
    });
  });

  describe('getPeriodForYear()', () => {
    test('应该找到正确的时期', () => {
      expect(mapView.getPeriodForYear(-500).name).toBe('春秋');
      expect(mapView.getPeriodForYear(700).name).toBe('唐宋');
      expect(mapView.getPeriodForYear(1500).name).toBe('明清');
    });

    test('应该返回undefined对于未知年份', () => {
      expect(mapView.getPeriodForYear(-5000)).toBeUndefined();
    });
  });

  describe('getMarkerRadius()', () => {
    test('应该根据重要性返回半径', () => {
      const node5 = { metadata: { importance: 5 } };
      expect(mapView.getMarkerRadius(node5)).toBe(15);

      const node1 = { metadata: { importance: 1 } };
      expect(mapView.getMarkerRadius(node1)).toBe(7);
    });

    test('应该有默认值', () => {
      const node = { metadata: {} };
      expect(mapView.getMarkerRadius(node)).toBe(11);
    });
  });

  describe('getMarkerColor()', () => {
    test('应该返回正确的分类颜色', () => {
      expect(mapView.getMarkerColor({ category: { primary: 'politics' } })).toBe('#ff6b6b');
      expect(mapView.getMarkerColor({ category: { primary: 'technology' } })).toBe('#4ecdc4');
      expect(mapView.getMarkerColor({ category: { primary: 'culture' } })).toBe('#a855f7');
      expect(mapView.getMarkerColor({ category: { primary: 'economy' } })).toBe('#22c55e');
      expect(mapView.getMarkerColor({ category: { primary: 'military' } })).toBe('#f97316');
    });

    test('应该返回默认颜色对于未知分类', () => {
      expect(mapView.getMarkerColor({ category: { primary: 'unknown' } })).toBe('#D4A853');
    });
  });

  describe('setTimeRange()', () => {
    test('应该设置新的时间范围', () => {
      mapView.show();
      mapView.timeRange = { start: -500, end: 1000 };
      expect(mapView.timeRange.start).toBe(-500);
      expect(mapView.timeRange.end).toBe(1000);
    });
  });

  describe('resetFilters()', () => {
    test('应该重置所有筛选器', () => {
      mapView.show();
      mapView.filters = { category: 'politics', period: '春秋', minImportance: 3 };
      mapView.resetFilters();
      expect(mapView.filters.category).toBeNull();
      expect(mapView.filters.period).toBeNull();
      expect(mapView.filters.minImportance).toBe(0);
    });

    test('应该重置时间范围', () => {
      mapView.show();
      mapView.timeRange = { start: -500, end: 1000 };
      mapView.resetFilters();
      expect(mapView.timeRange.start).toBe(-3000);
      expect(mapView.timeRange.end).toBe(2024);
    });
  });

  describe('flyTo()', () => {
    test('应该飞向指定位置', () => {
      mapView.show();
      mapView.flyTo(39.9, 116.4, 10);
      expect(mapView.map.flyTo).toHaveBeenCalledWith([39.9, 116.4], 10, { duration: 1.5 });
    });

    test('应该使用默认缩放级别', () => {
      mapView.show();
      mapView.flyTo(39.9, 116.4);
      expect(mapView.map.flyTo).toHaveBeenCalledWith([39.9, 116.4], 10, { duration: 1.5 });
    });
  });

  describe('focusOnNode()', () => {
    test('应该聚焦到指定节点', () => {
      mapView.show();
      const marker = { node: { id: 'node1' }, openPopup: jest.fn() };
      mapView.markers = [marker];

      mapView.focusOnNode('node1');
      expect(mockApp.dataService.getNode).toHaveBeenCalledWith('node1');
      expect(marker.openPopup).toHaveBeenCalled();
    });

    test('应该处理不存在坐标的节点', () => {
      mapView.show();
      mockApp.dataService.getNode = jest.fn(() => ({
        id: 'nodeX',
        location: { coordinates: null }
      }));

      mapView.focusOnNode('nodeX');
      expect(mapView.map.flyTo).not.toHaveBeenCalled();
    });
  });

  describe('applyFilters()', () => {
    test('应该应用分类筛选', () => {
      mapView.show();
      mapView.filters.category = 'politics';
      // Mock markers
      const marker1 = { node: { category: { primary: 'politics' }, time: { year: 0 } }, addTo: jest.fn(), remove: jest.fn() };
      const marker2 = { node: { category: { primary: 'culture' }, time: { year: 0 } }, addTo: jest.fn(), remove: jest.fn() };
      mapView.markers = [marker1, marker2];

      mapView.applyFilters();
      expect(marker1.addTo).toHaveBeenCalled();
      expect(marker2.remove).toHaveBeenCalled();
    });

    test('应该应用重要性筛选', () => {
      mapView.show();
      mapView.filters.minImportance = 4;
      const marker1 = { node: { metadata: { importance: 5 }, time: { year: 0 } }, addTo: jest.fn(), remove: jest.fn() };
      const marker2 = { node: { metadata: { importance: 2 }, time: { year: 0 } }, addTo: jest.fn(), remove: jest.fn() };
      mapView.markers = [marker1, marker2];

      mapView.applyFilters();
      expect(marker1.addTo).toHaveBeenCalled();
      expect(marker2.remove).toHaveBeenCalled();
    });

    test('应该应用时间范围筛选', () => {
      mapView.show();
      mapView.timeRange = { start: -500, end: 700 };
      const marker1 = { node: { time: { year: 0 } }, addTo: jest.fn(), remove: jest.fn() };
      const marker2 = { node: { time: { year: 1000 } }, addTo: jest.fn(), remove: jest.fn() };
      mapView.markers = [marker1, marker2];

      mapView.applyFilters();
      expect(marker1.addTo).toHaveBeenCalled();
      expect(marker2.remove).toHaveBeenCalled();
    });
  });

  describe('setupEventListeners()', () => {
    test('应该监听timeline:brush事件', () => {
      mapView.setupEventListeners();
      const timelineHandler = mapView.eventListeners.find(e => e.event === 'timeline:brush');
      expect(timelineHandler).toBeDefined();
    });

    test('应该监听period:select事件', () => {
      mapView.setupEventListeners();
      const periodHandler = mapView.eventListeners.find(e => e.event === 'period:select');
      expect(periodHandler).toBeDefined();
    });

    test('应该监听filter:results事件', () => {
      mapView.setupEventListeners();
      const filterHandler = mapView.eventListeners.find(e => e.event === 'filter:results');
      expect(filterHandler).toBeDefined();
    });

    test('应该监听window resize事件', () => {
      mapView.setupEventListeners();
      const resizeHandler = mapView.eventListeners.find(e => e.event === 'resize');
      expect(resizeHandler).toBeDefined();
      expect(resizeHandler.target).toBe(window);
    });
  });

  describe('removeEventListeners()', () => {
    test('应该移除所有事件监听器', () => {
      mapView.show();
      const listenersCount = mapView.eventListeners.length;
      mapView.removeEventListeners();
      expect(mapView.eventListeners.length).toBe(0);
    });
  });

  describe('createPopupContent()', () => {
    test('应该创建正确的弹窗内容', () => {
      const node = {
        name: '秦朝统一',
        time: { year: -221, displayDate: '公元前221年' },
        category: { primary: 'politics' },
        summary: '秦始皇统一六国',
        location: { name: '西安' }
      };

      const content = mapView.createPopupContent(node);
      expect(content).toContain('秦朝统一');
      expect(content).toContain('公元前221年');
      expect(content).toContain('政治');
      expect(content).toContain('西安');
    });
  });

  describe('集成测试', () => {
    test('应该完整展示和隐藏地图视图', () => {
      mapView.show();
      expect(mapView.container).not.toBeNull();
      expect(mapView.map).not.toBeNull();

      mapView.hide();
      expect(mapView.map).toBeNull();
    });

    test('应该处理筛选流程', () => {
      mapView.show();
      mapView.filters.category = 'politics';
      mapView.filters.minImportance = 4;
      mapView.applyFilters();
      expect(mapView.statsDiv).toBeDefined();
    });
  });
});
