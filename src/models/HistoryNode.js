/**
 * 历史节点模型
 */

class HistoryNode {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.type = data.type || 'event';
        
        // 基本信息
        this.name = data.name || '';
        this.description = data.description || '';
        this.summary = data.summary || '';
        
        // 时间信息
        this.time = {
            year: data.year || null,
            period: data.period || '',
            dynasty: data.dynasty || '',
            displayDate: this.formatDate(data.year)
        };
        
        // 空间信息
        this.location = {
            name: data.location || '',
            coordinates: data.coordinates || null,
            region: data.region || '',
            modernCountry: data.modernCountry || ''
        };
        
        // 分类
        this.category = {
            primary: data.category || 'other',
            secondary: data.secondaryCategories || [],
            tags: data.tags || []
        };
        
        // 内容
        this.content = {
            significance: data.significance || '',
            consequences: data.consequences || [],
            details: data.details || ''
        };
        
        // 多媒体
        this.media = {
            images: data.images || [],
            videos: data.videos || [],
            documents: data.documents || []
        };
        
        // 关系
        this.relations = {
            causes: data.causes || [],
            effects: data.effects || [],
            related: data.related || [],
            participants: data.participants || []
        };
        
        // 元数据
        this.metadata = {
            importance: data.importance || 3,
            views: 0,
            likes: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        // 子节点
        this.children = data.children || [];
    }
    
    generateId() {
        return 'node_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    formatDate(year) {
        if (!year) return '';
        return year < 0 ? `公元前${Math.abs(year)}年` : `${year}年`;
    }
    
    incrementViews() {
        this.metadata.views++;
    }
    
    like() {
        this.metadata.likes++;
    }
    
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
            summary: this.summary,
            time: this.time,
            location: this.location,
            category: this.category,
            content: this.content,
            media: this.media,
            relations: this.relations,
            metadata: this.metadata,
            children: this.children.map(c => 
                c instanceof HistoryNode ? c.toJSON() : c
            )
        };
    }
    
    static fromJSON(json) {
        const node = new HistoryNode(json);
        if (json.children && Array.isArray(json.children)) {
            node.children = json.children.map(c => HistoryNode.fromJSON(c));
        }
        return node;
    }
}

window.HistoryNode = HistoryNode;
