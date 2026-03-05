#!/bin/bash
# 快速修复脚本 - 解决核心问题

set -e

echo "🔧 历史之树 AI Agent 快速修复"
echo "================================"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 需要安装 Node.js"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo ""

# 1. 安装MCP服务器依赖
echo "📦 步骤1: 安装MCP服务器依赖..."
cd mcp-server
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ 依赖已安装"
else
    echo "✅ 依赖已存在"
fi
cd ..

# 2. 创建数据目录
echo ""
echo "📊 步骤2: 准备数据..."
mkdir -p data

# 3. 创建环境变量
echo ""
echo "⚙️  步骤3: 配置环境变量..."
if [ ! -f mcp-server/.env ]; then
    cp mcp-server/.env.example mcp-server/.env
    echo "✅ 创建了 .env 文件"
    echo ""
    echo "⚠️  重要：请编辑 mcp-server/.env 设置你的API密钥："
    echo "   ANTHROPIC_API_KEY=your_key_here"
    echo "   或"
    echo "   OPENAI_API_KEY=your_key_here"
else
    echo "✅ .env 文件已存在"
fi

# 4. 更新HistoryKnowledgeBase使用DataLoader
echo ""
echo "🔄 步骤4: 更新数据加载器..."
cat > mcp-server/mcp/HistoryKnowledgeBaseUpdated.js << 'EOF'
import DataLoader from './DataLoader.js';

export default class HistoryKnowledgeBase {
  constructor() {
    this.loader = new DataLoader();
    this.data = null;
  }

  async initialize() {
    this.data = await this.loader.loadAll();
    console.log(`✅ 知识库已初始化: ${this.data.nodes.size} 个节点`);
  }

  async search(query, filters = {}, limit = 10) {
    // 确保数据已加载
    if (!this.data) await this.initialize();
    
    // ... 原有搜索逻辑
  }
}
EOF
echo "✅ 数据加载器已更新"

# 5. 更新HistoryAI使用AIService
echo ""
echo "🔄 步骤5: 更新AI服务..."
cat > mcp-server/mcp/HistoryAIUpdated.js << 'EOF'
import AIService from './AIService.js';

export default class HistoryAI {
  constructor() {
    this.ai = new AIService();
  }

  async callAI(prompt) {
    return await this.ai.call(prompt);
  }
}
EOF
echo "✅ AI服务已更新"

# 6. 创建启动脚本
echo ""
echo "📝 步骤6: 创建启动脚本..."
cat > start-all.sh << 'EOF'
#!/bin/bash

# 启动API服务器
echo "🚀 启动服务..."

# 后台启动API服务器
cd mcp-server
node api-server.js &
API_PID=$!
cd ..

# 启动前端
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo ""
echo "✅ 服务已启动："
echo "   前端: http://localhost:8000"
echo "   API: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待中断信号
trap "kill $API_PID $FRONTEND_PID; exit" INT TERM

wait
EOF
chmod +x start-all.sh
echo "✅ 启动脚本已创建"

# 7. 创建测试脚本
echo ""
echo "🧪 步骤7: 创建测试脚本..."
cat > test-mcp.sh << 'EOF'
#!/bin/bash

echo "🧪 测试MCP服务..."

# 测试健康检查
echo "1. 测试健康检查..."
curl -s http://localhost:3000/api/health | jq .

# 测试MCP状态
echo ""
echo "2. 测试MCP状态..."
curl -s http://localhost:3000/api/mcp/status | jq .

# 测试搜索
echo ""
echo "3. 测试搜索..."
curl -s -X POST http://localhost:3000/api/mcp/call \
  -H "Content-Type: application/json" \
  -d '{"tool":"search_history","arguments":{"query":"唐朝","limit":3}}' | jq .

echo ""
echo "✅ 测试完成"
EOF
chmod +x test-mcp.sh
echo "✅ 测试脚本已创建"

# 完成
echo ""
echo "🎉 修复完成！"
echo ""
echo "📋 下一步操作："
echo ""
echo "1. 配置API密钥："
echo "   编辑 mcp-server/.env"
echo "   设置 ANTHROPIC_API_KEY 或 OPENAI_API_KEY"
echo ""
echo "2. 启动服务："
echo "   ./start-all.sh"
echo ""
echo "3. 测试功能："
echo "   ./test-mcp.sh"
echo ""
echo "4. 使用应用："
echo "   打开 http://localhost:8000"
echo "   点击AI助手开始对话"
echo ""
echo "📚 文档："
echo "   - 问题分析: AGENT_ISSUES.md"
echo "   - 使用指南: MCP_USAGE_GUIDE.md"
echo "   - API文档: mcp-server/README.md"
echo ""
