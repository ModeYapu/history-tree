/**
 * 路由系统 - 单页应用路由
 */

class Router {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.routes = new Map();
        this.currentRoute = null;
        this.history = [];
        this.maxHistory = 50;
        
        this.init();
    }
    
    /**
     * 初始化路由
     */
    init() {
        // 监听浏览器历史变化
        window.addEventListener('popstate', (event) => {
            this.handlePopState(event);
        });
        
        // 监听链接点击
        document.addEventListener('click', (event) => {
            this.handleClick(event);
        });
    }
    
    /**
     * 注册路由
     */
    register(path, handler, options = {}) {
        this.routes.set(path, {
            handler,
            options,
            pattern: this.createPattern(path)
        });
    }
    
    /**
     * 创建路由模式
     */
    createPattern(path) {
        const paramNames = [];
        const regexPattern = path.replace(/:([^/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });
        
        return {
            regex: new RegExp(`^${regexPattern}$`),
            paramNames
        };
    }
    
    /**
     * 导航到路径
     */
    navigate(path, options = {}) {
        const { silent = false, replace = false } = options;
        
        // 查找匹配的路由
        const route = this.matchRoute(path);
        
        if (!route) {
            console.warn(`Route not found: ${path}`);
            return false;
        }
        
        // 更新历史
        this.addToHistory(path);
        
        // 更新浏览器历史
        if (!silent) {
            if (replace) {
                window.history.replaceState({ path }, '', path);
            } else {
                window.history.pushState({ path }, '', path);
            }
        }
        
        // 执行路由处理器
        this.currentRoute = { path, ...route };
        route.handler(route.params, route.query);
        
        // 触发事件
        this.eventBus.emit('router:navigate', {
            path,
            params: route.params,
            query: route.query
        });
        
        return true;
    }
    
    /**
     * 匹配路由
     */
    matchRoute(path) {
        // 解析路径和查询参数
        const [pathname, search] = path.split('?');
        const query = this.parseQuery(search);
        
        // 遍历所有路由
        for (const [routePath, route] of this.routes) {
            const match = pathname.match(route.pattern.regex);
            
            if (match) {
                // 提取参数
                const params = {};
                route.pattern.paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                
                return {
                    params,
                    query,
                    route: routePath
                };
            }
        }
        
        return null;
    }
    
    /**
     * 解析查询参数
     */
    parseQuery(search) {
        if (!search) return {};
        
        const query = {};
        const params = new URLSearchParams(search);
        
        params.forEach((value, key) => {
            query[key] = value;
        });
        
        return query;
    }
    
    /**
     * 构建查询字符串
     */
    buildQuery(query) {
        const params = new URLSearchParams();
        
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value);
            }
        });
        
        const queryString = params.toString();
        return queryString ? `?${queryString}` : '';
    }
    
    /**
     * 处理浏览器后退
     */
    handlePopState(event) {
        const path = window.location.pathname + window.location.search;
        this.navigate(path, { silent: true });
    }
    
    /**
     * 处理链接点击
     */
    handleClick(event) {
        // 查找最近的链接
        const link = event.target.closest('a[href^="/"]');
        
        if (link) {
            event.preventDefault();
            const path = link.getAttribute('href');
            this.navigate(path);
        }
    }
    
    /**
     * 添加到历史
     */
    addToHistory(path) {
        this.history.push({
            path,
            timestamp: Date.now()
        });
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
    
    /**
     * 后退
     */
    back() {
        window.history.back();
    }
    
    /**
     * 前进
     */
    forward() {
        window.history.forward();
    }
    
    /**
     * 获取当前路由
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    /**
     * 获取历史
     */
    getHistory() {
        return this.history;
    }
    
    /**
     * 启动路由
     */
    start() {
        // 处理当前URL
        const path = window.location.pathname + window.location.search;
        this.navigate(path, { replace: true });
    }
}

// 预定义路由
const Routes = {
    HOME: '/',
    TREE: '/tree',
    TIMELINE: '/timeline',
    MAP: '/map',
    NETWORK: '/network',
    NODE: '/node/:id',
    SEARCH: '/search',
    SETTINGS: '/settings'
};

// 导出到全局
window.Router = Router;
window.Routes = Routes;
