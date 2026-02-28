/**
 * 地图视图 - 地理可视化
 */

class MapView {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.map = null;
        
        this.config = {
            center: [35, 105],
            zoom: 4,
            minZoom: 2,
            maxZoom: 10
        };
        
        this.markers = [];
    }
    
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'map-view';
        this.container.style.width = '100%';
        this.container.style.height = (window.innerHeight - 180) + 'px';
        
        document.querySelector(this.app.options.container).appendChild(this.container);
        
        this.initMap();
        this.loadData();
        
        this.app.eventBus.emit('view:ready', { view: 'map' });
    }
    
    hide() {
        if (this.map) {
            this.map.remove();
        }
        if (this.container) {
            this.container.remove();
        }
    }
    
    initMap() {
        // 使用Leaflet创建地图
        this.map = L.map(this.container, {
            center: this.config.center,
            zoom: this.config.zoom,
            minZoom: this.config.minZoom,
            maxZoom: this.config.maxZoom
        });
        
        // 添加地图图层
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }
    
    loadData() {
        const nodes = Array.from(this.app.dataService.nodes.values());
        
        nodes.forEach(node => {
            if (node.location.coordinates) {
                this.addMarker(node);
            }
        });
    }
    
    addMarker(node) {
        const [lng, lat] = node.location.coordinates;
        
        const marker = L.circleMarker([lat, lng], {
            radius: this.getMarkerRadius(node),
            fillColor: this.getMarkerColor(node),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(this.map);
        
        marker.bindPopup(this.createPopupContent(node));
        
        marker.on('click', () => {
            this.app.eventBus.emit('node:select', node);
        });
        
        this.markers.push(marker);
    }
    
    createPopupContent(node) {
        return `
            <div class="map-popup">
                <h3>${node.name}</h3>
                <p>${node.time.displayDate}</p>
                <p>${node.summary}</p>
            </div>
        `;
    }
    
    getMarkerRadius(node) {
        return 5 + node.metadata.importance * 2;
    }
    
    getMarkerColor(node) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316'
        };
        return colors[node.category.primary] || '#999';
    }
    
    filterByCategory(category) {
        this.markers.forEach(marker => {
            const node = marker.node;
            if (category && node.category.primary !== category) {
                marker.setStyle({ opacity: 0.1 });
            } else {
                marker.setStyle({ opacity: 1 });
            }
        });
    }
    
    filterByPeriod(period) {
        this.markers.forEach(marker => {
            const node = marker.node;
            if (period && node.time.period !== period) {
                marker.setStyle({ opacity: 0.1 });
            } else {
                marker.setStyle({ opacity: 1 });
            }
        });
    }
    
    destroy() {
        this.hide();
        this.app.eventBus.emit('view:destroy', { view: 'map' });
    }
}

window.MapView = MapView;
