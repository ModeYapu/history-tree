/**
 * 数据服务 - 数据加载和管理
 */

class DataService {
    constructor(eventBus) {
        this.eventBus = eventBus;
        
        // 数据存储
        this.nodes = new Map();
        this.relations = new Map();
        this.periods = new Map();
        this.locations = new Map();
        
        // 索引
        this.searchIndex = new Map();
        this.categoryIndex = new Map();
        this.timeIndex = new Map();
        this.locationIndex = new Map();
        
        // 统计
        this.stats = {
            totalNodes: 0,
            totalRelations: 0,
            totalPeriods: 0,
            totalLocations: 0
        };
    }
    
    /**
     * 加载核心数据
     */
    async loadCoreData() {
        try {
            // 加载历史数据
            const response = await fetch('./data/history-data.json');
            const data = await response.json();
            
            // 处理数据
            this.processData(data);
            
            this.eventBus.emit('data:load', { success: true });
            
        } catch (error) {
            console.error('Failed to load core data:', error);
            this.eventBus.emit('data:error', error);
            throw error;
        }
    }
    
    /**
     * 加载扩展数据
     */
    async loadExtensions() {
        try {
            // 加载图片数据
            await this.loadImages();
            
            // 加载地理数据
            await this.loadGeography();
            
            // 加载文献数据
            await this.loadDocuments();
            
        } catch (error) {
            console.warn('Some extensions failed to load:', error);
        }
    }
    
    /**
     * 处理数据
     */
    processData(data) {
        // 递归处理节点
        const processNode = (node, parent = null) => {
            const historyNode = new HistoryNode(node);
            
            // 存储
            this.nodes.set(historyNode.id, historyNode);
            
            // 索引
            this.indexNode(historyNode);
            
            // 统计
            this.stats.totalNodes++;
            
            // 处理子节点
            if (node.children) {
                node.children.forEach(child => {
                    processNode(child, historyNode);
                });
            }
            
            return historyNode;
        };
        
        // 处理根节点
        if (Array.isArray(data)) {
            data.forEach(node => processNode(node));
        } else {
            processNode(data);
        }
    }
    
    /**
     * 索引节点
     */
    indexNode(node) {
        // 搜索索引
        const keywords = [
            node.name,
            node.description,
            node.summary,
            ...node.category.tags
        ].filter(Boolean);
        
        keywords.forEach(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            if (!this.searchIndex.has(lowerKeyword)) {
                this.searchIndex.set(lowerKeyword, []);
            }
            this.searchIndex.get(lowerKeyword).push(node.id);
        });
        
        // 分类索引
        const category = node.category.primary;
        if (!this.categoryIndex.has(category)) {
            this.categoryIndex.set(category, []);
        }
        this.categoryIndex.get(category).push(node.id);
        
        // 时间索引
        if (node.time.year) {
            const period = node.time.period;
            if (!this.timeIndex.has(period)) {
                this.timeIndex.set(period, []);
            }
            this.timeIndex.get(period).push(node.id);
        }
        
        // 地理索引
        if (node.location.name) {
            const location = node.location.name;
            if (!this.locationIndex.has(location)) {
                this.locationIndex.set(location, []);
            }
            this.locationIndex.get(location).push(node.id);
        }
    }
    
    /**
     * 构建所有索引
     */
    async buildIndexes() {
        console.log('🔨 Building indexes...');
        
        // 已经在processData中构建
        console.log(`✅ Indexes built: ${this.searchIndex.size} keywords`);
    }
    
    /**
     * 搜索
     */
    search(query, options = {}) {
        const {
            limit = 10,
            category = null,
            period = null,
            type = null
        } = options;
        
        const queryWords = query.toLowerCase().split(/\s+/);
        const scores = new Map();
        
        // 计算分数
        queryWords.forEach(word => {
            this.searchIndex.forEach((nodeIds, keyword) => {
                if (keyword.includes(word)) {
                    nodeIds.forEach(nodeId => {
                        const score = scores.get(nodeId) || 0;
                        scores.set(nodeId, score + word.length / keyword.length);
                    });
                }
            });
        });
        
        // 获取结果
        let results = Array.from(scores.entries())
            .map(([id, score]) => ({
                node: this.nodes.get(id),
                score
            }))
            .filter(item => {
                if (!item.node) return false;
                if (category && item.node.category.primary !== category) return false;
                if (period && item.node.time.period !== period) return false;
                if (type && item.node.type !== type) return false;
                return true;
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.node);
        
        return results;
    }
    
    /**
     * 筛选
     */
    filter(filters) {
        let results = Array.from(this.nodes.values());
        
        // 按分类筛选
        if (filters.category) {
            results = results.filter(n => n.category.primary === filters.category);
        }
        
        // 按时期筛选
        if (filters.period) {
            results = results.filter(n => n.time.period === filters.period);
        }
        
        // 按类型筛选
        if (filters.type) {
            results = results.filter(n => n.type === filters.type);
        }
        
        // 按重要性筛选
        if (filters.minImportance) {
            results = results.filter(n => n.metadata.importance >= filters.minImportance);
        }
        
        // 按标签筛选
        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(n => 
                filters.tags.some(tag => n.category.tags.includes(tag))
            );
        }
        
        return results;
    }
    
    /**
     * 获取节点
     */
    getNode(id) {
        return this.nodes.get(id);
    }
    
    /**
     * 获取关系
     */
    getRelations(nodeId) {
        const relations = [];
        const node = this.nodes.get(nodeId);
        
        if (!node) return relations;
        
        // 获取所有关系
        Object.entries(node.relations).forEach(([type, ids]) => {
            ids.forEach(id => {
                const relatedNode = this.nodes.get(id);
                if (relatedNode) {
                    relations.push({
                        type,
                        node: relatedNode
                    });
                }
            });
        });
        
        return relations;
    }
    
    /**
     * 获取推荐
     */
    getRecommendations(nodeId, limit = 5) {
        const node = this.nodes.get(nodeId);
        if (!node) return [];
        
        const recommendations = [];
        
        // 基于标签推荐
        node.category.tags.forEach(tag => {
            const nodeIds = this.searchIndex.get(tag) || [];
            nodeIds.forEach(id => {
                if (id !== nodeId) {
                    recommendations.push({
                        node: this.nodes.get(id),
                        score: 1,
                        reason: `共同标签: ${tag}`
                    });
                }
            });
        });
        
        // 基于时期推荐
        const periodNodes = this.timeIndex.get(node.time.period) || [];
        periodNodes.forEach(id => {
            if (id !== nodeId) {
                const existing = recommendations.find(r => r.node.id === id);
                if (existing) {
                    existing.score += 0.5;
                } else {
                    recommendations.push({
                        node: this.nodes.get(id),
                        score: 0.5,
                        reason: `同一时期: ${node.time.period}`
                    });
                }
            }
        });
        
        // 排序并返回
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
    
    /**
     * 加载图片
     */
    async loadImages() {
        // 实现图片加载逻辑
    }
    
    /**
     * 加载地理数据
     */
    async loadGeography() {
        // 实现地理数据加载
    }
    
    /**
     * 加载文档
     */
    async loadDocuments() {
        // 实现文档加载
    }
    
    /**
     * 获取统计信息
     */
    getStats() {
        return this.stats;
    }
}

// 导出到全局
window.DataService = DataService;
