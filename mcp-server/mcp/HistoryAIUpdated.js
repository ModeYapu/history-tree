import AIService from './AIService.js';

export default class HistoryAI {
  constructor() {
    this.ai = new AIService();
  }

  async callAI(prompt) {
    return await this.ai.call(prompt);
  }
}
