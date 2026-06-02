/**
 * 增强筛选面板组件
 * 支持多选标签、类别过滤、时期过滤
 */

class FilterPanel {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.isOpen = false;

        this.filters = {
            categories: [],
            tags: [],
            periods: [],
            types: [],
            minImportance: null,
            yearRange: null
        };

        this.availableOptions = {
            categories: [],
            tags: [],
            periods: []
        };
    }

    render() {
        this.container = document.createElement('div');
        this.container.className = 'filter-panel';
        this.container.style.cssText = `
            position: fixed;
            left: 20px;
            top: 80px;
            width: 300px;
            max-height: calc(100vh - 100px);
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 100;
            overflow: hidden;
            display: none;
            flex-direction: column;
        `;

        // Header
        const header = this.createHeader();
        this.container.appendChild(header);

        // Content
        const content = this.createContent();
        this.container.appendChild(content);

        // Footer
        const footer = this.createFooter();
        this.container.appendChild(footer);

        document.body.appendChild(this.container);

        // Load available options
        this.loadAvailableOptions();

        return this.container;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'filter-panel-header';
        header.style.cssText = `
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-subtle);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('h3');
        title.style.cssText = 'margin: 0; font-size: 16px; color: var(--gold-primary); font-weight: 600;';
        title.textContent = '🔍 筛选条件';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'filter-close-btn';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 20px;
            cursor: pointer;
            padding: 4px;
            line-height: 1;
        `;
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => this.toggle());

        header.appendChild(title);
        header.appendChild(closeBtn);

        return header;
    }

    createContent() {
        const content = document.createElement('div');
        content.className = 'filter-panel-content';
        content.style.cssText = `
            padding: 16px 20px;
            overflow-y: auto;
            flex: 1;
        `;

        // 搜索框
        const searchGroup = this.createSearchGroup();
        content.appendChild(searchGroup);

        // 类别选择
        const categoryGroup = this.createMultiSelectGroup('类别', 'filter-category', [
            { value: 'politics', label: '政治', color: '#ff6b6b' },
            { value: 'technology', label: '科技', color: '#4ecdc4' },
            { value: 'culture', label: '文化', color: '#a855f7' },
            { value: 'economy', label: '经济', color: '#22c55e' },
            { value: 'military', label: '军事', color: '#f97316' }
        ], 'categories');
        content.appendChild(categoryGroup);

        // 时期选择
        const periodGroup = this.createMultiSelectGroup('时期', 'filter-period', [
            { value: '远古时代', label: '远古时代' },
            { value: '古代', label: '古代' },
            { value: '中世纪', label: '中世纪' },
            { value: '近代', label: '近代' },
            { value: '现代', label: '现代' }
        ], 'periods');
        content.appendChild(periodGroup);

        // 类型选择
        const typeGroup = this.createMultiSelectGroup('类型', 'filter-type', [
            { value: 'event', label: '事件', icon: '📍' },
            { value: 'person', label: '人物', icon: '👤' },
            { value: 'period', label: '时期', icon: '📅' }
        ], 'types');
        content.appendChild(typeGroup);

        // 标签选择 (动态加载)
        const tagGroup = this.createTagGroup();
        content.appendChild(tagGroup);

        // 重要度滑块
        const importanceGroup = this.createImportanceGroup();
        content.appendChild(importanceGroup);

        return content;
    }

    createSearchGroup() {
        const group = document.createElement('div');
        group.className = 'filter-group filter-search-group';
        group.style.cssText = 'margin-bottom: 16px;';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'filter-search-input';
        input.placeholder = '搜索历史...';
        input.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            background: rgba(212, 168, 83, 0.08);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            font-size: 14px;
            font-family: 'Noto Serif SC', serif;
        `;

        let searchTimeout;
        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        group.appendChild(input);

        return group;
    }

    createMultiSelectGroup(label, className, options, filterKey) {
        const group = document.createElement('div');
        group.className = `filter-group ${className}`;
        group.style.cssText = 'margin-bottom: 16px;';

        const labelEl = document.createElement('label');
        labelEl.className = 'filter-group-label';
        labelEl.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
        `;
        labelEl.textContent = label;

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'filter-options-container';
        optionsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        `;

        options.forEach(opt => {
            const chip = document.createElement('button');
            chip.className = `filter-chip filter-chip-${opt.value}`;
            chip.type = 'button';
            chip.dataset.value = opt.value;
            chip.dataset.label = opt.label;
            chip.style.cssText = `
                padding: 6px 12px;
                background: rgba(212, 168, 83, 0.1);
                border: 1px solid var(--border-subtle);
                border-radius: 16px;
                color: var(--text-secondary);
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: 'Noto Serif SC', serif;
            `;

            if (opt.icon) {
                chip.innerHTML = `<span style="margin-right: 4px;">${opt.icon}</span>${opt.label}`;
            } else if (opt.color) {
                chip.innerHTML = `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${opt.color}; margin-right: 6px;"></span>${opt.label}`;
            } else {
                chip.textContent = opt.label;
            }

            chip.addEventListener('click', () => this.toggleOption(filterKey, opt.value, chip));

            optionsContainer.appendChild(chip);
        });

        group.appendChild(labelEl);
        group.appendChild(optionsContainer);

        return group;
    }

    createTagGroup() {
        const group = document.createElement('div');
        group.className = 'filter-group filter-tag-group';
        group.style.cssText = 'margin-bottom: 16px;';

        const labelEl = document.createElement('label');
        labelEl.className = 'filter-group-label';
        labelEl.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
        `;
        labelEl.textContent = '热门标签';

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'filter-tags-container';
        tagsContainer.id = 'filterTagsContainer';
        tagsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            max-height: 120px;
            overflow-y: auto;
        `;

        // Loading state
        tagsContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 12px;">加载中...</span>';

        group.appendChild(labelEl);
        group.appendChild(tagsContainer);

        return group;
    }

    createImportanceGroup() {
        const group = document.createElement('div');
        group.className = 'filter-group filter-importance-group';
        group.style.cssText = 'margin-bottom: 16px;';

        const label = document.createElement('label');
        label.className = 'filter-group-label';
        label.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
        `;
        label.innerHTML = `
            <span>重要度</span>
            <span id="importanceValue" class="importance-value">全部</span>
        `;

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'importance-slider-container';
        sliderContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const stars = document.createElement('div');
        stars.className = 'importance-stars';
        stars.style.cssText = `
            display: flex;
            gap: 4px;
        `;

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('button');
            star.type = 'button';
            star.className = `importance-star importance-star-${i}`;
            star.dataset.value = i;
            star.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.3;
                transition: opacity 0.2s;
                padding: 0;
            `;
            star.textContent = '⭐';
            star.addEventListener('click', () => this.setImportance(i));
            star.addEventListener('mouseenter', () => this.highlightStars(i));
            star.addEventListener('mouseleave', () => this.highlightStars(this.filters.minImportance || 0));
            stars.appendChild(star);
        }

        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'importance-reset-btn';
        resetBtn.style.cssText = `
            background: none;
            border: 1px solid var(--border-subtle);
            color: var(--text-muted);
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
        `;
        resetBtn.textContent = '重置';
        resetBtn.addEventListener('click', () => this.setImportance(null));

        sliderContainer.appendChild(stars);
        sliderContainer.appendChild(resetBtn);

        group.appendChild(label);
        group.appendChild(sliderContainer);

        return group;
    }

    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'filter-panel-footer';
        footer.style.cssText = `
            padding: 16px 20px;
            border-top: 1px solid var(--border-subtle);
            display: flex;
            gap: 12px;
        `;

        const applyBtn = document.createElement('button');
        applyBtn.className = 'filter-apply-btn';
        applyBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark));
            border: none;
            border-radius: var(--radius-sm);
            color: var(--bg-primary);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
        `;
        applyBtn.textContent = '应用筛选';
        applyBtn.addEventListener('click', () => this.applyFilters());

        const resetBtn = document.createElement('button');
        resetBtn.className = 'filter-reset-btn';
        resetBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: transparent;
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
            font-size: 14px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
        `;
        resetBtn.textContent = '重置全部';
        resetBtn.addEventListener('click', () => this.resetFilters());

        const activeCount = document.createElement('span');
        activeCount.id = 'activeFilterCount';
        activeCount.className = 'active-filter-count';
        activeCount.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: var(--red-accent);
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            display: none;
        `;

        footer.appendChild(applyBtn);
        footer.appendChild(resetBtn);

        return footer;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.container.style.display = 'flex';
        } else {
            this.container.style.display = 'none';
        }
    }

    toggleOption(filterKey, value, element) {
        const index = this.filters[filterKey].indexOf(value);
        if (index === -1) {
            this.filters[filterKey].push(value);
            element.style.background = 'rgba(212, 168, 83, 0.3)';
            element.style.borderColor = 'var(--border-active)';
            element.style.color = 'var(--gold-light)';
        } else {
            this.filters[filterKey].splice(index, 1);
            element.style.background = '';
            element.style.borderColor = '';
            element.style.color = '';
        }
        this.updateActiveCount();
    }

    setImportance(value) {
        this.filters.minImportance = value;
        const valueEl = document.getElementById('importanceValue');
        if (value) {
            valueEl.textContent = `${value}+`;
        } else {
            valueEl.textContent = '全部';
        }
        this.highlightStars(value || 0);
        this.updateActiveCount();
    }

    highlightStars(count) {
        for (let i = 1; i <= 5; i++) {
            const star = document.querySelector(`.importance-star-${i}`);
            if (star) {
                star.style.opacity = i <= count ? '1' : '0.3';
            }
        }
    }

    updateActiveCount() {
        let count = 0;
        if (this.filters.categories.length) count++;
        if (this.filters.tags.length) count++;
        if (this.filters.periods.length) count++;
        if (this.filters.types.length) count++;
        if (this.filters.minImportance) count++;

        const countEl = document.getElementById('activeFilterCount');
        if (countEl) {
            if (count > 0) {
                countEl.style.display = 'block';
                countEl.textContent = count;
            } else {
                countEl.style.display = 'none';
            }
        }
    }

    loadAvailableOptions() {
        // Load tags from search engine
        if (this.app.dataService?.searchEngine) {
            const engine = this.app.dataService.searchEngine;
            const tags = engine.getAllTags ? engine.getAllTags() : [];
            const popularTags = engine.getPopularTags ? engine.getPopularTags(15) : [];

            this.renderTags(popularTags);
        }
    }

    renderTags(tags) {
        const container = document.getElementById('filterTagsContainer');
        if (!container) return;

        container.innerHTML = '';

        if (tags.length === 0) {
            container.innerHTML = '<span style="color: var(--text-muted); font-size: 12px;">暂无标签</span>';
            return;
        }

        tags.forEach(({ tag, count }) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = `filter-chip filter-chip-tag`;
            chip.dataset.value = tag;
            chip.style.cssText = `
                padding: 4px 10px;
                background: rgba(138, 105, 20, 0.15);
                border: 1px solid rgba(212, 168, 83, 0.2);
                border-radius: 12px;
                color: var(--text-muted);
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: 'Noto Serif SC', serif;
            `;
            chip.innerHTML = `${tag} <span style="opacity: 0.6;">${count}</span>`;

            chip.addEventListener('click', () => {
                const index = this.filters.tags.indexOf(tag);
                if (index === -1) {
                    this.filters.tags.push(tag);
                    chip.style.background = 'rgba(212, 168, 83, 0.25)';
                    chip.style.borderColor = 'var(--border-active)';
                    chip.style.color = 'var(--gold-light)';
                } else {
                    this.filters.tags.splice(index, 1);
                    chip.style.background = '';
                    chip.style.borderColor = '';
                    chip.style.color = '';
                }
                this.updateActiveCount();
            });

            container.appendChild(chip);
        });
    }

    performSearch(query) {
        if (!query.trim()) {
            this.app.eventBus.emit('search:clear');
            return;
        }

        const results = this.app.search(query, {
            fuzzy: true
        });

        this.app.eventBus.emit('search:results', { query, results });
    }

    applyFilters() {
        const searchOptions = {};

        if (this.filters.categories.length > 0) {
            searchOptions.categories = this.filters.categories;
        }
        if (this.filters.tags.length > 0) {
            searchOptions.tags = this.filters.tags;
        }
        if (this.filters.periods.length > 0) {
            searchOptions.periods = this.filters.periods;
        }
        if (this.filters.types.length > 0) {
            searchOptions.type = this.filters.types[0];
        }
        if (this.filters.minImportance) {
            searchOptions.minImportance = this.filters.minImportance;
        }

        const results = this.app.search('', searchOptions);
        this.app.eventBus.emit('filter:results', { filters: this.filters, results });

        // Close panel after applying
        this.toggle();
    }

    resetFilters() {
        this.filters = {
            categories: [],
            tags: [],
            periods: [],
            types: [],
            minImportance: null,
            yearRange: null
        };

        // Reset UI
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.style.background = '';
            chip.style.borderColor = '';
            chip.style.color = '';
        });

        document.getElementById('importanceValue').textContent = '全部';
        this.highlightStars(0);
        this.updateActiveCount();

        this.app.eventBus.emit('filter:reset');
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.app = null;
    }
}

window.FilterPanel = FilterPanel;
