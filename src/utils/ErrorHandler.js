/**
 * 错误处理工具类 - 统一错误处理和日志记录
 * 提供用户友好的错误消息和详细的日志记录
 */

class ErrorHandler {
    /**
     * 处理错误的主要方法
     *
     * @param {Error} error - 错误对象
     * @param {string} context - 错误发生的上下文
     * @param {boolean} showToUser - 是否向用户显示错误
     * @returns {string} - 用户友好的错误消息
     */
    static handle(error, context = '', showToUser = true) {
        if (!error) {
            console.warn('ErrorHandler called with null/undefined error');
            return '';
        }

        // 记录详细错误信息
        this.logError(error, context);

        // 生成用户友好的消息
        const userMessage = this.getUserFriendlyMessage(error);

        // 发送到监控服务
        this.sendToMonitoring(error, context);

        // 可选：向用户显示
        if (showToUser) {
            this.showToUser(userMessage, error);
        }

        return userMessage;
    }

    /**
     * 记录错误详情
     *
     * @param {Error} error - 错误对象
     * @param {string} context - 错误上下文
     */
    static logError(error, context) {
        const errorInfo = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace available',
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.error(`❌ [${context || 'Unknown'}] Error:`, errorInfo);

        // 可以添加本地存储错误日志
        this.saveErrorLog(errorInfo);
    }

    /**
     * 获取用户友好的错误消息
     *
     * @param {Error} error - 错误对象
     * @returns {string} - 用户友好的消息
     */
    static getUserFriendlyMessage(error) {
        const message = (error.message || '').toLowerCase();

        // 网络相关错误
        if (message.includes('network') || message.includes('fetch')) {
            return '网络连接失败，请检查您的网络设置';
        }

        if (message.includes('timeout')) {
            return '请求超时，请稍后重试';
        }

        // API相关错误
        if (message.includes('api') || message.includes('server')) {
            return '服务暂时不可用，请稍后重试';
        }

        if (message.includes('401') || message.includes('403') || message.includes('unauthorized')) {
            return '权限不足，请检查您的登录状态';
        }

        if (message.includes('404') || message.includes('not found')) {
            return '请求的资源不存在';
        }

        if (message.includes('500') || message.includes('502') || message.includes('503')) {
            return '服务器出现问题，我们正在努力修复';
        }

        // 数据相关错误
        if (message.includes('parse') || message.includes('json') || message.includes('data')) {
            return '数据格式错误，请检查输入内容';
        }

        if (message.includes('validation') || message.includes('invalid')) {
            return '输入内容不符合要求，请检查后重试';
        }

        // 权限相关错误
        if (message.includes('permission') || message.includes('access')) {
            return '权限不足，无法执行此操作';
        }

        // 默认消息
        return '应用遇到问题，我们正在处理中';
    }

    /**
     * 发送错误到监控服务
     *
     * @param {Error} error - 错误对象
     * @param {string} context - 错误上下文
     */
    static sendToMonitoring(error, context) {
        // 检查是否配置了Sentry
        if (window.Sentry) {
            try {
                window.Sentry.captureException(error, {
                    tags: { context },
                    level: 'error'
                });
            } catch (sentryError) {
                console.warn('Failed to send error to Sentry:', sentryError);
            }
        }

        // 可以添加其他监控服务（如DataDog、New Relic等）
        if (window.analytics && window.analytics.track) {
            try {
                window.analytics.track('Error', {
                    message: error.message,
                    context: context,
                    timestamp: new Date().toISOString()
                });
            } catch (analyticsError) {
                console.warn('Failed to send error to analytics:', analyticsError);
            }
        }
    }

    /**
     * 向用户显示错误
     *
     * @param {string} message - 用户友好的消息
     * @param {Error} error - 原始错误对象
     */
    static showToUser(message, error) {
        // 可以使用Toast通知而不是alert
        if (window.showToast) {
            window.showToast(message, 'error');
        } else if (window.alert) {
            // 最后的选择：使用alert
            alert(message);
        }
    }

    /**
     * 保存错误日志到本地存储
     *
     * @param {Object} errorInfo - 错误信息对象
     */
    static saveErrorLog(errorInfo) {
        try {
            const maxLogs = 100; // 最多保存100条错误日志
            const storageKey = 'history_tree_error_logs';

            let logs = JSON.parse(localStorage.getItem(storageKey) || '[]');
            logs.unshift(errorInfo); // 添加到开头

            // 限制日志数量
            if (logs.length > maxLogs) {
                logs = logs.slice(0, maxLogs);
            }

            localStorage.setItem(storageKey, JSON.stringify(logs));
        } catch (storageError) {
            console.warn('Failed to save error log:', storageError);
        }
    }

    /**
     * 获取错误日志
     *
     * @returns {Array} - 错误日志数组
     */
    static getErrorLogs() {
        try {
            const storageKey = 'history_tree_error_logs';
            return JSON.parse(localStorage.getItem(storageKey) || '[]');
        } catch (error) {
            console.warn('Failed to get error logs:', error);
            return [];
        }
    }

    /**
     * 清除错误日志
     */
    static clearErrorLogs() {
        try {
            localStorage.removeItem('history_tree_error_logs');
            console.log('✅ Error logs cleared');
        } catch (error) {
            console.warn('Failed to clear error logs:', error);
        }
    }

    /**
     * 异步错误处理包装器
     *
     * @param {Function} asyncFn - 异步函数
     * @param {string} context - 错误上下文
     * @returns {Function} - 包装后的函数
     */
    static asyncWrapper(asyncFn, context = '') {
        return async (...args) => {
            try {
                return await asyncFn(...args);
            } catch (error) {
                this.handle(error, context);
                throw error; // 重新抛出以便调用者处理
            }
        };
    }

    /**
     * 创建带有错误处理的Promise
     *
     * @param {Function} executor - Promise执行器
     * @param {string} context - 错误上下文
     * @returns {Promise} - Promise对象
     */
    static createSafePromise(executor, context = '') {
        return new Promise((resolve, reject) => {
            try {
                executor(
                    value => resolve(value),
                    error => {
                        this.handle(error, context);
                        reject(error);
                    }
                );
            } catch (error) {
                this.handle(error, context);
                reject(error);
            }
        });
    }

    /**
     * 安全执行函数，捕获所有错误
     *
     * @param {Function} fn - 要执行的函数
     * @param {string} context - 错误上下文
     * @param {*} defaultValue - 发生错误时返回的默认值
     * @returns {*} - 函数执行结果或默认值
     */
    static safeExecute(fn, context = '', defaultValue = null) {
        try {
            return fn();
        } catch (error) {
            this.handle(error, context, false); // 不向用户显示
            return defaultValue;
        }
    }

    /**
     * 重试逻辑包装器
     *
     * @param {Function} fn - 要重试的函数
     * @param {number} maxRetries - 最大重试次数
     * @param {number} delay - 重试延迟（毫秒）
     * @returns {Promise} - Promise对象
     */
    static async retry(fn, maxRetries = 3, delay = 1000) {
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                console.warn(`Retry ${i + 1}/${maxRetries} failed:`, error.message);

                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
                }
            }
        }

        throw lastError;
    }

    /**
     * 验证必需的环境变量
     *
     * @param {Array<string>} requiredVars - 必需的环境变量列表
     * @throws {Error} - 如果缺少必需的环境变量
     */
    static validateEnvironment(requiredVars) {
        const missing = [];

        requiredVars.forEach(varName => {
            if (!process.env[varName] && !window[varName]) {
                missing.push(varName);
            }
        });

        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }

    /**
     * 全局错误处理器设置
     */
    static setupGlobalHandlers() {
        // 未捕获的异常
        window.addEventListener('error', (event) => {
            this.handle(event.error || new Error(event.message), 'Global Error');
        });

        // 未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            this.handle(event.reason, 'Unhandled Promise Rejection');
        });

        console.log('✅ Global error handlers registered');
    }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
} else {
    window.ErrorHandler = ErrorHandler;
}