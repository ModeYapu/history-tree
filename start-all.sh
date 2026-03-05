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
