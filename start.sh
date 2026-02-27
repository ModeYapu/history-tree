#!/bin/bash

# 历史之树启动脚本

echo "🌳 启动历史之树..."

# 检查Python
if command -v python3 &> /dev/null; then
    echo "使用 Python 3 启动服务器..."
    echo "访问地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "使用 Python 启动服务器..."
    echo "访问地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    python -m http.server 8000
elif command -v npx &> /dev/null; then
    echo "使用 http-server 启动..."
    echo "访问地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    npx http-server -p 8000
else
    echo "❌ 未找到可用的HTTP服务器"
    echo "请安装 Python 或 Node.js"
    echo ""
    echo "或者直接用浏览器打开 index.html"
    exit 1
fi
