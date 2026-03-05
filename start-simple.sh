#!/bin/bash
# 简化启动脚本 - 不使用后台进程

echo "🚀 启动历史之树 + AI Agent"
echo "============================"
echo ""

# 检查API配置
if grep -q "your_anthropic_key_here\|your_openai_key_here" mcp-server/.env; then
    echo "⚠️  警告: API密钥未配置"
    echo ""
    echo "请编辑 mcp-server/.env 设置你的API密钥："
    echo "  ANTHROPIC_API_KEY=sk-ant-xxxxx"
    echo "  或"
    echo "  OPENAI_API_KEY=sk-xxxxx"
    echo ""
    echo "获取密钥："
    echo "  - Anthropic: https://console.anthropic.com/"
    echo "  - OpenAI: https://platform.openai.com/"
    echo ""
    read -p "是否继续启动（无AI功能）？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查端口
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  端口8000已被占用"
    echo "尝试停止现有服务..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  端口3000已被占用"
    echo "尝试停止现有服务..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo ""
echo "📡 启动API服务器（后台）..."
cd mcp-server
node api-server.js > ../logs/api-server.log 2>&1 &
API_PID=$!
cd ..
sleep 2

# 检查API服务器是否启动
if ps -p $API_PID > /dev/null; then
    echo "✅ API服务器已启动 (PID: $API_PID)"
else
    echo "❌ API服务器启动失败"
    echo "查看日志: tail -f logs/api-server.log"
    exit 1
fi

echo ""
echo "🌐 启动前端服务器..."
echo ""
echo "✅ 服务已启动："
echo "   前端: http://localhost:8000"
echo "   API:  http://localhost:3000"
echo "   状态: http://localhost:3000/api/health"
echo ""
echo "🤖 AI Agent: 点击页面右下角🤖按钮"
echo ""
echo "📝 日志文件："
echo "   API日志: logs/api-server.log"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 保存PID
echo $API_PID > .api-server.pid

# 启动前端（前台运行）
python3 -m http.server 8000

# 清理函数
cleanup() {
    echo ""
    echo "🛑 停止服务..."
    if [ -f .api-server.pid ]; then
        kill $(cat .api-server.pid) 2>/dev/null
        rm .api-server.pid
    fi
    exit 0
}

trap cleanup INT TERM
