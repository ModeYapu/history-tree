/**
 * 关系网络可视化
 * 显示历史人物和事件之间的关系网络
 */

class RelationshipNetwork {
    constructor(container, options = {}) {
        this.container = d3.select(container);
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            onNodeClick: options.onNodeClick || (() => {}),
            ...options
        };
        
        this.nodes = [];
        this.links = [];
        this.simulation = null;
        
        this.init();
    }
    
    init() {
        const { width, height } = this.options;
        
        // 创建SVG
        this.svg = this.container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'relationship-network');
        
        // 添加缩放功能
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.mainGroup.attr('transform', event.transform);
            });
        
        this.svg.call(this.zoom);
        
        // 创建主容器
        this.mainGroup = this.svg.append('g');
        
        // 创建箭头标记
        this.createArrowMarkers();
        
        // 初始化力导向模拟
        this.initSimulation();
    }
    
    createArrowMarkers() {
        this.svg.append('defs').selectAll('marker')
            .data(['resolved', 'influenced', 'related'])
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
        const { width, height } = this.options;
        
        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(50));
    }
    
    setData(nodes, links) {
        this.nodes = nodes;
        this.links = links;
        
        this.render();
    }
    
    render() {
        // 清除旧内容
        this.mainGroup.selectAll('*').remove();
        
        // 绘制连接线
        const link = this.mainGroup.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', d => `link ${d.type}`)
            .attr('stroke', d => this.getLinkColor(d.type))
            .attr('stroke-width', d => d.strength || 2)
            .attr('stroke-opacity', 0.6)
            .attr('marker-end', d => `url(#arrow-${d.type})`);
        
        // 绘制节点
        const node = this.mainGroup.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', d => `node ${d.type}`)
            .call(this.drag())
            .on('click', (event, d) => this.options.onNodeClick(d))
            .on('mouseover', (event, d) => this.showNodeTooltip(event, d))
            .on('mouseout', () => this.hideNodeTooltip());
        
        // 节点圆形
        node.append('circle')
            .attr('r', d => this.getNodeRadius(d))
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', '#fff')
            .attr('stroke-width', 3);
        
        // 节点图标
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', d => this.getNodeRadius(d) * 0.8)
            .text(d => this.getNodeIcon(d));
        
        // 节点标签
        node.append('text')
            .attr('class', 'node-label')
            .attr('dy', d => this.getNodeRadius(d) + 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#333')
            .text(d => d.name);
        
        // 更新力导向模拟
        this.simulation
            .nodes(this.nodes)
            .on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);
                
                node.attr('transform', d => `translate(${d.x}, ${d.y})`);
            });
        
        this.simulation.force('link').links(this.links);
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
        const baseRadius = node.type === 'person' ? 20 : 15;
        return baseRadius + (node.importance || 3) * 3;
    }
    
    getNodeColor(node) {
        const colors = {
            person: {
                politics: '#ff6b6b',
                culture: '#a855f7',
                technology: '#4ecdc4',
                default: '#6b7280'
            },
            event: {
                politics: '#ef4444',
                culture: '#8b5cf6',
                technology: '#14b8a6',
                economy: '#22c55e',
                military: '#f97316',
                default: '#9ca3af'
            }
        };
        
        const typeColors = colors[node.type] || colors.event;
        return typeColors[node.category] || typeColors.default;
    }
    
    getNodeIcon(node) {
        const icons = {
            person: '👤',
            event: '📍'
        };
        return icons[node.type] || '●';
    }
    
    getLinkColor(type) {
        const colors = {
            resolved: '#22c55e',      // 解决
            influenced: '#3b82f6',     // 影响
            related: '#9ca3af',        // 相关
            opposed: '#ef4444',        // 对立
            allied: '#f59e0b'          // 联盟
        };
        return colors[type] || '#999';
    }
    
    showNodeTooltip(event, node) {
        this.hideNodeTooltip();
        
        const tooltip = d3.select('body').append('div')
            .attr('class', 'network-tooltip')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.15)')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('max-width', '250px');
        
        tooltip.html(`
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px;">
                ${this.getNodeIcon(node)} ${node.name}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                ${node.year || node.period || ''}
            </div>
            <div style="font-size: 11px; color: #888; line-height: 1.4;">
                ${node.description || ''}
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #aaa;">
                关联数: ${this.getNodeConnections(node.id)}
            </div>
        `);
        
        const [x, y] = d3.pointer(event, document.body);
        tooltip
            .style('left', `${x + 15}px`)
            .style('top', `${y - 10}px`);
    }
    
    hideNodeTooltip() {
        d3.selectAll('.network-tooltip').remove();
    }
    
    getNodeConnections(nodeId) {
        return this.links.filter(l => l.source.id === nodeId || l.target.id === nodeId).length;
    }
    
    highlightNode(nodeId) {
        // 高亮节点及其连接
        this.mainGroup.selectAll('.node').classed('dimmed', true);
        this.mainGroup.selectAll('.link').classed('dimmed', true);
        
        // 找到相关节点和连接
        const connectedNodes = new Set([nodeId]);
        this.links.forEach(link => {
            if (link.source.id === nodeId) connectedNodes.add(link.target.id);
            if (link.target.id === nodeId) connectedNodes.add(link.source.id);
        });
        
        // 高亮
        this.mainGroup.selectAll('.node')
            .filter(d => connectedNodes.has(d.id))
            .classed('dimmed', false)
            .classed('highlighted', true);
        
        this.mainGroup.selectAll('.link')
            .filter(d => d.source.id === nodeId || d.target.id === nodeId)
            .classed('dimmed', false)
            .classed('highlighted', true);
    }
    
    resetHighlight() {
        this.mainGroup.selectAll('.node')
            .classed('dimmed', false)
            .classed('highlighted', false);
        
        this.mainGroup.selectAll('.link')
            .classed('dimmed', false)
            .classed('highlighted', false);
    }
}

// 预定义的历史关系数据
const historicalRelationships = {
    nodes: [
        { id: 'confucius', name: '孔子', type: 'person', category: 'culture', year: '公元前551-479年', description: '儒家学派创始人', importance: 5 },
        { id: 'laozi', name: '老子', type: 'person', category: 'culture', year: '公元前571-471年', description: '道家学派创始人', importance: 5 },
        { id: 'socrates', name: '苏格拉底', type: 'person', category: 'culture', year: '公元前470-399年', description: '古希腊哲学家', importance: 5 },
        { id: 'plato', name: '柏拉图', type: 'person', category: 'culture', year: '公元前427-347年', description: '古希腊哲学家', importance: 5 },
        { id: 'aristotle', name: '亚里士多德', type: 'person', category: 'culture', year: '公元前384-322年', description: '古希腊哲学家', importance: 5 },
        { id: 'alexander', name: '亚历山大大帝', type: 'person', category: 'military', year: '公元前356-323年', description: '马其顿国王', importance: 5 },
        { id: 'qinshihuang', name: '秦始皇', type: 'person', category: 'politics', year: '公元前259-210年', description: '中国第一位皇帝', importance: 5 },
        { id: 'caesar', name: '凯撒', type: 'person', category: 'politics', year: '公元前100-44年', description: '罗马独裁官', importance: 5 },
        { id: 'unification_qin', name: '秦统一六国', type: 'event', category: 'politics', year: '公元前221年', description: '中国首次大一统', importance: 5 },
        { id: 'han_dynasty', name: '汉朝建立', type: 'event', category: 'politics', year: '公元前202年', description: '刘邦建立汉朝', importance: 5 }
    ],
    links: [
        { source: 'socrates', target: 'plato', type: 'influenced', strength: 3 },
        { source: 'plato', target: 'aristotle', type: 'influenced', strength: 3 },
        { source: 'aristotle', target: 'alexander', type: 'influenced', strength: 2 },
        { source: 'confucius', target: 'laozi', type: 'related', strength: 1 },
        { source: 'qinshihuang', target: 'unification_qin', type: 'resolved', strength: 3 },
        { source: 'unification_qin', target: 'han_dynasty', type: 'influenced', strength: 2 },
        { source: 'caesar', target: 'alexander', type: 'related', strength: 1 }
    ]
};

// 导出到全局
window.RelationshipNetwork = RelationshipNetwork;
window.historicalRelationships = historicalRelationships;
