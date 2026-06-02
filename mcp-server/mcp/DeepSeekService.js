/**
 * DeepSeek AI服务 - 兼容OpenAI格式
 */

export class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
    this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    
    // DeepSeek模型列表
    this.models = {
      'deepseek-chat': {
        name: 'DeepSeek Chat',
        description: '通用对话模型，性价比极高',
        maxTokens: 4096,
        cost: '¥1/百万tokens' // 非常便宜
      },
      'deepseek-coder': {
        name: 'DeepSeek Coder',
        description: '编程专用模型',
        maxTokens: 4096,
        cost: '¥1/百万tokens'
      },
      'deepseek-reasoner': {
        name: 'DeepSeek Reasoner',
        description: '深度推理模型（R1）',
        maxTokens: 8192,
        cost: '¥2/百万tokens'
      }
    };
  }

  /**
   * 调用DeepSeek API
   */
  async call(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('请配置 DEEPSEEK_API_KEY');
    }

    const {
      model = this.model,
      temperature = 0.7,
      maxTokens = 4096,
      systemPrompt = '你是一个专业的历史学家助手。'
    } = options;

    try {
      // DeepSeek使用OpenAI兼容格式
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature,
          max_tokens: maxTokens,
          stream: false
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API错误 (${response.status}): ${error}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        model: data.model,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        },
        cost: this.calculateCost(data.usage, model)
      };

    } catch (error) {
      console.error('DeepSeek调用失败:', error);
      throw error;
    }
  }

  /**
   * 流式调用
   */
  async *stream(prompt, options = {}) {
    const {
      model = this.model,
      temperature = 0.7,
      maxTokens = 4096,
      systemPrompt = '你是一个专业的历史学家助手。'
    } = options;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens: maxTokens,
        stream: true
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              yield content;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  }

  /**
   * 计算成本
   */
  calculateCost(usage, model) {
    const modelInfo = this.models[model] || this.models['deepseek-chat'];
    const costPerMillion = parseFloat(modelInfo.cost.replace('¥', '').replace('/百万tokens', ''));
    
    const totalCost = (usage.total_tokens / 1000000) * costPerMillion;
    
    return {
      tokens: usage.total_tokens,
      cost: `¥${totalCost.toFixed(6)}`,
      costPerMillion: modelInfo.cost
    };
  }

  /**
   * 获取可用模型列表
   */
  getModels() {
    return Object.entries(this.models).map(([id, info]) => ({
      id,
      ...info
    }));
  }

  /**
   * 测试连接
   */
  async test() {
    try {
      const result = await this.call('你好', { maxTokens: 50 });
      return {
        success: true,
        model: result.model,
        response: result.content,
        cost: result.cost
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default DeepSeekService;
