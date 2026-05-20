/**
 * 网络视图 - 关系网络
 * 支持事件关系网络和人物关系网络
 */

class NetworkView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.svg = null;
        this.simulation = null;

        this.config = {
            width: window.innerWidth,
            height: window.innerHeight - 180
        };

        this.nodes = [];
        this.links = [];
        this.currentMode = 'event'; // 'event' or 'character'
        this.activeFilters = new Set();

        // 人物关系类型定义
        this.characterRelationTypes = {
            mentor: { name: '师徒', color: '#9333ea', icon: '🎓' },
            enemy: { name: '敌对', color: '#ef4444', icon: '⚔️' },
            friend: { name: '友盟', color: '#22c55e', icon: '🤝' },
            family: { name: '亲属', color: '#f59e0b', icon: '👨‍👩‍👧‍👦' },
            colleague: { name: '同僚', color: '#3b82f6', icon: '📋' }
        };

        // 事件关系类型定义
        this.eventRelationTypes = {
            causes: { name: '因果', color: '#22c55e', icon: '→' },
            effects: { name: '影响', color: '#3b82f6', icon: '←' },
            related: { name: '相关', color: '#9ca3af', icon: '~' },
            participants: { name: '参与', color: '#f59e0b', icon: '👤' }
        };
    }
    
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'network-view';
        
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);
        
        this.initZoom();
        this.loadData();
        this.render();
        
        document.querySelector(this.app.options.container).appendChild(this.container);
        this.app.eventBus.emit('view:ready', { view: 'network' });
    }
    
    hide() {
        if (this.container) this.container.remove();
    }
    
    initZoom() {
        this.mainGroup = this.svg.append('g');
        
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.mainGroup.attr('transform', event.transform);
            });
        
        this.svg.call(zoom);
    }
    
    loadData() {
        // 获取所有节点
        const allNodes = Array.from(this.app.dataService.nodes.values());
        
        // 构建节点数据
        this.nodes = allNodes.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type,
            category: node.category.primary,
            importance: node.metadata.importance
        }));
        
        // 构建连接数据
        this.links = [];
        allNodes.forEach(node => {
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
    }
    
    render() {
        this.createArrowMarkers();
        this.initSimulation();
        this.renderLinks();
        this.renderNodes();
        this.startSimulation();
    }
    
    createArrowMarkers() {
        this.svg.append('defs').selectAll('marker')
            .data(['causes', 'effects', 'related', 'participants'])
            .enter()
            .append('marker')
            .attr('id', d => `arrow-${d}`)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 20)
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
            .force('charge', d3.forceManyBody().strength(-400))
            .force('center', d3.forceCenter(this.config.width / 2, this.config.height / 2))
            .force('collision', d3.forceCollide().radius(60));
    }
    
    renderLinks() {
        this.linkElements = this.mainGroup.append('g')
            .selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', 'network-link')
            .attr('stroke', d => this.getLinkColor(d.type))
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.6)
            .attr('marker-end', d => `url(#arrow-${d.type})`);
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
            .on('mouseover', (event, d) => this.onNodeHover(d))
            .on('mouseout', () => this.onNodeOut());
        
        this.nodeElements.append('circle')
            .attr('r', d => this.getNodeRadius(d))
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', '#fff')
            .attr('stroke-width', 3);
        
        this.nodeElements.append('text')
            .attr('class', 'node-label')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', '12px')
            .text(d => d.name);
    }
    
    startSimulation() {
        this.simulation.on('tick', () => {
            this.linkElements
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            this.nodeElements.attr('transform', d => `translate(${d.x}, ${d.y})`);
        });
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
    
    onNodeClick(node) {
        this.app.eventBus.emit('node:select', this.app.dataService.getNode(node.id));
    }
    
    onNodeHover(node) {
        // 高亮相关节点
    }
    
    onNodeOut() {
        // 取消高亮
    }
    
    getNodeRadius(node) {
        return 15 + node.importance * 3;
    }
    
    getNodeColor(node) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316'
        };
        return colors[node.category] || '#999';
    }
    
    getLinkColor(type) {
        const colors = {
            causes: '#22c55e',
            effects: '#3b82f6',
            related: '#9ca3af',
            participants: '#f59e0b'
        };
        return colors[type] || '#999';
    }
    
    destroy() {
        this.hide();
        if (this.simulation) this.simulation.stop();
        this.app.eventBus.emit('view:destroy', { view: 'network' });
    }
}

window.NetworkView = NetworkView;
