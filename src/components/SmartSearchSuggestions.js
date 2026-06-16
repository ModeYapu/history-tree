/**
 * 智能搜索建议系统
 * 提供搜索历史、热门搜索、自动补全等功能
 */

class SmartSearchSuggestions {
    constructor(searchBar) {
        this.searchBar = searchBar;
        this.container = null;
        this.suggestions = [];
        this.selectedIndex = -1;
        this.searchHistory = this.loadHistory();
        this.hotSearches = this.getHotSearches();
    }

    /**
     * 获取热门搜索
     */
    getHotSearches() {
        return [
            { text: '秦始皇', icon: '👑', desc: '中国第一位皇帝', category: 'person' },
            { text: '唐朝', icon: '🏯', desc: '中国古代盛世', category: 'period' },
            { text: '丝绸之路', icon: '🐫', desc: '古代贸易路线', category: 'event' },
            { text: '孔子', icon: '📚', desc: '儒家学派创始人', category: 'person' },
            { text: '文艺复兴', icon: '🎨', desc: '欧洲文化运动', category: 'event' },
            { text: '拿破仑', icon: '⚔️', desc: '法兰西皇帝', category: 'person' },
            { text: '金字塔', icon: '🔺', desc: '古埃及建筑', category: 'event' },
            { text: '工业革命', icon: '⚙️', desc: '技术变革时期', category: 'event' },
            { text: '亚历山大', icon: '🗡️', desc: '马其顿国王', category: 'person' },
            { text: '四大发明', icon: '📜', desc: '中国古代科技', category: 'event' }
        ];
    }

    /**
     * 加载搜索历史
     */
    loadHistory() {
        try {
            return JSON.parse(localStorage.getItem('history_search_history') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * 保存搜索历史
     */
    saveHistory(query) {
        if (!query || query.length < 2) return;

        // 移除重复项
        this.searchHistory = this.searchHistory.filter(item => item !== query);

        // 添加到开头
        this.searchHistory.unshift(query);

        // 限制数量
        this.searchHistory = this.searchHistory.slice(0, 10);

        try {
            localStorage.setItem('history_search_history', JSON.stringify(this.searchHistory));
        } catch (e) {
            console.warn('无法保存搜索历史:', e);
        }
    }

    /**
     * 清除搜索历史
     */
    clearHistory() {
        this.searchHistory = [];
        try {
            localStorage.removeItem('history_search_history');
        } catch (e) {
            console.warn('无法清除搜索历史:', e);
        }
    }

    /**
     * 创建容器
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'smart-search-suggestions';
        this.container.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 8px;
            background: rgba(42, 33, 24, 0.98);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(212, 168, 83, 0.25);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            max-height: 400px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.2s, transform 0.2s;
        `;

        // 添加滚动条样式
        const style = document.createElement('style');
        style.textContent = `
            .smart-search-suggestions::-webkit-scrollbar {
                width: 6px;
            }
            .smart-search-suggestions::-webkit-scrollbar-track {
                background: rgba(212, 168, 83, 0.05);
                border-radius: 3px;
            }
            .smart-search-suggestions::-webkit-scrollbar-thumb {
                background: rgba(212, 168, 83, 0.3);
                border-radius: 3px;
            }
            .smart-search-suggestions::-webkit-scrollbar-thumb:hover {
                background: rgba(212, 168, 83, 0.5);
            }
        `;
        document.head.appendChild(style);

        return this.container;
    }

    /**
     * 获取匹配的建议
     */
    getSuggestions(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();

        // 1. 热门搜索匹配
        this.hotSearches.forEach(item => {
            if (item.text.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    ...item,
                    type: 'hot',
                    score: item.text.toLowerCase() === lowerQuery ? 100 : 50
                });
            }
        });

        // 2. 历史搜索匹配
        this.searchHistory.forEach(text => {
            if (text.toLowerCase().includes(lowerQuery) && text !== query) {
                const existing = suggestions.find(s => s.text === text);
                if (!existing) {
                    suggestions.push({
                        text,
                        icon: '🕐',
                        desc: '最近搜索',
                        type: 'history',
                        score: 40
                    });
                } else if (existing.type === 'history') {
                    existing.score += 10;
                }
            }
        });

        // 3. 数据库节点匹配
        if (this.searchBar.app && this.searchBar.app.dataService) {
            const nodes = Array.from(this.searchBar.app.dataService.nodes.values());
            nodes.forEach(node => {
                const name = node.name || '';
                if (name.toLowerCase().includes(lowerQuery) && name !== query) {
                    const existing = suggestions.find(s => s.text === name);
                    if (!existing) {
                        suggestions.push({
                            text: name,
                            icon: node.type === 'person' ? '👤' : '📜',
                            desc: node.description || node.category?.primary || '',
                            type: 'node',
                            category: node.category?.primary,
                            score: name.toLowerCase() === lowerQuery ? 90 : 30
                        });
                    }
                }
            });
        }

        // 排序并限制数量
        return suggestions
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);
    }

    /**
     * 渲染建议
     */
    render(suggestions, query) {
        this.container.innerHTML = '';
        this.suggestions = suggestions;
        this.selectedIndex = -1;

        if (suggestions.length === 0) {
            this.showNoResults(query);
            return;
        }

        // 分组标题映射
        const typeLabels = {
            hot: '🔥 热门搜索',
            history: '🕐 搜索历史',
            node: '📌 相关内容'
        };

        let currentType = null;

        suggestions.forEach((item, index) => {
            // 添加分组标题
            if (item.type !== currentType) {
                currentType = item.type;
                const groupTitle = document.createElement('div');
                groupTitle.className = 'suggestion-group-title';
                groupTitle.textContent = typeLabels[item.type] || '';
                groupTitle.style.cssText = `
                    padding: 8px 16px;
                    font-size: 12px;
                    color: #C9A96E;
                    background: rgba(212, 168, 83, 0.05);
                `;
                this.container.appendChild(groupTitle);
            }

            const row = document.createElement('div');
            row.className = 'suggestion-item';
            row.dataset.index = index;
            row.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                cursor: pointer;
                transition: background 0.2s;
                border-left: 3px solid transparent;
            `;

            row.onmouseover = () => this.selectItem(index);
            row.onclick = () => this.applySuggestion(item.text);

            // 图标
            const icon = document.createElement('span');
            icon.textContent = item.icon;
            icon.style.cssText = `
                font-size: 18px;
                flex-shrink: 0;
            `;

            // 内容
            const content = document.createElement('div');
            content.style.cssText = `
                flex: 1;
                min-width: 0;
            `;

            // 标题（高亮匹配）
            const title = document.createElement('div');
            title.innerHTML = this.highlightMatch(item.text, query);
            title.style.cssText = `
                font-size: 14px;
                color: #FFF5E0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;

            // 标题（先添加）
            content.appendChild(title);

            // 描述（后添加）
            if (item.desc) {
                const desc = document.createElement('div');
                desc.textContent = item.desc;
                desc.style.cssText = `
                    font-size: 12px;
                    color: #A8916B;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                `;
                content.appendChild(desc);
            }
            row.appendChild(icon);
            row.appendChild(content);

            this.container.appendChild(row);
        });
    }

    /**
     * 显示无结果
     */
    showNoResults(query) {
        const empty = document.createElement('div');
        empty.className = 'suggestion-empty';
        empty.style.cssText = `
            padding: 32px 16px;
            text-align: center;
            color: #A8916B;
        `;
        empty.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
            <div style="font-size: 14px;">未找到"${query}"的相关结果</div>
            <div style="font-size: 12px; margin-top: 8px; color: #8B7355;">试试其他关键词</div>
        `;
        this.container.appendChild(empty);
    }

    /**
     * 高亮匹配部分
     */
    highlightMatch(text, query) {
        if (!query) return text;

        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text;

        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);

        return `${before}<mark style="background: rgba(212, 168, 83, 0.3); color: #F0D68A; padding: 0 2px; border-radius: 2px;">${match}</mark>${after}`;
    }

    /**
     * 显示建议
     */
    show(suggestions, query) {
        if (!this.container) {
            this.container = this.createContainer();
            const searchBox = this.searchBar.container.querySelector('.search-box');
            if (searchBox) {
                searchBox.style.position = 'relative';
                searchBox.appendChild(this.container);
            }
        }

        this.render(suggestions, query);
        this.container.style.display = 'block';
        setTimeout(() => {
            this.container.style.opacity = '1';
            this.container.style.transform = 'translateY(0)';
        }, 10);
    }

    /**
     * 隐藏建议
     */
    hide() {
        if (!this.container) return;

        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (this.container) {
                this.container.style.display = 'none';
            }
        }, 200);
    }

    /**
     * 选择项目
     */
    selectItem(index) {
        this.selectedIndex = index;

        const items = this.container.querySelectorAll('.suggestion-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.style.background = 'rgba(212, 168, 83, 0.15)';
                item.style.borderLeftColor = '#D4A853';
            } else {
                item.style.background = 'transparent';
                item.style.borderLeftColor = 'transparent';
            }
        });
    }

    /**
     * 选择下一项
     */
    selectNext() {
        if (this.suggestions.length === 0) return;
        this.selectItem((this.selectedIndex + 1) % this.suggestions.length);
    }

    /**
     * 选择上一项
     */
    selectPrevious() {
        if (this.suggestions.length === 0) return;
        this.selectItem((this.selectedIndex - 1 + this.suggestions.length) % this.suggestions.length);
    }

    /**
     * 应用当前选中的建议
     */
    applySelected() {
        if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
            this.applySuggestion(this.suggestions[this.selectedIndex].text);
        }
    }

    /**
     * 应用建议
     */
    applySuggestion(text) {
        const input = this.searchBar.container.querySelector('.search-input');
        if (input) {
            input.value = text;
            this.saveHistory(text);
            this.hide();
            this.searchBar.search(text);
        }
    }

    /**
     * 更新建议
     */
    update(query) {
        if (!query || query.length < 1) {
            // 显示热门搜索
            this.show(this.hotSearches.slice(0, 6), '');
            return;
        }

        const suggestions = this.getSuggestions(query);
        this.show(suggestions, query);
    }

    /**
     * 销毁
     */
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}

// 导出到全局
window.SmartSearchSuggestions = SmartSearchSuggestions;
