/**
 * 前端集成脚本 - 将AI Agent集成到应用
 */

// 1. 加载MCP客户端和增强AI聊天
const script1 = document.createElement('script');
script1.src = 'src/services/MCPClient.js';
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'src/components/EnhancedAIChat.js';
document.head.appendChild(script2);

// 2. 等待脚本加载完成
script2.onload = async function() {
  console.log('🤖 AI Agent 正在初始化...');

  // 3. 获取应用实例（假设app是全局变量）
  const app = window.app || window.historyTreeApp;
  
  if (!app) {
    console.warn('⚠️  应用实例未找到，创建独立AI聊天');
  }

  // 4. 创建增强AI聊天实例
  try {
    const aiChat = new EnhancedAIChat(app || {});
    await aiChat.initialize();

    // 5. 添加到页面
    document.body.appendChild(aiChat.render());

    // 6. 添加触发按钮（如果不存在）
    if (!document.querySelector('.ai-chat-trigger')) {
      const triggerBtn = document.createElement('button');
      triggerBtn.className = 'ai-chat-trigger';
      triggerBtn.textContent = '🤖';
      triggerBtn.style.cssText = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        z-index: 1000;
        transition: all 0.3s ease;
      `;

      triggerBtn.addEventListener('mouseenter', () => {
        triggerBtn.style.transform = 'scale(1.1)';
        triggerBtn.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.6)';
      });

      triggerBtn.addEventListener('mouseleave', () => {
        triggerBtn.style.transform = 'scale(1)';
        triggerBtn.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
      });

      triggerBtn.addEventListener('click', () => {
        aiChat.toggle();
      });

      document.body.appendChild(triggerBtn);
    }

    // 7. 保存到全局
    window.aiChat = aiChat;

    console.log('✅ AI Agent 已就绪');
    console.log('💬 点击右下角🤖按钮开始对话');

  } catch (error) {
    console.error('❌ AI Agent 初始化失败:', error);

    // 显示错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'ai-error-toast';
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
    `;

    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'font-weight: bold; margin-bottom: 5px;';
    titleDiv.textContent = '⚠️ AI Agent 初始化失败';

    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = 'font-size: 14px;';
    msgDiv.textContent = error.message;

    const hintDiv = document.createElement('div');
    hintDiv.style.cssText = 'font-size: 12px; margin-top: 5px; opacity: 0.9;';
    hintDiv.textContent = '请检查API配置和服务状态';

    errorDiv.appendChild(titleDiv);
    errorDiv.appendChild(msgDiv);
    errorDiv.appendChild(hintDiv);

    document.body.appendChild(errorDiv);

    setTimeout(() => errorDiv.remove(), 5000);
  }
};

// 8. 添加样式
const aiStyle = document.createElement('style');
aiStyle.textContent = `
  /* AI聊天面板增强样式 */
  .ai-chat-panel.enhanced {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .ai-chat-panel .mcp-status {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    margin-left: 10px;
  }
  
  .ai-chat-panel .mcp-status.connected {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
  }
  
  .ai-chat-panel .mcp-status.offline {
    background: rgba(255, 152, 0, 0.2);
    color: #FF9800;
  }
  
  .ai-chat-panel .quick-actions {
    display: flex;
    gap: 8px;
    padding: 10px 15px;
    border-top: 1px solid #eee;
    flex-wrap: wrap;
  }
  
  .ai-chat-panel .action-btn {
    flex: 1;
    min-width: 70px;
    padding: 8px 12px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .ai-chat-panel .action-btn:hover {
    background: #e0e0e0;
    border-color: #bbb;
  }
  
  .ai-chat-panel .message {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .ai-chat-panel .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 5px;
  }
  
  .ai-chat-panel .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #999;
    animation: typing 1.4s infinite;
  }
  
  .ai-chat-panel .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .ai-chat-panel .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
  
  .ai-chat-panel .capabilities {
    margin: 10px 0 0 0;
    padding-left: 20px;
    font-size: 13px;
    color: #666;
    line-height: 1.8;
  }
`;
document.head.appendChild(aiStyle);

console.log('📝 AI Agent 集成脚本已加载');
