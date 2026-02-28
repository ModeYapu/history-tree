/**
 * 时间轴视图 - 完整版
 */

class TimelineView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.svg = null;
        
        this.config = {
            width: window.innerWidth,
            height: window.innerHeight - 180,
            margin: { top: 50, right: 50, bottom: 50, left: 100 },
            minYear: -3000,
            maxYear: 2024
        };
        
        this.timeScale = null;
        this.currentPeriod = null;
    }
    
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'timeline-view';
        
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);
        
        this.initScales();
        this.loadData();
        this.render();
        
        document.querySelector(this.app.options.container).appendChild(this.container);
        this.app.eventBus.emit('view:ready', { view: 'timeline' });
    }
    
    hide() {
        if (this.container) this.container.remove();
    }
    
    initScales() {
        const { width, margin, minYear, maxYear } = this.config;
        
        this.timeScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([margin.left, width - margin.right]);
    }
    
    loadData() {
        this.periods = this.getPeriods();
        this.events = this.getEvents();
    }
    
    getPeriods() {
        return [
            { name: '远古时代', start: -3000, end: -500, color: '#8B4513' },
            { name: '古代', start: -500, end: 500, color: '#DAA520' },
            { name: '中世纪', start: 500, end: 1500, color: '#CD853F' },
            { name: '近代', start: 1500, end: 1900, color: '#BC8F8F' },
            { name: '现代', start: 1900, end: 2024, color: '#4A90E2' }
        ];
    }
    
    getEvents() {
        return this.app.dataService.filter({ type: 'event' });
    }
    
    render() {
        this.renderAxis();
        this.renderPeriods();
        this.renderEvents();
        this.renderBrush();
    }
    
    renderAxis() {
        const { height, margin } = this.config;
        
        const axis = d3.axisBottom(this.timeScale)
            .tickFormat(d => d < 0 ? `公元前${Math.abs(d)}年` : `${d}年`)
            .ticks(10);
        
        this.svg.append('g')
            .attr('class', 'time-axis')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(axis);
    }
    
    renderPeriods() {
        const { height, margin } = this.config;
        const periodHeight = 60;
        
        const periodGroups = this.svg.selectAll('.period')
            .data(this.periods)
            .enter()
            .append('g')
            .attr('class', 'period')
            .attr('transform', `translate(0, ${margin.top})`);
        
        periodGroups.append('rect')
            .attr('x', d => this.timeScale(d.start))
            .attr('width', d => this.timeScale(d.end) - this.timeScale(d.start))
            .attr('height', periodHeight)
            .attr('fill', d => d.color)
            .attr('opacity', 0.3)
            .attr('rx', 5)
            .style('cursor', 'pointer')
            .on('click', (event, d) => this.selectPeriod(d));
        
        periodGroups.append('text')
            .attr('x', d => (this.timeScale(d.start) + this.timeScale(d.end)) / 2)
            .attr('y', periodHeight / 2 + 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(d => d.name);
    }
    
    renderEvents() {
        const { height, margin } = this.config;
        const eventY = margin.top + 80;
        
        const events = this.svg.selectAll('.event')
            .data(this.events)
            .enter()
            .append('g')
            .attr('class', 'event')
            .attr('transform', d => `translate(${this.timeScale(d.time.year)}, ${eventY})`);
        
        events.append('circle')
            .attr('r', d => d.metadata.importance * 2)
            .attr('fill', d => this.getCategoryColor(d.category.primary))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('click', (event, d) => this.onEventClick(d))
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());
        
        events.append('text')
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .text(d => d.name);
    }
    
    renderBrush() {
        const { height, margin } = this.config;
        
        const brush = d3.brushX()
            .extent([[margin.left, margin.top + 120], [this.config.width - margin.right, height - margin.bottom - 20]])
            .on('brush end', (event) => {
                if (event.selection) {
                    const [x0, x1] = event.selection;
                    const year0 = this.timeScale.invert(x0);
                    const year1 = this.timeScale.invert(x1);
                    this.onBrush(year0, year1);
                }
            });
        
        this.svg.append('g')
            .attr('class', 'brush')
            .call(brush);
    }
    
    selectPeriod(period) {
        this.currentPeriod = period;
        this.app.eventBus.emit('period:select', period);
    }
    
    onEventClick(event) {
        this.app.eventBus.emit('node:select', event);
    }
    
    onBrush(year0, year1) {
        this.app.eventBus.emit('timeline:brush', { start: year0, end: year1 });
    }
    
    showTooltip(event, data) {
        // 实现tooltip
    }
    
    hideTooltip() {
        // 隐藏tooltip
    }
    
    getCategoryColor(category) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316'
        };
        return colors[category] || '#999';
    }
    
    destroy() {
        this.hide();
        this.app.eventBus.emit('view:destroy', { view: 'timeline' });
    }
}

window.TimelineView = TimelineView;
