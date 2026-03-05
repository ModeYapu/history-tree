#!/bin/bash
# 快速优化 - 无需等待

echo "⚡ 快速优化历史之树 AI Agent"
echo "================================"
echo ""

# 1. 创建优化目录
mkdir -p vector-db cache logs/agents data/embeddings

# 2. 更新package.json
cd mcp-server
node -e "
const pkg = require('./package.json');
pkg.dependencies = {
  ...pkg.dependencies,
  'ws': '^8.14.0',
  'ioredis': '^5.3.2',
  'natural': '^6.10.0'
};
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ package.json已更新');
"

cd ..

# 3. 创建优化配置
cat > mcp-server/.env.optimized << 'EOF'
# 最强算力配置
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

FALLBACK_MODEL=gpt-4-turbo-preview
OPENAI_API_KEY=sk-xxxxx

FAST_MODEL=claude-3-haiku-20240307

# 性能配置
CACHE_ENABLED=true
STREAM_ENABLED=true
MAX_CONCURRENT=100
EOF

# 4. 创建Agent配置
cat > mcp-server/agents.config.json << 'EOF'
{
  "agents": {
    "SearchAgent": {"model": "claude-3-5-sonnet", "temperature": 0.3},
    "KnowledgeAgent": {"model": "claude-3-5-sonnet", "temperature": 0.5},
    "AnalysisAgent": {"model": "claude-3-5-sonnet", "temperature": 0.7},
    "TimelineAgent": {"model": "claude-3-5-sonnet", "temperature": 0.4},
    "RecommendAgent": {"model": "claude-3-haiku", "temperature": 0.6},
    "EducationAgent": {"model": "claude-3-5-sonnet", "temperature": 0.5}
  }
}
EOF

echo ""
echo "✅ 优化配置完成！"
echo ""
echo "📋 下一步:"
echo "  1. 配置API密钥: nano mcp-server/.env.optimized"
echo "  2. 安装依赖: cd mcp-server && npm install"
echo "  3. 启动服务: ./start-simple.sh"
echo ""
