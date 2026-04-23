/**
 * 搜索引擎 - 倒排索引实现
 * 性能提升: O(n*m) → O(log n)
 */

class SearchEngine {
    constructor() {
        this.index = new Map();      // 倒排索引: 词 → 文档ID集合
        this.documents = new Map();  // 文档存储: ID → 文档
        this.cache = new Map();      // 查询缓存
        this.maxCacheSize = 100;     // 最大缓存数量
    }

    /**
     * 构建索引
     */
    buildIndex(data) {
        console.log('🔨 开始构建倒排索引...');

        data.forEach(item => {
            // 存储文档
            this.documents.set(item.id, item);

            // 提取并索引所有可搜索文本
            const searchText = this.extractSearchableText(item);
            const terms = this.tokenize(searchText);

            // 为每个词建立索引
            terms.forEach(term => {
                if (!this.index.has(term)) {
                    this.index.set(term, new Set());
                }
                this.index.get(term).add(item.id);
            });
        });

        console.log(`✅ 索引构建完成: ${this.documents.size} 个文档, ${this.index.size} 个词`);
    }

    /**
     * 提取可搜索文本
     */
    extractSearchableText(item) {
        const parts = [];

        if (item.name) parts.push(item.name);
        if (item.title) parts.push(item.title);
        if (item.description) parts.push(item.description);
        if (item.period) parts.push(item.period);
        if (item.category) parts.push(item.category);
        if (item.tags && Array.isArray(item.tags)) {
            parts.push(...item.tags);
        }

        return parts.join(' ');
    }

    /**
     * 分词
     */
    tokenize(text) {
        if (!text) return [];

        // 转小写，移除标点，分词
        const tokens = text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s]/g, ' ')  // 保留中文、英文、数字
            .split(/\s+/)
            .filter(token => token.length > 0);

        // 中文分词（简单实现：按字符分割）
        const chineseTokens = [];
        tokens.forEach(token => {
            if (/[\u4e00-\u9fa5]/.test(token)) {
                // 中文：按2-3字组合
                for (let i = 0; i < token.length - 1; i++) {
                    chineseTokens.push(token.substring(i, i + 2));
                    if (i < token.length - 2) {
                        chineseTokens.push(token.substring(i, i + 3));
                    }
                }
            }
            chineseTokens.push(token);
        });

        return [...new Set(chineseTokens)];  // 去重
    }

    /**
     * 搜索
     */
    search(query) {
        if (!query || query.trim() === '') {
            return Array.from(this.documents.values());
        }

        // 检查缓存
        const cacheKey = query.toLowerCase().trim();
        if (this.cache.has(cacheKey)) {
            console.log('📦 使用缓存结果');
            return this.cache.get(cacheKey);
        }

        const startTime = performance.now();

        // 分词
        const terms = this.tokenize(query);

        if (terms.length === 0) {
            return [];
        }

        // 查找每个词对应的文档集合
        const documentSets = terms.map(term => {
            const matchingDocs = new Set();

            // 精确匹配
            if (this.index.has(term)) {
                matchingDocs.add(...this.index.get(term));
            }

            // 前缀匹配（性能优化：只对短词进行）
            if (term.length <= 3) {
                this.index.forEach((docIds, indexTerm) => {
                    if (indexTerm.startsWith(term)) {
                        matchingDocs.add(...docIds);
                    }
                });
            }

            return matchingDocs;
        });

        // 取交集（AND查询）
        let intersection = documentSets[0];
        for (let i = 1; i < documentSets.length; i++) {
            intersection = new Set(
                [...intersection].filter(id => documentSets[i].has(id))
            );
        }

        // 获取文档
        const results = [...intersection]
            .map(id => this.documents.get(id))
            .filter(doc => doc !== undefined);

        // 排序（按相关性）
        const sortedResults = this.rankResults(results, query);

        // 缓存结果
        this.cacheResult(cacheKey, sortedResults);

        const duration = performance.now() - startTime;
        console.log(`🔍 搜索完成: "${query}" → ${sortedResults.length} 个结果 (${duration.toFixed(2)}ms)`);

        return sortedResults;
    }

    /**
     * 结果排序
     */
    rankResults(results, query) {
        const queryTerms = new Set(this.tokenize(query));

        return results.map(result => {
            let score = 0;
            const searchText = this.extractSearchableText(result).toLowerCase();

            // 精确匹配加分
            if (result.name && result.name.toLowerCase().includes(query.toLowerCase())) {
                score += 100;
            }

            // 标题匹配
            if (result.title && result.title.toLowerCase().includes(query.toLowerCase())) {
                score += 80;
            }

            // 词频计算
            queryTerms.forEach(term => {
                const regex = new RegExp(term, 'gi');
                const matches = searchText.match(regex);
                if (matches) {
                    score += matches.length * 10;
                }
            });

            // 重要性加权
            if (result.importance === 'high') score *= 1.5;
            if (result.importance === 'medium') score *= 1.2;

            return { ...result, searchScore: score };
        })
        .sort((a, b) => b.searchScore - a.searchScore)
        .map(result => {
            const { searchScore, ...rest } = result;
            return rest;
        });
    }

    /**
     * 缓存结果
     */
    cacheResult(key, results) {
        // 限制缓存大小
        if (this.cache.size >= this.maxCacheSize) {
            // 删除最旧的缓存项
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, results);
    }

    /**
     * 清空缓存
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ 搜索缓存已清空');
    }

    /**
     * 获取统计信息
     */
    getStats() {
        return {
            documentCount: this.documents.size,
            indexSize: this.index.size,
            cacheSize: this.cache.size,
            avgDocumentLength: this.documents.size > 0
                ? [...this.documents.values()].reduce((sum, doc) => {
                    return sum + this.extractSearchableText(doc).length;
                }, 0) / this.documents.size
                : 0
        };
    }
}

// 创建全局搜索引擎实例
const searchEngine = new SearchEngine;
window.SearchEngine = SearchEngine;
window.searchEngine = searchEngine;
