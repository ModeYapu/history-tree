/**
 * 时间线插件 v1.0
 * 可拖拽的时间轴、时代标记、时间范围筛选、动画过渡
 */

class TimelinePlugin {
    static PERIODS = [
        { id: 'spring-autumn', name: '春秋', start: -770, end: -476, color: '#8B4513', description: '东周前半期' },
        { id: 'warring', name: '战国', start: -475, end: -221, color: '#DAA520', description: '东周后半期' },
        { id: 'qin-han', name: '秦汉', start: -221, end: 220, color: '#CD853F', description: '大一统时期' },
        { id: 'three-kingdoms', name: '三国', start: 220, end: 280, color: '#BC8F8F', description: '魏蜀吴鼎立' },
        { id: 'jin-northern-southern', name: '两晋南北朝', start: 280, end: 589, color: '#D2B48C', description: '分裂与融合' },
        { id: 'sui-tang', name: '隋唐', start: 581, end: 907, color: '#DAA520', description: '盛世' },
        { id: 'song-yuan', name: '宋元', start: 960, end: 1368, color: '#4A90E2', description: '文化繁荣' },
        { id: 'ming-qing', name: '明清', start: 1368, end: 1911, color: '#E74C3C', description: '帝制晚期' },
        { id: 'modern', name: '近现代', start: 1911, end: 2024, color: '#9B59B6', description: '走向共和' }
    ];

    static CATEGORY_COLORS = {
        politics: '#ff6b6b',
        technology: '#4ecdc4',
        culture: '#a855f7',
        economy: '#22c55e',
        military: '#f97316',
        default: '#999'
    };

    static TIME_RANGE = {
        min: -3000,
        max: 2024,
        total: 5024
    };

    static CONFIG = {
        minRange: 50,
        zoomInFactor: 0.7,
        zoomOutFactor: 1.3,
        minZoomRange: 100
    };

    constructor(app) {
        this.app = app;
        this.name = 'timelinePlugin';
        this.version = '1.0.0';

        this.timeRange = { start: TimelinePlugin.TIME_RANGE.min, end: TimelinePlugin.TIME_RANGE.max };
        this.periods = [...TimelinePlugin.PERIODS];
        this.eventListeners = [];
        this.timelineElement = null;
        this.isVisible = false;
        this.isDragging = false;
        this.animationFrame = null;
    }

    /**
     * 初始化插件
     */
    init() {
        console.log('📅 Timeline Plugin initialized');
        this.setupEventListeners();
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 监听视图变化
        this.app.eventBus.on('view:change', ({ name }) => {
            if (name === 'timeline' || name === 'map') {
                this.show();
            } else {
                this.hide();
            }
        });

        // 监听时期选择
        this.app.eventBus.on('period:select', (period) => {
            this.selectPeriod(period);
        });
    }

    /**
     * 显示时间线
     */
    show() {
        if (this.isVisible) return;

        this.timelineElement = this.createTimeline();
        document.body.appendChild(this.timelineElement);
        this.isVisible = true;

        // 添加动画
        setTimeout(() => {
            this.timelineElement.style.transform = 'translateY(0)';
        }, 10);
    }

    /**
     * 隐藏时间线
     */
    hide() {
        if (this.timelineElement) {
            this.timelineElement.style.transform = 'translateY(100%)';
            setTimeout(() => {
                this.timelineElement.remove();
                this.timelineElement = null;
            }, 300);
        }
        this.isVisible = false;
    }

    /**
     * 创建时间线元素
     */
    createTimeline() {
        const container = document.createElement('div');
        container.className = 'timeline-plugin-container';
        container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 120px;
            background: linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.95));
            border-top: 1px solid rgba(0,0,0,0.1);
            box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
            z-index: 1500;
            transform: translateY(100%);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
        `;

        // 创建时间线内容
        container.innerHTML = `
            <div class="timeline-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 20px;
                border-bottom: 1px solid #eee;
                background: #f8f9fa;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: 600; color: #333;">📅 历史时间轴</span>
                    <span class="time-range-display" style="
                        padding: 4px 12px;
                        background: #667eea;
                        color: white;
                        border-radius: 12px;
                        font-size: 12px;
                    ">${this.formatYear(this.timeRange.start)} - ${this.formatYear(this.timeRange.end)}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="zoom-out-btn" title="缩小时间范围" style="
                        width: 28px;
                        height: 28px;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                    ">−</button>
                    <button class="reset-btn" title="重置" style="
                        width: 28px;
                        height: 28px;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ⟲</button>
                    <button class="zoom-in-btn" title="放大时间范围" style="
                        width: 28px;
                        height: 28px;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                    ">+</button>
                </div>
            </div>
            <div class="timeline-content" style="
                flex: 1;
                position: relative;
                overflow: hidden;
                padding: 10px 20px 0;
            ">
                <div class="timeline-track" style="
                    position: absolute;
                    top: 30px;
                    left: 20px;
                    right: 20px;
                    height: 4px;
                    background: #e0e0e0;
                    border-radius: 2px;
                "></div>
                <div class="timeline-active-range" style="
                    position: absolute;
                    top: 28px;
                    height: 8px;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    border-radius: 4px;
                    cursor: grab;
                "></div>
                <div class="timeline-periods" style="
                    position: absolute;
                    top: 45px;
                    left: 20px;
                    right: 20px;
                    display: flex;
                    justify-content: space-between;
                "></div>
                <div class="timeline-events" style="
                    position: absolute;
                    top: 65px;
                    left: 20px;
                    right: 20px;
                    height: 30px;
                "></div>
            </div>
        `;

        // 绑定事件
        this.bindTimelineEvents(container);

        // 渲染时期和事件
        this.renderPeriods(container);
        this.renderEvents(container);

        return container;
    }

    /**
     * 绑定时间线事件
     */
    bindTimelineEvents(container) {
        const activeRange = container.querySelector('.timeline-active-range');
        const content = container.querySelector('.timeline-content');

        // 缩放按钮
        container.querySelector('.zoom-in-btn').addEventListener('click', () => {
            this.zoomIn();
        });

        container.querySelector('.zoom-out-btn').addEventListener('click', () => {
            this.zoomOut();
        });

        container.querySelector('.reset-btn').addEventListener('click', () => {
            this.reset();
        });

        // 拖拽功能
        let startX = 0;
        let startLeft = 0;
        let startRight = 0;

        activeRange.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            startX = e.clientX;
            const rect = activeRange.getBoundingClientRect();
            startLeft = rect.left;
            startRight = rect.right;

            content.style.cursor = 'grabbing';
            activeRange.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const dx = e.clientX - startX;
            const containerWidth = content.offsetWidth - 40;

            // 计算新的位置
            const newLeft = Math.max(0, Math.min(startLeft - 20 + dx, containerWidth));
            const newRight = Math.max(newLeft, Math.min(startRight - 20 + dx, containerWidth));

            // 转换为年份
            const newStartYear = this.pixelToYear(newLeft, containerWidth);
            const newEndYear = this.pixelToYear(newRight, containerWidth);

            this.setTimeRange(newStartYear, newEndYear);
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                content.style.cursor = '';
                activeRange.style.cursor = 'grab';

                // 触发事件
                this.emitTimeRangeChange();
            }
        });

        // 滚轮缩放
        content.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        }, { passive: false });
    }

    /**
     * 渲染时期
     */
    renderPeriods(container) {
        const periodsContainer = container.querySelector('.timeline-periods');
        periodsContainer.innerHTML = '';

        this.periods.forEach(period => {
            const marker = document.createElement('div');
            marker.className = 'period-marker';
            marker.style.cssText = `
                position: absolute;
                transform: translateX(-50%);
                font-size: 11px;
                color: #666;
                cursor: pointer;
                padding: 2px 6px;
                border-radius: 4px;
                transition: all 0.2s ease;
            `;

            // 计算位置
            const leftPercent = this.yearToPercent(period.start);
            marker.style.left = leftPercent + '%';
            marker.textContent = period.name;

            // 悬停效果
            marker.addEventListener('mouseenter', () => {
                marker.style.background = period.color;
                marker.style.color = 'white';
                marker.title = `${period.name} (${this.formatYear(period.start)} - ${this.formatYear(period.end)})`;
            });

            marker.addEventListener('mouseleave', () => {
                marker.style.background = '';
                marker.style.color = '#666';
            });

            // 点击选择时期
            marker.addEventListener('click', () => {
                this.selectPeriod(period);
            });

            periodsContainer.appendChild(marker);
        });
    }

    /**
     * 渲染事件标记
     */
    renderEvents(container) {
        const eventsContainer = container.querySelector('.timeline-events');
        eventsContainer.innerHTML = '';

        // 获取重要事件
        const nodes = this.app.dataService.filter({
            minImportance: 4
        });

        // 按时间排序
        const sortedNodes = nodes
            .filter(n => n.time.year)
            .sort((a, b) => a.time.year - b.time.year)
            .slice(0, 20); // 最多显示20个

        sortedNodes.forEach(node => {
            const marker = document.createElement('div');
            marker.className = 'event-marker';

            const leftPercent = this.yearToPercent(node.time.year);
            marker.style.cssText = `
                position: absolute;
                left: ${leftPercent}%;
                transform: translateX(-50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${this.getCategoryColor(node.category.primary)};
                border: 2px solid white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                cursor: pointer;
                transition: transform 0.2s ease;
            `;

            marker.title = `${node.name} (${node.time.displayDate})`;

            marker.addEventListener('mouseenter', () => {
                marker.style.transform = 'translateX(-50%) scale(1.5)';
            });

            marker.addEventListener('mouseleave', () => {
                marker.style.transform = 'translateX(-50%) scale(1)';
            });

            marker.addEventListener('click', () => {
                this.app.eventBus.emit('node:select', node);
            });

            eventsContainer.appendChild(marker);
        });
    }

    /**
     * 更新时间线UI
     */
    updateTimelineUI() {
        if (!this.timelineElement) return;

        const activeRange = this.timelineElement.querySelector('.timeline-active-range');
        const rangeDisplay = this.timelineElement.querySelector('.time-range-display');
        const content = this.timelineElement.querySelector('.timeline-content');
        const containerWidth = content.offsetWidth - 40;

        const startPercent = this.yearToPercent(this.timeRange.start);
        const endPercent = this.yearToPercent(this.timeRange.end);

        activeRange.style.left = startPercent + '%';
        activeRange.style.width = (endPercent - startPercent) + '%';

        rangeDisplay.textContent = `${this.formatYear(this.timeRange.start)} - ${this.formatYear(this.timeRange.end)}`;
    }

    /**
     * 年份转百分比
     */
    yearToPercent(year) {
        return ((year - TimelinePlugin.TIME_RANGE.min) / TimelinePlugin.TIME_RANGE.total) * 100;
    }

    /**
     * 像素转年份
     */
    pixelToYear(pixel, containerWidth) {
        return (pixel / containerWidth) * TimelinePlugin.TIME_RANGE.total + TimelinePlugin.TIME_RANGE.min;
    }

    /**
     * 格式化年份
     */
    formatYear(year) {
        return year < 0 ? `公元前${Math.abs(year)}年` : `${year}年`;
    }

    /**
     * 设置时间范围
     */
    setTimeRange(start, end) {
        const { min, max, minRange } = TimelinePlugin.TIME_RANGE;
        const configMinRange = TimelinePlugin.CONFIG.minRange;

        this.timeRange.start = Math.max(min, Math.round(start));
        this.timeRange.end = Math.min(max, Math.round(end));

        if (this.timeRange.end - this.timeRange.start < configMinRange) {
            this.timeRange.end = this.timeRange.start + configMinRange;
        }

        this.updateTimelineUI();
    }

    /**
     * 选择时期
     */
    selectPeriod(period) {
        this.timeRange.start = period.start;
        this.timeRange.end = period.end;
        this.updateTimelineUI();
        this.emitTimeRangeChange();

        // 添加选中动画
        this.animatePeriodSelection(period);
    }

    /**
     * 时期选择动画
     */
    animatePeriodSelection(period) {
        if (!this.timelineElement) return;

        const periodsContainer = this.timelineElement.querySelector('.timeline-periods');
        const markers = periodsContainer.querySelectorAll('.period-marker');

        markers.forEach(marker => {
            if (marker.textContent === period.name) {
                marker.style.animation = 'pulse 0.5s ease';
                setTimeout(() => marker.style.animation = '', 500);
            }
        });
    }

    /**
     * 放大
     */
    zoomIn() {
        const { start, end } = this.timeRange;
        const center = (start + end) / 2;
        const newRange = Math.max(TimelinePlugin.CONFIG.minZoomRange, (end - start) * TimelinePlugin.CONFIG.zoomInFactor);

        this.timeRange.start = Math.round(center - newRange / 2);
        this.timeRange.end = Math.round(center + newRange / 2);

        this.updateTimelineUI();
        this.emitTimeRangeChange();
    }

    /**
     * 缩小
     */
    zoomOut() {
        const { start, end } = this.timeRange;
        const center = (start + end) / 2;
        const newRange = Math.min(TimelinePlugin.TIME_RANGE.total, (end - start) * TimelinePlugin.CONFIG.zoomOutFactor);

        const { min, max } = TimelinePlugin.TIME_RANGE;
        this.timeRange.start = Math.max(min, Math.round(center - newRange / 2));
        this.timeRange.end = Math.min(max, Math.round(center + newRange / 2));

        this.updateTimelineUI();
        this.emitTimeRangeChange();
    }

    /**
     * 重置
     */
    reset() {
        this.timeRange = { start: TimelinePlugin.TIME_RANGE.min, end: TimelinePlugin.TIME_RANGE.max };
        this.updateTimelineUI();
        this.emitTimeRangeChange();
    }

    /**
     * 触发时间范围变化事件
     */
    emitTimeRangeChange() {
        this.app.eventBus.emit('timeline:change', {
            start: this.timeRange.start,
            end: this.timeRange.end
        });

        this.app.eventBus.emit('timeline:brush', {
            start: this.timeRange.start,
            end: this.timeRange.end
        });
    }

    /**
     * 获取分类颜色
     */
    getCategoryColor(category) {
        return TimelinePlugin.CATEGORY_COLORS[category] || TimelinePlugin.CATEGORY_COLORS.default;
    }

    /**
     * 跳转到指定年份
     */
    jumpToYear(year) {
        const range = this.timeRange.end - this.timeRange.start;
        this.timeRange.start = Math.max(-3000, year - range / 2);
        this.timeRange.end = Math.min(2024, year + range / 2);
        this.updateTimelineUI();
        this.emitTimeRangeChange();
    }

    /**
     * 获取当前时间范围
     */
    getTimeRange() {
        return { ...this.timeRange };
    }

    /**
     * 获取时期列表
     */
    getPeriods() {
        return [...this.periods];
    }

    /**
     * 根据年份获取时期
     */
    getPeriodByYear(year) {
        return this.periods.find(p => year >= p.start && year <= p.end);
    }

    /**
     * 播放时间动画
     */
    playAnimation(options = {}) {
        const {
            startYear = -3000,
            endYear = 2024,
            duration = 10000, // 10秒
            onUpdate = null
        } = options;

        const startTime = Date.now();
        const totalYears = endYear - startYear;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentYear = startYear + totalYears * progress;

            this.timeRange.start = Math.round(currentYear);
            this.timeRange.end = Math.round(currentYear + (this.timeRange.end - this.timeRange.start));
            this.updateTimelineUI();

            if (onUpdate) {
                onUpdate(currentYear, progress);
            }

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.emitTimeRangeChange();
            }
        };

        this.stopAnimation();
        this.animationFrame = requestAnimationFrame(animate);
    }

    /**
     * 停止动画
     */
    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * 销毁插件
     */
    destroy() {
        this.stopAnimation();
        this.hide();

        // 移除事件监听
        this.eventListeners.forEach(({ event, handler }) => {
            this.app.eventBus.off(event, handler);
        });
        this.eventListeners = [];
    }
}

window.TimelinePlugin = TimelinePlugin;
