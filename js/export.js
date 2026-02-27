// 导出功能

class ExportManager {
    constructor() {
        this.formats = ['png', 'svg', 'json', 'pdf'];
    }
    
    // 导出为PNG
    async exportPNG() {
        const svg = document.querySelector('#treeSvg');
        const canvas = await this.svgToCanvas(svg);
        
        const link = document.createElement('a');
        link.download = `history-tree-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    // 导出为SVG
    exportSVG() {
        const svg = document.querySelector('#treeSvg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const link = document.createElement('a');
        link.download = `history-tree-${Date.now()}.svg`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    // 导出为JSON
    exportJSON() {
        const dataStr = JSON.stringify(historyData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `history-tree-data-${Date.now()}.json`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    // 导出为PDF（需要html2pdf库）
    async exportPDF() {
        // 动态加载html2pdf库
        if (typeof html2pdf === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        }
        
        const element = document.querySelector('#mainContainer');
        
        const opt = {
            margin: 10,
            filename: `history-tree-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        
        await html2pdf().set(opt).from(element).save();
    }
    
    // SVG转Canvas
    async svgToCanvas(svg) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            
            // 设置canvas尺寸
            const svgRect = svg.getBoundingClientRect();
            canvas.width = svgRect.width * 2; // 2x for high DPI
            canvas.height = svgRect.height * 2;
            ctx.scale(2, 2);
            
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            };
            
            img.onerror = reject;
            
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        });
    }
    
    // 动态加载脚本
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // 导出当前视图
    async exportCurrentView(format = 'png') {
        switch (format) {
            case 'png':
                await this.exportPNG();
                break;
            case 'svg':
                this.exportSVG();
                break;
            case 'json':
                this.exportJSON();
                break;
            case 'pdf':
                await this.exportPDF();
                break;
            default:
                console.error('Unsupported format:', format);
        }
    }
}

// 导出面板
function showExportPanel() {
    const panel = document.createElement('div');
    panel.className = 'export-panel';
    panel.innerHTML = `
        <div class="export-header">
            <h3>📥 导出</h3>
            <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="export-content">
            <div class="export-option" onclick="exportManager.exportCurrentView('png')">
                <div class="export-icon">🖼️</div>
                <div class="export-info">
                    <h4>PNG图片</h4>
                    <p>高质量PNG格式，适合分享和打印</p>
                </div>
            </div>
            <div class="export-option" onclick="exportManager.exportCurrentView('svg')">
                <div class="export-icon">🎨</div>
                <div class="export-info">
                    <h4>SVG矢量图</h4>
                    <p>可缩放矢量格式，无损质量</p>
                </div>
            </div>
            <div class="export-option" onclick="exportManager.exportCurrentView('json')">
                <div class="export-icon">📊</div>
                <div class="export-info">
                    <h4>JSON数据</h4>
                    <p>原始数据格式，可用于其他应用</p>
                </div>
            </div>
            <div class="export-option" onclick="exportManager.exportCurrentView('pdf')">
                <div class="export-icon">📄</div>
                <div class="export-info">
                    <h4>PDF文档</h4>
                    <p>适合打印和文档保存</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
}

// 全局导出管理器
const exportManager = new ExportManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExportManager, showExportPanel };
}
