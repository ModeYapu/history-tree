/**
 * 性能监控和优化工具
 */

class PerformanceOptimizer {
    constructor(app) {
        this.app = app;
        this.metrics = {
            fps: 0,
            memory: 0,
            loadTime: 0,
            renderTime: 0,
            networkTime: 0
        };
        
        this.observers = [];
        this.cache = new Map();
        this.worker = null;
        
        this.init();
    }
    
    /**
     * 初始化性能监控
     */
    init() {
        // FPS监控
        this.monitorFPS();
        
        // 内存监控
        this.monitorMemory();
        
        // 性能观察器
        this.setupObservers();
        
        // 初始化Web Worker
        this.initWorker();
    }
    
    /**
     * FPS监控
     */
    monitorFPS() {
        let lastTime = performance.now();
        let frames = 0;
        
        const measureFPS = () => {
            frames++;
            
            const currentTime = performance.now();
            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = frames;
                frames = 0;
                lastTime = currentTime;
                
                // 如果FPS低于30，触发优化
                if (this.metrics.fps < 30) {
                    this.optimizePerformance();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    /**
     * 内存监控
     */
    monitorMemory() {
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memory = performance.memory.usedJSHeapSize / 1024 / 1024;
                
                // 如果内存超过100MB，触发清理
                if (this.metrics.memory > 100) {
                    this.cleanup();
                }
            }, 5000);
        }
    }
    
    /**
     * 设置性能观察器
     */
    setupObservers() {
        // 观察长任务
        if (PerformanceObserver) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry);
                        this.reportLongTask(entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['longtask'] });
            this.observers.push(observer);
        }
    }
    
    /**
     * 初始化Web Worker
     */
    initWorker() {
        const workerCode = `
            // 数据处理Worker
            self.onmessage = function(e) {
                const { type, data } = e.data;
                
                switch (type) {
                    case 'search':
                        const results = performSearch(data);
                        self.postMessage({ type: 'search', results });
                        break;
                        
                    case 'filter':
                        const filtered = performFilter(data);
                        self.postMessage({ type: 'filter', results: filtered });
                        break;
                        
                    case 'index':
                        buildIndex(data);
                        self.postMessage({ type: 'index', status: 'done' });
                        break;
                }
            };
            
            function performSearch(data) {
                // 实现搜索逻辑
                return data.nodes.filter(node => 
                    node.name.includes(data.query)
                );
            }
            
            function performFilter(data) {
                // 实现筛选逻辑
                return data.nodes.filter(node => {
                    if (data.category && node.category !== data.category) return false;
                    if (data.period && node.period !== data.period) return false;
                    return true;
                });
            }
            
            function buildIndex(data) {
                // 构建索引
                const index = {};
                data.forEach(node => {
                    const words = node.name.split(' ');
                    words.forEach(word => {
                        if (!index[word]) index[word] = [];
                        index[word].push(node.id);
                    });
                });
                self.postMessage({ type: 'indexData', index });
            }
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        
        this.worker.onmessage = (e) => {
            const { type, results } = e.data;
            
            if (this.pendingCallbacks && this.pendingCallbacks[type]) {
                this.pendingCallbacks[type](results);
                delete this.pendingCallbacks[type];
            }
        };
        
        this.pendingCallbacks = {};
    }
    
    /**
     * 使用Worker进行搜索
     */
    searchWithWorker(query, callback) {
        const data = {
            type: 'search',
            data: {
                query,
                nodes: Array.from(this.app.dataService.nodes.values())
            }
        };
        
        this.pendingCallbacks['search'] = callback;
        this.worker.postMessage(data);
    }
    
    /**
     * 优化3D渲染
     */
    optimize3DRendering() {
        const view = this.app.currentView;
        
        if (view && view.treeGroup) {
            // 降低细节层次
            view.treeGroup.traverse((object) => {
                if (object.geometry) {
                    // 根据距离调整细节
                    const distance = this.app.camera.position.distanceTo(object.position);
                    
                    if (distance > 50) {
                        // 远距离：简化几何体
                        if (object.geometry.parameters) {
                            object.geometry.parameters.segments = 8;
                        }
                    }
                }
            });
            
            // 减少粒子数量
            if (view.particles) {
                const positions = view.particles.geometry.attributes.position.array;
                const reducedPositions = positions.slice(0, positions.length / 2);
                view.particles.geometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(reducedPositions, 3)
                );
            }
        }
    }
    
    /**
     * 优化数据加载
     */
    optimizeDataLoading() {
        // 实现懒加载
        const lazyLoader = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const nodeId = entry.target.dataset.nodeId;
                    this.loadNodeData(nodeId);
                    lazyLoader.unobserve(entry.target);
                }
            });
        });
        
        // 观察所有节点
        document.querySelectorAll('[data-node-id]').forEach(el => {
            lazyLoader.observe(el);
        });
    }
    
    /**
     * 加载节点数据
     */
    async loadNodeData(nodeId) {
        // 检查缓存
        if (this.cache.has(nodeId)) {
            return this.cache.get(nodeId);
        }
        
        // 加载数据
        const data = await this.app.dataService.getNode(nodeId);
        
        // 缓存
        this.cache.set(nodeId, data);
        
        return data;
    }
    
    /**
     * 清理缓存
     */
    cleanup() {
        // 清理旧缓存
        const maxCacheSize = 50;
        
        if (this.cache.size > maxCacheSize) {
            const keys = Array.from(this.cache.keys());
            const toDelete = keys.slice(0, this.cache.size - maxCacheSize);
            
            toDelete.forEach(key => this.cache.delete(key));
        }
        
        // 强制垃圾回收（如果可用）
        if (window.gc) {
            window.gc();
        }
    }
    
    /**
     * 优化性能
     */
    optimizePerformance() {
        console.log('⚡ Optimizing performance...');
        
        // 1. 降低3D渲染质量
        this.optimize3DRendering();
        
        // 2. 清理缓存
        this.cleanup();
        
        // 3. 暂停非关键动画
        this.pauseNonCriticalAnimations();
        
        // 4. 减少粒子效果
        this.reduceParticleEffects();
    }
    
    /**
     * 暂停非关键动画
     */
    pauseNonCriticalAnimations() {
        // 暂停树叶漂浮动画
        const view = this.app.currentView;
        if (view && view.leaves) {
            view.leaves.forEach(leaf => {
                leaf.userData.animationPaused = true;
            });
        }
    }
    
    /**
     * 减少粒子效果
     */
    reduceParticleEffects() {
        const view = this.app.currentView;
        if (view && view.particles) {
            view.particles.visible = false;
        }
    }
    
    /**
     * 报告长任务
     */
    reportLongTask(entry) {
        // 发送到监控系统
        console.warn('Long task:', {
            duration: entry.duration,
            name: entry.name,
            startTime: entry.startTime
        });
    }
    
    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        return {
            metrics: this.metrics,
            cacheSize: this.cache.size,
            memoryUsage: this.metrics.memory,
            fps: this.metrics.fps,
            recommendations: this.getRecommendations()
        };
    }
    
    /**
     * 获取优化建议
     */
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.fps < 30) {
            recommendations.push('FPS过低，建议降低3D渲染质量');
        }
        
        if (this.metrics.memory > 100) {
            recommendations.push('内存占用过高，建议清理缓存');
        }
        
        if (this.cache.size > 100) {
            recommendations.push('缓存过多，建议清理');
        }
        
        return recommendations;
    }
    
    /**
     * 销毁
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        if (this.worker) {
            this.worker.terminate();
        }
        this.cache.clear();
    }
}

// 导出到全局
window.PerformanceOptimizer = PerformanceOptimizer;
