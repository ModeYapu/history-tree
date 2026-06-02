/**
 * 增强网络视图 v3.0 视觉革命版
 * 引力场光晕、渐变连线、路径流动动画、关系强度映射、双击展开
 */
class NetworkView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.svg = null;
        this.simulation = null;
        this.flowAnimations = [];

        this.config = {
            width: window.innerWidth,
            height: window.innerHeight - 80
        };

        this.nodes = [];
        this.links = [];
        this.selectedNode = null;
        this.highlightedNodes = new Set();
        this.highlightedLinks = new Set();
        this.expandedNodes = new Set();

        this.relationTypes = {
            mentor: { name: '师徒', color: '#9333ea', icon: '🎓', width: 2 },
            enemy: { name: '敌对', color: '#ef4444', icon: '⚔️', width: 3 },
            friend: { name: '友盟', color: '#22c55e', icon: '🤝', width: 2 },
            family: { name: '亲属', color: '#f59e0b', icon: '👨‍👩‍👧‍👦', width: 2 },
            colleague: { name: '同僚', color: '#3b82f6', icon: '📋', width: 1 },
            successor: { name: '继承', color: '#8b5cf6', icon: '👑', width: 3 },
            causes: { name: '因果', color: '#22c55e', icon: '→', width: 2 },
            effects: { name: '影响', color: '#3b82f6', icon: '←', width: 2 },
            related: { name: '相关', color: '#9ca3af', icon: '~', width: 1 },
            participates: { name: '参与', color: '#f59e0b', icon: '👤', width: 2 },
            located: { name: '地点', color: '#06b6d4', icon: '📍', width: 1 }
        };

        // 关系大类渐变映射
        this.relationCategories = {
            political: { color: '#ff6b6b', name: '政治', types: ['mentor', 'successor', 'colleague'] },
            cultural: { color: '#4ecdc4', name: '文化', types: ['friend', 'mentor'] },
            military: { color: '#f97316', name: '军事', types: ['enemy'] },
            economic: { color: '#22c55e', name: '经济', types: ['located', 'participates'] }
        };

        this.currentMode = 'event';
        this.activeFilters = new Set();

        this.characterRelationTypes = {
            mentor: this.relationTypes.mentor,
            enemy: this.relationTypes.enemy,
            friend: this.relationTypes.friend,
            family: this.relationTypes.family,
            colleague: this.relationTypes.colleague,
            successor: this.relationTypes.successor
        };

        this.eventRelationTypes = {
            causes: this.relationTypes.causes,
            effects: this.relationTypes.effects,
            related: this.relationTypes.related,
            participants: this.relationTypes.participates,
            located: this.relationTypes.located
        };

        this.categoryColors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316'
        };
    }

    getNodeRadius(node) {
        const base = 15;
        const importance = node?.importance ?? node?.metadata?.importance ?? 3;
        return base + importance * 3;
    }

    getNodeColor(node) {
        const category = node?.category?.primary || node?.category;
        return this.categoryColors[category] || '#D4A853';
    }

    getLinkColor(type) {
        const relType = this.relationTypes[type] || this.eventRelationTypes[type];
        return relType ? relType.color : '#999';
    }

    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'network-view';
        this.container.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            background: radial-gradient(ellipse at center, rgba(20, 16, 10, 0.95) 0%, rgba(10, 8, 6, 0.98) 100%);
        `;

        this.createControls();
        this.createSVG();
        this.createLegend();
        this.createTooltip();

        this.loadData();
        this.initSimulation();
        this.render();

        document.querySelector(this.app.options.container).appendChild(this.container);
        this.app.eventBus.emit('view:ready', { view: 'network' });
    }

    hide() {
        this.flowAnimations.forEach(a => cancelAnimationFrame(a));
        this.flowAnimations = [];
        if (this.container) this.container.remove();
    }

    createControls() {
        const controls = document.createElement('div');
        controls.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            display: flex;
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

        const left = document.createElement('div');
        left.style.cssText = 'display: flex; gap: 10px; align-items: center;';
        left.appendChild(this.createBtn('↺ 重置', () => this.resetView()));
        left.appendChild(this.createBtn('⊕ 显示全部', () => this.showAllNodes()));
        left.appendChild(this.createBtn('⊗ 隐藏选中', () => this.hideSelected()));
        left.appendChild(this.createBtn('⤓ 导出', () => this.exportNetwork()));

        const right = document.createElement('div');
        right.style.cssText = 'display: flex; gap: 16px; align-items: center; font-size: 12px; color: #c9a96e;';

        const nc = document.createElement('div'); nc.id = 'nodeCount'; nc.innerHTML = '<span style="color:#D4A853;">节点:</span> 0';
        const lc = document.createElement('div'); lc.id = 'linkCount'; lc.innerHTML = '<span style="color:#D4A853;">关系:</span> 0';
        const si = document.createElement('div'); si.id = 'selectedInfo'; si.innerHTML = '<span style="color:#D4A853;">选中:</span> 无';

        right.appendChild(nc); right.appendChild(lc); right.appendChild(si);
        controls.appendChild(left); controls.appendChild(right);
        this.container.appendChild(controls);
    }

    createBtn(text, onClick) {
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
        btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(212,168,83,0.25)'; btn.style.color = '#D4A853'; });
        btn.addEventListener('mouseleave', () => { btn.style.background = ''; btn.style.color = ''; });
        return btn;
    }

    createSVG() {
        const svgContainer = document.createElement('div');
        svgContainer.style.cssText = 'flex: 1; position: relative; overflow: hidden;';

        this.svg = d3.select(svgContainer)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.defs = this.svg.append('defs');
        this.createArrowMarkers();
        this.createGlowFilter();
        this.createLinkGradients();

        // 背景层（用于流动动画）
        this.bgGroup = this.svg.append('g').attr('class', 'network-bg');

        this.mainGroup = this.svg.append('g').attr('class', 'network-main');
        this.linkGroup = this.mainGroup.append('g').attr('class', 'links');
        this.nodeGroup = this.mainGroup.append('g').attr('class', 'nodes');

        this.initZoom();
        this.container.appendChild(svgContainer);
    }

    createGlowFilter() {
        const filter = this.defs.append('filter')
            .attr('id', 'node-glow')
            .attr('x', '-50%').attr('y', '-50%')
            .attr('width', '200%').attr('height', '200%');

        filter.append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', '4')
            .attr('result', 'blur');
        filter.append('feComposite')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'blur')
            .attr('operator', 'over');
    }

    createLinkGradients() {
        // 为不同关系类型创建渐变
        Object.entries(this.relationTypes).forEach(([type, config]) => {
            const grad = this.defs.append('linearGradient')
                .attr('id', `link-grad-${type}`)
                .attr('gradientUnits', 'userSpaceOnUse');

            grad.append('stop').attr('offset', '0%').attr('stop-color', config.color).attr('stop-opacity', '0.8');
            grad.append('stop').attr('offset', '50%').attr('stop-color', config.color).attr('stop-opacity', '0.4');
            grad.append('stop').attr('offset', '100%').attr('stop-color', config.color).attr('stop-opacity', '0.8');
        });
    }

    createArrowMarkers() {
        Object.entries(this.relationTypes).forEach(([type, config]) => {
            this.defs.append('marker')
                .attr('id', `arrow-${type}`)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 20).attr('refY', 0)
                .attr('markerWidth', 5).attr('markerHeight', 5)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', config.color);
        });
    }

    initZoom() {
        this.svg.call(d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.mainGroup.attr('transform', event.transform);
            })
        );
    }

    createLegend() {
        const legend = document.createElement('div');
        legend.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(20, 16, 10, 0.92);
            border: 1px solid rgba(212, 168, 83, 0.2);
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 11px;
            color: #c9a96e;
            backdrop-filter: blur(10px);
            z-index: 10;
        `;

        const title = document.createElement('div');
        title.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #D4A853; font-size: 12px;';
        title.textContent = '关系类型';
        legend.appendChild(title);

        Object.entries(this.relationTypes).forEach(([type, config]) => {
            const item = document.createElement('div');
            item.style.cssText = 'display: flex; align-items: center; gap: 6px; margin: 3px 0;';
            item.innerHTML = `<span style="color:${config.color};font-size:13px;">${config.icon}</span>
                <span style="width:16px;height:${Math.max(1, config.width)}px;background:${config.color};border-radius:1px;display:inline-block;"></span>
                <span>${config.name}</span>`;
            legend.appendChild(item);
        });

        // 提示
        const hint = document.createElement('div');
        hint.style.cssText = 'margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(212,168,83,0.15); font-size: 10px; color: #8b7355;';
        hint.textContent = '双击节点展开二级关系';
        legend.appendChild(hint);

        this.container.appendChild(legend);
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
            max-width: 350px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: 'Noto Serif SC', serif;
        `;
        document.body.appendChild(this.tooltip);
    }

    loadData() {
        const allNodes = Array.from(this.app.dataService.nodes.values());

        this.nodes = allNodes.map(node => ({
            id: node.id, name: node.name, type: node.type,
            category: node.category?.primary || node.category,
            importance: node.importance || node.metadata?.importance || 1,
            year: node.year || node.time?.year,
            location: node.location?.name || node.location
        }));

        this.calculateCentrality();

        this.links = [];
        const relationCount = new Map();

        allNodes.forEach(node => {
            if (node.relations) {
                Object.entries(node.relations).forEach(([type, ids]) => {
                    (Array.isArray(ids) ? ids : [ids]).forEach(targetId => {
                        if (allNodes.find(n => n.id === targetId)) {
                            const key = `${node.id}-${targetId}`;
                            if (!relationCount.has(key)) {
                                this.links.push({
                                    source: node.id, target: targetId,
                                    type, relation: this.relationTypes[type] || this.relationTypes.related,
                                    strength: Math.random() * 0.5 + 0.5 // 模拟关系强度
                                });
                                relationCount.set(key, true);
                            }
                        }
                    });
                });
            }
            this.generateAutoRelations(node, allNodes);
        });
    }

    calculateCentrality() {
        this.degree = new Map();
        this.nodes.forEach(n => this.degree.set(n.id, 0));
    }

    generateAutoRelations(node, allNodes) {
        allNodes.forEach(other => {
            if (node.id === other.id) return;
            const yearDiff = Math.abs((node.year || 0) - (other.year || 0));
            if (yearDiff <= 50 && yearDiff > 0) {
                this.links.push({
                    source: node.id, target: other.id,
                    type: 'related',
                    relation: this.relationTypes.related,
                    strength: 0.3
                });
            }
        });
    }

    initSimulation() {
        const nodeDegree = new Map();
        this.links.forEach(link => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            nodeDegree.set(sId, (nodeDegree.get(sId) || 0) + 1);
            nodeDegree.set(tId, (nodeDegree.get(tId) || 0) + 1);
        });

        this.nodes.forEach(node => {
            node.radius = 15 + (node.importance || 1) * 3 + (nodeDegree.get(node.id) || 0) * 2;
            node.degree = nodeDegree.get(node.id) || 0;
        });

        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(d => 100 + d.relation.width * 30))
            .force('charge', d3.forceManyBody().strength(d => -500 - d.degree * 50))
            .force('center', d3.forceCenter(this.config.width / 2, this.config.height / 2))
            .force('collision', d3.forceCollide().radius(d => d.radius + 10).iterations(2));

        this.simulation.on('tick', () => this.onTick());
    }

    render() {
        this.renderLinks();
        this.renderNodes();
        this.updateInfo();
    }

    renderLinks() {
        // 清除旧的流动动画
        this.flowAnimations.forEach(a => cancelAnimationFrame(a));
        this.flowAnimations = [];

        this.linkElements = this.linkGroup.selectAll('line').data(this.links).enter()
            .append('line')
            .attr('class', 'network-link')
            .attr('stroke', d => d.relation.color)
            .attr('stroke-width', d => d.relation.width * (d.strength || 0.5))
            .attr('stroke-opacity', d => 0.15 + (d.strength || 0.5) * 0.3)
            .attr('marker-end', d => `url(#arrow-${d.type})`)
            .style('cursor', 'pointer')
            .on('click', (event, d) => { event.stopPropagation(); })
            .on('mouseover', (event, d) => this.showLinkTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());
    }

    renderNodes() {
        const nodeGroups = this.nodeGroup.selectAll('g').data(this.nodes).enter()
            .append('g')
            .attr('class', 'network-node')
            .call(this.createDrag())
            .on('click', (event, d) => this.onNodeClick(event, d))
            .on('dblclick', (event, d) => this.onNodeDblClick(event, d))
            .on('mouseover', (event, d) => this.onNodeHover(event, d))
            .on('mouseout', () => this.onNodeOut());

        // 引力场光晕（重要节点）
        nodeGroups.filter(d => d.importance >= 3)
            .append('circle')
            .attr('class', 'node-glow')
            .attr('r', d => d.radius * 2)
            .attr('fill', d => this.categoryColors[d.category] || '#D4A853')
            .attr('opacity', 0)
            .attr('filter', 'url(#node-glow)');

        // 节点圆圈
        nodeGroups.append('circle')
            .attr('class', 'node-circle')
            .attr('r', d => d.radius)
            .attr('fill', d => this.categoryColors[d.category] || '#D4A853')
            .attr('stroke', '#D4A853')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.85);

        // 节点图标
        nodeGroups.append('text')
            .attr('class', 'node-icon')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', d => Math.min(d.radius, 14))
            .attr('fill', '#f0d68a')
            .text(d => this.getNodeIcon(d.type));

        // 节点标签
        nodeGroups.filter(d => d.importance >= 3 || d.degree >= 4)
            .append('text')
            .attr('class', 'node-label')
            .attr('y', d => d.radius + 14)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#c9a96e')
            .text(d => d.name.length > 6 ? d.name.substring(0, 6) + '…' : d.name);

        this.nodeElements = nodeGroups;
    }

    onTick() {
        if (this.linkElements) {
            this.linkElements
                .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x).attr('y2', d => d.target.y);

            // 更新渐变方向
            this.linkElements.each(function(d) {
                const grad = d3.select(`#link-grad-${d.type}`);
                if (!grad.empty()) {
                    grad.attr('x1', d.source.x).attr('y1', d.source.y)
                        .attr('x2', d.target.x).attr('y2', d.target.y);
                }
            });
        }
        if (this.nodeElements) {
            this.nodeElements.attr('transform', d => `translate(${d.x}, ${d.y})`);
        }
    }

    createDrag() {
        return d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x; d.fy = d.y;
            })
            .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null; d.fy = null;
            });
    }

    onNodeClick(event, d) {
        if (event?.stopPropagation) event.stopPropagation();
        const nodeData = d || event;
        if (nodeData) this.selectNode(nodeData);
    }

    /** 双击展开二级关系网络 */
    onNodeDblClick(event, d) {
        event.stopPropagation();
        if (this.expandedNodes.has(d.id)) return;
        this.expandedNodes.add(d.id);

        // 找到二级关联节点
        const secondaryIds = new Set();
        this.links.forEach(link => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            if (sId === d.id) secondaryIds.add(tId);
            if (tId === d.id) secondaryIds.add(sId);
        });

        // 从二级节点的连接中找到三级节点
        const tertiaryIds = new Set();
        this.links.forEach(link => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            if (secondaryIds.has(sId) && !secondaryIds.has(tId) && tId !== d.id) tertiaryIds.add(tId);
            if (secondaryIds.has(tId) && !secondaryIds.has(sId) && sId !== d.id) tertiaryIds.add(sId);
        });

        // 高亮这些节点，添加脉冲动画
        const allRelated = new Set([...secondaryIds, ...tertiaryIds, d.id]);

        this.nodeElements.transition().duration(300)
            .style('opacity', n => allRelated.has(n.id) ? 1 : 0.15);

        this.linkElements.transition().duration(300)
            .style('opacity', l => {
                const sId = typeof l.source === 'object' ? l.source.id : l.source;
                const tId = typeof l.target === 'object' ? l.target.id : l.target;
                return (allRelated.has(sId) && allRelated.has(tId)) ? 0.7 : 0.05;
            });

        // 启动流动动画
        this.startFlowAnimation(d.id, allRelated);

        if (window.audioManager) window.audioManager.playDiscovery();
    }

    /** 路径流动动画 */
    startFlowAnimation(centerId, relatedIds) {
        const animId = Symbol('flow');

        const animate = () => {
            if (!this.linkElements) return;

            const time = Date.now() * 0.003;

            this.linkElements.each(function(d) {
                const sId = typeof d.source === 'object' ? d.source.id : d.source;
                const tId = typeof d.target === 'object' ? d.target.id : d.target;

                if (relatedIds.has(sId) && relatedIds.has(tId)) {
                    const pulse = 0.3 + Math.sin(time + (d.source.x || 0) * 0.01) * 0.3;
                    d3.select(this).attr('stroke-opacity', pulse + 0.4);
                }
            });

            const id = requestAnimationFrame(animate);
            this.flowAnimations.push(id);
        };

        animate();
    }

    onNodeHover(event, d) {
        this.highlightConnections(d);
        this.showNodeTooltip(event, d);

        // 光晕动画
        const glow = d3.select(event.currentTarget).select('.node-glow');
        if (!glow.empty()) {
            glow.transition().duration(300).attr('opacity', 0.2);
        }
    }

    onNodeOut() {
        this.clearHighlight();
        this.hideTooltip();

        // 移除所有光晕
        this.nodeElements.selectAll('.node-glow').transition().duration(300).attr('opacity', 0);
    }

    showLinkTooltip(event, d) {
        const source = typeof d.source === 'object' ? d.source : this.nodes.find(n => n.id === d.source);
        const target = typeof d.target === 'object' ? d.target : this.nodes.find(n => n.id === d.target);
        if (!source || !target) return;

        this.tooltip.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:16px;">${d.relation.icon}</span>
                <span style="font-weight:600;color:#D4A853;">${d.relation.name}</span>
            </div>
            <div style="color:#f0d68a;line-height:1.4;">
                <span style="color:${this.categoryColors[source.category] || '#D4A853'};">${source.name}</span>
                ${d.relation.icon}
                <span style="color:${this.categoryColors[target.category] || '#D4A853'};">${target.name}</span>
            </div>
            <div style="margin-top:6px;font-size:11px;color:#c9a96e;">强度: ${'●'.repeat(Math.ceil((d.strength || 0.5) * 5))}</div>
        `;
        this.positionTooltip(event);
    }

    showNodeTooltip(event, d) {
        this.tooltip.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:20px;">${this.getNodeIcon(d.type)}</span>
                <span style="font-weight:600;color:#D4A853;font-size:15px;">${d.name}</span>
            </div>
            <div style="display:flex;gap:10px;margin-bottom:8px;font-size:11px;color:#c9a96e;">
                <span>${d.year ? this.formatYear(d.year) : '未知'}</span>
                <span>${d.location || '未知地点'}</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <span style="padding:2px 8px;background:${this.categoryColors[d.category] || '#999'}25;border:1px solid ${this.categoryColors[d.category] || '#999'}50;border-radius:4px;font-size:10px;color:${this.categoryColors[d.category] || '#999'};">
                    ${this.getCategoryName(d.category)}
                </span>
                <span style="padding:2px 8px;background:rgba(212,168,83,0.12);border-radius:4px;font-size:10px;color:#c9a96e;">
                    连接: ${d.degree}
                </span>
            </div>
        `;
        this.positionTooltip(event);
    }

    positionTooltip(event) {
        const rect = this.container.getBoundingClientRect();
        this.tooltip.style.left = `${event.clientX - rect.left + 20}px`;
        this.tooltip.style.top = `${event.clientY - rect.top + 20}px`;
        this.tooltip.style.opacity = '1';
    }

    hideTooltip() { this.tooltip.style.opacity = '0'; }

    selectNode(d) {
        this.selectedNode = d;
        const si = document.getElementById('selectedInfo');
        if (si) si.innerHTML = `<span style="color:#D4A853;">选中:</span> ${d.name}`;
        const node = this.app.dataService.getNode(d.id);
        if (node) this.app.eventBus.emit('node:select', node);
    }

    highlightConnections(node) {
        const relatedIds = new Set([node.id]);
        const hLinks = new Set();

        this.links.forEach(link => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            if (sId === node.id || tId === node.id) {
                relatedIds.add(sId);
                relatedIds.add(tId);
                hLinks.add(link);
            }
        });

        this.nodeElements.transition().duration(200)
            .style('opacity', d => relatedIds.has(d.id) ? 1 : 0.15);
        this.linkElements.transition().duration(200)
            .style('opacity', d => hLinks.has(d) ? 0.7 : 0.05);
    }

    clearHighlight() {
        this.nodeElements.transition().duration(200).style('opacity', 0.85);
        this.linkElements.transition().duration(200).style('opacity', 0.3);
    }

    resetView() {
        this.expandedNodes.clear();
        this.flowAnimations.forEach(a => cancelAnimationFrame(a));
        this.flowAnimations = [];
        this.simulation.alpha(1).restart();
        this.svg.transition().call(d3.zoom().transform, d3.zoomIdentity);
        this.clearHighlight();
    }

    showAllNodes() {
        this.nodeElements.style('display', 'block').style('opacity', 0.85);
        this.linkElements.style('opacity', 0.3);
    }

    hideSelected() {
        if (this.selectedNode) {
            this.nodeElements.filter(d => d.id === this.selectedNode.id).style('display', 'none');
        }
    }

    exportNetwork() {
        const data = {
            nodes: this.nodes.map(n => ({ id: n.id, name: n.name, category: n.category, importance: n.importance, degree: n.degree })),
            links: this.links.map(l => ({
                source: typeof l.source === 'object' ? l.source.id : l.source,
                target: typeof l.target === 'object' ? l.target.id : l.target,
                type: l.type, strength: l.strength
            }))
        };
        console.log('Export:', data);
    }

    updateInfo() {
        const nc = document.getElementById('nodeCount');
        const lc = document.getElementById('linkCount');
        if (nc) nc.innerHTML = `<span style="color:#D4A853;">节点:</span> ${this.nodes.length}`;
        if (lc) lc.innerHTML = `<span style="color:#D4A853;">关系:</span> ${this.links.length}`;
    }

    getNodeIcon(type) { return { event: '📍', person: '👤', period: '📅' }[type] || '●'; }
    getCategoryName(cat) { return { politics: '政治', technology: '科技', culture: '文化', economy: '经济', military: '军事' }[cat] || cat; }
    formatYear(y) { return y < 0 ? `公元前${Math.abs(y)}年` : `公元${y}年`; }

    destroy() {
        this.hide();
        if (this.tooltip?.parentNode) this.tooltip.remove();
        if (this.simulation) this.simulation.stop();
        this.app.eventBus.emit('view:destroy', { view: 'network' });
    }
}

window.NetworkView = NetworkView;
