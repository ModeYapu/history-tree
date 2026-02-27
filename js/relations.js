// 关系网络可视化

class RelationNetwork {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = 800;
        this.height = 600;
        this.nodes = [];
        this.links = [];
        this.svg = null;
        this.simulation = null;
    }
    
    init() {
        // 创建SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        
        // 创建箭头标记
        this.svg.append('defs').selectAll('marker')
            .data(['end'])
            .enter().append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 20)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#999');
    }
    
    setData(nodes, links) {
        this.nodes = nodes;
        this.links = links;
        
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id))
            .force('charge', d3.forceManyBody().strength(-400))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(40));
        
        this.render();
    }
    
    render() {
        // 清除旧内容
        this.svg.selectAll('g').remove();
        
        // 绘制连接线
        const link = this.svg.append('g')
            .selectAll('line')
            .data(this.links)
            .enter().append('line')
            .attr('class', 'relation-link')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrow)');
        
        // 绘制节点
        const node = this.svg.append('g')
            .selectAll('g')
            .data(this.nodes)
            .enter().append('g')
            .attr('class', 'relation-node')
            .call(this.drag());
        
        // 节点圆形
        node.append('circle')
            .attr('r', 20)
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);
        
        // 节点标签
        node.append('text')
            .attr('dy', 4)
            .attr('text-anchor', 'middle')
            .text(d => d.name)
            .style('font-size', '12px')
            .style('fill', '#fff');
        
        // 更新位置
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
    }
    
    getNodeColor(d) {
        const colors = {
            person: '#FFB6C1',
            event: '#87CEEB',
            period: '#FFD700'
        };
        return colors[d.type] || '#fff';
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
    
    highlightNode(nodeId) {
        this.svg.selectAll('.relation-node')
            .classed('highlighted', d => d.id === nodeId);
        
        this.svg.selectAll('.relation-link')
            .classed('highlighted', d => d.source.id === nodeId || d.target.id === nodeId);
    }
}

// 从历史数据提取关系
function extractRelations(historyData) {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();
    
    // 递归遍历数据
    function traverse(node, parent = null) {
        const nodeId = node.name;
        
        if (!nodeMap.has(nodeId)) {
            const nodeData = {
                id: nodeId,
                name: node.name,
                type: node.type || 'period',
                category: node.category
            };
            
            nodes.push(nodeData);
            nodeMap.set(nodeId, nodeData);
        }
        
        if (parent) {
            links.push({
                source: parent.name,
                target: nodeId,
                relation: 'belongs_to'
            });
        }
        
        if (node.children) {
            node.children.forEach(child => traverse(child, node));
        }
    }
    
    traverse(historyData);
    
    return { nodes, links };
}

// 关系面板
function showRelationPanel(data) {
    // 创建关系面板
    const panel = document.createElement('div');
    panel.className = 'relation-panel';
    panel.innerHTML = `
        <div class="relation-header">
            <h3>🔗 关系网络</h3>
            <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div id="relationNetwork" class="relation-content"></div>
    `;
    
    document.body.appendChild(panel);
    
    // 初始化关系网络
    const network = new RelationNetwork('relationNetwork');
    network.init();
    
    // 提取相关关系
    const { nodes, links } = extractRelatedRelations(data);
    network.setData(nodes, links);
}

// 提取相关关系
function extractRelatedRelations(targetData) {
    const nodes = [];
    const links = [];
    const visited = new Set();
    
    // 添加目标节点
    nodes.push({
        id: targetData.name,
        name: targetData.name,
        type: targetData.type
    });
    visited.add(targetData.name);
    
    // TODO: 根据tags、location、time等提取相关节点
    
    return { nodes, links };
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RelationNetwork, extractRelations };
}
