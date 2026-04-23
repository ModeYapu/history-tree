/**
 * 历史之树 v4.0 - 主入口文件
 */

// 引入核心模块
// import { HistoryTreeApp } from './core/App.js';
// import { EventBus } from './core/EventBus.js';
// import { StateManager } from './core/StateManager.js';
// import { Router, Routes } from './core/Router.js';

// 引入数据服务
// import { DataService } from './services/DataService.js';
// import { HistoryNode } from './models/HistoryNode.js';

// 引入视图
// import { TreeView } from './views/TreeView.js';
// import { TimelineView } from './views/TimelineView.js';
// import { MapView } from './views/MapView.js';
// import { NetworkView } from './views/NetworkView.js';
// import { CardView } from './views/CardView.js';

// 引入组件
// import { NodeCard } from './components/NodeCard.js';
// import { SearchBar } from './components/SearchBar.js';
// import { FilterPanel } from './components/FilterPanel.js';
// import { AIChat } from './components/AIChat.js';

// 引入插件
// import { ExportPlugin } from './plugins/ExportPlugin.js';
// import { AnalyticsPlugin } from './plugins/AnalyticsPlugin.js';
// import { EducationPlugin } from './plugins/EducationPlugin.js';

/**
 * 初始化应用
 */
async function initApp() {
    console.log('🌳 历史之树 v4.0 启动中...');
    
    // 创建应用实例
    const app = new HistoryTreeApp({
        container: '#app',
        dataPath: './data'
    });
    
    // 暴露到全局（开发调试用）
    window.app = app;
    
    // 注册路由
    app.router.register(Routes.HOME, () => {
        app.showView('tree');
    });
    
    app.router.register(Routes.TREE, () => {
        app.showView('tree');
    });
    
    app.router.register(Routes.TIMELINE, () => {
        app.showView('timeline');
    });
    
    app.router.register(Routes.MAP, () => {
        app.showView('map');
    });
    
    app.router.register(Routes.NETWORK, () => {
        app.showView('network');
    });
    
    app.router.register(Routes.SEARCH, (params, query) => {
        if (query.q) {
            const searchBar = app.getComponent('searchBar');
            searchBar.search(query.q);
        }
    });
    
    // 监听事件
    app.eventBus.on('app:ready', () => {
        console.log('✅ 应用初始化完成');
        
        // 显示欢迎消息
        showWelcomeMessage();
    });
    
    app.eventBus.on('node:select', (node) => {
        console.log('📌 选中节点:', node.name);
        
        // 更新状态
        app.stateManager.setState('data.selected', node);
    });
    
    app.eventBus.on('search:results', ({ query, results }) => {
        console.log(`🔍 搜索 "${query}": 找到 ${results.length} 个结果`);
    });
    
    app.eventBus.on('filter:results', ({ filters, results }) => {
        console.log('🔍 筛选结果:', results.length);
        
        // 更新当前视图
        if (app.currentView) {
            app.currentView.filter && app.currentView.filter(filters);
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + 1-5: 切换视图
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    app.showView('tree');
                    break;
                case '2':
                    e.preventDefault();
                    app.showView('timeline');
                    break;
                case '3':
                    e.preventDefault();
                    app.showView('map');
                    break;
                case '4':
                    e.preventDefault();
                    app.showView('network');
                    break;
                case '5':
                    e.preventDefault();
                    app.showView('cards');
                    break;
            }
        }
        
        // Ctrl/Cmd + E: 导出
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            app.export('json');
        }
        
        // Ctrl/Cmd + A: 分析
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            const analytics = app.getPlugin('analytics');
            analytics.showVisualization();
        }
    });
    
    return app;
}

/**
 * 显示欢迎消息
 */
function showWelcomeMessage() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1002;
        max-width: 300px;
        animation: slideIn 0.5s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 24px; margin-right: 10px;">🌳</span>
            <strong style="font-size: 16px;">欢迎使用历史之树 v4.0</strong>
        </div>
        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
            这是一个全新的历史探索平台，支持多种视图模式和智能助手。
        </p>
        <div style="margin-top: 15px; font-size: 12px; color: #999;">
            <div>快捷键：</div>
            <div>• Ctrl+1-5: 切换视图</div>
            <div>• Ctrl+K: 搜索</div>
            <div>• Ctrl+E: 导出</div>
        </div>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 15px;
            width: 100%;
            padding: 8px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        ">开始探索</button>
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动关闭
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// 添加动画样式
const mainStyle = document.createElement('style');
mainStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(mainStyle);

// 页面加载完成后初始化 - disabled, index.html handles init
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initApp);
// } else {
//     initApp();
// }

// 导出初始化函数
window.initApp = initApp;
