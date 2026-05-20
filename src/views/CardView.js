/**
 * 卡片视图 - 瀑布流布局
 */

class CardView {
    constructor(app) {
        this.app = app;
        this.container = null;
        
        this.config = {
            cardWidth: 300,
            gap: 20,
            columns: 3
        };
        
        this.cards = [];
    }
    
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'card-view';
        
        this.loadData();
        this.render();
        
        document.querySelector(this.app.options.container).appendChild(this.container);
        this.app.eventBus.emit('view:ready', { view: 'cards' });
    }
    
    hide() {
        if (this.container) this.container.remove();
    }
    
    loadData() {
        this.cards = Array.from(this.app.dataService.nodes.values());
    }
    
    render() {
        this.container.replaceChildren();
        
        const grid = document.createElement('div');
        grid.className = 'card-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${this.config.cardWidth}px, 1fr))`;
        grid.style.gap = `${this.config.gap}px`;
        grid.style.padding = '20px';
        
        this.cards.forEach(card => {
            const cardElement = this.createCard(card);
            grid.appendChild(cardElement);
        });
        
        this.container.appendChild(grid);
    }
    
    createCard(node) {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.style.cssText = `
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        `;

        // 卡片头部
        const header = document.createElement('div');
        header.className = 'card-header';
        const catColor = this.getCategoryColor(node.category.primary);
        header.style.cssText = `
            background: linear-gradient(135deg, ${catColor}, ${catColor}dd);
            padding: 20px;
            color: white;
        `;

        const iconDiv = document.createElement('div');
        iconDiv.className = 'card-icon';
        iconDiv.style.cssText = 'font-size: 32px; margin-bottom: 10px;';
        iconDiv.textContent = this.getNodeIcon(node.type);

        const h3 = document.createElement('h3');
        h3.style.cssText = 'margin: 0; font-size: 18px;';
        h3.textContent = node.name;

        const p = document.createElement('p');
        p.style.cssText = 'margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;';
        p.textContent = node.time.displayDate;

        header.appendChild(iconDiv);
        header.appendChild(h3);
        header.appendChild(p);

        // 卡片主体
        const body = document.createElement('div');
        body.className = 'card-body';
        body.style.cssText = 'padding: 15px;';

        const summaryP = document.createElement('p');
        summaryP.style.cssText = 'margin: 0; color: #666; line-height: 1.6;';
        summaryP.textContent = node.summary;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'card-meta';
        metaDiv.style.cssText = `
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #999;
        `;

        const locationSpan = document.createElement('span');
        locationSpan.textContent = node.location.name || '未知地点';

        const importanceSpan = document.createElement('span');
        importanceSpan.textContent = `重要度: ${'⭐'.repeat(node.metadata.importance)}`;

        metaDiv.appendChild(locationSpan);
        metaDiv.appendChild(importanceSpan);

        body.appendChild(summaryP);
        body.appendChild(metaDiv);

        // 标签
        if (node.category.tags && node.category.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'card-tags';
            tagsDiv.style.cssText = 'margin-top: 10px;';

            node.category.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.style.cssText = `
                    display: inline-block;
                    background: #f0f0f0;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    margin-right: 5px;
                `;
                tagSpan.textContent = tag;
                tagsDiv.appendChild(tagSpan);
            });

            body.appendChild(tagsDiv);
        }

        card.appendChild(header);
        card.appendChild(body);

        card.addEventListener('click', () => {
            this.app.eventBus.emit('node:select', node);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });

        return card;
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
    
    getNodeIcon(type) {
        const icons = {
            event: '📍',
            person: '👤',
            period: '📅',
            branch: '🌿'
        };
        return icons[type] || '●';
    }
    
    filter(filters) {
        this.cards = this.app.dataService.filter(filters);
        this.render();
    }
    
    sort(key, order = 'asc') {
        this.cards.sort((a, b) => {
            const valueA = this.getNestedValue(a, key);
            const valueB = this.getNestedValue(b, key);
            
            if (order === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
        
        this.render();
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    destroy() {
        // 清理容器
        this.hide();
        this.container = null;

        // 清理数据引用
        this.cards = [];
        this.config = null;

        this.app.eventBus.emit('view:destroy', { view: 'cards' });
        this.app = null;
    }
}

window.CardView = CardView;
