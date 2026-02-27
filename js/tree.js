// 树形逻辑

class HistoryTree {
    constructor(svgSelector, data) {
        this.svg = d3.select(svgSelector);
        this.data = data;
        this.width = window.innerWidth;
        this.height = window.innerHeight - 180;
        
        this.tree = null;
        this.root = null;
        this.svgGroup = null;
        
        // 缩放和平移
        this.zoom = null;
        this.currentTransform = { x: 0, y: 0, k: 1 };
        
        // 选中的节点
        this.selectedNode = null;
        
        this.init();
    }
    
    init() {
        // 设置SVG尺寸
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
        
        // 创建主容器
        this.svgGroup = this.svg.append('g')
            .attr('class', 'tree-container');
        
        // 初始化树布局
        this.tree = d3.tree()
            .size([this.height - 100, this.width - 200])
            .separation((a, b) => {
                return (a.parent === b.parent ? 1 : 2) / a.depth;
            });
        
        // 初始化缩放
        this.initZoom();
        
        // 处理数据
        this.root = d3.hierarchy(this.data);
        this.root.x0 = this.height / 2;
        this.root.y0 = 0;
        
        // 初始时只显示第一层
        this.root.children.forEach(collapse);
        
        // 渲染树
        this.update(this.root);
        
        // 居中显示
        this.centerTree();
    }
    
    initZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.svgGroup.attr('transform', event.transform);
                this.currentTransform = {
                    x: event.transform.x,
                    y: event.transform.y,
                    k: event.transform.k
                };
            });
        
        this.svg.call(this.zoom);
    }
    
    update(source) {
        const duration = 750;
        
        // 计算新的树布局
        const treeData = this.tree(this.root);
        
        const nodes = treeData.descendants();
        const links = treeData.links();
        
        // 调整节点位置（垂直布局）
        nodes.forEach(d => {
            d.y = d.depth * 180;
        });
        
        // 更新节点
        const node = this.svgGroup.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++this.nodeId || (this.nodeId = 1)));
        
        // 进入节点
        const nodeEnter = node.enter().append('g')
            .attr('class', d => `node ${d.data.type || ''} ${d.data.category || ''}`)
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', (event, d) => this.onNodeClick(event, d))
            .on('mouseover', (event, d) => this.onNodeHover(event, d))
            .on('mouseout', (event, d) => this.onNodeOut(event, d));
        
        // 添加圆形
        nodeEnter.append('circle')
            .attr('class', d => `importance-${d.data.importance || 1}`)
            .attr('r', 0);
        
        // 添加标签
        nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children || d._children ? -15 : 15)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('fill-opacity', 0);
        
        // 更新节点
        const nodeUpdate = nodeEnter.merge(node);
        
        // 过渡到新位置
        nodeUpdate.transition()
            .duration(duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);
        
        // 更新圆形
        nodeUpdate.select('circle')
            .attr('r', d => this.getNodeRadius(d))
            .attr('class', d => `importance-${d.data.importance || 1}`)
            .style('fill', d => this.getNodeColor(d));
        
        // 更新文本
        nodeUpdate.select('text')
            .style('fill-opacity', 1)
            .attr('x', d => d.children || d._children ? -15 : 15)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start');
        
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
        const link = this.svgGroup.selectAll('path.link')
            .data(links, d => d.target.id);
        
        // 进入连接线
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', d => `link ${d.target.data.type || ''}-link`)
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return this.diagonal(o, o);
            });
        
        // 更新连接线
        const linkUpdate = linkEnter.merge(link);
        
        linkUpdate.transition()
            .duration(duration)
            .attr('d', d => this.diagonal(d.source, d.target));
        
        // 退出连接线
        link.exit().transition()
            .duration(duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .remove();
        
        // 保存旧位置
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    
    diagonal(s, d) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    }
    
    getNodeRadius(d) {
        if (d.data.type === 'period') return 15;
        if (d.data.type === 'branch') return 12;
        if (d.data.type === 'person') return 10;
        return 8;
    }
    
    getNodeColor(d) {
        const colors = {
            politics: '#e74c3c',
            technology: '#3498db',
            culture: '#9b59b6',
            economy: '#2ecc71',
            military: '#e67e22'
        };
        
        if (d.data.category) {
            return colors[d.data.category] || '#fff';
        }
        
        if (d.data.type === 'period') return '#8B4513';
        if (d.data.type === 'branch') return '#228B22';
        
        return '#fff';
    }
    
    onNodeClick(event, d) {
        event.stopPropagation();
        
        // 切换子节点显示
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        
        this.update(d);
        
        // 显示详情
        if (d.data.type === 'person' || d.data.type === 'event') {
            this.showDetail(d.data);
        }
        
        // 高亮选中节点
        this.svgGroup.selectAll('.node').classed('selected', false);
        d3.select(event.currentTarget).classed('selected', true);
    }
    
    onNodeHover(event, d) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        
        tooltip.append('div')
            .attr('class', 'tooltip-title')
            .text(d.data.name);
        
        if (d.data.year) {
            tooltip.append('div')
                .attr('class', 'tooltip-year')
                .text(d.data.year);
        }
        
        if (d.data.description) {
            tooltip.append('div')
                .attr('class', 'tooltip-desc')
                .text(d.data.description);
        }
        
        d3.select(event.currentTarget).classed('highlighted', true);
    }
    
    onNodeOut(event, d) {
        d3.selectAll('.tooltip').remove();
        d3.select(event.currentTarget).classed('highlighted', false);
    }
    
    showDetail(data) {
        const card = document.getElementById('detailCard');
        
        card.querySelector('.card-title').textContent = data.name;
        card.querySelector('.card-year').textContent = data.year || data.period || '';
        card.querySelector('.card-description').textContent = data.description || '';
        
        // 标签
        const tagsContainer = card.querySelector('.card-tags');
        tagsContainer.innerHTML = '';
        if (data.tags) {
            data.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag';
                tagEl.textContent = tag;
                tagsContainer.appendChild(tagEl);
            });
        }
        
        // 重要程度
        const importanceEl = card.querySelector('.card-importance');
        importanceEl.textContent = '重要程度: ' + '⭐'.repeat(data.importance || 1);
        
        card.classList.remove('hidden');
        card.classList.add('slide-in-right');
    }
    
    centerTree() {
        const transform = d3.zoomIdentity
            .translate(this.width / 2, this.height / 2)
            .scale(0.8);
        
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, transform);
    }
    
    zoomIn() {
        this.svg.transition().duration(300).call(
            this.zoom.scaleBy, 1.3
        );
    }
    
    zoomOut() {
        this.svg.transition().duration(300).call(
            this.zoom.scaleBy, 0.7
        );
    }
    
    resetZoom() {
        this.centerTree();
    }
    
    search(query) {
        if (!query) {
            this.svgGroup.selectAll('.node').classed('hidden dimmed', false);
            return;
        }
        
        query = query.toLowerCase();
        
        this.svgGroup.selectAll('.node').each(d => {
            const match = d.data.name.toLowerCase().includes(query) ||
                         (d.data.description && d.data.description.toLowerCase().includes(query)) ||
                         (d.data.tags && d.data.tags.some(tag => tag.toLowerCase().includes(query)));
            
            d3.select(event.currentTarget)
                .classed('hidden', !match)
                .classed('dimmed', !match);
        });
    }
    
    filter(filters) {
        this.svgGroup.selectAll('.node').each(d => {
            let visible = true;
            
            // 时期筛选
            if (filters.period && filters.period !== 'all') {
                // 实现时期筛选逻辑
            }
            
            // 类型筛选
            if (filters.type && filters.type !== 'all') {
                visible = visible && d.data.type === filters.type;
            }
            
            // 领域筛选
            if (filters.categories && filters.categories.length > 0) {
                visible = visible && filters.categories.includes(d.data.category);
            }
            
            // 重要程度筛选
            if (filters.importance) {
                visible = visible && (d.data.importance || 1) >= filters.importance;
            }
            
            d3.select(event.currentTarget)
                .classed('hidden', !visible);
        });
    }
}

// 折叠函数
function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

// 全局函数
function closeDetail() {
    document.getElementById('detailCard').classList.add('hidden');
}
