// 交互逻辑

class InteractionManager {
    constructor(tree) {
        this.tree = tree;
        this.init();
    }
    
    init() {
        // 搜索功能
        this.initSearch();
        
        // 筛选面板
        this.initFilter();
        
        // 缩放控制
        this.initZoomControls();
        
        // 时间轴控制
        this.initTimeline();
        
        // 键盘快捷键
        this.initKeyboard();
        
        // 窗口调整
        this.initResize();
    }
    
    initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.tree.search(e.target.value);
            }, 300);
        });
        
        searchBtn.addEventListener('click', () => {
            this.tree.search(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.tree.search(searchInput.value);
            }
        });
    }
    
    initFilter() {
        const filterBtn = document.getElementById('filterBtn');
        const filterPanel = document.getElementById('filterPanel');
        const applyBtn = document.getElementById('applyFilter');
        
        // 切换面板显示
        filterBtn.addEventListener('click', () => {
            filterPanel.classList.toggle('hidden');
        });
        
        // 应用筛选
        applyBtn.addEventListener('click', () => {
            const filters = {
                period: document.getElementById('periodFilter').value,
                type: document.getElementById('typeFilter').value,
                categories: Array.from(document.querySelectorAll('.checkbox-group input:checked'))
                    .map(cb => cb.value),
                importance: parseInt(document.getElementById('importanceFilter').value)
            };
            
            this.tree.filter(filters);
            filterPanel.classList.add('hidden');
        });
        
        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (!filterPanel.contains(e.target) && e.target !== filterBtn) {
                filterPanel.classList.add('hidden');
            }
        });
    }
    
    initZoomControls() {
        // 创建缩放控制按钮
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'zoom-controls';
        controlsDiv.innerHTML = `
            <button class="zoom-btn" id="zoomIn">+</button>
            <button class="zoom-btn" id="zoomOut">−</button>
            <button class="zoom-btn" id="resetZoom">⌂</button>
        `;
        document.body.appendChild(controlsDiv);
        
        // 绑定事件
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.tree.zoomIn();
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            this.tree.zoomOut();
        });
        
        document.getElementById('resetZoom').addEventListener('click', () => {
            this.tree.resetZoom();
        });
    }
    
    initTimeline() {
        const timeSlider = document.getElementById('timeSlider');
        
        timeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // 根据时间轴值筛选显示的时期
            // 0-20: 远古时代
            // 20-40: 古代
            // 40-60: 中世纪
            // 60-80: 近代
            // 80-100: 现代
            
            let period = '';
            if (value < 20) period = '远古时代';
            else if (value < 40) period = '古代';
            else if (value < 60) period = '中世纪';
            else if (value < 80) period = '近代';
            else period = '现代';
            
            this.highlightPeriod(period);
        });
    }
    
    highlightPeriod(period) {
        // 高亮指定时期的节点
        this.tree.svgGroup.selectAll('.node').each(d => {
            const isPeriod = d.data.name === period;
            const isChild = this.isInPeriod(d, period);
            
            d3.select(event.currentTarget)
                .classed('highlighted', isPeriod || isChild)
                .classed('dimmed', !(isPeriod || isChild) && d.depth > 0);
        });
    }
    
    isInPeriod(node, periodName) {
        // 检查节点是否属于指定时期
        let current = node;
        while (current) {
            if (current.data.name === periodName) return true;
            current = current.parent;
        }
        return false;
    }
    
    initKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + F: 聚焦搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
            
            // ESC: 关闭详情卡片
            if (e.key === 'Escape') {
                closeDetail();
            }
            
            // +/-: 缩放
            if (e.key === '+' || e.key === '=') {
                this.tree.zoomIn();
            } else if (e.key === '-') {
                this.tree.zoomOut();
            }
            
            // Home: 重置视图
            if (e.key === 'Home') {
                this.tree.resetZoom();
            }
        });
    }
    
    initResize() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // 重新调整SVG尺寸
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight - 180;
                
                this.tree.svg
                    .attr('width', newWidth)
                    .attr('height', newHeight);
                
                this.tree.width = newWidth;
                this.tree.height = newHeight;
                
                // 重新渲染
                this.tree.update(this.tree.root);
            }, 300);
        });
    }
}

// 触摸设备支持
class TouchSupport {
    constructor(tree) {
        this.tree = tree;
        this.init();
    }
    
    init() {
        const svg = this.tree.svg.node();
        
        // 双击放大
        svg.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.tree.zoomIn();
        });
        
        // 双指缩放（已由D3 zoom处理）
        
        // 长按显示详情
        let pressTimer;
        
        svg.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                // 触发详情显示
                const touch = e.touches[0];
                const node = this.findNodeAtPoint(touch.clientX, touch.clientY);
                if (node) {
                    this.tree.showDetail(node.data);
                }
            }, 800);
        });
        
        svg.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
        
        svg.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });
    }
    
    findNodeAtPoint(x, y) {
        // 查找指定位置的节点
        let found = null;
        
        this.tree.svgGroup.selectAll('.node').each(function(d) {
            const circle = d3.select(this).select('circle').node();
            const rect = circle.getBoundingClientRect();
            
            if (x >= rect.left && x <= rect.right &&
                y >= rect.top && y <= rect.bottom) {
                found = d;
            }
        });
        
        return found;
    }
}

// 拖拽支持
class DragSupport {
    constructor(tree) {
        this.tree = tree;
        this.drag = null;
        this.init();
    }
    
    init() {
        this.drag = d3.drag()
            .on('start', (event, d) => this.dragStarted(event, d))
            .on('drag', (event, d) => this.dragged(event, d))
            .on('end', (event, d) => this.dragEnded(event, d));
        
        this.tree.svgGroup.selectAll('.node').call(this.drag);
    }
    
    dragStarted(event, d) {
        d3.select(event.sourceEvent.currentTarget).raise();
    }
    
    dragged(event, d) {
        d.x = event.x;
        d.y = event.y;
        
        d3.select(event.sourceEvent.currentTarget)
            .attr('transform', `translate(${d.y},${d.x})`);
    }
    
    dragEnded(event, d) {
        // 可以在这里保存新的位置
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InteractionManager, TouchSupport, DragSupport };
}
