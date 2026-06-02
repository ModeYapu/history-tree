/**
 * 历史之树 v4.4 - 主入口文件
 *
 * 说明：本项目采用纯原生 JavaScript 开发，所有模块通过 script 标签加载后注册到全局。
 * 核心模块包括：HistoryTreeApp, EventBus, DataService, 各视图和组件类。
 */

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

    app.router.register(Routes.CARDS, () => {
        app.showView('cards');
    });

    app.router.register('/quiz', () => {
        if (app.quizEngine) {
            app.quizEngine.showUI({ autoStart: true });
        }
    });

    // 对比视图路由
    app.router.register('/comparison', () => {
        app.showView('comparison');
    });

    app.router.register('/comparison/:id1/:id2', (params) => {
        app.showView('comparison', { ids: [params.id1, params.id2] });
    });

    // 世界时间线路由
    app.router.register('/world-timeline', () => {
        app.showView('worldTimeline');
    });

    // 知识图谱路由
    app.router.register('/knowledge-graph', () => {
        app.showView('knowledgeGraph');
    });

    // 文明对比路由
    app.router.register('/civ-compare', () => {
        app.showView('civilizationCompare');
    });

    // 故事生成器路由
    app.router.register('/story', () => {
        if (app.storyGenerator) {
            app.storyGenerator.showUI();
        }
    });

    app.router.register('/story/:nodeId', (params) => {
        if (app.storyGenerator) {
            app.storyGenerator.showUI({ nodeId: params.nodeId });
        }
    });

    // 收藏系统路由
    app.router.register('/collection', () => {
        const collection = app.getPlugin('collection');
        if (collection) {
            collection.showPanel();
        }
    });

    app.router.register('/collection/:id', (params) => {
        const collection = app.getPlugin('collection');
        if (collection) {
            collection.showCollection(params.id);
        }
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
                case '6':
                    e.preventDefault();
                    if (app.quizEngine) {
                        app.quizEngine.showUI({ autoStart: true });
                    }
                    break;
                case '7':
                    e.preventDefault();
                    app.showView('comparison');
                    break;
                case '8':
                    e.preventDefault();
                    app.showView('worldTimeline');
                    break;
                case '9':
                    e.preventDefault();
                    app.showView('knowledgeGraph');
                    break;
                case '0':
                    e.preventDefault();
                    app.showView('civilizationCompare');
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

        // Ctrl/Cmd + Q: 问答
        if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
            e.preventDefault();
            if (app.quizEngine) {
                app.quizEngine.showUI({ autoStart: true });
            }
        }

        // Ctrl/Cmd + C: 收藏面板
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.shiftKey) {
            // don't override copy
        }
        // Ctrl/Cmd + Shift + C: 收藏面板
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            const collection = app.getPlugin('collection');
            if (collection) {
                collection.showPanel();
            }
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

    // 头部
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px;';

    const iconSpan = document.createElement('span');
    iconSpan.style.cssText = 'font-size: 24px; margin-right: 10px;';
    iconSpan.textContent = '🌳';

    const titleStrong = document.createElement('strong');
    titleStrong.style.cssText = 'font-size: 16px;';
    titleStrong.textContent = '欢迎使用历史之树 v4.0';

    headerDiv.appendChild(iconSpan);
    headerDiv.appendChild(titleStrong);

    // 描述
    const p = document.createElement('p');
    p.style.cssText = 'margin: 0; color: #666; font-size: 14px; line-height: 1.6;';
    p.textContent = '这是一个全新的历史探索平台，支持多种视图模式和智能助手。';

    // 快捷键列表
    const shortcutsDiv = document.createElement('div');
    shortcutsDiv.style.cssText = 'margin-top: 15px; font-size: 12px; color: #999;';

    const shortcutsLabel = document.createElement('div');
    shortcutsLabel.textContent = '快捷键：';

    const shortcut1 = document.createElement('div');
    shortcut1.textContent = '• Ctrl+1-5: 切换视图';

    const shortcut2 = document.createElement('div');
    shortcut2.textContent = '• Ctrl+K: 搜索';

    const shortcut3 = document.createElement('div');
    shortcut3.textContent = '• Ctrl+E: 导出';

    const shortcut4 = document.createElement('div');
    shortcut4.textContent = '• Ctrl+Q: 历史问答';

    const shortcut5 = document.createElement('div');
    shortcut5.textContent = '• Ctrl+8-0: 新视图(时间轴/图谱/对比)';

    shortcutsDiv.appendChild(shortcutsLabel);
    shortcutsDiv.appendChild(shortcut1);
    shortcutsDiv.appendChild(shortcut2);
    shortcutsDiv.appendChild(shortcut3);
    shortcutsDiv.appendChild(shortcut4);
    shortcutsDiv.appendChild(shortcut5);

    // 按钮
    const button = document.createElement('button');
    button.textContent = '开始探索';
    button.style.cssText = `
        margin-top: 15px;
        width: 100%;
        padding: 8px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    `;
    button.addEventListener('click', () => {
        notification.remove();
    });

    notification.appendChild(headerDiv);
    notification.appendChild(p);
    notification.appendChild(shortcutsDiv);
    notification.appendChild(button);

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
