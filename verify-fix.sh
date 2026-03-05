#!/bin/bash
# 验证脚本 - 检查所有修复是否完成

echo "🔍 历史之树 AI Agent 修复验证"
echo "================================"
echo ""

SUCCESS=0
FAILED=0

# 1. 检查核心文件
echo "📄 检查核心文件..."
files=(
  "mcp-server/mcp/DataLoader.js"
  "mcp-server/mcp/AIService.js"
  "mcp-server/api-server.js"
  "src/ai-agent-integration.js"
  "src/app-starter.js"
  "mcp-server/.env"
  "start-simple.sh"
  "test-mcp.sh"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
    ((SUCCESS++))
  else
    echo "  ❌ $file - 缺失"
    ((FAILED++))
  fi
done

echo ""

# 2. 检查依赖
echo "📦 检查依赖..."
if [ -d "mcp-server/node_modules" ]; then
  echo "  ✅ node_modules 已安装"
  ((SUCCESS++))
else
  echo "  ❌ node_modules 未安装"
  ((FAILED++))
fi

if [ -d "logs" ]; then
  echo "  ✅ logs 目录已创建"
  ((SUCCESS++))
else
  echo "  ⚠️  logs 目录未创建"
fi

echo ""

# 3. 检查配置
echo "⚙️  检查配置..."
if grep -q "AI_PROVIDER" mcp-server/.env; then
  echo "  ✅ AI提供商已配置"
  ((SUCCESS++))
else
  echo "  ❌ AI提供商未配置"
  ((FAILED++))
fi

if ! grep -q "your_anthropic_key_here\|your_openai_key_here" mcp-server/.env 2>/dev/null; then
  echo "  ✅ API密钥已设置"
  ((SUCCESS++))
else
  echo "  ⚠️  API密钥使用占位符（需要手动配置）"
fi

echo ""

# 4. 检查端口
echo "🔌 检查端口..."
if lsof -i :8000 >/dev/null 2>&1; then
  echo "  ⚠️  端口8000已被占用"
else
  echo "  ✅ 端口8000可用"
  ((SUCCESS++))
fi

if lsof -i :3000 >/dev/null 2>&1; then
  echo "  ⚠️  端口3000已被占用"
else
  echo "  ✅ 端口3000可用"
  ((SUCCESS++))
fi

echo ""

# 5. 检查集成
echo "🔗 检查集成..."
if grep -q "ai-agent-integration.js" index.html; then
  echo "  ✅ 前端已集成AI Agent"
  ((SUCCESS++))
else
  echo "  ❌ 前端未集成AI Agent"
  ((FAILED++))
fi

if grep -q "DataLoader" mcp-server/mcp/HistoryKnowledgeBase.js; then
  echo "  ✅ 知识库使用DataLoader"
  ((SUCCESS++))
else
  echo "  ❌ 知识库未使用DataLoader"
  ((FAILED++))
fi

if grep -q "AIService" mcp-server/mcp/HistoryAI.js; then
  echo "  ✅ AI服务已集成"
  ((SUCCESS++))
else
  echo "  ❌ AI服务未集成"
  ((FAILED++))
fi

echo ""
echo "================================"
echo "📊 验证结果:"
echo "  ✅ 成功: $SUCCESS"
echo "  ❌ 失败: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 所有检查通过！"
  echo ""
  echo "📋 下一步:"
  echo "  1. 配置API密钥: nano mcp-server/.env"
  echo "  2. 启动服务: ./start-simple.sh"
  echo "  3. 访问应用: http://localhost:8000"
  echo "  4. 点击🤖按钮开始对话"
  exit 0
else
  echo "⚠️  发现 $FAILED 个问题"
  echo ""
  echo "建议重新运行: ./quick-fix.sh"
  exit 1
fi
