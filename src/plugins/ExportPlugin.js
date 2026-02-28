/**
 * 导出插件 - 多格式导出
 */

class ExportPlugin {
    constructor(app) {
        this.app = app;
        this.name = 'export';
        this.version = '1.0.0';
    }
    
    init() {
        console.log('📦 Export Plugin initialized');
        
        // 注册导出格式
        this.exporters = new Map([
            ['json', this.exportJSON.bind(this)],
            ['csv', this.exportCSV.bind(this)],
            ['pdf', this.exportPDF.bind(this)],
            ['png', this.exportPNG.bind(this)],
            ['svg', this.exportSVG.bind(this)]
        ]);
    }
    
    async export(format, options = {}) {
        const exporter = this.exporters.get(format);
        
        if (!exporter) {
            throw new Error(`Unsupported export format: ${format}`);
        }
        
        return await exporter(options);
    }
    
    async exportJSON(options = {}) {
        const { filters = {} } = options;
        const data = this.app.dataService.filter(filters);
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        
        this.download(blob, 'history-data.json');
        
        return { success: true, format: 'json', count: data.length };
    }
    
    async exportCSV(options = {}) {
        const { filters = {} } = options;
        const data = this.app.dataService.filter(filters);
        
        const headers = ['ID', '名称', '类型', '年份', '时期', '地点', '分类', '重要度'];
        const rows = data.map(node => [
            node.id,
            node.name,
            node.type,
            node.time.year,
            node.time.period,
            node.location.name,
            node.category.primary,
            node.metadata.importance
        ]);
        
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        
        this.download(blob, 'history-data.csv');
        
        return { success: true, format: 'csv', count: data.length };
    }
    
    async exportPDF(options = {}) {
        // 需要引入jsPDF库
        const { jsPDF } = window;
        
        if (!jsPDF) {
            console.warn('jsPDF not loaded, PDF export unavailable');
            return { success: false, error: 'jsPDF not loaded' };
        }
        
        const doc = new jsPDF();
        
        // 标题
        doc.setFontSize(20);
        doc.text('History Tree Export', 20, 20);
        
        // 内容
        doc.setFontSize(12);
        const data = this.app.dataService.filter(options.filters || {});
        
        let y = 40;
        data.slice(0, 20).forEach((node, index) => {
            doc.text(`${index + 1}. ${node.name} (${node.time.displayDate})`, 20, y);
            y += 10;
        });
        
        doc.save('history-tree.pdf');
        
        return { success: true, format: 'pdf', count: data.length };
    }
    
    async exportPNG(options = {}) {
        const { selector = '.tree-view svg' } = options;
        const svg = document.querySelector(selector);
        
        if (!svg) {
            return { success: false, error: 'SVG element not found' };
        }
        
        // 使用html2canvas或类似库
        const canvas = await this.svgToCanvas(svg);
        canvas.toBlob(blob => {
            this.download(blob, 'history-tree.png');
        });
        
        return { success: true, format: 'png' };
    }
    
    async exportSVG(options = {}) {
        const { selector = '.tree-view svg' } = options;
        const svg = document.querySelector(selector);
        
        if (!svg) {
            return { success: false, error: 'SVG element not found' };
        }
        
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        
        this.download(blob, 'history-tree.svg');
        
        return { success: true, format: 'svg' };
    }
    
    svgToCanvas(svg) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        });
    }
    
    download(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    destroy() {
        this.exporters.clear();
    }
}

window.ExportPlugin = ExportPlugin;
