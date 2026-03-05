#!/usr/bin/env node
/**
 * 历史之树 MCP 服务器
 * 提供AI agent能力通过MCP协议
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

// 导入历史之树服务
import HistoryKnowledgeBase from './mcp/HistoryKnowledgeBase.js';
import HistoryAI from './mcp/HistoryAI.js';

class HistoryTreeMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'history-tree-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.knowledgeBase = new HistoryKnowledgeBase();
    this.historyAI = new HistoryAI();
    
    this.setupHandlers();
  }

  setupHandlers() {
    // 列出所有可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // 历史知识查询
          {
            name: 'search_history',
            description: '搜索历史事件、人物或时期',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: '搜索关键词（事件名、人物名、时期等）'
                },
                filters: {
                  type: 'object',
                  description: '可选的筛选条件',
                  properties: {
                    period: { type: 'string', description: '历史时期' },
                    category: { type: 'string', description: '类别（政治、科技、文化等）' },
                    region: { type: 'string', description: '地理区域' },
                    importance: { type: 'number', description: '重要程度（1-5）' }
                  }
                },
                limit: {
                  type: 'number',
                  description: '返回结果数量，默认10',
                  default: 10
                }
              },
              required: ['query']
            }
          },

          // 获取详细信息
          {
            name: 'get_history_detail',
            description: '获取历史事件或人物的详细信息',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: '历史节点ID'
                },
                include_relations: {
                  type: 'boolean',
                  description: '是否包含关联信息',
                  default: true
                }
              },
              required: ['id']
            }
          },

          // AI关联分析
          {
            name: 'analyze_connections',
            description: '使用AI分析历史事件之间的关联关系',
            inputSchema: {
              type: 'object',
              properties: {
                node_id: {
                  type: 'string',
                  description: '要分析的历史节点ID'
                },
                depth: {
                  type: 'number',
                  description: '分析深度（1-3）',
                  default: 2
                },
                include_ai_analysis: {
                  type: 'boolean',
                  description: '是否包含AI深度分析',
                  default: true
                }
              },
              required: ['node_id']
            }
          },

          // 历史问答
          {
            name: 'ask_history_question',
            description: '向AI历史助手提问历史问题',
            inputSchema: {
              type: 'object',
              properties: {
                question: {
                  type: 'string',
                  description: '历史问题'
                },
                context: {
                  type: 'object',
                  description: '可选的上下文信息',
                  properties: {
                    related_nodes: {
                      type: 'array',
                      items: { type: 'string' },
                      description: '相关节点ID列表'
                    },
                    time_period: {
                      type: 'string',
                      description: '时间范围'
                    }
                  }
                }
              },
              required: ['question']
            }
          },

          // 时间线生成
          {
            name: 'generate_timeline',
            description: '生成特定主题或时期的历史时间线',
            inputSchema: {
              type: 'object',
              properties: {
                theme: {
                  type: 'string',
                  description: '时间线主题（如"唐朝"、"工业革命"）'
                },
                start_year: {
                  type: 'number',
                  description: '起始年份'
                },
                end_year: {
                  type: 'number',
                  description: '结束年份'
                },
                category: {
                  type: 'string',
                  description: '类别筛选'
                },
                format: {
                  type: 'string',
                  enum: ['json', 'markdown', 'html'],
                  description: '输出格式',
                  default: 'markdown'
                }
              },
              required: ['theme']
            }
          },

          // 内容推荐
          {
            name: 'recommend_content',
            description: '基于用户兴趣推荐相关历史内容',
            inputSchema: {
              type: 'object',
              properties: {
                interests: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '用户兴趣领域'
                },
                current_node_id: {
                  type: 'string',
                  description: '当前正在查看的节点ID'
                },
                limit: {
                  type: 'number',
                  description: '推荐数量',
                  default: 5
                }
              },
              required: ['interests']
            }
          },

          // 历史对比分析
          {
            name: 'compare_events',
            description: '对比分析两个或多个历史事件',
            inputSchema: {
              type: 'object',
              properties: {
                event_ids: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '要对比的事件ID列表'
                },
                aspects: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['cause', 'effect', 'significance', 'context', 'similarity', 'difference']
                  },
                  description: '对比维度'
                }
              },
              required: ['event_ids']
            }
          },

          // 影响链分析
          {
            name: 'trace_influence_chain',
            description: '追踪历史事件的影响链',
            inputSchema: {
              type: 'object',
              properties: {
                node_id: {
                  type: 'string',
                  description: '起始节点ID'
                },
                direction: {
                  type: 'string',
                  enum: ['forward', 'backward', 'both'],
                  description: '追踪方向：forward=影响，backward=被影响，both=双向',
                  default: 'both'
                },
                max_depth: {
                  type: 'number',
                  description: '最大追踪深度',
                  default: 3
                }
              },
              required: ['node_id']
            }
          },

          // 统计分析
          {
            name: 'get_statistics',
            description: '获取历史数据的统计信息',
            inputSchema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['period', 'category', 'region', 'importance', 'general'],
                  description: '统计类型'
                },
                filters: {
                  type: 'object',
                  description: '筛选条件'
                }
              },
              required: ['type']
            }
          },

          // 导出数据
          {
            name: 'export_data',
            description: '导出历史数据为不同格式',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  enum: ['json', 'csv', 'markdown', 'graphml'],
                  description: '导出格式'
                },
                filters: {
                  type: 'object',
                  description: '数据筛选条件'
                },
                include_relations: {
                  type: 'boolean',
                  description: '是否包含关系数据',
                  default: true
                }
              },
              required: ['format']
            }
          }
        ]
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'search_history':
            return await this.searchHistory(args);
          
          case 'get_history_detail':
            return await this.getHistoryDetail(args);
          
          case 'analyze_connections':
            return await this.analyzeConnections(args);
          
          case 'ask_history_question':
            return await this.askHistoryQuestion(args);
          
          case 'generate_timeline':
            return await this.generateTimeline(args);
          
          case 'recommend_content':
            return await this.recommendContent(args);
          
          case 'compare_events':
            return await this.compareEvents(args);
          
          case 'trace_influence_chain':
            return await this.traceInfluenceChain(args);
          
          case 'get_statistics':
            return await this.getStatistics(args);
          
          case 'export_data':
            return await this.exportData(args);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          error.message
        );
      }
    });
  }

  // 搜索历史
  async searchHistory(args) {
    const results = await this.knowledgeBase.search(args.query, args.filters, args.limit);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            query: args.query,
            count: results.length,
            results: results
          }, null, 2)
        }
      ]
    };
  }

  // 获取详细信息
  async getHistoryDetail(args) {
    const detail = await this.knowledgeBase.getDetail(args.id, args.include_relations);
    
    if (!detail) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Node not found: ${args.id}`
      );
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(detail, null, 2)
        }
      ]
    };
  }

  // 分析关联
  async analyzeConnections(args) {
    const connections = await this.historyAI.analyzeConnections(
      args.node_id,
      args.depth,
      args.include_ai_analysis
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            node_id: args.node_id,
            connections: connections
          }, null, 2)
        }
      ]
    };
  }

  // 历史问答
  async askHistoryQuestion(args) {
    const answer = await this.historyAI.answerQuestion(
      args.question,
      args.context
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            question: args.question,
            answer: answer
          }, null, 2)
        }
      ]
    };
  }

  // 生成时间线
  async generateTimeline(args) {
    const timeline = await this.knowledgeBase.generateTimeline(
      args.theme,
      args.start_year,
      args.end_year,
      args.category,
      args.format
    );
    
    return {
      content: [
        {
          type: 'text',
          text: timeline
        }
      ]
    };
  }

  // 推荐内容
  async recommendContent(args) {
    const recommendations = await this.historyAI.recommend(
      args.interests,
      args.current_node_id,
      args.limit
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            recommendations: recommendations
          }, null, 2)
        }
      ]
    };
  }

  // 对比事件
  async compareEvents(args) {
    const comparison = await this.historyAI.compareEvents(
      args.event_ids,
      args.aspects
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            comparison: comparison
          }, null, 2)
        }
      ]
    };
  }

  // 追踪影响链
  async traceInfluenceChain(args) {
    const chain = await this.historyAI.traceInfluence(
      args.node_id,
      args.direction,
      args.max_depth
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            chain: chain
          }, null, 2)
        }
      ]
    };
  }

  // 获取统计
  async getStatistics(args) {
    const stats = await this.knowledgeBase.getStatistics(args.type, args.filters);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            statistics: stats
          }, null, 2)
        }
      ]
    };
  }

  // 导出数据
  async exportData(args) {
    const data = await this.knowledgeBase.exportData(
      args.format,
      args.filters,
      args.include_relations
    );
    
    return {
      content: [
        {
          type: 'text',
          text: data
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('History Tree MCP Server running on stdio');
  }
}

// 启动服务器
const server = new HistoryTreeMCPServer();
server.run().catch(console.error);
