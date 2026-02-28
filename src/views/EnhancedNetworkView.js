/**
 * 增强的关系网络视图 - 突出关联发现
 */

class EnhancedNetworkView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.svg = null;
        this.simulation = null;
        this.aiEngine = null;
        
        this.config = {
            width: window.innerWidth,
            height: window.innerHeight - 180,
            nodeRadius: { min: 10, max: 40 },
            linkWidth: { min: 1, max: 8 }
        };
        
        this.nodes = [];
        this.links = [];
        this.selectedNode = null;
    }
    
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'enhanced-network-view';
        this.container.style.cssText = `
            position: relative;
            width: 100%;
            height: ${this.config.height}px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        `;
        
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');
        
        // 添加说明面板
        this.addInfoPanel();
        
        // 添加控制面板
        this.addControlPanel();
        
        this.mainGroup = this.svg.append('g');
        
        this.initZoom();
        this.initAIEngine();
        
        if (options.nodeId) {
            this.loadConnections(options.nodeId);
        } else {
            this.loadAllConnections();
        }
        
        document.querySelector(this.app.options.container).appendChild(this.container);
        this.app.eventBus.emit('view:ready', { view: 'network' });
    }
    
    addInfoPanel() {
        const panel = document.createElement('div');
        panel.className = 'info-panel';
        panel.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255,255,255,0.95);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            max-width: 300px;
            z-index: 10;
        `;
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">
                🔍 历史关联发现
            </h3>
            <div style="font-size: 13px; color: #666; line-height: 1.6;">
                <p style="margin: 0 0 10px 0;">
                    点击节点查看AI发现的关联
                </p>
                <div style="margin-top: 15px;">
                    <div style="margin-bottom: 8px;">
                        <span style="display: inline-block; width: 20px; height: 3px; background: #22c55e; margin-right: 5px;"></span>
                        <span>直接因果</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="display: inline-block; width: 20px; height: 3px; background: #3b82f6; margin-right: 5px;"></span>
                        <span>跨时空关联</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="display: inline-block; width: 20px; height: 3px; background: #f59e0b; margin-right: 5px;"></span>
                        <span>同期对比</span>
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(panel);
    }
    
    addControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'control-panel';
        panel.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.95);
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10;
        `;
        
        panel.innerHTML = `
            <button class="btn-discover" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                margin-bottom: 10px;
                width: 100%;
            ">🔍 发现新关联</button>
            
            <button class="btn-reset" style="
                background: #f0f0f0;
                color: #666;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                width: 100%;
            ">重置视图</button>
        `;
        
        panel.querySelector('.btn-discover').addEventListener('click', () => {
            this.discoverNewConnections();
        });
        
        panel.querySelector('.btn-reset').addEventListener('click', () => {
            this.resetView();
        });
        
        this.container.appendChild(panel);
    }
    
    initAIEngine() {
        this.aiEngine = new AIConnectionEngine(this.app);
    }
    
    async loadConnections(nodeId) {
        const connections = await this.aiEngine.discoverConnections(nodeId, {
            depth: 2,
            minStrength: 0.3,
            maxResults: 20
        });
        
        this.buildNetwork(connections);
        this.render();
    }
    
    loadAllConnections() {
        // 加载所有节点的基础连接
        const nodes = Array.from(this.app.dataService.nodes.values());
        this.nodes = nodes.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type,
            category: node.category.primary,
            importance: node.metadata.importance
        }));
        
        this.links = [];
        nodes.forEach(node => {
            Object.entries(node.relations).forEach(([type, ids]) => {
                ids.forEach(targetId => {
                    this.links.push({
                        source: node.id,
                        target: targetId,
                        type: type
                    });
                });
            });
        });
        
        this.render();
    }
    
    buildNetwork(connections) {
        const nodeSet = new Set();
        
        connections.forEach(conn => {
            nodeSet.add(conn.source);
            nodeSet.add(conn.target);
        });
        
        this.nodes = Array.from(nodeSet).map(id => {
            const node = this.app.dataService.getNode(id);
            return {
                id,
                name: node ? node.name : id,
                type: node ? node.type : 'ai_discovered',
                category: node ? node.category.primary : 'ai_discovered',
                importance: node ? node.metadata.importance : 2
            };
        });
        
        this.links = connections.map(conn => ({
            source: conn.source,
            target: conn.target,
            type: conn.type,
            strength: conn.strength,
            evidence: conn.evidence,
            insight: conn.insight
        }));
    }
    
    async discoverNewConnections() {
        if (!this.selectedNode) {
            alert('请先选择一个节点');
            return;
        }
        
        // 显示加载状态
        this.showLoading();
        
        const connections = await this.aiEngine.discoverConnections(this.selectedNode.id, {
            depth: 3,
            minStrength: 0.2,
            maxResults: 30
        });
        
        this.buildNetwork(connections);
        this.render();
        
        this.hideLoading();
    }
    
    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            z-index: 100;
        `;
        loading.textContent = '🤖 AI正在发现关联...';
        this.container.appendChild(loading);
    }
    
    hideLoading() {
        const loading = this.container.querySelector('.loading-overlay');
        if (loading) loading.remove();
    }
    
    initZoom() {
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.mainGroup.attr('transform', event.transform);
            });
        
        this.svg.call(zoom);
    }
    
    render() {
        this.mainGroup.selectAll('*').remove();
        
        this.createArrowMarkers();
        this.initSimulation();
        this.renderLinks();
        this.renderNodes();
        this.startSimulation();
    }
    
    createArrowMarkers() {
        this.svg.append('defs').selectAll('marker')
            .data(['cause', 'effect', 'cross_time', 'contemporary'])
            .enter()
            .append('marker')
            .attr('id', d => `arrow-${d}`)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 25)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', d => this.getLinkColor(d));
    }
    
    initSimulation() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-500))
            .force('center', d3.forceCenter(this.config.width / 2, this.config.height / 2))
            .force('collision', d3.forceCollide().radius(60));
    }
    
    renderLinks() {
        this.linkElements = this.mainGroup.append('g')
            .selectAll('g')
            .data(this.links)
            .enter()
            .append('g')
            .attr('class', 'link-group');
        
        // 连接线
        this.linkElements.append('line')
            .attr('class', 'network-link')
            .attr('stroke', d => this.getLinkColor(d.type))
            .attr('stroke-width', d => this.getLinkWidth(d.strength))
            .attr('stroke-opacity', 0.6)
            .attr('marker-end', d => `url(#arrow-${d.type})`)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => this.showLinkTooltip(event, d))
            .on('mouseout', () => this.hideLinkTooltip());
    }
    
    renderNodes() {
        this.nodeElements = this.mainGroup.append('g')
            .selectAll('g')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'network-node')
            .call(this.drag())
            .on('click', (event, d) => this.onNodeClick(d))
            .on('dblclick', (event, d) => this.onNodeDoubleClick(d));
        
        // 外圈光晕（AI发现的节点）
        this.nodeElements.filter(d => d.type === 'ai_discovered')
            .append('circle')
            .attr('r', d => this.getNodeRadius(d) + 5)
            .attr('fill', 'none')
            .attr('stroke', '#f59e0b')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.5);
        
        // 主圆形
        this.nodeElements.append('circle')
            .attr('r', d => this.getNodeRadius(d))
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('cursor', 'pointer');
        
        // 图标
        this.nodeElements.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', d => this.getNodeRadius(d) * 0.6)
            .text(d => this.getNodeIcon(d));
        
        // 标签
        this.nodeElements.append('text')
            .attr('class', 'node-label')
            .attr('dy', d => this.getNodeRadius(d) + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px')
            .attr('fill', '#fff')
            .attr('font-weight', 'bold')
            .text(d => d.name);
    }
    
    startSimulation() {
        this.simulation.on('tick', () => {
            this.linkElements.select('line')
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            this.nodeElements.attr('transform', d => `translate(${d.x}, ${d.y})`);
        });
    }
    
    onNodeClick(node) {
        this.selectedNode = node;
        this.app.eventBus.emit('node:select', this.app.dataService.getNode(node.id));
    }
    
    async onNodeDoubleClick(node) {
        // 双击加载更多关联
        await this.loadConnections(node.id);
    }
    
    showLinkTooltip(event, link) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'link-tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.9)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('font-size', '13px')
            .style('z-index', 1000)
            .style('max-width', '300px');
        
        tooltip.html(`
            <div style="font-weight: bold; margin-bottom: 8px;">
                ${this.getLinkTypeName(link.type)}
            </div>
            ${link.evidence ? `<div style="color: #aaa; margin-bottom: 5px;">${link.evidence}</div>` : ''}
            ${link.insight ? `<div style="color: #f59e0b;">💡 ${link.insight}</div>` : ''}
        `);
        
        const [x, y] = d3.pointer(event, document.body);
        tooltip
            .style('left', `${x + 10}px`)
            .style('top', `${y - 10}px`);
    }
    
    hideLinkTooltip() {
        d3.selectAll('.link-tooltip').remove();
    }
    
    drag() {
        return d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }
    
    getNodeRadius(node) {
        return this.config.nodeRadius.min + 
            (node.importance / 5) * (this.config.nodeRadius.max - this.config.nodeRadius.min);
    }
    
    getNodeColor(node) {
        if (node.type === 'ai_discovered') return '#f59e0b';
        
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316'
        };
        return colors[node.category] || '#999';
    }
    
    getNodeIcon(node) {
        if (node.type === 'ai_discovered') return '🤖';
        
        const icons = {
            event: '📍',
            person: '👤',
            period: '📅'
        };
        return icons[node.type] || '●';
    }
    
    getLinkColor(type) {
        const colors = {
            cause: '#22c55e',
            effect: '#3b82f6',
            cross_time: '#f59e0b',
            contemporary: '#8b5cf6',
            similar_tags: '#9ca3af'
        };
        return colors[type] || '#666';
    }
    
    getLinkWidth(strength) {
        if (!strength) return 2;
        return this.config.linkWidth.min + 
            strength * (this.config.linkWidth.max - this.config.linkWidth.min);
    }
    
    getLinkTypeName(type) {
        const names = {
            cause: '因果',
            effect: '影响',
            cross_time: '跨时空关联',
            contemporary: '同期对比',
            similar_tags: '相似性'
        };
        return names[type] || type;
    }
    
    resetView() {
        this.selectedNode = null;
        this.loadAllConnections();
    }
    
    hide() {
        if (this.container) this.container.remove();
    }
    
    destroy() {
        this.hide();
        if (this.simulation) this.simulation.stop();
        this.app.eventBus.emit('view:destroy', { view: 'network' });
    }
}

window.EnhancedNetworkView = EnhancedNetworkView;
