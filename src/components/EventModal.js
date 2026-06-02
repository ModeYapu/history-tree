/**
 * 事件详情弹窗组件
 * 用于显示历史事件的详细信息
 */

class EventModal {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.overlay = null;
        this.modal = null;
        this.currentNode = null;
        this.isOpen = false;

        // 保存事件处理器引用，用于清理
        this._escHandler = null;
        this._closeBtnHandler = null;
        this._closeActionBtnHandler = null;
        this._exportBtnHandler = null;
        this._closeTimer = null;
        this._searchFigureTimer = null;
    }

    /**
     * 创建弹窗 DOM
     */
    createModal() {
        // 创建遮罩层
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // 创建弹窗主体
        this.modal = document.createElement('div');
        this.modal.className = 'event-modal';
        this.modal.style.cssText = `
            background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
            border: 1px solid var(--border-active);
            border-radius: 16px;
            box-shadow: var(--shadow-lg);
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0;
            position: relative;
        `;

        // 创建弹窗内容
        this.modal.innerHTML = `
            <div class="modal-header" style="
                padding: 24px 32px;
                border-bottom: 1px solid var(--border-subtle);
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
                z-index: 10;
            ">
                <div class="modal-title" style="display: flex; align-items: center; gap: 16px;">
                    <span class="modal-icon" style="font-size: 36px;"></span>
                    <div>
                        <h2 class="event-name" style="color: var(--text-secondary); font-size: 24px; margin: 0; font-weight: 700;"></h2>
                        <p class="event-time" style="color: var(--text-muted); font-size: 14px; margin: 4px 0 0 0;"></p>
                    </div>
                </div>
                <button class="close-btn" style="
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 28px;
                    cursor: pointer;
                    padding: 8px;
                    transition: all 0.2s;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                ">×</button>
            </div>

            <div class="modal-body" style="padding: 32px;">
                <div class="event-tags" style="margin-bottom: 24px; display: flex; gap: 8px; flex-wrap: wrap;"></div>

                <div class="event-summary" style="
                    background: rgba(212, 168, 83, 0.08);
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    border-left: 4px solid #D4A853;
                ">
                    <h3 style="color: var(--text-secondary); margin-bottom: 12px; font-size: 18px;">📝 简介</h3>
                    <p class="summary-text" style="color: var(--text-primary); line-height: 1.8; margin: 0;"></p>
                </div>

                <div class="event-details" style="margin-bottom: 24px;">
                    <h3 style="color: var(--text-secondary); margin-bottom: 16px; font-size: 18px;">📚 详细信息</h3>
                    <div class="detail-content" style="color: var(--text-primary); line-height: 1.8;"></div>
                </div>

                <div class="event-meta" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div class="meta-item" style="background: rgba(212, 168, 83, 0.08); padding: 16px; border-radius: 10px;">
                        <span style="color: var(--text-muted); font-size: 13px;">🏷️ 主要分类</span>
                        <div class="category-primary" style="color: var(--text-secondary); font-size: 16px; margin-top: 4px;"></div>
                    </div>
                    <div class="meta-item" style="background: rgba(212, 168, 83, 0.08); padding: 16px; border-radius: 10px;">
                        <span style="color: var(--text-muted); font-size: 13px;">📌 次要分类</span>
                        <div class="category-secondary" style="color: var(--text-secondary); font-size: 16px; margin-top: 4px;"></div>
                    </div>
                </div>

                <div class="event-location" style="margin-bottom: 24px;">
                    <h3 style="color: var(--text-secondary); margin-bottom: 16px; font-size: 18px;">📍 地理位置</h3>
                    <div class="location-content" style="color: var(--text-primary); line-height: 1.8;"></div>
                </div>

                <div class="event-figures" style="margin-bottom: 24px;">
                    <h3 style="color: var(--text-secondary); margin-bottom: 16px; font-size: 18px;">👤 相关人物</h3>
                    <div class="figures-list" style="display: flex; flex-wrap: wrap; gap: 12px;"></div>
                </div>

                <div class="event-significance" style="
                    background: linear-gradient(135deg, rgba(212, 168, 83, 0.1), rgba(139, 105, 20, 0.1));
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                ">
                    <h3 style="color: var(--text-secondary); margin-bottom: 12px; font-size: 18px;">⭐ 历史意义</h3>
                    <p class="significance-text" style="color: var(--text-primary); line-height: 1.8; margin: 0;"></p>
                </div>

                <div class="event-related" style="margin-bottom: 24px;">
                    <h3 style="color: var(--text-secondary); margin-bottom: 16px; font-size: 18px;">🔗 相关事件</h3>
                    <div class="related-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
                </div>

                <div class="event-sources" style="margin-bottom: 24px;">
                    <h3 style="color: var(--text-secondary); margin-bottom: 16px; font-size: 18px;">📖 参考来源</h3>
                    <div class="sources-list" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>
            </div>

            <div class="modal-footer" style="
                padding: 20px 32px;
                border-top: 1px solid rgba(212, 168, 83, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--bg-primary);
            ">
                <div class="event-id" style="color: var(--text-muted); font-size: 13px;"></div>
                <div class="modal-actions" style="display: flex; gap: 12px;">
                    <button class="action-btn export-btn" style="
                        background: rgba(212, 168, 83, 0.08);
                        border: 1px solid var(--border-subtle);
                        color: var(--text-secondary);
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.2s;
                    ">📥 导出</button>
                    <button class="action-btn close-action-btn" style="
                        background: transparent;
                        border: 1px solid rgba(201, 169, 110, 0.3);
                        color: var(--text-muted);
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.2s;
                    ">关闭</button>
                </div>
            </div>
        `;

        // 绑定事件 - 保存引用以便清理
        const closeBtn = this.modal.querySelector('.close-btn');
        this._closeBtnHandler = () => this.close();
        closeBtn.addEventListener('click', this._closeBtnHandler);

        const closeActionBtn = this.modal.querySelector('.close-action-btn');
        this._closeActionBtnHandler = () => this.close();
        closeActionBtn.addEventListener('click', this._closeActionBtnHandler);

        const exportBtn = this.modal.querySelector('.export-btn');
        this._exportBtnHandler = () => this.exportCurrentNode();
        exportBtn.addEventListener('click', this._exportBtnHandler);

        // ESC 键关闭
        this._escHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        document.addEventListener('keydown', this._escHandler);

        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);
    }

    /**
     * 显示弹窗
     */
    show(node) {
        if (!this.overlay) {
            this.createModal();
        }

        this.currentNode = node;
        this.populateContent(node);

        this.overlay.style.display = 'flex';
        this.modal.style.opacity = '1';
        this.modal.style.transform = 'scale(1) translateY(0)';
        this.isOpen = true;

        this.app.eventBus.emit('modal:open', { node });
    }

    /**
     * 填充弹窗内容
     */
    populateContent(node) {
        const modal = this.modal;

        // 基本信息
        modal.querySelector('.modal-icon').textContent = this.getEventIcon(node.type);
        modal.querySelector('.event-name').textContent = node.name || '未命名事件';
        modal.querySelector('.event-time').textContent = this.formatTime(node.time);
        modal.querySelector('.event-id').textContent = `ID: ${node.id}`;

        // 标签
        const tagsContainer = modal.querySelector('.event-tags');
        tagsContainer.innerHTML = '';
        const tags = [node.category?.primary, node.category?.secondary].filter(Boolean);
        tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.style.cssText = `
                background: ${this.getCategoryColor(tag)};
                color: white;
                padding: 6px 14px;
                border-radius: 14px;
                font-size: 13px;
                font-weight: 500;
            `;
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
        });

        // 简介
        modal.querySelector('.summary-text').textContent = node.summary || '暂无简介';

        // 详细信息
        const detailContent = modal.querySelector('.detail-content');
        detailContent.innerHTML = node.details ? this.formatDetails(node.details) : '<p style="color: var(--text-muted);">暂无详细信息</p>';

        // 分类信息
        modal.querySelector('.category-primary').textContent = node.category?.primary || '未分类';
        modal.querySelector('.category-secondary').textContent = node.category?.secondary || '-';

        // 地理位置
        const locationContent = modal.querySelector('.location-content');
        if (node.location) {
            locationContent.innerHTML = `
                <p><strong>位置：</strong>${node.location.name || '未知'}</p>
                ${node.location.coordinates ? `<p><strong>坐标：</strong>${node.location.coordinates.lat}, ${node.location.coordinates.lng}</p>` : ''}
            `;
        } else {
            locationContent.innerHTML = '<p style="color: var(--text-muted);">暂无位置信息</p>';
        }

        // 相关人物
        const figuresList = modal.querySelector('.figures-list');
        figuresList.innerHTML = '';
        if (node.figures && node.figures.length > 0) {
            node.figures.forEach(figure => {
                const figureEl = document.createElement('div');
                figureEl.style.cssText = `
                    background: rgba(212, 168, 83, 0.08);
                    padding: 8px 16px;
                    border-radius: 8px;
                    color: var(--text-secondary);
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.2s;
                `;
                figureEl.textContent = figure;
                figureEl.addEventListener('click', () => this.searchFigure(figure));
                figuresList.appendChild(figureEl);
            });
        } else {
            figuresList.innerHTML = '<p style="color: var(--text-muted);">暂无相关人物</p>';
        }

        // 历史意义
        modal.querySelector('.significance-text').textContent = node.significance || '暂无历史意义说明';

        // 相关事件
        const relatedList = modal.querySelector('.related-list');
        relatedList.innerHTML = '';
        if (node.relatedEvents && node.relatedEvents.length > 0) {
            node.relatedEvents.forEach(relatedId => {
                const relatedNode = this.app.dataService.getNode(relatedId);
                if (relatedNode) {
                    const relatedItem = document.createElement('div');
                    relatedItem.style.cssText = `
                        background: rgba(212, 168, 83, 0.08);
                        padding: 12px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: background 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    `;
                    relatedItem.innerHTML = `
                        <span style="font-size: 20px;">${this.getEventIcon(relatedNode.type)}</span>
                        <div>
                            <div style="color: var(--text-secondary); font-weight: 600;">${relatedNode.name}</div>
                            <div style="color: var(--text-muted); font-size: 13px;">${this.formatTime(relatedNode.time)}</div>
                        </div>
                    `;
                    relatedItem.addEventListener('click', () => this.show(relatedNode));
                    relatedList.appendChild(relatedItem);
                }
            });
        } else {
            relatedList.innerHTML = '<p style="color: var(--text-muted);">暂无相关事件</p>';
        }

        // 参考来源
        const sourcesList = modal.querySelector('.sources-list');
        sourcesList.innerHTML = '';
        if (node.sources && node.sources.length > 0) {
            node.sources.forEach(source => {
                const sourceEl = document.createElement('div');
                sourceEl.style.cssText = `
                    color: var(--text-primary);
                    font-size: 14px;
                    padding: 8px;
                    background: rgba(212, 168, 83, 0.08);
                    border-radius: 6px;
                `;
                sourceEl.textContent = source;
                sourcesList.appendChild(sourceEl);
            });
        } else {
            sourcesList.innerHTML = '<p style="color: var(--text-muted);">暂无参考来源</p>';
        }
    }

    /**
     * 关闭弹窗
     */
    close() {
        this.modal.style.opacity = '0';
        this.modal.style.transform = 'scale(0.9) translateY(20px)';
        // 保存定时器引用以便清理
        clearTimeout(this._closeTimer);
        this._closeTimer = setTimeout(() => {
            this.overlay.style.display = 'none';
            this.isOpen = false;
            this.app.eventBus.emit('modal:close');
        }, 300);
    }

    /**
     * 导出当前节点
     */
    exportCurrentNode() {
        if (this.currentNode && this.app.exportManager) {
            this.app.exportManager.exportNode(this.currentNode);
        }
    }

    /**
     * 搜索相关人物
     */
    searchFigure(figure) {
        this.close();
        clearTimeout(this._searchFigureTimer);
        this._searchFigureTimer = setTimeout(() => {
            this.app.eventBus.emit('search:figure', { query: figure });
        }, 300);
    }

    /**
     * 获取事件图标
     */
    getEventIcon(type) {
        const icons = {
            event: '📍',
            person: '👤',
            period: '📅',
            branch: '🌿',
            civilization: '🏛️',
            war: '⚔️',
            technology: '🔬',
            culture: '🎨',
            politics: '🏛️',
            economy: '💰',
            science: '🔬',
            philosophy: '📜',
            art: '🎨',
            literature: '📚',
            music: '🎵',
            architecture: '🏗️'
        };
        return icons[type] || '●';
    }

    /**
     * 获取分类颜色
     */
    getCategoryColor(category) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316',
            science: '#3b82f6',
            philosophy: '#8b5cf6',
            art: '#ec4899',
            literature: '#14b8a6'
        };
        return colors[category] || '#D4A853';
    }

    /**
     * 格式化时间
     */
    formatTime(time) {
        if (!time) return '时间未知';
        return time.displayDate || time.full || `${time.year || ''}${time.month ? '-' + time.month : ''}${time.day ? '-' + time.day : ''}`;
    }

    /**
     * 格式化详细信息
     */
    formatDetails(details) {
        if (typeof details === 'string') {
            return `<p>${details}</p>`;
        }
        if (Array.isArray(details)) {
            return details.map(item => `<p>${item}</p>`).join('');
        }
        if (typeof details === 'object') {
            return Object.entries(details)
                .map(([key, value]) => `<p><strong>${key}：</strong>${value}</p>`)
                .join('');
        }
        return String(details);
    }

    /**
     * 销毁组件
     */
    destroy() {
        // 清理定时器
        if (this._closeTimer) {
            clearTimeout(this._closeTimer);
            this._closeTimer = null;
        }
        if (this._searchFigureTimer) {
            clearTimeout(this._searchFigureTimer);
            this._searchFigureTimer = null;
        }

        // 清理事件监听器
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }

        if (this.overlay) {
            // 清理按钮事件监听器
            const closeBtn = this.modal?.querySelector('.close-btn');
            if (closeBtn && this._closeBtnHandler) {
                closeBtn.removeEventListener('click', this._closeBtnHandler);
            }

            const closeActionBtn = this.modal?.querySelector('.close-action-btn');
            if (closeActionBtn && this._closeActionBtnHandler) {
                closeActionBtn.removeEventListener('click', this._closeActionBtnHandler);
            }

            const exportBtn = this.modal?.querySelector('.export-btn');
            if (exportBtn && this._exportBtnHandler) {
                exportBtn.removeEventListener('click', this._exportBtnHandler);
            }

            this.overlay.remove();
            this.overlay = null;
        }

        // 清理引用
        this.modal = null;
        this.currentNode = null;
        this.app = null;
    }
}

window.EventModal = EventModal;