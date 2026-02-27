// 主应用

let historyTree;
let interactionManager;

// 应用初始化
async function init() {
    try {
        // 显示加载动画
        showLoading();
        
        // 等待一秒以显示加载动画
        await sleep(1000);
        
        // 初始化树
        historyTree = new HistoryTree('#treeSvg', historyData);
        
        // 初始化交互
        interactionManager = new InteractionManager(historyTree);
        
        // 初始化触摸支持
        if (isTouchDevice()) {
            new TouchSupport(historyTree);
        }
        
        // 更新统计信息
        updateStats();
        
        // 隐藏加载动画
        hideLoading();
        
        // 显示欢迎提示
        showWelcome();
        
    } catch (error) {
        console.error('初始化失败:', error);
        hideLoading();
        showError('加载失败，请刷新页面重试');
    }
}

// 显示加载动画
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
}

// 隐藏加载动画
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('hidden');
}

// 显示欢迎提示
function showWelcome() {
    const welcome = document.createElement('div');
    welcome.className = 'welcome-message fade-in';
    welcome.innerHTML = `
        <div class="welcome-content">
            <h2>🌳 欢迎来到历史之树</h2>
            <p>点击节点展开查看历史内容</p>
            <p>使用鼠标拖拽移动，滚轮缩放</p>
            <button onclick="this.parentElement.parentElement.remove()">开始探索</button>
        </div>
    `;
    
    document.body.appendChild(welcome);
    
    // 3秒后自动消失
    setTimeout(() => {
        welcome.classList.add('fade-out');
        setTimeout(() => welcome.remove(), 500);
    }, 5000);
}

// 显示错误
function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    document.body.appendChild(error);
    
    setTimeout(() => error.remove(), 5000);
}

// 更新统计信息
function updateStats() {
    let totalNodes = 0;
    let totalPersons = 0;
    let totalEvents = 0;
    
    // 遍历数据统计
    function countNodes(node) {
        totalNodes++;
        
        if (node.type === 'person') totalPersons++;
        if (node.type === 'event') totalEvents++;
        
        if (node.children) {
            node.children.forEach(countNodes);
        }
    }
    
    countNodes(historyData);
    
    // 更新DOM
    document.getElementById('totalNodes').textContent = totalNodes;
    document.getElementById('totalPersons').textContent = totalPersons;
    document.getElementById('totalEvents').textContent = totalEvents;
}

// 辅助函数：休眠
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 辅助函数：检测触摸设备
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// 设置按钮
document.getElementById('settingsBtn').addEventListener('click', () => {
    showSettings();
});

// 视图模式切换
let currentViewMode = 'tree'; // tree, map, relation

function toggleViewMode() {
    const modes = ['tree', 'map', 'relation'];
    const currentIndex = modes.indexOf(currentViewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    currentViewMode = modes[nextIndex];
    
    // 隐藏所有视图
    document.getElementById('treeSvg').style.display = 'none';
    
    // 移除所有面板
    document.querySelectorAll('.map-panel, .relation-panel').forEach(p => p.remove());
    
    // 显示对应视图
    switch (currentViewMode) {
        case 'tree':
            document.getElementById('treeSvg').style.display = 'block';
            break;
        case 'map':
            showMapPanel();
            break;
        case 'relation':
            showRelationPanel(historyData);
            break;
    }
    
    // 更新按钮文本
    document.getElementById('viewModeBtn').textContent = 
        currentViewMode === 'tree' ? '树形视图' :
        currentViewMode === 'map' ? '地图视图' : '关系视图';
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('无法进入全屏模式:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// 统计更新
function updateStats() {
    let totalNodes = 0;
    let totalPersons = 0;
    let totalEvents = 0;
    let totalPeriods = 0;
    
    // 遍历数据统计
    function countNodes(node) {
        totalNodes++;
        
        if (node.type === 'person') totalPersons++;
        if (node.type === 'event') totalEvents++;
        if (node.type === 'period') totalPeriods++;
        
        if (node.children) {
            node.children.forEach(countNodes);
        }
    }
    
    countNodes(historyData);
    
    // 更新DOM
    document.getElementById('totalNodes').textContent = totalNodes;
    document.getElementById('totalPersons').textContent = totalPersons;
    document.getElementById('totalEvents').textContent = totalEvents;
}

// 初始化完成后更新统计
setTimeout(updateStats, 1500);

// 显示设置面板
function showSettings() {
    const settings = document.createElement('div');
    settings.className = 'settings-panel';
    settings.innerHTML = `
        <div class="settings-content">
            <h3>⚙️ 设置</h3>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="animationToggle" checked>
                    启用动画效果
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="tooltipToggle" checked>
                    显示提示信息
                </label>
            </div>
            <div class="setting-item">
                <label>节点大小</label>
                <input type="range" id="nodeSizeSlider" min="0.5" max="2" step="0.1" value="1">
            </div>
            <div class="setting-item">
                <label>字体大小</label>
                <input type="range" id="fontSizeSlider" min="10" max="20" step="1" value="12">
            </div>
            <div class="setting-actions">
                <button onclick="applySettings()">应用</button>
                <button onclick="this.closest('.settings-panel').remove()">取消</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(settings);
}

// 应用设置
function applySettings() {
    const animationEnabled = document.getElementById('animationToggle').checked;
    const tooltipEnabled = document.getElementById('tooltipToggle').checked;
    const nodeSize = document.getElementById('nodeSizeSlider').value;
    const fontSize = document.getElementById('fontSizeSlider').value;
    
    // 应用设置
    if (!animationEnabled) {
        document.body.classList.add('animation-paused');
    } else {
        document.body.classList.remove('animation-paused');
    }
    
    // 更新节点大小
    historyTree.svgGroup.selectAll('circle')
        .attr('r', function() {
            return d3.select(this).attr('r') * nodeSize;
        });
    
    // 更新字体大小
    historyTree.svgGroup.selectAll('text')
        .style('font-size', fontSize + 'px');
    
    // 关闭设置面板
    document.querySelector('.settings-panel').remove();
}

// 导出数据
function exportData() {
    const dataStr = JSON.stringify(historyData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'history-tree-data.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// 分享功能
function shareNode(nodeData) {
    if (navigator.share) {
        navigator.share({
            title: nodeData.name,
            text: `${nodeData.name} - ${nodeData.year}\n${nodeData.description}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // 降级方案：复制到剪贴板
        const text = `${nodeData.name} - ${nodeData.year}\n${nodeData.description}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板');
        });
    }
}

// 添加动态样式
const style = document.createElement('style');
style.textContent = `
    .welcome-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        z-index: 10000;
        border: 2px solid rgba(255, 215, 0, 0.3);
    }
    
    .welcome-content h2 {
        font-size: 2em;
        margin-bottom: 20px;
        color: #FFD700;
    }
    
    .welcome-content p {
        margin: 10px 0;
        color: #ddd;
    }
    
    .welcome-content button {
        margin-top: 20px;
        padding: 12px 30px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        border: none;
        border-radius: 25px;
        color: #000;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
    }
    
    .welcome-content button:hover {
        transform: scale(1.05);
    }
    
    .settings-panel {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .settings-content {
        background: rgba(30, 30, 50, 0.95);
        padding: 30px;
        border-radius: 15px;
        min-width: 300px;
    }
    
    .settings-content h3 {
        margin-bottom: 20px;
        color: #FFD700;
    }
    
    .setting-item {
        margin: 15px 0;
    }
    
    .setting-item label {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .setting-item input[type="range"] {
        width: 100%;
        margin-top: 5px;
    }
    
    .setting-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    .setting-actions button {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }
    
    .setting-actions button:first-child {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000;
    }
    
    .setting-actions button:last-child {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
    
    .error-message {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(231, 76, 60, 0.9);
        padding: 15px 30px;
        border-radius: 10px;
        z-index: 10000;
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 导出全局函数
window.closeDetail = closeDetail;
window.exportData = exportData;
window.shareNode = shareNode;
window.applySettings = applySettings;
