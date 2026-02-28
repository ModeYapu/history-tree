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
        this.container.innerHTML = '';
        
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
        
        card.innerHTML = `
            <div class="card-header" style="
                background: linear-gradient(135deg, ${this.getCategoryColor(node.category.primary)}, ${this.getCategoryColor(node.category.primary)}dd);
                padding: 20px;
                color: white;
            ">
                <div class="card-icon" style="font-size: 32px; margin-bottom: 10px;">
                    ${this.getNodeIcon(node.type)}
                </div>
                <h3 style="margin: 0; font-size: 18px;">${node.name}</h3>
                <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">
                    ${node.time.displayDate}
                </p>
            </div>
            <div class="card-body" style="padding: 15px;">
                <p style="margin: 0; color: #666; line-height: 1.6;">
                    ${node.summary}
                </p>
                <div class="card-meta" style="
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    color: #999;
                ">
                    <span>${node.location.name || '未知地点'}</span>
                    <span>重要度: ${'⭐'.repeat(node.metadata.importance)}</span>
                </div>
                ${node.category.tags.length > 0 ? `
                    <div class="card-tags" style="margin-top: 10px;">
                        ${node.category.tags.map(tag => `
                            <span style="
                                display: inline-block;
                                background: #f0f0f0;
                                padding: 2px 8px;
                                border-radius: 12px;
                                font-size: 11px;
                                margin-right: 5px;
                            ">${tag}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
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
        this.hide();
        this.app.eventBus.emit('view:destroy', { view: 'cards' });
    }
}

window.CardView = CardView;
