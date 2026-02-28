/**
 * AI历史助手
 * 基于历史数据提供智能推荐和分析
 */

class AIHistoryAssistant {
    constructor() {
        this.historyData = null;
        this.userInterests = new Map();
        this.viewHistory = [];
    }
    
    setData(data) {
        this.historyData = this.flattenData(data);
        this.buildIndex();
    }
    
    /**
     * 扁平化历史数据
     */
    flattenData(data, result = []) {
        if (data.children) {
            data.children.forEach(child => {
                if (child.type === 'event' || child.type === 'person') {
                    result.push({
                        ...child,
                        period: data.period || data.name
                    });
                }
                this.flattenData(child, result);
            });
        }
        return result;
    }
    
    /**
     * 构建搜索索引
     */
    buildIndex() {
        this.searchIndex = new Map();
        
        this.historyData.forEach(item => {
            // 索引关键词
            const keywords = [
                item.name,
                item.description,
                ...(item.tags || []),
                item.period,
                item.year?.toString()
            ].filter(Boolean);
            
            keywords.forEach(keyword => {
                const lowerKeyword = keyword.toLowerCase();
                if (!this.searchIndex.has(lowerKeyword)) {
                    this.searchIndex.set(lowerKeyword, []);
                }
                this.searchIndex.get(lowerKeyword).push(item);
            });
        });
    }
    
    /**
     * 智能搜索
     */
    search(query, options = {}) {
        const {
            limit = 10,
            category = null,
            period = null,
            minImportance = 1
        } = options;
        
        const queryWords = query.toLowerCase().split(/\s+/);
        const scores = new Map();
        
        // 计算每个历史项的匹配分数
        queryWords.forEach(word => {
            this.searchIndex.forEach((items, keyword) => {
                if (keyword.includes(word)) {
                    items.forEach(item => {
                        if (!scores.has(item.name)) {
                            scores.set(item.name, { item, score: 0 });
                        }
                        scores.get(item.name).score += word.length / keyword.length;
                    });
                }
            });
        });
        
        // 过滤和排序
        let results = Array.from(scores.values())
            .filter(({ item }) => {
                if (category && item.category !== category) return false;
                if (period && item.period !== period) return false;
                if (item.importance < minImportance) return false;
                return true;
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(({ item }) => item);
        
        return results;
    }
    
    /**
     * 推荐相关历史
     */
    recommend(currentItem, limit = 5) {
        const recommendations = [];
        
        // 基于标签的推荐
        if (currentItem.tags) {
            this.historyData.forEach(item => {
                if (item.name === currentItem.name) return;
                
                const commonTags = currentItem.tags.filter(tag => 
                    item.tags && item.tags.includes(tag)
                );
                
                if (commonTags.length > 0) {
                    recommendations.push({
                        item,
                        score: commonTags.length * 2,
                        reason: `共同标签: ${commonTags.join(', ')}`
                    });
                }
            });
        }
        
        // 基于时期的推荐
        this.historyData.forEach(item => {
            if (item.name === currentItem.name) return;
            if (item.period === currentItem.period) {
                const exists = recommendations.find(r => r.item.name === item.name);
                if (!exists) {
                    recommendations.push({
                        item,
                        score: 1,
                        reason: `同一时期: ${item.period}`
                    });
                } else {
                    exists.score += 1;
                }
            }
        });
        
        // 基于类别的推荐
        this.historyData.forEach(item => {
            if (item.name === currentItem.name) return;
            if (item.category === currentItem.category) {
                const exists = recommendations.find(r => r.item.name === item.name);
                if (!exists) {
                    recommendations.push({
                        item,
                        score: 0.5,
                        reason: `同一领域: ${item.category}`
                    });
                } else {
                    exists.score += 0.5;
                }
            }
        });
        
        // 排序并返回
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
    
    /**
     * 生成历史分析
     */
    analyze(period = null) {
        const items = period 
            ? this.historyData.filter(item => item.period === period)
            : this.historyData;
        
        const analysis = {
            total: items.length,
            byCategory: {},
            byPeriod: {},
            topImportance: [],
            timeline: []
        };
        
        // 按类别统计
        items.forEach(item => {
            const cat = item.category || 'other';
            analysis.byCategory[cat] = (analysis.byCategory[cat] || 0) + 1;
        });
        
        // 按时期统计
        items.forEach(item => {
            const per = item.period || 'unknown';
            analysis.byPeriod[per] = (analysis.byPeriod[per] || 0) + 1;
        });
        
        // 最重要的事件/人物
        analysis.topImportance = items
            .filter(item => item.importance >= 4)
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 10);
        
        // 时间线
        analysis.timeline = items
            .filter(item => item.year)
            .sort((a, b) => {
                const yearA = parseInt(a.year);
                const yearB = parseInt(b.year);
                return yearA - yearB;
            });
        
        return analysis;
    }
    
    /**
     * 生成历史故事
     */
    generateStory(startYear, endYear) {
        const events = this.historyData
            .filter(item => {
                if (!item.year) return false;
                const year = parseInt(item.year);
                return year >= startYear && year <= endYear;
            })
            .sort((a, b) => {
                const yearA = parseInt(a.year);
                const yearB = parseInt(b.year);
                return yearA - yearB;
            });
        
        if (events.length === 0) {
            return null;
        }
        
        const story = {
            title: `${startYear}年至${endYear}年的历史`,
            events,
            summary: this.generateSummary(events)
        };
        
        return story;
    }
    
    generateSummary(events) {
        const categories = {};
        events.forEach(event => {
            const cat = event.category || 'other';
            categories[cat] = (categories[cat] || 0) + 1;
        });
        
        const mainCategory = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])[0];
        
        return `这一时期共发生了${events.length}个重要历史事件，主要集中在${mainCategory[0]}领域（${mainCategory[1]}个事件）。`;
    }
    
    /**
     * 记录用户兴趣
     */
    trackInterest(item) {
        const key = `${item.type}_${item.category}`;
        this.userInterests.set(key, (this.userInterests.get(key) || 0) + 1);
        this.viewHistory.push({
            item,
            timestamp: Date.now()
        });
    }
    
    /**
     * 个性化推荐
     */
    getPersonalizedRecommendations(limit = 5) {
        // 基于用户兴趣推荐
        const interests = Array.from(this.userInterests.entries())
            .sort((a, b) => b[1] - a[1]);
        
        if (interests.length === 0) {
            // 如果没有兴趣记录，返回最重要的历史
            return this.historyData
                .filter(item => item.importance >= 4)
                .slice(0, limit);
        }
        
        const recommendations = [];
        const topInterest = interests[0];
        const [type, category] = topInterest[0].split('_');
        
        // 找到相关的历史项
        this.historyData.forEach(item => {
            if (item.category === category) {
                recommendations.push(item);
            }
        });
        
        return recommendations.slice(0, limit);
    }
    
    /**
     * 问答系统
     */
    answerQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        
        // 时间查询
        if (lowerQuestion.includes('什么时候') || lowerQuestion.includes('哪一年')) {
            const results = this.search(question, { limit: 1 });
            if (results.length > 0) {
                return {
                    answer: `${results[0].name}发生在${results[0].year}`,
                    item: results[0]
                };
            }
        }
        
        // 人物查询
        if (lowerQuestion.includes('谁') || lowerQuestion.includes('人物')) {
            const results = this.search(question, { limit: 3, type: 'person' });
            if (results.length > 0) {
                return {
                    answer: results.map(r => r.name).join('、'),
                    items: results
                };
            }
        }
        
        // 事件查询
        if (lowerQuestion.includes('什么') || lowerQuestion.includes('事件')) {
            const results = this.search(question, { limit: 3, type: 'event' });
            if (results.length > 0) {
                return {
                    answer: results.map(r => `${r.name}(${r.year})`).join('、'),
                    items: results
                };
            }
        }
        
        // 通用搜索
        const results = this.search(question, { limit: 5 });
        if (results.length > 0) {
            return {
                answer: `找到${results.length}个相关结果`,
                items: results
            };
        }
        
        return {
            answer: '抱歉，我没有找到相关的历史信息。',
            items: []
        };
    }
}

// 导出到全局
window.AIHistoryAssistant = AIHistoryAssistant;
