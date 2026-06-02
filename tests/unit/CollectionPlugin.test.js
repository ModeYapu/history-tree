/**
 * CollectionPlugin 收藏插件单元测试
 * 测试收藏、合集、持久化
 */

describe('CollectionPlugin', () => {
  let CollectionPlugin;
  let mockApp;
  let collectionPlugin;

  const mockNodes = new Map([
    ['node1', {
      id: 'node1',
      name: '秦朝统一',
      category: { primary: 'politics' },
      time: { displayDate: '公元前221年' },
      summary: '秦始皇统一六国'
    }],
    ['node2', {
      id: 'node2',
      name: '唐朝建立',
      category: { primary: 'politics' },
      time: { displayDate: '618年' },
      summary: '李渊建立唐朝'
    }],
    ['node3', {
      id: 'node3',
      name: '宋朝建立',
      category: { primary: 'culture' },
      time: { displayDate: '960年' },
      summary: '赵匡胤陈桥兵变'
    }]
  ]);

  beforeAll(() => {
    CollectionPlugin = window.CollectionPlugin;
  });

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    mockApp = {
      eventBus: {
        on: jest.fn(),
        emit: jest.fn(),
        off: jest.fn()
      },
      dataService: {
        nodes: mockNodes,
        getNode: jest.fn((id) => mockNodes.get(id))
      },
      showView: jest.fn()
    };

    collectionPlugin = new CollectionPlugin(mockApp);
  });

  afterEach(() => {
    if (collectionPlugin) {
      collectionPlugin.destroy();
    }
    localStorage.clear();
    document.body.innerHTML = '';
  });

  describe('constructor()', () => {
    test('应该正确初始化', () => {
      expect(collectionPlugin.name).toBe('collection');
      expect(collectionPlugin.version).toBe('1.0.0');
    });

    test('应该初始化空收藏集合', () => {
      expect(collectionPlugin.favorites).toBeInstanceOf(Set);
      expect(collectionPlugin.favorites.size).toBe(0);
    });

    test('应该初始化空合集数组', () => {
      expect(collectionPlugin.collections).toEqual([]);
    });

    test('应该定义收藏颜色', () => {
      expect(CollectionPlugin.COLLECTION_COLORS.length).toBe(8);
    });

    test('应该定义收藏图标', () => {
      expect(CollectionPlugin.COLLECTION_ICONS.length).toBe(8);
    });

    test('应该定义存储键', () => {
      expect(CollectionPlugin.STORAGE_KEY).toBe('historyTree_collections');
      expect(CollectionPlugin.FAVORITES_KEY).toBe('historyTree_favorites');
    });
  });

  describe('toggleFavorite()', () => {
    test('应该添加收藏', () => {
      const result = collectionPlugin.toggleFavorite('node1');
      expect(result).toBe(true);
      expect(collectionPlugin.favorites.has('node1')).toBe(true);
    });

    test('应该取消收藏', () => {
      collectionPlugin.toggleFavorite('node1');
      const result = collectionPlugin.toggleFavorite('node1');
      expect(result).toBe(false);
      expect(collectionPlugin.favorites.has('node1')).toBe(false);
    });

    test('添加收藏应触发 collection:favorited 事件', () => {
      collectionPlugin.toggleFavorite('node1');
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('collection:favorited', 'node1');
    });

    test('取消收藏应触发 collection:unfavorited 事件', () => {
      collectionPlugin.toggleFavorite('node1');
      collectionPlugin.toggleFavorite('node1');
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('collection:unfavorited', 'node1');
    });

    test('应该持久化到 localStorage', () => {
      collectionPlugin.toggleFavorite('node1');
      const stored = JSON.parse(localStorage.getItem(CollectionPlugin.FAVORITES_KEY));
      expect(stored).toContain('node1');
    });
  });

  describe('isFavorite()', () => {
    test('应该返回 true 如果已收藏', () => {
      collectionPlugin.toggleFavorite('node1');
      expect(collectionPlugin.isFavorite('node1')).toBe(true);
    });

    test('应该返回 false 如果未收藏', () => {
      expect(collectionPlugin.isFavorite('node1')).toBe(false);
    });
  });

  describe('getFavorites()', () => {
    test('应该返回收藏的节点数据', () => {
      collectionPlugin.toggleFavorite('node1');
      collectionPlugin.toggleFavorite('node2');
      const favs = collectionPlugin.getFavorites();
      expect(favs.length).toBe(2);
      expect(favs[0].name).toBe('秦朝统一');
      expect(favs[1].name).toBe('唐朝建立');
    });

    test('应该过滤不存在的节点', () => {
      collectionPlugin.toggleFavorite('node1');
      collectionPlugin.toggleFavorite('nonexistent');
      const favs = collectionPlugin.getFavorites();
      expect(favs.length).toBe(1);
    });

    test('空收藏应返回空数组', () => {
      expect(collectionPlugin.getFavorites()).toEqual([]);
    });
  });

  describe('createCollection()', () => {
    test('应该创建默认合集', () => {
      const collection = collectionPlugin.createCollection();
      expect(collection.id).toMatch(/^collection_/);
      expect(collection.name).toBe('新建合集');
      expect(collection.nodes).toEqual([]);
      expect(collection.description).toBe('');
    });

    test('应该使用自定义参数创建合集', () => {
      const collection = collectionPlugin.createCollection({
        name: '我的合集',
        description: '测试描述'
      });
      expect(collection.name).toBe('我的合集');
      expect(collection.description).toBe('测试描述');
    });

    test('应该生成唯一 ID', () => {
      const c1 = collectionPlugin.createCollection({ name: '合集1' });
      // Small delay to ensure different timestamp
      return new Promise(resolve => {
        setTimeout(() => {
          const c2 = collectionPlugin.createCollection({ name: '合集2' });
          expect(c1.id).not.toBe(c2.id);
          resolve();
        }, 10);
      });
    });

    test('应该设置创建和更新时间', () => {
      const before = Date.now();
      const collection = collectionPlugin.createCollection();
      const after = Date.now();
      expect(collection.createdAt).toBeGreaterThanOrEqual(before);
      expect(collection.createdAt).toBeLessThanOrEqual(after);
      expect(collection.updatedAt).toBe(collection.createdAt);
    });

    test('应该分配随机颜色和默认图标', () => {
      const collection = collectionPlugin.createCollection();
      expect(collection.color).toBeDefined();
      expect(collection.color.value).toBeDefined();
      expect(collection.icon).toBeDefined();
      expect(collection.icon.icon).toBeDefined();
    });

    test('应该触发 collection:created 事件', () => {
      collectionPlugin.createCollection({ name: '测试' });
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('collection:created', expect.any(Object));
    });

    test('应该持久化到 localStorage', () => {
      collectionPlugin.createCollection({ name: '持久化测试' });
      const stored = JSON.parse(localStorage.getItem(CollectionPlugin.STORAGE_KEY));
      expect(stored.length).toBe(1);
      expect(stored[0].name).toBe('持久化测试');
    });
  });

  describe('updateCollection()', () => {
    test('应该更新合集属性', () => {
      const collection = collectionPlugin.createCollection({ name: '原名' });
      const updated = collectionPlugin.updateCollection(collection.id, { name: '新名' });
      expect(updated.name).toBe('新名');
    });

    test('应该更新 updatedAt 时间', () => {
      const collection = collectionPlugin.createCollection();
      const originalUpdatedAt = collection.updatedAt;
      // Small delay to ensure different timestamp
      collection.updatedAt = originalUpdatedAt - 1000;
      collectionPlugin.updateCollection(collection.id, { name: '更新' });
      const found = collectionPlugin.getCollection(collection.id);
      expect(found.updatedAt).toBeGreaterThan(originalUpdatedAt - 1000);
    });

    test('应该触发 collection:updated 事件', () => {
      const collection = collectionPlugin.createCollection();
      collectionPlugin.updateCollection(collection.id, { name: '更新' });
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('collection:updated', expect.any(Object));
    });

    test('不存在的合集应返回 null', () => {
      const result = collectionPlugin.updateCollection('nonexistent', { name: 'test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteCollection()', () => {
    test('应该删除合集', () => {
      const collection = collectionPlugin.createCollection({ name: '待删除' });
      const result = collectionPlugin.deleteCollection(collection.id);
      expect(result).toBe(true);
      expect(collectionPlugin.getCollections().length).toBe(0);
    });

    test('应该触发 collection:deleted 事件', () => {
      const collection = collectionPlugin.createCollection();
      collectionPlugin.deleteCollection(collection.id);
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('collection:deleted', expect.any(Object));
    });

    test('删除不存在的合集应返回 false', () => {
      const result = collectionPlugin.deleteCollection('nonexistent');
      expect(result).toBe(false);
    });

    test('应该更新 localStorage', () => {
      const collection = collectionPlugin.createCollection();
      collectionPlugin.deleteCollection(collection.id);
      const stored = JSON.parse(localStorage.getItem(CollectionPlugin.STORAGE_KEY));
      expect(stored.length).toBe(0);
    });
  });

  describe('addNodeToCollection()', () => {
    let collection;

    beforeEach(() => {
      collection = collectionPlugin.createCollection({ name: '测试合集' });
    });

    test('应该添加节点到合集', () => {
      const result = collectionPlugin.addNodeToCollection(collection.id, 'node1');
      expect(result).toBe(true);
      expect(collection.nodes).toContain('node1');
    });

    test('应该触发 collection:nodeAdded 事件', () => {
      collectionPlugin.addNodeToCollection(collection.id, 'node1');
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('collection:nodeAdded', {
        collectionId: collection.id,
        nodeId: 'node1'
      });
    });

    test('不应该重复添加相同节点', () => {
      collectionPlugin.addNodeToCollection(collection.id, 'node1');
      const result = collectionPlugin.addNodeToCollection(collection.id, 'node1');
      expect(result).toBe(false);
      expect(collection.nodes.length).toBe(1);
    });

    test('不存在的合集应返回 false', () => {
      const result = collectionPlugin.addNodeToCollection('nonexistent', 'node1');
      expect(result).toBe(false);
    });

    test('应该持久化', () => {
      collectionPlugin.addNodeToCollection(collection.id, 'node1');
      const stored = JSON.parse(localStorage.getItem(CollectionPlugin.STORAGE_KEY));
      expect(stored[0].nodes).toContain('node1');
    });
  });

  describe('removeNodeFromCollection()', () => {
    let collection;

    beforeEach(() => {
      collection = collectionPlugin.createCollection({ name: '测试合集' });
      collectionPlugin.addNodeToCollection(collection.id, 'node1');
    });

    test('应该从合集移除节点', () => {
      const result = collectionPlugin.removeNodeFromCollection(collection.id, 'node1');
      expect(result).toBe(true);
      expect(collection.nodes).not.toContain('node1');
    });

    test('应该触发 collection:nodeRemoved 事件', () => {
      collectionPlugin.removeNodeFromCollection(collection.id, 'node1');
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('collection:nodeRemoved', {
        collectionId: collection.id,
        nodeId: 'node1'
      });
    });

    test('移除不存在的节点应返回 false', () => {
      const result = collectionPlugin.removeNodeFromCollection(collection.id, 'node999');
      expect(result).toBe(false);
    });

    test('不存在的合集应返回 false', () => {
      const result = collectionPlugin.removeNodeFromCollection('nonexistent', 'node1');
      expect(result).toBe(false);
    });
  });

  describe('getCollection()', () => {
    test('应该返回指定合集', () => {
      const collection = collectionPlugin.createCollection({ name: '查找测试' });
      const found = collectionPlugin.getCollection(collection.id);
      expect(found.name).toBe('查找测试');
    });

    test('不存在的合集应返回 undefined', () => {
      expect(collectionPlugin.getCollection('nonexistent')).toBeUndefined();
    });
  });

  describe('getCollections()', () => {
    test('应该返回所有合集', () => {
      collectionPlugin.createCollection({ name: '合集1' });
      collectionPlugin.createCollection({ name: '合集2' });
      expect(collectionPlugin.getCollections().length).toBe(2);
    });
  });

  describe('getCollectionNodes()', () => {
    test('应该返回合集中的节点数据', () => {
      const collection = collectionPlugin.createCollection({ name: '测试' });
      collectionPlugin.addNodeToCollection(collection.id, 'node1');
      collectionPlugin.addNodeToCollection(collection.id, 'node2');

      const nodes = collectionPlugin.getCollectionNodes(collection.id);
      expect(nodes.length).toBe(2);
      expect(nodes.map(n => n.name)).toEqual(expect.arrayContaining(['秦朝统一', '唐朝建立']));
    });

    test('应该过滤不存在的节点', () => {
      const collection = collectionPlugin.createCollection({ name: '测试' });
      collectionPlugin.addNodeToCollection(collection.id, 'node1');
      collectionPlugin.addNodeToCollection(collection.id, 'nonexistent');

      const nodes = collectionPlugin.getCollectionNodes(collection.id);
      expect(nodes.length).toBe(1);
    });

    test('不存在的合集应返回空数组', () => {
      expect(collectionPlugin.getCollectionNodes('nonexistent')).toEqual([]);
    });
  });

  describe('持久化测试', () => {
    test('应该在初始化时加载 localStorage 数据', () => {
      // 先保存一些数据
      localStorage.setItem(CollectionPlugin.FAVORITES_KEY, JSON.stringify(['node1', 'node2']));
      localStorage.setItem(CollectionPlugin.STORAGE_KEY, JSON.stringify([
        { id: 'collection_1', name: '已存在合集', nodes: ['node3'] }
      ]));

      const newPlugin = new CollectionPlugin(mockApp);
      expect(newPlugin.favorites.has('node1')).toBe(true);
      expect(newPlugin.favorites.has('node2')).toBe(true);
      expect(newPlugin.collections.length).toBe(1);
      expect(newPlugin.collections[0].name).toBe('已存在合集');

      newPlugin.destroy();
    });

    test('应该处理损坏的 localStorage 数据', () => {
      localStorage.setItem(CollectionPlugin.FAVORITES_KEY, 'invalid json{{{');
      localStorage.setItem(CollectionPlugin.STORAGE_KEY, 'also invalid');

      expect(() => {
        const newPlugin = new CollectionPlugin(mockApp);
        newPlugin.destroy();
      }).not.toThrow();
    });

    test('收藏和合集应该独立持久化', () => {
      collectionPlugin.toggleFavorite('node1');
      collectionPlugin.createCollection({ name: '合集' });

      // 清除实例重建
      collectionPlugin.destroy();
      const newPlugin = new CollectionPlugin(mockApp);

      expect(newPlugin.favorites.has('node1')).toBe(true);
      expect(newPlugin.collections.length).toBe(1);

      newPlugin.destroy();
    });
  });

  describe('面板操作', () => {
    test('showPanel 应该切换面板可见性', () => {
      collectionPlugin.showPanel();
      expect(collectionPlugin.isVisible).toBe(true);

      collectionPlugin.showPanel();
      expect(collectionPlugin.isVisible).toBe(false);
    });

    test('hidePanel 应该隐藏面板', () => {
      collectionPlugin.showPanel();
      collectionPlugin.hidePanel();
      expect(collectionPlugin.isVisible).toBe(false);
      expect(collectionPlugin.uiContainer).toBeNull();
    });

    test('hidePanel 在未显示时应该安全运行', () => {
      expect(() => collectionPlugin.hidePanel()).not.toThrow();
    });
  });

  describe('destroy()', () => {
    test('应该清理状态', () => {
      collectionPlugin.toggleFavorite('node1');
      collectionPlugin.createCollection({ name: '测试' });
      collectionPlugin.destroy();

      expect(collectionPlugin.favorites.size).toBe(0);
      expect(collectionPlugin.collections.length).toBe(0);
    });

    test('应该隐藏面板', () => {
      collectionPlugin.showPanel();
      collectionPlugin.destroy();
      expect(collectionPlugin.isVisible).toBe(false);
    });
  });

  describe('setupGlobalActions()', () => {
    test('应该监听 node:card:render 事件', () => {
      expect(mockApp.eventBus.on).toHaveBeenCalledWith('node:card:render', expect.any(Function));
    });
  });

  describe('颜色和图标配置', () => {
    test('所有颜色应有 name、value 和 gradient', () => {
      CollectionPlugin.COLLECTION_COLORS.forEach(c => {
        expect(c).toHaveProperty('name');
        expect(c).toHaveProperty('value');
        expect(c).toHaveProperty('gradient');
        expect(c.value).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    test('所有图标应有 id、icon 和 name', () => {
      CollectionPlugin.COLLECTION_ICONS.forEach(icon => {
        expect(icon).toHaveProperty('id');
        expect(icon).toHaveProperty('icon');
        expect(icon).toHaveProperty('name');
      });
    });
  });

  describe('集成测试', () => {
    test('完整的收藏+合集流程', () => {
      // 收藏节点
      collectionPlugin.toggleFavorite('node1');
      collectionPlugin.toggleFavorite('node2');
      expect(collectionPlugin.getFavorites().length).toBe(2);

      // 创建合集并添加节点
      const collection = collectionPlugin.createCollection({ name: '重要事件', description: '收藏的事件合集' });
      collectionPlugin.addNodeToCollection(collection.id, 'node1');
      collectionPlugin.addNodeToCollection(collection.id, 'node3');

      // 验证
      expect(collectionPlugin.getCollections().length).toBe(1);
      const nodes = collectionPlugin.getCollectionNodes(collection.id);
      expect(nodes.length).toBe(2);

      // 更新合集
      collectionPlugin.updateCollection(collection.id, { name: '更新后名称' });
      expect(collectionPlugin.getCollection(collection.id).name).toBe('更新后名称');

      // 移除节点
      collectionPlugin.removeNodeFromCollection(collection.id, 'node1');
      expect(collectionPlugin.getCollectionNodes(collection.id).length).toBe(1);

      // 删除合集
      collectionPlugin.deleteCollection(collection.id);
      expect(collectionPlugin.getCollections().length).toBe(0);

      // 收藏仍在
      expect(collectionPlugin.favorites.has('node1')).toBe(true);
    });

    test('数据应在插件重建后保持一致', () => {
      collectionPlugin.toggleFavorite('node1');
      const c = collectionPlugin.createCollection({ name: '持久化测试' });
      collectionPlugin.addNodeToCollection(c.id, 'node2');

      collectionPlugin.destroy();
      const newPlugin = new CollectionPlugin(mockApp);

      expect(newPlugin.favorites.has('node1')).toBe(true);
      expect(newPlugin.collections.length).toBe(1);
      expect(newPlugin.collections[0].nodes).toContain('node2');

      newPlugin.destroy();
    });
  });
});
