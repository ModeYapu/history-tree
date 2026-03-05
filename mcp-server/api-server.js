/**
 * API服务器 - 连接前端和MCP服务器
 */

import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// MCP服务器进程
let mcpServer = null;

/**
 * 启动MCP服务器
 */
function startMCPServer() {
  if (mcpServer) return mcpServer;

  const serverPath = path.join(process.cwd(), 'mcp-server/index.js');
  mcpServer = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  mcpServer.stderr.on('data', (data) => {
    console.error('MCP Server:', data.toString());
  });

  mcpServer.on('close', (code) => {
    console.log(`MCP Server exited with code ${code}`);
    mcpServer = null;
  });

  return mcpServer;
}

/**
 * 调用MCP工具
 */
async function callMCPTool(tool, args) {
  return new Promise((resolve, reject) => {
    const server = startMCPServer();

    // 构造请求
    const request = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: tool,
        arguments: args
      },
      id: Date.now()
    };

    // 发送请求
    server.stdin.write(JSON.stringify(request) + '\n');

    // 接收响应
    const timeout = setTimeout(() => {
      reject(new Error('MCP调用超时'));
    }, 30000);

    server.stdout.once('data', (data) => {
      clearTimeout(timeout);
      try {
        const response = JSON.parse(data.toString());
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * API路由
 */

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mcp: mcpServer ? 'running' : 'stopped',
    timestamp: new Date().toISOString()
  });
});

// MCP状态
app.get('/api/mcp/status', (req, res) => {
  res.json({
    available: true,
    server: mcpServer ? 'running' : 'stopped',
    tools: [
      'search_history',
      'get_history_detail',
      'analyze_connections',
      'ask_history_question',
      'generate_timeline',
      'recommend_content',
      'compare_events',
      'trace_influence_chain',
      'get_statistics',
      'export_data'
    ]
  });
});

// MCP工具调用
app.post('/api/mcp/call', async (req, res) => {
  try {
    const { tool, arguments: args } = req.body;

    if (!tool) {
      return res.status(400).json({ error: '缺少tool参数' });
    }

    console.log(`📞 调用工具: ${tool}`, args);
    const result = await callMCPTool(tool, args);
    res.json(result);
  } catch (error) {
    console.error('❌ 工具调用失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 批量调用
app.post('/api/mcp/batch', async (req, res) => {
  try {
    const { calls } = req.body;

    const results = await Promise.all(
      calls.map(async ({ tool, arguments: args }) => {
        try {
          const result = await callMCPTool(tool, args);
          return { tool, success: true, result };
        } catch (error) {
          return { tool, success: false, error: error.message };
        }
      })
    );

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 聊天接口（简化版）
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    // 智能路由到合适的工具
    const intent = await detectIntent(message);

    let response;
    switch (intent.type) {
      case 'search':
        response = await callMCPTool('search_history', {
          query: intent.query,
          limit: 5
        });
        break;

      case 'question':
        response = await callMCPTool('ask_history_question', {
          question: message,
          context
        });
        break;

      default:
        response = await callMCPTool('ask_history_question', {
          question: message
        });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 意图检测（简单实现）
 */
function detectIntent(message) {
  const lower = message.toLowerCase();

  if (lower.includes('搜索') || lower.includes('查找') || lower.includes('找')) {
    return { type: 'search', query: message };
  }

  return { type: 'question' };
}

/**
 * 启动服务器
 */
const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ API服务器已启动: http://localhost:${PORT}`);
  console.log(`📡 MCP端点: http://localhost:${PORT}/api/mcp/call`);
  console.log(`💬 聊天端点: http://localhost:${PORT}/api/chat`);

  // 预启动MCP服务器
  startMCPServer();
});

export default app;
