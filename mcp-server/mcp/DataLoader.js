/**
 * 数据加载器 - 从现有数据源加载历史数据
 */

import fs from 'fs';
import path from 'path';

export class DataLoader {
  constructor() {
    this.dataPath = path.join(process.cwd(), 'data');
  }

  /**
   * 加载所有历史数据
   */
  async loadAll() {
    console.log('📂 开始加载历史数据...');

    const data = {
      nodes: new Map(),
      relations: new Map(),
      timeline: [],
      categories: ['politics', 'technology', 'culture', 'economy', 'military'],
      periods: ['ancient', 'medieval', 'early-modern', 'modern', 'contemporary']
    };

    // 方案1: 从JSON文件加载
    try {
      const jsonFile = path.join(this.dataPath, 'history-data.json');
      if (fs.existsSync(jsonFile)) {
        const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
        return this.parseJSONData(jsonData);
      }
    } catch (error) {
      console.warn('⚠️  JSON数据加载失败:', error.message);
    }

    // 方案2: 从data.js提取
    try {
      const jsFile = path.join(this.dataPath, '../src/data/history-data.js');
      if (fs.existsSync(jsFile)) {
        const jsContent = fs.readFileSync(jsFile, 'utf-8');
        return this.extractFromJS(jsContent);
      }
    } catch (error) {
      console.warn('⚠️  JS数据提取失败:', error.message);
    }

    // 方案3: 使用内置示例数据
    console.log('📝 使用内置示例数据...');
    return this.getSampleData();
  }

  /**
   * 解析JSON数据
   */
  parseJSONData(jsonData) {
    const data = {
      nodes: new Map(),
      relations: new Map(),
      timeline: [],
      categories: ['politics', 'technology', 'culture', 'economy', 'military'],
      periods: ['ancient', 'medieval', 'early-modern', 'modern', 'contemporary']
    };

    // 递归处理节点
    const processNode = (node) => {
      data.nodes.set(node.id, node);

      // 处理关系
      if (node.relations) {
        data.relations.set(node.id, node.relations);
      }

      // 处理子节点
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => processNode(child));
      }
    };

    // 处理根节点
    if (Array.isArray(jsonData)) {
      jsonData.forEach(node => processNode(node));
    } else if (jsonData.children) {
      jsonData.children.forEach(node => processNode(node));
    }

    console.log(`✅ 加载了 ${data.nodes.size} 个节点`);
    return data;
  }

  /**
   * 从JS文件提取数据
   */
  extractFromJS(jsContent) {
    // 提取数据对象
    const match = jsContent.match(/const\s+\w+\s*=\s*({[\s\S]+?});/);
    if (match) {
      try {
        const dataObj = eval(`(${match[1]})`);
        return this.parseJSONData(dataObj);
      } catch (error) {
        console.error('❌ 数据解析失败:', error);
      }
    }

    return this.getSampleData();
  }

  /**
   * 获取示例数据
   */
  getSampleData() {
    const sampleNodes = [
      {
        id: 'qin_unification',
        type: 'event',
        name: '秦统一六国',
        description: '公元前221年，秦始皇统一中国，建立第一个中央集权制国家',
        year: -221,
        period: 'ancient',
        category: 'politics',
        importance: 5,
        tags: ['统一', '秦朝', '政治'],
        location: {
          name: '中国',
          region: '东亚'
        },
        relations: {
          causes: ['shang_yang_reform'],
          effects: ['qin_dynasty', 'great_wall'],
          related: ['han_unification']
        }
      },
      {
        id: 'han_unification',
        type: 'event',
        name: '汉朝建立',
        description: '公元前202年，刘邦建立汉朝，开启四百年汉室江山',
        year: -202,
        period: 'ancient',
        category: 'politics',
        importance: 5,
        tags: ['汉朝', '统一', '政治'],
        location: {
          name: '中国',
          region: '东亚'
        },
        relations: {
          causes: ['qin_unification'],
          effects: ['silk_road', 'confucianism']
        }
      },
      {
        id: 'tang_prosperity',
        type: 'event',
        name: '贞观之治',
        description: '唐太宗李世民时期，政治清明，经济繁荣，文化昌盛',
        year: 627,
        period: 'medieval',
        category: 'politics',
        importance: 5,
        tags: ['唐朝', '盛世', '政治'],
        location: {
          name: '长安',
          region: '东亚'
        },
        relations: {
          causes: ['tang_foundation'],
          effects: ['tang_culture', 'international_trade']
        }
      },
      {
        id: 'industrial_revolution',
        type: 'event',
        name: '工业革命',
        description: '18世纪60年代开始的工业革命，标志着人类社会进入工业时代',
        year: 1760,
        period: 'early-modern',
        category: 'technology',
        importance: 5,
        tags: ['工业', '革命', '科技'],
        location: {
          name: '英国',
          region: '欧洲'
        },
        relations: {
          causes: ['scientific_revolution', 'enlightenment'],
          effects: ['urbanization', 'capitalism', 'second_industrial_revolution']
        }
      },
      {
        id: 'french_revolution',
        type: 'event',
        name: '法国大革命',
        description: '1789年法国大革命，推翻封建专制，传播自由平等思想',
        year: 1789,
        period: 'early-modern',
        category: 'politics',
        importance: 5,
        tags: ['革命', '法国', '政治'],
        location: {
          name: '法国',
          region: '欧洲'
        },
        relations: {
          causes: ['enlightenment', 'economic_crisis'],
          effects: ['napoleon', 'nationalism', 'democracy']
        }
      }
    ];

    const data = {
      nodes: new Map(),
      relations: new Map(),
      timeline: [],
      categories: ['politics', 'technology', 'culture', 'economy', 'military'],
      periods: ['ancient', 'medieval', 'early-modern', 'modern', 'contemporary']
    };

    sampleNodes.forEach(node => {
      data.nodes.set(node.id, node);
      data.relations.set(node.id, node.relations || {});
    });

    console.log(`✅ 使用示例数据: ${data.nodes.size} 个节点`);
    return data;
  }
}

export default DataLoader;
