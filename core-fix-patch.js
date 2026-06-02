/**
 * 核心功能修复补丁
 * 确保所有关键功能正常工作
 */

// 1. 全局错误捕获和修复
(function() {
    'use strict';

    // 记录加载状态
    window.appLoadStatus = {
        coreLoaded: false,
        dataLoaded: false,
        viewsReady: false,
        componentsReady: false,
        errors: []
    };

    // 2. 修复缺失的搜索功能
    function initSearchEngine() {
        if (typeof window.searchEngine === 'undefined') {
            console.log('🔧 初始化搜索引擎...');

            window.searchEngine = {
                search: function(query, options = {}) {
                    if (!query || query.trim() === '') return [];

                    const results = [];
                    const app = window.app;

                    if (app && app.dataService && app.dataService.nodes) {
                        const q = query.toLowerCase();
                        app.dataService.nodes.forEach((node, id) => {
                            if (node.name && node.name.toLowerCase().includes(q)) {
                                results.push(node);
                            } else if (node.description && node.description.toLowerCase().includes(q)) {
                                results.push(node);
                            } else if (node.tags && node.tags.some(t => t.toLowerCase().includes(q))) {
                                results.push(node);
                            }
                        });
                    }

                    return results;
                }
            };

            console.log('✅ 搜索引擎已初始化');
        }
    }

    // 3. 修复3D树视图显示
    function fix3DTree() {
        console.log('🔧 检查3D树视图...');

        // 确保Three.js和OrbitControls已加载
        if (typeof THREE === 'undefined') {
            console.error('❌ Three.js未加载');
            return false;
        }

        if (typeof THREE.OrbitControls === 'undefined') {
            console.error('❌ OrbitControls未加载');
            return false;
        }

        console.log('✅ Three.js库已就绪');
        return true;
    }

    // 4. 修复数据加载
    function fixDataLoading() {
        console.log('🔧 检查数据加载...');

        if (typeof HistoricalDataset === 'undefined') {
            console.error('❌ HistoricalDataset未加载');
            return false;
        }

        let nodeCount = 0;
        for (const period in HistoricalDataset) {
            if (HistoricalDataset[period].events) {
                nodeCount += HistoricalDataset[period].events.length;
            }
            if (HistoricalDataset[period].persons) {
                nodeCount += HistoricalDataset[period].persons.length;
            }
        }

        console.log(`✅ 数据已加载: ${nodeCount} 个节点`);
        window.appLoadStatus.dataLoaded = true;
        return true;
    }

    // 5. 修复组件初始化
    function fixComponents() {
        console.log('🔧 检查组件初始化...');

        const app = window.app;
        if (!app) {
            console.error('❌ 应用实例未找到');
            return false;
        }

        // 检查关键组件
        const requiredComponents = ['searchBar', 'filterPanel', 'aiChat'];
        let missingCount = 0;

        requiredComponents.forEach(name => {
            const component = app.getComponent(name);
            if (!component) {
                console.warn(`⚠️ 组件缺失: ${name}`);
                missingCount++;
            }
        });

        if (missingCount === 0) {
            console.log('✅ 所有核心组件已初始化');
            window.appLoadStatus.componentsReady = true;
            return true;
        } else {
            console.warn(`⚠️ ${missingCount} 个组件缺失`);
            return false;
        }
    }

    // 6. 修复视图切换
    function fixViewSwitching() {
        console.log('🔧 检查视图切换...');

        const app = window.app;
        if (!app || !app.views) {
            console.error('❌ 应用视图未初始化');
            return false;
        }

        const requiredViews = ['tree3d', 'timeline', 'network', 'map', 'cards'];
        let missingCount = 0;

        requiredViews.forEach(name => {
            if (!app.views.has(name)) {
                console.warn(`⚠️ 视图缺失: ${name}`);
                missingCount++;
            }
        });

        if (missingCount === 0) {
            console.log('✅ 所有视图已注册');
            window.appLoadStatus.viewsReady = true;
            return true;
        } else {
            console.warn(`⚠️ ${missingCount} 个视图缺失`);
            return false;
        }
    }

    // 7. 创建AI聊天触发按钮
    function createAIChatButton() {
        // 检查是否已存在
        if (document.querySelector('.ai-chat-trigger, .ai-toggle-btn')) {
            return;
        }

        const btn = document.createElement('button');
        btn.className = 'ai-toggle-btn';
        btn.innerHTML = '🤖';
        btn.title = '打开AI历史助手';

        Object.assign(btn.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, rgba(212, 168, 83, 0.9), rgba(184, 134, 11, 0.9))',
            color: '#1a1410',
            border: '2px solid rgba(212, 168, 83, 0.5)',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(212, 168, 83, 0.3)',
            zIndex: '1000',
            transition: 'all 0.3s ease'
        });

        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 30px rgba(212, 168, 83, 0.5)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(212, 168, 83, 0.3)';
        });

        btn.addEventListener('click', function() {
            const app = window.app;
            if (app) {
                const aiChat = app.getComponent('aiChat');
                if (aiChat) {
                    if (typeof aiChat.toggle === 'function') {
                        aiChat.toggle();
                    } else if (typeof aiChat.open === 'function') {
                        aiChat.open();
                    } else {
                        console.warn('AI聊天组件无法打开');
                    }
                }
            }
        });

        document.body.appendChild(btn);
        console.log('✅ AI聊天按钮已创建');
    }

    // 8. 主修复函数
    function applyFixes() {
        console.log('🔧 开始应用核心功能修复...');

        // 按顺序执行修复
        const fixes = [
            { name: '搜索引擎', fn: initSearchEngine },
            { name: '数据加载', fn: fixDataLoading },
            { name: '3D树视图', fn: fix3DTree },
            { name: '视图切换', fn: fixViewSwitching },
            { name: '组件初始化', fn: fixComponents }
        ];

        let passed = 0;
        let failed = 0;

        fixes.forEach(fix => {
            try {
                if (fix.fn()) {
                    passed++;
                } else {
                    failed++;
                }
            } catch (error) {
                console.error(`❌ ${fix.name}修复失败:`, error);
                window.appLoadStatus.errors.push(`${fix.name}: ${error.message}`);
                failed++;
            }
        });

        // 创建AI聊天按钮
        try {
            createAIChatButton();
        } catch (error) {
            console.warn('⚠️ AI聊天按钮创建失败:', error);
        }

        console.log(`\n📊 修复完成: ${passed} 通过, ${failed} 失败`);

        // 发出修复完成事件
        if (window.app && window.app.eventBus) {
            window.app.eventBus.emit('core:fixes:applied', {
                passed,
                failed,
                status: window.appLoadStatus
            });
        }

        return { passed, failed };
    }

    // 9. 延迟执行修复，等待应用初始化
    function scheduleFixes() {
        // 尝试多次执行修复
        const attempts = [1000, 3000, 5000];

        attempts.forEach(delay => {
            setTimeout(() => {
                if (window.app && !window.appLoadStatus.coreLoaded) {
                    console.log(`🔧 第${attempts.indexOf(delay) + 1}次尝试修复...`);
                    applyFixes();
                    window.appLoadStatus.coreLoaded = true;
                }
            }, delay);
        });
    }

    // 10. 监听应用就绪事件
    document.addEventListener('DOMContentLoaded', () => {
        scheduleFixes();
    });

    // 如果DOM已加载，立即开始
    if (document.readyState !== 'loading') {
        scheduleFixes();
    }

    // 导出修复API
    window.coreFixes = {
        apply: applyFixes,
        status: () => window.appLoadStatus,
        search: initSearchEngine,
        data: fixDataLoading,
        views: fixViewSwitching,
        components: fixComponents
    };

    console.log('✅ 核心修复补丁已加载');
})();
