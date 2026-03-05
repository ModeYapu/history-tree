# 历史之树 MCP 服务器

提供历史之树项目的AI agent能力，通过MCP（Model Context Protocol）协议暴露服务。

## 功能特性

### 🔍 历史知识查询
- `search_history` - 搜索历史事件、人物或时期
- `get_history_detail` - 获取详细信息

### 🤖 AI分析能力
- `analyze_connections` - AI分析事件关联关系
- `ask_history_question` - 历史问答
- `compare_events` - 对比分析历史事件
- `trace_influence_chain` - 追踪影响链

### 📊 数据处理
- `generate_timeline` - 生成时间线
- `get_statistics` - 获取统计信息
- `export_data` - 导出多种格式

### 🎯 智能推荐
- `recommend_content` - 基于兴趣推荐内容

## 安装

```bash
cd mcp-server
npm install
```

## 使用方法

### 1. 通过 mcporter 调用

```bash
# 列出所有工具
mcporter list history-tree

# 搜索历史
mcporter call history-tree.search_history query="唐朝"

# 获取详情
mcporter call history-tree.get_history_detail id="node_1"

# AI分析
mcporter call history-tree.analyze_connections node_id="node_1" depth:2

# 历史问答
mcporter call history-tree.ask_history_question question="唐朝为什么衰落？"

# 生成时间线
mcporter call history-tree.generate_timeline theme="工业革命" format:"markdown"

# 推荐内容
mcporter call history-tree.recommend_content interests='["科技","文化"]' limit:5
```

### 2. 作为MCP服务器运行

```bash
# 启动服务器
npm start

# 或使用 mcporter
mcporter call --stdio "node /path/to/mcp-server/index.js" <tool> <args>
```

### 3. 集成到应用

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// 创建客户端
const client = new Client({
  name: 'history-tree-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

// 连接到服务器
const transport = new StdioClientTransport({
  command: 'node',
  args: ['./mcp-server/index.js']
});

await client.connect(transport);

// 调用工具
const result = await client.callTool({
  name: 'search_history',
  arguments: {
    query: '唐朝',
    limit: 10
  }
});

console.log(result);
```

## 工具详细说明

### search_history
搜索历史事件、人物或时期。

**参数**:
- `query` (string, required) - 搜索关键词
- `filters` (object, optional) - 筛选条件
  - `period` - 历史时期
  - `category` - 类别
  - `region` - 地理区域
  - `importance` - 重要程度（1-5）
- `limit` (number, optional) - 返回数量，默认10

**示例**:
```bash
mcporter call history-tree.search_history \
  query="秦朝" \
  filters='{"category":"politics","importance":5}' \
  limit:5
```

### analyze_connections
使用AI分析事件关联关系。

**参数**:
- `node_id` (string, required) - 节点ID
- `depth` (number, optional) - 分析深度（1-3），默认2
- `include_ai_analysis` (boolean, optional) - 是否包含AI分析，默认true

**返回**:
```json
{
  "total": 5,
  "local_count": 2,
  "ai_count": 3,
  "connections": [
    {
      "target_id": "node_2",
      "type": "cause",
      "strength": 0.9,
      "evidence": "直接因果关系"
    }
  ]
}
```

### ask_history_question
向AI历史助手提问。

**参数**:
- `question` (string, required) - 历史问题
- `context` (object, optional) - 上下文信息
  - `related_nodes` - 相关节点ID
  - `time_period` - 时间范围

**示例**:
```bash
mcporter call history-tree.ask_history_question \
  question="为什么唐朝会发生安史之乱？" \
  context='{"time_period":"唐朝"}'
```

### generate_timeline
生成历史时间线。

**参数**:
- `theme` (string, required) - 时间线主题
- `start_year` (number, optional) - 起始年份
- `end_year` (number, optional) - 结束年份
- `category` (string, optional) - 类别筛选
- `format` (string, optional) - 输出格式（json/markdown/html），默认markdown

**示例**:
```bash
mcporter call history-tree.generate_timeline \
  theme="工业革命" \
  start_year:1760 \
  end_year:1840 \
  format:"markdown"
```

### compare_events
对比分析历史事件。

**参数**:
- `event_ids` (array, required) - 事件ID列表（至少2个）
- `aspects` (array, optional) - 对比维度
  - `cause` - 原因
  - `effect` - 影响
  - `significance` - 意义
  - `context` - 背景
  - `similarity` - 相似点
  - `difference` - 不同点

**示例**:
```bash
mcporter call history-tree.compare_events \
  event_ids='["event_1","event_2"]' \
  aspects='["cause","effect","similarity"]'
```

### trace_influence_chain
追踪影响链。

**参数**:
- `node_id` (string, required) - 起始节点ID
- `direction` (string, optional) - 方向（forward/backward/both），默认both
- `max_depth` (number, optional) - 最大深度，默认3

**示例**:
```bash
mcporter call history-tree.trace_influence_chain \
  node_id="event_1" \
  direction:"forward" \
  max_depth:3
```

## 配置

### 环境变量

```bash
# AI模型配置
HISTORY_AI_MODEL=claude-3-5-sonnet-20241022
HISTORY_AI_API_KEY=your_api_key

# 数据源配置
HISTORY_DATA_PATH=./data
HISTORY_CACHE_ENABLED=true
```

### mcporter 配置

添加到 `mcporter.json`:

```json
{
  "servers": {
    "history-tree": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"],
      "env": {
        "HISTORY_AI_MODEL": "claude-3-5-sonnet-20241022"
      }
    }
  }
}
```

## 开发

### 添加新工具

1. 在 `index.js` 的 `ListToolsRequestSchema` 中定义工具
2. 在 `CallToolRequestSchema` 中实现工具逻辑
3. 创建或更新相应的服务类

### 测试

```bash
# 列出工具
mcporter list history-tree --schema

# 测试调用
mcporter call history-tree.search_history query="test"
```

## 集成示例

### 与 Claude Desktop 集成

编辑 Claude Desktop 配置文件：

```json
{
  "mcpServers": {
    "history-tree": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"]
    }
  }
}
```

### 与 OpenClaw 集成

```bash
# 在 OpenClaw 中注册 MCP 服务器
mcporter config add history-tree /path/to/mcp-server/index.js

# 在技能中使用
mcporter call history-tree.search_history query="唐朝"
```

## 许可证

MIT
