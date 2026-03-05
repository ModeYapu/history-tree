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
