/**
 * 增强AI引擎 - 具备发现和哲学思辨能力
 */

class EnhancedAIEngine {
    constructor(app) {
        this.app = app;
        
        // 模型配置
        this.models = {
            primary: {
                provider: 'anthropic',
                model: 'claude-3-5-sonnet-20241022',
                purpose: '深度分析和哲学思辨'
            },
            secondary: {
                provider: 'openai',
                model: 'gpt-4-turbo-preview',
                purpose: '快速检索和关联发现'
            }
        };
        
        // 哲学思辨框架
        this.philosophyFramework = {
            dimensions: [
                '本体论',      // 存在的本质
                '认识论',      // 知识的本质
                '价值论',      // 价值的本质
                '历史哲学',    // 历史的本质
                '社会哲学',    // 社会的本质
                '技术哲学'     // 技术的本质
            ],
            
            perspectives: [
                '决定论 vs 自由意志',
                '必然性 vs 偶然性',
                '连续性 vs 断裂性',
                '普遍性 vs 特殊性',
                '进步 vs 循环',
                '理性 vs 非理性'
            ],
            
            methods: [
                '辩证法',
                '现象学还原',
                '结构分析',
                '系统思维',
                '历史唯物主义',
                '文明比较'
            ]
        };
        
        // 发现模式
        this.discoveryModes = {
            causal: '因果发现',
            structural: '结构发现',
            comparative: '比较发现',
            evolutionary: '演化发现',
            dialectical: '辩证发现',
            phenomenological: '现象学发现'
        };
    }
    
    /**
     * 深度分析历史事件
     */
    async deepAnalysis(nodeId) {
        const node = this.app.dataService.getNode(nodeId);
        if (!node) return null;
        
        const prompt = this.buildPhilosophicalPrompt(node);
        
        try {
            const response = await this.callAI(prompt, 'primary');
            const analysis = this.parseAnalysis(response);
            
            return analysis;
        } catch (error) {
            console.error('Deep analysis failed:', error);
            return this.fallbackAnalysis(node);
        }
    }
    
    /**
     * 构建哲学思辨Prompt
     */
    buildPhilosophicalPrompt(node) {
        return `你是一位具有深厚哲学素养的历史发现引擎。你的任务不仅是发现历史关联，更要进行深层次的哲学思辨。

## 分析对象
**名称**: ${node.name}
**时间**: ${node.time.displayDate}
**地点**: ${node.location.name}
**分类**: ${node.category.primary}
**描述**: ${node.description || node.summary}

## 你的任务

### 1. 关联发现（发现能力）
运用多种发现模式：
- **因果发现**: 找出直接的因果链条
- **结构发现**: 发现隐藏的结构性关联
- **比较发现**: 跨时空、跨文明的对比
- **演化发现**: 长时段的历史演化规律
- **辩证发现**: 矛盾、对立统一的发现
- **现象学发现**: 回到事物本身，揭示本质

### 2. 哲学思辨（思辨能力）
从多个哲学维度进行思考：
- **本体论维度**: 这个历史事件的"存在"本质是什么？它为什么"存在"而非"不存在"？
- **认识论维度**: 我们如何"认识"这个事件？它的历史真实性与阐释空间？
- **价值论维度**: 这个事件的价值意义？对人类文明的价值？
- **历史哲学维度**: 它在历史进程中的位置？体现的历史规律？
- **社会哲学维度**: 对社会结构的影响？体现的社会规律？
- **技术哲学维度**: 技术在其中的作用？人与技术的关系？

### 3. 多元视角
运用哲学思辨的多元视角：
- 决定论 vs 自由意志：这个事件是必然的还是有偶然性？
- 普遍性 vs 特殊性：它反映了普遍规律还是特殊现象？
- 连续性 vs 断裂性：它是历史的延续还是断裂？
- 进步 vs 循环：它体现了历史的进步还是循环？

### 4. 思辨方法
运用哲学方法：
- **辩证法**: 发现内在矛盾、对立统一
- **现象学**: 回到事物本身，悬置预设
- **结构分析**: 分析深层结构
- **系统思维**: 整体性思考
- **历史唯物主义**: 经济基础与上层建筑
- **文明比较**: 跨文明的哲学思考

## 输出格式（JSON）

\`\`\`json
{
  "discovery": {
    "causal": [
      {
        "event": "事件名",
        "relation": "关系类型",
        "mechanism": "作用机制",
        "evidence": "证据",
        "confidence": 0.0-1.0
      }
    ],
    "structural": [
      {
        "pattern": "结构模式",
        "description": "描述",
        "significance": "意义"
      }
    ],
    "comparative": [
      {
        "event": "对比事件",
        "time": "时间",
        "region": "地区",
        "similarities": ["相似点"],
        "differences": ["差异点"],
        "insight": "洞察"
      }
    ],
    "evolutionary": [
      {
        "trend": "演化趋势",
        "stages": ["阶段"],
        "pattern": "模式"
      }
    ],
    "dialectical": [
      {
        "contradiction": "矛盾",
        "thesis": "正题",
        "antithesis": "反题",
        "synthesis": "合题"
      }
    ],
    "phenomenological": [
      {
        "essence": "本质",
        "intentionality": "意向性",
        "constitution": "构成"
      }
    ]
  },
  
  "philosophy": {
    "ontological": {
      "question": "存在的本质问题",
      "analysis": "分析",
      "insight": "洞察"
    },
    "epistemological": {
      "question": "认识的本质问题",
      "analysis": "分析",
      "insight": "洞察"
    },
    "axiological": {
      "question": "价值的本质问题",
      "analysis": "分析",
      "insight": "洞察"
    },
    "historical": {
      "question": "历史的本质问题",
      "analysis": "分析",
      "insight": "洞察"
    },
    "social": {
      "question": "社会的本质问题",
      "analysis": "分析",
      "insight": "洞察"
    },
    "technological": {
      "question": "技术的本质问题",
      "analysis": "分析",
      "insight": "洞察"
    }
  },
  
  "perspectives": {
    "determinism": {
      "view": "决定论视角",
      "argument": "论据",
      "counterArgument": "反驳"
    },
    "necessity": {
      "view": "必然性视角",
      "argument": "论据",
      "counterArgument": "反驳"
    },
    "universality": {
      "view": "普遍性视角",
      "argument": "论据",
      "counterArgument": "反驳"
    },
    "progress": {
      "view": "进步视角",
      "argument": "论据",
      "counterArgument": "反驳"
    }
  },
  
  "speculation": {
    "thesis": "核心命题",
    "arguments": ["论证"],
    "implications": ["蕴含"],
    "questions": ["开放问题"]
  },
  
  "wisdom": {
    "insight": "核心洞察",
    "lesson": "历史教训",
    "relevance": "当代意义"
  }
}
\`\`\`

## 注意事项
1. **发现要深刻**: 不要停留在表面，要挖掘深层关联
2. **思辨要严谨**: 哲学思考要有逻辑性，避免空泛
3. **论证要有据**: 每个观点都要有历史证据支持
4. **视角要多元**: 从不同哲学维度思考
5. **语言要精准**: 使用准确的哲学术语
6. **要有批判性**: 敢于质疑传统观点
7. **要有创造性**: 提出新的解释框架

现在，请对"${node.name}"进行深度分析和哲学思辨。`;
    }
    
    /**
     * 解析分析结果
     */
    parseAnalysis(response) {
        try {
            // 尝试提取JSON
            const jsonMatch = response.match(/```json\n([\s\S]+?)\n```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }
            
            // 如果没有JSON格式，尝试直接解析
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to parse analysis:', error);
            
            // 返回结构化的文本分析
            return {
                discovery: {},
                philosophy: {},
                perspectives: {},
                speculation: {},
                wisdom: {},
                rawText: response
            };
        }
    }
    
    /**
     * 哲学问答
     */
    async philosophicalQA(question, context = {}) {
        const prompt = `作为具有哲学思辨能力的历史发现引擎，回答以下问题：

## 问题
${question}

## 上下文
${context.currentNode ? `当前分析对象：${context.currentNode.name}` : ''}

## 回答要求

### 1. 多维度分析
从以下哲学维度思考：
- 本体论：存在的本质
- 认识论：认识的可能性
- 价值论：价值判断
- 历史哲学：历史规律
- 社会哲学：社会本质
- 技术哲学：技术意义

### 2. 辩证思维
- 正题：传统观点
- 反题：对立观点
- 合题：更高层次的统一

### 3. 批判性思考
- 质疑前提假设
- 指出逻辑漏洞
- 提出替代解释

### 4. 历史证据
- 引用具体史实
- 对比不同时期
- 跨文明比较

### 5. 当代意义
- 对今天的启示
- 现实应用价值
- 未来发展趋势

## 输出格式

{
  "directAnswer": "直接答案",
  "philosophicalDimensions": {
    "ontological": "本体论分析",
    "epistemological": "认识论分析",
    "axiological": "价值论分析"
  },
  "dialecticalThinking": {
    "thesis": "正题",
    "antithesis": "反题",
    "synthesis": "合题"
  },
  "criticalThinking": [
    "批判性观点1",
    "批判性观点2"
  ],
  "historicalEvidence": [
    "证据1",
    "证据2"
  ],
  "contemporarySignificance": "当代意义",
  "openQuestions": [
    "开放问题1",
    "开放问题2"
  ]
}

请用哲学的深度和历史的厚度来回答这个问题。`;

        const response = await this.callAI(prompt, 'primary');
        
        try {
            return JSON.parse(response);
        } catch (error) {
            return {
                directAnswer: response,
                philosophicalDimensions: {},
                dialecticalThinking: {},
                criticalThinking: [],
                historicalEvidence: [],
                contemporarySignificance: '',
                openQuestions: []
            };
        }
    }
    
    /**
     * 发现隐藏模式
     */
    async discoverPatterns(topic) {
        const prompt = `作为历史发现引擎，发现"${topic}"背后的隐藏模式。

## 发现任务

### 1. 结构模式
- 重复出现的结构
- 深层的组织原则
- 隐形的框架

### 2. 动力模式
- 推动力量
- 阻碍力量
- 平衡机制

### 3. 演化模式
- 发展阶段
- 转型节点
- 演化规律

### 4. 关系模式
- 相互作用
- 反馈循环
- 因果网络

### 5. 意义模式
- 象征意义
- 文化编码
- 集体无意识

## 输出格式

{
  "structuralPatterns": [
    {
      "pattern": "模式名称",
      "description": "描述",
      "examples": ["例子"],
      "significance": "意义"
    }
  ],
  "dynamicPatterns": [...],
  "evolutionaryPatterns": [...],
  "relationalPatterns": [...],
  "meaningPatterns": [...],
  "metaPattern": {
    "description": "元模式描述",
    "unification": "如何统一各种模式",
    "implications": "蕴含"
  }
}

请深入挖掘，发现那些不易察觉但意义深远的模式。`;

        const response = await this.callAI(prompt, 'primary');
        
        try {
            return JSON.parse(response);
        } catch (error) {
            return { rawText: response };
        }
    }
    
    /**
     * 调用AI API
     */
    async callAI(prompt, modelType = 'primary') {
        const modelConfig = this.models[modelType];
        
        // 实际项目中应该调用真实的API
        // 这里是模拟实现
        
        if (modelConfig.provider === 'anthropic') {
            return await this.callClaude(prompt, modelConfig.model);
        } else if (modelConfig.provider === 'openai') {
            return await this.callGPT(prompt, modelConfig.model);
        }
        
        // 模拟响应
        return this.getMockPhilosophicalResponse(prompt);
    }
    
    /**
     * 调用Claude API
     */
    async callClaude(prompt, model) {
        // 实际实现
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 8000,
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
    async callGPT(prompt, model) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
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
     * 模拟哲学思辨响应（开发测试）
     */
    getMockPhilosophicalResponse(prompt) {
        return JSON.stringify({
            discovery: {
                causal: [
                    {
                        event: "技术积累",
                        relation: "技术前提",
                        mechanism: "长期技术演进的临界点",
                        evidence: "前期技术发展为后续奠定基础",
                        confidence: 0.85
                    }
                ],
                structural: [
                    {
                        pattern: "中心-边缘结构",
                        description: "文明发展的不均衡分布",
                        significance: "揭示了文明传播的空间逻辑"
                    }
                ],
                dialectical: [
                    {
                        contradiction: "传统与现代的张力",
                        thesis: "传统的延续性",
                        antithesis: "现代的断裂性",
                        synthesis: "创造性转化的可能"
                    }
                ]
            },
            
            philosophy: {
                ontological: {
                    question: "这个历史事件的'存在'本质是什么？",
                    analysis: "它不仅是时间轴上的一个点，更是人类实践的具体化",
                    insight: "历史事件的存在方式是'生成'而非'给定'"
                },
                epistemological: {
                    question: "我们如何'认识'这个事件？",
                    analysis: "通过文本、考古、比较等多重证据",
                    insight: "历史认识永远是视角性的和阐释性的"
                },
                axiological: {
                    question: "这个事件的价值意义？",
                    analysis: "对人类文明的推进作用",
                    insight: "价值判断需要放在文明演化的长时段中"
                }
            },
            
            perspectives: {
                determinism: {
                    view: "决定论视角",
                    argument: "经济基础决定上层建筑",
                    counterArgument: "人的能动性和偶然性"
                },
                necessity: {
                    view: "必然性视角",
                    argument: "历史发展的客观规律",
                    counterArgument: "偶然事件的关键作用"
                }
            },
            
            speculation: {
                thesis: "历史发展是必然性与偶然性的辩证统一",
                arguments: [
                    "长期趋势体现必然性",
                    "具体路径充满偶然性",
                    "人的能动性是关键变量"
                ],
                implications: [
                    "历史可以理解但不可预测",
                    "人的选择具有重要意义",
                    "历史教训需要辩证对待"
                ]
            },
            
            wisdom: {
                insight: "历史不是直线，而是螺旋",
                lesson: "理解历史需要多维度、多层次",
                relevance: "对当代问题的启示"
            }
        });
    }
    
    /**
     * 降级分析
     */
    fallbackAnalysis(node) {
        return {
            discovery: {
                causal: [],
                structural: [],
                comparative: [],
                evolutionary: [],
                dialectical: [],
                phenomenological: []
            },
            philosophy: {
                ontological: {
                    question: "存在本质",
                    analysis: `${node.name}作为历史事件，其存在具有时空特殊性`,
                    insight: "历史存在是具体的、生成的"
                }
            },
            perspectives: {},
            speculation: {
                thesis: `${node.name}需要放在更长的历史时段中理解`,
                arguments: [],
                implications: []
            },
            wisdom: {
                insight: "每个历史事件都有其独特性和普遍性",
                lesson: "历史理解需要多元视角",
                relevance: "对当代的启示需要创造性转化"
            }
        };
    }
}

// 导出到全局
window.EnhancedAIEngine = EnhancedAIEngine;
