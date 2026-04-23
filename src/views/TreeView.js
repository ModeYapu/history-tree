/**
 * 树形视图 - 升级版
 */

class TreeView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.svg = null;
        this.zoom = null;
        this.root = null;
        
        // 配置
        this.config = {
            width: window.innerWidth,
            height: window.innerHeight - 180,
            margin: { top: 40, right: 120, bottom: 40, left: 120 },
            nodeRadius: 10,
            duration: 750
        };
        
        // 状态
        this.selectedNode = null;
        this.expandedNodes = new Set();
    }
    
    /**
     * 显示视图
     */
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'tree-view';
        this.container.id = 'treeView';
        
        // 创建SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);
        
        // 添加容器
        this.mainGroup = this.svg.append('g')
            .attr('class', 'tree-container');
        
        // 初始化缩放
        this.initZoom();
        
        // 加载数据
        this.loadData();
        
        // 添加到DOM
        document.querySelector(this.app.options.container).appendChild(this.container);
        
        // 触发事件
        this.app.eventBus.emit('view:ready', { view: 'tree' });
    }
    
    /**
     * 隐藏视图
     */
    hide() {
        if (this.container) {
            this.container.remove();
        }
    }
    
    /**
     * 初始化缩放
     */
    initZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.mainGroup.attr('transform', event.transform);
            });
        
        this.svg.call(this.zoom);
    }
    
    /**
     * 加载数据
     */
    loadData() {
        const data = this.app.dataService.getNode('root');
        if (data) {
            // 使用原始数据对象供d3.hierarchy遍历（HistoryNode.children存的是plain objects）
            const treeData = data;
            this.render(treeData);
        } else {
            console.warn('⚠️ 未找到root节点，无法渲染树');
        }
    }
    
    /**
     * 渲染树
     */
    render(data) {
        // 创建层次结构
        this.root = d3.hierarchy(data, d => d.children);
        this.root.x0 = this.config.height / 2;
        this.root.y0 = 0;
        
        // 初始化树布局
        this.tree = d3.tree()
            .size([this.config.height - 100, this.config.width - 200]);
        
        // 折叠所有节点
        this.root.children.forEach(collapse);
        
        // 更新视图
        this.update(this.root);
        
        // 居中
        this.centerTree();
    }
    
    /**
     * 更新树
     */
    update(source) {
        const duration = this.config.duration;
        
        // 计算新布局
        const treeData = this.tree(this.root);
        const nodes = treeData.descendants();
        const links = treeData.links();
        
        // 调整位置
        nodes.forEach(d => {
            d.y = d.depth * 180;
        });
        
        // 更新节点
        const node = this.mainGroup.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++this.nodeId));
        
        // 进入节点
        const nodeEnter = node.enter().append('g')
            .attr('class', d => `node ${d.data.type}`)
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', (event, d) => this.onNodeClick(event, d))
            .on('dblclick', (event, d) => this.onNodeDoubleClick(event, d))
            .on('contextmenu', (event, d) => this.onNodeRightClick(event, d));
        
        // 添加圆形
        nodeEnter.append('circle')
            .attr('r', 0)
            .attr('class', 'node-circle')
            .style('fill', d => this.getNodeColor(d))
            .style('stroke', d => this.getNodeStroke(d))
            .style('stroke-width', 2);
        
        // 添加图标
        nodeEnter.append('text')
            .attr('class', 'node-icon')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', '14px')
            .text(d => this.getNodeIcon(d));
        
        // 添加标签
        nodeEnter.append('text')
            .attr('class', 'node-label')
            .attr('dy', '.35em')
            .attr('x', d => d.children || d._children ? -13 : 13)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('fill-opacity', 0);
        
        // 过渡到新位置
        const nodeUpdate = nodeEnter.merge(node);
        
        nodeUpdate.transition()
            .duration(duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);
        
        nodeUpdate.select('circle.node-circle')
            .attr('r', d => this.getNodeRadius(d))
            .style('fill', d => this.getNodeColor(d))
            .style('stroke', d => this.getNodeStroke(d));
        
        nodeUpdate.select('text.node-label')
            .style('fill-opacity', 1);
        
        // 退出节点
        const nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .remove();
        
        nodeExit.select('circle')
            .attr('r', 0);
        
        nodeExit.select('text')
            .style('fill-opacity', 0);
        
        // 更新连接线
        const link = this.mainGroup.selectAll('path.link')
            .data(links, d => d.target.id);
        
        // 进入连接线
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return this.diagonal(o, o);
            });
        
        // 过渡
        linkEnter.merge(link).transition()
            .duration(duration)
            .attr('d', d => this.diagonal(d.source, d.target));
        
        // 退出
        link.exit().transition()
            .duration(duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .remove();
        
        // 存储旧位置
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    
    /**
     * 生成对角线
     */
    diagonal(s, d) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    }
    
    /**
     * 节点点击
     */
    onNodeClick(event, d) {
        event.stopPropagation();
        
        // 更新选中状态
        this.selectedNode = d;
        
        // 更新视图数
        d.data.incrementViews();
        
        // 触发事件
        this.app.eventBus.emit('node:select', d.data);
        
        // 显示详情
        this.showNodeDetails(d.data);
    }
    
    /**
     * 节点双击
     */
    onNodeDoubleClick(event, d) {
        event.stopPropagation();
        
        // 展开/折叠
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        
        this.update(d);
    }
    
    /**
     * 节点右键
     */
    onNodeRightClick(event, d) {
        event.preventDefault();
        
        // 显示上下文菜单
        this.showContextMenu(event, d);
    }
    
    /**
     * 获取节点颜色
     */
    getNodeColor(d) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316',
            period: '#8B4513',
            branch: '#DAA520'
        };
        
        return colors[d.data.category?.primary] || '#999';
    }
    
    /**
     * 获取节点边框
     */
    getNodeStroke(d) {
        return d === this.selectedNode ? '#ff0000' : '#fff';
    }
    
    /**
     * 获取节点半径
     */
    getNodeRadius(d) {
        const base = this.config.nodeRadius;
        return base + (d.data.metadata?.importance || 3);
    }
    
    /**
     * 获取节点图标
     */
    getNodeIcon(d) {
        const icons = {
            event: '📍',
            person: '👤',
            period: '📅',
            branch: '🌿'
        };
        
        return icons[d.data.type] || '●';
    }
    
    /**
     * 显示节点详情
     */
    showNodeDetails(node) {
        // 使用NodeCard组件
        const nodeCard = this.app.getComponent('nodeCard');
        nodeCard.show(node);
    }
    
    /**
     * 显示上下文菜单
     */
    showContextMenu(event, node) {
        // 实现上下文菜单
    }
    
    /**
     * 居中树
     */
    centerTree() {
        const transform = d3.zoomIdentity
            .translate(this.config.width / 2, this.config.height / 2)
            .scale(1);
        
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, transform);
    }
    
    /**
     * 销毁
     */
    destroy() {
        this.hide();
        this.app.eventBus.emit('view:destroy', { view: 'tree' });
    }
}

// 辅助函数：折叠节点
function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

// 导出到全局
window.TreeView = TreeView;
