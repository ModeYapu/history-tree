import DataLoader from './DataLoader.js';

export default class HistoryKnowledgeBase {
  constructor() {
    this.loader = new DataLoader();
    this.data = null;
  }

  async initialize() {
    this.data = await this.loader.loadAll();
    console.log(`✅ 知识库已初始化: ${this.data.nodes.size} 个节点`);
  }

  async search(query, filters = {}, limit = 10) {
    // 确保数据已加载
    if (!this.data) await this.initialize();
    
    // ... 原有搜索逻辑
  }
}
