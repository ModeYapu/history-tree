# 🤖 历史之树 MCP AI Agent 使用指南

## 概述

历史之树现在集成了 **MCP (Model Context Protocol)** AI Agent能力，提供强大的历史知识查询、分析和推荐功能。

## 🎯 核心能力

### 1. 智能搜索
```bash
# 搜索历史事件
mcporter call history-tree.search_history query="唐朝" limit:5

# 带筛选的搜索
mcporter call history-tree.search_history \
  query="秦朝" \
  filters='{"category":"politics","importance":5}'
```

### 2. AI关联分析
```bash
# 分析事件关联
mcporter call history-tree.analyze_connections \
  node_id="event_1" \
  depth:2 \
  include_ai_analysis:true
```

### 3. 历史问答
```bash
# 提问
mcporter call history-tree.ask_history_question \
  question="为什么唐朝会发生安史之乱？"
```

### 4. 时间线生成
```bash
# 生成时间线
mcporter call history-tree.generate_timeline \
  theme="工业革命" \
  start_year:1760 \
  end_year:1840 \
  format:"markdown"
```

### 5. 智能推荐
```bash
# 推荐内容
mcporter call history-tree.recommend_content \
  interests='["科技","文化"]' \
  limit:5
```

### 6. 事件对比
```bash
# 对比分析
mcporter call history-tree.compare_events \
  event_ids='["event_1","event_2"]' \
  aspects='["cause","effect","similarity"]'
```

### 7. 影响链追踪
```bash
# 追踪影响
mcporter call history-tree.trace_influence_chain \
  node_id="event_1" \
  direction:"forward" \
  max_depth:3
```

## 🚀 快速开始

### 方式1：在应用中使用

1. **启动应用**
```bash
cd /root/.openclaw/workspace/history-tree
./start.sh
```

2. **打开AI聊天**
   - 点击右下角的AI助手按钮
   - 查看MCP连接状态

3. **使用AI功能**
   - 输入问题："唐朝有哪些重要事件？"
   - 点击快捷按钮：搜索、时间线、推荐、分析

### 方式2：通过MCP服务器

1. **安装依赖**
```bash
cd mcp-server
npm install
```

2. **启动服务器**
```bash
npm start
```

3. **使用mcporter调用**
```bash
# 列出所有工具
mcporter list history-tree

# 搜索
mcporter call history-tree.search_history query="秦朝"

# 问答
mcporter call history-tree.ask_history_question question="秦始皇统一六国的意义"
```

### 方式3：集成到其他应用

```javascript
import { HistoryTreeMCPClient } from './services/MCPClient.js';

// 初始化
const client = new HistoryTreeMCPClient();
await client.initialize();

// 搜索
const results = await client.searchHistory('唐朝', {}, 10);

// 问答
const answer = await client.askQuestion('唐朝为什么繁荣？');

// 分析
const analysis = await client.analyzeConnections('node_1', 2, true);
```

## 📚 完整工具列表

### 查询工具
| 工具 | 功能 | 参数 |
|------|------|------|
| `search_history` | 搜索历史 | query, filters, limit |
| `get_history_detail` | 获取详情 | id, include_relations |

### AI分析工具
| 工具 | 功能 | 参数 |
|------|------|------|
| `analyze_connections` | 关联分析 | node_id, depth, include_ai_analysis |
| `ask_history_question` | 历史问答 | question, context |
| `compare_events` | 事件对比 | event_ids, aspects |
| `trace_influence_chain` | 影响追踪 | node_id, direction, max_depth |

### 生成工具
| 工具 | 功能 | 参数 |
|------|------|------|
| `generate_timeline` | 时间线 | theme, start_year, end_year, format |
| `get_statistics` | 统计信息 | type, filters |
| `export_data` | 数据导出 | format, filters, include_relations |

### 推荐工具
| 工具 | 功能 | 参数 |
|------|------|------|
| `recommend_content` | 内容推荐 | interests, current_node_id, limit |

## 💡 使用示例

### 示例1：研究某个朝代
```javascript
// 1. 搜索朝代
const dynasty = await client.searchHistory('唐朝', { category: 'politics' }, 20);

// 2. 生成时间线
const timeline = await client.generateTimeline('唐朝', { 
  start_year: 618, 
  end_year: 907,
  format: 'markdown' 
});

// 3. 分析重要事件
const analysis = await client.analyzeConnections('tang_an_lushan_rebellion', 2, true);

// 4. 推荐相关内容
const recommendations = await client.recommendContent(['唐朝', '安史之乱', '政治'], null, 5);
```

### 示例2：对比分析
```javascript
// 对比两个历史事件
const comparison = await client.compareEvents(
  ['qin_unification', 'tang_unification'],
  ['cause', 'effect', 'significance', 'similarity', 'difference']
);

console.log('相似点:', comparison.similarities);
console.log('不同点:', comparison.differences);
```

### 示例3：追踪影响
```javascript
// 追踪工业革命的影响
const chain = await client.traceInfluence(
  'industrial_revolution',
  'forward',  // 前向追踪
  3           // 深度3层
);

console.log('影响链:', chain);
```

## 🎨 Web界面集成

### 增强的AI聊天

新的AI聊天组件支持：

1. **智能意图识别**
   - 自动识别搜索、问答、分析等意图
   - 路由到相应的MCP工具

2. **快捷操作**
   - 🔍 搜索 - 快速搜索历史
   - 📊 时间线 - 生成时间线
   - 💡 推荐 - 智能推荐
   - 🤖 分析 - AI分析关联

3. **上下文感知**
   - 基于当前浏览内容推荐
   - 基于历史记录分析兴趣
   - 智能提示和补全

### 使用方法

1. **打开聊天**
```javascript
// 在应用中
app.aiChat.toggle();
```

2. **发送消息**
```
用户：唐朝有哪些重要事件？
AI：找到 15 个相关结果...
```

3. **使用快捷按钮**
   - 点击"分析" - 分析当前选中节点
   - 点击"推荐" - 获取个性化推荐
   - 点击"时间线" - 生成时间线

## 🔧 高级配置

### MCP服务器配置

编辑 `mcp-server/config.json`:

```json
{
  "ai": {
    "model": "claude-3-5-sonnet-20241022",
    "apiKey": "your-api-key",
    "maxTokens": 4096,
    "temperature": 0.7
  },
  "cache": {
    "enabled": true,
    "ttl": 3600
  },
  "data": {
    "path": "../data",
    "autoReload": true
  }
}
```

### 客户端配置

```javascript
const client = new HistoryTreeMCPClient({
  endpoint: 'http://localhost:3000/api/mcp',
  timeout: 30000,
  retryAttempts: 3,
  enableCache: true
});
```

## 📊 性能优化

### 缓存策略
- AI分析结果缓存1小时
- 搜索结果缓存30分钟
- 统计数据缓存24小时

### 批量处理
```javascript
// 批量搜索
const queries = ['唐朝', '宋朝', '明朝'];
const results = await Promise.all(
  queries.map(q => client.searchHistory(q))
);
```

## 🔍 故障排查

### MCP连接失败
```bash
# 检查服务器状态
mcporter list history-tree

# 查看日志
tail -f mcp-server/logs/error.log
```

### AI响应慢
- 检查API密钥是否有效
- 检查网络连接
- 启用缓存减少API调用

## 📖 API文档

完整的API文档请查看：
- [MCP服务器 README](./mcp-server/README.md)
- [API参考文档](./docs/api.md)

## 🆘 获取帮助

- 查看文档：`docs/` 目录
- 提交问题：GitHub Issues
- 社区支持：Discord

---

**更新日期**: 2026-03-01  
**版本**: 1.0.0  
**作者**: OpenClaw AI Assistant
