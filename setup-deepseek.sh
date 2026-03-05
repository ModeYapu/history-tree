#!/bin/bash
# 配置DeepSeek模型

echo "🤖 配置DeepSeek模型"
echo "===================="
echo ""

# 备份原配置
if [ -f mcp-server/.env ]; then
    cp mcp-server/.env mcp-server/.env.backup
    echo "✅ 已备份原配置"
fi

# 使用DeepSeek配置
cp mcp-server/.env.deepseek mcp-server/.env
echo "✅ 已切换到DeepSeek配置"

# 更新AIService以支持DeepSeek
cat > mcp-server/mcp/AIServiceDeepSeek.js << 'EOF'
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
EOF

echo "✅ AI服务已更新为DeepSeek"

echo ""
echo "📋 下一步:"
echo "  1. 获取DeepSeek API密钥: https://platform.deepseek.com/"
echo "  2. 配置密钥: nano mcp-server/.env"
echo "  3. 启动服务: ./start-simple.sh"
echo ""
echo "💰 DeepSeek优势:"
echo "  - 性价比极高: ¥1/百万tokens"
echo "  - 性能强大: 接近GPT-4水平"
echo "  - 中文优化: 更懂中文历史"
echo "  - 无需翻墙: 国内直接访问"
echo ""
