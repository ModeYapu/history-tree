/**
 * 地图视图 - 地理可视化 v2.0
 * 支持缩放、拖拽、时间轴联动、地点详情弹窗
 */

class MapView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.map = null;
        this.markers = [];
        this.markerClusters = [];

        this.config = {
            center: [35, 105],
            zoom: 4,
            minZoom: 2,
            maxZoom: 18
        };

        // 时间范围
        this.timeRange = {
            start: -3000,
            end: 2024
        };

        // 当前筛选
        this.filters = {
            category: null,
            period: null,
            minImportance: 0
        };

        // 历史时期定义
        this.periods = [
            { name: '春秋', start: -770, end: -476, color: '#8B4513' },
            { name: '战国', start: -475, end: -221, color: '#DAA520' },
            { name: '秦汉', start: -221, end: 220, color: '#CD853F' },
            { name: '三国', start: 220, end: 280, color: '#BC8F8F' },
            { name: '唐宋', start: 618, end: 1279, color: '#4A90E2' },
            { name: '明清', start: 1368, end: 1911, color: '#E74C3C' },
            { name: '近现代', start: 1911, end: 2024, color: '#9B59B6' }
        ];

        // 事件监听器
        this.eventListeners = [];
    }

    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'map-view';
        this.container.style.cssText = `
            width: 100%;
            height: ${window.innerHeight - 180}px;
            position: relative;
        `;

        document.querySelector(this.app.options.container).appendChild(this.container);

        this.initMap();
        this.initControls();
        this.initTimeline();
        this.loadData();
        this.setupEventListeners();

        this.app.eventBus.emit('view:ready', { view: 'map' });
    }

    hide() {
        this.removeEventListeners();
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        if (this.container) {
            this.container.remove();
        }
    }

    /**
     * 初始化地图
     */
    initMap() {
        // 使用Leaflet创建地图
        this.map = L.map(this.container, {
            center: this.config.center,
            zoom: this.config.zoom,
            minZoom: this.config.minZoom,
            maxZoom: this.config.maxZoom,
            zoomControl: false
        });

        // 添加自定义缩放控制
        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);

        // 添加地图图层
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        });
        tileLayer.addTo(this.map);

        // 添加比例尺
        L.control.scale({
            position: 'bottomleft',
            imperial: false
        }).addTo(this.map);

        // 保存引用
        this.tileLayer = tileLayer;
    }

    /**
     * 初始化控制面板
     */
    initControls() {
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'map-controls';
        controlsPanel.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 200px;
        `;

        // 分类筛选
        const categoryLabel = document.createElement('label');
        categoryLabel.textContent = '分类筛选:';
        categoryLabel.style.cssText = 'display: block; font-weight: bold; margin-bottom: 5px;';

        const categorySelect = document.createElement('select');
        categorySelect.style.cssText = 'width: 100%; padding: 5px; margin-bottom: 10px; border-radius: 4px;';
        categorySelect.innerHTML = `
            <option value="">全部</option>
            <option value="politics">政治</option>
            <option value="technology">科技</option>
            <option value="culture">文化</option>
            <option value="economy">经济</option>
            <option value="military">军事</option>
        `;
        categorySelect.addEventListener('change', (e) => {
            this.filters.category = e.target.value || null;
            this.applyFilters();
        });

        // 时期筛选
        const periodLabel = document.createElement('label');
        periodLabel.textContent = '时期筛选:';
        periodLabel.style.cssText = 'display: block; font-weight: bold; margin-bottom: 5px;';

        const periodSelect = document.createElement('select');
        periodSelect.style.cssText = 'width: 100%; padding: 5px; margin-bottom: 10px; border-radius: 4px;';
        periodSelect.innerHTML = `
            <option value="">全部</option>
            ${this.periods.map(p => `<option value="${p.name}">${p.name} (${p.start} - ${p.end})</option>`).join('')}
        `;
        periodSelect.addEventListener('change', (e) => {
            this.filters.period = e.target.value || null;
            this.applyFilters();
        });

        // 重要性筛选
        const importanceLabel = document.createElement('label');
        importanceLabel.textContent = '最低重要性:';
        importanceLabel.style.cssText = 'display: block; font-weight: bold; margin-bottom: 5px;';

        const importanceRange = document.createElement('input');
        importanceRange.type = 'range';
        importanceRange.min = '1';
        importanceRange.max = '5';
        importanceRange.value = '1';
        importanceRange.style.cssText = 'width: 100%; margin-bottom: 5px;';
        importanceRange.addEventListener('input', (e) => {
            this.filters.minImportance = parseInt(e.target.value);
            importanceValue.textContent = e.target.value;
        });
        importanceRange.addEventListener('change', () => this.applyFilters());

        const importanceValue = document.createElement('span');
        importanceValue.textContent = '1';
        importanceValue.style.cssText = 'font-size: 12px; color: #666;';

        // 重置按钮
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置筛选';
        resetBtn.style.cssText = `
            width: 100%;
            padding: 8px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        `;
        resetBtn.addEventListener('click', () => this.resetFilters());

        // 统计信息
        const statsDiv = document.createElement('div');
        statsDiv.className = 'map-stats';
        statsDiv.style.cssText = `
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        `;

        controlsPanel.appendChild(categoryLabel);
        controlsPanel.appendChild(categorySelect);
        controlsPanel.appendChild(periodLabel);
        controlsPanel.appendChild(periodSelect);
        controlsPanel.appendChild(importanceLabel);
        controlsPanel.appendChild(importanceRange);
        controlsPanel.appendChild(importanceValue);
        controlsPanel.appendChild(resetBtn);
        controlsPanel.appendChild(statsDiv);

        this.container.appendChild(controlsPanel);
        this.statsDiv = statsDiv;
        this.categorySelect = categorySelect;
        this.periodSelect = periodSelect;
        this.importanceRange = importanceRange;
    }

    /**
     * 初始化时间轴
     */
    initTimeline() {
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'map-timeline';
        timelineContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        `;

        // 时间轴标题
        const title = document.createElement('div');
        title.textContent = '时间轴筛选';
        title.style.cssText = 'font-weight: bold; margin-bottom: 10px; text-align: center;';

        // 时间范围显示
        const rangeDisplay = document.createElement('div');
        rangeDisplay.className = 'time-range-display';
        rangeDisplay.style.cssText = `
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: #667eea;
            font-weight: 500;
        `;
        rangeDisplay.textContent = `${this.formatYear(this.timeRange.start)} - ${this.formatYear(this.timeRange.end)}`;

        // 时间轴滑块
        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = 'position: relative; height: 40px;';

        // 使用双滑块
        const minSlider = document.createElement('input');
        minSlider.type = 'range';
        minSlider.min = '-3000';
        minSlider.max = '2024';
        minSlider.value = this.timeRange.start;
        minSlider.style.cssText = `
            position: absolute;
            width: 100%;
            pointer-events: none;
            -webkit-appearance: none;
            background: none;
            z-index: 2;
        `;

        const maxSlider = document.createElement('input');
        maxSlider.type = 'range';
        maxSlider.min = '-3000';
        maxSlider.max = '2024';
        maxSlider.value = this.timeRange.end;
        maxSlider.style.cssText = `
            position: absolute;
            width: 100%;
            pointer-events: none;
            -webkit-appearance: none;
            background: none;
            z-index: 3;
        `;

        // 轨道样式
        const track = document.createElement('div');
        track.className = 'timeline-track';
        track.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            height: 6px;
            background: #ddd;
            border-radius: 3px;
            z-index: 1;
        `;

        // 活动范围
        const activeRange = document.createElement('div');
        activeRange.className = 'timeline-active';
        activeRange.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            height: 6px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 3px;
            z-index: 1;
        `;

        // 时期标记
        const periodMarkers = document.createElement('div');
        periodMarkers.className = 'period-markers';
        periodMarkers.style.cssText = `
            position: absolute;
            top: 25px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #999;
        `;

        this.periods.forEach(period => {
            const marker = document.createElement('div');
            marker.textContent = period.name;
            marker.style.cssText = `
                position: absolute;
                left: ${this.percentForYear(period.start)}%;
                transform: translateX(-50%);
                cursor: pointer;
            `;
            marker.addEventListener('click', () => {
                this.timeRange.start = period.start;
                this.timeRange.end = period.end;
                this.updateTimelineUI();
                this.applyFilters();
            });
            periodMarkers.appendChild(marker);
        });

        // 更新UI函数
        const updateUI = () => {
            let min = parseInt(minSlider.value);
            let max = parseInt(maxSlider.value);

            if (min > max - 50) {
                if (event.target === minSlider) {
                    min = max - 50;
                    minSlider.value = min;
                } else {
                    max = min + 50;
                    maxSlider.value = max;
                }
            }

            this.timeRange.start = min;
            this.timeRange.end = max;

            const minPercent = ((min + 3000) / 5024) * 100;
            const maxPercent = ((max + 3000) / 5024) * 100;

            activeRange.style.left = minPercent + '%';
            activeRange.style.width = (maxPercent - minPercent) + '%';

            rangeDisplay.textContent = `${this.formatYear(min)} - ${this.formatYear(max)}`;
        };

        minSlider.addEventListener('input', updateUI);
        maxSlider.addEventListener('input', updateUI);
        maxSlider.addEventListener('change', () => this.applyFilters());
        minSlider.addEventListener('change', () => this.applyFilters());

        // 样式
        const style = document.createElement('style');
        style.textContent = `
            .map-timeline input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background: #667eea;
                border-radius: 50%;
                cursor: pointer;
                pointer-events: auto;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
            .map-timeline input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: #667eea;
                border-radius: 50%;
                cursor: pointer;
                pointer-events: auto;
                border: none;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
        `;

        sliderContainer.appendChild(track);
        sliderContainer.appendChild(activeRange);
        sliderContainer.appendChild(minSlider);
        sliderContainer.appendChild(maxSlider);
        sliderContainer.appendChild(periodMarkers);

        timelineContainer.appendChild(title);
        timelineContainer.appendChild(rangeDisplay);
        timelineContainer.appendChild(sliderContainer);

        this.container.appendChild(timelineContainer);
        this.timelineElements = { minSlider, maxSlider, activeRange, rangeDisplay };

        document.head.appendChild(style);
    }

    /**
     * 计算年份在时间轴上的百分比
     */
    percentForYear(year) {
        return ((year + 3000) / 5024) * 100;
    }

    /**
     * 格式化年份显示
     */
    formatYear(year) {
        if (year < 0) return `公元前${Math.abs(year)}年`;
        return `${year}年`;
    }

    /**
     * 更新时间轴UI
     */
    updateTimelineUI() {
        const { minSlider, maxSlider, activeRange, rangeDisplay } = this.timelineElements;
        minSlider.value = this.timeRange.start;
        maxSlider.value = this.timeRange.end;

        const minPercent = ((this.timeRange.start + 3000) / 5024) * 100;
        const maxPercent = ((this.timeRange.end + 3000) / 5024) * 100;

        activeRange.style.left = minPercent + '%';
        activeRange.style.width = (maxPercent - minPercent) + '%';
        rangeDisplay.textContent = `${this.formatYear(this.timeRange.start)} - ${this.formatYear(this.timeRange.end)}`;
    }

    /**
     * 加载数据
     */
    loadData() {
        // 清除现有标记
        this.clearMarkers();

        const nodes = Array.from(this.app.dataService.nodes.values());

        nodes.forEach(node => {
            if (node.location.coordinates) {
                this.addMarker(node);
            }
        });

        this.updateStats();
    }

    /**
     * 添加标记
     */
    addMarker(node) {
        const [lng, lat] = node.location.coordinates;

        // 检查是否在时间范围内
        if (node.time.year && (node.time.year < this.timeRange.start || node.time.year > this.timeRange.end)) {
            return;
        }

        const marker = L.circleMarker([lat, lng], {
            radius: this.getMarkerRadius(node),
            fillColor: this.getMarkerColor(node),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
            className: 'map-marker'
        }).addTo(this.map);

        // 绑定弹窗
        marker.bindPopup(this.createPopupContent(node), {
            maxWidth: 350,
            className: 'map-popup-container'
        });

        // 绑定事件
        marker.on('click', () => {
            this.onMarkerClick(node);
        });

        marker.on('mouseover', (e) => {
            marker.setStyle({ fillOpacity: 1, weight: 3 });
        });

        marker.on('mouseout', () => {
            marker.setStyle({ fillOpacity: 0.8, weight: 2 });
        });

        // 保存节点引用
        marker.node = node;
        this.markers.push(marker);
    }

    /**
     * 创建弹窗内容
     */
    createPopupContent(node) {
        const period = this.getPeriodForYear(node.time.year);
        const categoryNames = {
            politics: '政治',
            technology: '科技',
            culture: '文化',
            economy: '经济',
            military: '军事'
        };

        return `
            <div class="map-popup" style="min-width: 280px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #333;">${node.name}</h3>
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <span style="padding: 3px 8px; background: #667eea; color: white; border-radius: 12px; font-size: 11px;">
                        ${node.time.displayDate}
                    </span>
                    ${period ? `
                        <span style="padding: 3px 8px; background: ${period.color}; color: white; border-radius: 12px; font-size: 11px;">
                            ${period.name}
                        </span>
                    ` : ''}
                    <span style="padding: 3px 8px; background: #f0f0f0; color: #666; border-radius: 12px; font-size: 11px;">
                        ${categoryNames[node.category.primary] || node.category.primary}
                    </span>
                </div>
                <p style="margin: 0 0 10px 0; color: #666; line-height: 1.5;">${node.summary || node.description}</p>
                ${node.location.name ? `
                    <div style="display: flex; align-items: center; gap: 5px; color: #999; font-size: 12px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${node.location.name}
                    </div>
                ` : ''}
                <button onclick="window.app.showView('tree3d', { nodeId: '${node.id}' })"
                        style="width: 100%; margin-top: 10px; padding: 8px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    查看详情
                </button>
            </div>
        `;
    }

    /**
     * 根据年份获取时期
     */
    getPeriodForYear(year) {
        return this.periods.find(p => year >= p.start && year <= p.end);
    }

    /**
     * 标记点击事件
     */
    onMarkerClick(node) {
        this.app.eventBus.emit('node:select', node);
    }

    /**
     * 获取标记半径
     */
    getMarkerRadius(node) {
        return 5 + (node.metadata.importance || 3) * 2;
    }

    /**
     * 获取标记颜色
     */
    getMarkerColor(node) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316'
        };
        return colors[node.category.primary] || '#999';
    }

    /**
     * 应用筛选
     */
    applyFilters() {
        this.markers.forEach(marker => {
            const node = marker.node;
            let visible = true;

            // 分类筛选
            if (this.filters.category && node.category.primary !== this.filters.category) {
                visible = false;
            }

            // 时期筛选
            if (this.filters.period) {
                const period = this.getPeriodForYear(node.time.year);
                if (!period || period.name !== this.filters.period) {
                    visible = false;
                }
            }

            // 重要性筛选
            if (node.metadata.importance < this.filters.minImportance) {
                visible = false;
            }

            // 时间范围筛选
            if (node.time.year && (node.time.year < this.timeRange.start || node.time.year > this.timeRange.end)) {
                visible = false;
            }

            if (visible) {
                marker.addTo(this.map);
            } else {
                marker.remove();
            }
        });

        this.updateStats();
    }

    /**
     * 重置筛选
     */
    resetFilters() {
        this.filters = {
            category: null,
            period: null,
            minImportance: 0
        };
        this.timeRange = { start: -3000, end: 2024 };

        this.categorySelect.value = '';
        this.periodSelect.value = '';
        this.importanceRange.value = '1';
        this.updateTimelineUI();

        this.applyFilters();
    }

    /**
     * 清除标记
     */
    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }

    /**
     * 更新统计信息
     */
    updateStats() {
        const visibleMarkers = this.markers.filter(m => this.map.hasLayer(m));
        this.statsDiv.textContent = `显示 ${visibleMarkers.length} / ${this.markers.length} 个标记`;
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 监听时间轴变化
        const timeHandler = ({ start, end }) => {
            if (start !== undefined) this.timeRange.start = Math.round(start);
            if (end !== undefined) this.timeRange.end = Math.round(end);
            this.updateTimelineUI();
            this.applyFilters();
        };
        this.app.eventBus.on('timeline:brush', timeHandler);
        this.eventListeners.push({ event: 'timeline:brush', handler: timeHandler });

        // 监听时期选择
        const periodHandler = (period) => {
            this.filters.period = period.name;
            this.periodSelect.value = period.name;
            this.applyFilters();
        };
        this.app.eventBus.on('period:select', periodHandler);
        this.eventListeners.push({ event: 'period:select', handler: periodHandler });

        // 监听筛选变化
        const filterHandler = ({ filters }) => {
            if (filters.category) this.filters.category = filters.category;
            if (filters.period) this.filters.period = filters.period;
            this.applyFilters();
        };
        this.app.eventBus.on('filter:results', filterHandler);
        this.eventListeners.push({ event: 'filter:results', handler: filterHandler });

        // 窗口大小变化
        const resizeHandler = () => {
            if (this.container) {
                this.container.style.height = (window.innerHeight - 180) + 'px';
                if (this.map) this.map.invalidateSize();
            }
        };
        window.addEventListener('resize', resizeHandler);
        this.eventListeners.push({ event: 'resize', handler: resizeHandler, target: window });
    }

    /**
     * 移除事件监听
     */
    removeEventListeners() {
        this.eventListeners.forEach(({ event, handler, target }) => {
            if (target) {
                target.removeEventListener(event, handler);
            } else {
                this.app.eventBus.off(event, handler);
            }
        });
        this.eventListeners = [];
    }

    /**
     * 定位到指定位置
     */
    flyTo(lat, lng, zoom = 10) {
        if (this.map) {
            this.map.flyTo([lat, lng], zoom, { duration: 1.5 });
        }
    }

    /**
     * 聚焦到节点
     */
    focusOnNode(nodeId) {
        const node = this.app.dataService.getNode(nodeId);
        if (node && node.location.coordinates) {
            const [lng, lat] = node.location.coordinates;
            this.flyTo(lat, lng, 8);

            // 找到并打开对应的标记
            const marker = this.markers.find(m => m.node.id === nodeId);
            if (marker) {
                marker.openPopup();
            }
        }
    }

    destroy() {
        this.hide();
        this.app.eventBus.emit('view:destroy', { view: 'map' });
    }
}

window.MapView = MapView;
