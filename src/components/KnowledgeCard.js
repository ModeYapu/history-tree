/**
 * 知识卡片组件
 * 展示历史知识点的卡片式学习工具
 */

class KnowledgeCard {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.cards = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.isStudyMode = false;

        // 卡片分类
        this.categories = [
            { id: 'famous', name: '名人传记', icon: '👤', color: '#D4A853' },
            { id: 'events', name: '重大事件', icon: '📜', color: '#4A90B8' },
            { id: 'culture', name: '文化艺术', icon: '🎨', color: '#8E6BA8' },
            { id: 'science', name: '科技发明', icon: '⚙️', color: '#5A8F5A' },
            { id: 'military', name: '战争军事', icon: '⚔️', color: '#C97B2A' }
        ];

        this.currentCategory = 'all';
    }

    /**
     * 初始化
     */
    init() {
        this.generateCards();
        console.log('📚 Knowledge Card initialized');
    }

    /**
     * 生成知识卡片
     */
    generateCards() {
        this.cards = [];

        if (!this.app || !this.app.dataService) {
            console.warn('DataService not available');
            return;
        }

        const nodes = Array.from(this.app.dataService.nodes.values());

        nodes.forEach(node => {
            const card = {
                id: node.id,
                type: node.type,
                category: node.category?.primary || 'other',
                front: {
                    title: node.name,
                    hint: this.getHint(node),
                    icon: this.getIcon(node),
                    year: node.time?.displayDate || ''
                },
                back: {
                    description: node.description || node.summary || '',
                    location: node.location?.name || '',
                    tags: node.category?.tags || [],
                    related: this.getRelatedInfo(node)
                }
            };

            this.cards.push(card);
        });
    }

    /**
     * 获取提示信息
     */
    getHint(node) {
        const hints = {
            person: `这位人物生活在${node.time?.period || '历史'}`,
            event: `发生于${node.location?.name || '某地'}`,
            period: '历史时期',
            other: '历史知识点'
        };
        return hints[node.type] || hints.other;
    }

    /**
     * 获取图标
     */
    getIcon(node) {
        const icons = {
            person: '👤',
            event: '📜',
            period: '📅',
            technology: '⚙️',
            culture: '🎨',
            politics: '🏛️',
            military: '⚔️',
            economy: '💰'
        };
        return icons[node.category?.primary] || icons[node.type] || '📚';
    }

    /**
     * 获取相关信息
     */
    getRelatedInfo(node) {
        const info = [];

        if (node.relations) {
            Object.entries(node.relations).forEach(([type, ids]) => {
                if (Array.isArray(ids) && ids.length > 0) {
                    info.push({ type, count: ids.length });
                }
            });
        }

        return info;
    }

    /**
     * 创建界面
     */
    createUI() {
        this.container = document.createElement('div');
        this.container.className = 'knowledge-card-overlay';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const mainPanel = document.createElement('div');
        mainPanel.className = 'knowledge-card-main';
        mainPanel.style.cssText = `
            width: 90%;
            max-width: 1000px;
            height: 85vh;
            background: linear-gradient(145deg, rgba(42, 33, 24, 0.98), rgba(26, 20, 16, 0.98));
            border: 1px solid rgba(212, 168, 83, 0.3);
            border-radius: 20px;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // 头部
        const header = this.createHeader();
        mainPanel.appendChild(header);

        // 内容区
        const content = this.createContent();
        mainPanel.appendChild(content);

        this.container.appendChild(mainPanel);

        // 点击遮罩关闭
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });

        document.body.appendChild(this.container);
    }

    /**
     * 创建头部
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'card-header';
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(212, 168, 83, 0.15);
        `;

        // 左侧标题
        const leftSection = document.createElement('div');
        leftSection.style.cssText = 'display: flex; align-items: center; gap: 16px;';

        const icon = document.createElement('span');
        icon.textContent = '📚';
        icon.style.cssText = 'font-size: 28px;';

        const title = document.createElement('h2');
        title.textContent = '知识卡片';
        title.style.cssText = `
            font-size: 20px;
            color: #F0D68A;
            margin: 0;
        `;

        leftSection.appendChild(icon);
        leftSection.appendChild(title);

        // 分类选择器
        const categorySelector = this.createCategorySelector();

        // 右侧控制
        const rightSection = document.createElement('div');
        rightSection.style.cssText = 'display: flex; align-items: center; gap: 12px;';

        const modeToggle = this.createModeToggle();
        const closeBtn = this.createCloseButton();

        rightSection.appendChild(modeToggle);
        rightSection.appendChild(closeBtn);

        header.appendChild(leftSection);
        header.appendChild(categorySelector);
        header.appendChild(rightSection);

        return header;
    }

    /**
     * 创建分类选择器
     */
    createCategorySelector() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 8px;';

        // 全部按钮
        const allBtn = this.createCategoryButton('全部', 'all', '#D4A853');
        container.appendChild(allBtn);

        // 分类按钮
        this.categories.forEach(cat => {
            const btn = this.createCategoryButton(cat.name, cat.id, cat.color, cat.icon);
            container.appendChild(btn);
        });

        return container;
    }

    /**
     * 创建分类按钮
     */
    createCategoryButton(name, id, color, icon = '') {
        const btn = document.createElement('button');
        btn.className = `category-btn category-btn-${id}`;
        btn.innerHTML = `${icon}<span>${name}</span>`;
        btn.dataset.category = id;
        btn.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(212, 168, 83, 0.2);
            border-radius: 8px;
            color: #C9A96E;
            font-size: 13px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
            transition: all 0.2s;
        `;

        btn.addEventListener('click', () => {
            this.filterByCategory(id);
            this.updateCategoryButtons(id);
        });

        btn.addEventListener('mouseover', () => {
            if (btn.dataset.category !== this.currentCategory) {
                btn.style.background = 'rgba(212, 168, 83, 0.1)';
            }
        });

        btn.addEventListener('mouseout', () => {
            if (btn.dataset.category !== this.currentCategory) {
                btn.style.background = 'rgba(255, 255, 255, 0.05)';
            }
        });

        return btn;
    }

    /**
     * 更新分类按钮状态
     */
    updateCategoryButtons(activeId) {
        this.currentCategory = activeId;
        const buttons = this.container.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            if (btn.dataset.category === activeId) {
                btn.style.background = 'rgba(212, 168, 83, 0.25)';
                btn.style.borderColor = 'rgba(212, 168, 83, 0.5)';
                btn.style.color = '#F0D68A';
            } else {
                btn.style.background = 'rgba(255, 255, 255, 0.05)';
                btn.style.borderColor = 'rgba(212, 168, 83, 0.2)';
                btn.style.color = '#C9A96E';
            }
        });
    }

    /**
     * 创建模式切换按钮
     */
    createModeToggle() {
        const btn = document.createElement('button');
        btn.className = 'mode-toggle-btn';
        btn.innerHTML = `
            <span class="mode-icon">🎯</span>
            <span class="mode-text">学习模式</span>
        `;
        btn.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: rgba(74, 144, 184, 0.15);
            border: 1px solid rgba(74, 144, 184, 0.3);
            border-radius: 8px;
            color: #4A90B8;
            font-size: 13px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
            transition: all 0.2s;
        `;

        btn.addEventListener('click', () => this.toggleMode());

        return btn;
    }

    /**
     * 创建关闭按钮
     */
    createCloseButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '✕';
        btn.style.cssText = `
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(212, 168, 83, 0.2);
            color: #C9A96E;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s;
        `;

        btn.addEventListener('click', () => this.hide());
        btn.addEventListener('mouseover', () => {
            btn.style.background = 'rgba(212, 168, 83, 0.15)';
            btn.style.borderColor = 'rgba(212, 168, 83, 0.4)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = 'rgba(255, 255, 255, 0.05)';
            btn.style.borderColor = 'rgba(212, 168, 83, 0.2)';
        });

        return btn;
    }

    /**
     * 创建内容区
     */
    createContent() {
        const content = document.createElement('div');
        content.className = 'card-content';
        content.style.cssText = `
            flex: 1;
            display: flex;
            overflow: hidden;
        `;

        // 卡片区
        const cardArea = this.createCardArea();
        content.appendChild(cardArea);

        // 侧边栏（卡片列表）
        const sidebar = this.createSidebar();
        content.appendChild(sidebar);

        return content;
    }

    /**
     * 创建卡片展示区
     */
    createCardArea() {
        const area = document.createElement('div');
        area.className = 'card-area';
        area.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            position: relative;
        `;

        // 卡片容器（翻转效果）
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.style.cssText = `
            width: 100%;
            max-width: 500px;
            aspect-ratio: 3/2;
            perspective: 1000px;
            cursor: pointer;
        `;

        // 卡片
        const card = document.createElement('div');
        card.className = 'knowledge-card';
        card.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        // 卡片正面
        const front = this.createCardFront();
        card.appendChild(front);

        // 卡片背面
        const back = this.createCardBack();
        card.appendChild(back);

        cardContainer.appendChild(card);
        area.appendChild(cardContainer);

        // 导航控制
        const nav = this.createNavigation();
        area.appendChild(nav);

        this.cardElement = card;

        return area;
    }

    /**
     * 创建卡片正面
     */
    createCardFront() {
        const front = document.createElement('div');
        front.className = 'card-front';
        front.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            background: linear-gradient(145deg, rgba(212, 168, 83, 0.1), rgba(184, 134, 11, 0.05));
            border: 2px solid rgba(212, 168, 83, 0.3);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;

        const icon = document.createElement('div');
        icon.className = 'card-icon';
        icon.textContent = '📚';
        icon.style.cssText = `
            font-size: 64px;
            margin-bottom: 20px;
        `;

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = '点击开始学习';
        title.style.cssText = `
            font-size: 24px;
            color: #F0D68A;
            margin: 0 0 12px 0;
        `;

        const hint = document.createElement('p');
        hint.className = 'card-hint';
        hint.textContent = '点击卡片翻转查看答案';
        hint.style.cssText = `
            font-size: 14px;
            color: #A8916B;
            margin: 0;
        `;

        front.appendChild(icon);
        front.appendChild(title);
        front.appendChild(hint);

        return front;
    }

    /**
     * 创建卡片背面
     */
    createCardBack() {
        const back = document.createElement('div');
        back.className = 'card-back';
        back.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            background: linear-gradient(145deg, rgba(42, 33, 24, 0.98), rgba(26, 20, 16, 0.98));
            border: 2px solid rgba(212, 168, 83, 0.4);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            padding: 30px;
            transform: rotateY(180deg);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
        `;

        const content = document.createElement('div');
        content.className = 'card-back-content';
        content.innerHTML = `
            <div style="font-size: 13px; color: #C9A96E; margin-bottom: 8px;">知识点详情</div>
            <div style="font-size: 16px; color: #FFF5E0; line-height: 1.8;">
                点击左侧列表选择卡片开始学习
            </div>
        `;

        back.appendChild(content);

        return back;
    }

    /**
     * 创建导航控制
     */
    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'card-navigation';
        nav.style.cssText = `
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 24px;
        `;

        // 上一张按钮
        const prevBtn = this.createNavButton('← 上一张', () => this.previousCard());

        // 进度指示器
        const progress = document.createElement('div');
        progress.className = 'card-progress';
        progress.style.cssText = `
            font-size: 14px;
            color: #C9A96E;
        `;
        progress.textContent = '0 / 0';

        // 下一张按钮
        const nextBtn = this.createNavButton('下一张 →', () => this.nextCard());

        nav.appendChild(prevBtn);
        nav.appendChild(progress);
        nav.appendChild(nextBtn);

        this.progressElement = progress;

        return nav;
    }

    /**
     * 创建导航按钮
     */
    createNavButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 10px 20px;
            background: rgba(212, 168, 83, 0.15);
            border: 1px solid rgba(212, 168, 83, 0.3);
            border-radius: 8px;
            color: #F0D68A;
            font-size: 14px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
            transition: all 0.2s;
        `;

        btn.addEventListener('click', onClick);
        btn.addEventListener('mouseover', () => {
            btn.style.background = 'rgba(212, 168, 83, 0.3)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = 'rgba(212, 168, 83, 0.15)';
        });

        return btn;
    }

    /**
     * 创建侧边栏
     */
    createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = 'card-sidebar';
        sidebar.style.cssText = `
            width: 280px;
            border-left: 1px solid rgba(212, 168, 83, 0.15);
            padding: 20px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.2);
        `;

        const title = document.createElement('h4');
        title.textContent = '📋 卡片列表';
        title.style.cssText = `
            font-size: 14px;
            color: #C9A96E;
            margin: 0 0 16px 0;
        `;

        const list = document.createElement('div');
        list.className = 'card-list';
        list.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        sidebar.appendChild(title);
        sidebar.appendChild(list);

        return sidebar;
    }

    /**
     * 按分类筛选
     */
    filterByCategory(category) {
        if (!this.container) return;

        const filtered = category === 'all'
            ? this.cards
            : this.cards.filter(card => card.category === category);

        this.updateCardList(filtered);
    }

    /**
     * 更新卡片列表
     */
    updateCardList(cards) {
        const list = this.container.querySelector('.card-list');
        if (!list) return;

        list.innerHTML = '';

        if (cards.length === 0) {
            list.innerHTML = '<div style="color: #A8916B; text-align: center; padding: 20px;">暂无卡片</div>';
            return;
        }

        cards.forEach((card, index) => {
            const item = document.createElement('div');
            item.className = 'card-list-item';
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                background: rgba(212, 168, 83, 0.05);
                border: 1px solid rgba(212, 168, 83, 0.1);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            `;

            item.innerHTML = `
                <span style="font-size: 20px;">${card.front.icon}</span>
                <span style="flex: 1; font-size: 13px; color: #FFF5E0;">${card.front.title}</span>
                ${card.front.year ? `<span style="font-size: 11px; color: #A8916B;">${card.front.year}</span>` : ''}
            `;

            item.addEventListener('click', () => this.showCard(index));
            item.addEventListener('mouseover', () => {
                item.style.background = 'rgba(212, 168, 83, 0.15)';
            });
            item.addEventListener('mouseout', () => {
                item.style.background = 'rgba(212, 168, 83, 0.05)';
            });

            list.appendChild(item);
        });
    }

    /**
     * 显示指定卡片
     */
    showCard(index) {
        this.currentIndex = index;
        this.updateCardDisplay();
    }

    /**
     * 更新卡片显示
     */
    updateCardDisplay() {
        const card = this.cards[this.currentIndex];
        if (!card) return;

        // 更新正面
        const frontIcon = this.container.querySelector('.card-icon');
        const frontTitle = this.container.querySelector('.card-title');
        const frontHint = this.container.querySelector('.card-hint');

        if (frontIcon) frontIcon.textContent = card.front.icon;
        if (frontTitle) frontTitle.textContent = card.front.title;
        if (frontHint) frontHint.textContent = card.front.hint;

        // 更新背面
        const backContent = this.container.querySelector('.card-back-content');
        if (backContent) {
            backContent.innerHTML = `
                <div style="font-size: 13px; color: #C9A96E; margin-bottom: 8px;">
                    ${card.front.year ? '📅 ' + card.front.year : ''}
                </div>
                <div style="font-size: 15px; color: #FFF5E0; line-height: 1.8; margin-bottom: 16px;">
                    ${card.back.description}
                </div>
                ${card.back.location ? `<div style="font-size: 12px; color: #A8916B;">📍 ${card.back.location}</div>` : ''}
                ${card.back.tags.length > 0 ? `
                    <div style="margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
                        ${card.back.tags.map(tag => `<span style="font-size: 11px; padding: 2px 8px; background: rgba(212, 168, 83, 0.1); border-radius: 4px; color: #C9A96E;">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            `;
        }

        // 更新进度
        if (this.progressElement) {
            this.progressElement.textContent = `${this.currentIndex + 1} / ${this.cards.length}`;
        }

        // 重置翻转状态
        this.isFlipped = false;
        this.updateCardFlip();
    }

    /**
     * 更新卡片翻转
     */
    updateCardFlip() {
        if (this.cardElement) {
            this.cardElement.style.transform = this.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
        }
    }

    /**
     * 翻转卡片
     */
    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.updateCardFlip();
    }

    /**
     * 上一张卡片
     */
    previousCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCardDisplay();
        }
    }

    /**
     * 下一张卡片
     */
    nextCard() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.updateCardDisplay();
        }
    }

    /**
     * 切换学习模式
     */
    toggleMode() {
        this.isStudyMode = !this.isStudyMode;

        const btn = this.container.querySelector('.mode-toggle-btn');
        if (btn) {
            const icon = btn.querySelector('.mode-icon');
            const text = btn.querySelector('.mode-text');

            if (this.isStudyMode) {
                icon.textContent = '📝';
                text.textContent = '答题模式';
                btn.style.background = 'rgba(155, 89, 182, 0.15)';
                btn.style.borderColor = 'rgba(155, 89, 182, 0.3)';
                btn.style.color = '#8E6BA8';
            } else {
                icon.textContent = '🎯';
                text.textContent = '学习模式';
                btn.style.background = 'rgba(74, 144, 184, 0.15)';
                btn.style.borderColor = 'rgba(74, 144, 184, 0.3)';
                btn.style.color = '#4A90B8';
            }
        }
    }

    /**
     * 显示界面
     */
    show() {
        if (!this.container) {
            this.createUI();
        }

        this.container.style.display = 'flex';
        setTimeout(() => {
            this.container.style.opacity = '1';
        }, 10);

        this.updateCardList(this.cards);
        if (this.cards.length > 0) {
            this.showCard(0);
        }

        // 绑定卡片点击翻转
        const cardContainer = this.container.querySelector('.card-container');
        if (cardContainer) {
            cardContainer.onclick = () => this.flipCard();
        }
    }

    /**
     * 隐藏界面
     */
    hide() {
        if (!this.container) return;

        this.container.style.opacity = '0';
        setTimeout(() => {
            if (this.container) {
                this.container.style.display = 'none';
            }
        }, 300);
    }

    /**
     * 销毁
     */
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}

// 导出到全局
window.KnowledgeCard = KnowledgeCard;
