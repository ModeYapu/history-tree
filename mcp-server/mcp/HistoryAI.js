/**
 * 历史AI服务
 * 提供AI驱动的历史分析、问答和推荐功能
 */

import AIService from './AIService.js';

export default class HistoryAI {
  constructor() {
    this.ai = new AIService();
    this.cache = new Map();
    
    // AI配置
    this.config = {
      maxTokens: 4096,
      temperature: 0.7,
      enableCache: true
    };
  }

  /**
   * 分析关联关系
   */
  async analyzeConnections(nodeId, depth = 2, includeAiAnalysis = true) {
    const connections = {
      local: [],
      ai_discovered: []
    };

    // 1. 基于数据的关系
    connections.local = await this.findLocalConnections(nodeId);

    // 2. AI发现的关系
    if (includeAiAnalysis) {
      connections.ai_discovered = await this.findAIConnections(nodeId, depth);
    }

    // 3. 计算关联强度
    return this.calculateConnectionStrength(connections);
  }

  /**
   * 本地关联发现
   */
  async findLocalConnections(nodeId) {
    // 实际实现中应该从知识库查询
    return [
      {
        target_id: 'node_2',
        type: 'cause',
        strength: 0.9,
        evidence: '直接因果关系'
      },
      {
        target_id: 'node_3',
        type: 'related',
        strength: 0.7,
        evidence: '共同历史背景'
      }
    ];
  }

  /**
   * AI关联发现
   */
  async findAIConnections(nodeId, depth) {
    // 使用AI模型发现深层关联
    const prompt = `分析历史事件 ${nodeId} 的关联关系：
    
请找出：
1. 直接影响的事件
2. 间接影响的事件（2-3度关系）
3. 同时期相似事件
4. 跨时代的类似事件

返回JSON格式的关联列表。`;

    try {
      // 这里应该调用实际的AI API
      // const response = await this.callAI(prompt);
      
      // 模拟AI响应
      return [
        {
          target_id: 'node_4',
          type: 'ai_similar',
          strength: 0.8,
          evidence: 'AI分析：相似的社会变革模式',
          depth: 2
        },
        {
          target_id: 'node_5',
          type: 'ai_influence',
          strength: 0.6,
          evidence: 'AI分析：跨时代的思想影响',
          depth: 3
        }
      ];
    } catch (error) {
      console.error('AI分析失败:', error);
      return [];
    }
  }

  /**
   * 计算关联强度
   */
  calculateConnectionStrength(connections) {
    const all = [...connections.local, ...connections.ai_discovered];
    
    // 按强度排序
    all.sort((a, b) => b.strength - a.strength);
    
    return {
      total: all.length,
      local_count: connections.local.length,
      ai_count: connections.ai_discovered.length,
      connections: all
    };
  }

  /**
   * 回答历史问题
   */
  async answerQuestion(question, context = {}) {
    // 构建提示
    const prompt = this.buildQuestionPrompt(question, context);

    try {
      // 调用AI
      const answer = await this.callAI(prompt);
      
      return {
        question: question,
        answer: answer,
        confidence: 0.85,
        sources: context.related_nodes || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`问答失败: ${error.message}`);
    }
  }

  /**
   * 构建问答提示
   */
  buildQuestionPrompt(question, context) {
    let prompt = `你是一个专业的 historians 助手，请回答以下历史问题：

问题：${question}

`;

    if (context.related_nodes && context.related_nodes.length > 0) {
      prompt += `相关背景信息：\n`;
      prompt += context.related_nodes.map(id => `- 节点: ${id}`).join('\n');
      prompt += '\n\n';
    }

    if (context.time_period) {
      prompt += `时间范围：${context.time_period}\n\n`;
    }

    prompt += `请提供：
1. 直接答案
2. 历史背景
3. 相关事件
4. 参考来源（如有）`;

    return prompt;
  }

  /**
   * 内容推荐
   */
  async recommend(interests, currentNodeId = null, limit = 5) {
    const recommendations = [];

    // 基于兴趣的推荐
    for (const interest of interests) {
      const related = await this.findByInterest(interest, 3);
      recommendations.push(...related);
    }

    // 如果有当前节点，基于上下文推荐
    if (currentNodeId) {
      const contextual = await this.findByContext(currentNodeId, 2);
      recommendations.push(...contextual);
    }

    // 去重和排序
    const unique = this.deduplicateAndSort(recommendations);
    
    return unique.slice(0, limit);
  }

  /**
   * 基于兴趣查找
   */
  async findByInterest(interest, limit) {
    // 实际实现中应该使用AI或知识库查询
    return [
      {
        id: 'rec_1',
        name: `${interest}相关事件1`,
        relevance: 0.9,
        reason: `与您的兴趣"${interest}"高度相关`
      },
      {
        id: 'rec_2',
        name: `${interest}相关事件2`,
        relevance: 0.8,
        reason: `展现了${interest}的发展历程`
      }
    ];
  }

  /**
   * 基于上下文查找
   */
  async findByContext(nodeId, limit) {
    return [
      {
        id: 'rec_3',
        name: '上下文相关事件',
        relevance: 0.85,
        reason: '与当前查看的内容相关'
      }
    ];
  }

  /**
   * 去重和排序
   */
  deduplicateAndSort(recommendations) {
    const seen = new Set();
    const unique = [];

    for (const rec of recommendations) {
      if (!seen.has(rec.id)) {
        seen.add(rec.id);
        unique.push(rec);
      }
    }

    return unique.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * 对比事件
   */
  async compareEvents(eventIds, aspects = []) {
    if (eventIds.length < 2) {
      throw new Error('至少需要2个事件进行对比');
    }

    const comparison = {
      events: [],
      aspects: {},
      similarities: [],
      differences: []
    };

    // 获取事件详情
    for (const id of eventIds) {
      // 实际实现中应该从知识库获取
      comparison.events.push({
        id: id,
        name: `事件 ${id}`
      });
    }

    // 对比各个维度
    if (aspects.includes('cause')) {
      comparison.aspects.causes = await this.compareCauses(eventIds);
    }
    
    if (aspects.includes('effect')) {
      comparison.aspects.effects = await this.compareEffects(eventIds);
    }
    
    if (aspects.includes('significance')) {
      comparison.aspects.significance = await this.compareSignificance(eventIds);
    }

    // 使用AI找出相似点和不同点
    if (aspects.includes('similarity')) {
      comparison.similarities = await this.findSimilarities(eventIds);
    }
    
    if (aspects.includes('difference')) {
      comparison.differences = await this.findDifferences(eventIds);
    }

    return comparison;
  }

  /**
   * 对比原因
   */
  async compareCauses(eventIds) {
    // 实际实现中应该使用AI分析
    return {
      common: ['共同的社会背景'],
      unique: eventIds.map(id => ({
        event: id,
        causes: ['特定原因']
      }))
    };
  }

  /**
   * 对比影响
   */
  async compareEffects(eventIds) {
    return {
      common: ['都产生了深远影响'],
      unique: eventIds.map(id => ({
        event: id,
        effects: ['特定影响']
      }))
    };
  }

  /**
   * 对比意义
   */
  async compareSignificance(eventIds) {
    return {
      comparison: '这些事件在各自的时代都具有重要意义'
    };
  }

  /**
   * 找出相似点
   */
  async findSimilarities(eventIds) {
    // 使用AI找出相似点
    return [
      '发生背景相似',
      '影响范围相近',
      '历史意义相当'
    ];
  }

  /**
   * 找出不同点
   */
  async findDifferences(eventIds) {
    return [
      '发生时间不同',
      '具体原因有差异',
      '影响方向不同'
    ];
  }

  /**
   * 追踪影响链
   */
  async traceInfluence(nodeId, direction = 'both', maxDepth = 3) {
    const chain = {
      source: nodeId,
      direction: direction,
      depth: 0,
      nodes: []
    };

    // 前向追踪（影响）
    if (direction === 'forward' || direction === 'both') {
      chain.forward = await this.traceForward(nodeId, maxDepth);
    }

    // 后向追踪（被影响）
    if (direction === 'backward' || direction === 'both') {
      chain.backward = await this.traceBackward(nodeId, maxDepth);
    }

    return chain;
  }

  /**
   * 前向追踪
   */
  async traceForward(nodeId, maxDepth, currentDepth = 0) {
    if (currentDepth >= maxDepth) return [];

    const effects = await this.getEffects(nodeId);
    const result = [];

    for (const effect of effects) {
      result.push({
        id: effect.id,
        name: effect.name,
        depth: currentDepth + 1,
        relationship: 'influences',
        children: await this.traceForward(effect.id, maxDepth, currentDepth + 1)
      });
    }

    return result;
  }

  /**
   * 后向追踪
   */
  async traceBackward(nodeId, maxDepth, currentDepth = 0) {
    if (currentDepth >= maxDepth) return [];

    const causes = await this.getCauses(nodeId);
    const result = [];

    for (const cause of causes) {
      result.push({
        id: cause.id,
        name: cause.name,
        depth: currentDepth + 1,
        relationship: 'influenced_by',
        children: await this.traceBackward(cause.id, maxDepth, currentDepth + 1)
      });
    }

    return result;
  }

  /**
   * 获取影响
   */
  async getEffects(nodeId) {
    // 实际实现中应该从知识库查询
    return [
      { id: 'effect_1', name: '直接影响事件' }
    ];
  }

  /**
   * 获取原因
   */
  async getCauses(nodeId) {
    return [
      { id: 'cause_1', name: '直接原因事件' }
    ];
  }

  /**
   * 调用AI API
   */
  async callAI(prompt) {
    try {
      return await this.ai.call(prompt, {
        maxTokens: this.config.maxTokens,
        temperature: this.config.temperature,
        systemPrompt: '你是一个专业的历史学家助手，精通中国历史和世界历史。'
      });
    } catch (error) {
      console.error('AI调用失败:', error);
      // 如果API失败，返回友好的错误信息
      return `抱歉，AI服务暂时不可用。请检查API配置。\n\n错误: ${error.message}`;
    }
  }
}
