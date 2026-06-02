/**
 * 世界大事年表视图 - WorldTimeline.js
 * 提供全球横向时间轴，多行并行显示不同文明
 */

class WorldTimeline {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        this.options = {
            startYear: -3000,
            endYear: 2025,
            zoomLevel: 'ancient', // ancient, medieval, modern, all
            ...options
        };

        this.zoomLevels = {
            ancient: { startYear: -3000, endYear: 500 },
            medieval: { startYear: 500, endYear: 1500 },
            modern: { startYear: 1500, endYear: 2025 },
            all: { startYear: -3000, endYear: 2025 }
        };

        this.chineseDynasties = this._extractChineseDynasties();
        this.worldEvents = window.worldEvents || [];
        this.worldCivilizations = window.WorldCivilizations || {};

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.createUI();
        this.bindEvents();
        this.renderTimeline();
    }

    createUI() {
        const html = `
            <div class="world-timeline-container">
                <!-- 控制面板 -->
                <div class="timeline-controls">
                    <div class="zoom-controls">
                        <button class="zoom-btn ${this.options.zoomLevel === 'ancient' ? 'active' : ''}"
                                data-zoom="ancient">上古时期</button>
                        <button class="zoom-btn ${this.options.zoomLevel === 'medieval' ? 'active' : ''}"
                                data-zoom="medieval">中古时期</button>
                        <button class="zoom-btn ${this.options.zoomLevel === 'modern' ? 'active' : ''}"
                                data-zoom="modern">近代现代</button>
                        <button class="zoom-btn ${this.options.zoomLevel === 'all' ? 'active' : ''}"
                                data-zoom="all">全部</button>
                    </div>

                    <div class="timeline-info">
                        <span id="timeline-range-display">公元前3000年 ~ 公元2025年</span>
                    </div>
                </div>

                <!-- 时间轴容器 -->
                <div id="timeline-scroll-area" class="timeline-scroll-area">
                    <div id="timeline-wrapper" class="timeline-wrapper">
                        <!-- 时间轴头部 -->
                        <div id="timeline-header" class="timeline-header"></div>

                        <!-- 文明时间线行 -->
                        <div id="timeline-rows" class="timeline-rows"></div>
                    </div>
                </div>

                <!-- 图例 -->
                <div class="timeline-legend">
                    <div class="legend-title">图例</div>
                    <div class="legend-items">
                        <div class="legend-item">
                            <span class="legend-dot china"></span>
                            <span>中国朝代</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot world"></span>
                            <span>世界文明</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot event"></span>
                            <span>重大事件</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-line connection"></span>
                            <span>文化交流</span>
                        </div>
                    </div>
                </div>

                <!-- 事件详情弹窗 -->
                <div id="event-popup" class="event-popup hidden">
                    <div class="popup-content">
                        <button class="popup-close">&times;</button>
                        <h3 id="popup-title"></h3>
                        <div id="popup-body"></div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    bindEvents() {
        // 缩放按钮
        document.querySelectorAll('.zoom-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const zoomLevel = e.target.dataset.zoom;
                this.setZoomLevel(zoomLevel);
            });
        });

        // 关闭弹窗
        document.querySelector('.popup-close')?.addEventListener('click', () => {
            this.hidePopup();
        });

        // 点击外部关闭弹窗
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('event-popup');
            if (e.target === popup) {
                this.hidePopup();
            }
        });
    }

    setZoomLevel(level) {
        this.options.zoomLevel = level;
        this.options.startYear = this.zoomLevels[level].startYear;
        this.options.endYear = this.zoomLevels[level].endYear;

        // 更新按钮状态
        document.querySelectorAll('.zoom-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.zoom === level);
        });

        // 重新渲染
        this.renderTimeline();
    }

    renderTimeline() {
        const totalYears = this.options.endYear - this.options.startYear;
        const pixelsPerYear = 2; // 每年对应的像素数
        const totalWidth = totalYears * pixelsPerYear;

        // 更新范围显示
        document.getElementById('timeline-range-display').textContent =
            `${this.formatYear(this.options.startYear)} ~ ${this.formatYear(this.options.endYear)}`;

        // 渲染时间轴头部
        this.renderTimelineHeader(totalWidth, pixelsPerYear);

        // 渲染文明行
        this.renderCivilizationRows(totalWidth, pixelsPerYear);
    }

    renderTimelineHeader(totalWidth, pixelsPerYear) {
        const header = document.getElementById('timeline-header');
        if (!header) return;

        let html = '<div class="timeline-header-bar">';

        // 生成时间刻度
        const step = this.calculateTimeStep();
        for (let year = this.options.startYear; year <= this.options.endYear; year += step) {
            const position = ((year - this.options.startYear) / (this.options.endYear - this.options.startYear)) * 100;
            html += `
                <div class="timeline-tick" style="left: ${position}%">
                    <div class="tick-mark"></div>
                    <div class="tick-label">${this.formatYear(year)}</div>
                </div>
            `;
        }

        html += '</div>';
        header.innerHTML = html;
    }

    calculateTimeStep() {
        const totalYears = this.options.endYear - this.options.startYear;
        if (totalYears > 3000) return 500;
        if (totalYears > 1000) return 200;
        if (totalYears > 500) return 100;
        if (totalYears > 200) return 50;
        return 25;
    }

    renderCivilizationRows(totalWidth, pixelsPerYear) {
        const rowsContainer = document.getElementById('timeline-rows');
        if (!rowsContainer) return;

        let html = '';

        // 1. 渲染中国朝代行
        html += this.renderChinaRow(totalWidth, pixelsPerYear);

        // 2. 渲染世界文明行
        html += this.renderWorldCivilizationsRows(totalWidth, pixelsPerYear);

        // 3. 渲染重大事件行
        html += this.renderMajorEventsRow(totalWidth, pixelsPerYear);

        rowsContainer.innerHTML = html;
    }

    renderChinaRow(totalWidth, pixelsPerYear) {
        const relevantDynasties = this.chineseDynasties.filter(d => {
            return d.start <= this.options.endYear && d.end >= this.options.startYear;
        });

        let dynastyBars = '';

        relevantDynasties.forEach(dynasty => {
            const start = Math.max(dynasty.start, this.options.startYear);
            const end = Math.min(dynasty.end, this.options.endYear);
            const left = ((start - this.options.startYear) / (this.options.endYear - this.options.startYear)) * 100;
            const width = ((end - start) / (this.options.endYear - this.options.startYear)) * 100;

            dynastyBars += `
                <div class="dynasty-bar china"
                     style="left: ${left}%; width: ${width}%;"
                     data-id="${dynasty.id}"
                     title="${dynasty.name} (${dynasty.start} ~ ${dynasty.end})">
                    <span class="bar-label">${dynasty.name}</span>
                </div>
            `;
        });

        return `
            <div class="timeline-row china-row">
                <div class="row-header">
                    <span class="row-icon">🇨🇳</span>
                    <span class="row-title">中国朝代</span>
                </div>
                <div class="row-content">
                    ${dynastyBars}
                </div>
            </div>
        `;
    }

    renderWorldCivilizationsRows(totalWidth, pixelsPerYear) {
        let html = '';

        const civilizations = [
            { id: 'mesopotamia', name: '美索不达米亚', icon: '🏛️' },
            { id: 'egypt', name: '古埃及', icon: '🏺' },
            { id: 'greece', name: '古希腊', icon: '🏛️' },
            { id: 'rome', name: '古罗马', icon: '🦅' },
            { id: 'india', name: '古印度', icon: '🕉️' },
            { id: 'islamic', name: '伊斯兰', icon: '☪️' },
            { id: 'medieval_europe', name: '中世纪欧洲', icon: '🏰' }
        ];

        civilizations.forEach(civ => {
            const civData = this.worldCivilizations[civ.id];
            if (!civData) return;

            const startYear = this.getCivilizationStart(civData);
            const endYear = this.getCivilizationEnd(civData);

            if (endYear < this.options.startYear || startYear > this.options.endYear) {
                return; // 不在当前时间范围内
            }

            const start = Math.max(startYear, this.options.startYear);
            const end = Math.min(endYear, this.options.endYear);
            const left = ((start - this.options.startYear) / (this.options.endYear - this.options.startYear)) * 100;
            const width = ((end - start) / (this.options.endYear - this.options.startYear)) * 100;

            html += `
                <div class="timeline-row world-row">
                    <div class="row-header">
                        <span class="row-icon">${civ.icon}</span>
                        <span class="row-title">${civ.name}</span>
                    </div>
                    <div class="row-content">
                        <div class="civ-bar world"
                             style="left: ${left}%; width: ${width}%; background: ${civData.color || '#999'};"
                             data-civ="${civ.id}"
                             title="${civ.name} (${this.formatYear(startYear)} ~ ${this.formatYear(endYear)})">
                            <span class="bar-label">${civ.name}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    renderMajorEventsRow(totalWidth, pixelsPerYear) {
        const relevantEvents = this.worldEvents.filter(e => {
            return e.year >= this.options.startYear && e.year <= this.options.endYear;
        });

        // 按重要性排序，只显示重要事件
        const importantEvents = relevantEvents
            .filter(e => e.impact === 'very-high' || e.impact === 'high')
            .sort((a, b) => a.year - b.year);

        let eventMarkers = '';

        importantEvents.forEach(event => {
            const left = ((event.year - this.options.startYear) / (this.options.endYear - this.options.startYear)) * 100;

            eventMarkers += `
                <div class="event-marker"
                     style="left: ${left}%;"
                     data-event-id="${event.id}"
                     title="${event.name} (${this.formatYear(event.year)})">
                    <div class="event-dot"></div>
                    <div class="event-label">${event.name}</div>
                </div>
            `;
        });

        return `
            <div class="timeline-row events-row">
                <div class="row-header">
                    <span class="row-icon">⚡</span>
                    <span class="row-title">重大事件</span>
                </div>
                <div class="row-content events-content">
                    ${eventMarkers}
                </div>
            </div>
        `;
    }

    getCivilizationStart(civData) {
        if (civData.events && civData.events.length > 0) {
            return Math.min(...civData.events.map(e => e.year));
        }
        if (civData.persons && civData.persons.length > 0) {
            return Math.min(...civData.persons.map(p => p.year));
        }
        return -3000;
    }

    getCivilizationEnd(civData) {
        if (civData.events && civData.events.length > 0) {
            return Math.max(...civData.events.map(e => e.year));
        }
        if (civData.persons && civData.persons.length > 0) {
            return Math.max(...civData.persons.map(p => p.year));
        }
        return 2025;
    }

    formatYear(year) {
        if (year < 0) {
            return `公元前${Math.abs(year)}年`;
        }
        return `公元${year}年`;
    }

    showPopup(event) {
        const popup = document.getElementById('event-popup');
        const title = document.getElementById('popup-title');
        const body = document.getElementById('popup-body');

        if (!popup || !title || !body) return;

        title.textContent = event.name;

        let content = `
            <div class="popup-info">
                <p><strong>年份:</strong> ${this.formatYear(event.year)}</p>
                ${event.location ? `<p><strong>地点:</strong> ${event.location}</p>` : ''}
                ${event.civilization ? `<p><strong>文明:</strong> ${event.civilization}</p>` : ''}
                ${event.category ? `<p><strong>类型:</strong> ${event.category}</p>` : ''}
                ${event.significance ? `<p><strong>意义:</strong> ${event.significance}</p>` : ''}
                <p><strong>描述:</strong></p>
                <p>${event.description}</p>
            </div>
        `;

        body.innerHTML = content;
        popup.classList.remove('hidden');
    }

    hidePopup() {
        const popup = document.getElementById('event-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }

    _extractChineseDynasties() {
        const cd = window.ChineseDynasties || {};
        return Object.entries(cd).map(([key, d]) => ({
            id: key,
            name: d.name,
            start: d.period ? d.period.start : 0,
            end: d.period ? d.period.end : 0,
            capital: d.capital || '',
            color: d.color || '#c9302c',
            achievements: d.achievements || [],
            description: d.description || '',
            events: d.events || [],
            persons: d.persons || []
        }));
    }
}



// 导出到全局
window.WorldTimeline = WorldTimeline;