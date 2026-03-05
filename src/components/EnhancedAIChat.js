/**
 * 增强的AI聊天组件 - 集成MCP
 */

class EnhancedAIChat {
  constructor(app) {
    this.app = app;
    this.mcpClient = null;
    this.container = null;
    this.messages = [];
    this.isOpen = false;
    this.isTyping = false;
  }

  /**
   * 初始化
   */
  async initialize() {
    // 初始化MCP客户端
    this.mcpClient = new HistoryTreeMCPClient();
    await this.mcpClient.initialize();
    
    console.log('🤖 AI聊天已初始化，MCP:', this.mcpClient.connected ? '已连接' : '离线模式');
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'ai-chat-panel enhanced';
    
    this.container.innerHTML = `
      <div class="chat-header">
        <div class="header-left">
          <h3>🤖 历史AI助手</h3>
          <span class="mcp-status ${this.mcpClient?.connected ? 'connected' : 'offline'}">
            ${this.mcpClient?.connected ? 'MCP已连接' : '离线模式'}
          </span>
        </div>
        <button class="close-btn">×</button>
      </div>
      
      <div class="chat-messages">
        <div class="message ai-message">
          <div class="message-content">
            你好！我是历史AI助手，我可以帮你：
          </div>
          <ul class="capabilities">
            <li>🔍 搜索历史事件和人物</li>
            <li>🤖 AI分析历史关联</li>
            <li>❓ 回答历史问题</li>
            <li>📊 生成时间线</li>
            <li>💡 推荐相关内容</li>
            <li>🔄 对比历史事件</li>
          </ul>
        </div>
      </div>
      
      <div class="quick-actions">
        <button class="action-btn" data-action="search">
          🔍 搜索
        </button>
        <button class="action-btn" data-action="timeline">
          📊 时间线
        </button>
        <button class="action-btn" data-action="recommend">
          💡 推荐
        </button>
        <button class="action-btn" data-action="analyze">
          🤖 分析
        </button>
      </div>
      
      <div class="chat-input">
        <input type="text" class="message-input" placeholder="问我任何历史问题..." />
        <button class="send-btn">发送</button>
      </div>
    `;
    
    this.attachEventListeners();
    return this.container;
  }

  attachEventListeners() {
    // 发送消息
    const input = this.container.querySelector('.message-input');
    const sendBtn = this.container.querySelector('.send-btn');
    
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    
    // 关闭按钮
    this.container.querySelector('.close-btn').addEventListener('click', () => {
      this.toggle();
    });
    
    // 快捷操作
    this.container.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleQuickAction(action);
      });
    });
  }

  /**
   * 发送消息
   */
  async sendMessage() {
    const input = this.container.querySelector('.message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    this.addMessage('user', message);
    input.value = '';
    
    // 显示输入指示
    this.showTyping();
    
    try {
      // 智能判断意图
      const intent = await this.detectIntent(message);
      
      // 调用相应的MCP工具
      const response = await this.handleIntent(intent, message);
      
      // 添加AI回复
      this.addMessage('ai', response);
    } catch (error) {
      this.addMessage('error', `抱歉，处理您的请求时出错：${error.message}`);
    } finally {
      this.hideTyping();
    }
  }

  /**
   * 检测意图
   */
  async detectIntent(message) {
    const lower = message.toLowerCase();
    
    // 搜索意图
    if (lower.includes('搜索') || lower.includes('查找') || lower.includes('找')) {
      return { type: 'search', query: message };
    }
    
    // 时间线意图
    if (lower.includes('时间线') || lower.includes('时间轴') || lower.includes('历程')) {
      return { type: 'timeline', theme: message };
    }
    
    // 分析意图
    if (lower.includes('分析') || lower.includes('关联') || lower.includes('关系')) {
      return { type: 'analyze', query: message };
    }
    
    // 对比意图
    if (lower.includes('对比') || lower.includes('比较') || lower.includes('区别')) {
      return { type: 'compare', query: message };
    }
    
    // 推荐意图
    if (lower.includes('推荐') || lower.includes('建议') || lower.includes('还有')) {
      return { type: 'recommend', query: message };
    }
    
    // 默认：问答
    return { type: 'question', question: message };
  }

  /**
   * 处理意图
   */
  async handleIntent(intent, message) {
    switch (intent.type) {
      case 'search':
        return await this.handleSearch(intent.query);
      
      case 'timeline':
        return await this.handleTimeline(intent.theme);
      
      case 'analyze':
        return await this.handleAnalyze(intent.query);
      
      case 'compare':
        return await this.handleCompare(intent.query);
      
      case 'recommend':
        return await this.handleRecommend(intent.query);
      
      case 'question':
      default:
        return await this.handleQuestion(intent.question);
    }
  }

  /**
   * 处理搜索
   */
  async handleSearch(query) {
    const results = await this.mcpClient.searchHistory(query, {}, 5);
    
    if (results.count === 0) {
      return '没有找到相关内容，请尝试其他关键词。';
    }
    
    let response = `找到 ${results.count} 个相关结果：\n\n`;
    
    results.results.forEach((item, index) => {
      response += `${index + 1}. **${item.name}** (${item.year})\n`;
      response += `   ${item.summary}\n\n`;
    });
    
    return response;
  }

  /**
   * 处理时间线
   */
  async handleTimeline(theme) {
    const timeline = await this.mcpClient.generateTimeline(theme, { format: 'markdown' });
    
    return `📅 ${theme} 时间线：\n\n${timeline}`;
  }

  /**
   * 处理分析
   */
  async handleAnalyze(query) {
    // 提取节点ID（实际应该从上下文获取）
    const nodeId = this.app.currentNode?.id;
    
    if (!nodeId) {
      return '请先选择一个历史节点，然后再进行分析。';
    }
    
    const analysis = await this.mcpClient.analyzeConnections(nodeId, 2, true);
    
    let response = `🔗 关联分析结果：\n\n`;
    response += `找到 ${analysis.total} 个关联\n`;
    response += `- 本地关系：${analysis.local_count}\n`;
    response += `- AI发现：${analysis.ai_count}\n\n`;
    
    analysis.connections.slice(0, 5).forEach((conn, index) => {
      response += `${index + 1}. ${conn.target_id}\n`;
      response += `   类型：${conn.type}，强度：${(conn.strength * 100).toFixed(0)}%\n`;
      response += `   证据：${conn.evidence}\n\n`;
    });
    
    return response;
  }

  /**
   * 处理对比
   */
  async handleCompare(query) {
    // 实际应该让用户选择要对比的事件
    return '对比功能需要选择2个或以上的历史事件。请在树上选择节点后，点击"对比"按钮。';
  }

  /**
   * 处理推荐
   */
  async handleRecommend(query) {
    const interests = this.getUserInterests();
    const recommendations = await this.mcpClient.recommendContent(interests, null, 5);
    
    let response = `💡 为您推荐：\n\n`;
    
    recommendations.forEach((rec, index) => {
      response += `${index + 1}. **${rec.name}**\n`;
      response += `   ${rec.reason}\n\n`;
    });
    
    return response;
  }

  /**
   * 处理问答
   */
  async handleQuestion(question) {
    const context = {
      related_nodes: this.getSelectedNodes(),
      time_period: this.app.currentPeriod
    };
    
    const result = await this.mcpClient.askQuestion(question, context);
    
    return result.answer;
  }

  /**
   * 处理快捷操作
   */
  async handleQuickAction(action) {
    switch (action) {
      case 'search':
        this.addMessage('ai', '请输入要搜索的关键词，例如：\n- "唐朝"\n- "秦始皇"\n- "工业革命"');
        break;
      
      case 'timeline':
        this.addMessage('ai', '请输入要生成时间线的主题，例如：\n- "唐朝历史"\n- "工业革命"\n- "中国近代史"');
        break;
      
      case 'recommend':
        await this.handleQuickRecommend();
        break;
      
      case 'analyze':
        await this.handleQuickAnalyze();
        break;
    }
  }

  /**
   * 快速推荐
   */
  async handleQuickRecommend() {
    const interests = this.getUserInterests();
    const recommendations = await this.mcpClient.recommendContent(interests, null, 3);
    
    let message = '💡 根据您的兴趣推荐：\n\n';
    recommendations.forEach((rec, index) => {
      message += `${index + 1}. ${rec.name}\n`;
    });
    
    this.addMessage('ai', message);
  }

  /**
   * 快速分析
   */
  async handleQuickAnalyze() {
    const nodeId = this.app.currentNode?.id;
    
    if (!nodeId) {
      this.addMessage('ai', '请先在树上选择一个节点，然后点击分析。');
      return;
    }
    
    const analysis = await this.mcpClient.analyzeConnections(nodeId);
    
    let message = `🤖 AI分析结果：\n\n`;
    message += `发现 ${analysis.total} 个关联关系\n`;
    
    this.addMessage('ai', message);
  }

  /**
   * 添加消息
   */
  addMessage(type, content) {
    const messagesContainer = this.container.querySelector('.chat-messages');
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}-message`;
    messageEl.innerHTML = `
      <div class="message-content">${this.formatMessage(content)}</div>
    `;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.messages.push({ type, content, timestamp: Date.now() });
  }

  /**
   * 格式化消息
   */
  formatMessage(content) {
    // 简单的Markdown支持
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  /**
   * 显示输入指示
   */
  showTyping() {
    this.isTyping = true;
    const messagesContainer = this.container.querySelector('.chat-messages');
    
    const typingEl = document.createElement('div');
    typingEl.className = 'message ai-message typing';
    typingEl.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * 隐藏输入指示
   */
  hideTyping() {
    this.isTyping = false;
    const typing = this.container.querySelector('.typing');
    if (typing) typing.remove();
  }

  /**
   * 获取用户兴趣
   */
  getUserInterests() {
    // 从浏览历史推断兴趣
    const interests = new Set();
    
    this.messages.forEach(msg => {
      if (msg.type === 'user') {
        // 简单的关键词提取
        const keywords = msg.content.match(/[\u4e00-\u9fa5]+/g) || [];
        keywords.forEach(k => interests.add(k));
      }
    });
    
    return Array.from(interests).slice(0, 5);
  }

  /**
   * 获取选中的节点
   */
  getSelectedNodes() {
    // 实际应该从应用状态获取
    return this.app.selectedNodes || [];
  }

  /**
   * 切换显示
   */
  toggle() {
    this.isOpen = !this.isOpen;
    this.container.style.display = this.isOpen ? 'flex' : 'none';
  }
}

// 导出到全局
window.EnhancedAIChat = EnhancedAIChat;
