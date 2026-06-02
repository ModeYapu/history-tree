/**
 * 增强搜索引擎 - 支持模糊搜索和标签过滤
 * 整合Fuse.js实现模糊匹配
 */

class FuzzySearchEngine {
    constructor() {
        this.index = new Map();
        this.documents = new Map();
        this.cache = new Map();
        this.maxCacheSize = 200;
        this.fuse = null;
        this.tagsIndex = new Map(); // tag -> Set of document IDs
        this.categoryIndex = new Map(); // category -> Set of document IDs
    }

    /**
     * 构建索引
     */
    buildIndex(data) {
        console.log('🔨 构建增强索引...');

        data.forEach(item => {
            this.documents.set(item.id, item);

            // 提取可搜索文本
            const searchText = this.extractSearchableText(item);

            // 传统倒排索引
            const terms = this.tokenize(searchText);
            terms.forEach(term => {
                if (!this.index.has(term)) {
                    this.index.set(term, new Set());
                }
                this.index.get(term).add(item.id);
            });

            // 标签索引
            if (item.tags && Array.isArray(item.tags)) {
                item.tags.forEach(tag => {
                    if (!this.tagsIndex.has(tag)) {
                        this.tagsIndex.set(tag, new Set());
                    }
                    this.tagsIndex.get(tag).add(item.id);
                });
            }

            // 类别索引
            if (item.category) {
                const cat = item.category.primary || item.category;
                if (!this.categoryIndex.has(cat)) {
                    this.categoryIndex.set(cat, new Set());
                }
                this.categoryIndex.get(cat).add(item.id);
            }
        });

        // 初始化 Fuse.js
        this.initFuse(data);

        console.log(`✅ 索引构建完成: ${this.documents.size} 个文档`);
        console.log(`   - 词汇索引: ${this.index.size} 个词`);
        console.log(`   - 标签索引: ${this.tagsIndex.size} 个标签`);
        console.log(`   - 类别索引: ${this.categoryIndex.size} 个类别`);
    }

    /**
     * 初始化 Fuse.js
     */
    initFuse(data) {
        // Fuse.js 配置
        const fuseOptions = {
            keys: [
                { name: 'name', weight: 3.0 },
                { name: 'summary', weight: 1.5 },
                { name: 'description', weight: 1.2 },
                { name: 'tags', weight: 2.0 },
                { name: 'location.name', weight: 1.0 }
            ],
            threshold: 0.4, // 相似度阈值 (0-1)
            distance: 100,
            minMatchCharLength: 1,
            shouldSort: true,
            includeScore: true,
            includeMatches: true,
            ignoreLocation: true
        };

        // 检查 Fuse.js 是否可用
        if (typeof Fuse !== 'undefined') {
            this.fuse = new Fuse(data, fuseOptions);
            console.log('✅ Fuse.js 模糊搜索已启用');
        } else {
            console.warn('⚠️ Fuse.js 未加载，使用基础搜索');
        }
    }

    /**
     * 提取可搜索文本
     */
    extractSearchableText(item) {
        const parts = [];

        if (item.name) parts.push(item.name);
        if (item.summary) parts.push(item.summary);
        if (item.description) parts.push(item.description);
        if (item.time?.displayDate) parts.push(item.time.displayDate);
        if (item.location?.name) parts.push(item.location.name);
        if (item.category?.primary) parts.push(item.category.primary);
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

        const tokens = text
            .toLowerCase()
            .replace(/[^\w一-龥\s]/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 0);

        // 中文处理
        const chineseTokens = [];
        tokens.forEach(token => {
            if (/[一-龥]/.test(token)) {
                for (let i = 0; i < token.length - 1; i++) {
                    chineseTokens.push(token.substring(i, i + 2));
                    if (i < token.length - 2) {
                        chineseTokens.push(token.substring(i, i + 3));
                    }
                }
            }
            chineseTokens.push(token);
        });

        return [...new Set(chineseTokens)];
    }

    /**
     * 搜索 - 支持模糊搜索
     */
    search(query, options = {}) {
        if (!query || query.trim() === '') {
            return this.getAllDocuments(options);
        }

        const cacheKey = JSON.stringify({ query, options });
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const startTime = performance.now();

        let results = [];

        // 优先使用 Fuse.js 进行模糊搜索
        if (this.fuse && !options.exact) {
            results = this.fuzzySearch(query, options);
        } else {
            results = this.exactSearch(query, options);
        }

        // 应用标签过滤
        if (options.tags && options.tags.length > 0) {
            results = this.filterByTags(results, options.tags);
        }

        // 应用类别过滤
        if (options.categories && options.categories.length > 0) {
            results = this.filterByCategories(results, options.categories);
        }

        // 应用时期过滤
        if (options.period) {
            results = results.filter(r => {
                const period = r.time?.period || r.period;
                return period === options.period;
            });
        }

        // 应用类型过滤
        if (options.type) {
            results = results.filter(r => r.type === options.type);
        }

        // 应用重要性过滤
        if (options.minImportance) {
            results = results.filter(r => {
                const importance = r.metadata?.importance || r.importance || 0;
                return importance >= options.minImportance;
            });
        }

        const duration = performance.now() - startTime;
        console.log(`🔍 搜索完成: "${query}" → ${results.length} 个结果 (${duration.toFixed(2)}ms)`);

        this.cacheResult(cacheKey, results);
        return results;
    }

    /**
     * 模糊搜索 (Fuse.js)
     */
    fuzzySearch(query, options) {
        if (!this.fuse) return [];

        const fuseResults = this.fuse.search(query);

        return fuseResults.map(result => {
            const item = result.item;
            return {
                ...item,
                _searchScore: result.score,
                _matches: result.matches
            };
        });
    }

    /**
     * 精确搜索
     */
    exactSearch(query, options) {
        const terms = this.tokenize(query);

        if (terms.length === 0) return [];

        const documentSets = terms.map(term => {
            const matchingDocs = new Set();

            if (this.index.has(term)) {
                matchingDocs.add(...this.index.get(term));
            }

            // 前缀匹配
            if (term.length <= 3 && !options.exact) {
                this.index.forEach((docIds, indexTerm) => {
                    if (indexTerm.startsWith(term)) {
                        matchingDocs.add(...docIds);
                    }
                });
            }

            return matchingDocs;
        });

        // 取交集
        let intersection = documentSets[0] || new Set();
        for (let i = 1; i < documentSets.length; i++) {
            intersection = new Set(
                [...intersection].filter(id => documentSets[i].has(id))
            );
        }

        return [...intersection]
            .map(id => this.documents.get(id))
            .filter(doc => doc !== undefined);
    }

    /**
     * 获取所有文档
     */
    getAllDocuments(options) {
        let results = Array.from(this.documents.values());

        if (options.tags && options.tags.length > 0) {
            results = this.filterByTags(results, options.tags);
        }

        if (options.categories && options.categories.length > 0) {
            results = this.filterByCategories(results, options.categories);
        }

        if (options.period) {
            results = results.filter(r => {
                const period = r.time?.period || r.period;
                return period === options.period;
            });
        }

        if (options.type) {
            results = results.filter(r => r.type === options.type);
        }

        if (options.minImportance) {
            results = results.filter(r => {
                const importance = r.metadata?.importance || r.importance || 0;
                return importance >= options.minImportance;
            });
        }

        return results;
    }

    /**
     * 按标签过滤
     */
    filterByTags(results, tags) {
        if (!tags || tags.length === 0) return results;

        // 获取所有匹配的文档ID
        const matchedIds = new Set();
        tags.forEach(tag => {
            if (this.tagsIndex.has(tag)) {
                this.tagsIndex.get(tag).forEach(id => matchedIds.add(id));
            }
        });

        return results.filter(r => matchedIds.has(r.id));
    }

    /**
     * 按类别过滤
     */
    filterByCategories(results, categories) {
        if (!categories || categories.length === 0) return results;

        const matchedIds = new Set();
        categories.forEach(cat => {
            if (this.categoryIndex.has(cat)) {
                this.categoryIndex.get(cat).forEach(id => matchedIds.add(id));
            }
        });

        return results.filter(r => matchedIds.has(r.id));
    }

    /**
     * 获取所有标签
     */
    getAllTags() {
        return Array.from(this.tagsIndex.keys()).sort();
    }

    /**
     * 获取所有类别
     */
    getAllCategories() {
        return Array.from(this.categoryIndex.keys()).sort();
    }

    /**
     * 获取热门标签
     */
    getPopularTags(limit = 20) {
        return Array.from(this.tagsIndex.entries())
            .sort((a, b) => b[1].size - a[1].size)
            .slice(0, limit)
            .map(([tag, ids]) => ({ tag, count: ids.size }));
    }

    /**
     * 缓存结果
     */
    cacheResult(key, results) {
        if (this.cache.size >= this.maxCacheSize) {
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
            tagCount: this.tagsIndex.size,
            categoryCount: this.categoryIndex.size,
            hasFuzzySearch: this.fuse !== null
        };
    }

    /**
     * 搜索建议
     */
    getSuggestions(query, limit = 5) {
        if (!query || query.length < 2) return [];

        const terms = this.tokenize(query);
        const suggestions = new Set();

        // 从索引中查找前缀匹配
        this.index.forEach((_, term) => {
            terms.forEach(t => {
                if (term.startsWith(t) && term !== t) {
                    suggestions.add(term);
                }
            });
        });

        // 从标签中查找
        this.tagsIndex.forEach((_, tag) => {
            if (tag.toLowerCase().includes(query.toLowerCase())) {
                suggestions.add(tag);
            }
        });

        return Array.from(suggestions).slice(0, limit);
    }
}

window.FuzzySearchEngine = FuzzySearchEngine;
