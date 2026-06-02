# 🚀 快速开始指南

## ⚡ 3步启动AI Agent

### 第1步：运行修复脚本

```bash
cd /root/.openclaw/workspace/history-tree
./quick-fix.sh
```

这将自动：
- ✅ 安装所有依赖
- ✅ 配置环境
- ✅ 创建启动脚本
- ✅ 准备数据

### 第2步：配置API密钥

编辑 `mcp-server/.env`：

```bash
# 选择一个配置

# 方案1: Anthropic (推荐)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-sonnet-20241022

# 方案2: OpenAI
OPENAI_API_KEY=sk-xxxxx
AI_PROVIDER=openai
AI_MODEL=gpt-4-turbo-preview
```

**获取API密钥**：
- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/

### 第3步：启动服务

```bash
./start-all.sh
```

访问：
- 🌐 **前端**: http://localhost:8000
- 🔌 **API**: http://localhost:3000
- 🤖 **AI聊天**: 点击右下角AI助手

---

## 🧪 测试功能

```bash
# 运行测试
./test-mcp.sh

# 或手动测试
curl -X POST http://localhost:3000/api/mcp/call \
  -H "Content-Type: application/json" \
  -d '{"tool":"search_history","arguments":{"query":"唐朝","limit":3}}'
```

---

## 📖 使用示例

### 命令行

```bash
# 搜索历史
mcporter call history-tree.search_history query="秦朝"

# AI问答
mcporter call history-tree.ask_history_question \
  question="唐朝为什么繁荣？"

# 生成时间线
mcporter call history-tree.generate_timeline \
  theme="工业革命" \
  format:"markdown"
```

### Web界面

1. 打开 http://localhost:8000
2. 点击右下角AI助手
3. 输入问题：
   - "唐朝有哪些重要事件？"
   - "分析一下秦始皇统一六国的影响"
   - "推荐一些关于唐朝的内容"

---

## ❓ 常见问题

### Q1: API密钥错误

```bash
# 检查配置
cat mcp-server/.env | grep API_KEY

# 确保密钥格式正确
# Anthropic: sk-ant-api03-xxxxx
# OpenAI: sk-xxxxx
```

### Q2: 服务启动失败

```bash
# 检查端口占用
lsof -i :3000
lsof -i :8000

# 查看日志
tail -f mcp-server/logs/error.log
```

### Q3: AI响应慢

- 检查网络连接
- 尝试更换AI提供商
- 启用缓存：在 .env 中设置 `CACHE_ENABLED=true`

---

## 🔧 高级配置

### 使用不同AI模型

```bash
# .env 文件
AI_MODEL=claude-3-opus-20240229  # 更强大
AI_MODEL=claude-3-haiku-20240307 # 更快速
```

### 自定义数据源

```bash
# 使用自己的数据文件
HISTORY_DATA_PATH=/path/to/your/data.json
```

### 启用缓存

```bash
# .env 文件
CACHE_ENABLED=true
CACHE_TTL=3600
```

---

## 📚 完整文档

- **问题分析**: [AGENT_ISSUES.md](./AGENT_ISSUES.md)
- **使用指南**: [MCP_USAGE_GUIDE.md](./MCP_USAGE_GUIDE.md)
- **API文档**: [mcp-server/README.md](./mcp-server/README.md)
- **完成总结**: [MCP_COMPLETION_SUMMARY.md](./MCP_COMPLETION_SUMMARY.md)

---

## 🆘 获取帮助

遇到问题？

1. 查看 [AGENT_ISSUES.md](./AGENT_ISSUES.md) 了解已知问题
2. 查看日志：`tail -f mcp-server/logs/error.log`
3. 提交Issue：GitHub Issues

---

**更新时间**: 2026-03-01
