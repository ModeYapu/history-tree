/**
 * 事件总线 - 观察者模式实现
 */

class EventBus {
    constructor() {
        this.events = new Map();
        this.onceEvents = new Map();
    }
    
    /**
     * 订阅事件
     */
    on(eventName, callback, context = null) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        
        this.events.get(eventName).push({
            callback,
            context
        });
        
        // 返回取消订阅函数
        return () => this.off(eventName, callback);
    }
    
    /**
     * 订阅一次
     */
    once(eventName, callback, context = null) {
        if (!this.onceEvents.has(eventName)) {
            this.onceEvents.set(eventName, []);
        }
        
        this.onceEvents.get(eventName).push({
            callback,
            context
        });
    }
    
    /**
     * 取消订阅
     */
    off(eventName, callback) {
        if (this.events.has(eventName)) {
            const listeners = this.events.get(eventName);
            const index = listeners.findIndex(l => l.callback === callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    /**
     * 触发事件
     */
    emit(eventName, data = null) {
        // 触发普通事件
        if (this.events.has(eventName)) {
            this.events.get(eventName).forEach(listener => {
                listener.callback.call(listener.context, data);
            });
        }
        
        // 触发一次性事件
        if (this.onceEvents.has(eventName)) {
            const listeners = this.onceEvents.get(eventName);
            listeners.forEach(listener => {
                listener.callback.call(listener.context, data);
            });
            this.onceEvents.delete(eventName);
        }
    }
    
    /**
     * 清空所有事件
     */
    clear() {
        this.events.clear();
        this.onceEvents.clear();
    }
    
    /**
     * 获取事件列表
     */
    getEvents() {
        return Array.from(this.events.keys());
    }
}

// 预定义事件类型
const EventTypes = {
    // 应用事件
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error',
    
    // 视图事件
    VIEW_CHANGE: 'view:change',
    VIEW_READY: 'view:ready',
    VIEW_DESTROY: 'view:destroy',
    
    // 数据事件
    DATA_LOAD: 'data:load',
    DATA_UPDATE: 'data:update',
    DATA_ERROR: 'data:error',
    
    // 搜索事件
    SEARCH_START: 'search:start',
    SEARCH_RESULTS: 'search:results',
    
    // 筛选事件
    FILTER_CHANGE: 'filter:change',
    FILTER_RESULTS: 'filter:results',
    
    // 节点事件
    NODE_CLICK: 'node:click',
    NODE_HOVER: 'node:hover',
    NODE_SELECT: 'node:select',
    NODE_DESELECT: 'node:deselect',
    
    // 用户事件
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_UPDATE: 'user:update',
    
    // UI事件
    UI_LOADING_START: 'ui:loading:start',
    UI_LOADING_END: 'ui:loading:end',
    UI_NOTIFICATION: 'ui:notification',
    UI_MODAL_OPEN: 'ui:modal:open',
    UI_MODAL_CLOSE: 'ui:modal:close'
};

// 导出到全局
window.EventBus = EventBus;
window.EventTypes = EventTypes;
