/**
 * 知识图谱视图 - KnowledgeGraph.js
 * 提供全局概念关系图，使用 D3 力导向布局
 */

class KnowledgeGraph {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        this.options = {
            width: options.width || 1200,
            height: options.height || 800,
            ...options
        };

        this.nodes = [];
        this.links = [];
        this.simulation = null;
        this.svg = null;

        this.chineseDynasties = this._extractChineseDynasties();
        this.worldEvents = window.worldEvents || [];
        this.worldCivilizations = window.WorldCivilizations || {};

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.createUI();
        this.buildGraphData();
        this.renderGraph();
        this.bindEvents();
    }

    createUI() {
        const html = `
            <div class="knowledge-graph-container">
                <!-- 控制面板 -->
                <div class="graph-controls">
                    <div class="search-box">
                        <input type="text" id="graph-search" placeholder="搜索节点（人物、事件、地点、技术...）">
                        <button id="search-btn">🔍</button>
                    </div>

                    <div class="filter-controls">
                        <label class="filter-item">
                            <input type="checkbox" checked data-type="person">
                            <span>👤 人物</span>
                        </label>
                        <label class="filter-item">
                            <input type="checkbox" checked data-type="event">
                            <span>⚡ 事件</span>
                        </label>
                        <label class="filter-item">
                            <input type="checkbox" checked data-type="location">
                            <span>📍 地点</span>
                        </label>
                        <label class="filter-item">
                            <input type="checkbox" checked data-type="technology">
                            <span>⚙️ 技术</span>
                        </label>
                        <label class="filter-item">
                            <input type="checkbox" checked data-type="culture">
                            <span>🎭 文化</span>
                        </label>
                    </div>

                    <div class="action-buttons">
                        <button id="reset-view-btn">🔄 重置视图</button>
                        <button id="highlight-path-btn">🔍 高亮路径</button>
                    </div>
                </div>

                <!-- 图例 -->
                <div class="graph-legend">
                    <div class="legend-title">节点类型</div>
                    <div class="legend-items">
                        <div class="legend-item person">
                            <span class="legend-dot"></span>
                            <span>人物</span>
                        </div>
                        <div class="legend-item event">
                            <span class="legend-dot"></span>
                            <span>事件</span>
                        </div>
                        <div class="legend-item location">
                            <span class="legend-dot"></span>
                            <span>地点</span>
                        </div>
                        <div class="legend-item technology">
                            <span class="legend-dot"></span>
                            <span>技术</span>
                        </div>
                        <div class="legend-item culture">
                            <span class="legend-dot"></span>
                            <span>文化</span>
                        </div>
                        <div class="legend-item civilization">
                            <span class="legend-dot"></span>
                            <span>文明</span>
                        </div>
                    </div>
                </div>

                <!-- SVG 容器 -->
                <div id="graph-svg-container" class="graph-svg-container"></div>

                <!-- 节点详情面板 -->
                <div id="node-detail-panel" class="node-detail-panel hidden">
                    <div class="panel-header">
                        <h3 id="detail-title">节点详情</h3>
                        <button class="panel-close">&times;</button>
                    </div>
                    <div id="detail-content" class="panel-content"></div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    buildGraphData() {
        this.nodes = [];
        this.links = [];

        // 1. 从世界事件构建节点和链接
        this.worldEvents.forEach(event => {
            // 创建事件节点
            const eventNode = {
                id: `event-${event.id}`,
                name: event.name,
                type: 'event',
                year: event.year,
                location: event.location,
                description: event.description,
                civilization: event.civilization,
                category: event.category,
                significance: event.significance,
                importance: event.impact === 'very-high' ? 5 : event.impact === 'high' ? 4 : 3,
                data: event
            };
            this.nodes.push(eventNode);

            // 创建地点节点
            if (event.location) {
                const locationId = `location-${event.location}`;
                const locationNode = this.nodes.find(n => n.id === locationId);
                if (!locationNode) {
                    this.nodes.push({
                        id: locationId,
                        name: event.location,
                        type: 'location',
                        importance: 3,
                        data: { location: event.location }
                    });
                }
                // 创建链接
                this.links.push({
                    source: eventNode.id,
                    target: locationId,
                    type: 'location'
                });
            }

            // 创建文明节点
            if (event.civilization) {
                const civId = `civ-${event.civilization}`;
                const civNode = this.nodes.find(n => n.id === civId);
                if (!civNode) {
                    const civData = this.worldCivilizations[event.civilization];
                    this.nodes.push({
                        id: civId,
                        name: event.civilization,
                        type: 'civilization',
                        importance: 4,
                        color: civData?.color || '#999',
                        data: civData || { name: event.civilization }
                    });
                }
                // 创建链接
                this.links.push({
                    source: civId,
                    target: eventNode.id,
                    type: 'contains'
                });
            }
        });

        // 2. 从世界文明构建人物节点和链接
        Object.keys(this.worldCivilizations).forEach(civId => {
            const civData = this.worldCivilizations[civId];
            if (!civData) return;

            // 确保文明节点存在
            const civNodeId = `civ-${civId}`;
            if (!this.nodes.find(n => n.id === civNodeId)) {
                this.nodes.push({
                    id: civNodeId,
                    name: civData.name,
                    type: 'civilization',
                    importance: 4,
                    color: civData.color || '#999',
                    data: civData
                });
            }

            // 处理人物
            if (civData.persons) {
                civData.persons.forEach(person => {
                    const personId = `person-${person.id}`;
                    const personNode = this.nodes.find(n => n.id === personId);
                    if (!personNode) {
                        this.nodes.push({
                            id: personId,
                            name: person.name,
                            type: 'person',
                            year: person.year,
                            location: person.location,
                            category: person.category,
                            importance: person.importance || 4,
                            data: person
                        });
                    }
                    // 链接人物到文明
                    this.links.push({
                        source: civNodeId,
                        target: personId,
                        type: 'belongs-to'
                    });

                    // 处理人物关系
                    if (person.relations) {
                        Object.keys(person.relations).forEach(relationType => {
                            const relatedIds = person.relations[relationType];
                            if (Array.isArray(relatedIds)) {
                                relatedIds.forEach(relatedId => {
                                    const targetId = `person-${relatedId}`;
                                    this.links.push({
                                        source: personId,
                                        target: targetId,
                                        type: relationType
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });

        // 3. 从中国朝代构建节点和链接
        this.chineseDynasties.forEach(dynasty => {
            const dynastyId = `china-dynasty-${dynasty.id}`;

            // 创建朝代节点
            this.nodes.push({
                id: dynastyId,
                name: dynasty.name,
                type: 'civilization',
                start: dynasty.start,
                end: dynasty.end,
                capital: dynasty.capital,
                importance: 4,
                color: '#c9302c',
                data: dynasty
            });

            // 创建都城节点
            if (dynasty.capital) {
                const capitalId = `location-${dynasty.capital}`;
                const capitalNode = this.nodes.find(n => n.id === capitalId);
                if (!capitalNode) {
                    this.nodes.push({
                        id: capitalId,
                        name: dynasty.capital,
                        type: 'location',
                        importance: 3,
                        data: { location: dynasty.capital }
                    });
                }
                // 链接朝代到都城
                this.links.push({
                    source: dynastyId,
                    target: capitalId,
                    type: 'capital'
                });
            }

            // 处理成就（作为技术/文化节点）
            if (dynasty.achievements) {
                dynasty.achievements.forEach(achievement => {
                    const techId = `tech-${dynasty.id}-${achievement.substring(0, 10)}`;
                    const techNode = this.nodes.find(n => n.id === techId);
                    if (!techNode) {
                        // 判断类型
                        let type = 'technology';
                        if (achievement.includes('文化') || achievement.includes('艺术') || achievement.includes('文学')) {
                            type = 'culture';
                        }

                        this.nodes.push({
                            id: techId,
                            name: achievement,
                            type: type,
                            importance: 3,
                            data: { achievement: achievement }
                        });
                    }
                    // 链接朝代到成就
                    this.links.push({
                        source: dynastyId,
                        target: techId,
                        type: 'achieved'
                    });
                });
            }
        });

        // 4. 添加一些跨文明的关联
        this.addCrossCivilizationLinks();
    }

    addCrossCivilizationLinks() {
        // 丝绸之路相关链接
        const silkRoadLocations = ['长安', '敦煌', '中亚', '波斯', '罗马', '君士坦丁堡'];
        const silkRoadEvents = [
            'we-016', // 马可·波罗到达中国
            'we-026'  // 瓦斯科·达·伽马到达印度
        ];

        const routeNodes = this.nodes.filter(n =>
            silkRoadLocations.some(loc => n.name?.includes(loc))
        );

        for (let i = 0; i < routeNodes.length - 1; i++) {
            this.links.push({
                source: routeNodes[i].id,
                target: routeNodes[i + 1].id,
                type: 'trade-route'
            });
        }

        // 文化交流链接
        const culturalExchanges = [
            ['plato', 'aristotle'], // 师徒关系
            ['aristotle', 'alexander'], // 师徒关系
            ['socrates', 'plato'], // 师徒关系
        ];

        culturalExchanges.forEach(([person1, person2]) => {
            const node1 = this.nodes.find(n => n.data?.id === person1 || n.name?.includes(person1));
            const node2 = this.nodes.find(n => n.data?.id === person2 || n.name?.includes(person2));
            if (node1 && node2) {
                this.links.push({
                    source: node1.id,
                    target: node2.id,
                    type: 'influenced'
                });
            }
        });
    }

    renderGraph() {
        const container = document.getElementById('graph-svg-container');
        if (!container) return;

        // 清空容器
        container.innerHTML = '';

        // 创建 SVG
        this.svg = d3.select('#graph-svg-container')
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .attr('viewBox', [0, 0, this.options.width, this.options.height])
            .style('font-family', 'Arial, sans-serif');

        // 添加缩放功能
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        this.svg.call(zoom);

        // 创建主组
        const g = this.svg.append('g');

        // 创建力导向模拟
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.options.width / 2, this.options.height / 2))
            .force('collision', d3.forceCollide().radius(30));

        // 绘制链接
        const link = g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.links)
            .join('line')
            .attr('class', 'graph-link')
            .attr('stroke', d => this.getLinkColor(d.type))
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.6);

        // 绘制节点
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(this.nodes)
            .join('g')
            .attr('class', 'graph-node')
            .call(d3.drag()
                .on('start', (event, d) => this.dragstarted(event, d))
                .on('drag', (event, d) => this.dragged(event, d))
                .on('end', (event, d) => this.dragended(event, d)))
            .on('click', (event, d) => this.showNodeDetails(d))
            .on('mouseover', function(event, d) {
                d3.select(this).select('circle')
                    .attr('stroke-width', 4)
                    .attr('stroke', '#333');
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('circle')
                    .attr('stroke-width', 2)
                    .attr('stroke', '#fff');
            });

        // 节点圆形
        node.append('circle')
            .attr('r', d => this.getNodeRadius(d))
            .attr('fill', d => this.getNodeColor(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // 节点标签
        node.append('text')
            .attr('dx', d => this.getNodeRadius(d) + 5)
            .attr('dy', 4)
            .text(d => d.name)
            .attr('font-size', '12px')
            .attr('fill', '#333')
            .style('pointer-events', 'none')
            .style('text-shadow', '0 0 3px white');

        // 更新位置
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // 保存引用
        this.g = g;
        this.nodeElements = node;
        this.linkElements = link;
    }

    getNodeRadius(node) {
        const baseRadius = 15;
        const importanceMultiplier = node.importance || 1;
        return baseRadius * (importanceMultiplier / 3);
    }

    getNodeColor(type) {
        const colors = {
            person: '#4CAF50',
            event: '#FF5722',
            location: '#2196F3',
            technology: '#9C27B0',
            culture: '#E91E63',
            civilization: '#607D8B'
        };
        return colors[type] || '#999';
    }

    getLinkColor(type) {
        const colors = {
            'location': '#2196F3',
            'contains': '#999',
            'belongs-to': '#4CAF50',
            'capital': '#FFC107',
            'achieved': '#9C27B0',
            'trade-route': '#FF5722',
            'influenced': '#E91E63',
            'influencing': '#E91E63',
            'contemporary': '#607D8B',
            'caused_by': '#795548',
            'default': '#999'
        };
        return colors[type] || colors['default'];
    }

    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    bindEvents() {
        // 搜索功能
        document.getElementById('search-btn')?.addEventListener('click', () => this.performSearch());
        document.getElementById('graph-search')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // 过滤器
        document.querySelectorAll('.filter-item input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // 重置视图
        document.getElementById('reset-view-btn')?.addEventListener('click', () => this.resetView());

        // 高亮路径
        document.getElementById('highlight-path-btn')?.addEventListener('click', () => this.highlightPath());

        // 关闭详情面板
        document.querySelector('.panel-close')?.addEventListener('click', () => {
            document.getElementById('node-detail-panel').classList.add('hidden');
        });
    }

    performSearch() {
        const query = document.getElementById('graph-search').value.toLowerCase();
        if (!query) return;

        // 查找匹配的节点
        const matchedNodes = this.nodes.filter(n =>
            n.name?.toLowerCase().includes(query) ||
            n.description?.toLowerCase().includes(query) ||
            n.location?.toLowerCase().includes(query)
        );

        if (matchedNodes.length > 0) {
            // 高亮匹配的节点
            this.nodeElements.style('opacity', d => matchedNodes.includes(d) ? 1 : 0.1);
            this.linkElements.style('opacity', d => {
                const isConnected = matchedNodes.some(n =>
                    d.source.id === n.id || d.target.id === n.id
                );
                return isConnected ? 0.8 : 0.05;
            });

            // 自动聚焦到第一个匹配节点
            this.focusOnNode(matchedNodes[0]);
        }
    }

    applyFilters() {
        const selectedTypes = [];
        document.querySelectorAll('.filter-item input:checked').forEach(checkbox => {
            selectedTypes.push(checkbox.dataset.type);
        });

        this.nodeElements.style('display', d =>
            selectedTypes.includes(d.type) ? 'block' : 'none'
        );

        // 重新启动模拟以调整布局
        this.simulation.alpha(0.3).restart();
    }

    resetView() {
        // 重置缩放
        this.svg.transition().duration(750).call(
            d3.zoom().transform,
            d3.zoomIdentity
        );

        // 重置节点和链接样式
        this.nodeElements.style('opacity', 1);
        this.linkElements.style('opacity', 0.6);

        // 重新启动模拟
        this.simulation.alpha(0.3).restart();
    }

    focusOnNode(node) {
        // 缩放到节点
        this.svg.transition().duration(750).call(
            d3.zoom().transform,
            d3.zoomIdentity
                .translate(this.options.width / 2, this.options.height / 2)
                .scale(2)
                .translate(-node.x, -node.y)
        );
    }

    highlightPath() {
        const query = document.getElementById('graph-search').value.toLowerCase();
        if (!query) {
            alert('请先输入搜索内容');
            return;
        }

        // 查找相关节点和路径
        const relatedNodes = new Set();
        const relatedLinks = new Set();

        this.nodes.forEach(node => {
            if (node.name?.toLowerCase().includes(query)) {
                relatedNodes.add(node.id);
            }
        });

        // 查找相关链接
        this.links.forEach(link => {
            if (relatedNodes.has(link.source.id) || relatedNodes.has(link.target.id)) {
                relatedLinks.add(link);
                relatedNodes.add(link.source.id);
                relatedNodes.add(link.target.id);
            }
        });

        // 高亮路径
        this.nodeElements.style('opacity', d => relatedNodes.has(d.id) ? 1 : 0.1);
        this.linkElements.style('opacity', d => relatedLinks.has(d) ? 0.8 : 0.05);

        // 重新启动模拟以突出显示相关节点
        this.simulation.alpha(0.3).restart();
    }

    showNodeDetails(node) {
        const panel = document.getElementById('node-detail-panel');
        const title = document.getElementById('detail-title');
        const content = document.getElementById('detail-content');

        if (!panel || !title || !content) return;

        title.textContent = node.name;

        let html = `
            <div class="detail-info">
                <p><strong>类型:</strong> ${this.getTypeLabel(node.type)}</p>
                ${node.year ? `<p><strong>年份:</strong> ${node.year < 0 ? `公元前${Math.abs(node.year)}年` : `公元${node.year}年`}</p>` : ''}
                ${node.location ? `<p><strong>地点:</strong> ${node.location}</p>` : ''}
                ${node.civilization ? `<p><strong>文明:</strong> ${node.civilization}</p>` : ''}
                ${node.start ? `<p><strong>起始:</strong> ${node.start}</p>` : ''}
                ${node.end ? `<p><strong>结束:</strong> ${node.end}</p>` : ''}
                ${node.capital ? `<p><strong>都城:</strong> ${node.capital}</p>` : ''}
                ${node.category ? `<p><strong>类别:</strong> ${node.category}</p>` : ''}
                ${node.significance ? `<p><strong>意义:</strong> ${node.significance}</p>` : ''}
            </div>
        `;

        if (node.description) {
            html += `
                <div class="detail-description">
                    <h4>描述</h4>
                    <p>${node.description}</p>
                </div>
            `;
        }

        // 查找相关链接
        const relatedLinks = this.links.filter(l =>
            l.source.id === node.id || l.target.id === node.id
        );

        if (relatedLinks.length > 0) {
            html += '<div class="detail-relations"><h4>相关关系</h4><ul>';
            relatedLinks.forEach(link => {
                const otherNode = link.source.id === node.id ? link.target : link.source;
                html += `
                    <li>
                        <span class="relation-type">${this.getRelationLabel(link.type)}</span>
                        <a href="#" data-node-id="${otherNode.id}" class="related-node">${otherNode.name}</a>
                    </li>
                `;
            });
            html += '</ul></div>';
        }

        content.innerHTML = html;
        panel.classList.remove('hidden');

        // 绑定相关节点点击事件
        content.querySelectorAll('.related-node').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const nodeId = e.target.dataset.nodeId;
                const node = this.nodes.find(n => n.id === nodeId);
                if (node) {
                    this.showNodeDetails(node);
                    this.focusOnNode(node);
                }
            });
        });
    }

    getTypeLabel(type) {
        const labels = {
            person: '人物',
            event: '事件',
            location: '地点',
            technology: '技术',
            culture: '文化',
            civilization: '文明'
        };
        return labels[type] || type;
    }

    getRelationLabel(type) {
        const labels = {
            'location': '位于',
            'contains': '包含',
            'belongs-to': '属于',
            'capital': '都城',
            'achieved': '成就',
            'trade-route': '贸易路线',
            'influenced': '受影响于',
            'influencing': '影响了',
            'contemporary': '同时代',
            'caused_by': '由...导致',
            'default': '关联'
        };
        return labels[type] || labels['default'];
    }

    _extractChineseDynasties() {
        const cd = window.ChineseDynasties || {};
        return Object.entries(cd).map(([key, d]) => ({
            id: key,
            name: d.name,
            start: d.period ? d.period.start : 0,
            end: d.period ? d.period.end : 0,
            capital: d.capital || '',
            color: d.color || '#c9302c',
            achievements: d.achievements || [],
            description: d.description || '',
            events: d.events || [],
            persons: d.persons || []
        }));
    }
}



// 导出到全局
window.KnowledgeGraph = KnowledgeGraph;