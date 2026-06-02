/**
 * 状态管理 - 响应式状态系统
 */

class StateManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.state = {
            // 应用状态
            app: {
                version: '4.0.0',
                initialized: false,
                loading: false,
                error: null
            },
            
            // 视图状态
            view: {
                current: 'tree',
                previous: null,
                history: []
            },
            
            // 数据状态
            data: {
                nodes: [],
                relations: [],
                filtered: [],
                selected: null,
                searchTerm: '',
                filters: {}
            },
            
            // UI状态
            ui: {
                theme: 'light',
                sidebarOpen: false,
                modalOpen: false,
                notifications: []
            },
            
            // 用户状态
            user: {
                authenticated: false,
                profile: null,
                preferences: {},
                progress: {}
            }
        };
        
        // 状态历史（用于调试）
        this.history = [];
        this.maxHistorySize = 50;
        
        // 监听器
        this.watchers = new Map();
    }
    
    /**
     * 获取状态
     */
    getState(path = null) {
        if (!path) {
            return this.state;
        }
        
        return this.getNestedValue(this.state, path);
    }
    
    /**
     * 设置状态
     */
    setState(path, value, silent = false) {
        const oldValue = this.getNestedValue(this.state, path);
        
        // 更新状态
        this.setNestedValue(this.state, path, value);
        
        // 记录历史
        this.recordHistory(path, oldValue, value);
        
        // 触发监听器
        if (!silent) {
            this.notifyWatchers(path, value, oldValue);
        }
        
        return value;
    }
    
    /**
     * 批量更新状态
     */
    batchUpdate(updates, silent = false) {
        const oldValues = {};
        
        updates.forEach(({ path, value }) => {
            oldValues[path] = this.getNestedValue(this.state, path);
            this.setNestedValue(this.state, path, value);
        });
        
        // 批量通知
        if (!silent) {
            updates.forEach(({ path, value }) => {
                this.notifyWatchers(path, value, oldValues[path]);
            });
        }
    }
    
    /**
     * 监听状态变化
     */
    watch(path, callback, immediate = false) {
        if (!this.watchers.has(path)) {
            this.watchers.set(path, []);
        }
        
        this.watchers.get(path).push(callback);
        
        // 立即执行
        if (immediate) {
            const value = this.getState(path);
            callback(value, undefined);
        }
        
        // 返回取消监听函数
        return () => {
            const watchers = this.watchers.get(path);
            const index = watchers.indexOf(callback);
            if (index > -1) {
                watchers.splice(index, 1);
            }
        };
    }
    
    /**
     * 重置状态
     */
    reset(path = null) {
        if (path) {
            // 重置特定路径
            this.setState(path, undefined);
        } else {
            // 重置所有状态
            this.state = this.getInitialState();
        }
    }
    
    /**
     * 获取嵌套值
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
    
    /**
     * 设置嵌套值
     */
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        
        const target = keys.reduce((current, key) => {
            if (!current[key]) {
                current[key] = {};
            }
            return current[key];
        }, obj);
        
        target[lastKey] = value;
    }
    
    /**
     * 记录历史
     */
    recordHistory(path, oldValue, newValue) {
        this.history.push({
            timestamp: Date.now(),
            path,
            oldValue,
            newValue
        });
        
        // 限制历史大小
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
    }
    
    /**
     * 通知监听器
     */
    notifyWatchers(path, newValue, oldValue) {
        // 通知精确匹配的监听器
        if (this.watchers.has(path)) {
            this.watchers.get(path).forEach(callback => {
                callback(newValue, oldValue);
            });
        }
        
        // 通知父路径监听器
        const parts = path.split('.');
        for (let i = parts.length - 1; i > 0; i--) {
            const parentPath = parts.slice(0, i).join('.');
            if (this.watchers.has(parentPath)) {
                const parentValue = this.getState(parentPath);
                this.watchers.get(parentPath).forEach(callback => {
                    callback(parentValue, undefined);
                });
            }
        }
    }
    
    /**
     * 获取初始状态
     */
    getInitialState() {
        return {
            app: {
                version: '4.0.0',
                initialized: false,
                loading: false,
                error: null
            },
            view: {
                current: 'tree',
                previous: null,
                history: []
            },
            data: {
                nodes: [],
                relations: [],
                filtered: [],
                selected: null,
                searchTerm: '',
                filters: {}
            },
            ui: {
                theme: 'light',
                sidebarOpen: false,
                modalOpen: false,
                notifications: []
            },
            user: {
                authenticated: false,
                profile: null,
                preferences: {},
                progress: {}
            }
        };
    }
    
    /**
     * 调试工具
     */
    debug() {
        console.group('📊 State Manager Debug');
        console.log('Current State:', this.state);
        console.log('History:', this.history);
        console.log('Watchers:', this.watchers);
        console.groupEnd();
    }
}

// 导出到全局
window.StateManager = StateManager;
