/**
 * 筛选面板组件
 */

class FilterPanel {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.filters = {
            category: null,
            period: null,
            type: null,
            importance: null
        };
    }
    
    render() {
        this.container = document.createElement('div');
        this.container.className = 'filter-panel';
        this.container.style.cssText = `
            position: fixed;
            left: 20px;
            top: 100px;
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            padding: 20px;
            z-index: 99;
        `;
        
        this.container.innerHTML = `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">
                🔍 筛选条件
            </h3>
            
            <div class="filter-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">
                    类别
                </label>
                <select class="filter-category" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                ">
                    <option value="">全部</option>
                    <option value="politics">政治</option>
                    <option value="technology">科技</option>
                    <option value="culture">文化</option>
                    <option value="economy">经济</option>
                    <option value="military">军事</option>
                </select>
            </div>
            
            <div class="filter-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">
                    时期
                </label>
                <select class="filter-period" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                ">
                    <option value="">全部</option>
                    <option value="远古时代">远古时代</option>
                    <option value="古代">古代</option>
                    <option value="中世纪">中世纪</option>
                    <option value="近代">近代</option>
                    <option value="现代">现代</option>
                </select>
            </div>
            
            <div class="filter-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">
                    类型
                </label>
                <select class="filter-type" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                ">
                    <option value="">全部</option>
                    <option value="event">事件</option>
                    <option value="person">人物</option>
                    <option value="period">时期</option>
                </select>
            </div>
            
            <div class="filter-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">
                    重要度: <span class="importance-value">1</span>+
                </label>
                <input type="range" class="filter-importance" min="1" max="5" value="1" style="
                    width: 100%;
                " />
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button class="apply-filter" style="
                    flex: 1;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                ">应用</button>
                <button class="reset-filter" style="
                    flex: 1;
                    background: #f0f0f0;
                    color: #666;
                    border: none;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                ">重置</button>
            </div>
        `;
        
        // 绑定事件
        this.container.querySelector('.filter-importance').addEventListener('input', (e) => {
            this.container.querySelector('.importance-value').textContent = e.target.value;
        });
        
        this.container.querySelector('.apply-filter').addEventListener('click', () => this.applyFilters());
        this.container.querySelector('.reset-filter').addEventListener('click', () => this.resetFilters());
        
        return this.container;
    }
    
    applyFilters() {
        this.filters = {
            category: this.container.querySelector('.filter-category').value || null,
            period: this.container.querySelector('.filter-period').value || null,
            type: this.container.querySelector('.filter-type').value || null,
            minImportance: parseInt(this.container.querySelector('.filter-importance').value) || null
        };
        
        const results = this.app.dataService.filter(this.filters);
        
        this.app.eventBus.emit('filter:results', {
            filters: this.filters,
            results
        });
    }
    
    resetFilters() {
        this.container.querySelector('.filter-category').value = '';
        this.container.querySelector('.filter-period').value = '';
        this.container.querySelector('.filter-type').value = '';
        this.container.querySelector('.filter-importance').value = 1;
        this.container.querySelector('.importance-value').textContent = 1;
        
        this.filters = {
            category: null,
            period: null,
            type: null,
            importance: null
        };
        
        this.app.eventBus.emit('filter:reset');
    }
    
    toggle() {
        this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
    }
    
    destroy() {
        if (this.container) {
            this.container.remove();
        }
    }
}

window.FilterPanel = FilterPanel;
