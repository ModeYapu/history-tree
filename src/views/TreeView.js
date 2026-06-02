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
        this.nodeId = 0;
        this.nodeElements = new Map(); // 跟踪节点元素

        // 配置
        this.config = {
            width: window.innerWidth,
            height: window.innerHeight - 180,
            margin: { top: 40, right: 120, bottom: 40, left: 120 },
            nodeRadius: 10,
            duration: 500, // 更快的动画
            initialExpand: 3 // 初始展开的节点数
        };

        // 状态
        this.selectedNode = null;
        this.expandedNodes = new Set();
        this.highlightedNodes = new Set(); // 搜索高亮的节点
        this.searchResults = []; // 当前搜索结果
    }
    
    /**
     * 显示视图
     */
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'tree-view';
        this.container.id = 'treeView';
        this.container.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        `;

        // 创建SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('background', 'transparent');

        // 添加容器
        this.mainGroup = this.svg.append('g')
            .attr('class', 'tree-container');

        // 初始化缩放
        this.initZoom();

        // 加载数据
        this.loadData();

        // 添加到DOM
        const domContainer = document.querySelector(this.app.options.container);
        domContainer.appendChild(this.container);

        // 监听搜索事件
        this.app.eventBus.on('search:results', (data) => this.handleSearchResults(data));

        console.log('✅ TreeView.container 已挂载到 DOM, 尺寸:', {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight
        });

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

        // 默认展开前2层：root和第一层子节点（远古时代/古代/中世纪等）
        if (this.root.children) {
            this.root.children.forEach((child, index) => {
                // 第一层全部展开
                if (child.children) {
                    // 第二层：每个分支只显示前3个，其余折叠
                    child.children.forEach(grandchild => {
                        if (grandchild.children && grandchild.children.length > 3) {
                            const visible = grandchild.children.slice(0, 3);
                            const hidden = grandchild.children.slice(3);
                            grandchild.children = visible;
                            grandchild._children = hidden;
                        }
                    });
                }
            });
        }

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

        // 进入节点 - 添加展开/折叠动画
        const nodeEnter = node.enter().append('g')
            .attr('class', d => this.getNodeClass(d) + ' node-expand')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .style('opacity', 0)
            .on('click', (event, d) => this.onNodeClick(event, d))
            .on('dblclick', (event, d) => this.onNodeDoubleClick(event, d))
            .on('contextmenu', (event, d) => this.onNodeRightClick(event, d));

        // 添加圆形
        nodeEnter.append('circle')
            .attr('class', 'node-circle')
            .attr('r', 0)
            .style('fill', d => this.getNodeColor(d))
            .style('stroke', d => this.getNodeStroke(d))
            .style('stroke-width', 2);

        // 添加图标
        nodeEnter.append('text')
            .attr('class', 'node-icon')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', '14px')
            .text(d => this.getNodeIcon(d))
            .style('opacity', 0);

        // 添加标签
        nodeEnter.append('text')
            .attr('class', 'node-label')
            .attr('dy', '.35em')
            .attr('x', d => d.children || d._children ? -13 : 13)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('opacity', 0);

        // 进入动画 - 节点展开动画
        const nodeEnterTransition = nodeEnter.transition()
            .duration(duration)
            .attr('transform', d => `translate(${d.y},${d.x})`)
            .style('opacity', 1);

        nodeEnterTransition.select('circle.node-circle')
            .attr('r', d => this.getNodeRadius(d));

        nodeEnterTransition.select('text.node-icon')
            .style('opacity', 1);

        nodeEnterTransition.select('text.node-label')
            .style('opacity', 1);

        // 过渡到新位置
        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
            .duration(duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('circle.node-circle')
            .transition()
            .duration(duration)
            .attr('r', d => this.getNodeRadius(d))
            .style('fill', d => this.getNodeColor(d))
            .style('stroke', d => this.getNodeStroke(d));

        // 退出节点 - 折叠动画
        const nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .style('opacity', 0)
            .remove();

        nodeExit.select('circle')
            .attr('r', 0);

        nodeExit.select('text')
            .style('opacity', 0);

        // 更新连接线 - 添加动画
        const link = this.mainGroup.selectAll('path.link')
            .data(links, d => d.target.id);

        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link link-expand')
            .style('opacity', 0)
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return this.diagonal(o, o);
            });

        linkEnter.transition()
            .duration(duration)
            .style('opacity', 1)
            .attr('d', d => this.diagonal(d.source, d.target));

        link.transition()
            .duration(duration)
            .attr('d', d => this.diagonal(d.source, d.target))
            .attr('class', 'link');

        link.exit().transition()
            .duration(duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .style('opacity', 0)
            .remove();

        // 存储旧位置
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // 更新节点元素映射
        this.nodeElements.clear();
        nodeUpdate.each((d, i, nodes) => {
            this.nodeElements.set(d.data.id, nodes[i]);
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

        // 更新视图数（如果是 HistoryNode 实例）
        if (d.data && typeof d.data.incrementViews === 'function') {
            d.data.incrementViews();
        }

        // 触发事件
        this.app.eventBus.emit('node:select', d.data);

        // 显示详情
        this.showNodeDetails(d.data);
    }
    
    /**
     * 节点双击 - 展开/折叠子节点
     */
    onNodeDoubleClick(event, d) {
        event.stopPropagation();

        // 展开/折叠
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
            // 如果子节点有折叠的孙节点，也展开前几个
            if (d.children && d.children.length > 0) {
                d.children.forEach(child => {
                    if (child._children && child._children.length > 0) {
                        // 展开前3个
                        const toShow = child._children.slice(0, 3);
                        const toHide = child._children.slice(3);
                        child.children = toShow;
                        child._children = toHide;
                    }
                });
            }
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
     * 获取节点类名（包含高亮和类别）
     */
    getNodeClass(d) {
        let classes = `node ${d.data.type || ''}`;

        // 添加类别类名用于颜色
        const category = d.data.category?.primary;
        if (category) {
            classes += ` ${category}`;
        }

        // 添加高亮类名
        if (this.isNodeHighlighted(d)) {
            classes += ' highlighted';
        }

        // 添加选中类名
        if (this.selectedNode === d) {
            classes += ' selected';
        }

        return classes;
    }

    /**
     * 判断节点是否高亮
     */
    isNodeHighlighted(d) {
        if (this.highlightedNodes.size === 0) return false;
        return this.highlightedNodes.has(d.data.id);
    }

    /**
     * 处理搜索结果
     */
    handleSearchResults(data) {
        this.highlightedNodes.clear();
        this.searchResults = data.results || [];

        if (this.searchResults.length > 0) {
            // 收集所有匹配节点的ID
            this.searchResults.forEach(node => {
                this.highlightedNodes.add(node.id);
            });

            // 更新视图以显示高亮
            this.update(this.root);

            // 自动居中到第一个搜索结果
            const firstResult = this.searchResults[0];
            if (firstResult) {
                this.centerOnNode(firstResult.id);
            }
        } else {
            // 清除高亮
            this.update(this.root);
        }
    }

    /**
     * 居中到指定节点
     */
    centerOnNode(nodeId) {
        const nodeElement = this.nodeElements.get(nodeId);
        if (!nodeElement) return;

        // 获取节点位置
        const transform = d3.select(nodeElement).attr('transform');
        const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
        if (match) {
            const x = parseFloat(match[2]);
            const y = parseFloat(match[1]);

            // 计算居中位置
            const centerX = this.config.width / 2;
            const centerY = this.config.height / 2;

            const newTransform = d3.zoomIdentity
                .translate(centerX - y, centerY - x)
                .scale(1.2);

            this.svg.transition()
                .duration(750)
                .call(this.zoom.transform, newTransform);
        }
    }

    /**
     * 获取节点颜色
     */
    getNodeColor(d) {
        const colors = {
            politics: '#ff6b6b',    // 政治红
            technology: '#4ecdc4',  // 科技青
            culture: '#a855f7',     // 文化紫
            economy: '#22c55e',     // 经济绿
            military: '#f97316',    // 军事橙
            period: '#8B4513',
            branch: '#DAA520'
        };

        // 如果高亮，使用更亮的颜色
        if (this.isNodeHighlighted(d)) {
            const baseColor = colors[d.data.category?.primary] || '#999';
            return this.brightenColor(baseColor, 0.3);
        }

        return colors[d.data.category?.primary] || '#999';
    }

    /**
     * 提亮颜色
     */
    brightenColor(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + amount * 255);
        const g = Math.min(255, ((num >> 8) & 0x00FF) + amount * 255);
        const b = Math.min(255, (num & 0x0000FF) + amount * 255);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    /**
     * 获取节点边框
     */
    getNodeStroke(d) {
        if (this.isNodeHighlighted(d)) {
            return '#FFD700'; // 金色边框表示高亮
        }
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
