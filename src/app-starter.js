/**
 * 应用启动脚本 - 集成AI Agent
 */

// 在页面加载完成后初始化AI Agent
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 启动历史之树应用...');
  
  // 等待主应用加载
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 动态加载AI Agent
  const script = document.createElement('script');
  script.src = 'src/ai-agent-integration.js';
  document.head.appendChild(script);
  
  script.onerror = function() {
    console.warn('⚠️  AI Agent 加载失败，使用基础模式');
  };
});

console.log('✅ 启动脚本已加载');
