/**
 * HistoryNode 模型单元测试
 */

describe('HistoryNode', () => {
  let HistoryNode;

  beforeAll(() => {
    // 导入 HistoryNode
    HistoryNode = window.HistoryNode;
  });

  describe('构造函数', () => {
    test('应该使用默认值创建节点', () => {
      const node = new HistoryNode({});
      
      expect(node.id).toBeDefined();
      expect(node.type).toBe('event');
      expect(node.name).toBe('');
      expect(node.description).toBe('');
      expect(node.time.year).toBeNull();
      expect(node.metadata.importance).toBe(3);
      expect(node.children).toEqual([]);
    });

    test('应该使用提供的数据创建节点', () => {
      const data = {
        id: 'test-1',
        type: 'person',
        name: '秦始皇',
        description: '中国第一个皇帝',
        year: -221,
        category: 'politics',
        importance: 5
      };
      
      const node = new HistoryNode(data);
      
      expect(node.id).toBe('test-1');
      expect(node.type).toBe('person');
      expect(node.name).toBe('秦始皇');
      expect(node.description).toBe('中国第一个皇帝');
      expect(node.time.year).toBe(-221);
      expect(node.category.primary).toBe('politics');
      expect(node.metadata.importance).toBe(5);
    });

    test('应该正确处理嵌套结构', () => {
      const data = {
        name: '唐朝',
        children: [
          { name: '唐太宗' },
          { name: '唐玄宗' }
        ]
      };
      
      const node = new HistoryNode(data);
      
      expect(node.children).toHaveLength(2);
      expect(node.children[0].name).toBe('唐太宗');
      expect(node.children[1].name).toBe('唐玄宗');
    });
  });

  describe('generateId()', () => {
    test('应该生成唯一ID', () => {
      const node1 = new HistoryNode({});
      const node2 = new HistoryNode({});
      
      expect(node1.id).toBeDefined();
      expect(node2.id).toBeDefined();
      expect(node1.id).not.toBe(node2.id);
      expect(node1.id).toMatch(/^node_\d+_[a-z0-9]+$/);
    });
  });

  describe('formatDate()', () => {
    test('应该格式化公元前的年份', () => {
      const node = new HistoryNode({});
      
      expect(node.formatDate(-221)).toBe('公元前221年');
      expect(node.formatDate(-500)).toBe('公元前500年');
    });

    test('应该格式化公元后的年份', () => {
      const node = new HistoryNode({});
      
      expect(node.formatDate(2024)).toBe('2024年');
      expect(node.formatDate(1)).toBe('1年');
    });

    test('应该处理空值', () => {
      const node = new HistoryNode({});
      
      expect(node.formatDate(null)).toBe('');
      expect(node.formatDate(undefined)).toBe('');
    });
  });

  describe('incrementViews()', () => {
    test('应该增加浏览次数', () => {
      const node = new HistoryNode({});
      const initialViews = node.metadata.views;
      
      node.incrementViews();
      
      expect(node.metadata.views).toBe(initialViews + 1);
      
      node.incrementViews();
      node.incrementViews();
      
      expect(node.metadata.views).toBe(initialViews + 3);
    });
  });

  describe('like()', () => {
    test('应该增加点赞数', () => {
      const node = new HistoryNode({});
      const initialLikes = node.metadata.likes;
      
      node.like();
      
      expect(node.metadata.likes).toBe(initialLikes + 1);
    });
  });

  describe('toJSON()', () => {
    test('应该序列化节点为JSON', () => {
      const node = new HistoryNode({
        id: 'test-1',
        name: '测试节点',
        year: 2024
      });
      
      const json = node.toJSON();
      
      expect(json.id).toBe('test-1');
      expect(json.name).toBe('测试节点');
      expect(json.time.year).toBe(2024);
      expect(json.type).toBe('event');
    });

    test('应该递归序列化子节点', () => {
      const node = new HistoryNode({
        name: '父节点',
        children: [
          { name: '子节点1' },
          { name: '子节点2' }
        ]
      });
      
      const json = node.toJSON();
      
      expect(json.children).toHaveLength(2);
      expect(json.children[0].name).toBe('子节点1');
      expect(json.children[1].name).toBe('子节点2');
    });
  });

  describe('fromJSON()', () => {
    test('应该从JSON反序列化节点', () => {
      const json = {
        id: 'test-1',
        name: '测试节点',
        type: 'person',
        time: { year: 2024 }
      };
      
      const node = HistoryNode.fromJSON(json);
      
      expect(node.id).toBe('test-1');
      expect(node.name).toBe('测试节点');
      expect(node.type).toBe('person');
      expect(node.time.year).toBe(2024);
    });

    test('应该递归反序列化子节点', () => {
      const json = {
        name: '父节点',
        children: [
          { name: '子节点1' },
          { name: '子节点2' }
        ]
      };
      
      const node = HistoryNode.fromJSON(json);
      
      expect(node.children).toHaveLength(2);
      expect(node.children[0]).toBeInstanceOf(HistoryNode);
      expect(node.children[1]).toBeInstanceOf(HistoryNode);
    });
  });

  describe('元数据', () => {
    test('应该正确初始化元数据', () => {
      const node = new HistoryNode({});
      
      expect(node.metadata.views).toBe(0);
      expect(node.metadata.likes).toBe(0);
      expect(node.metadata.createdAt).toBeDefined();
      expect(node.metadata.updatedAt).toBeDefined();
    });

    test('应该使用提供的importance值', () => {
      const node1 = new HistoryNode({ importance: 1 });
      const node2 = new HistoryNode({ importance: 5 });
      const node3 = new HistoryNode({});
      
      expect(node1.metadata.importance).toBe(1);
      expect(node2.metadata.importance).toBe(5);
      expect(node3.metadata.importance).toBe(3);
    });
  });

  describe('关系数据', () => {
    test('应该正确处理因果关系', () => {
      const node = new HistoryNode({
        causes: ['cause-1', 'cause-2'],
        effects: ['effect-1']
      });
      
      expect(node.relations.causes).toHaveLength(2);
      expect(node.relations.effects).toHaveLength(1);
    });

    test('应该正确处理相关节点', () => {
      const node = new HistoryNode({
        related: ['related-1', 'related-2', 'related-3']
      });
      
      expect(node.relations.related).toHaveLength(3);
    });
  });

  describe('多媒体数据', () => {
    test('应该正确处理图片', () => {
      const node = new HistoryNode({
        images: ['img1.jpg', 'img2.jpg']
      });
      
      expect(node.media.images).toHaveLength(2);
    });

    test('应该正确处理视频', () => {
      const node = new HistoryNode({
        videos: ['video1.mp4']
      });
      
      expect(node.media.videos).toHaveLength(1);
    });
  });
});
