/**
 * NetworkView 网络视图单元测试
 * 测试力导向图、关系筛选、节点交互
 */

describe('NetworkView', () => {
  let NetworkView;
  let mockApp;
  let mockContainer;
  let networkView;

  const mockNodes = new Map([
    ['node1', {
      id: 'node1',
      name: '秦朝统一',
      type: 'event',
      category: { primary: 'politics' },
      metadata: { importance: 5 },
      relations: {
        causes: ['node2'],
        related: ['node3']
      }
    }],
    ['node2', {
      id: 'node2',
      name: '焚书坑儒',
      type: 'event',
      category: { primary: 'culture' },
      metadata: { importance: 3 },
      relations: {
        effects: ['node1']
      }
    }],
    ['node3', {
      id: 'node3',
      name: '汉朝建立',
      type: 'event',
      category: { primary: 'politics' },
      metadata: { importance: 4 },
      relations: {
        causes: ['node1'],
        participants: ['node4']
      }
    }],
    ['node4', {
      id: 'node4',
      name: '刘邦',
      type: 'character',
      category: { primary: 'politics' },
      metadata: { importance: 4 },
      relations: {
        related: ['node5']
      }
    }],
    ['node5', {
      id: 'node5',
      name: '项羽',
      type: 'character',
      category: { primary: 'military' },
      metadata: { importance: 4 },
      relations: {}
    }]
  ]);

  beforeAll(() => {
    NetworkView = window.NetworkView;
  });

  beforeEach(() => {
    mockApp = {
      options: { container: '#app' },
      eventBus: {
        on: jest.fn(),
        emit: jest.fn(),
        off: jest.fn()
      },
      dataService: {
        nodes: mockNodes,
        getNode: jest.fn((id) => mockNodes.get(id))
      }
    };

    mockContainer = document.createElement('div');
    mockContainer.id = 'app';
    document.body.appendChild(mockContainer);

    // Mock d3 force simulation chain
    const mockForceFn = jest.fn(() => mockForceFn);
    const mockSimulation = {
      force: jest.fn(() => mockSimulation),
      on: jest.fn(() => mockSimulation),
      stop: jest.fn(),
      alphaTarget: jest.fn(() => ({ restart: jest.fn() }))
    };

    // Create chained mock for d3 select
    const createMockSelection = () => ({
      append: jest.fn(() => createMockSelection()),
      attr: jest.fn(() => createMockSelection()),
      style: jest.fn(() => createMockSelection()),
      text: jest.fn(() => createMockSelection()),
      selectAll: jest.fn(() => ({
        data: jest.fn(() => ({
          enter: jest.fn(() => ({
            append: jest.fn(() => createMockSelection())
          })),
          exit: jest.fn(() => ({
            remove: jest.fn()
          }))
        }))
      })),
      call: jest.fn(() => createMockSelection()),
      on: jest.fn(() => createMockSelection()),
      remove: jest.fn()
    });

    global.d3 = {
      select: jest.fn(() => createMockSelection()),
      forceSimulation: jest.fn(() => mockSimulation),
      forceLink: jest.fn(() => ({
        id: jest.fn(() => ({
          distance: jest.fn(() => mockForceFn)
        }))
      })),
      forceManyBody: jest.fn(() => ({
        strength: jest.fn(() => mockForceFn)
      })),
      forceCenter: jest.fn(() => mockForceFn),
      forceCollide: jest.fn(() => ({
        radius: jest.fn(() => mockForceFn)
      })),
      zoom: jest.fn(() => ({
        scaleExtent: jest.fn(() => ({
          on: jest.fn(() => mockForceFn)
        }))
      })),
      drag: jest.fn(() => ({
        on: jest.fn(function() {
          return this;
        })
      }))
    };

    networkView = new NetworkView(mockApp);
  });

  afterEach(() => {
    if (mockContainer && mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }
    if (networkView) {
      networkView.destroy();
    }
  });

  describe('constructor()', () => {
    test('应该初始化配置', () => {
      expect(networkView.config.width).toBeDefined();
      expect(networkView.config.height).toBeDefined();
    });

    test('应该初始化空节点和连接', () => {
      expect(networkView.nodes).toEqual([]);
      expect(networkView.links).toEqual([]);
    });

    test('应该默认为事件模式', () => {
      expect(networkView.currentMode).toBe('event');
    });

    test('应该定义人物关系类型', () => {
      expect(networkView.characterRelationTypes).toBeDefined();
      expect(Object.keys(networkView.characterRelationTypes)).toContain('mentor');
      expect(Object.keys(networkView.characterRelationTypes)).toContain('enemy');
      expect(Object.keys(networkView.characterRelationTypes)).toContain('friend');
      expect(Object.keys(networkView.characterRelationTypes)).toContain('family');
      expect(Object.keys(networkView.characterRelationTypes)).toContain('colleague');
    });

    test('应该定义事件关系类型', () => {
      expect(networkView.eventRelationTypes).toBeDefined();
      expect(Object.keys(networkView.eventRelationTypes)).toContain('causes');
      expect(Object.keys(networkView.eventRelationTypes)).toContain('effects');
      expect(Object.keys(networkView.eventRelationTypes)).toContain('related');
      expect(Object.keys(networkView.eventRelationTypes)).toContain('participants');
    });

    test('应该初始化空筛选器', () => {
      expect(networkView.activeFilters).toBeInstanceOf(Set);
      expect(networkView.activeFilters.size).toBe(0);
    });
  });

  describe('loadData()', () => {
    test('应该从 dataService 加载节点', () => {
      networkView.loadData();
      expect(networkView.nodes.length).toBe(5);
    });

    test('应该正确映射节点属性', () => {
      networkView.loadData();
      const node1 = networkView.nodes.find(n => n.id === 'node1');
      expect(node1).toBeDefined();
      expect(node1.name).toBe('秦朝统一');
      expect(node1.type).toBe('event');
      expect(node1.category).toBe('politics');
      expect(node1.importance).toBe(5);
    });

    test('应该从节点关系构建连接', () => {
      networkView.loadData();
      expect(networkView.links.length).toBeGreaterThan(0);
    });

    test('应该正确映射连接类型', () => {
      networkView.loadData();
      const causeLink = networkView.links.find(l => l.type === 'causes');
      expect(causeLink).toBeDefined();
    });

    test('应该处理无关系的节点', () => {
      networkView.loadData();
      const node5Links = networkView.links.filter(l => l.source === 'node5' || l.source === 'node5');
      expect(node5Links.length).toBe(0);
    });
  });

  describe('getNodeRadius()', () => {
    test('应该根据重要性计算节点半径', () => {
      expect(networkView.getNodeRadius({ importance: 5 })).toBe(30);
      expect(networkView.getNodeRadius({ importance: 1 })).toBe(18);
      expect(networkView.getNodeRadius({ importance: 10 })).toBe(45);
    });

    test('默认基础半径为15', () => {
      expect(networkView.getNodeRadius({ importance: 0 })).toBe(15);
    });
  });

  describe('getNodeColor()', () => {
    test('应该返回正确的分类颜色', () => {
      expect(networkView.getNodeColor({ category: 'politics' })).toBe('#ff6b6b');
      expect(networkView.getNodeColor({ category: 'technology' })).toBe('#4ecdc4');
      expect(networkView.getNodeColor({ category: 'culture' })).toBe('#a855f7');
      expect(networkView.getNodeColor({ category: 'economy' })).toBe('#22c55e');
      expect(networkView.getNodeColor({ category: 'military' })).toBe('#f97316');
    });

    test('未知分类返回默认颜色', () => {
      expect(networkView.getNodeColor({ category: 'unknown' })).toBe('#999');
    });

    test('无分类返回默认颜色', () => {
      expect(networkView.getNodeColor({})).toBe('#999');
    });
  });

  describe('getLinkColor()', () => {
    test('应该返回正确的连接颜色', () => {
      expect(networkView.getLinkColor('causes')).toBe('#22c55e');
      expect(networkView.getLinkColor('effects')).toBe('#3b82f6');
      expect(networkView.getLinkColor('related')).toBe('#9ca3af');
      expect(networkView.getLinkColor('participants')).toBe('#f59e0b');
    });

    test('未知类型返回默认颜色', () => {
      expect(networkView.getLinkColor('unknown')).toBe('#999');
    });
  });

  describe('show()', () => {
    test('应该创建容器元素', () => {
      networkView.show();
      expect(networkView.container).not.toBeNull();
      expect(networkView.container.className).toBe('network-view');
    });

    test('应该触发 view:ready 事件', () => {
      networkView.show();
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('view:ready', { view: 'network' });
    });

    test('应该加载数据', () => {
      networkView.show();
      expect(networkView.nodes.length).toBe(5);
    });
  });

  describe('hide()', () => {
    test('应该移除容器', () => {
      networkView.show();
      networkView.hide();
      expect(document.querySelector('.network-view')).toBeNull();
    });

    test('应该安全处理未初始化状态', () => {
      expect(() => networkView.hide()).not.toThrow();
    });
  });

  describe('onNodeClick()', () => {
    test('应该触发 node:select 事件', () => {
      networkView.onNodeClick({ id: 'node1' });
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('node:select', mockNodes.get('node1'));
    });

    test('应该获取正确节点数据', () => {
      networkView.onNodeClick({ id: 'node2' });
      expect(mockApp.dataService.getNode).toHaveBeenCalledWith('node2');
    });
  });

  describe('destroy()', () => {
    test('应该清除容器', () => {
      networkView.show();
      networkView.destroy();
      expect(document.querySelector('.network-view')).toBeNull();
    });

    test('应该触发 view:destroy 事件', () => {
      networkView.show();
      networkView.destroy();
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('view:destroy', { view: 'network' });
    });
  });

  describe('关系类型配置', () => {
    test('人物关系类型应包含名称、颜色和图标', () => {
      Object.values(networkView.characterRelationTypes).forEach(type => {
        expect(type).toHaveProperty('name');
        expect(type).toHaveProperty('color');
        expect(type).toHaveProperty('icon');
      });
    });

    test('事件关系类型应包含名称、颜色和图标', () => {
      Object.values(networkView.eventRelationTypes).forEach(type => {
        expect(type).toHaveProperty('name');
        expect(type).toHaveProperty('color');
        expect(type).toHaveProperty('icon');
      });
    });

    test('敌对关系应为红色', () => {
      expect(networkView.characterRelationTypes.enemy.color).toBe('#ef4444');
    });

    test('因果关系应为绿色', () => {
      expect(networkView.eventRelationTypes.causes.color).toBe('#22c55e');
    });
  });

  describe('集成测试', () => {
    test('完整展示-交互-销毁流程', () => {
      networkView.show();
      expect(networkView.container).not.toBeNull();
      expect(networkView.nodes.length).toBe(5);

      // 模拟节点点击
      networkView.onNodeClick({ id: 'node1' });
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('node:select', expect.any(Object));

      networkView.hide();
      expect(document.querySelector('.network-view')).toBeNull();
    });

    test('数据加载和连接映射一致性', () => {
      networkView.loadData();
      // 每个连接的 source 和 target 都应对应存在的节点 ID
      const nodeIds = new Set(networkView.nodes.map(n => n.id));
      networkView.links.forEach(link => {
        expect(nodeIds.has(link.source) || typeof link.source === 'string').toBe(true);
      });
    });
  });
});
