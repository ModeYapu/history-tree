/**
 * 卡片视图 - 瀑布流布局
 * 支持虚拟滚动，可处理10k+节点
 */

class CardView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.virtualScroll = null;

        this.config = {
            cardHeight: 180,
            cardWidth: 300,
            gap: 20,
            columns: 3
        };

        this.cards = [];
        this.filteredCards = [];
    }

    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'card-view';
        this.container.style.cssText = `
            height: 100%;
            display: flex;
            flex-direction: column;
        `;

        this.createHeader();
        this.loadData();

        document.querySelector(this.app.options.container).appendChild(this.container);

        // Initialize virtual scroll after container is in DOM
        setTimeout(() => this.initVirtualScroll(), 0);

        this.app.eventBus.emit('view:ready', { view: 'cards' });
    }

    hide() {
        if (this.virtualScroll) {
            this.virtualScroll.destroy();
            this.virtualScroll = null;
        }
        if (this.container) this.container.remove();
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'card-view-header';
        header.style.cssText = `
            padding: 16px 24px;
            background: rgba(42, 33, 24, 0.8);
            border-bottom: 1px solid rgba(212, 168, 83, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        `;

        const info = document.createElement('div');
        info.className = 'card-view-info';
        info.style.cssText = `
            display: flex;
            gap: 24px;
            align-items: center;
        `;

        const countInfo = document.createElement('div');
        countInfo.innerHTML = `
            <span style="color: var(--text-muted);">显示:</span>
            <span id="cardCount" style="color: var(--gold-primary); font-weight: 600;">0</span>
            <span style="color: var(--text-muted);">/</span>
            <span id="totalCards" style="color: var(--text-secondary);">0</span>
        `;

        const stats = document.createElement('div');
        stats.id = 'virtualScrollStats';
        stats.style.cssText = `
            font-size: 12px;
            color: var(--text-muted);
        `;

        info.appendChild(countInfo);
        info.appendChild(stats);

        const controls = document.createElement('div');
        controls.className = 'card-view-controls';
        controls.style.cssText = `
            display: flex;
            gap: 12px;
            align-items: center;
        `;

        // Sort controls
        const sortSelect = document.createElement('select');
        sortSelect.id = 'sortSelect';
        sortSelect.style.cssText = `
            padding: 8px 16px;
            background: rgba(212, 168, 83, 0.1);
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            color: var(--text-primary);
            font-family: 'Noto Serif SC', serif;
            cursor: pointer;
        `;
        sortSelect.innerHTML = `
            <option value="year">按年份排序</option>
            <option value="name">按名称排序</option>
            <option value="importance">按重要度排序</option>
            <option value="category">按类别排序</option>
        `;
        sortSelect.addEventListener('change', () => this.sort(sortSelect.value));

        // View toggle
        const viewToggle = document.createElement('button');
        viewToggle.id = 'viewToggle';
        viewToggle.className = 'view-toggle';
        viewToggle.style.cssText = `
            padding: 8px 16px;
            background: rgba(212, 168, 83, 0.15);
            border: 1px solid var(--border-active);
            border-radius: 8px;
            color: var(--gold-light);
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
            transition: all 0.2s;
        `;
        viewToggle.textContent = '📊 列表';
        viewToggle.addEventListener('click', () => this.toggleView());

        controls.appendChild(sortSelect);
        controls.appendChild(viewToggle);

        header.appendChild(info);
        header.appendChild(controls);
        this.container.appendChild(header);
    }

    loadData() {
        this.cards = Array.from(this.app.dataService.nodes.values());
        this.filteredCards = [...this.cards];
        this.updateCounts();
    }

    updateCounts() {
        const cardCount = document.getElementById('cardCount');
        const totalCards = document.getElementById('totalCards');
        if (cardCount) cardCount.textContent = this.filteredCards.length;
        if (totalCards) totalCards.textContent = this.cards.length;
    }

    initVirtualScroll() {
        const viewport = document.createElement('div');
        viewport.className = 'card-view-viewport';
        viewport.style.cssText = `
            flex: 1;
            overflow: hidden;
            position: relative;
        `;

        this.container.appendChild(viewport);

        this.virtualScroll = new VirtualScroll({
            container: viewport,
            itemHeight: this.config.cardHeight,
            bufferSize: 3,
            itemRenderer: (item, index) => this.createCard(item, index),
            onItemClick: (item, index) => this.onCardClick(item, index),
            onItemHover: (item, index) => this.onCardHover(item, index)
        });

        this.virtualScroll.setItems(this.filteredCards);

        // Update stats periodically
        setInterval(() => this.updateStats(), 1000);
    }

    updateStats() {
        const statsEl = document.getElementById('virtualScrollStats');
        if (statsEl && this.virtualScroll) {
            const stats = this.virtualScroll.getStats();
            statsEl.textContent = `渲染: ${stats.renderedItems} / ${stats.totalItems}`;
        }
    }

    createCard(node, index) {
        const card = document.createElement('div');
        card.className = 'history-card-item';
        card.style.cssText = `
            display: flex;
            background: rgba(42, 33, 24, 0.6);
            border: 1px solid rgba(212, 168, 83, 0.15);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.2s ease;
            cursor: pointer;
            height: calc(100% - 8px);
            margin: 4px;
        `;

        // 卡片序号
        const numberDiv = document.createElement('div');
        numberDiv.className = 'card-number';
        numberDiv.style.cssText = `
            width: 50px;
            background: linear-gradient(180deg, rgba(212, 168, 83, 0.15), rgba(212, 168, 83, 0.05));
            border-right: 1px solid rgba(212, 168, 83, 0.15);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        `;

        const indexSpan = document.createElement('span');
        indexSpan.className = 'card-index';
        indexSpan.style.cssText = `
            font-size: 20px;
            font-weight: bold;
            color: var(--gold-primary);
        `;
        indexSpan.textContent = index + 1;

        const typeIcon = document.createElement('span');
        typeIcon.className = 'card-type-icon';
        typeIcon.style.cssText = 'font-size: 24px; margin-top: 4px;';
        typeIcon.textContent = this.getNodeIcon(node.type);

        numberDiv.appendChild(indexSpan);
        numberDiv.appendChild(typeIcon);

        // 卡片内容
        const content = document.createElement('div');
        content.className = 'card-content';
        content.style.cssText = `
            flex: 1;
            padding: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // 卡片头部
        const header = document.createElement('div');
        header.className = 'card-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        `;

        const titleDiv = document.createElement('div');
        titleDiv.className = 'card-title';

        const nameEl = document.createElement('div');
        nameEl.style.cssText = `
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 4px;
        `;
        nameEl.textContent = node.name;

        const dateEl = document.createElement('div');
        dateEl.style.cssText = `
            font-size: 12px;
            color: var(--text-muted);
        `;
        dateEl.textContent = node.time.displayDate;

        titleDiv.appendChild(nameEl);
        titleDiv.appendChild(dateEl);

        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'category-badge';
        const catColor = this.getCategoryColor(node.category.primary);
        categoryBadge.style.cssText = `
            padding: 4px 10px;
            background: ${catColor}25;
            border: 1px solid ${catColor}50;
            border-radius: 12px;
            font-size: 11px;
            color: ${catColor};
            white-space: nowrap;
        `;
        categoryBadge.textContent = this.getCategoryName(node.category.primary);

        header.appendChild(titleDiv);
        header.appendChild(categoryBadge);

        // 卡片描述
        const descEl = document.createElement('div');
        descEl.className = 'card-description';
        descEl.style.cssText = `
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 8px;
        `;
        descEl.textContent = node.summary || '暂无描述';

        // 卡片元数据
        const metaEl = document.createElement('div');
        metaEl.className = 'card-meta';
        metaEl.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            padding-top: 8px;
            border-top: 1px solid rgba(212, 168, 83, 0.1);
        `;

        const locationEl = document.createElement('span');
        locationEl.style.cssText = `
            font-size: 11px;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        locationEl.innerHTML = `<span>📍</span>${node.location.name || '未知'}`;

        const importanceEl = document.createElement('span');
        importanceEl.style.cssText = `
            font-size: 11px;
            color: var(--gold-light);
        `;
        importanceEl.textContent = '⭐'.repeat(node.metadata.importance);

        metaEl.appendChild(locationEl);
        metaEl.appendChild(importanceEl);

        content.appendChild(header);
        content.appendChild(descEl);
        content.appendChild(metaEl);

        card.appendChild(numberDiv);
        card.appendChild(content);

        return card;
    }

    onCardClick(node, index) {
        this.app.eventBus.emit('node:select', node);
    }

    onCardHover(node, index) {
        // Could show tooltip or highlight in other views
    }

    getCategoryColor(category) {
        const colors = {
            politics: 'var(--red-accent)',
            technology: 'var(--blue-accent)',
            culture: 'var(--purple-accent)',
            economy: 'var(--green-accent)',
            military: 'var(--orange-accent)'
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
        if (!filters || Object.keys(filters).length === 0) {
            this.filteredCards = [...this.cards];
        } else {
            this.filteredCards = this.app.dataService.filter(filters);
        }
        this.updateCounts();
        if (this.virtualScroll) {
            this.virtualScroll.setItems(this.filteredCards);
        }
    }

    sort(key) {
        const sortConfig = {
            year: { key: 'time.year', order: 'asc' },
            name: { key: 'name', order: 'asc' },
            importance: { key: 'metadata.importance', order: 'desc' },
            category: { key: 'category.primary', order: 'asc' }
        };

        const config = sortConfig[key] || sortConfig.year;
        this.sortCards(config.key, config.order);

        if (this.virtualScroll) {
            this.virtualScroll.setItems(this.filteredCards);
        }
    }

    sortCards(key, order = 'asc') {
        this.filteredCards.sort((a, b) => {
            const valueA = this.getNestedValue(a, key);
            const valueB = this.getNestedValue(b, key);

            let comparison = 0;
            if (valueA > valueB) comparison = 1;
            if (valueA < valueB) comparison = -1;

            return order === 'asc' ? comparison : -comparison;
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    toggleView() {
        const btn = document.getElementById('viewToggle');
        if (btn.textContent.includes('列表')) {
            btn.textContent = '🎴 卡片';
            this.config.cardHeight = 80;
        } else {
            btn.textContent = '📊 列表';
            this.config.cardHeight = 180;
        }

        if (this.virtualScroll) {
            this.virtualScroll.itemHeight = this.config.cardHeight;
            this.virtualScroll.update();
        }
    }

    scrollToNode(nodeId) {
        if (this.virtualScroll) {
            this.virtualScroll.scrollById(nodeId);
        }
    }

    destroy() {
        this.hide();
        this.container = null;
        this.cards = [];
        this.filteredCards = [];
        this.app.eventBus.emit('view:destroy', { view: 'cards' });
    }
}

window.CardView = CardView;
