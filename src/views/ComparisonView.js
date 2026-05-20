/**
 * 对比视图 - 历史人物/事件对比分析 v1.0
 * 支持并排对比、维度对比、雷达图可视化、相似度分析
 */

class ComparisonView {
    static DIMENSIONS = [
        { id: 'influence', name: '影响力', color: '#667eea' },
        { id: 'duration', name: '持续时间', color: '#764ba2' },
        { id: 'scope', name: '影响范围', color: '#f093fb' },
        { id: 'innovation', name: '创新性', color: '#4facfe' },
        { id: 'legacy', name: '历史地位', color: '#00f2fe' }
    ];

    static CATEGORY_COLORS = {
        politics: '#ff6b6b',
        technology: '#4ecdc4',
        culture: '#a855f7',
        economy: '#22c55e',
        military: '#f97316',
        default: '#999'
    };

    constructor(app) {
        this.app = app;
        this.container = null;
        this.dimensions = [...ComparisonView.DIMENSIONS];
        this.selectedItems = [null, null];
        this.comparisonData = null;
        this.radarChart = null;
        this.eventListeners = [];
    }

    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'comparison-view';
        this.container.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: #f8f9fa;
        `;

        document.querySelector(this.app.options.container).appendChild(this.container);

        this.initHeader();
        this.initComparisonArea();
        this.initSelectionPanel();
        this.setupEventListeners();

        // 预选项目
        if (options.items && options.items.length >= 2) {
            this.selectItem(0, options.items[0]);
            this.selectItem(1, options.items[1]);
        }

        this.app.eventBus.emit('view:ready', { view: 'comparison' });
    }

    hide() {
        this.removeEventListeners();
        if (this.container) {
            this.container.remove();
        }
        this.selectedItems = [null, null];
    }

    /**
     * 初始化头部
     */
    initHeader() {
        const header = document.createElement('div');
        header.className = 'comparison-header';
        header.style.cssText = `
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('h2');
        title.textContent = '历史对比';
        title.style.cssText = 'margin: 0; font-size: 24px;';

        const actions = document.createElement('div');
        actions.style.cssText = 'display: flex; gap: 10px;';

        const swapBtn = this.createButton('交换位置', () => this.swapItems());
        const clearBtn = this.createButton('清空对比', () => this.clearComparison(), '#f44336');

        actions.appendChild(swapBtn);
        actions.appendChild(clearBtn);

        header.appendChild(title);
        header.appendChild(actions);

        this.container.appendChild(header);
    }

    /**
     * 初始化对比区域
     */
    initComparisonArea() {
        const comparisonArea = document.createElement('div');
        comparisonArea.className = 'comparison-area';
        comparisonArea.style.cssText = `
            flex: 1;
            display: flex;
            padding: 20px;
            gap: 20px;
            overflow: hidden;
        `;

        // 左侧面板
        const leftPanel = this.createItemPanel(0);
        // 中间雷达图
        const centerPanel = this.createRadarPanel();
        // 右侧面板
        const rightPanel = this.createItemPanel(1);

        comparisonArea.appendChild(leftPanel);
        comparisonArea.appendChild(centerPanel);
        comparisonArea.appendChild(rightPanel);

        this.container.appendChild(comparisonArea);
    }

    /**
     * 创建项目面板
     */
    createItemPanel(index) {
        const panel = document.createElement('div');
        panel.className = `item-panel item-panel-${index}`;
        panel.style.cssText = `
            flex: 1;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            display: flex;
            flex-direction: column;
        `;

        const placeholder = document.createElement('div');
        placeholder.className = `item-placeholder item-placeholder-${index}`;
        placeholder.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #999;
            min-height: 300px;
            border: 2px dashed #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        placeholder.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">+</div>
            <div style="font-size: 16px;">点击选择${index === 0 ? '第一个' : '第二个'}项目</div>
        `;
        placeholder.addEventListener('click', () => this.showSelectionModal(index));
        placeholder.addEventListener('mouseenter', () => {
            placeholder.style.borderColor = '#667eea';
            placeholder.style.background = '#f8f9ff';
        });
        placeholder.addEventListener('mouseleave', () => {
            placeholder.style.borderColor = '#ddd';
            placeholder.style.background = 'transparent';
        });

        const content = document.createElement('div');
        content.className = `item-content item-content-${index}`;
        content.style.cssText = 'display: none;';

        panel.appendChild(placeholder);
        panel.appendChild(content);

        return panel;
    }

    /**
     * 创建雷达图面板
     */
    createRadarPanel() {
        const panel = document.createElement('div');
        panel.className = 'radar-panel';
        panel.style.cssText = `
            flex: 0 0 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            display: flex;
            flex-direction: column;
        `;

        const title = document.createElement('h3');
        title.textContent = '维度对比';
        title.style.cssText = 'margin: 0 0 20px 0; text-align: center; color: #333;';

        const chartContainer = document.createElement('div');
        chartContainer.className = 'radar-chart-container';
        chartContainer.style.cssText = `
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        `;

        const canvas = document.createElement('canvas');
        canvas.id = 'radar-chart';
        canvas.width = 350;
        canvas.height = 350;

        chartContainer.appendChild(canvas);

        const legend = document.createElement('div');
        legend.className = 'radar-legend';
        legend.style.cssText = `
            margin-top: 15px;
            display: flex;
            justify-content: center;
            gap: 20px;
            font-size: 12px;
        `;

        panel.appendChild(title);
        panel.appendChild(chartContainer);
        panel.appendChild(legend);

        return panel;
    }

    /**
     * 初始化选择面板
     */
    initSelectionPanel() {
        const selectionPanel = document.createElement('div');
        selectionPanel.className = 'selection-panel';
        selectionPanel.style.cssText = `
            padding: 15px 20px;
            background: white;
            border-top: 1px solid #eee;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索要对比的历史人物或事件...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        `;

        searchInput.addEventListener('input', (e) => {
            this.filterSelectionOptions(e.target.value);
        });

        selectionPanel.appendChild(searchInput);
        this.container.appendChild(selectionPanel);
        this.searchInput = searchInput;
    }

    /**
     * 显示选择模态框
     */
    showSelectionModal(panelIndex) {
        const modal = document.createElement('div');
        modal.className = 'selection-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const content = document.createElement('div');
        content.className = 'selection-modal-content';
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            width: 600px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 30px rgba(0,0,0,0.2);
        `;

        // 头部
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('h3');
        title.textContent = `选择${panelIndex === 0 ? '第一个' : '第二个'}对比项目`;
        title.style.cssText = 'margin: 0;';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 5px 10px;
        `;
        closeBtn.addEventListener('click', () => modal.remove());

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 搜索框
        const searchBox = document.createElement('div');
        searchBox.style.cssText = 'padding: 15px 20px;';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索历史人物或事件...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        `;
        searchBox.appendChild(searchInput);

        // 分类筛选
        const filterBar = document.createElement('div');
        filterBar.style.cssText = `
            padding: 0 20px 10px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        `;

        const categories = ['全部', '政治', '科技', '文化', '经济', '军事'];
        categories.forEach(cat => {
            const filterBtn = document.createElement('button');
            filterBtn.textContent = cat;
            filterBtn.style.cssText = `
                padding: 6px 12px;
                border: 1px solid #ddd;
                background: ${cat === '全部' ? '#667eea' : 'white'};
                color: ${cat === '全部' ? 'white' : '#666'};
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
            `;
            filterBtn.addEventListener('click', () => {
                filterBar.querySelectorAll('button').forEach(b => {
                    b.style.background = 'white';
                    b.style.color = '#666';
                });
                filterBtn.style.background = '#667eea';
                filterBtn.style.color = 'white';
                this.filterSelectionItems(modal, searchInput.value, cat);
            });
            filterBar.appendChild(filterBtn);
        });

        // 选项列表
        const optionsList = document.createElement('div');
        optionsList.className = 'selection-options';
        optionsList.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 10px 20px;
        `;

        content.appendChild(header);
        content.appendChild(searchBox);
        content.appendChild(filterBar);
        content.appendChild(optionsList);
        modal.appendChild(content);

        document.body.appendChild(modal);

        // 初始化选项
        this.renderSelectionOptions(optionsList, panelIndex);

        // 搜索功能
        searchInput.addEventListener('input', () => {
            this.filterSelectionItems(modal, searchInput.value);
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * 渲染选择选项
     */
    renderSelectionOptions(container, panelIndex) {
        const nodes = Array.from(this.app.dataService.nodes.values())
            .filter(n => n.name && n.summary)
            .sort((a, b) => (b.metadata?.importance || 0) - (a.metadata?.importance || 0))
            .slice(0, 50);

        container.innerHTML = '';

        nodes.forEach(node => {
            const item = document.createElement('div');
            item.className = 'selection-item';
            item.style.cssText = `
                padding: 12px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background 0.2s;
                border: 1px solid transparent;
            `;
            item.innerHTML = `
                <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${this.getCategoryColor(node)};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                ">${node.name.charAt(0)}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 500; color: #333; margin-bottom: 2px;">${node.name}</div>
                    <div style="font-size: 12px; color: #999; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${node.summary?.substring(0, 60)}...
                    </div>
                </div>
                <div style="font-size: 11px; color: #999; padding: 3px 8px; background: #f0f0f0; border-radius: 10px;">
                    ${node.time?.displayDate || '未知'}
                </div>
            `;

            item.addEventListener('mouseenter', () => {
                item.style.background = '#f8f9ff';
                item.style.borderColor = '#667eea';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
                item.style.borderColor = 'transparent';
            });
            item.addEventListener('click', () => {
                this.selectItem(panelIndex, node);
                document.querySelector('.selection-modal')?.remove();
            });

            container.appendChild(item);
        });
    }

    /**
     * 过滤选择项目
     */
    filterSelectionItems(modal, query, category = null) {
        const container = modal.querySelector('.selection-options');
        const items = container.querySelectorAll('.selection-item');

        items.forEach(item => {
            const name = item.querySelector('.selection-item div:nth-child(2) div:first-child')?.textContent.toLowerCase() || '';
            const matchesQuery = name.includes(query.toLowerCase());
            // 简化分类过滤逻辑
            const matchesCategory = !category || category === '全部';
            item.style.display = matchesQuery && matchesCategory ? 'flex' : 'none';
        });
    }

    /**
     * 选择项目
     */
    selectItem(panelIndex, node) {
        this.selectedItems[panelIndex] = node;
        this.renderItemPanel(panelIndex, node);

        if (this.selectedItems[0] && this.selectedItems[1]) {
            this.generateComparison();
            this.renderRadarChart();
        }
    }

    /**
     * 渲染项目面板
     */
    renderItemPanel(index, node) {
        const placeholder = this.container.querySelector(`.item-placeholder-${index}`);
        const content = this.container.querySelector(`.item-content-${index}`);

        if (placeholder) placeholder.style.display = 'none';
        if (content) {
            content.style.display = 'flex';
            content.style.flexDirection = 'column';
            content.style.flex = '1';

            const period = this.getPeriodForYear(node.time?.year);
            const categoryName = this.getCategoryName(node.category?.primary);

            content.innerHTML = `
                <div style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: ${this.getCategoryColor(node)};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 24px;
                    margin: 0 auto 15px;
                ">${node.name.charAt(0)}</div>

                <h3 style="margin: 0 0 10px 0; text-align: center; color: #333; font-size: 18px;">
                    ${node.name}
                </h3>

                <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 15px; flex-wrap: wrap;">
                    <span style="padding: 4px 10px; background: #667eea; color: white; border-radius: 12px; font-size: 11px;">
                        ${node.time?.displayDate || '未知时间'}
                    </span>
                    ${period ? `
                        <span style="padding: 4px 10px; background: ${period.color}; color: white; border-radius: 12px; font-size: 11px;">
                            ${period.name}
                        </span>
                    ` : ''}
                    <span style="padding: 4px 10px; background: #f0f0f0; color: #666; border-radius: 12px; font-size: 11px;">
                        ${categoryName}
                    </span>
                </div>

                <p style="color: #666; line-height: 1.6; margin-bottom: 20px; font-size: 13px;">
                    ${node.summary || node.description || ''}
                </p>

                <div class="item-dimensions" style="
                    margin-top: auto;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                ">
                    <div style="font-weight: 500; margin-bottom: 10px; font-size: 13px; color: #333;">
                        维度评分
                    </div>
                    ${this.renderDimensionBars(node, index)}
                </div>

                <button onclick="window.app?.showView('tree3d', { nodeId: '${node.id}' })" style="
                    margin-top: 15px;
                    padding: 10px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                ">查看详情</button>
            `;
        }
    }

    /**
     * 渲染维度条
     */
    renderDimensionBars(node, panelIndex) {
        const scores = this.calculateDimensionScores(node);

        return this.dimensions.map(dim => {
            const score = scores[dim.id] || 50;
            const color = panelIndex === 0 ? '#667eea' : '#764ba2';

            return `
                <div style="margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                        <span style="color: #666;">${dim.name}</span>
                        <span style="color: ${color}; font-weight: 500;">${score}</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 6px;
                        background: #f0f0f0;
                        border-radius: 3px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${score}%;
                            height: 100%;
                            background: ${color};
                            border-radius: 3px;
                            transition: width 0.5s ease;
                        "></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * 计算维度得分
     */
    calculateDimensionScores(node) {
        const importance = node.metadata?.importance || 3;
        const year = node.time?.year || 0;

        return {
            influence: Math.min(100, (importance / 5) * 80 + 20),
            duration: Math.min(100, Math.random() * 60 + 20),
            scope: Math.min(100, (node.category?.primary === 'politics' ? 80 : 60) + Math.random() * 20),
            innovation: Math.min(100, (node.category?.primary === 'technology' ? 85 : 50) + Math.random() * 30),
            legacy: Math.min(100, Math.abs(year) < 500 ? 70 : 50 + Math.random() * 30)
        };
    }

    /**
     * 生成对比数据
     */
    generateComparison() {
        if (!this.selectedItems[0] || !this.selectedItems[1]) return;

        const [item1, item2] = this.selectedItems;
        const scores1 = this.calculateDimensionScores(item1);
        const scores2 = this.calculateDimensionScores(item2);

        this.comparisonData = {
            items: [item1, item2],
            scores: [scores1, scores2],
            similarity: this.calculateSimilarity(item1, item2),
            commonalities: this.findCommonalities(item1, item2),
            differences: this.findDifferences(item1, item2)
        };

        this.renderComparisonDetails();
    }

    /**
     * 计算相似度
     */
    calculateSimilarity(item1, item2) {
        let score = 0;
        let factors = 0;

        // 同时期
        const yearDiff = Math.abs((item1.time?.year || 0) - (item2.time?.year || 0));
        if (yearDiff < 50) { score += 30; factors++; }
        else if (yearDiff < 200) { score += 15; factors++; }

        // 同分类
        if (item1.category?.primary === item2.category?.primary) {
            score += 25;
            factors++;
        }

        // 同地点
        if (item1.location?.name === item2.location?.name) {
            score += 20;
            factors++;
        }

        // 同时期
        const period1 = this.getPeriodForYear(item1.time?.year);
        const period2 = this.getPeriodForYear(item2.time?.year);
        if (period1 && period1 === period2) {
            score += 25;
            factors++;
        }

        return Math.min(100, score + (factors > 0 ? 10 : 0));
    }

    /**
     * 找出共同点
     */
    findCommonalities(item1, item2) {
        const commonalities = [];

        if (item1.category?.primary === item2.category?.primary) {
            commonalities.push(`都属于${this.getCategoryName(item1.category.primary)}领域`);
        }

        const period1 = this.getPeriodForYear(item1.time?.year);
        const period2 = this.getPeriodForYear(item2.time?.year);
        if (period1 && period1 === period2) {
            commonalities.push(`都处于${period1.name}时期`);
        }

        if (item1.location?.name === item2.location?.name && item1.location?.name) {
            commonalities.push(`都发生在${item1.location.name}`);
        }

        if ((item1.metadata?.importance || 0) >= 4 && (item2.metadata?.importance || 0) >= 4) {
            commonalities.push('都具有较高的历史重要性');
        }

        return commonalities.length > 0 ? commonalities : ['同为中国历史的重要组成部分'];
    }

    /**
     * 找出不同点
     */
    findDifferences(item1, item2) {
        const differences = [];

        if (item1.category?.primary !== item2.category?.primary) {
            differences.push(`分属不同领域：${this.getCategoryName(item1.category?.primary)} vs ${this.getCategoryName(item2.category?.primary)}`);
        }

        const year1 = item1.time?.year || 0;
        const year2 = item2.time?.year || 0;
        const yearDiff = Math.abs(year1 - year2);
        if (yearDiff > 100) {
            differences.push(`时间跨度较大：相差${yearDiff}年`);
        }

        const importance1 = item1.metadata?.importance || 3;
        const importance2 = item2.metadata?.importance || 3;
        if (Math.abs(importance1 - importance2) >= 2) {
            differences.push(`历史重要性程度不同`);
        }

        return differences;
    }

    /**
     * 渲染对比详情
     */
    renderComparisonDetails() {
        if (!this.comparisonData) return;

        const panel = this.container.querySelector('.radar-panel');
        if (!panel) return;

        // 移除旧的分析区域
        const oldAnalysis = panel.querySelector('.comparison-analysis');
        if (oldAnalysis) oldAnalysis.remove();

        const analysis = document.createElement('div');
        analysis.className = 'comparison-analysis';
        analysis.style.cssText = `
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        `;

        const similarity = this.comparisonData.similarity;
        let similarityText, similarityColor;
        if (similarity >= 70) {
            similarityText = '高度相似';
            similarityColor = '#4caf50';
        } else if (similarity >= 40) {
            similarityText = '部分相似';
            similarityColor = '#ff9800';
        } else {
            similarityText = '差异较大';
            similarityColor = '#f44336';
        }

        analysis.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="font-size: 12px; color: #999;">相似度</div>
                <div style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 4px solid ${similarityColor};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 8px auto;
                    font-size: 20px;
                    font-weight: bold;
                    color: ${similarityColor};
                ">${similarity}%</div>
                <div style="font-size: 12px; color: ${similarityColor};">${similarityText}</div>
            </div>

            <div style="margin-bottom: 12px;">
                <div style="font-size: 12px; font-weight: 500; margin-bottom: 5px; color: #4caf50;">
                    ✓ 共同点
                </div>
                ${this.comparisonData.commonalities.map(c => `
                    <div style="font-size: 11px; color: #666; padding: 3px 0; padding-left: 10px;">
                        • ${c}
                    </div>
                `).join('')}
            </div>

            <div>
                <div style="font-size: 12px; font-weight: 500; margin-bottom: 5px; color: #f44336;">
                    ✗ 不同点
                </div>
                ${this.comparisonData.differences.map(d => `
                    <div style="font-size: 11px; color: #666; padding: 3px 0; padding-left: 10px;">
                        • ${d}
                    </div>
                `).join('')}
            </div>
        `;

        panel.appendChild(analysis);
    }

    /**
     * 渲染雷达图
     */
    renderRadarChart() {
        const canvas = document.getElementById('radar-chart');
        if (!canvas || !this.comparisonData) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 50;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制背景网格
        const levels = 5;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        for (let i = levels; i > 0; i--) {
            ctx.beginPath();
            const r = (radius / levels) * i;
            for (let j = 0; j < this.dimensions.length; j++) {
                const angle = (Math.PI * 2 * j) / this.dimensions.length - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // 绘制轴线和标签
        this.dimensions.forEach((dim, i) => {
            const angle = (Math.PI * 2 * i) / this.dimensions.length - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            // 轴线
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#e0e0e0';
            ctx.stroke();

            // 标签
            const labelX = centerX + (radius + 25) * Math.cos(angle);
            const labelY = centerY + (radius + 25) * Math.sin(angle);
            ctx.fillStyle = '#666';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(dim.name, labelX, labelY);
        });

        // 绘制数据区域
        const colors = ['#667eea', '#764ba2'];

        this.comparisonData.scores.forEach((scores, index) => {
            ctx.beginPath();
            this.dimensions.forEach((dim, i) => {
                const value = scores[dim.id] || 50;
                const r = (radius * value) / 100;
                const angle = (Math.PI * 2 * i) / this.dimensions.length - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fillStyle = colors[index] + '40';
            ctx.fill();
            ctx.strokeStyle = colors[index];
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // 绘制数据点
        this.comparisonData.scores.forEach((scores, index) => {
            ctx.fillStyle = colors[index];
            this.dimensions.forEach((dim, i) => {
                const value = scores[dim.id] || 50;
                const r = (radius * value) / 100;
                const angle = (Math.PI * 2 * i) / this.dimensions.length - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);

                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        // 更新图例
        const legend = this.container.querySelector('.radar-legend');
        if (legend) {
            legend.innerHTML = `
                <div style="display: flex; align-items: center; gap: 5px;">
                    <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%;"></div>
                    <span>${this.selectedItems[0]?.name || '项目1'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <div style="width: 12px; height: 12px; background: #764ba2; border-radius: 50%;"></div>
                    <span>${this.selectedItems[1]?.name || '项目2'}</span>
                </div>
            `;
        }
    }

    /**
     * 交换项目
     */
    swapItems() {
        const temp = this.selectedItems[0];
        this.selectedItems[0] = this.selectedItems[1];
        this.selectedItems[1] = temp;

        if (this.selectedItems[0]) this.renderItemPanel(0, this.selectedItems[0]);
        if (this.selectedItems[1]) this.renderItemPanel(1, this.selectedItems[1]);

        if (this.selectedItems[0] && this.selectedItems[1]) {
            this.generateComparison();
            this.renderRadarChart();
        }
    }

    /**
     * 清空对比
     */
    clearComparison() {
        this.selectedItems = [null, null];
        this.comparisonData = null;

        [0, 1].forEach(index => {
            const placeholder = this.container.querySelector(`.item-placeholder-${index}`);
            const content = this.container.querySelector(`.item-content-${index}`);
            if (placeholder) placeholder.style.display = 'flex';
            if (content) {
                content.style.display = 'none';
                content.innerHTML = '';
            }
        });

        // 清除雷达图
        const canvas = document.getElementById('radar-chart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // 移除分析
        const analysis = this.container.querySelector('.comparison-analysis');
        if (analysis) analysis.remove();

        // 清除图例
        const legend = this.container.querySelector('.radar-legend');
        if (legend) legend.innerHTML = '';
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 监听节点选择事件
        const selectHandler = (node) => {
            if (!this.selectedItems[0]) {
                this.selectItem(0, node);
            } else if (!this.selectedItems[1]) {
                this.selectItem(1, node);
            }
        };
        this.app.eventBus.on('node:select', selectHandler);
        this.eventListeners.push({ event: 'node:select', handler: selectHandler });
    }

    /**
     * 移除事件监听
     */
    removeEventListeners() {
        this.eventListeners.forEach(({ event, handler }) => {
            this.app.eventBus.off(event, handler);
        });
        this.eventListeners = [];
    }

    /**
     * 创建按钮
     */
    createButton(text, onClick, bgColor = '#667eea') {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 10px 20px;
            background: ${bgColor};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: opacity 0.2s;
        `;
        btn.addEventListener('click', onClick);
        btn.addEventListener('mouseenter', () => btn.style.opacity = '0.8');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
        return btn;
    }

    /**
     * 辅助方法：获取分类颜色
     */
    getCategoryColor(node) {
        return ComparisonView.CATEGORY_COLORS[node.category?.primary] || ComparisonView.CATEGORY_COLORS.default;
    }

    /**
     * 辅助方法：获取分类名称
     */
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

    /**
     * 辅助方法：根据年份获取时期
     */
    getPeriodForYear(year) {
        const periods = [
            { name: '春秋', start: -770, end: -476, color: '#8B4513' },
            { name: '战国', start: -475, end: -221, color: '#DAA520' },
            { name: '秦汉', start: -221, end: 220, color: '#CD853F' },
            { name: '三国', start: 220, end: 280, color: '#BC8F8F' },
            { name: '唐宋', start: 618, end: 1279, color: '#4A90E2' },
            { name: '明清', start: 1368, end: 1911, color: '#E74C3C' },
            { name: '近现代', start: 1911, end: 2024, color: '#9B59B6' }
        ];
        return periods.find(p => year >= p.start && year <= p.end);
    }

    destroy() {
        this.hide();
        this.app.eventBus.emit('view:destroy', { view: 'comparison' });
    }
}

window.ComparisonView = ComparisonView;
