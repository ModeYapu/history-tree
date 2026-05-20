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

        // 标题
        const title = document.createElement('h3');
        title.style.cssText = 'margin: 0 0 20px 0; font-size: 18px; color: #333;';
        title.textContent = '🔍 筛选条件';
        this.container.appendChild(title);

        // 类别选择
        const categoryGroup = this.createSelectGroup('类别', 'filter-category', [
            { value: '', text: '全部' },
            { value: 'politics', text: '政治' },
            { value: 'technology', text: '科技' },
            { value: 'culture', text: '文化' },
            { value: 'economy', text: '经济' },
            { value: 'military', text: '军事' }
        ]);
        this.container.appendChild(categoryGroup);

        // 时期选择
        const periodGroup = this.createSelectGroup('时期', 'filter-period', [
            { value: '', text: '全部' },
            { value: '远古时代', text: '远古时代' },
            { value: '古代', text: '古代' },
            { value: '中世纪', text: '中世纪' },
            { value: '近代', text: '近代' },
            { value: '现代', text: '现代' }
        ]);
        this.container.appendChild(periodGroup);

        // 类型选择
        const typeGroup = this.createSelectGroup('类型', 'filter-type', [
            { value: '', text: '全部' },
            { value: 'event', text: '事件' },
            { value: 'person', text: '人物' },
            { value: 'period', text: '时期' }
        ]);
        this.container.appendChild(typeGroup);

        // 重要度滑块
        const importanceGroup = this.createImportanceGroup();
        this.container.appendChild(importanceGroup);

        // 按钮
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = 'display: flex; gap: 10px;';

        const applyBtn = document.createElement('button');
        applyBtn.className = 'apply-filter';
        applyBtn.style.cssText = `
            flex: 1;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
        `;
        applyBtn.textContent = '应用';

        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-filter';
        resetBtn.style.cssText = `
            flex: 1;
            background: #f0f0f0;
            color: #666;
            border: none;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
        `;
        resetBtn.textContent = '重置';

        buttonDiv.appendChild(applyBtn);
        buttonDiv.appendChild(resetBtn);
        this.container.appendChild(buttonDiv);

        // 绑定事件
        this.container.querySelector('.filter-importance').addEventListener('input', (e) => {
            this.container.querySelector('.importance-value').textContent = e.target.value;
        });

        applyBtn.addEventListener('click', () => this.applyFilters());
        resetBtn.addEventListener('click', () => this.resetFilters());

        return this.container;
    }

    /**
     * 创建选择框组
     */
    createSelectGroup(label, className, options) {
        const group = document.createElement('div');
        group.className = 'filter-group';
        group.style.cssText = 'margin-bottom: 20px;';

        const labelEl = document.createElement('label');
        labelEl.style.cssText = 'display: block; margin-bottom: 8px; font-size: 14px; color: #666;';
        labelEl.textContent = label;

        const select = document.createElement('select');
        select.className = className;
        select.style.cssText = `
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
        `;

        options.forEach(({ value, text }) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
        });

        group.appendChild(labelEl);
        group.appendChild(select);

        return group;
    }

    /**
     * 创建重要度滑块组
     */
    createImportanceGroup() {
        const group = document.createElement('div');
        group.className = 'filter-group';
        group.style.cssText = 'margin-bottom: 20px;';

        const label = document.createElement('label');
        label.style.cssText = 'display: block; margin-bottom: 8px; font-size: 14px; color: #666;';
        label.innerHTML = '重要度: <span class="importance-value">1</span>+';

        const input = document.createElement('input');
        input.type = 'range';
        input.className = 'filter-importance';
        input.min = 1;
        input.max = 5;
        input.value = 1;
        input.style.cssText = 'width: 100%;';

        group.appendChild(label);
        group.appendChild(input);

        return group;
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
