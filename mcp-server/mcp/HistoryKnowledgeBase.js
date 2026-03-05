/**
 * 历史知识库服务
 * 提供历史数据的查询、搜索和分析功能
 */

import DataLoader from './DataLoader.js';

export default class HistoryKnowledgeBase {
  constructor() {
    this.loader = new DataLoader();
    this.data = null;
    this.initialized = false;
  }

  /**
   * 初始化数据
   */
  async initialize() {
    if (this.initialized) return;
    
    this.data = await this.loader.loadAll();
    this.initialized = true;
    console.log(`✅ 知识库已初始化: ${this.data.nodes.size} 个节点`);
  }

  /**
   * 确保数据已加载
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * 搜索历史
   */
  async search(query, filters = {}, limit = 10) {
    await this.ensureInitialized();
    
    const results = [];
    const queryLower = query.toLowerCase();

    // 遍历所有节点
    for (const [id, node] of this.data.nodes) {
      // 检查是否匹配查询
      const matchesQuery = 
        node.name.toLowerCase().includes(queryLower) ||
        node.description.toLowerCase().includes(queryLower) ||
        node.category.tags.some(tag => tag.toLowerCase().includes(queryLower));

      // 检查是否匹配筛选条件
      const matchesFilters = this.matchesFilters(node, filters);

      if (matchesQuery && matchesFilters) {
        results.push({
          id: node.id,
          name: node.name,
          type: node.type,
          year: node.time.year,
          category: node.category.primary,
          importance: node.metadata.importance,
          summary: node.summary || node.description.substring(0, 200)
        });
      }

      if (results.length >= limit) break;
    }

    return results;
  }

  /**
   * 获取详细信息
   */
  async getDetail(id, includeRelations = true) {
    const node = this.data.nodes.get(id);
    
    if (!node) {
      return null;
    }

    const detail = {
      ...node,
      relations: includeRelations ? this.getRelations(id) : undefined
    };

    return detail;
  }

  /**
   * 获取关系
   */
  getRelations(id) {
    const relations = this.data.relations.get(id) || {
      causes: [],
      effects: [],
      related: [],
      participants: []
    };

    return relations;
  }

  /**
   * 生成时间线
   */
  async generateTimeline(theme, startYear, endYear, category, format = 'markdown') {
    const events = [];

    // 筛选事件
    for (const [id, node] of this.data.nodes) {
      const matchesTheme = !theme || 
        node.name.includes(theme) ||
        node.category.tags.includes(theme);
      
      const matchesYear = (!startYear || node.time.year >= startYear) &&
                          (!endYear || node.time.year <= endYear);
      
      const matchesCategory = !category || node.category.primary === category;

      if (matchesTheme && matchesYear && matchesCategory) {
        events.push({
          year: node.time.year,
          name: node.name,
          description: node.description,
          importance: node.metadata.importance
        });
      }
    }

    // 按年份排序
    events.sort((a, b) => a.year - b.year);

    // 格式化输出
    return this.formatTimeline(events, format);
  }

  /**
   * 格式化时间线
   */
  formatTimeline(events, format) {
    switch (format) {
      case 'json':
        return JSON.stringify(events, null, 2);
      
      case 'markdown':
        return events.map(e => 
          `## ${e.year < 0 ? `公元前${Math.abs(e.year)}年` : `${e.year}年`} - ${e.name}\n\n${e.description}\n`
        ).join('\n---\n\n');
      
      case 'html':
        return `
          <html>
            <head><title>历史时间线</title></head>
            <body>
              <h1>历史时间线</h1>
              <ul>
                ${events.map(e => `
                  <li>
                    <strong>${e.year < 0 ? `公元前${Math.abs(e.year)}年` : `${e.year}年`}</strong> - 
                    ${e.name}: ${e.description}
                  </li>
                `).join('')}
              </ul>
            </body>
          </html>
        `;
      
      default:
        return JSON.stringify(events, null, 2);
    }
  }

  /**
   * 获取统计信息
   */
  async getStatistics(type, filters = {}) {
    const stats = {
      total: this.data.nodes.size,
      byPeriod: {},
      byCategory: {},
      byRegion: {},
      byImportance: {}
    };

    // 统计各维度
    for (const [id, node] of this.data.nodes) {
      if (!this.matchesFilters(node, filters)) continue;

      // 按时期
      const period = node.time.period;
      stats.byPeriod[period] = (stats.byPeriod[period] || 0) + 1;

      // 按类别
      const category = node.category.primary;
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

      // 按地区
      const region = node.location.region;
      stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;

      // 按重要程度
      const importance = node.metadata.importance;
      stats.byImportance[importance] = (stats.byImportance[importance] || 0) + 1;
    }

    // 根据类型返回
    switch (type) {
      case 'period':
        return stats.byPeriod;
      case 'category':
        return stats.byCategory;
      case 'region':
        return stats.byRegion;
      case 'importance':
        return stats.byImportance;
      default:
        return stats;
    }
  }

  /**
   * 导出数据
   */
  async exportData(format, filters = {}, includeRelations = true) {
    const nodes = [];

    for (const [id, node] of this.data.nodes) {
      if (!this.matchesFilters(node, filters)) continue;

      const exportNode = { ...node };
      if (includeRelations) {
        exportNode.relations = this.getRelations(id);
      }
      nodes.push(exportNode);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(nodes, null, 2);
      
      case 'csv':
        return this.toCSV(nodes);
      
      case 'markdown':
        return this.toMarkdown(nodes);
      
      case 'graphml':
        return this.toGraphML(nodes);
      
      default:
        return JSON.stringify(nodes, null, 2);
    }
  }

  /**
   * 转换为CSV
   */
  toCSV(nodes) {
    const headers = ['id', 'name', 'year', 'category', 'importance', 'description'];
    const rows = nodes.map(n => 
      [n.id, n.name, n.time.year, n.category.primary, n.metadata.importance, n.description].join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * 转换为Markdown
   */
  toMarkdown(nodes) {
    return nodes.map(n => 
      `## ${n.name}\n\n` +
      `- **年份**: ${n.time.year}\n` +
      `- **类别**: ${n.category.primary}\n` +
      `- **重要程度**: ${n.metadata.importance}\n\n` +
      `${n.description}\n`
    ).join('\n---\n\n');
  }

  /**
   * 转换为GraphML
   */
  toGraphML(nodes) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <graph id="history-tree" edgedefault="directed">
    ${nodes.map(n => `
    <node id="${n.id}">
      <data key="name">${n.name}</data>
      <data key="year">${n.time.year}</data>
      <data key="category">${n.category.primary}</data>
    </node>
    `).join('')}
  </graph>
</graphml>`;
  }

  /**
   * 检查是否匹配筛选条件
   */
  matchesFilters(node, filters) {
    if (filters.period && node.time.period !== filters.period) return false;
    if (filters.category && node.category.primary !== filters.category) return false;
    if (filters.region && node.location.region !== filters.region) return false;
    if (filters.importance && node.metadata.importance !== filters.importance) return false;
    return true;
  }
}
