/**
 * 时间轴导航增强
 * 提供更直观的时间轴交互
 */

class TimelineNavigator {
    constructor(container, options = {}) {
        this.container = d3.select(container);
        this.options = {
            width: options.width || 1200,
            height: options.height || 100,
            margin: options.margin || { top: 20, right: 50, bottom: 30, left: 50 },
            onPeriodSelect: options.onPeriodSelect || (() => {}),
            ...options
        };
        
        this.periods = [
            { name: '远古时代', start: -3000, end: -500, color: '#8B4513' },
            { name: '古代', start: -500, end: 500, color: '#DAA520' },
            { name: '中世纪', start: 500, end: 1500, color: '#CD853F' },
            { name: '近代', start: 1500, end: 1900, color: '#BC8F8F' },
            { name: '现代', start: 1900, end: 2024, color: '#4A90E2' }
        ];
        
        this.currentPeriod = null;
        this.events = [];
        
        this.init();
    }
    
    init() {
        const { width, height, margin } = this.options;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // 创建SVG
        this.svg = this.container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'timeline-navigator');
        
        // 创建主容器
        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // 创建时间比例尺
        this.timeScale = d3.scaleLinear()
            .domain([-3000, 2024])
            .range([0, innerWidth]);
        
        // 绘制时间轴
        this.drawAxis();
        
        // 绘制时期块
        this.drawPeriods();
        
        // 绘制事件标记
        this.drawEventMarkers();
        
        // 添加交互
        this.addInteractions();
    }
    
    drawAxis() {
        const { innerHeight } = this.getInnerDimensions();
        
        // 主轴
        this.mainGroup.append('line')
            .attr('class', 'timeline-axis')
            .attr('x1', 0)
            .attr('y1', innerHeight / 2)
            .attr('x2', this.timeScale.range()[1])
            .attr('y2', innerHeight / 2)
            .attr('stroke', '#ddd')
            .attr('stroke-width', 2);
        
        // 刻度
        const ticks = [-3000, -2000, -1000, 0, 1000, 1500, 1900, 2024];
        
        this.mainGroup.selectAll('.tick')
            .data(ticks)
            .enter()
            .append('g')
            .attr('class', 'tick')
            .attr('transform', d => `translate(${this.timeScale(d)}, ${innerHeight / 2})`)
            .each((d, i, nodes) => {
                const g = d3.select(nodes[i]);
                
                g.append('line')
                    .attr('y1', -10)
                    .attr('y2', 10)
                    .attr('stroke', '#999')
                    .attr('stroke-width', 1);
                
                g.append('text')
                    .attr('y', 25)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '11px')
                    .attr('fill', '#666')
                    .text(d => d < 0 ? `公元前${Math.abs(d)}年` : `${d}年`);
            });
    }
    
    drawPeriods() {
        const { innerHeight } = this.getInnerDimensions();
        const barHeight = 30;
        
        const periodGroups = this.mainGroup.selectAll('.period-block')
            .data(this.periods)
            .enter()
            .append('g')
            .attr('class', 'period-block')
            .attr('transform', d => `translate(${this.timeScale(d.start)}, ${innerHeight / 2 - barHeight / 2})`)
            .on('click', (event, d) => this.selectPeriod(d));
        
        // 时期块背景
        periodGroups.append('rect')
            .attr('class', 'period-rect')
            .attr('width', d => this.timeScale(d.end) - this.timeScale(d.start))
            .attr('height', barHeight)
            .attr('fill', d => d.color)
            .attr('opacity', 0.3)
            .attr('rx', 5)
            .attr('cursor', 'pointer')
            .on('mouseover', function() {
                d3.select(this).attr('opacity', 0.5);
            })
            .on('mouseout', function() {
                d3.select(this).attr('opacity', 0.3);
            });
        
        // 时期名称
        periodGroups.append('text')
            .attr('class', 'period-name')
            .attr('x', d => (this.timeScale(d.end) - this.timeScale(d.start)) / 2)
            .attr('y', barHeight / 2 + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', '#333')
            .attr('pointer-events', 'none')
            .text(d => d.name);
    }
    
    drawEventMarkers() {
        const { innerHeight } = this.getInnerDimensions();
        
        this.mainGroup.selectAll('.event-marker')
            .data(this.events)
            .enter()
            .append('circle')
            .attr('class', 'event-marker')
            .attr('cx', d => this.timeScale(d.year))
            .attr('cy', innerHeight / 2)
            .attr('r', d => d.importance * 2)
            .attr('fill', d => this.getCategoryColor(d.category))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('cursor', 'pointer')
            .on('mouseover', (event, d) => this.showEventTooltip(event, d))
            .on('mouseout', () => this.hideEventTooltip())
            .on('click', (event, d) => this.onEventClick(d));
    }
    
    addInteractions() {
        // 可拖动的时间指示器
        this.indicator = this.mainGroup.append('g')
            .attr('class', 'time-indicator')
            .attr('transform', `translate(${this.timeScale(0)}, 0)`);
        
        this.indicator.append('line')
            .attr('y1', -20)
            .attr('y2', 20)
            .attr('stroke', '#ff6b6b')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
        
        this.indicator.append('circle')
            .attr('cy', -20)
            .attr('r', 6)
            .attr('fill', '#ff6b6b')
            .attr('cursor', 'grab');
        
        // 拖动功能
        const drag = d3.drag()
            .on('drag', (event) => {
                const year = this.timeScale.invert(event.x);
                const clampedYear = Math.max(-3000, Math.min(2024, year));
                
                this.indicator.attr('transform', `translate(${this.timeScale(clampedYear)}, 0)`);
                this.onTimeChange(clampedYear);
            });
        
        this.indicator.call(drag);
    }
    
    selectPeriod(period) {
        // 高亮选中的时期
        this.mainGroup.selectAll('.period-rect')
            .attr('stroke', d => d === period ? '#333' : 'none')
            .attr('stroke-width', 2);
        
        this.currentPeriod = period;
        this.options.onPeriodSelect(period);
    }
    
    onTimeChange(year) {
        // 找到对应的时期
        const period = this.periods.find(p => year >= p.start && year <= p.end);
        if (period && period !== this.currentPeriod) {
            this.selectPeriod(period);
        }
    }
    
    showEventTooltip(event, data) {
        // 移除已存在的tooltip
        this.hideEventTooltip();
        
        const tooltip = d3.select('body').append('div')
            .attr('class', 'timeline-tooltip')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('box-shadow', '0 2px 10px rgba(0,0,0,0.2)')
            .style('pointer-events', 'none')
            .style('z-index', 1000);
        
        tooltip.html(`
            <div style="font-weight: bold; margin-bottom: 5px;">${data.name}</div>
            <div style="font-size: 12px; color: #666;">${data.year < 0 ? '公元前' + Math.abs(data.year) + '年' : data.year + '年'}</div>
            <div style="font-size: 11px; color: #888; margin-top: 5px;">${data.description || ''}</div>
        `);
        
        const [x, y] = d3.pointer(event, document.body);
        tooltip
            .style('left', `${x + 10}px`)
            .style('top', `${y - 10}px`);
    }
    
    hideEventTooltip() {
        d3.selectAll('.timeline-tooltip').remove();
    }
    
    onEventClick(event) {
        // 触发事件点击回调
        if (this.options.onEventClick) {
            this.options.onEventClick(event);
        }
    }
    
    setEvents(events) {
        this.events = events;
        this.drawEventMarkers();
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
    
    getInnerDimensions() {
        const { width, height, margin } = this.options;
        return {
            innerWidth: width - margin.left - margin.right,
            innerHeight: height - margin.top - margin.bottom
        };
    }
}

// 导出到全局
window.TimelineNavigator = TimelineNavigator;
