/**
 * AI服务 - 集成真实AI API
 */

export class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'anthropic';
    this.apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
    this.model = process.env.AI_MODEL || 'claude-3-5-sonnet-20241022';
    this.baseUrl = this.getBaseUrl();
  }

  /**
   * 获取API基础URL
   */
  getBaseUrl() {
    switch (this.provider) {
      case 'anthropic':
        return 'https://api.anthropic.com/v1/messages';
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      default:
        throw new Error(`不支持的AI提供商: ${this.provider}`);
    }
  }

  /**
   * 调用AI API
   */
  async call(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('AI API密钥未配置，请设置 ANTHROPIC_API_KEY 或 OPENAI_API_KEY');
    }

    try {
      const response = await this.makeRequest(prompt, options);
      return this.parseResponse(response);
    } catch (error) {
      console.error('AI调用失败:', error);
      throw new Error(`AI服务错误: ${error.message}`);
    }
  }

  /**
   * 发送请求
   */
  async makeRequest(prompt, options) {
    const headers = this.getHeaders();
    const body = this.getRequestBody(prompt, options);

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API请求失败 (${response.status}): ${error}`);
    }

    return await response.json();
  }

  /**
   * 获取请求头
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.provider === 'anthropic') {
      headers['x-api-key'] = this.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else if (this.provider === 'openai') {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * 获取请求体
   */
  getRequestBody(prompt, options) {
    const {
      maxTokens = 4096,
      temperature = 0.7,
      systemPrompt = '你是一个专业的历史学家助手。'
    } = options;

    if (this.provider === 'anthropic') {
      return {
        model: this.model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      };
    } else if (this.provider === 'openai') {
      return {
        model: this.model,
        max_tokens: maxTokens,
        temperature,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      };
    }
  }

  /**
   * 解析响应
   */
  parseResponse(response) {
    if (this.provider === 'anthropic') {
      return response.content[0].text;
    } else if (this.provider === 'openai') {
      return response.choices[0].message.content;
    }
  }

  /**
   * 流式调用（可选）
   */
  async *stream(prompt, options = {}) {
    const headers = this.getHeaders();
    const body = {
      ...this.getRequestBody(prompt, options),
      stream: true
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
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
          const data = JSON.parse(line.slice(6));
          yield this.parseStreamChunk(data);
        }
      }
    }
  }

  /**
   * 解析流式响应块
   */
  parseStreamChunk(chunk) {
    if (this.provider === 'anthropic') {
      return chunk.delta?.text || '';
    } else if (this.provider === 'openai') {
      return chunk.choices[0]?.delta?.content || '';
    }
    return '';
  }
}

export default AIService;
