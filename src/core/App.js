/**
 * 核心架构 - 应用主类
 * 重构版本 v4.0
 */

class HistoryTreeApp {
    constructor(options = {}) {
        this.version = '4.0.0';
        this.options = {
            container: '#app',
            dataPath: './data',
            ...options
        };
        
        // 核心系统
        this.eventBus = null;
        this.stateManager = null;
        this.router = null;
        this.dataService = null;
        this.modelManager = null;
        this.quizEngine = null;
        
        // 视图管理
        this.views = new Map();
        this.currentView = null;
        
        // 组件管理
        this.components = new Map();
        
        // 插件系统
        this.plugins = new Map();
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化应用
     */
    async init() {
        try {
            console.log(`🌳 历史之树 v${this.version} 初始化中...`);
            
            // 1. 初始化核心系统
            this.eventBus = new EventBus();
            this.stateManager = new StateManager(this.eventBus);
            this.router = new Router(this.eventBus);
            this.dataService = new DataService(this.eventBus);
            
            // 2. 初始化多模型管理器
            if (typeof MultiModelManager !== 'undefined') {
                this.modelManager = new MultiModelManager(this);
                console.log('✅ 多模型管理器初始化完成');
            }

            // 2.1 初始化问答引擎
            if (typeof QuizEngine !== 'undefined') {
                this.quizEngine = new QuizEngine(this);
                this.quizEngine.init();
                console.log('✅ 问答引擎初始化完成');
            }

            // 2.2 初始化故事生成器
            if (typeof StoryGenerator !== 'undefined') {
                this.storyGenerator = new StoryGenerator(this);
                this.storyGenerator.init();
                console.log('✅ 故事生成器初始化完成');
            }
            
            // 3. 加载数据
            await this.loadData();
            
            // 3. 初始化视图
            this.initViews();
            
            // 4. 初始化组件
            this.initComponents();
            
            // 5. 加载插件
            this.loadPlugins();
            
            // 6. 启动路由
            this.router.start();
            
            // 7. 显示主视图
            this.showView('tree3d');
            
            console.log('✅ 初始化完成');
            this.eventBus.emit('app:ready');
            
        } catch (error) {
            console.error('❌ 初始化失败:', error);
            this.handleError(error);
        }
    }
    
    /**
     * 加载数据
     */
    async loadData() {
        console.log('📊 加载历史数据...');
        
        // 加载核心数据
        await this.dataService.loadCoreData();
        
        // 加载扩展数据
        await this.dataService.loadExtensions();
        
        // 建立索引
        await this.dataService.buildIndexes();
        
        console.log(`✅ 数据加载完成: ${this.dataService.stats.totalNodes} 个节点`);
    }
    
    /**
     * 初始化视图
     */
    initViews() {
        console.log('🎨 初始化视图...');

        // 注册视图
        this.registerView('tree', new TreeView(this));
        this.registerView('tree3d', new HistoryTree3D(this));
        this.registerView('timeline', new TimelineView(this));
        this.registerView('map', new MapView(this));
        this.registerView('network', new NetworkView(this));
        this.registerView('cards', new CardView(this));

        // 对比视图
        if (typeof ComparisonView !== 'undefined') {
            this.registerView('comparison', new ComparisonView(this));
        }

        console.log('✅ 视图初始化完成');
    }
    
    /**
     * 初始化组件
     */
    initComponents() {
        console.log('🧩 初始化组件...');
        
        // 全局组件
        this.registerComponent('searchBar', new SearchBar(this));
        this.registerComponent('filterPanel', new FilterPanel(this));
        this.registerComponent('aiChat', new AIChat(this));
        this.registerComponent('nodeCard', new NodeCard(this));

        // 渲染全局组件
        this.renderGlobalComponents();
        
        console.log('✅ 组件初始化完成');
    }
    
    /**
     * 加载插件
     */
    loadPlugins() {
        console.log('🔌 加载插件...');
        
        // 内置插件
        this.registerPlugin('export', new ExportPlugin(this));
        this.registerPlugin('analytics', new AnalyticsPlugin(this));
        this.registerPlugin('education', new EducationPlugin(this));
        this.registerPlugin('timeline', new TimelinePlugin(this));
        this.registerPlugin('collection', new CollectionPlugin(this));
        
        console.log('✅ 插件加载完成');
    }
    
    /**
     * 注册视图
     */
    registerView(name, view) {
        this.views.set(name, view);
    }
    
    /**
     * 显示视图
     */
    showView(name, options = {}) {
        // 隐藏当前视图
        if (this.currentView) {
            this.currentView.hide();
        }
        
        // 显示新视图
        const view = this.views.get(name);
        if (view) {
            view.show(options);
            this.currentView = view;
            this.stateManager.setState('currentView', name);
            this.eventBus.emit('view:change', { name, options });
        }
    }
    
    /**
     * 注册组件
     */
    registerComponent(name, component) {
        this.components.set(name, component);
    }
    
    /**
     * 获取组件
     */
    getComponent(name) {
        return this.components.get(name);
    }
    
    /**
     * 获取模型管理器
     */
    getModelManager() {
        return this.modelManager;
    }

    /**
     * 获取问答引擎
     */
    getQuizEngine() {
        return this.quizEngine;
    }

    /**
     * 获取故事生成器
     */
    getStoryGenerator() {
        return this.storyGenerator;
    }
    
    /**
     * 获取合集插件
     */
    getCollection() {
        return this.getPlugin('collection');
    }

    /**
     * 注册插件
     */
    registerPlugin(name, plugin) {
        this.plugins.set(name, plugin);
        plugin.init();
    }
    
    /**
     * 获取插件
     */
    getPlugin(name) {
        return this.plugins.get(name);
    }
    
    /**
     * 渲染全局组件
     */
    renderGlobalComponents() {
        const container = document.querySelector(this.options.container);

        // 搜索栏
        const searchBar = this.getComponent('searchBar');
        if (searchBar) container.appendChild(searchBar.render());

        // 筛选面板
        const filterPanel = this.getComponent('filterPanel');
        if (filterPanel) container.appendChild(filterPanel.render());

        // AI聊天
        const aiChat = this.getComponent('aiChat');
        if (aiChat) container.appendChild(aiChat.render());
    }
    
    /**
     * 搜索
     */
    search(query, options = {}) {
        const results = this.dataService.search(query, options);
        this.eventBus.emit('search:results', { query, results });
        return results;
    }
    
    /**
     * 筛选
     */
    filter(filters) {
        const results = this.dataService.filter(filters);
        this.eventBus.emit('filter:results', { filters, results });
        return results;
    }
    
    /**
     * 获取节点
     */
    getNode(id) {
        return this.dataService.getNode(id);
    }
    
    /**
     * 获取关系
     */
    getRelations(id) {
        return this.dataService.getRelations(id);
    }
    
    /**
     * 导出
     */
    async export(format, options = {}) {
        const exportPlugin = this.getPlugin('export');
        return await exportPlugin.export(format, options);
    }
    
    /**
     * 错误处理
     */
    handleError(error) {
        console.error('Application Error:', error);
        this.eventBus.emit('app:error', error);
        
        // 显示错误提示
        console.error('Error details:', error);
        alert('应用出错: ' + (error.message || error));
    }
    
    /**
     * 销毁应用
     */
    destroy() {
        // 销毁视图
        this.views.forEach(view => view.destroy());
        
        // 销毁组件
        this.components.forEach(component => component.destroy());
        
        // 销毁插件
        this.plugins.forEach(plugin => plugin.destroy());
        
        // 清理事件
        this.eventBus.clear();
        
        console.log('👋 应用已销毁');
    }
}

// 导出到全局
window.HistoryTreeApp = HistoryTreeApp;
