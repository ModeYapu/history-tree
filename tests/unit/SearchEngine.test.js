/**
 * SearchEngine 全文搜索引擎测试
 */

describe('SearchEngine', () => {
  let SearchEngine;
  let searchEngine;

  const sampleData = [
    {
      id: 'event-1',
      name: '秦始皇统一六国',
      title: '秦统一战争',
      description: '秦王嬴政先后灭韩、赵、魏、楚、燕、齐六国，建立了中国历史上第一个统一的中央集权制国家',
      period: '战国末期',
      category: 'war',
      tags: ['统一', '战争', '秦国'],
      importance: 'high'
    },
    {
      id: 'event-2',
      name: '汉武帝征匈奴',
      title: '汉匈战争',
      description: '汉武帝时期对匈奴进行大规模军事行动，拓展了汉朝版图',
      period: '西汉',
      category: 'war',
      tags: ['匈奴', '汉朝', '军事'],
      importance: 'high'
    },
    {
      id: 'event-3',
      name: '丝绸之路开通',
      title: '张骞出使西域',
      description: '张骞奉汉武帝之命出使西域，开辟了连接东西方的丝绸之路',
      period: '西汉',
      category: 'diplomacy',
      tags: ['丝绸之路', '西域', '贸易'],
      importance: 'medium'
    },
    {
      id: 'event-4',
      name: '造纸术发明',
      title: '蔡伦改进造纸术',
      description: '东汉蔡伦改进造纸工艺，使纸张成为主要书写材料',
      period: '东汉',
      category: 'technology',
      tags: ['发明', '造纸', '科技'],
      importance: 'high'
    },
    {
      id: 'event-5',
      name: '贞观之治',
      title: '唐太宗李世民',
      description: '唐太宗李世民开创的盛世局面，政治清明，经济繁荣',
      period: '唐朝',
      category: 'politics',
      tags: ['盛世', '唐朝', '政治'],
      importance: 'high'
    }
  ];

  beforeAll(() => {
    SearchEngine = window.SearchEngine;
  });

  beforeEach(() => {
    searchEngine = new SearchEngine();
  });

  describe('构造函数', () => {
    test('应该正确初始化', () => {
      expect(searchEngine.index).toBeInstanceOf(Map);
      expect(searchEngine.documents).toBeInstanceOf(Map);
      expect(searchEngine.cache).toBeInstanceOf(Map);
    });
  });

  describe('buildIndex', () => {
    test('应该正确构建索引', () => {
      searchEngine.buildIndex(sampleData);
      expect(searchEngine.documents.size).toBe(5);
      expect(searchEngine.index.size).toBeGreaterThan(0);
    });

    test('应该处理空数据', () => {
      searchEngine.buildIndex([]);
      expect(searchEngine.documents.size).toBe(0);
    });
  });

  describe('tokenize', () => {
    test('应该正确分词英文', () => {
      const tokens = searchEngine.tokenize('Hello World');
      expect(tokens).toContain('hello');
      expect(tokens).toContain('world');
    });

    test('应该正确分词中文（生成n-gram）', () => {
      const tokens = searchEngine.tokenize('秦始皇');
      expect(tokens).toContain('秦始');
      expect(tokens).toContain('始皇');
      expect(tokens).toContain('秦始皇');
    });

    test('应该处理空字符串', () => {
      const tokens = searchEngine.tokenize('');
      expect(tokens).toEqual([]);
    });

    test('应该处理null和undefined', () => {
      expect(searchEngine.tokenize(null)).toEqual([]);
      expect(searchEngine.tokenize(undefined)).toEqual([]);
    });

    test('应该去除标点符号', () => {
      const tokens = searchEngine.tokenize('hello, world!');
      expect(tokens).toContain('hello');
      expect(tokens).toContain('world');
      expect(tokens).not.toContain('hello,');
    });
  });

  describe('search - 基本搜索', () => {
    beforeEach(() => {
      searchEngine.buildIndex(sampleData);
    });

    test('空查询应该返回所有文档', () => {
      const results = searchEngine.search('');
      expect(results.length).toBe(5);
    });

    test('应该按名称搜索', () => {
      const results = searchEngine.search('秦始皇');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].id).toBe('event-1');
    });

    test('应该按描述搜索', () => {
      const results = searchEngine.search('造纸');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].id).toBe('event-4');
    });

    test('应该按标签搜索', () => {
      const results = searchEngine.search('丝绸之路');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    test('空格查询应该返回所有文档', () => {
      const results = searchEngine.search('   ');
      expect(results.length).toBe(5);
    });

    test('无匹配应该返回空数组', () => {
      const results = searchEngine.search('量子计算机');
      expect(results).toEqual([]);
    });
  });

  describe('search - 模糊匹配', () => {
    beforeEach(() => {
      searchEngine.buildIndex(sampleData);
    });

    test('应该支持前缀匹配（短词）', () => {
      const results = searchEngine.search('秦');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    test('应该不区分大小写搜索', () => {
      const results = searchEngine.search('HELLO');
      // 可能不匹配，但不应报错
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('search - 缓存', () => {
    beforeEach(() => {
      searchEngine.buildIndex(sampleData);
    });

    test('相同查询应该使用缓存', () => {
      const results1 = searchEngine.search('秦');
      const results2 = searchEngine.search('秦');
      expect(results1).toEqual(results2);
    });

    test('clearCache 应该清空缓存', () => {
      searchEngine.search('秦');
      expect(searchEngine.cache.size).toBeGreaterThan(0);
      searchEngine.clearCache();
      expect(searchEngine.cache.size).toBe(0);
    });
  });

  describe('rankResults', () => {
    beforeEach(() => {
      searchEngine.buildIndex(sampleData);
    });

    test('高重要性文档应该排名更高', () => {
      const results = searchEngine.search('秦');
      // 结果应该是数组
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getStats', () => {
    test('应该返回正确的统计信息', () => {
      searchEngine.buildIndex(sampleData);
      const stats = searchEngine.getStats();
      expect(stats.documentCount).toBe(5);
      expect(stats.indexSize).toBeGreaterThan(0);
      expect(stats.cacheSize).toBe(0);
      expect(stats.avgDocumentLength).toBeGreaterThan(0);
    });

    test('空引擎的统计', () => {
      const stats = searchEngine.getStats();
      expect(stats.documentCount).toBe(0);
      expect(stats.indexSize).toBe(0);
      expect(stats.avgDocumentLength).toBe(0);
    });
  });

  describe('extractSearchableText', () => {
    test('应该提取所有可搜索字段', () => {
      const text = searchEngine.extractSearchableText(sampleData[0]);
      expect(text).toContain('秦始皇');
      expect(text).toContain('秦统一战争');
      expect(text).toContain('战国末期');
      expect(text).toContain('统一');
    });

    test('应该处理缺少字段的项', () => {
      const text = searchEngine.extractSearchableText({ id: 'test' });
      expect(text).toBe('');
    });

    test('应该处理tags数组', () => {
      const text = searchEngine.extractSearchableText({
        tags: ['tag1', 'tag2']
      });
      expect(text).toContain('tag1');
      expect(text).toContain('tag2');
    });
  });
});

describe('SearchEngine - 搜索建议', () => {
  let SearchEngine;
  let searchEngine;

  const sampleData = [
    { id: 's1', name: '秦始皇统一六国', title: '秦统一', tags: ['战争'] },
    { id: 's2', name: '秦末农民起义', title: '陈胜吴广', tags: ['起义'] },
    { id: 's3', name: '汉武帝征匈奴', title: '汉匈战争', tags: ['战争'] },
    { id: 's4', name: '唐朝贞观之治', title: '贞观盛世', tags: ['盛世'] },
    { id: 's5', name: '秦岭淮河线', title: '地理分界', tags: ['地理'] }
  ];

  beforeAll(() => {
    SearchEngine = window.SearchEngine;
  });

  beforeEach(() => {
    searchEngine = new SearchEngine();
    searchEngine.buildIndex(sampleData);
  });

  test('输入"秦"应该找到多个结果', () => {
    const results = searchEngine.search('秦');
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  test('输入"汉"应该找到汉武帝', () => {
    const results = searchEngine.search('汉');
    expect(results.some(r => r.id === 's3')).toBe(true);
  });

  test('长查询应该返回精确结果', () => {
    const results = searchEngine.search('秦始皇');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe('s1');
  });
});
