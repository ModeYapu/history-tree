/**
 * RAG系统 - 检索增强生成
 */

import AIService from './AIService.js';

export class RAGSystem {
  constructor() {
    this.ai = new AIService();
    this.documentStore = new Map();
    this.vectorStore = new Map();
    this.cache = new Map();
  }

  /**
   * 索引知识库
   */
  async indexKnowledge(documents) {
    console.log(`📚 开始索引 ${documents.length} 个文档...`);

    for (const doc of documents) {
      // 1. 存储原文
      this.documentStore.set(doc.id, doc);

      // 2. 生成向量（简化版，实际应使用专业向量数据库）
      const vector = await this.generateSimpleVector(doc.content);
      this.vectorStore.set(doc.id, {
        vector,
        metadata: {
          id: doc.id,
          name: doc.name,
          year: doc.year,
          category: doc.category
        }
      });
    }

    console.log(`✅ 索引完成: ${this.documentStore.size} 个文档`);
  }

  /**
   * 检索相关文档
   */
  async retrieve(query, topK = 5) {
    // 1. 检查缓存
    const cacheKey = `retrieve:${query}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 2. 查询向量化
    const queryVector = await this.generateSimpleVector(query);

    // 3. 向量检索
    const results = [];
    for (const [id, data] of this.vectorStore) {
      const similarity = this.cosineSimilarity(queryVector, data.vector);
      results.push({
        id,
        similarity,
        metadata: data.metadata
      });
    }

    // 4. 排序并取TopK
    results.sort((a, b) => b.similarity - a.similarity);
    const topResults = results.slice(0, topK);

    // 5. 获取完整文档
    const documents = topResults.map(r => ({
      ...r,
      document: this.documentStore.get(r.id)
    }));

    // 6. 缓存结果
    this.cache.set(cacheKey, documents);

    return documents;
  }

  /**
   * RAG生成
   */
  async generate(query, options = {}) {
    const {
      topK = 5,
      temperature = 0.5,
      maxTokens = 4000
    } = options;

    // 1. 检索相关文档
    const contexts = await this.retrieve(query, topK);

    // 2. 构建增强提示
    const contextText = contexts
      .map((c, i) => `[${i + 1}] ${c.document.name}: ${c.document.content}`)
      .join('\n\n');

    const prompt = `基于以下参考资料回答问题：

参考资料：
${contextText}

问题：${query}

要求：
1. 基于参考资料回答
2. 标注信息来源
3. 如果参考资料不足，明确说明
4. 提供准确的历史信息`;

    // 3. 生成回答
    const answer = await this.ai.call(prompt, {
      temperature,
      maxTokens,
      systemPrompt: '你是专业的历史学家，基于可靠的历史资料回答问题。'
    });

    return {
      answer,
      sources: contexts.map(c => ({
        id: c.id,
        name: c.metadata.name,
        relevance: c.similarity
      })),
      confidence: this.calculateConfidence(contexts)
    };
  }

  /**
   * 生成简单向量（演示用）
   * 实际应用中应使用 text-embedding-3-large 等专业模型
   */
  async generateSimpleVector(text) {
    // 简化的TF-IDF向量
    const words = text.toLowerCase().split(/\s+/);
    const tf = {};
    
    words.forEach(word => {
      tf[word] = (tf[word] || 0) + 1;
    });

    // 返回简化的向量表示
    return tf;
  }

  /**
   * 计算余弦相似度
   */
  cosineSimilarity(vec1, vec2) {
    const keys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    keys.forEach(key => {
      const v1 = vec1[key] || 0;
      const v2 = vec2[key] || 0;
      
      dotProduct += v1 * v2;
      norm1 += v1 * v1;
      norm2 += v2 * v2;
    });

    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * 计算置信度
   */
  calculateConfidence(contexts) {
    if (contexts.length === 0) return 0;
    
    const avgSimilarity = contexts.reduce((sum, c) => sum + c.similarity, 0) / contexts.length;
    return Math.min(avgSimilarity * 1.2, 1); // 简单的置信度计算
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      documents: this.documentStore.size,
      vectors: this.vectorStore.size,
      cacheSize: this.cache.size
    };
  }
}

export default RAGSystem;
