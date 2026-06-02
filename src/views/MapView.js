/**
 * 地图视图 - 地理可视化 v3.0 视觉革命版
 * 深色地图底图、朝代疆域覆盖、历史地标、小地图导航
 */
class MapView {
    static PERIODS = [
        { name: '春秋', start: -770, end: -476, color: '#8B4513' },
        { name: '战国', start: -475, end: -221, color: '#DAA520' },
        { name: '秦汉', start: -221, end: 220, color: '#CD853F' },
        { name: '三国', start: 220, end: 280, color: '#BC8F8F' },
        { name: '唐宋', start: 618, end: 1279, color: '#4A90E2' },
        { name: '明清', start: 1368, end: 1911, color: '#E74C3C' },
        { name: '近现代', start: 1911, end: 2024, color: '#9B59B6' }
    ];

    static CATEGORY_COLORS = {
        politics: '#ff6b6b',
        technology: '#4ecdc4',
        culture: '#a855f7',
        economy: '#22c55e',
        military: '#f97316',
        default: '#D4A853'
    };

    static CATEGORY_NAMES = {
        politics: '政治',
        technology: '科技',
        culture: '文化',
        economy: '经济',
        military: '军事'
    };

    // 朝代疆域数据（简化 GeoJSON 边界框）
    static DYNASTY_TERRITORIES = [
        {
            name: '秦', year: -221, color: '#4A4A4A',
            bounds: [[25, 100], [42, 120]],
            desc: '秦朝统一六国疆域'
        },
        {
            name: '汉', year: -100, color: '#CD853F',
            bounds: [[18, 95], [45, 125]],
            desc: '汉朝鼎盛时期疆域'
        },
        {
            name: '唐', year: 700, color: '#DAA520',
            bounds: [[20, 85], [50, 130]],
            desc: '唐朝鼎盛时期疆域'
        },
        {
            name: '宋', year: 1100, color: '#4A90E2',
            bounds: [[22, 105], [42, 125]],
            desc: '宋朝疆域'
        },
        {
            name: '元', year: 1280, color: '#2E8B57',
            bounds: [[15, 75], [55, 140]],
            desc: '元朝疆域（蒙古帝国）'
        },
        {
            name: '明', year: 1450, color: '#C0392B',
            bounds: [[18, 98], [50, 130]],
            desc: '明朝疆域'
        },
        {
            name: '清', year: 1790, color: '#8B0000',
            bounds: [[15, 75], [55, 140]],
            desc: '清朝鼎盛时期疆域'
        }
    ];

    // 历史地标数据
    static LANDMARKS = [
        { name: '长城', type: 'wall', coords: [40.4, 116.5], icon: '🏯', minZoom: 3, desc: '世界文化遗产' },
        { name: '丝绸之路（起点）', type: 'road', coords: [34.3, 108.9], icon: '🐪', minZoom: 3, desc: '长安出发', path: [[34.3, 108.9], [36.0, 103.8], [39.5, 98.5], [40.1, 94.7], [43.8, 87.6]] },
        { name: '大运河', type: 'water', coords: [34.0, 117.0], icon: '🚢', minZoom: 4, desc: '隋唐大运河' },
        { name: '敦煌', type: 'culture', coords: [40.1, 94.7], icon: '🏛️', minZoom: 4, desc: '莫高窟' },
        { name: '长安', type: 'capital', coords: [34.3, 108.9], icon: '👑', minZoom: 5, desc: '十三朝古都' },
        { name: '洛阳', type: 'capital', coords: [34.6, 112.4], icon: '👑', minZoom: 5, desc: '九朝古都' },
        { name: '北京', type: 'capital', coords: [39.9, 116.4], icon: '👑', minZoom: 5, desc: '元明清都城' },
        { name: '南京', type: 'capital', coords: [32.1, 118.8], icon: '👑', minZoom: 5, desc: '六朝古都' },
        { name: '杭州', type: 'capital', coords: [30.3, 120.2], icon: '🏯', minZoom: 5, desc: '南宋都城' },
        { name: '开封', type: 'capital', coords: [34.8, 114.3], icon: '🏯', minZoom: 5, desc: '北宋都城' },
        { name: '秦始皇陵', type: 'tomb', coords: [34.4, 109.3], icon: '⚰️', minZoom: 5, desc: '兵马俑' },
        { name: '都江堰', type: 'engineering', coords: [31.0, 103.6], icon: '💧', minZoom: 5, desc: '古代水利工程' },
        { name: '成都', type: 'city', coords: [30.6, 104.1], icon: '🎋', minZoom: 5, desc: '天府之国' },
        { name: '广州', type: 'port', coords: [23.1, 113.3], icon: '⛵', minZoom: 5, desc: '海上丝绸之路起点' },
        { name: '泉州', type: 'port', coords: [24.9, 118.6], icon: '⛵', minZoom: 5, desc: '宋元第一大港' },
    ];

    static CONFIG = {
        center: [35, 105],
        zoom: 4,
        minZoom: 2,
        maxZoom: 18,
        flyToDuration: 1.5
    };

    static TIME_RANGE = {
        min: -3000,
        max: 2024
    };

    constructor(app) {
        this.app = app;
        this.container = null;
        this.map = null;
        this.markers = [];
        this.markerClusters = [];
        this.territoryLayers = [];
        this.landmarkMarkers = [];
        this.landmarkLabels = [];
        this.miniMap = null;

        this.config = { ...MapView.CONFIG };
        this.timeRange = { start: MapView.TIME_RANGE.min, end: MapView.TIME_RANGE.max };
        this.filters = { category: null, period: null, minImportance: 0 };
        this.periods = [...MapView.PERIODS];
        this.eventListeners = [];

        this.uiElements = {};
        this.showTerritories = true;
        this.showLandmarks = true;
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
        this.addTerritories();
        this.addLandmarks();
        this.initMiniMap();
        this.initControls();
        this.initTimeline();
        this.loadData();
        this.setupEventListeners();

        this.app.eventBus.emit('view:ready', { view: 'map' });
    }

    hide() {
        this.removeEventListeners();
        if (this.miniMap) {
            this.miniMap.remove();
            this.miniMap = null;
        }
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        if (this.container) {
            this.container.remove();
        }
    }

    initMap() {
        this.map = L.map(this.container, {
            center: this.config.center,
            zoom: this.config.zoom,
            minZoom: this.config.minZoom,
            maxZoom: this.config.maxZoom,
            zoomControl: false,
            attributionControl: false
        });

        // 深色地图底图 - CartoDB Dark Matter
        const darkTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© CartoDB © OpenStreetMap',
            maxZoom: 19,
            subdomains: 'abcd'
        });
        darkTile.addTo(this.map);
        this.tileLayer = darkTile;

        // 自定义缩放控制（暗色风格）
        L.control.zoom({ position: 'topright' }).addTo(this.map);

        L.control.scale({
            position: 'bottomleft',
            imperial: false
        }).addTo(this.map);

        // 缩放事件
        let zoomTimeout;
        this.map.on('zoomend', () => {
            clearTimeout(zoomTimeout);
            zoomTimeout = setTimeout(() => {
                this.reclusterMarkers();
                this.updateLandmarkVisibility();
            }, 300);
        });
    }

    /** 添加朝代疆域覆盖 */
    addTerritories() {
        MapView.DYNASTY_TERRITORIES.forEach(dynasty => {
            const [[s, w], [n, e]] = dynasty.bounds;
            const polygon = L.polygon([
                [n, w], [n, e], [s, e], [s, w]
            ], {
                color: dynasty.color,
                weight: 1.5,
                opacity: 0.6,
                fillColor: dynasty.color,
                fillOpacity: 0.08,
                dashArray: '6, 3'
            }).addTo(this.map);

            polygon.bindTooltip(`${dynasty.name}朝疆域\n${dynasty.desc}`, {
                className: 'dynasty-tooltip',
                sticky: true
            });

            // 朝代名称标签
            const centerLat = (n + s) / 2;
            const centerLng = (w + e) / 2;
            const label = L.marker([centerLat, centerLng], {
                icon: L.divIcon({
                    className: 'dynasty-label',
                    html: `<div style="
                        color: ${dynasty.color};
                        font-family: 'Noto Serif SC', serif;
                        font-size: 14px;
                        font-weight: 700;
                        text-shadow: 0 0 10px ${dynasty.color}, 0 0 20px ${dynasty.color}40;
                        white-space: nowrap;
                        pointer-events: none;
                    ">${dynasty.name}</div>`,
                    iconSize: [50, 20],
                    iconAnchor: [25, 10]
                }),
                interactive: false
            }).addTo(this.map);

            this.territoryLayers.push({ polygon, label, dynasty });
        });
    }

    /** 添加历史地标 */
    addLandmarks() {
        MapView.LANDMARKS.forEach(lm => {
            // 丝绸之路用折线
            if (lm.path) {
                const latlngs = lm.path.map(p => [p[0], p[1]]);
                const polyline = L.polyline(latlngs, {
                    color: '#D4A853',
                    weight: 2.5,
                    opacity: 0.5,
                    dashArray: '8, 6',
                    className: 'silk-road-line'
                }).addTo(this.map);

                polyline.bindTooltip(lm.name, { sticky: true });
                this.landmarkMarkers.push({ marker: polyline, landmark: lm });
            }

            // 标记图标
            const icon = L.divIcon({
                className: 'landmark-icon',
                html: `<div class="landmark-marker" style="
                    font-size: ${lm.type === 'capital' ? '24px' : '18px'};
                    filter: drop-shadow(0 0 6px rgba(212, 168, 83, 0.6));
                    transition: transform 0.2s;
                    cursor: pointer;
                " onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'">${lm.icon}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([lm.coords[0], lm.coords[1]], { icon })
                .addTo(this.map);

            marker.bindTooltip(`<b>${lm.name}</b><br>${lm.desc}`, {
                className: 'landmark-tooltip',
                direction: 'top'
            });

            this.landmarkMarkers.push({ marker, landmark: lm });
        });

        // 初始可见性
        this.updateLandmarkVisibility();
    }

    /** 根据缩放级别动态显示/隐藏地标 */
    updateLandmarkVisibility() {
        const zoom = this.map.getZoom();
        this.landmarkMarkers.forEach(({ marker, landmark }) => {
            const visible = zoom >= (landmark.minZoom || 3);
            if (visible) {
                if (!this.map.hasLayer(marker)) marker.addTo(this.map);
            } else {
                if (this.map.hasLayer(marker)) marker.remove();
            }
        });
    }

    /** 初始化小地图 */
    initMiniMap() {
        const miniMapContainer = document.createElement('div');
        miniMapContainer.style.cssText = `
            position: absolute;
            bottom: 90px;
            right: 10px;
            width: 160px;
            height: 120px;
            border: 2px solid rgba(212, 168, 83, 0.4);
            border-radius: 8px;
            overflow: hidden;
            z-index: 1000;
            box-shadow: 0 2px 12px rgba(0,0,0,0.5);
        `;
        this.container.appendChild(miniMapContainer);

        // 创建小地图
        this.miniMap = L.map(miniMapContainer, {
            center: this.config.center,
            zoom: 2,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(this.miniMap);

        // 视口矩形
        this.miniMapRect = L.rectangle(this.map.getBounds(), {
            color: '#D4A853',
            weight: 2,
            fillOpacity: 0.15,
            fillColor: '#D4A853'
        }).addTo(this.miniMap);

        // 同步
        this.map.on('move', () => {
            this.miniMapRect.setBounds(this.map.getBounds());
        });

        // 点击小地图跳转
        miniMapContainer.addEventListener('click', (e) => {
            const rect = miniMapContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const latlng = this.miniMap.containerPointToLatLng([x, y]);
            if (latlng) {
                this.map.flyTo(latlng, this.map.getZoom(), { duration: 0.5 });
            }
        });
    }

    initControls() {
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'map-controls';
        controlsPanel.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(20, 16, 10, 0.92);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(212, 168, 83, 0.2);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 1000;
            min-width: 210px;
            backdrop-filter: blur(10px);
            color: #f0d68a;
            font-family: 'Noto Serif SC', serif;
        `;

        const labelStyle = 'display: block; font-weight: bold; margin-bottom: 5px; font-size: 13px;';
        const selectStyle = 'width: 100%; padding: 6px 8px; margin-bottom: 10px; border-radius: 4px; background: rgba(42,33,24,0.9); color: #f0d68a; border: 1px solid rgba(212,168,83,0.3); font-family: inherit;';

        // 分类筛选
        const categoryLabel = document.createElement('label');
        categoryLabel.textContent = '分类筛选:';
        categoryLabel.style.cssText = labelStyle;

        const categorySelect = document.createElement('select');
        categorySelect.style.cssText = selectStyle;
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
        periodLabel.style.cssText = labelStyle;

        const periodSelect = document.createElement('select');
        periodSelect.style.cssText = selectStyle;
        periodSelect.innerHTML = `
            <option value="">全部</option>
            ${this.periods.map(p => `<option value="${p.name}">${p.name} (${p.start} - ${p.end})</option>`).join('')}
        `;
        periodSelect.addEventListener('change', (e) => {
            this.filters.period = e.target.value || null;
            this.applyFilters();
        });

        // 图层切换
        const layerLabel = document.createElement('label');
        layerLabel.textContent = '图层:';
        layerLabel.style.cssText = labelStyle;

        const territoryToggle = document.createElement('label');
        territoryToggle.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 6px; cursor: pointer; font-size: 12px;';
        territoryToggle.innerHTML = `<input type="checkbox" checked id="territoryToggle"> 疆域覆盖`;
        territoryToggle.querySelector('input').addEventListener('change', (e) => {
            this.showTerritories = e.target.checked;
            this.territoryLayers.forEach(t => {
                if (this.showTerritories) {
                    t.polygon.addTo(this.map);
                    t.label.addTo(this.map);
                } else {
                    t.polygon.remove();
                    t.label.remove();
                }
            });
        });

        const landmarkToggle = document.createElement('label');
        landmarkToggle.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 10px; cursor: pointer; font-size: 12px;';
        landmarkToggle.innerHTML = `<input type="checkbox" checked id="landmarkToggle"> 历史地标`;
        landmarkToggle.querySelector('input').addEventListener('change', (e) => {
            this.showLandmarks = e.target.checked;
            this.landmarkMarkers.forEach(({ marker }) => {
                if (this.showLandmarks) {
                    marker.addTo(this.map);
                } else {
                    marker.remove();
                }
            });
        });

        // 重要性筛选
        const importanceLabel = document.createElement('label');
        importanceLabel.textContent = '最低重要性:';
        importanceLabel.style.cssText = labelStyle;

        const importanceRange = document.createElement('input');
        importanceRange.type = 'range';
        importanceRange.min = '1';
        importanceRange.max = '5';
        importanceRange.value = '1';
        importanceRange.style.cssText = 'width: 100%; margin-bottom: 5px; accent-color: #D4A853;';
        importanceRange.addEventListener('input', (e) => {
            this.filters.minImportance = parseInt(e.target.value);
            importanceValue.textContent = e.target.value;
        });
        importanceRange.addEventListener('change', () => this.applyFilters());

        const importanceValue = document.createElement('span');
        importanceValue.textContent = '1';
        importanceValue.style.cssText = 'font-size: 12px; color: #c9a96e;';

        // 重置按钮
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置筛选';
        resetBtn.style.cssText = `
            width: 100%;
            padding: 8px;
            background: rgba(212, 168, 83, 0.15);
            color: #D4A853;
            border: 1px solid rgba(212, 168, 83, 0.3);
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            font-family: inherit;
            transition: all 0.2s;
        `;
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.background = 'rgba(212, 168, 83, 0.3)';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.background = 'rgba(212, 168, 83, 0.15)';
        });
        resetBtn.addEventListener('click', () => this.resetFilters());

        // 统计信息
        const statsDiv = document.createElement('div');
        statsDiv.className = 'map-stats';
        statsDiv.style.cssText = `
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(212, 168, 83, 0.15);
            font-size: 12px;
            color: #c9a96e;
        `;

        controlsPanel.appendChild(categoryLabel);
        controlsPanel.appendChild(categorySelect);
        controlsPanel.appendChild(periodLabel);
        controlsPanel.appendChild(periodSelect);
        controlsPanel.appendChild(layerLabel);
        controlsPanel.appendChild(territoryToggle);
        controlsPanel.appendChild(landmarkToggle);
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

    initTimeline() {
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'map-timeline';
        timelineContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 55%;
            background: rgba(20, 16, 10, 0.92);
            padding: 12px 18px;
            border-radius: 8px;
            border: 1px solid rgba(212, 168, 83, 0.2);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;

        const title = document.createElement('div');
        title.textContent = '⏳ 时间轴筛选';
        title.style.cssText = 'font-weight: bold; margin-bottom: 8px; text-align: center; color: #D4A853; font-size: 13px;';

        const rangeDisplay = document.createElement('div');
        rangeDisplay.className = 'time-range-display';
        rangeDisplay.style.cssText = `
            text-align: center;
            margin-bottom: 8px;
            font-size: 13px;
            color: #D4A853;
            font-weight: 500;
        `;
        rangeDisplay.textContent = `${this.formatYear(this.timeRange.start)} - ${this.formatYear(this.timeRange.end)}`;

        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = 'position: relative; height: 40px;';

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

        const track = document.createElement('div');
        track.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            height: 4px;
            background: rgba(212, 168, 83, 0.2);
            border-radius: 2px;
            z-index: 1;
        `;

        const activeRange = document.createElement('div');
        activeRange.className = 'timeline-active';
        activeRange.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            height: 4px;
            background: linear-gradient(90deg, #D4A853, #F0D68A);
            border-radius: 2px;
            z-index: 1;
        `;

        const periodMarkers = document.createElement('div');
        periodMarkers.style.cssText = `
            position: absolute;
            top: 22px;
            width: 100%;
            font-size: 9px;
            color: #c9a96e;
        `;

        this.periods.forEach(period => {
            const marker = document.createElement('div');
            marker.textContent = period.name;
            marker.style.cssText = `
                position: absolute;
                left: ${this.percentForYear(period.start)}%;
                transform: translateX(-50%);
                cursor: pointer;
                transition: color 0.2s;
            `;
            marker.addEventListener('mouseenter', () => marker.style.color = '#D4A853');
            marker.addEventListener('mouseleave', () => marker.style.color = '');
            marker.addEventListener('click', () => {
                this.timeRange.start = period.start;
                this.timeRange.end = period.end;
                this.updateTimelineUI();
                this.applyFilters();
            });
            periodMarkers.appendChild(marker);
        });

        const updateUI = () => {
            let min = parseInt(minSlider.value);
            let max = parseInt(maxSlider.value);
            if (min > max - 50) {
                if (event.target === minSlider) { min = max - 50; minSlider.value = min; }
                else { max = min + 50; maxSlider.value = max; }
            }
            this.timeRange.start = min;
            this.timeRange.end = max;
            const minP = ((min + 3000) / 5024) * 100;
            const maxP = ((max + 3000) / 5024) * 100;
            activeRange.style.left = minP + '%';
            activeRange.style.width = (maxP - minP) + '%';
            rangeDisplay.textContent = `${this.formatYear(min)} - ${this.formatYear(max)}`;
        };

        minSlider.addEventListener('input', updateUI);
        maxSlider.addEventListener('input', updateUI);
        maxSlider.addEventListener('change', () => this.applyFilters());
        minSlider.addEventListener('change', () => this.applyFilters());

        const style = document.createElement('style');
        style.textContent = `
            .map-timeline input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 14px; height: 14px;
                background: #D4A853;
                border-radius: 50%;
                cursor: pointer;
                pointer-events: auto;
                box-shadow: 0 0 8px rgba(212, 168, 83, 0.6);
            }
            .map-timeline input[type="range"]::-moz-range-thumb {
                width: 14px; height: 14px;
                background: #D4A853;
                border-radius: 50%;
                cursor: pointer;
                pointer-events: auto;
                border: none;
                box-shadow: 0 0 8px rgba(212, 168, 83, 0.6);
            }
            .dynasty-tooltip, .landmark-tooltip {
                background: rgba(20, 16, 10, 0.92) !important;
                border: 1px solid rgba(212, 168, 83, 0.3) !important;
                color: #f0d68a !important;
                border-radius: 6px !important;
                font-family: 'Noto Serif SC', serif !important;
                padding: 6px 10px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
            }
            .leaflet-popup-content-wrapper {
                background: rgba(20, 16, 10, 0.95) !important;
                color: #f0d68a !important;
                border: 1px solid rgba(212, 168, 83, 0.3) !important;
                border-radius: 8px !important;
                font-family: 'Noto Serif SC', serif !important;
            }
            .leaflet-popup-tip { background: rgba(20, 16, 10, 0.95) !important; }
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

    percentForYear(year) {
        return ((year - MapView.TIME_RANGE.min) / (MapView.TIME_RANGE.max - MapView.TIME_RANGE.min)) * 100;
    }

    formatYear(year) {
        return year < 0 ? `公元前${Math.abs(year)}年` : `${year}年`;
    }

    getPeriodForYear(year) {
        return this.periods.find(p => year >= p.start && year <= p.end);
    }

    getMarkerRadius(node) {
        return 5 + (node.metadata?.importance || 3) * 2;
    }

    getMarkerColor(node) {
        return MapView.CATEGORY_COLORS[node.category?.primary] || MapView.CATEGORY_COLORS.default;
    }

    getCategoryName(category) {
        return MapView.CATEGORY_NAMES[category] || category;
    }

    updateTimelineUI() {
        const { minSlider, maxSlider, activeRange, rangeDisplay } = this.timelineElements;
        minSlider.value = this.timeRange.start;
        maxSlider.value = this.timeRange.end;
        const minP = ((this.timeRange.start + 3000) / 5024) * 100;
        const maxP = ((this.timeRange.end + 3000) / 5024) * 100;
        activeRange.style.left = minP + '%';
        activeRange.style.width = (maxP - minP) + '%';
        rangeDisplay.textContent = `${this.formatYear(this.timeRange.start)} - ${this.formatYear(this.timeRange.end)}`;
    }

    loadData() {
        this.clearMarkers();
        const nodes = Array.from(this.app.dataService.nodes.values());
        nodes.forEach(node => {
            if (node.location.coordinates) {
                this.addMarker(node);
            }
        });
        this.updateStats();
    }

    addMarker(node) {
        if (!node.location?.coordinates) return;
        if (node.time?.year && (node.time.year < this.timeRange.start || node.time.year > this.timeRange.end)) return;
        const currentZoom = this.map.getZoom();
        if (currentZoom < 6) {
            this.addToCluster(node);
        } else {
            this.createSingleMarker(node);
        }
    }

    createSingleMarker(node) {
        const [lng, lat] = node.location.coordinates;
        const color = this.getMarkerColor(node);

        const marker = L.circleMarker([lat, lng], {
            radius: this.getMarkerRadius(node),
            fillColor: color,
            color: '#D4A853',
            weight: 1.5,
            opacity: 0.8,
            fillOpacity: 0.7,
            className: 'map-marker'
        }).addTo(this.map);

        marker.bindPopup(this.createPopupContent(node), {
            maxWidth: 350,
            className: 'map-popup-container'
        });

        marker.on('click', () => this.onMarkerClick(node));
        marker.on('mouseover', () => marker.setStyle({ fillOpacity: 1, weight: 2.5 }));
        marker.on('mouseout', () => marker.setStyle({ fillOpacity: 0.7, weight: 1.5 }));

        marker.node = node;
        marker.isCluster = false;
        this.markers.push(marker);
    }

    addToCluster(node) {
        const [lng, lat] = node.location.coordinates;
        let cluster = this.markerClusters.find(c => {
            const [cLng, cLat] = c.center;
            return Math.sqrt(Math.pow(lng - cLng, 2) + Math.pow(lat - cLat, 2)) < 1;
        });
        if (cluster) {
            cluster.nodes.push(node);
            this.updateClusterMarker(cluster);
        } else {
            const newCluster = { center: [lng, lat], nodes: [node], marker: null };
            this.markerClusters.push(newCluster);
            this.updateClusterMarker(newCluster);
        }
    }

    updateClusterMarker(cluster) {
        if (cluster.marker) cluster.marker.remove();
        const [lng, lat] = cluster.center;
        const count = cluster.nodes.length;
        const radius = Math.min(30, 10 + count * 2);

        const marker = L.circleMarker([lat, lng], {
            radius, fillColor: '#D4A853', color: '#F0D68A',
            weight: 2, opacity: 0.8, fillOpacity: 0.5
        }).addTo(this.map);

        marker.bindPopup(this.createClusterPopupContent(cluster), { maxWidth: 400 });
        marker.on('click', () => this.expandCluster(cluster));

        cluster.marker = marker;
    }

    createClusterPopupContent(cluster) {
        const nodes = cluster.nodes;
        return `
            <div class="map-popup" style="min-width: 280px; color: #f0d68a;">
                <h3 style="margin: 0 0 10px; font-size: 15px; color: #D4A853;">该区域共 ${nodes.length} 个事件</h3>
                <div style="max-height: 180px; overflow-y: auto;">
                    ${nodes.slice(0, 8).map(n => `<div style="padding: 6px 0; border-bottom: 1px solid rgba(212,168,83,0.15);">
                        <strong style="color: #D4A853;">${n.name}</strong>
                        <span style="color: #c9a96e; font-size: 11px; margin-left: 6px;">${n.time?.displayDate || ''}</span>
                    </div>`).join('')}
                    ${nodes.length > 8 ? `<div style="text-align:center;color:#c9a96e;padding:6px;">...还有 ${nodes.length - 8} 个</div>` : ''}
                </div>
            </div>`;
    }

    expandCluster(cluster) {
        const [lng, lat] = cluster.center;
        this.flyTo(lat, lng, 8);
    }

    clearClusters() {
        this.markerClusters.forEach(c => { if (c.marker) c.marker.remove(); });
        this.markerClusters = [];
    }

    createPopupContent(node) {
        const period = this.getPeriodForYear(node.time?.year);
        const catName = this.getCategoryName(node.category?.primary);
        return `
            <div class="map-popup" style="min-width: 260px; color: #f0d68a;">
                <h3 style="margin: 0 0 8px; font-size: 15px; color: #D4A853;">${node.name}</h3>
                <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
                    <span style="padding:2px 8px;background:rgba(212,168,83,0.2);color:#D4A853;border-radius:10px;font-size:11px;">
                        ${node.time?.displayDate || '未知'}
                    </span>
                    ${period ? `<span style="padding:2px 8px;background:${period.color}30;color:${period.color};border-radius:10px;font-size:11px;">${period.name}</span>` : ''}
                    <span style="padding:2px 8px;background:rgba(255,255,255,0.08);color:#c9a96e;border-radius:10px;font-size:11px;">${catName}</span>
                </div>
                <p style="margin:0 0 8px;color:#c9a96e;line-height:1.5;font-size:13px;">${node.summary || node.description || ''}</p>
                ${node.location?.name ? `<div style="color:#c9a96e;font-size:11px;">📍 ${node.location.name}</div>` : ''}
            </div>`;
    }

    onMarkerClick(node) {
        this.app.eventBus?.emit('node:select', node);
        if (window.audioManager) window.audioManager.playClick();
    }

    passesFilters(node) {
        if (node.time?.year && (node.time.year < this.timeRange.start || node.time.year > this.timeRange.end)) return false;
        if (this.filters.category && node.category?.primary !== this.filters.category) return false;
        if (this.filters.period) {
            const period = this.getPeriodForYear(node.time?.year);
            if (!period || period.name !== this.filters.period) return false;
        }
        if ((node.metadata?.importance || 0) < this.filters.minImportance) return false;
        return true;
    }

    applyFilters() {
        this.markers.forEach(marker => {
            const visible = this.passesFilters(marker.node);
            if (visible) marker.addTo(this.map);
            else marker.remove();
        });
        this.updateStats();
    }

    resetFilters() {
        this.filters = { category: null, period: null, minImportance: 0 };
        this.timeRange = { start: -3000, end: 2024 };
        this.categorySelect.value = '';
        this.periodSelect.value = '';
        this.importanceRange.value = '1';
        this.updateTimelineUI();
        this.applyFilters();
    }

    clearMarkers() {
        this.markers.forEach(m => m.remove());
        this.markers = [];
        this.clearClusters();
    }

    updateStats() {
        const visible = this.markers.filter(m => this.map.hasLayer(m)).length;
        const total = this.markers.length + this.markerClusters.reduce((s, c) => s + c.nodes.length, 0);
        this.statsDiv.textContent = `显示 ${visible} / 总计 ${total} 个`;
    }

    reclusterMarkers() {
        const allNodes = [];
        this.markers.forEach(m => { if (m.node) allNodes.push(m.node); });
        this.markerClusters.forEach(c => allNodes.push(...c.nodes));
        this.clearMarkers();
        allNodes.forEach(node => { if (this.passesFilters(node)) this.addMarker(node); });
        this.updateStats();
    }

    setupEventListeners() {
        const timeHandler = ({ start, end }) => {
            if (start !== undefined) this.timeRange.start = Math.round(start);
            if (end !== undefined) this.timeRange.end = Math.round(end);
            this.updateTimelineUI();
            this.applyFilters();
        };
        this.app.eventBus.on('timeline:brush', timeHandler);
        this.eventListeners.push({ event: 'timeline:brush', handler: timeHandler });

        const periodHandler = (period) => {
            this.filters.period = period.name;
            this.periodSelect.value = period.name;
            this.applyFilters();
        };
        this.app.eventBus.on('period:select', periodHandler);
        this.eventListeners.push({ event: 'period:select', handler: periodHandler });

        const filterHandler = ({ filters }) => {
            if (filters.category) this.filters.category = filters.category;
            if (filters.period) this.filters.period = filters.period;
            this.applyFilters();
        };
        this.app.eventBus.on('filter:results', filterHandler);
        this.eventListeners.push({ event: 'filter:results', handler: filterHandler });

        const resizeHandler = () => {
            if (this.container) {
                this.container.style.height = (window.innerHeight - 180) + 'px';
                if (this.map) this.map.invalidateSize();
            }
        };
        window.addEventListener('resize', resizeHandler);
        this.eventListeners.push({ event: 'resize', handler: resizeHandler, target: window });
    }

    removeEventListeners() {
        this.eventListeners.forEach(({ event, handler, target }) => {
            if (target) target.removeEventListener(event, handler);
            else this.app.eventBus.off(event, handler);
        });
        this.eventListeners = [];
    }

    focusOnNode(nodeId) {
        const node = this.app.dataService?.getNode(nodeId);
        if (!node?.location?.coordinates) return;
        const [lng, lat] = node.location.coordinates;
        this.flyTo(lat, lng, 8);
        this.markers.find(m => m.node?.id === nodeId)?.openPopup();
    }

    flyTo(lat, lng, zoom = 10) {
        if (this.map) this.map.flyTo([lat, lng], zoom, { duration: MapView.CONFIG.flyToDuration });
    }

    destroy() {
        this.hide();
        this.app.eventBus.emit('view:destroy', { view: 'map' });
    }
}

window.MapView = MapView;
