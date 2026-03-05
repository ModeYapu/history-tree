/**
 * 流式输出服务器 - WebSocket实时通信
 */

import { WebSocketServer } from 'ws';
import AIService from './AIService.js';

export class StreamServer {
  constructor(port = 8080) {
    this.port = port;
    this.wss = null;
    this.ai = new AIService();
    this.sessions = new Map();
  }

  /**
   * 启动服务器
   */
  start() {
    this.wss = new WebSocketServer({ port: this.port });

    this.wss.on('connection', (ws, req) => {
      const sessionId = this.generateSessionId();
      console.log(`📱 新连接: ${sessionId}`);

      // 保存会话
      this.sessions.set(sessionId, {
        ws,
        createdAt: Date.now(),
        lastActivity: Date.now()
      });

      // 发送会话ID
      ws.send(JSON.stringify({
        type: 'connected',
        sessionId
      }));

      // 消息处理
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(ws, sessionId, message);
        } catch (error) {
          console.error('消息处理错误:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: error.message
          }));
        }
      });

      // 关闭处理
      ws.on('close', () => {
        console.log(`🔌 连接关闭: ${sessionId}`);
        this.sessions.delete(sessionId);
      });

      // 错误处理
      ws.on('error', (error) => {
        console.error(`WebSocket错误 [${sessionId}]:`, error);
      });
    });

    console.log(`✅ 流式服务器已启动: ws://localhost:${this.port}`);
  }

  /**
   * 处理消息
   */
  async handleMessage(ws, sessionId, message) {
    const { type, data } = message;

    // 更新活动时间
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = Date.now();
    }

    switch (type) {
      case 'query':
        await this.handleQuery(ws, sessionId, data);
        break;
      
      case 'stream':
        await this.handleStream(ws, sessionId, data);
        break;
      
      case 'cancel':
        this.handleCancel(sessionId);
        break;
      
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: `未知消息类型: ${type}`
        }));
    }
  }

  /**
   * 处理查询
   */
  async handleQuery(ws, sessionId, data) {
    const { query, context } = data;

    try {
      // 发送开始信号
      ws.send(JSON.stringify({
        type: 'start',
        sessionId,
        query
      }));

      // 调用AI
      const response = await this.ai.call(query, context);

      // 发送完整响应
      ws.send(JSON.stringify({
        type: 'complete',
        sessionId,
        response
      }));

    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        sessionId,
        error: error.message
      }));
    }
  }

  /**
   * 处理流式请求
   */
  async handleStream(ws, sessionId, data) {
    const { query, context } = data;

    try {
      // 发送开始信号
      ws.send(JSON.stringify({
        type: 'stream_start',
        sessionId,
        query
      }));

      // 模拟流式输出（实际应使用AI的流式API）
      const response = await this.ai.call(query, context);
      
      // 分块发送
      const chunks = this.splitIntoChunks(response, 50); // 每50字符一块
      
      for (let i = 0; i < chunks.length; i++) {
        // 检查会话是否还存在
        if (!this.sessions.has(sessionId)) {
          console.log(`⚠️  会话已取消: ${sessionId}`);
          break;
        }

        ws.send(JSON.stringify({
          type: 'stream_chunk',
          sessionId,
          chunk: chunks[i],
          index: i,
          total: chunks.length
        }));

        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // 发送完成信号
      ws.send(JSON.stringify({
        type: 'stream_complete',
        sessionId
      }));

    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        sessionId,
        error: error.message
      }));
    }
  }

  /**
   * 处理取消
   */
  handleCancel(sessionId) {
    console.log(`🚫 取消请求: ${sessionId}`);
    this.sessions.delete(sessionId);
  }

  /**
   * 分割文本为块
   */
  splitIntoChunks(text, chunkSize) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * 生成会话ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 广播消息
   */
  broadcast(message) {
    const data = JSON.stringify(message);
    this.sessions.forEach(session => {
      session.ws.send(data);
    });
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      totalSessions: this.sessions.size,
      sessions: Array.from(this.sessions.entries()).map(([id, session]) => ({
        id,
        age: Date.now() - session.createdAt,
        lastActivity: Date.now() - session.lastActivity
      }))
    };
  }

  /**
   * 关闭服务器
   */
  close() {
    if (this.wss) {
      this.wss.close();
      console.log('🔴 流式服务器已关闭');
    }
  }
}

export default StreamServer;
