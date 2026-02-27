// 地图视图

class HistoryMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = 800;
        this.height = 600;
        this.svg = null;
        this.projection = null;
        this.markers = [];
    }
    
    init() {
        // 创建SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        
        // 设置投影（墨卡托投影）
        this.projection = d3.geoMercator()
            .scale(150)
            .translate([this.width / 2, this.height / 2]);
        
        // 绘制简化世界地图（使用预定义的边界）
        this.drawWorld();
    }
    
    drawWorld() {
        // 简化的世界地图边界数据
        // 实际应用中应该从GeoJSON文件加载
        this.svg.append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('fill', '#1a1a2e');
        
        // 添加网格线
        this.svg.append('g')
            .attr('class', 'graticule')
            .selectAll('path')
            .data(d3.range(-180, 180, 30).flatMap(lon => 
                d3.range(-90, 90, 30).map(lat => ({
                    type: 'LineString',
                    coordinates: [[lon, -90], [lon, 90]]
                }))
            ))
            .enter().append('path')
            .attr('d', d3.geoPath().projection(this.projection))
            .attr('stroke', 'rgba(255,255,255,0.1)')
            .attr('fill', 'none');
    }
    
    addMarker(location, data) {
        // 地理坐标映射
        const locationCoords = this.getCoordinates(location);
        
        if (!locationCoords) {
            console.warn(`Location not found: ${location}`);
            return;
        }
        
        const coords = this.projection(locationCoords);
        
        const marker = this.svg.append('g')
            .attr('class', 'map-marker')
            .attr('transform', `translate(${coords[0]},${coords[1]})`)
            .style('cursor', 'pointer');
        
        // 绘制标记点
        marker.append('circle')
            .attr('r', 8)
            .attr('fill', this.getMarkerColor(data))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('class', 'marker-circle');
        
        // 添加脉冲效果
        marker.append('circle')
            .attr('r', 8)
            .attr('fill', 'none')
            .attr('stroke', this.getMarkerColor(data))
            .attr('stroke-width', 2)
            .attr('class', 'marker-pulse')
            .style('animation', 'pulse 2s infinite');
        
        // 添加标签
        marker.append('text')
            .attr('dy', -15)
            .attr('text-anchor', 'middle')
            .text(data.name)
            .style('font-size', '12px')
            .style('fill', '#fff')
            .style('opacity', 0.8);
        
        // 添加交互
        marker.on('mouseover', () => {
            marker.select('.marker-circle')
                .transition()
                .attr('r', 12);
        });
        
        marker.on('mouseout', () => {
            marker.select('.marker-circle')
                .transition()
                .attr('r', 8);
        });
        
        marker.on('click', () => {
            if (typeof showDetail === 'function') {
                showDetail(data);
            }
        });
        
        this.markers.push(marker);
    }
    
    getCoordinates(location) {
        // 地理坐标映射表
        const locations = {
            '中国': [105, 35],
            '北京': [116.4, 39.9],
            '长安': [108.9, 34.3],
            '南京': [118.8, 32.1],
            '黄河流域': [110, 35],
            '美索不达米亚': [44, 33],
            '尼罗河流域': [31, 26],
            '印度河流域': [68, 27],
            '巴比伦': [44.4, 32.5],
            '特洛伊': [26.2, 39.9],
            '耶路撒冷': [35.2, 31.8],
            '波斯': [54, 32],
            '罗马': [12.5, 41.9],
            '雅典': [23.7, 37.9],
            '印度': [78, 22],
            '麦加': [39.8, 21.4],
            '中东': [45, 28],
            '蒙古': [103, 46],
            '大都（北京）': [116.4, 39.9],
            '欧洲': [10, 50],
            '巴黎': [2.3, 48.9],
            '伦敦': [-0.1, 51.5],
            '德国': [10.5, 51.2],
            '英国': [-3.4, 55.4],
            '法国': [2.2, 46.2],
            '北美': [-100, 40],
            '美国': [-98, 38],
            '夏威夷': [-157.8, 21.3],
            '日本': [138, 36],
            '香港': [114.2, 22.3],
            '纽约': [-74, 40.7],
            '月球': [0, 0], // 特殊标记
            '大西洋': [-30, 25],
            '印度洋': [70, -10],
            '欧亚大陆': [70, 50],
            '地中海': [15, 38],
            '阿尔卑斯山': [10, 46],
            '欧亚非': [30, 25],
            '全球': [0, 20]
        };
        
        return locations[location] || null;
    }
    
    getMarkerColor(data) {
        const colors = {
            politics: '#e74c3c',
            technology: '#3498db',
            culture: '#9b59b6',
            economy: '#2ecc71',
            military: '#e67e22'
        };
        
        return colors[data.category] || '#FFD700';
    }
    
    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }
    
    highlightLocation(location) {
        const coords = this.getCoordinates(location);
        
        if (coords) {
            const point = this.projection(coords);
            
            this.svg.append('circle')
                .attr('class', 'highlight-circle')
                .attr('cx', point[0])
                .attr('cy', point[1])
                .attr('r', 20)
                .attr('fill', 'none')
                .attr('stroke', '#FFD700')
                .attr('stroke-width', 3)
                .style('animation', 'pulse 2s infinite')
                .transition()
                .delay(2000)
                .remove();
        }
    }
}

// 地图面板
function showMapPanel() {
    const panel = document.createElement('div');
    panel.className = 'map-panel';
    panel.innerHTML = `
        <div class="map-header">
            <h3>🗺️ 历史地图</h3>
            <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div id="historyMap" class="map-content"></div>
        <div class="map-legend">
            <div class="legend-item"><span class="dot politics"></span> 政治</div>
            <div class="legend-item"><span class="dot technology"></span> 科技</div>
            <div class="legend-item"><span class="dot culture"></span> 文化</div>
            <div class="legend-item"><span class="dot economy"></span> 经济</div>
            <div class="legend-item"><span class="dot military"></span> 军事</div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // 初始化地图
    const map = new HistoryMap('historyMap');
    map.init();
    
    // 添加历史事件标记
    addHistoryMarkers(map);
    
    return map;
}

// 添加历史标记
function addHistoryMarkers(map) {
    // 从数据中提取有位置信息的事件
    function extractLocations(node, locations = []) {
        if (node.location) {
            locations.push({
                name: node.name,
                location: node.location,
                category: node.category,
                year: node.year,
                description: node.description
            });
        }
        
        if (node.children) {
            node.children.forEach(child => extractLocations(child, locations));
        }
        
        return locations;
    }
    
    const locations = extractLocations(historyData);
    
    locations.forEach(loc => {
        map.addMarker(loc.location, loc);
    });
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HistoryMap, showMapPanel };
}
