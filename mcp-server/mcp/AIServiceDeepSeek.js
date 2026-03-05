import DeepSeekService from './DeepSeekService.js';

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'deepseek';
    
    if (this.provider === 'deepseek') {
      this.service = new DeepSeekService();
    } else {
      // 其他提供商...
      throw new Error(`不支持的AI提供商: ${this.provider}`);
    }
  }

  async call(prompt, options = {}) {
    return await this.service.call(prompt, options);
  }

  async *stream(prompt, options = {}) {
    yield* this.service.stream(prompt, options);
  }
}

export default AIService;
