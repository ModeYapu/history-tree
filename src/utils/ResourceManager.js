/**
 * 资源管理器 - 防止内存泄漏
 * 自动管理事件监听器、定时器、观察者等资源
 */

class ResourceManager {
    constructor() {
        this.eventListeners = [];
        this.timers = [];
        this.intervals = [];
        this.observers = [];
        this.requests = [];
        this.elements = [];
        this.isDestroyed = false;
    }

    /**
     * 添加事件监听器并记录
     *
     * @param {Element} element - 目标元素
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 事件选项
     */
    addEventListener(element, event, handler, options = false) {
        if (this.isDestroyed) {
            console.warn('Cannot add event listener: ResourceManager is destroyed');
            return;
        }

        if (!element || !event || typeof handler !== 'function') {
            console.warn('Invalid parameters for addEventListener');
            return;
        }

        element.addEventListener(event, handler, options);
        this.eventListeners.push({ element, event, handler, options });
    }

    /**
     * 添加定时器并记录
     *
     * @param {number} timerId - setTimeout返回的ID
     */
    addTimer(timerId) {
        if (this.isDestroyed) return;
        if (typeof timerId === 'number') {
            this.timers.push(timerId);
        }
    }

    /**
     * 添加间隔定时器并记录
     *
     * @param {number} intervalId - setInterval返回的ID
     */
    addInterval(intervalId) {
        if (this.isDestroyed) return;
        if (typeof intervalId === 'number') {
            this.intervals.push(intervalId);
        }
    }

    /**
     * 添加观察者并记录
     *
     * @param {Object} observer - 观察者对象（MutationObserver、IntersectionObserver等）
     */
    addObserver(observer) {
        if (this.isDestroyed) return;
        if (observer && typeof observer.disconnect === 'function') {
            this.observers.push(observer);
        }
    }

    /**
     * 添加请求并记录（用于abort）
     *
     * @param {Object} request - AbortController或XMLHttpRequest
     */
    addRequest(request) {
        if (this.isDestroyed) return;
        if (request && typeof request.abort === 'function') {
            this.requests.push(request);
        }
    }

    /**
     * 添加DOM元素以便后续清理
     *
     * @param {HTMLElement} element - DOM元素
     */
    addElement(element) {
        if (this.isDestroyed) return;
        if (element && element instanceof HTMLElement) {
            this.elements.push(element);
        }
    }

    /**
     * 包装setTimeout，自动记录定时器
     *
     * @param {Function} callback - 回调函数
     * @param {number} delay - 延迟时间
     * @returns {number} - 定时器ID
     */
    setTimeout(callback, delay) {
        if (this.isDestroyed) return null;

        const timerId = setTimeout(() => {
            // 执行回调后从数组中移除
            const index = this.timers.indexOf(timerId);
            if (index > -1) {
                this.timers.splice(index, 1);
            }

            try {
                callback();
            } catch (error) {
                console.error('Error in setTimeout callback:', error);
            }
        }, delay);

        this.timers.push(timerId);
        return timerId;
    }

    /**
     * 包装setInterval，自动记录定时器
     *
     * @param {Function} callback - 回调函数
     * @param {number} interval - 间隔时间
     * @returns {number} - 定时器ID
     */
    setInterval(callback, interval) {
        if (this.isDestroyed) return null;

        const intervalId = setInterval(() => {
            try {
                callback();
            } catch (error) {
                console.error('Error in setInterval callback:', error);
            }
        }, interval);

        this.intervals.push(intervalId);
        return intervalId;
    }

    /**
     * 包装fetch请求，支持取消
     *
     * @param {string} url - 请求URL
     * @param {Object} options - fetch选项
     * @param {number} timeout - 超时时间（毫秒）
     * @returns {Promise} - fetch Promise
     */
    async fetch(url, options = {}, timeout = 30000) {
        if (this.isDestroyed) {
            return Promise.reject(new Error('ResourceManager is destroyed'));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        this.addRequest(controller);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // 移除已完成的请求
            const index = this.requests.indexOf(controller);
            if (index > -1) {
                this.requests.splice(index, 1);
            }

            return response;
        } catch (error) {
            clearTimeout(timeoutId);

            // 移除已失败的请求
            const index = this.requests.indexOf(controller);
            if (index > -1) {
                this.requests.splice(index, 1);
            }

            if (error.name === 'AbortError') {
                throw new Error(`Request timeout: ${url}`);
            }

            throw error;
        }
    }

    /**
     * 移除特定的事件监听器
     *
     * @param {Element} element - 目标元素
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     */
    removeEventListener(element, event, handler) {
        if (!element || !event || typeof handler !== 'function') return;

        element.removeEventListener(event, handler);

        // 从记录中移除
        const index = this.eventListeners.findIndex(
            listener => listener.element === element &&
                       listener.event === event &&
                       listener.handler === handler
        );

        if (index > -1) {
            this.eventListeners.splice(index, 1);
        }
    }

    /**
     * 清除特定定时器
     *
     * @param {number} timerId - 定时器ID
     */
    clearTimeout(timerId) {
        if (typeof timerId !== 'number') return;

        clearTimeout(timerId);

        const index = this.timers.indexOf(timerId);
        if (index > -1) {
            this.timers.splice(index, 1);
        }
    }

    /**
     * 清除特定间隔定时器
     *
     * @param {number} intervalId - 间隔定时器ID
     */
    clearInterval(intervalId) {
        if (typeof intervalId !== 'number') return;

        clearInterval(intervalId);

        const index = this.intervals.indexOf(intervalId);
        if (index > -1) {
            this.intervals.splice(index, 1);
        }
    }

    /**
     * 清理所有资源
     */
    cleanup() {
        if (this.isDestroyed) {
            console.warn('ResourceManager already destroyed');
            return;
        }

        console.log('🧹 Cleaning up resources...');

        // 清理事件监听器
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            try {
                element.removeEventListener(event, handler, options);
            } catch (error) {
                console.warn('Failed to remove event listener:', error);
            }
        });
        this.eventListeners = [];

        // 清理定时器
        this.timers.forEach(timerId => {
            try {
                clearTimeout(timerId);
            } catch (error) {
                console.warn('Failed to clear timer:', error);
            }
        });
        this.timers = [];

        // 清理间隔定时器
        this.intervals.forEach(intervalId => {
            try {
                clearInterval(intervalId);
            } catch (error) {
                console.warn('Failed to clear interval:', error);
            }
        });
        this.intervals = [];

        // 断开观察者
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.warn('Failed to disconnect observer:', error);
            }
        });
        this.observers = [];

        // 取消请求
        this.requests.forEach(request => {
            try {
                request.abort();
            } catch (error) {
                console.warn('Failed to abort request:', error);
            }
        });
        this.requests = [];

        // 移除DOM元素
        this.elements.forEach(element => {
            try {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            } catch (error) {
                console.warn('Failed to remove element:', error);
            }
        });
        this.elements = [];

        this.isDestroyed = true;
        console.log('✅ Resource cleanup completed');
    }

    /**
     * 获取当前资源统计
     *
     * @returns {Object} - 资源统计信息
     */
    getStats() {
        return {
            eventListeners: this.eventListeners.length,
            timers: this.timers.length,
            intervals: this.intervals.length,
            observers: this.observers.length,
            requests: this.requests.length,
            elements: this.elements.length,
            isDestroyed: this.isDestroyed
        };
    }

    /**
     * 检查是否有泄漏风险
     *
     * @returns {boolean} - 是否有泄漏风险
     */
    hasLeakRisk() {
        const stats = this.getStats();
        return !this.isDestroyed && (
            stats.eventListeners > 50 ||
            stats.timers > 20 ||
            stats.intervals > 10 ||
            stats.observers > 10 ||
            stats.requests > 10
        );
    }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResourceManager;
} else {
    window.ResourceManager = ResourceManager;
}