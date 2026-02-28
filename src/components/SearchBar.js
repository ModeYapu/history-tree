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
        
        this.container.innerHTML = `
            <div style="
                background: white;
                border-radius: 25px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                overflow: hidden;
                display: flex;
                align-items: center;
            ">
                <input type="text" 
                    placeholder="搜索历史事件、人物、地点..." 
                    style="
                        flex: 1;
                        border: none;
                        padding: 15px 25px;
                        font-size: 16px;
                        outline: none;
                    "
                />
                <button style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    font-size: 16px;
                    cursor: pointer;
                ">🔍</button>
            </div>
            <div class="search-results" style="
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                margin-top: 10px;
                display: none;
                max-height: 400px;
                overflow-y: auto;
            "></div>
        `;
        
        this.input = this.container.querySelector('input');
        this.resultsContainer = this.container.querySelector('.search-results');
        
        // 绑定事件
        this.input.addEventListener('input', (e) => this.onInput(e));
        this.input.addEventListener('focus', () => this.onFocus());
        this.input.addEventListener('blur', () => setTimeout(() => this.onBlur(), 200));
        
        this.container.querySelector('button').addEventListener('click', () => this.search());
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.input.focus();
            }
            
            if (e.key === 'Escape') {
                this.hideResults();
            }
        });
        
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
        if (this.results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #999;">
                    没有找到相关结果
                </div>
            `;
        } else {
            this.resultsContainer.innerHTML = this.results.map(node => `
                <div class="search-result-item" style="
                    padding: 15px 20px;
                    border-bottom: 1px solid #f0f0f0;
                    cursor: pointer;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#f8f8f8'" 
                   onmouseout="this.style.background='white'"
                   onclick="window.app.searchBar.selectResult('${node.id}')">
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 15px;">
                            ${this.getNodeIcon(node.type)}
                        </span>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 15px; margin-bottom: 3px;">
                                ${node.name}
                            </div>
                            <div style="color: #999; font-size: 13px;">
                                ${node.time.displayDate} • ${node.summary || ''}
                            </div>
                        </div>
                        <span style="
                            background: ${this.getCategoryColor(node.category.primary)};
                            color: white;
                            padding: 3px 10px;
                            border-radius: 12px;
                            font-size: 12px;
                        ">${node.category.primary}</span>
                    </div>
                </div>
            `).join('');
        }
        
        this.resultsContainer.style.display = 'block';
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
        if (this.container) {
            this.container.remove();
        }
    }
}

window.SearchBar = SearchBar;
