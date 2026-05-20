/**
 * 分析插件 - 数据统计和可视化
 */

class AnalyticsPlugin {
    constructor(app) {
        this.app = app;
        this.name = 'analytics';
        this.version = '1.0.0';
    }
    
    init() {
        console.log('📊 Analytics Plugin initialized');
    }
    
    /**
     * 获取完整统计
     */
    getFullStats() {
        const nodes = Array.from(this.app.dataService.nodes.values());
        
        return {
            total: nodes.length,
            byType: this.groupBy(nodes, 'type'),
            byCategory: this.groupBy(nodes, n => n.category.primary),
            byPeriod: this.groupBy(nodes, n => n.time.period),
            byImportance: this.groupBy(nodes, n => n.metadata.importance),
            topViewed: this.getTop(nodes, 'views', 10),
            topLiked: this.getTop(nodes, 'likes', 10),
            timeline: this.getTimeline(nodes),
            geography: this.getGeography(nodes)
        };
    }
    
    /**
     * 分组统计
     */
    groupBy(array, keyFn) {
        const groups = {};
        
        array.forEach(item => {
            const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
            groups[key] = (groups[key] || 0) + 1;
        });
        
        return groups;
    }
    
    /**
     * 获取Top N
     */
    getTop(array, key, limit) {
        return array
            .sort((a, b) => b.metadata[key] - a.metadata[key])
            .slice(0, limit)
            .map(n => ({ name: n.name, value: n.metadata[key] }));
    }
    
    /**
     * 获取时间线分布
     */
    getTimeline(nodes) {
        const byYear = {};
        
        nodes.forEach(node => {
            if (node.time.year) {
                const year = Math.floor(node.time.year / 100) * 100;
                byYear[year] = (byYear[year] || 0) + 1;
            }
        });
        
        return Object.entries(byYear)
            .map(([year, count]) => ({ year: parseInt(year), count }))
            .sort((a, b) => a.year - b.year);
    }
    
    /**
     * 获取地理分布
     */
    getGeography(nodes) {
        const byLocation = {};
        
        nodes.forEach(node => {
            if (node.location.name) {
                byLocation[node.location.name] = (byLocation[node.location.name] || 0) + 1;
            }
        });
        
        return Object.entries(byLocation)
            .map(([location, count]) => ({ location, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);
    }
    
    /**
     * 生成报告
     */
    generateReport() {
        const stats = this.getFullStats();
        
        return `
# 历史之树 - 数据分析报告

## 📊 总体统计

- **总节点数**: ${stats.total}
- **事件数**: ${stats.byType.event || 0}
- **人物数**: ${stats.byType.person || 0}
- **时期数**: ${stats.byType.period || 0}

## 🏷️ 分类分布

${Object.entries(stats.byCategory).map(([cat, count]) => 
    `- **${cat}**: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`
).join('\n')}

## 📅 时期分布

${Object.entries(stats.byPeriod).map(([period, count]) => 
    `- **${period}**: ${count}`
).join('\n')}

## ⭐ 重要度分布

${Object.entries(stats.byImportance).map(([imp, count]) => 
    `- **${'⭐'.repeat(imp)}**: ${count}`
).join('\n')}

## 🔥 最受欢迎

### 浏览最多
${stats.topViewed.map((item, i) => `${i + 1}. ${item.name} (${item.value}次)`).join('\n')}

### 点赞最多
${stats.topLiked.map((item, i) => `${i + 1}. ${item.name} (${item.value}个赞)`).join('\n')}

## 🌍 地理分布 (Top 10)

${stats.geography.slice(0, 10).map((item, i) => 
    `${i + 1}. ${item.location} (${item.count})`
).join('\n')}

---

*报告生成时间: ${new Date().toLocaleString('zh-CN')}*
        `.trim();
    }
    
    /**
     * 可视化统计
     */
    showVisualization() {
        const stats = this.getFullStats();
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 900px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        const h2 = document.createElement('h2');
        h2.style.cssText = 'margin: 0 0 20px 0;';
        h2.textContent = '📊 数据分析';

        const pre = document.createElement('pre');
        pre.style.cssText = `
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            font-size: 12px;
            overflow-x: auto;
        `;
        pre.textContent = JSON.stringify(stats, null, 2);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            margin-top: 20px;
            padding: 10px 30px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        contentDiv.appendChild(h2);
        contentDiv.appendChild(pre);
        contentDiv.appendChild(closeBtn);

        modal.appendChild(contentDiv);

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    destroy() {
        // 清理
    }
}

window.AnalyticsPlugin = AnalyticsPlugin;
