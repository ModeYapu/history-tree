/**
 * 时间轴事件详情面板
 * 显示选中历史事件的详细信息
 */

class TimelineEventDetail {
    constructor(timelineView) {
        this.timelineView = timelineView;
        this.container = null;
        this.currentEvent = null;
        this.isVisible = false;
        this.relatedEvents = [];
    }

    /**
     * 创建详情面板
     */
    create() {
        this.container = document.createElement('div');
        this.container.className = 'event-detail-panel';
        this.container.style.cssText = `
            position: absolute;
            right: -420px;
            top: 80px;
            bottom: 20px;
            width: 400px;
            background: linear-gradient(145deg, rgba(42, 33, 24, 0.98), rgba(26, 20, 16, 0.98));
            border: 1px solid rgba(212, 168, 83, 0.25);
            border-radius: 16px 0 0 16px;
            box-shadow: -8px 0 40px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(20px);
            z-index: 100;
            transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // 头部
        const header = this.createHeader();
        this.container.appendChild(header);

        // 内容区
        const content = this.createContent();
        this.container.appendChild(content);

        // 相关事件
        const related = this.createRelatedSection();
        this.container.appendChild(related);

        return this.container;
    }

    /**
     * 创建头部
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'detail-header';
        header.style.cssText = `
            padding: 20px;
            border-bottom: 1px solid rgba(212, 168, 83, 0.15);
            display: flex;
            align-items: flex-start;
            gap: 16px;
        `;

        // 年代徽章
        const yearBadge = document.createElement('div');
        yearBadge.className = 'year-badge';
        yearBadge.style.cssText = `
            flex-shrink: 0;
            width: 70px;
            height: 70px;
            border-radius: 12px;
            background: linear-gradient(145deg, rgba(212, 168, 83, 0.25), rgba(184, 134, 11, 0.15));
            border: 1px solid rgba(212, 168, 83, 0.3);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;

        const yearLabel = document.createElement('span');
        yearLabel.className = 'year-label';
        yearLabel.textContent = '年代';
        yearLabel.style.cssText = `
            font-size: 10px;
            color: #C9A96E;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;

        const yearValue = document.createElement('span');
        yearValue.className = 'year-value';
        yearValue.textContent = '前221';
        yearValue.style.cssText = `
            font-size: 20px;
            font-weight: 700;
            color: #F0D68A;
        `;

        yearBadge.appendChild(yearLabel);
        yearBadge.appendChild(yearValue);

        // 标题区域
        const titleSection = document.createElement('div');
        titleSection.style.cssText = 'flex: 1; min-width: 0;';

        const title = document.createElement('h2');
        title.className = 'event-title';
        title.textContent = '秦统一六国';
        title.style.cssText = `
            font-size: 20px;
            color: #F0D68A;
            margin: 0 0 8px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;

        const meta = document.createElement('div');
        meta.className = 'event-meta';
        meta.style.cssText = `
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        `;

        const categoryTag = this.createTag('政治', 'politics');
        const importanceTag = this.createTag('重要', 'importance');

        meta.appendChild(categoryTag);
        meta.appendChild(importanceTag);
        titleSection.appendChild(title);
        titleSection.appendChild(meta);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            color: #C9A96E;
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            transition: color 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.color = '#F0D68A';
        closeBtn.onmouseout = () => closeBtn.style.color = '#C9A96E';
        closeBtn.onclick = () => this.hide();

        header.appendChild(yearBadge);
        header.appendChild(titleSection);
        header.appendChild(closeBtn);

        return header;
    }

    /**
     * 创建标签
     */
    createTag(text, type) {
        const tag = document.createElement('span');
        tag.className = `event-tag event-tag-${type}`;
        tag.textContent = text;

        const colors = {
            politics: 'rgba(255, 107, 107, 0.2)',
            technology: 'rgba(78, 205, 196, 0.2)',
            culture: 'rgba(168, 85, 247, 0.2)',
            economy: 'rgba(34, 197, 94, 0.2)',
            military: 'rgba(249, 115, 22, 0.2)',
            importance: 'rgba(212, 168, 83, 0.2)'
        };

        tag.style.cssText = `
            padding: 4px 10px;
            background: ${colors[type] || colors.importance};
            border: 1px solid ${colors[type] ? colors[type].replace('0.2', '0.3') : 'rgba(212, 168, 83, 0.3)'};
            border-radius: 4px;
            font-size: 11px;
            color: #FFF5E0;
        `;

        return tag;
    }

    /**
     * 创建内容区
     */
    createContent() {
        const content = document.createElement('div');
        content.className = 'detail-content';
        content.style.cssText = `
            padding: 20px;
            flex: 1;
            overflow-y: auto;
        `;

        // 描述
        const descSection = document.createElement('div');
        descSection.className = 'description-section';
        descSection.style.cssText = 'margin-bottom: 20px;';

        const descLabel = document.createElement('h4');
        descLabel.textContent = '📜 事件描述';
        descLabel.style.cssText = `
            font-size: 14px;
            color: #C9A96E;
            margin-bottom: 10px;
        `;

        const descText = document.createElement('p');
        descText.className = 'event-description';
        descText.textContent = '秦始皇统一六国，建立了中国历史上第一个统一的中央集权封建帝国。';
        descText.style.cssText = `
            font-size: 14px;
            color: #FFF5E0;
            line-height: 1.8;
            margin: 0;
        `;

        descSection.appendChild(descLabel);
        descSection.appendChild(descText);

        // 详细信息
        const infoSection = document.createElement('div');
        infoSection.className = 'info-section';
        infoSection.style.cssText = 'margin-bottom: 20px;';

        const infoLabel = document.createElement('h4');
        infoLabel.textContent = '📊 详细信息';
        infoLabel.style.cssText = `
            font-size: 14px;
            color: #C9A96E;
            margin-bottom: 10px;
        `;

        const infoList = document.createElement('dl');
        infoList.className = 'info-list';
        infoList.style.cssText = `
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 8px 16px;
            font-size: 13px;
        `;

        const addInfo = (label, value) => {
            const dt = document.createElement('dt');
            dt.textContent = label;
            dt.style.cssText = 'color: #A8916B;';

            const dd = document.createElement('dd');
            dd.textContent = value;
            dd.style.cssText = 'color: #FFF5E0; margin: 0;';

            infoList.appendChild(dt);
            infoList.appendChild(dd);
        };

        addInfo('地点', '咸阳');
        addInfo('类别', '政治事件');
        addInfo('重要性', '⭐⭐⭐⭐⭐');
        addInfo('相关人物', '秦始皇、李斯、王翦');

        infoSection.appendChild(infoLabel);
        infoSection.appendChild(infoList);

        content.appendChild(descSection);
        content.appendChild(infoSection);

        return content;
    }

    /**
     * 创建相关事件区
     */
    createRelatedSection() {
        const section = document.createElement('div');
        section.className = 'related-events-section';
        section.style.cssText = `
            padding: 16px 20px;
            border-top: 1px solid rgba(212, 168, 83, 0.15);
            background: rgba(0, 0, 0, 0.2);
        `;

        const label = document.createElement('h4');
        label.textContent = '🔗 相关事件';
        label.style.cssText = `
            font-size: 13px;
            color: #C9A96E;
            margin-bottom: 12px;
        `;

        const list = document.createElement('div');
        list.className = 'related-list';
        list.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        section.appendChild(label);
        section.appendChild(list);

        return section;
    }

    /**
     * 显示事件详情
     */
    show(eventData) {
        if (!this.container) {
            this.container = this.create();
            this.timelineView.container.appendChild(this.container);
        }

        this.currentEvent = eventData;
        this.updateContent(eventData);

        this.container.style.right = '0';
        this.isVisible = true;

        // 添加显示动画
        this.container.classList.add('slide-in-right');
    }

    /**
     * 隐藏详情面板
     */
    hide() {
        if (!this.container) return;

        this.container.style.right = '-420px';
        this.isVisible = false;
        this.currentEvent = null;
    }

    /**
     * 更新内容
     */
    updateContent(event) {
        // 更新年份
        const yearValue = this.container.querySelector('.year-value');
        if (yearValue) {
            yearValue.textContent = this.formatYear(event.year || event.time?.year);
        }

        // 更新标题
        const title = this.container.querySelector('.event-title');
        if (title) {
            title.textContent = event.name || '';
        }

        // 更新描述
        const desc = this.container.querySelector('.event-description');
        if (desc) {
            desc.textContent = event.description || '';
        }

        // 更新相关事件
        this.updateRelatedEvents(event);
    }

    /**
     * 更新相关事件
     */
    updateRelatedEvents(event) {
        const list = this.container.querySelector('.related-list');
        if (!list) return;

        list.innerHTML = '';

        // 查找相关事件
        const related = this.findRelatedEvents(event);

        related.forEach((relatedEvent, index) => {
            const item = document.createElement('div');
            item.className = 'related-item';
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: rgba(212, 168, 83, 0.05);
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
                animation: fadeIn 0.3s ease forwards;
                animation-delay: ${index * 0.05}s;
                opacity: 0;
            `;

            item.onmouseover = () => item.style.background = 'rgba(212, 168, 83, 0.1)';
            item.onmouseout = () => item.style.background = 'rgba(212, 168, 83, 0.05)';
            item.onclick = () => this.show(relatedEvent);

            const yearBadge = document.createElement('span');
            yearBadge.textContent = this.formatYear(relatedEvent.year);
            yearBadge.style.cssText = `
                font-size: 11px;
                color: #C9A96E;
                background: rgba(212, 168, 83, 0.15);
                padding: 2px 6px;
                border-radius: 4px;
                flex-shrink: 0;
            `;

            const name = document.createElement('span');
            name.textContent = relatedEvent.name;
            name.style.cssText = `
                font-size: 13px;
                color: #FFF5E0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;

            item.appendChild(yearBadge);
            item.appendChild(name);
            list.appendChild(item);
        });
    }

    /**
     * 查找相关事件
     */
    findRelatedEvents(event) {
        const related = [];
        const eventYear = event.year || event.time?.year || 0;

        // 从数据服务中获取
        if (this.timelineView.app && this.timelineView.app.dataService) {
            const allNodes = Array.from(this.timelineView.app.dataService.nodes.values());

            // 同时期事件（±50年）
            const samePeriod = allNodes.filter(node => {
                const nodeYear = node.year || node.time?.year || 0;
                return Math.abs(nodeYear - eventYear) <= 50 && node.id !== event.id;
            }).slice(0, 5);

            related.push(...samePeriod.map(node => ({
                id: node.id,
                name: node.name,
                year: node.year || node.time?.year,
                description: node.description
            })));
        }

        return related.slice(0, 5);
    }

    /**
     * 格式化年份
     */
    formatYear(year) {
        if (year === undefined || year === null) return '?';
        if (year < 0) return `前${Math.abs(year)}年`;
        if (year > 2000) return `${year}年`;
        return `${year}年`;
    }

    /**
     * 切换显示
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            // 需要传入事件数据
            console.warn('需要传入事件数据来显示详情');
        }
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
window.TimelineEventDetail = TimelineEventDetail;
