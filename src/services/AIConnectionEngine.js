/**
 * AI关联发现引擎
 * 利用大模型发现历史事件之间的深层关联
 */

class AIConnectionEngine {
    constructor(app) {
        this.app = app;
        this.model = 'claude-3.5-sonnet';
        this.cache = new Map();
        
        // API配置 - 从配置管理器安全获取
        this.apiConfig = this.initializeAPIConfig();
    }

    /**
     * 安全初始化API配置
     * 不在客户端代码中存储敏感信息
     */
    initializeAPIConfig() {
        // 检查是否有配置管理器
        if (window.configManager) {
            return {
                anthropic: {
                    // 不存储API密钥，使用配置管理器
                    model: window.configManager.get('ai.models.anthropic', 'claude-3-5-sonnet-20241022'),
                    timeout: window.configManager.get('app.apiTimeout', 30000)
                },
                openai: {
                    model: window.configManager.get('ai.models.openai', 'gpt-4-turbo-preview'),
                    timeout: window.configManager.get('app.apiTimeout', 30000)
                },
                deepseek: {
                    model: window.configManager.get('ai.models.deepseek', 'deepseek-chat'),
                    timeout: window.configManager.get('app.apiTimeout', 30000)
                },
                gemini: {
                    model: window.configManager.get('ai.models.gemini', 'gemini-3.0'),
                    timeout: window.configManager.get('app.apiTimeout', 30000)
                }
            };
        }

        // 默认配置（不包含API密钥）
        return {
            anthropic: {
                model: 'claude-3-5-sonnet-20241022',
                timeout: 30000
            },
            openai: {
                model: 'gpt-4-turbo-preview',
                timeout: 30000
            }
        };
    }

    /**
     * 安全地调用API
     * 通过服务器代理避免暴露API密钥
     */
    async callAPI(provider, prompt, options = {}) {
        try {
            // 验证提供商
            const validProviders = ['anthropic', 'openai', 'deepseek', 'gemini'];
            if (!validProviders.includes(provider)) {
                throw new Error(`Invalid AI provider: ${provider}`);
            }

            // 清理输入
            const sanitizedPrompt = this.sanitizeInput(prompt);

            // 通过服务器代理调用API
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.apiConfig[provider]?.timeout || 30000);

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCsrfToken()
                },
                body: JSON.stringify({
                    provider,
                    prompt: sanitizedPrompt,
                    model: this.apiConfig[provider]?.model,
                    options
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // 验证响应数据
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid API response format');
            }

            return data;
        } catch (error) {
            if (window.ErrorHandler) {
                window.ErrorHandler.handle(error, 'AIConnectionEngine.callAPI', false);
            }
            console.error('AI API call failed:', error);
            throw error;
        }
    }

    /**
     * 清理用户输入
     */
    sanitizeInput(input) {
        if (!input || typeof input !== 'string') return '';

        // 优先使用SecurityUtils
        if (window.SecurityUtils && typeof window.SecurityUtils.sanitizeUserInput === 'function') {
            return window.SecurityUtils.sanitizeUserInput(input);
        }

        // 移除危险字符
        let cleaned = input.replace(/<script[^>]*>.*?<\/script>/gi, '');
        cleaned = cleaned.replace(/javascript:/gi, '');
        cleaned = cleaned.replace(/on\w+\s*=/gi, '');

        return cleaned.trim();
    }

    /**
     * 获取CSRF令牌
     */
    getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }
    
    /**
     * 发现事件关联
     */
    async discoverConnections(nodeId, options = {}) {
        const {
            depth = 2,           // 搜索深度
            minStrength = 0.3,   // 最小关联强度
            maxResults = 10      // 最大结果数
        } = options;
        
        const node = this.app.dataService.getNode(nodeId);
        if (!node) return [];
        
        // 检查缓存
        const cacheKey = `connections_${nodeId}_${depth}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        // 1. 本地数据关联
        const localConnections = this.findLocalConnections(node);
        
        // 2. AI发现的关联
        const aiConnections = await this.findAIConnections(node, {
            depth,
            minStrength
        });
        
        // 3. 合并和排序
        const allConnections = [...localConnections, ...aiConnections]
            .sort((a, b) => b.strength - a.strength)
            .slice(0, maxResults);
        
        // 缓存结果
        this.cache.set(cacheKey, allConnections);
        
        return allConnections;
    }
    
    /**
     * 本地关联发现
     */
    findLocalConnections(node) {
        const connections = [];
        
        // 从数据中提取的关系
        Object.entries(node.relations).forEach(([type, ids]) => {
            ids.forEach(targetId => {
                const target = this.app.dataService.getNode(targetId);
                if (target) {
                    connections.push({
                        source: node.id,
                        target: targetId,
                        type: type,
                        strength: 0.8,
                        sourceType: 'local',
                        evidence: '数据中直接记录的关系'
                    });
                }
            });
        });
        
        // 基于标签的相似性
        node.category.tags.forEach(tag => {
            const relatedNodes = this.app.dataService.search(tag, { limit: 5 });
            relatedNodes.forEach(related => {
                if (related.id !== node.id) {
                    connections.push({
                        source: node.id,
                        target: related.id,
                        type: 'similar_tags',
                        strength: 0.5,
                        sourceType: 'local',
                        evidence: `共同标签: ${tag}`
                    });
                }
            });
        });
        
        return connections;
    }
    
    /**
     * AI关联发现
     */
    async findAIConnections(node, options) {
        const prompt = this.buildConnectionPrompt(node);

        try {
            // 调用大模型API
            const response = await this.callAI(prompt);

            // 解析AI响应
            const connections = this.parseAIResponse(response, node);

            return connections;
        } catch (error) {
            if (window.ErrorHandler) {
                window.ErrorHandler.handle(error, 'AIConnectionEngine.findAIConnections', false);
            }
            console.error('AI connection discovery failed:', error);

            // 降级到规则引擎
            return this.fallbackConnections(node);
        }
    }
    
    /**
     * 构建Prompt
     */
    buildConnectionPrompt(node) {
        return `你是一个历史关联发现引擎。分析以下历史事件/人物，发现它与其他历史事件的深层关联。

历史对象：
名称：${node.name}
时间：${node.time.displayDate}
地点：${node.location.name}
分类：${node.category.primary}
描述：${node.description || node.summary}

任务：
1. 找出这个事件的直接原因（至少3个）
2. 找出这个事件的直接后果（至少3个）
3. 发掘隐藏的跨时空关联（至少2个）
4. 找出同时期其他地区/文明的对比对象

输出JSON格式：
{
  "directCauses": [
    {
      "event": "事件名称",
      "year": 年份,
      "relation": "关系类型",
      "strength": 0.0-1.0,
      "evidence": "证据说明"
    }
  ],
  "directEffects": [...],
  "crossTimeConnections": [
    {
      "event": "事件名称",
      "year": 年份,
      "region": "地区",
      "relation": "关联说明",
      "insight": "AI发现的洞察"
    }
  ],
  "contemporaryComparisons": [...]
}

注意：
- 关联要有历史依据
- 强度要合理评估
- 优先发现不明显的关联
- 注重跨学科、跨地域的联系`;
    }
    
    /**
     * 调用AI API
     */
    async callAI(prompt) {
        // 实际项目中应该调用真实的API
        // 这里是模拟实现
        
        if (this.apiConfig.anthropic.apiKey) {
            return await this.callClaude(prompt);
        }
        
        if (this.apiConfig.openai.apiKey) {
            return await this.callGPT(prompt);
        }
        
        // 没有API key时使用模拟数据
        return this.getMockResponse(prompt);
    }
    
    /**
     * 调用Claude API
     */
    async callClaude(prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiConfig.anthropic.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.apiConfig.anthropic.model,
                max_tokens: 4096,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });
        
        const data = await response.json();
        return data.content[0].text;
    }
    
    /**
     * 调用GPT API
     */
    async callGPT(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiConfig.openai.apiKey}`
            },
            body: JSON.stringify({
                model: this.apiConfig.openai.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    /**
     * 模拟响应（开发测试用）
     */
    getMockResponse(prompt) {
        // 提取节点名称
        const nameMatch = prompt.match(/名称：(.+)/);
        const nodeName = nameMatch ? nameMatch[1] : '未知';
        
        // 返回模拟的关联数据
        return JSON.stringify({
            directCauses: [
                {
                    event: "技术积累",
                    year: -100,
                    relation: "技术前提",
                    strength: 0.8,
                    evidence: "前期技术发展为后续事件奠定基础"
                }
            ],
            directEffects: [
                {
                    event: "社会变革",
                    year: 50,
                    relation: "直接后果",
                    strength: 0.9,
                    evidence: "直接导致社会结构变化"
                }
            ],
            crossTimeConnections: [
                {
                    event: "类似历史现象",
                    year: 1000,
                    region: "欧洲",
                    relation: "跨时空对比",
                    insight: "AI发现：不同文明在相似发展阶段出现类似现象"
                }
            ],
            contemporaryComparisons: [
                {
                    event: "同期其他文明",
                    year: 0,
                    region: "中东",
                    relation: "文明对比",
                    insight: "同时期不同文明的发展路径差异"
                }
            ]
        });
    }
    
    /**
     * 解析AI响应
     */
    parseAIResponse(response, sourceNode) {
        try {
            const data = JSON.parse(response);
            const connections = [];
            
            // 处理直接原因
            if (data.directCauses) {
                data.directCauses.forEach(cause => {
                    connections.push({
                        source: this.findOrCreateNode(cause.event, cause.year),
                        target: sourceNode.id,
                        type: 'cause',
                        strength: cause.strength,
                        sourceType: 'ai_discovered',
                        evidence: cause.evidence
                    });
                });
            }
            
            // 处理直接后果
            if (data.directEffects) {
                data.directEffects.forEach(effect => {
                    connections.push({
                        source: sourceNode.id,
                        target: this.findOrCreateNode(effect.event, effect.year),
                        type: 'effect',
                        strength: effect.strength,
                        sourceType: 'ai_discovered',
                        evidence: effect.evidence
                    });
                });
            }
            
            // 处理跨时空关联
            if (data.crossTimeConnections) {
                data.crossTimeConnections.forEach(conn => {
                    connections.push({
                        source: sourceNode.id,
                        target: this.findOrCreateNode(conn.event, conn.year, conn.region),
                        type: 'cross_time',
                        strength: 0.6,
                        sourceType: 'ai_discovered',
                        insight: conn.insight
                    });
                });
            }
            
            return connections;
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return [];
        }
    }
    
    /**
     * 查找或创建节点
     */
    findOrCreateNode(name, year, region = '中国') {
        // 尝试在现有数据中查找
        const existing = this.app.dataService.search(name, { limit: 1 });
        if (existing.length > 0) {
            return existing[0].id;
        }
        
        // 创建临时节点
        const tempNode = {
            id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            time: { year, displayDate: this.formatYear(year) },
            location: { name: region },
            category: { primary: 'ai_discovered' },
            metadata: { importance: 2 },
            isTemp: true
        };
        
        // 添加到数据服务
        this.app.dataService.nodes.set(tempNode.id, new HistoryNode(tempNode));
        
        return tempNode.id;
    }
    
    /**
     * 格式化年份
     */
    formatYear(year) {
        if (!year) return '';
        return year < 0 ? `公元前${Math.abs(year)}年` : `${year}年`;
    }
    
    /**
     * 降级关联发现（规则引擎）
     */
    fallbackConnections(node) {
        const connections = [];
        
        // 基于时期的相关性
        const periodNodes = this.app.dataService.filter({ period: node.time.period });
        periodNodes.slice(0, 5).forEach(related => {
            if (related.id !== node.id) {
                connections.push({
                    source: node.id,
                    target: related.id,
                    type: 'same_period',
                    strength: 0.4,
                    sourceType: 'rule_based',
                    evidence: '同一时期的事件'
                });
            }
        });
        
        // 基于地理位置的相关性
        if (node.location.name) {
            const locationNodes = this.app.dataService.filter({ location: node.location.name });
            locationNodes.slice(0, 3).forEach(related => {
                if (related.id !== node.id) {
                    connections.push({
                        source: node.id,
                        target: related.id,
                        type: 'same_location',
                        strength: 0.3,
                        sourceType: 'rule_based',
                        evidence: '同一地点的事件'
                    });
                }
            });
        }
        
        return connections;
    }
    
    /**
     * 深度问答
     */
    async answerQuestion(question, context = {}) {
        // 验证输入
        if (!question || typeof question !== 'string') {
            if (window.ErrorHandler) {
                window.ErrorHandler.handle(new Error('Invalid question input'), 'AIConnectionEngine.answerQuestion', false);
            }
            return {
                answer: '问题格式不正确',
                evidence: [],
                connections: [],
                deepInsight: '',
                exploreSuggestions: []
            };
        }

        const sanitizedQuestion = this.sanitizeInput(question);

        const prompt = `作为历史发现引擎，回答以下问题：

问题：${sanitizedQuestion}

上下文：
${context.currentNode ? `当前查看：${context.currentNode.name}` : ''}

要求：
1. 直接回答问题
2. 提供历史证据
3. 指出相关的历史关联
4. 如果有隐藏的深层原因，请说明
5. 提供可探索的方向

回答格式：
{
  "answer": "直接答案",
  "evidence": ["证据1", "证据2"],
  "connections": [
    {
      "event": "相关事件",
      "relation": "关系说明"
    }
  ],
  "deepInsight": "深层洞察",
  "exploreSuggestions": ["建议探索的方向1", "建议探索的方向2"]
}`;

        try {
            const response = await this.callAI(prompt);

            try {
                return JSON.parse(response);
            } catch (parseError) {
                if (window.ErrorHandler) {
                    window.ErrorHandler.handle(parseError, 'AIConnectionEngine.answerQuestion parse', false);
                }
                return {
                    answer: response,
                    evidence: [],
                    connections: [],
                    deepInsight: '',
                    exploreSuggestions: []
                };
            }
        } catch (error) {
            if (window.ErrorHandler) {
                window.ErrorHandler.handle(error, 'AIConnectionEngine.answerQuestion', false);
            }
            return {
                answer: '抱歉，无法获取回答，请稍后重试',
                evidence: [],
                connections: [],
                deepInsight: '',
                exploreSuggestions: []
            };
        }
    }
}

// 导出到全局
window.AIConnectionEngine = AIConnectionEngine;
