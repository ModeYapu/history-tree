/**
 * 节点卡片组件 - 详情展示
 */

class NodeCard {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.currentNode = null;
    }
    
    render() {
        this.container = document.createElement('div');
        this.container.className = 'node-card-overlay';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        this.card = document.createElement('div');
        this.card.className = 'node-card';
        this.card.style.cssText = `
            background: white;
            border-radius: 16px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        `;
        
        this.container.appendChild(this.card);
        document.body.appendChild(this.container);
        
        // 点击背景关闭
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });
        
        return this.container;
    }
    
    show(node) {
        this.currentNode = node;
        this.updateContent(node);
        this.container.style.display = 'flex';
        
        // 更新视图数
        node.incrementViews();
    }
    
    hide() {
        this.container.style.display = 'none';
    }
    
    updateContent(node) {
        this.card.innerHTML = `
            <div class="card-header" style="
                background: linear-gradient(135deg, ${this.getCategoryColor(node.category.primary)}, ${this.getCategoryColor(node.category.primary)}cc);
                padding: 30px;
                color: white;
                position: relative;
            ">
                <button class="close-btn" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    font-size: 18px;
                    cursor: pointer;
                " onclick="this.closest('.node-card-overlay').style.display='none'">×</button>
                
                <div style="font-size: 48px; margin-bottom: 15px;">
                    ${this.getNodeIcon(node.type)}
                </div>
                
                <h2 style="margin: 0 0 10px 0; font-size: 28px;">
                    ${node.name}
                </h2>
                
                <div style="opacity: 0.9; font-size: 16px;">
                    <span>${node.time.displayDate}</span>
                    ${node.location.name ? `<span> • ${node.location.name}</span>` : ''}
                </div>
            </div>
            
            <div class="card-content" style="padding: 25px;">
                ${node.summary ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">概述</h3>
                        <p style="margin: 0; color: #666; line-height: 1.8;">${node.summary}</p>
                    </div>
                ` : ''}
                
                ${node.description ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">详细描述</h3>
                        <p style="margin: 0; color: #666; line-height: 1.8;">${node.description}</p>
                    </div>
                ` : ''}
                
                ${node.content.significance ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">历史意义</h3>
                        <p style="margin: 0; color: #666; line-height: 1.8;">${node.content.significance}</p>
                    </div>
                ` : ''}
                
                ${node.content.consequences && node.content.consequences.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">影响</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                            ${node.content.consequences.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${node.category.tags && node.category.tags.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">标签</h3>
                        <div>
                            ${node.category.tags.map(tag => `
                                <span style="
                                    display: inline-block;
                                    background: #f0f0f0;
                                    padding: 5px 12px;
                                    border-radius: 15px;
                                    font-size: 13px;
                                    margin-right: 8px;
                                    margin-bottom: 8px;
                                ">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div style="font-size: 14px; color: #999;">
                        <span>浏览: ${node.metadata.views}</span>
                        <span style="margin-left: 15px;">重要度: ${'⭐'.repeat(node.metadata.importance)}</span>
                    </div>
                    <div>
                        <button class="like-btn" style="
                            background: #ff6b6b;
                            color: white;
                            border: none;
                            padding: 8px 20px;
                            border-radius: 20px;
                            cursor: pointer;
                            margin-right: 10px;
                        " onclick="this.closest('.node-card-overlay').querySelector('.like-count').textContent++">
                            ❤️ 点赞 (<span class="like-count">${node.metadata.likes}</span>)
                        </button>
                        <button class="share-btn" style="
                            background: #4A90E2;
                            color: white;
                            border: none;
                            padding: 8px 20px;
                            border-radius: 20px;
                            cursor: pointer;
                        ">📤 分享</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCategoryColor(category) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316'
        };
        return colors[category] || '#999';
    }
    
    getNodeIcon(type) {
        const icons = {
            event: '📍',
            person: '👤',
            period: '📅',
            branch: '🌿'
        };
        return icons[type] || '●';
    }
    
    destroy() {
        if (this.container) {
            this.container.remove();
        }
    }
}

window.NodeCard = NodeCard;
