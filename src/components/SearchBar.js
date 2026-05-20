/**
 * 搜索栏组件
 */

class SearchBar {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.input = null;
        this.results = [];
        this.debounceTimer = null;
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

        // 安全地创建搜索容器
        const searchBox = document.createElement('div');
        searchBox.style.cssText = `
            background: white;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            overflow: hidden;
            display: flex;
            align-items: center;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '搜索历史事件、人物、地点...';
        input.style.cssText = `
            flex: 1;
            border: none;
            padding: 15px 25px;
            font-size: 16px;
            outline: none;
        `;

        const button = document.createElement('button');
        button.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            cursor: pointer;
        `;
        button.textContent = '🔍';

        searchBox.appendChild(input);
        searchBox.appendChild(button);

        this.resultsContainer = document.createElement('div');
        this.resultsContainer.className = 'search-results';
        this.resultsContainer.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            margin-top: 10px;
            display: none;
            max-height: 400px;
            overflow-y: auto;
        `;

        this.container.appendChild(searchBox);
        this.container.appendChild(this.resultsContainer);

        this.input = input;

        // 绑定事件
        this.input.addEventListener('input', (e) => this.onInput(e));
        this.input.addEventListener('focus', () => this.onFocus());
        this.input.addEventListener('blur', () => setTimeout(() => this.onBlur(), 200));

        button.addEventListener('click', () => this.search());

        // 键盘快捷键
        this._keydownHandler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.input.focus();
            }

            if (e.key === 'Escape') {
                this.hideResults();
            }
        };
        document.addEventListener('keydown', this._keydownHandler);

        return this.container;
    }
    
    onInput(event) {
        const query = event.target.value.trim();
        
        // 防抖
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (query.length >= 2) {
                this.search(query);
            } else {
                this.hideResults();
            }
        }, 300);
    }
    
    onFocus() {
        if (this.input.value.length >= 2 && this.results.length > 0) {
            this.showResults();
        }
    }
    
    onBlur() {
        this.hideResults();
    }
    
    search(query = this.input.value.trim()) {
        if (!query) return;
        
        this.app.eventBus.emit('search:start', { query });
        
        this.results = this.app.dataService.search(query, { limit: 10 });
        
        this.app.eventBus.emit('search:results', { query, results: this.results });
        
        this.showResults();
    }
    
    showResults() {
        // 清空结果容器
        this.resultsContainer.innerHTML = '';

        if (this.results.length === 0) {
            const noResults = document.createElement('div');
            noResults.style.cssText = 'padding: 20px; text-align: center; color: #999;';
            noResults.textContent = '没有有找到相关结果';
            this.resultsContainer.appendChild(noResults);
        } else {
            this.results.forEach(node => {
                const resultItem = this.createResultItem(node);
                this.resultsContainer.appendChild(resultItem);
            });
        }

        this.resultsContainer.style.display = 'block';
    }

    /**
     * 安全地创建搜索结果项
     */
    createResultItem(node) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.style.cssText = `
            padding: 15px 20px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background 0.2s;
        `;

        // 悬停效果
        item.addEventListener('mouseenter', () => {
            item.style.background = '#f8f8f8';
        });
        item.addEventListener('mouseleave', () => {
            item.style.background = 'white';
        });

        // 点击事件
        item.addEventListener('click', () => {
            this.selectResult(node.id);
        });

        // 内容容器
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'display: flex; align-items: center;';

        // 图标
        const iconSpan = document.createElement('span');
        iconSpan.style.cssText = 'font-size: 24px; margin-right: 15px;';
        iconSpan.textContent = this.getNodeIcon(node.type);

        // 信息容器
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'flex: 1;';

        // 名称
        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = 'font-weight: bold; font-size: 15px; margin-bottom: 3px;';
        nameDiv.textContent = node.name;

        // 详情
        const detailDiv = document.createElement('div');
        detailDiv.style.cssText = 'color: #999; font-size: 13px;';
        detailDiv.textContent = `${node.time.displayDate} • ${node.summary || ''}`;

        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(detailDiv);

        // 分类标签
        const categorySpan = document.createElement('span');
        const categoryColor = this.getCategoryColor(node.category.primary);
        categorySpan.style.cssText = `
            background: ${categoryColor};
            color: white;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 12px;
        `;
        categorySpan.textContent = node.category.primary;

        contentDiv.appendChild(iconSpan);
        contentDiv.appendChild(infoDiv);
        contentDiv.appendChild(categorySpan);

        item.appendChild(contentDiv);

        return item;
    }
    
    hideResults() {
        this.resultsContainer.style.display = 'none';
    }
    
    selectResult(nodeId) {
        const node = this.app.dataService.getNode(nodeId);
        if (node) {
            this.app.eventBus.emit('node:select', node);
            this.hideResults();
            this.input.value = '';
        }
    }
    
    getNodeIcon(type) {
        const icons = {
            event: '📍',
            person: '👤',
            period: '📅',
            branch: '🌿'
        };
        return icons[type] || '●';
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
    
    destroy() {
        // 清理定时器
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // 清理键盘事件监听器
        if (this._keydownHandler) {
            document.removeEventListener('keydown', this._keydownHandler);
        }

        // 移除容器
        if (this.container) {
            this.container.remove();
        }
    }
}

window.SearchBar = SearchBar;
