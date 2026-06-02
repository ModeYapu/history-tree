/**
 * 增强时间轴视图 v3.0 视觉革命版
 * 三维深度效果、朝代渐变背景、事件粒子爆发、惯性滚动+视差、天命指示器
 */
class TimelineView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.svg = null;
        this.particleCanvas = null;
        this.particleCtx = null;
        this.particles = [];
        this.particleAnimId = null;

        this.config = {
            width: window.innerWidth,
            height: window.innerHeight - 80,
            margin: { top: 80, right: 30, bottom: 60, left: 120 },
            minYear: -3500,
            maxYear: 2100,
            eventRadius: 6,
            colors: {
                politics: '#ff6b6b',
                technology: '#4ecdc4',
                culture: '#a855f7',
                economy: '#22c55e',
                military: '#f97316'
            }
        };

        // 朝代渐变色映射
        this.dynastyGradients = [
            { name: '先秦', start: -3500, end: -221, colorStart: '#4A3728', colorEnd: '#8B6914' },
            { name: '秦汉', start: -221, end: 220, colorStart: '#8B6914', colorEnd: '#CD853F' },
            { name: '魏晋南北朝', start: 220, end: 589, colorStart: '#CD853F', colorEnd: '#9370DB' },
            { name: '隋唐', start: 581, end: 907, colorStart: '#DAA520', colorEnd: '#FFD700' },
            { name: '宋朝', start: 960, end: 1279, colorStart: '#4A90E2', colorEnd: '#87CEEB' },
            { name: '元朝', start: 1271, end: 1368, colorStart: '#2E8B57', colorEnd: '#98FB98' },
            { name: '明朝', start: 1368, end: 1644, colorStart: '#C0392B', colorEnd: '#E74C3C' },
            { name: '清朝', start: 1644, end: 1911, colorStart: '#8B0000', colorEnd: '#DC143C' },
            { name: '近现代', start: 1911, end: 2100, colorStart: '#4169E1', colorEnd: '#00CED1' }
        ];

        this.timeScale = null;
        this.xScale = null;
        this.yScale = null;
        this.brush = null;
        this.focusScale = null;
        this.currentPeriod = null;
        this.hoveredEvent = null;

        this.data = {
            events: [],
            periods: [],
            clusters: []
        };

        this.zoom = null;
        this.velocity = 0;
        this.lastTransform = null;
    }

    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'timeline-view';
        this.container.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        `;

        // 粒子背景 Canvas
        this.createParticleCanvas();

        this.createControls();
        this.createMandateIndicator();
        this.createSVG();

        this.loadData();
        this.calculateScales();
        this.render();

        document.querySelector(this.app.options.container).appendChild(this.container);
        this.app.eventBus.emit('view:ready', { view: 'timeline' });
    }

    hide() {
        if (this.particleAnimId) cancelAnimationFrame(this.particleAnimId);
        if (this.eventDetail) { this.eventDetail.destroy(); this.eventDetail = null; }
        if (this.container) this.container.remove();
    }

    // ── 粒子背景 ──────────────────────────────────

    createParticleCanvas() {
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvas.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 0;
            pointer-events: none;
        `;
        this.particleCtx = this.particleCanvas.getContext('2d');
        this.resizeParticleCanvas();
        this.container.appendChild(this.particleCanvas);

        // 初始化漂浮粒子
        for (let i = 0; i < 60; i++) {
            this.particles.push({
                x: Math.random() * this.config.width,
                y: Math.random() * this.config.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.2,
                r: 1 + Math.random() * 2,
                alpha: 0.1 + Math.random() * 0.3,
                color: Math.random() > 0.7 ? '#D4A853' : '#c9a96e'
            });
        }
        this.animateParticles();
    }

    resizeParticleCanvas() {
        this.particleCanvas.width = this.config.width;
        this.particleCanvas.height = this.config.height;
    }

    animateParticles() {
        const ctx = this.particleCtx;
        ctx.clearRect(0, 0, this.config.width, this.config.height);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = this.config.width;
            if (p.x > this.config.width) p.x = 0;
            if (p.y < 0) p.y = this.config.height;
            if (p.y > this.config.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        this.particleAnimId = requestAnimationFrame(() => this.animateParticles());
    }

    /** 事件粒子爆发效果 */
    emitParticles(x, y, type) {
        const colorMap = {
            military: '#ff4444',
            technology: '#4488ff',
            culture: '#aa44ff',
            economy: '#44ff88',
            politics: '#ff6644'
        };
        const color = colorMap[type] || '#D4A853';
        const count = type === 'military' ? 20 : 12;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
            const speed = 1 + Math.random() * 3;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: 1 + Math.random() * 3,
                alpha: 0.8,
                color,
                life: 60,
                maxLife: 60
            });
        }
    }

    // ── 天命指示器 ──────────────────────────────────

    createMandateIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'mandate-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 40px;
            z-index: 10;
            pointer-events: none;
        `;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '300');
        svg.setAttribute('height', '40');
        svg.setAttribute('viewBox', '0 0 300 40');

        // 天命曲线（朝代兴衰）
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', this.generateMandatePath());
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#D4A853');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('opacity', '0.6');
        path.id = 'mandate-path';
        svg.appendChild(path);

        // 填充区域
        const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        area.setAttribute('d', this.generateMandatePath() + ' L300,40 L0,40 Z');
        area.setAttribute('fill', 'url(#mandateGradient)');
        area.setAttribute('opacity', '0.2');
        svg.appendChild(area);

        // 渐变定义
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.id = 'mandateGradient';
        grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
        grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', '#D4A853');
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', 'transparent');
        grad.appendChild(stop1); grad.appendChild(stop2);
        defs.appendChild(grad);
        svg.insertBefore(defs, svg.firstChild);

        indicator.appendChild(svg);
        this.container.appendChild(indicator);

        // 标题
        const label = document.createElement('div');
        label.style.cssText = `
            position: absolute;
            top: 2px;
            left: 0;
            width: 300px;
            text-align: center;
            font-size: 10px;
            color: #D4A853;
            opacity: 0.7;
            font-family: 'Noto Serif SC', serif;
        `;
        label.textContent = '天命 · 朝代兴衰';
        indicator.appendChild(label);
    }

    generateMandatePath() {
        // 简化的朝代兴衰曲线
        const peaks = [
            { x: 10, y: 30 },   // 先秦：兴起
            { x: 40, y: 12 },   // 秦汉：鼎盛
            { x: 55, y: 25 },   // 三国：衰落
            { x: 75, y: 15 },   // 隋唐：再盛
            { x: 90, y: 20 },   // 宋朝：平稳
            { x: 110, y: 10 },  // 元朝：巅峰
            { x: 130, y: 18 },  // 明朝：复兴
            { x: 160, y: 22 },  // 清前期：稳定
            { x: 180, y: 8 },   // 清鼎盛
            { x: 210, y: 30 },  // 清末衰落
            { x: 240, y: 20 },  // 民国动荡
            { x: 270, y: 15 },  // 现代上升
            { x: 290, y: 10 },  // 当代
        ];

        return `M${peaks[0].x},${peaks[0].y} ` +
            peaks.slice(1).map(p => `Q${(p.x + peaks[peaks.indexOf(p) - 1].x) / 2},${Math.min(p.y, peaks[peaks.indexOf(p) - 1].y) - 5} ${p.x},${p.y}`).join(' ');
    }

    // ── 控制面板 ──────────────────────────────────

    createControls() {
        const controls = document.createElement('div');
        controls.className = 'timeline-controls';
        controls.style.cssText = `
            position: absolute;
            top: 55px;
            left: 10px;
            right: 10px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
            padding: 10px 14px;
            background: rgba(20, 16, 10, 0.92);
            border: 1px solid rgba(212, 168, 83, 0.2);
            border-radius: 8px;
            backdrop-filter: blur(10px);
            gap: 10px;
        `;

        const leftControls = document.createElement('div');
        leftControls.style.cssText = 'display: flex; gap: 10px; align-items: center; flex-wrap: wrap;';

        leftControls.appendChild(this.createButton('🔍+ 放大', () => this.zoomIn()));
        leftControls.appendChild(this.createButton('🔍- 缩小', () => this.zoomOut()));
        leftControls.appendChild(this.createButton('↺ 重置', () => this.resetView()));
        leftControls.appendChild(this.createTimeRangeSelector());

        const rightInfo = document.createElement('div');
        rightInfo.style.cssText = 'display: flex; gap: 16px; align-items: center; font-size: 12px; color: #c9a96e;';

        const yearInfo = document.createElement('div');
        yearInfo.id = 'yearRange';
        yearInfo.innerHTML = `<span style="color:#D4A853;">范围:</span> ${this.formatYear(this.config.minYear)} - ${this.formatYear(this.config.maxYear)}`;

        const eventCount = document.createElement('div');
        eventCount.id = 'eventCount';
        eventCount.innerHTML = `<span style="color:#D4A853;">事件:</span> 0`;

        rightInfo.appendChild(yearInfo);
        rightInfo.appendChild(eventCount);

        controls.appendChild(leftControls);
        controls.appendChild(rightInfo);
        this.container.appendChild(controls);
    }

    createTimeRangeSelector() {
        const selector = document.createElement('div');
        selector.style.cssText = 'display: flex; align-items: center; gap: 6px;';

        const label = document.createElement('span');
        label.textContent = '时期:';
        label.style.cssText = 'font-size: 11px; color: #c9a96e;';

        const select = document.createElement('select');
        select.style.cssText = `
            padding: 5px 10px;
            background: rgba(212, 168, 83, 0.1);
            border: 1px solid rgba(212, 168, 83, 0.25);
            border-radius: 6px;
            color: #f0d68a;
            font-size: 11px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
        `;

        [
            { name: '全部历史', start: -3500, end: 2100 },
            { name: '远古时代', start: -3500, end: -500 },
            { name: '古典时代', start: -500, end: 500 },
            { name: '中世纪', start: 500, end: 1500 },
            { name: '唐宋盛世', start: 618, end: 1279 },
            { name: '元明清', start: 1271, end: 1911 },
            { name: '近现代', start: 1900, end: 2100 }
        ].forEach(period => {
            const option = document.createElement('option');
            option.value = JSON.stringify(period);
            option.textContent = period.name;
            select.appendChild(option);
        });

        select.addEventListener('change', () => {
            const selected = JSON.parse(select.value);
            this.jumpToPeriod(selected.start, selected.end);
        });

        selector.appendChild(label);
        selector.appendChild(select);
        return selector;
    }

    jumpToPeriod(startYear, endYear) {
        this.config.minYear = startYear;
        this.config.maxYear = endYear;
        this.xScale = d3.scaleLinear()
            .domain([startYear, endYear])
            .range([this.config.margin.left, this.config.width - this.config.margin.right]);
        this.render();
        this.svg.transition().call(this.zoom.transform, d3.zoomIdentity);
    }

    createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 6px 12px;
            background: rgba(212, 168, 83, 0.1);
            border: 1px solid rgba(212, 168, 83, 0.25);
            border-radius: 6px;
            color: #c9a96e;
            font-size: 11px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
            transition: all 0.2s;
        `;
        btn.addEventListener('click', onClick);
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(212, 168, 83, 0.25)';
            btn.style.color = '#D4A853';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(212, 168, 83, 0.1)';
            btn.style.color = '#c9a96e';
        });
        return btn;
    }

    // ── SVG 渲染 ──────────────────────────────────

    createSVG() {
        const svgContainer = document.createElement('div');
        svgContainer.style.cssText = 'flex: 1; position: relative; overflow: hidden;';

        this.svg = d3.select(svgContainer)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.config.width} ${this.config.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // 渐变定义
        this.createSVGDefs();

        this.mainGroup = this.svg.append('g').attr('class', 'timeline-main');
        this.bgGroup = this.svg.append('g').attr('class', 'timeline-bg').attr('opacity', 0.15);

        this.initZoom();

        this.container.appendChild(svgContainer);
        this.createMiniMap();
        this.createTooltip();
    }

    createSVGDefs() {
        const defs = this.svg.append('defs');

        // 朝代渐变色
        this.dynastyGradients.forEach((dg, i) => {
            const grad = defs.append('linearGradient')
                .attr('id', `dynasty-grad-${i}`)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '100%').attr('y2', '0%');
            grad.append('stop').attr('offset', '0%').attr('stop-color', dg.colorStart);
            grad.append('stop').attr('offset', '100%').attr('stop-color', dg.colorEnd);
        });

        // 发光滤镜
        const glow = defs.append('filter').attr('id', 'timeline-glow');
        glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
        const merge = glow.append('feMerge');
        merge.append('feMergeNode').attr('in', 'coloredBlur');
        merge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    initZoom() {
        let lastX = 0;
        let lastTime = 0;

        this.zoom = d3.zoom()
            .scaleExtent([0.5, 10])
            .on('start', (event) => {
                lastX = event.transform.x;
                lastTime = Date.now();
            })
            .on('zoom', (event) => {
                // 视差效果：背景移动慢于前景
                const dx = event.transform.x - lastX;
                const dt = Date.now() - lastTime;

                this.mainGroup.attr('transform', event.transform);

                // 视差：背景以不同速度移动
                const currentK = event.transform.k;
                this.bgGroup.attr('transform',
                    `translate(${event.transform.x * 0.6}, 0) scale(${1 + (currentK - 1) * 0.3})`);

                // 计算速度用于惯性
                if (dt > 0) {
                    this.velocity = dx / dt;
                }

                lastX = event.transform.x;
                lastTime = Date.now();
                this.updateYearRange();
            })
            .on('end', () => {
                // 惯性滚动
                if (Math.abs(this.velocity) > 0.1) {
                    const inertiaX = this.velocity * 300;
                    const currentTransform = d3.zoomTransform(this.svg.node());
                    const newTransform = currentTransform.translate(inertiaX, 0);

                    this.svg.transition()
                        .duration(500)
                        .ease(d3.easeCubicOut)
                        .call(this.zoom.transform, newTransform);
                }
                this.velocity = 0;
            });

        this.svg.call(this.zoom);
    }

    createMiniMap() {
        const miniMapContainer = document.createElement('div');
        miniMapContainer.style.cssText = `
            position: absolute;
            bottom: 15px;
            right: 15px;
            width: 180px;
            height: 50px;
            background: rgba(20, 16, 10, 0.92);
            border: 1px solid rgba(212, 168, 83, 0.25);
            border-radius: 6px;
            overflow: hidden;
            z-index: 10;
        `;

        const miniMapSVG = d3.select(miniMapContainer)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.miniMap = {
            container: miniMapContainer,
            svg: miniMapSVG,
            rect: miniMapSVG.append('rect')
                .attr('fill', 'rgba(212, 168, 83, 0.15)')
                .attr('stroke', 'rgba(212, 168, 83, 0.5)')
                .attr('stroke-width', 1)
        };

        this.container.appendChild(miniMapContainer);
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.style.cssText = `
            position: absolute;
            background: rgba(20, 16, 10, 0.95);
            border: 1px solid rgba(212, 168, 83, 0.4);
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 13px;
            color: #f0d68a;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 1000;
            max-width: 300px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: 'Noto Serif SC', serif;
        `;
        document.body.appendChild(this.tooltip);
    }

    showTooltip(event, data) {
        const color = this.getCategoryColor(data.category);
        this.tooltip.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:16px;">${this.getEventIcon(data.type)}</span>
                <span style="font-weight:600;color:#D4A853;">${data.name}</span>
            </div>
            <div style="margin-bottom:6px;color:#c9a96e;font-size:12px;">
                ${this.formatYear(data.year)} · ${data.location || '未知地点'}
            </div>
            <div style="margin-bottom:8px;color:#f0d68a;line-height:1.4;font-size:13px;">
                ${data.description || data.summary || '暂无描述'}
            </div>
            <div style="display:flex;gap:6px;">
                <span style="padding:2px 8px;background:${color}25;border:1px solid ${color}50;border-radius:4px;font-size:11px;color:${color};">
                    ${this.getCategoryName(data.category)}
                </span>
            </div>
        `;
        const rect = this.container.getBoundingClientRect();
        this.tooltip.style.left = `${event.clientX - rect.left + 20}px`;
        this.tooltip.style.top = `${event.clientY - rect.top + 20}px`;
        this.tooltip.style.opacity = '1';
    }

    hideTooltip() {
        this.tooltip.style.opacity = '0';
    }

    loadData() {
        const allNodes = Array.from(this.app.dataService.nodes.values());
        this.data.events = allNodes
            .filter(node => node.year || node.time?.year)
            .map(node => ({
                id: node.id, name: node.name,
                year: node.year || node.time?.year,
                type: node.type,
                category: node.category?.primary || node.category,
                importance: node.importance || node.metadata?.importance || 1,
                location: node.location?.name || node.location,
                description: node.description,
                summary: node.summary,
                period: node.period || node.time?.period
            }))
            .sort((a, b) => a.year - b.year);

        this.data.periods = this.definePeriods();
    }

    definePeriods() {
        return [
            { name: '远古时代', start: -3500, end: -500, color: '#8B4513', icon: '🏺' },
            { name: '古典时代', start: -500, end: 500, color: '#DAA520', icon: '🏛️' },
            { name: '中世纪', start: 500, end: 1500, color: '#CD853F', icon: '⚔️' },
            { name: '文艺复兴', start: 1400, end: 1600, color: '#9370DB', icon: '🎨' },
            { name: '近代早期', start: 1500, end: 1800, color: '#BC8F8F', icon: '📜' },
            { name: '工业时代', start: 1760, end: 1900, color: '#708090', icon: '⚙️' },
            { name: '20世纪', start: 1900, end: 2000, color: '#4A90E2', icon: '🌍' },
            { name: '21世纪', start: 2000, end: 2100, color: '#00CED1', icon: '💻' }
        ];
    }

    calculateScales() {
        this.xScale = d3.scaleLinear()
            .domain([this.config.minYear, this.config.maxYear])
            .range([this.config.margin.left, this.config.width - this.config.margin.right]);

        this.yScale = d3.scaleBand()
            .domain(this.data.periods.map(p => p.name))
            .range([this.config.margin.top, this.config.height - this.config.margin.bottom])
            .padding(0.3);
    }

    render() {
        this.mainGroup.selectAll('*').remove();
        this.bgGroup.selectAll('*').remove();
        this.renderDynastyBackgrounds();
        this.renderPeriods();
        this.renderAxis();
        this.renderEvents();
        this.renderCurrentYearLine();
        this.updateMiniMap();
        this.updateInfo();
    }

    /** 渲染朝代渐变背景 */
    renderDynastyBackgrounds() {
        this.bgGroup.selectAll('.dynasty-bg')
            .data(this.dynastyGradients)
            .enter()
            .append('rect')
            .attr('class', 'dynasty-bg')
            .attr('x', d => this.xScale(Math.max(d.start, this.config.minYear)))
            .attr('y', 0)
            .attr('width', d => {
                const s = Math.max(d.start, this.config.minYear);
                const e = Math.min(d.end, this.config.maxYear);
                return Math.max(0, this.xScale(e) - this.xScale(s));
            })
            .attr('height', this.config.height)
            .attr('fill', (d, i) => `url(#dynasty-grad-${i})`)
            .attr('opacity', 0.6);
    }

    renderPeriods() {
        const { margin } = this.config;

        const periodGroups = this.mainGroup.selectAll('.period-group')
            .data(this.data.periods)
            .enter().append('g').attr('class', 'period-group');

        periodGroups.append('rect')
            .attr('x', d => this.xScale(Math.max(d.start, this.config.minYear)))
            .attr('y', d => this.yScale(d.name))
            .attr('width', d => {
                const s = Math.max(d.start, this.config.minYear);
                const e = Math.min(d.end, this.config.maxYear);
                return this.xScale(e) - this.xScale(s);
            })
            .attr('height', this.yScale.bandwidth())
            .attr('fill', d => d.color)
            .attr('opacity', 0.12)
            .attr('rx', 4);

        periodGroups.append('text')
            .attr('x', d => {
                const s = Math.max(d.start, this.config.minYear);
                const e = Math.min(d.end, this.config.maxYear);
                return (this.xScale(s) + this.xScale(e)) / 2;
            })
            .attr('y', d => this.yScale(d.name) + this.yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', '600')
            .attr('fill', d => d.color)
            .text(d => `${d.icon} ${d.name}`);

        periodGroups.append('line')
            .attr('x1', d => this.xScale(Math.max(d.start, this.config.minYear)))
            .attr('x2', d => this.xScale(Math.max(d.start, this.config.minYear)))
            .attr('y1', margin.top)
            .attr('y2', this.config.height - margin.bottom)
            .attr('stroke', d => d.color)
            .attr('stroke-width', 0.8)
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.25);
    }

    renderAxis() {
        const { height, margin } = this.config;
        const xAxis = d3.axisBottom(this.xScale)
            .tickFormat(d => this.formatYear(d))
            .ticks(15)
            .tickSize(-height + margin.top + margin.bottom)
            .tickPadding(10);

        const axisGroup = this.mainGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        axisGroup.selectAll('.tick line').attr('stroke', 'rgba(212, 168, 83, 0.08)');
        axisGroup.selectAll('.tick text').attr('fill', '#c9a96e').attr('font-size', '10px');
        axisGroup.select('.domain').attr('stroke', 'rgba(212, 168, 83, 0.2)');
    }

    renderEvents() {
        const eventsWithRow = this.data.events.map(event => {
            const period = this.data.periods.find(p => event.year >= p.start && event.year < p.end);
            return { ...event, periodName: period ? period.name : '未知', periodColor: period ? period.color : '#999' };
        });

        const eventGroups = this.mainGroup.selectAll('.event-group')
            .data(eventsWithRow)
            .enter().append('g')
            .attr('class', 'event-group')
            .attr('transform', d => {
                const x = this.xScale(d.year);
                const y = this.yScale(d.periodName) + this.yScale.bandwidth() / 2;
                return `translate(${x}, ${y})`;
            })
            .style('cursor', 'pointer')
            .on('click', (event, d) => this.onEventClick(d))
            .on('mouseover', (event, d) => {
                this.showTooltip(event, d);
                // 粒子爆发
                const rect = this.container.getBoundingClientRect();
                this.emitParticles(event.clientX - rect.left, event.clientY - rect.top, d.category);
                d3.select(event.currentTarget).select('circle').transition().duration(200)
                    .attr('r', this.config.eventRadius * 2)
                    .attr('stroke-width', 3);
            })
            .on('mouseout', (event) => {
                this.hideTooltip();
                d3.select(event.currentTarget).select('circle').transition().duration(200)
                    .attr('r', this.config.eventRadius)
                    .attr('stroke-width', 2);
            });

        // Z轴深度效果：重要性越低越小越透明
        eventGroups.append('circle')
            .attr('r', d => {
                const depth = Math.max(0.5, 1 - (5 - d.importance) * 0.1);
                return this.config.eventRadius * depth + d.importance * 0.5;
            })
            .attr('fill', d => this.getCategoryColor(d.category))
            .attr('stroke', d => d.periodColor)
            .attr('stroke-width', 1.5)
            .attr('opacity', d => 0.5 + d.importance * 0.1)
            .attr('filter', d => d.importance >= 4 ? 'url(#timeline-glow)' : 'none');

        // 重要事件标签
        eventGroups.filter(d => d.importance >= 4)
            .append('text')
            .attr('y', -12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#D4A853')
            .attr('font-weight', '600')
            .text(d => d.name.length > 8 ? d.name.substring(0, 8) + '…' : d.name);
    }

    renderCurrentYearLine() {
        const { height, margin } = this.config;
        const currentYear = new Date().getFullYear();

        this.mainGroup.append('line')
            .attr('x1', this.xScale(currentYear)).attr('x2', this.xScale(currentYear))
            .attr('y1', margin.top).attr('y2', height - margin.bottom)
            .attr('stroke', '#ff4757').attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '6,4');

        this.mainGroup.append('text')
            .attr('x', this.xScale(currentYear)).attr('y', margin.top - 8)
            .attr('text-anchor', 'middle').attr('fill', '#ff4757')
            .attr('font-size', '10px').attr('font-weight', 'bold')
            .text('现在');
    }

    updateMiniMap() {
        const transform = d3.zoomTransform(this.svg.node());
        const k = transform.k;
        const x = transform.x;
        const viewW = this.config.width / k;
        const viewX = (-x / k) / this.config.width * 180;

        this.miniMap.rect
            .attr('x', Math.max(0, viewX))
            .attr('y', 5)
            .attr('width', Math.min(180 - viewX, viewW / this.config.width * 180))
            .attr('height', 40);
    }

    updateInfo() {
        const ec = document.getElementById('eventCount');
        if (ec) ec.innerHTML = `<span style="color:#D4A853;">事件:</span> ${this.data.events.length}`;
        this.updateYearRange();
    }

    updateYearRange() {
        const el = document.getElementById('yearRange');
        if (!el) return;
        const t = d3.zoomTransform(this.svg.node());
        const k = t.k;
        const visW = this.config.width / k;
        const { margin, minYear, maxYear, width } = this.config;
        const range = maxYear - minYear;
        const startX = (-t.x / k - margin.left) / (width - margin.left - margin.right);
        const endX = startX + visW / (width - margin.left - margin.right);
        const sy = minYear + range * Math.max(0, startX);
        const ey = minYear + range * Math.min(1, endX);
        el.innerHTML = `<span style="color:#D4A853;">范围:</span> ${this.formatYear(Math.round(sy))} - ${this.formatYear(Math.round(ey))}`;
        this.updateMiniMap();
    }

    formatYear(year) {
        if (year < 0) return `公元前${Math.abs(year)}年`;
        if (year === 0) return '公元元年';
        return `公元${year}年`;
    }

    getCategoryColor(cat) { return this.config.colors[cat] || '#999'; }
    getCategoryName(cat) { return { politics: '政治', technology: '科技', culture: '文化', economy: '经济', military: '军事' }[cat] || cat; }
    getEventIcon(type) { return { event: '📍', person: '👤', period: '📅' }[type] || '•'; }

    onEventClick(event) {
        const node = this.app.dataService.getNode(event.id);
        if (node) {
            this.app.eventBus.emit('node:select', node);
            if (typeof TimelineEventDetail !== 'undefined') {
                if (!this.eventDetail) this.eventDetail = new TimelineEventDetail(this);
                this.eventDetail.show(node);
            }
            if (window.audioManager) window.audioManager.playClick();
        }
    }

    zoomIn() { this.svg.transition().call(this.zoom.scaleBy, 1.5); }
    zoomOut() { this.svg.transition().call(this.zoom.scaleBy, 0.67); }
    resetView() { this.svg.transition().call(this.zoom.transform, d3.zoomIdentity); }

    jumpToYear(year) {
        const { width, margin, minYear, maxYear } = this.config;
        const x = ((year - minYear) / (maxYear - minYear)) * (width - margin.left - margin.right) + margin.left;
        this.svg.transition().call(this.zoom.transform,
            d3.zoomIdentity.translate(-x + width / 2, 0).scale(2));
    }

    destroy() {
        this.hide();
        if (this.tooltip?.parentNode) this.tooltip.parentNode.removeChild(this.tooltip);
        this.app.eventBus.emit('view:destroy', { view: 'timeline' });
    }
}

window.TimelineView = TimelineView;
