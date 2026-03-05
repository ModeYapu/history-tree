/**
 * 多Agent系统 - 专家协作架构
 */

import AIService from './AIService.js';

// 基础Agent类
class BaseAgent {
  constructor(config) {
    this.name = config.name;
    this.specialty = config.specialty;
    this.model = config.model || 'claude-3-5-sonnet-20241022';
    this.ai = new AIService();
    this.maxRetries = 3;
    this.timeout = 30000;
  }

  async execute(task) {
    throw new Error('Agent must implement execute method');
  }

  async retry(fn, retries = this.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
}

// 搜索专家Agent
export class SearchAgent extends BaseAgent {
  constructor() {
    super({
      name: 'SearchAgent',
      specialty: '历史搜索和信息检索',
      description: '精通历史文献检索，快速定位相关历史事件和人物'
    });
  }

  async execute(task) {
    const { query, filters, limit = 10 } = task;

    // 构建搜索提示
    const prompt = `作为历史搜索专家，请搜索关于"${query}"的历史信息。

筛选条件：${JSON.stringify(filters || {})}

要求：
1. 返回最相关的${limit}条结果
2. 包含事件名称、时间、地点、重要性
3. 按相关性和重要性排序
4. 提供简要说明

返回JSON格式结果。`;

    const response = await this.retry(() => 
      this.ai.call(prompt, {
        systemPrompt: '你是专业的历史搜索专家，精通中国历史和世界历史。',
        temperature: 0.3
      })
    );

    return {
      agent: this.name,
      type: 'search',
      results: this.parseResults(response),
      confidence: 0.9
    };
  }

  parseResults(response) {
    try {
      return JSON.parse(response);
    } catch {
      return { raw: response };
    }
  }
}

// 知识问答专家Agent
export class KnowledgeAgent extends BaseAgent {
  constructor() {
    super({
      name: 'KnowledgeAgent',
      specialty: '历史知识问答和解释',
      description: '深厚的历史知识储备，能深入浅出地解释历史事件'
    });
  }

  async execute(task) {
    const { question, context } = task;

    // RAG增强
    const contextText = context ? `\n\n参考信息：\n${context}` : '';

    const prompt = `作为历史知识专家，请回答以下问题：

${question}${contextText}

要求：
1. 回答准确、详细
2. 提供历史背景
3. 解释原因和影响
4. 引用可靠来源（如有）
5. 适当提供延伸信息`;

    const response = await this.retry(() =>
      this.ai.call(prompt, {
        systemPrompt: '你是资深历史学家，专精历史知识问答。',
        temperature: 0.5,
        maxTokens: 4000
      })
    );

    return {
      agent: this.name,
      type: 'qa',
      answer: response,
      confidence: 0.95
    };
  }
}

// 关联分析专家Agent
export class AnalysisAgent extends BaseAgent {
  constructor() {
    super({
      name: 'AnalysisAgent',
      specialty: '历史关联和因果分析',
      description: '擅长发现历史事件之间的深层联系和因果关系'
    });
  }

  async execute(task) {
    const { nodeId, depth = 2, data } = task;

    const prompt = `作为历史分析专家，请分析以下历史节点的关联关系：

节点数据：${JSON.stringify(data)}
分析深度：${depth}层

请分析：
1. 直接因果关系（原因和结果）
2. 同时期相似事件
3. 跨时代影响
4. 深层历史规律

返回详细的关联分析报告。`;

    const response = await this.retry(() =>
      this.ai.call(prompt, {
        systemPrompt: '你是历史分析专家，擅长发现历史事件的深层联系。',
        temperature: 0.7,
        maxTokens: 4000
      })
    );

    return {
      agent: this.name,
      type: 'analysis',
      analysis: response,
      depth,
      confidence: 0.85
    };
  }
}

// 时间线专家Agent
export class TimelineAgent extends BaseAgent {
  constructor() {
    super({
      name: 'TimelineAgent',
      specialty: '时间线生成和历史脉络梳理',
      description: '精通历史时序，能够构建清晰的历史发展脉络'
    });
  }

  async execute(task) {
    const { theme, startYear, endYear, format = 'markdown' } = task;

    const prompt = `作为时间线专家，请生成关于"${theme}"的历史时间线。

时间范围：${startYear || '不限'} - ${endYear || '不限'}
格式：${format}

要求：
1. 按时间顺序排列
2. 标注关键节点
3. 说明重要程度
4. 提供简明描述
5. 突出历史脉络

生成${format}格式的时间线。`;

    const response = await this.retry(() =>
      this.ai.call(prompt, {
        systemPrompt: '你是历史时间线专家，擅长梳理历史发展脉络。',
        temperature: 0.4,
        maxTokens: 6000
      })
    );

    return {
      agent: this.name,
      type: 'timeline',
      timeline: response,
      format,
      confidence: 0.9
    };
  }
}

// 推荐专家Agent
export class RecommendAgent extends BaseAgent {
  constructor() {
    super({
      name: 'RecommendAgent',
      specialty: '个性化历史内容推荐',
      description: '基于用户兴趣和行为，推荐相关的历史内容'
    });
  }

  async execute(task) {
    const { interests, currentContext, limit = 5 } = task;

    const prompt = `作为推荐专家，请根据用户兴趣推荐历史内容。

用户兴趣：${interests.join(', ')}
当前上下文：${currentContext || '无'}
推荐数量：${limit}

要求：
1. 高度相关性
2. 多样化
3. 渐进式难度
4. 提供推荐理由
5. 标注推荐等级

返回JSON格式的推荐列表。`;

    const response = await this.retry(() =>
      this.ai.call(prompt, {
        systemPrompt: '你是历史内容推荐专家，了解用户偏好。',
        temperature: 0.6
      })
    );

    return {
      agent: this.name,
      type: 'recommend',
      recommendations: this.parseResults(response),
      confidence: 0.8
    };
  }

  parseResults(response) {
    try {
      return JSON.parse(response);
    } catch {
      return { raw: response };
    }
  }
}

// 教育专家Agent
export class EducationAgent extends BaseAgent {
  constructor() {
    super({
      name: 'EducationAgent',
      specialty: '历史教育和学习路径规划',
      description: '专业的教育能力，能够设计有效的历史学习路径'
    });
  }

  async execute(task) {
    const { topic, level = 'intermediate', goals } = task;

    const prompt = `作为历史教育专家，请设计关于"${topic}"的学习方案。

学习水平：${level}
学习目标：${goals || '全面了解'}

请提供：
1. 学习路径
2. 关键知识点
3. 推荐资源
4. 练习题
5. 评估标准

返回结构化的学习方案。`;

    const response = await this.retry(() =>
      this.ai.call(prompt, {
        systemPrompt: '你是资深历史教育专家，擅长设计学习路径。',
        temperature: 0.5,
        maxTokens: 5000
      })
    );

    return {
      agent: this.name,
      type: 'education',
      curriculum: response,
      confidence: 0.9
    };
  }
}

// Agent协调器
export class AgentOrchestrator {
  constructor() {
    this.agents = {
      search: new SearchAgent(),
      knowledge: new KnowledgeAgent(),
      analysis: new AnalysisAgent(),
      timeline: new TimelineAgent(),
      recommend: new RecommendAgent(),
      education: new EducationAgent()
    };

    this.performanceMetrics = new Map();
  }

  /**
   * 智能路由到合适的Agent
   */
  async route(query, context) {
    // 简单的意图识别
    const intent = this.detectIntent(query);
    
    // 选择Agent
    const agent = this.selectAgent(intent);
    
    // 执行任务
    const startTime = Date.now();
    const result = await agent.execute({ query, ...context });
    const duration = Date.now() - startTime;
    
    // 记录性能
    this.recordPerformance(agent.name, duration);
    
    return result;
  }

  /**
   * 多Agent协作
   */
  async collaborate(query, context) {
    // 1. 分解任务
    const tasks = this.decomposeTasks(query);
    
    // 2. 并行执行
    const results = await Promise.all(
      tasks.map(task => 
        this.agents[task.agent].execute(task)
      )
    );
    
    // 3. 融合结果
    return await this.mergeResults(results);
  }

  /**
   * 意图检测
   */
  detectIntent(query) {
    const lower = query.toLowerCase();
    
    if (lower.includes('搜索') || lower.includes('查找') || lower.includes('找')) {
      return 'search';
    }
    if (lower.includes('时间线') || lower.includes('时间轴') || lower.includes('历程')) {
      return 'timeline';
    }
    if (lower.includes('分析') || lower.includes('关联') || lower.includes('关系')) {
      return 'analysis';
    }
    if (lower.includes('推荐') || lower.includes('建议')) {
      return 'recommend';
    }
    if (lower.includes('学习') || lower.includes('了解')) {
      return 'education';
    }
    
    return 'knowledge';
  }

  /**
   * 选择Agent
   */
  selectAgent(intent) {
    const agentMap = {
      search: this.agents.search,
      knowledge: this.agents.knowledge,
      analysis: this.agents.analysis,
      timeline: this.agents.timeline,
      recommend: this.agents.recommend,
      education: this.agents.education
    };

    return agentMap[intent] || this.agents.knowledge;
  }

  /**
   * 分解任务
   */
  decomposeTasks(query) {
    // 复杂查询分解为多个子任务
    const tasks = [];
    const intent = this.detectIntent(query);

    // 主任务
    tasks.push({
      agent: intent,
      query,
      priority: 1
    });

    // 辅助任务
    if (intent === 'analysis') {
      tasks.push({
        agent: 'search',
        query: `搜索与"${query}"相关的历史背景`,
        priority: 2
      });
    }

    return tasks;
  }

  /**
   * 融合结果
   */
  async mergeResults(results) {
    // 按优先级排序
    results.sort((a, b) => (b.priority || 1) - (a.priority || 1));

    // 合并内容
    const merged = {
      agents: results.map(r => r.agent),
      results: results,
      timestamp: Date.now()
    };

    return merged;
  }

  /**
   * 记录性能
   */
  recordPerformance(agentName, duration) {
    if (!this.performanceMetrics.has(agentName)) {
      this.performanceMetrics.set(agentName, []);
    }
    
    this.performanceMetrics.get(agentName).push({
      timestamp: Date.now(),
      duration
    });
  }

  /**
   * 获取性能统计
   */
  getPerformanceStats() {
    const stats = {};
    
    for (const [agent, metrics] of this.performanceMetrics) {
      const durations = metrics.map(m => m.duration);
      stats[agent] = {
        calls: metrics.length,
        avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations)
      };
    }
    
    return stats;
  }
}

export default AgentOrchestrator;
