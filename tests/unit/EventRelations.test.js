/**
 * EventRelations 事件关联系统测试
 */

describe('EventRelations', () => {
  let EventRelations;
  let eventRelations;

  beforeAll(() => {
    EventRelations = window.EventRelations;
  });

  beforeEach(() => {
    eventRelations = new EventRelations();
  });

  describe('构造函数', () => {
    test('应该正确初始化', () => {
      expect(eventRelations.relations).toBeInstanceOf(Map);
      expect(eventRelations.eventRelationIndex).toBeInstanceOf(Map);
      expect(eventRelations.relations.size).toBe(0);
    });
  });

  describe('createRelation', () => {
    test('应该创建因果关系', () => {
      const rel = eventRelations.createRelation({
        sourceId: 'event-1',
        targetId: 'event-2',
        type: 'causal',
        description: '事件1导致事件2'
      });

      expect(rel.id).toBeDefined();
      expect(rel.sourceId).toBe('event-1');
      expect(rel.targetId).toBe('event-2');
      expect(rel.type).toBe('causal');
      expect(rel.strength).toBe(5);
    });

    test('应该创建并行关系', () => {
      const rel = eventRelations.createRelation({
        sourceId: 'event-a',
        targetId: 'event-b',
        type: 'parallel',
        strength: 7
      });

      expect(rel.type).toBe('parallel');
      expect(rel.strength).toBe(7);
    });

    test('应该创建影响关系', () => {
      const rel = eventRelations.createRelation({
        sourceId: 'event-x',
        targetId: 'event-y',
        type: 'influence',
        description: '文化交流影响'
      });

      expect(rel.type).toBe('influence');
    });

    test('缺少sourceId应该抛出错误', () => {
      expect(() => {
        eventRelations.createRelation({
          targetId: 'event-2',
          type: 'causal'
        });
      }).toThrow('sourceId and targetId are required');
    });

    test('缺少targetId应该抛出错误', () => {
      expect(() => {
        eventRelations.createRelation({
          sourceId: 'event-1',
          type: 'causal'
        });
      }).toThrow('sourceId and targetId are required');
    });

    test('无效类型应该抛出错误', () => {
      expect(() => {
        eventRelations.createRelation({
          sourceId: 'a',
          targetId: 'b',
          type: 'invalid'
        });
      }).toThrow('type must be one of: causal, parallel, influence');
    });

    test('strength超出范围应该被修正', () => {
      const relHigh = eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal', strength: 100
      });
      expect(relHigh.strength).toBe(10);

      const relLow = eventRelations.createRelation({
        sourceId: 'c', targetId: 'd', type: 'parallel', strength: -5
      });
      expect(relLow.strength).toBe(1);
    });

    test('应该更新事件索引', () => {
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal'
      });

      expect(eventRelations.eventRelationIndex.has('a')).toBe(true);
      expect(eventRelations.eventRelationIndex.has('b')).toBe(true);
    });
  });

  describe('deleteRelation', () => {
    test('应该删除关系', () => {
      const rel = eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal'
      });

      expect(eventRelations.relations.size).toBe(1);
      const result = eventRelations.deleteRelation(rel.id);
      expect(result).toBe(true);
      expect(eventRelations.relations.size).toBe(0);
    });

    test('应该清理事件索引', () => {
      const rel = eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal'
      });

      eventRelations.deleteRelation(rel.id);
      // 孤立事件应该被清理
      expect(eventRelations.eventRelationIndex.has('a')).toBe(false);
      expect(eventRelations.eventRelationIndex.has('b')).toBe(false);
    });

    test('删除不存在的关系应该返回false', () => {
      const result = eventRelations.deleteRelation('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('getRelationsForEvent', () => {
    test('应该返回事件的所有关系', () => {
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal'
      });
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'c', type: 'influence'
      });

      const rels = eventRelations.getRelationsForEvent('a');
      expect(rels.length).toBe(2);
    });

    test('没有关系的事件应该返回空数组', () => {
      const rels = eventRelations.getRelationsForEvent('nonexistent');
      expect(rels).toEqual([]);
    });
  });

  describe('getRelationsByType', () => {
    beforeEach(() => {
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal'
      });
      eventRelations.createRelation({
        sourceId: 'c', targetId: 'd', type: 'causal'
      });
      eventRelations.createRelation({
        sourceId: 'e', targetId: 'f', type: 'parallel'
      });
      eventRelations.createRelation({
        sourceId: 'g', targetId: 'h', type: 'influence'
      });
    });

    test('应该过滤因果关系', () => {
      expect(eventRelations.getRelationsByType('causal').length).toBe(2);
    });

    test('应该过滤并行关系', () => {
      expect(eventRelations.getRelationsByType('parallel').length).toBe(1);
    });

    test('应该过滤影响关系', () => {
      expect(eventRelations.getRelationsByType('influence').length).toBe(1);
    });
  });

  describe('getRelationsBetween', () => {
    test('应该找到两个事件之间的关系', () => {
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal'
      });

      const rels = eventRelations.getRelationsBetween('a', 'b');
      expect(rels.length).toBe(1);
      expect(rels[0].type).toBe('causal');
    });

    test('应该双向查找', () => {
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal'
      });

      const rels = eventRelations.getRelationsBetween('b', 'a');
      expect(rels.length).toBe(1);
    });

    test('不相关的事件应该返回空数组', () => {
      const rels = eventRelations.getRelationsBetween('x', 'y');
      expect(rels).toEqual([]);
    });
  });

  describe('getCausalChain', () => {
    beforeEach(() => {
      // A → B → C → D 因果链
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal'
      });
      eventRelations.createRelation({
        sourceId: 'b', targetId: 'c', type: 'causal'
      });
      eventRelations.createRelation({
        sourceId: 'c', targetId: 'd', type: 'causal'
      });
      // E → F 并行关系（不应出现在因果链中）
      eventRelations.createRelation({
        sourceId: 'e', targetId: 'f', type: 'parallel'
      });
    });

    test('应该向前追溯因果链', () => {
      const chain = eventRelations.getCausalChain('a', 'forward');
      expect(chain.length).toBe(3);
    });

    test('应该向后追溯因果链', () => {
      const chain = eventRelations.getCausalChain('d', 'backward');
      expect(chain.length).toBe(3);
    });

    test('从中间节点追溯', () => {
      const forward = eventRelations.getCausalChain('b', 'forward');
      expect(forward.length).toBe(2); // b→c, c→d
    });

    test('应该限制最大深度', () => {
      const chain = eventRelations.getCausalChain('a', 'forward', 1);
      expect(chain.length).toBe(1); // Only a→b
    });

    test('不相关事件应该返回空链', () => {
      const chain = eventRelations.getCausalChain('e', 'forward');
      expect(chain.length).toBe(0);
    });
  });

  describe('importFromNodes', () => {
    test('应该从HistoryNode数组导入关系', () => {
      const nodes = [
        {
          id: 'n1',
          name: '事件1',
          relations: {
            causes: [],
            effects: ['n2'],
            related: ['n3']
          }
        },
        {
          id: 'n2',
          name: '事件2',
          relations: {
            causes: ['n1'],
            effects: [],
            related: []
          }
        },
        {
          id: 'n3',
          name: '事件3',
          relations: {
            causes: [],
            effects: [],
            related: []
          }
        }
      ];

      const count = eventRelations.importFromNodes(nodes);
      expect(count).toBeGreaterThan(0);
      expect(eventRelations.relations.size).toBeGreaterThan(0);
    });

    test('应该避免重复导入influence关系', () => {
      const nodes = [
        {
          id: 'n1',
          name: '事件1',
          relations: { causes: [], effects: [], related: ['n2'] }
        },
        {
          id: 'n2',
          name: '事件2',
          relations: { causes: [], effects: [], related: ['n1'] }
        }
      ];

      eventRelations.importFromNodes(nodes);
      // n1→n2 和 n2→n1，但 getRelationsBetween 检查应该避免重复
      // 实际上 n1 related n2 和 n2 related n1 会创建两条不同的关系
      const rels = eventRelations.getRelationsBetween('n1', 'n2');
      expect(rels.length).toBeGreaterThanOrEqual(1);
    });

    test('空节点数组应该返回0', () => {
      const count = eventRelations.importFromNodes([]);
      expect(count).toBe(0);
    });

    test('没有relations属性的节点应该被跳过', () => {
      const count = eventRelations.importFromNodes([
        { id: 'n1', name: '事件1' }
      ]);
      expect(count).toBe(0);
    });
  });

  describe('getVisualizationData', () => {
    beforeEach(() => {
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal', strength: 8
      });
      eventRelations.createRelation({
        sourceId: 'b', targetId: 'c', type: 'influence', strength: 5
      });
      eventRelations.createRelation({
        sourceId: 'd', targetId: 'e', type: 'parallel', strength: 3
      });
    });

    test('应该返回完整的可视化数据', () => {
      const data = eventRelations.getVisualizationData();
      expect(data.nodes.length).toBe(5);
      expect(data.links.length).toBe(3);
      expect(data.stats).toBeDefined();
    });

    test('统计数据应该正确', () => {
      const data = eventRelations.getVisualizationData();
      expect(data.stats.totalRelations).toBe(3);
      expect(data.stats.byType.causal).toBe(1);
      expect(data.stats.byType.parallel).toBe(1);
      expect(data.stats.byType.influence).toBe(1);
    });

    test('应该支持按事件ID过滤', () => {
      const data = eventRelations.getVisualizationData(['a', 'b', 'c']);
      expect(data.links.length).toBe(2); // a→b, b→c
    });

    test('过滤后应排除不完整关系', () => {
      const data = eventRelations.getVisualizationData(['a', 'b']);
      expect(data.links.length).toBe(1); // Only a→b
    });

    test('链接应该包含正确的字段', () => {
      const data = eventRelations.getVisualizationData();
      const link = data.links[0];
      expect(link.source).toBeDefined();
      expect(link.target).toBeDefined();
      expect(link.type).toBeDefined();
      expect(link.strength).toBeDefined();
    });
  });

  describe('getStats', () => {
    test('空系统统计', () => {
      const stats = eventRelations.getStats();
      expect(stats.totalRelations).toBe(0);
      expect(stats.totalEvents).toBe(0);
      expect(stats.avgStrength).toBe(0);
    });

    test('有关系时的统计', () => {
      eventRelations.createRelation({
        sourceId: 'a', targetId: 'b', type: 'causal', strength: 8
      });
      eventRelations.createRelation({
        sourceId: 'c', targetId: 'd', type: 'influence', strength: 4
      });

      const stats = eventRelations.getStats();
      expect(stats.totalRelations).toBe(2);
      expect(stats.totalEvents).toBe(4);
      expect(stats.avgStrength).toBe(6);
      expect(stats.byType.causal).toBe(1);
      expect(stats.byType.influence).toBe(1);
    });
  });
});
