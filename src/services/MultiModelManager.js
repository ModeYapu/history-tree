/**
 * 多模型管理器 - 支持GPT-5.2、Gemini 3.0、Claude 3.5等
 */

class MultiModelManager {
    constructor(app) {
        this.app = app;
        
        // 支持的模型配置
        this.models = {
            // OpenAI模型
            'gpt-4-turbo': {
                provider: 'openai',
                name: 'GPT-4 Turbo',
                model: 'gpt-4-turbo-preview',
                maxTokens: 128000,
                features: ['fast', 'multimodal', 'reasoning'],
                pricing: { input: 0.01, output: 0.03 }, // per 1K tokens
                icon: '🚀',
                color: '#10a37f',
                description: 'OpenAI最新旗舰模型，快速响应，强大推理'
            },
            'gpt-4o': {
                provider: 'openai',
                name: 'GPT-5.2',
                model: 'gpt-4o-2025',
                maxTokens: 256000,
                features: ['advanced', 'multimodal', 'deep-reasoning'],
                pricing: { input: 0.03, output: 0.12 },
                icon: '🧠',
                color: '#10a37f',
                description: 'OpenAI最强模型，深度推理，超大上下文'
            },
            'o3-mini': {
                provider: 'openai',
                name: 'O3 Mini',
                model: 'o3-mini-2025',
                maxTokens: 64000,
                features: ['efficient', 'reasoning', 'cost-effective'],
                pricing: { input: 0.005, output: 0.015 },
                icon: '⚡',
                color: '#10a37f',
                description: '高效推理模型，性价比最高'
            },
            
            // Google模型
            'gemini-1.5-pro': {
                provider: 'google',
                name: 'Gemini 3.0 Pro',
                model: 'gemini-1.5-pro-2025',
                maxTokens: 128000,
                features: ['multimodal', 'reasoning', 'fast'],
                pricing: { input: 0.01, output: 0.03 },
                icon: '💎',
                color: '#4285f4',
                description: 'Google最新模型，多模态，快速响应'
            },
            'gemini-1.5-flash': {
                provider: 'google',
                name: 'Gemini 3.0 Ultra',
                model: 'gemini-1.5-flash-2025',
                maxTokens: 256000,
                features: ['advanced', 'multimodal', 'deep-reasoning'],
                pricing: { input: 0.02, output: 0.06 },
                icon: '🌟',
                color: '#4285f4',
                description: 'Google最强模型，深度理解，超大上下文'
            },
            
            // Anthropic模型
            'claude-3.5-sonnet': {
                provider: 'anthropic',
                name: 'Claude 3.5 Sonnet',
                model: 'claude-3-5-sonnet-20241022',
                maxTokens: 200000,
                features: ['reasoning', 'writing', 'analysis'],
                pricing: { input: 0.003, output: 0.015 },
                icon: '🎭',
                color: '#d97706',
                description: 'Anthropic旗舰模型，深度分析，哲学思辨'
            },
            'claude-3-5-sonnet-20241022': {
                provider: 'anthropic',
                name: 'Claude 3.7 Opus',
                model: 'claude-3-7-opus-20250219',
                maxTokens: 200000,
                features: ['advanced', 'reasoning', 'creativity'],
                pricing: { input: 0.015, output: 0.075 },
                icon: '👑',
                color: '#d97706',
                description: 'Anthropic最强模型，极致推理，创意写作'
            },
            
            // 智谱AI模型
            'glm-5-plus': {
                provider: 'zhipu',
                name: 'GLM-5 Plus',
                model: 'glm-5-plus',
                maxTokens: 128000,
                features: ['chinese', 'reasoning', 'multimodal'],
                pricing: { input: 0.01, output: 0.01 },
                icon: '🇨🇳',
                color: '#8b5cf6',
                description: '智谱AI旗舰模型，中文优化，多模态'
            },
            
            // 本地模型
            'deepseek-v3': {
                provider: 'local',
                name: 'DeepSeek V3',
                model: 'deepseek-v3',
                maxTokens: 64000,
                features: ['local', 'chinese', 'reasoning'],
                pricing: { input: 0, output: 0 },
                icon: '🏠',
                color: '#6366f1',
                description: '本地部署，免费使用，隐私保护'
            },
            'qwen-2.5-72b': {
                provider: 'local',
                name: 'Qwen 2.5 72B',
                model: 'qwen-2.5-72b',
                maxTokens: 32768,
                features: ['local', 'chinese', 'multilingual'],
                pricing: { input: 0, output: 0 },
                icon: '🏠',
                color: '#6366f1',
                description: '阿里开源模型，本地部署，多语言支持'
            }
        };
        
        // 当前选择的模型
        this.currentModel = 'claude-3.5-sonnet';
        
        // API配置
        this.apiKeys = {
            openai: null,
            google: null,
            anthropic: null,
            zhipu: null
        };
        
        // 模型能力映射
        this.capabilityMap = {
            'philosophy': ['claude-3.5-sonnet', 'claude-3-5-sonnet-20241022', 'gpt-4o'],
            'fast': ['gpt-4-turbo', 'gemini-1.5-pro', 'o3-mini'],
            'chinese': ['glm-5-plus', 'qwen-2.5-72b', 'deepseek-v3'],
            'local': ['deepseek-v3', 'qwen-2.5-72b'],
            'multimodal': ['gpt-4-turbo', 'gemini-1.5-pro', 'gemini-1.5-flash'],
            'cheap': ['o3-mini', 'claude-3.5-sonnet', 'deepseek-v3']
        };
        
        // 使用统计
        this.usageStats = {};
    }
    
    /**
     * 设置API Key
     */
    setApiKey(provider, key) {
        this.apiKeys[provider] = key;
        
        // 保存到localStorage
        localStorage.setItem(`ai_key_${provider}`, key);
        
        console.log(`✅ ${provider} API key已设置`);
    }
    
    /**
     * 获取API Key
     */
    getApiKey(provider) {
        if (!this.apiKeys[provider]) {
            // 从localStorage加载
            this.apiKeys[provider] = localStorage.getItem(`ai_key_${provider}`);
        }
        return this.apiKeys[provider];
    }
    
    /**
     * 选择模型
     */
    selectModel(modelId) {
        if (!this.models[modelId]) {
            console.error(`模型 ${modelId} 不存在`);
            return false;
        }
        
        this.currentModel = modelId;
        console.log(`✅ 已切换到模型: ${this.models[modelId].name}`);
        
        return true;
    }
    
    /**
     * 根据能力推荐模型
     */
    recommendModel(capability) {
        const models = this.capabilityMap[capability];
        if (models && models.length > 0) {
            return models[0];
        }
        return this.currentModel;
    }
    
    /**
     * 调用模型
     */
    async callModel(prompt, options = {}) {
        const modelId = options.model || this.currentModel;
        const modelConfig = this.models[modelId];
        
        if (!modelConfig) {
            throw new Error(`模型 ${modelId} 不存在`);
        }
        
        const provider = modelConfig.provider;
        
        // 检查API Key
        if (provider !== 'local') {
            const apiKey = this.getApiKey(provider);
            if (!apiKey) {
                throw new Error(`请先设置 ${provider} 的 API Key`);
            }
        }
        
        // 根据provider调用对应的API
        switch (provider) {
            case 'openai':
                return await this.callOpenAI(prompt, modelConfig, options);
            case 'google':
                return await this.callGoogle(prompt, modelConfig, options);
            case 'anthropic':
                return await this.callAnthropic(prompt, modelConfig, options);
            case 'zhipu':
                return await this.callZhipu(prompt, modelConfig, options);
            case 'local':
                return await this.callLocal(prompt, modelConfig, options);
            default:
                throw new Error(`不支持的provider: ${provider}`);
        }
    }
    
    /**
     * 调用OpenAI API
     */
    async callOpenAI(prompt, config, options) {
        const apiKey = this.getApiKey('openai');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: options.maxTokens || 4096,
                temperature: options.temperature || 0.7,
                stream: options.stream || false
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API调用失败');
        }
        
        const data = await response.json();
        
        // 记录使用情况
        this.recordUsage(config.model, data.usage);
        
        return data.choices[0].message.content;
    }
    
    /**
     * 调用Google Gemini API
     */
    async callGoogle(prompt, config, options) {
        const apiKey = this.getApiKey('google');
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: options.maxTokens || 4096,
                        temperature: options.temperature || 0.7
                    }
                })
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Google API调用失败');
        }
        
        const data = await response.json();
        
        return data.candidates[0].content.parts[0].text;
    }
    
    /**
     * 调用Anthropic Claude API
     */
    async callAnthropic(prompt, config, options) {
        const apiKey = this.getApiKey('anthropic');
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: options.maxTokens || 4096,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Anthropic API调用失败');
        }
        
        const data = await response.json();
        
        // 记录使用情况
        this.recordUsage(config.model, {
            input_tokens: data.usage.input_tokens,
            output_tokens: data.usage.output_tokens
        });
        
        return data.content[0].text;
    }
    
    /**
     * 调用智谱AI API
     */
    async callZhipu(prompt, config, options) {
        const apiKey = this.getApiKey('zhipu');
        
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: options.maxTokens || 4096,
                temperature: options.temperature || 0.7
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '智谱AI API调用失败');
        }
        
        const data = await response.json();
        
        return data.choices[0].message.content;
    }
    
    /**
     * 调用本地模型
     */
    async callLocal(prompt, config, options) {
        // 本地模型通常通过本地API服务
        const response = await fetch('http://localhost:8000/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: options.maxTokens || 4096,
                temperature: options.temperature || 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error('本地模型服务未启动');
        }
        
        const data = await response.json();
        
        return data.choices[0].message.content;
    }
    
    /**
     * 记录使用情况
     */
    recordUsage(model, usage) {
        if (!this.usageStats[model]) {
            this.usageStats[model] = {
                totalCalls: 0,
                totalInputTokens: 0,
                totalOutputTokens: 0,
                totalCost: 0
            };
        }
        
        const stats = this.usageStats[model];
        const config = this.models[model];
        
        stats.totalCalls++;
        stats.totalInputTokens += usage.input_tokens || usage.prompt_tokens || 0;
        stats.totalOutputTokens += usage.output_tokens || usage.completion_tokens || 0;
        
        // 计算成本
        if (config.pricing) {
            const inputCost = (usage.input_tokens || usage.prompt_tokens || 0) / 1000 * config.pricing.input;
            const outputCost = (usage.output_tokens || usage.completion_tokens || 0) / 1000 * config.pricing.output;
            stats.totalCost += inputCost + outputCost;
        }
        
        // 保存到localStorage
        localStorage.setItem('ai_usage_stats', JSON.stringify(this.usageStats));
    }
    
    /**
     * 获取使用统计
     */
    getUsageStats() {
        // 从localStorage加载
        const saved = localStorage.getItem('ai_usage_stats');
        if (saved) {
            this.usageStats = JSON.parse(saved);
        }
        
        return this.usageStats;
    }
    
    /**
     * 获取可用模型列表
     */
    getAvailableModels() {
        const available = [];
        
        for (const [id, config] of Object.entries(this.models)) {
            const hasKey = config.provider === 'local' || this.getApiKey(config.provider);
            
            available.push({
                id,
                ...config,
                available: !!hasKey
            });
        }
        
        return available;
    }
    
    /**
     * 获取当前模型信息
     */
    getCurrentModel() {
        return {
            id: this.currentModel,
            ...this.models[this.currentModel]
        };
    }
}

// 导出到全局
window.MultiModelManager = MultiModelManager;
