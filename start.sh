#!/bin/bash

# 历史之树 - 启动脚本

echo "🌳 历史之树 v4.4 - AI驱动的历史发现引擎"
echo ""

# 检查Python
if command -v python3 &> /dev/null; then
    echo "✅ 使用Python 3启动服务器..."
    echo "📍 服务地址: http://localhost:8000"
    echo ""
    echo "💡 提示："
    echo "   - 按 Ctrl+C 停止服务器"
    echo "   - 在浏览器中打开 http://localhost:8000"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 使用Python 2启动服务器..."
    echo "📍 服务地址: http://localhost:8000"
    echo ""
    echo "💡 提示："
    echo "   - 按 Ctrl+C 停止服务器"
    echo "   - 在浏览器中打开 http://localhost:8000"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
    echo "✅ 使用Node.js启动服务器..."
    echo "📍 服务地址: http://localhost:8000"
    echo ""
    echo "💡 提示："
    echo "   - 按 Ctrl+C 停止服务器"
    echo "   - 在浏览器中打开 http://localhost:8000"
    echo ""
    npx http-server -p 8000
else
    echo "❌ 错误：未找到可用的HTTP服务器"
    echo ""
    echo "请安装以下任一工具："
    echo "  - Python 3: https://www.python.org/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    exit 1
fi
