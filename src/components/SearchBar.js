/**
 * 搜索栏组件 - 增强版
 * 功能：实时搜索建议、键盘导航、结果高亮
 */

class SearchBar {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.input = null;
        this.clearBtn = null;
        this.searchBtn = null;
        this.results = [];
        this.suggestions = [];
        this.debounceTimer = null;
        this.selectedIndex = -1;
        this.suggestionItems = [];

        // 保存事件处理器引用，用于清理
        this._inputKeydownHandler = null;
        this._searchBtnClickHandler = null;
        this._keydownHandler = null;

        // 初始化智能搜索建议
        if (typeof SmartSearchSuggestions !== 'undefined') {
            this.smartSuggestions = new SmartSearchSuggestions(this);
        }
    }

    render() {
        this.container = document.createElement('div');
        this.container.className = 'search-bar';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            width: 600px;
            max-width: 90%;
        `;

        // 搜索容器
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        searchBox.style.cssText = `
            background: rgba(42, 33, 24, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(212, 168, 83, 0.25);
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            overflow: hidden;
            display: flex;
            align-items: center;
            transition: border-color 0.3s, box-shadow 0.3s;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '搜索历史事件、人物、地点... (Ctrl+K)';
        input.autocomplete = 'off';
        input.style.cssText = `
            flex: 1;
            border: none;
            padding: 15px 25px;
            font-size: 16px;
            outline: none;
            background: transparent;
            color: #F0D68A;
            font-family: 'Noto Serif SC', serif;
        `;

        // 清除按钮
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-btn';
        clearBtn.innerHTML = '×';
        clearBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: #C9A96E;
            font-size: 20px;
            padding: 0 10px;
            cursor: pointer;
            transition: color 0.2s;
        `;
        clearBtn.addEventListener('click', () => {
            this.input.value = '';
            this.clearBtn.style.display = 'none';
            this.hideSuggestions();
            this.hideResults();
            this.input.focus();
        });

        const button = document.createElement('button');
        button.className = 'search-btn';
        button.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s;
        `;
        button.textContent = '🔍';
        button.addEventListener('mouseenter', () => button.style.transform = 'scale(1.05)');
        button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');

        searchBox.appendChild(input);
        searchBox.appendChild(clearBtn);
        searchBox.appendChild(button);

        // 搜索建议容器
        this.suggestionsContainer = document.createElement('div');
        this.suggestionsContainer.className = 'search-suggestions';
        this.suggestionsContainer.style.cssText = `
            background: rgba(42, 33, 24, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(212, 168, 83, 0.25);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            margin-top: 8px;
            display: none;
            max-height: 200px;
            overflow-y: auto;
        `;

        // 搜索结果容器
        this.resultsContainer = document.createElement('div');
        this.resultsContainer.className = 'search-results';
        this.resultsContainer.style.cssText = `
            background: rgba(42, 33, 24, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(212, 168, 83, 0.25);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            margin-top: 10px;
            display: none;
            max-height: 450px;
            overflow-y: auto;
        `;

        this.container.appendChild(searchBox);
        this.container.appendChild(this.suggestionsContainer);
        this.container.appendChild(this.resultsContainer);

        this.input = input;
        this.clearBtn = clearBtn;
        this.searchBox = searchBox;

        // 绑定事件
        this.bindEvents();

        return this.container;
    }

    bindEvents() {
        // 输入事件 - 保存引用以便清理
        this.input.addEventListener('input', (e) => this.onInput(e));
        this.input.addEventListener('focus', () => this.onFocus());
        this.input.addEventListener('blur', () => setTimeout(() => this.onBlur(), 200));
        this._inputKeydownHandler = (e) => this.onKeyDown(e);
        this.input.addEventListener('keydown', this._inputKeydownHandler);

        // 搜索按钮
        this.searchBtn = this.container.querySelector('.search-btn');
        if (this.searchBtn) {
            this._searchBtnClickHandler = () => this.search();
            this.searchBtn.addEventListener('click', this._searchBtnClickHandler);
        }

        // 全局快捷键
        this._keydownHandler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.input.focus();
            }
            if (e.key === 'Escape') {
                this.hideSuggestions();
                this.hideResults();
            }
        };
        document.addEventListener('keydown', this._keydownHandler);
    }

    onInput(event) {
        const query = event.target.value.trim();

        // 显示/隐藏清除按钮
        this.clearBtn.style.display = query ? 'block' : 'none';

        // 使用智能搜索建议
        if (this.smartSuggestions) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.smartSuggestions.update(query);
            }, 150);
        } else {
            // 防抖处理搜索建议
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                if (query.length >= 1) {
                    this.showSuggestions(query);
                } else {
                    this.hideSuggestions();
                }
            }, 150);
        }

        // 如果已有搜索结果且输入更长，执行搜索
        if (query.length >= 2 && this.results.length > 0) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.search(query);
            }, 300);
        }
    }

    onKeyDown(e) {
        const suggestionsVisible = this.suggestionsContainer.style.display !== 'none';
        const resultsVisible = this.resultsContainer.style.display !== 'none';

        // 下箭头
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (suggestionsVisible) {
                this.selectNextSuggestion();
            } else if (resultsVisible) {
                this.selectNextResult();
            }
        }
        // 上箭头
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestionsVisible) {
                this.selectPreviousSuggestion();
            } else if (resultsVisible) {
                this.selectPreviousResult();
            }
        }
        // Enter
        else if (e.key === 'Enter') {
            if (this.selectedIndex >= 0) {
                if (suggestionsVisible) {
                    this.applySuggestion(this.selectedIndex);
                } else if (resultsVisible) {
                    this.selectResult(this.selectedIndex);
                }
                e.preventDefault();
            } else {
                this.search();
            }
        }
    }

    /**
     * 显示搜索建议
     */
    showSuggestions(query) {
        const allNodes = Array.from(this.app.dataService.nodes.values());
        const lowerQuery = query.toLowerCase();

        // 获取匹配的名称作为建议
        this.suggestions = allNodes
            .filter(node => {
                const name = (node.name || '').toLowerCase();
                return name.includes(lowerQuery) && name !== lowerQuery;
            })
            .slice(0, 8)
            .map(node => node.name);

        // 添加热门搜索建议
        if (query.length < 2) {
            const hotSearches = ['秦始皇', '唐朝', '丝绸之路', '孔子', '拿破仑', '文艺复兴'];
            hotSearches.forEach(s => {
                if (!this.suggestions.includes(s)) {
                    this.suggestions.push(s);
                }
            });
            this.suggestions = this.suggestions.slice(0, 8);
        }

        if (this.suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        // 渲染建议
        this.suggestionsContainer.innerHTML = '';
        this.suggestionItems = [];

        this.suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.style.cssText = `
                padding: 12px 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
            `;

            // 高亮匹配部分
            const highlighted = this.highlightMatch(suggestion, query);

            const icon = document.createElement('span');
            icon.textContent = '🔍';
            icon.style.fontSize = '14px';
            icon.style.opacity = '0.6';

            const text = document.createElement('span');
            text.innerHTML = highlighted;
            text.style.color = '#F0D68A';
            text.style.fontSize = '14px';

            item.appendChild(icon);
            item.appendChild(text);

            item.addEventListener('click', () => this.applySuggestion(index));
            item.addEventListener('mouseenter', () => this.selectSuggestion(index));

            this.suggestionsContainer.appendChild(item);
            this.suggestionItems.push(item);
        });

        this.suggestionsContainer.style.display = 'block';
        this.selectedIndex = -1;
    }

    /**
     * 高亮匹配文本
     */
    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark style="background: rgba(212, 168, 83, 0.3); color: #F0D68A; padding: 0 2px; border-radius: 2px;">$1</mark>');
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    selectSuggestion(index) {
        this.selectedIndex = index;
        this.suggestionItems.forEach((item, i) => {
            if (i === index) {
                item.style.background = 'rgba(212, 168, 83, 0.15)';
            } else {
                item.style.background = 'transparent';
            }
        });
    }

    selectNextSuggestion() {
        const newIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
        this.selectSuggestion(newIndex);
    }

    selectPreviousSuggestion() {
        const newIndex = Math.max(this.selectedIndex - 1, 0);
        this.selectSuggestion(newIndex);
    }

    applySuggestion(index) {
        const suggestion = this.suggestions[index];
        if (suggestion) {
            this.input.value = suggestion;
            this.clearBtn.style.display = 'block';
            this.hideSuggestions();
            this.search(suggestion);
        }
    }

    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
        this.selectedIndex = -1;
    }

    onFocus() {
        if (this.input.value.length >= 1) {
            this.showSuggestions(this.input.value.trim());
        }
        if (this.results.length > 0) {
            this.showResults();
        }
    }

    onBlur() {
        this.hideSuggestions();
    }

    /**
     * 搜索功能
     */
    search(query = this.input.value.trim()) {
        if (!query) return;

        this.app.eventBus.emit('search:start', { query });

        this.results = this.app.dataService.search(query, { limit: 10 });

        this.app.eventBus.emit('search:results', { query, results: this.results });

        this.hideSuggestions();
        this.showResults();
    }

    /**
     * 显示搜索结果
     */
    showResults() {
        this.resultsContainer.innerHTML = '';
        this.resultItems = [];

        if (this.results.length === 0) {
            const noResults = document.createElement('div');
            noResults.style.cssText = 'padding: 30px; text-align: center; color: #C9A96E;';
            noResults.innerHTML = `
                <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
                <div style="font-size: 16px;">没有找到"${this.input.value}"的相关结果</div>
                <div style="font-size: 13px; margin-top: 8px; opacity: 0.7;">试试其他关键词吧</div>
            `;
            this.resultsContainer.appendChild(noResults);
        } else {
            // 添加结果统计
            const stats = document.createElement('div');
            stats.style.cssText = 'padding: 12px 20px; border-bottom: 1px solid rgba(212, 168, 83, 0.15); color: #8B7355; font-size: 13px;';
            stats.textContent = `找到 ${this.results.length} 个结果`;
            this.resultsContainer.appendChild(stats);

            this.results.forEach((node, index) => {
                const resultItem = this.createResultItem(node, index);
                this.resultsContainer.appendChild(resultItem);
                this.resultItems.push(resultItem);
            });
        }

        this.resultsContainer.style.display = 'block';
        this.selectedIndex = -1;
    }

    /**
     * 创建搜索结果项
     */
    createResultItem(node, index) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.dataset.index = index;
        item.style.cssText = `
            padding: 15px 20px;
            border-bottom: 1px solid rgba(212, 168, 83, 0.15);
            cursor: pointer;
            transition: background 0.2s;
        `;

        item.addEventListener('click', () => this.selectResult(node.id));
        item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(212, 168, 83, 0.1)';
        });
        item.addEventListener('mouseleave', () => {
            if (this.selectedIndex !== index) {
                item.style.background = 'transparent';
            }
        });

        const query = this.input.value.trim();
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'display: flex; align-items: center; gap: 15px;';

        // 图标
        const iconSpan = document.createElement('span');
        iconSpan.textContent = this.getNodeIcon(node.type);
        iconSpan.style.cssText = 'font-size: 28px;';

        // 信息区域
        const infoDiv = document.createElement('div');
        infoDiv.style.flex = '1';

        // 名称（带高亮）
        const nameDiv = document.createElement('div');
        nameDiv.innerHTML = this.highlightMatch(node.name, query);
        nameDiv.style.cssText = 'font-weight: bold; font-size: 16px; margin-bottom: 6px; color: #F0D68A;';

        // 详情
        const detailDiv = document.createElement('div');
        detailDiv.style.cssText = 'color: #C9A96E; font-size: 13px;';

        const timeStr = node.time?.displayDate || node.year || '';
        const periodStr = node.time?.period || node.period || '';
        const summary = node.summary || node.description || '';

        detailDiv.textContent = `${timeStr}${timeStr && periodStr ? ' · ' : ''}${periodStr}`;

        if (summary) {
            const summaryDiv = document.createElement('div');
            summaryDiv.style.cssText = 'color: #8B7355; font-size: 12px; margin-top: 4px; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
            summaryDiv.textContent = summary;
            infoDiv.appendChild(summaryDiv);
        }

        // 分类标签
        const categorySpan = document.createElement('span');
        const categoryColor = this.getCategoryColor(node.category?.primary || node.category);
        categorySpan.style.cssText = `
            background: ${categoryColor}25;
            color: ${categoryColor};
            border: 1px solid ${categoryColor}40;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
        `;
        categorySpan.textContent = this.getCategoryName(node.category?.primary || node.category);

        contentDiv.appendChild(iconSpan);
        contentDiv.appendChild(infoDiv);
        contentDiv.appendChild(categorySpan);
        item.appendChild(contentDiv);

        return item;
    }

    /**
     * 结果键盘导航
     */
    selectNextResult() {
        const newIndex = Math.min(this.selectedIndex + 1, this.resultItems.length - 1);
        this.selectResultItem(newIndex);
    }

    selectPreviousResult() {
        const newIndex = Math.max(this.selectedIndex - 1, 0);
        this.selectResultItem(newIndex);
    }

    selectResultItem(index) {
        this.selectedIndex = index;
        this.resultItems.forEach((item, i) => {
            if (i === index) {
                item.style.background = 'rgba(212, 168, 83, 0.15)';
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.style.background = 'transparent';
            }
        });
    }

    hideResults() {
        this.resultsContainer.style.display = 'none';
        this.selectedIndex = -1;
    }

    selectResult(nodeId) {
        const node = this.app.dataService.getNode(nodeId);
        if (node) {
            this.app.eventBus.emit('node:select', node);
            this.hideResults();
            this.input.value = '';
            this.clearBtn.style.display = 'none';
        }
    }

    getNodeIcon(type) {
        const icons = {
            event: '📍',
            person: '👤',
            period: '📅',
            branch: '🌿'
        };
        return icons[type] || '•';
    }

    getCategoryColor(category) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316'
        };
        return colors[category] || '#999';
    }

    getCategoryName(category) {
        const names = {
            politics: '政治',
            technology: '科技',
            culture: '文化',
            economy: '经济',
            military: '军事'
        };
        return names[category] || category;
    }

    destroy() {
        // 清理定时器
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // 清理智能搜索建议
        if (this.smartSuggestions) {
            this.smartSuggestions.destroy();
        }

        // 清理键盘事件监听器
        if (this._keydownHandler) {
            document.removeEventListener('keydown', this._keydownHandler);
        }

        // 清理 input 事件监听器
        if (this.input && this._inputKeydownHandler) {
            this.input.removeEventListener('keydown', this._inputKeydownHandler);
        }

        // 清理搜索按钮事件监听器
        if (this.searchBtn && this._searchBtnClickHandler) {
            this.searchBtn.removeEventListener('click', this._searchBtnClickHandler);
        }

        // 移除容器
        if (this.container) {
            this.container.remove();
        }
    }
}

window.SearchBar = SearchBar;
