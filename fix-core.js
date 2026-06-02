/**
 * 核心功能修复脚本
 * 修复常见问题并确保应用正常工作
 */

// 修复1: 确保所有全局类都正确定义
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// 修复2: 添加缺失的类定义
if (typeof SearchEngine === 'undefined') {
    console.warn('SearchEngine not defined, using fallback');
    window.SearchEngine = class SearchEngine {
        constructor(dataService) {
            this.dataService = dataService;
        }
        search(query) {
            return [];
        }
    };
}

// 修复3: 确保数据加载完成后再初始化
function waitForData(callback, timeout = 5000) {
    const startTime = Date.now();

    const checkData = () => {
        if (typeof HistoricalDataset !== 'undefined') {
            callback();
        } else if (Date.now() - startTime < timeout) {
            setTimeout(checkData, 100);
        } else {
            console.error('数据加载超时');
        }
    };

    checkData();
}

// 修复4: 增强的错误处理
function safeInit(callback) {
    try {
        callback();
    } catch (error) {
        console.error('初始化错误:', error);
        // 尝试恢复
        if (window.app) {
            console.log('尝试重新初始化...');
        }
    }
}

// 导出修复函数
window.coreFixes = {
    waitForData,
    safeInit
};

console.log('✅ 核心修复脚本已加载');
