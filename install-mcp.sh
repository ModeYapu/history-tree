#!/bin/bash
# MCP集成安装脚本

echo "🚀 历史之树 MCP AI Agent 集成"
echo "================================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 需要安装 Node.js (>=18.0.0)"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查mcporter
if ! command -v mcporter &> /dev/null; then
    echo "⚠️  mcporter 未安装，正在安装..."
    npm install -g mcporter
fi

echo "✅ mcporter 版本: $(mcporter --version)"

# 安装MCP服务器依赖
echo ""
echo "📦 安装 MCP 服务器依赖..."
cd mcp-server
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"

# 配置环境变量
echo ""
echo "⚙️  配置环境变量..."
if [ ! -f .env ]; then
    cat > .env << EOL
# AI模型配置
HISTORY_AI_MODEL=claude-3-5-sonnet-20241022
HISTORY_AI_API_KEY=your_api_key_here

# 数据配置
HISTORY_DATA_PATH=../data
HISTORY_CACHE_ENABLED=true
EOL
    echo "✅ 创建 .env 配置文件"
    echo "⚠️  请编辑 mcp-server/.env 设置你的 API Key"
else
    echo "✅ .env 文件已存在"
fi

# 测试MCP服务器
echo ""
echo "🧪 测试 MCP 服务器..."
cd ..
node -e "
const { spawn } = require('child_process');
const server = spawn('node', ['mcp-server/index.js'], { stdio: 'pipe' });

let output = '';
server.stdout.on('data', (data) => {
    output += data.toString();
    if (output.includes('running')) {
        console.log('✅ MCP 服务器启动成功');
        server.kill();
        process.exit(0);
    }
});

server.stderr.on('data', (data) => {
    const msg = data.toString();
    if (msg.includes('running')) {
        console.log('✅ MCP 服务器启动成功');
        server.kill();
        process.exit(0);
    }
});

setTimeout(() => {
    console.log('⚠️  服务器启动超时');
    server.kill();
    process.exit(1);
}, 5000);
" &

sleep 2

# 注册到mcporter
echo ""
echo "📝 注册到 mcporter..."
ABSOLUTE_PATH="$(cd "$(dirname "$0")/mcp-server" && pwd)"
mcporter config add history-tree "node ${ABSOLUTE_PATH}/index.js" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ 已注册到 mcporter"
else
    echo "⚠️  注册失败，请手动配置"
fi

# 完成
echo ""
echo "🎉 MCP AI Agent 集成完成！"
echo ""
echo "📖 使用方法："
echo "  1. 配置 API Key: 编辑 mcp-server/.env"
echo "  2. 启动应用: ./start.sh"
echo "  3. 使用AI聊天: 点击右下角AI助手按钮"
echo ""
echo "🔧 MCP命令："
echo "  mcporter list history-tree              # 列出工具"
echo "  mcporter call history-tree.search_history query='唐朝'  # 搜索"
echo "  mcporter call history-tree.ask_history_question question='问题'  # 问答"
echo ""
echo "📚 文档："
echo "  - MCP使用指南: MCP_USAGE_GUIDE.md"
echo "  - 服务器文档: mcp-server/README.md"
echo ""
