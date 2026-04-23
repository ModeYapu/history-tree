/**
 * 节点卡片组件 - 详情展示
 * 古风主题版本 v2.0
 */

class NodeCard {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.currentNode = null;
        this.relatedNodes = [];
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
            background: rgba(10, 8, 5, 0.7);
            backdrop-filter: blur(4px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: overlayFadeIn 0.3s ease-out;
        `;
        
        this.card = document.createElement('div');
        this.card.className = 'node-card';
        this.card.style.cssText = `
            background: linear-gradient(165deg, rgba(42, 33, 24, 0.98), rgba(26, 20, 16, 0.99));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(212, 168, 83, 0.2);
            border-radius: 16px;
            max-width: 560px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.6), 0 0 80px rgba(212, 168, 83, 0.05);
            font-family: 'Noto Serif SC', serif;
            animation: cardSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        
        this.container.appendChild(this.card);
        document.body.appendChild(this.container);
        
        // 点击背景关闭
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });
        
        // ESC关闭
        this._escHandler = (e) => {
            if (e.key === 'Escape' && this.container.style.display === 'flex') {
                this.hide();
            }
        };
        document.addEventListener('keydown', this._escHandler);
        
        return this.container;
    }
    
    show(node) {
        this.currentNode = node;
        
        // 确保已渲染
        if (!this.card) this.render();
        
        // 获取相关节点
        this.relatedNodes = [];
        if (this.app && this.app.dataService) {
            const recs = this.app.dataService.getRecommendations(node.id, 4);
            this.relatedNodes = recs.map(r => r.node).filter(Boolean);
        }
        
        this.updateContent(node);
        this.container.style.display = 'flex';
        
        // 更新浏览数
        if (node.metadata) {
            node.metadata.views = (node.metadata.views || 0) + 1;
        }
    }
    
    hide() {
        this.container.style.display = 'none';
    }
    
    updateContent(node) {
        const categoryNames = {
            politics: '政治', technology: '科技', culture: '文化',
            economy: '经济', military: '军事'
        };
        const typeNames = { event: '事件', person: '人物', period: '时期', branch: '分支' };
        const timeStr = node.time?.displayDate || (node.time?.year ? (node.time.year < 0 ? `前${Math.abs(node.time.year)}年` : `${node.time.year}年`) : '');
        const periodStr = node.time?.period || '';
        const locationStr = node.location?.name || '';
        const catStr = categoryNames[node.category?.primary] || node.category?.primary || '';
        const typeStr = typeNames[node.type] || node.type || '';
        const importance = node.metadata?.importance || 3;
        const catColor = this.getCategoryAccent(node.category?.primary);
        
        this.card.innerHTML = `
            <!-- 顶部装饰线 -->
            <div style="
                height: 3px;
                background: linear-gradient(90deg, transparent, ${catColor}, transparent);
                border-radius: 16px 16px 0 0;
            "></div>
            
            <!-- 关闭按钮 -->
            <button class="close-btn" style="
                position: absolute;
                top: 12px;
                right: 12px;
                background: rgba(212, 168, 83, 0.08);
                border: 1px solid rgba(212, 168, 83, 0.15);
                color: #8B7355;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s;
                z-index: 1;
            " onmouseover="this.style.background='rgba(212,168,83,0.2)'" onmouseout="this.style.background='rgba(212,168,83,0.08)'" onclick="this.closest('.node-card-overlay').style.display='none'">×</button>
            
            <!-- 头部 -->
            <div style="padding: 28px 28px 0 28px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                    <span style="font-size: 13px; color: #8B7355; background: rgba(212,168,83,0.08); border: 1px solid rgba(212,168,83,0.12); padding: 3px 10px; border-radius: 10px;">${typeStr}</span>
                    ${catStr ? `<span style="font-size: 13px; color: ${catColor}; background: rgba(212,168,83,0.08); border: 1px solid rgba(212,168,83,0.12); padding: 3px 10px; border-radius: 10px;">${catStr}</span>` : ''}
                </div>
                
                <h2 style="
                    margin: 0 0 12px 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #F0D68A;
                    letter-spacing: 1px;
                    line-height: 1.3;
                ">${node.name}</h2>
                
                <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; color: #8B7355;">
                    ${timeStr ? `<span>📅 ${timeStr}</span>` : ''}
                    ${periodStr ? `<span>📜 ${periodStr}</span>` : ''}
                    ${locationStr ? `<span>📍 ${locationStr}</span>` : ''}
                </div>
            </div>
            
            <!-- 分隔线 -->
            <div style="
                margin: 18px 28px;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent);
            "></div>
            
            <!-- 正文 -->
            <div style="padding: 0 28px;">
                ${(node.summary || node.description) ? `
                    <div style="margin-bottom: 18px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #C9A96E; letter-spacing: 1px;">📖 概述</h3>
                        <p style="margin: 0; color: #A89070; line-height: 1.9; font-size: 14px;">${node.summary || node.description}</p>
                    </div>
                ` : ''}
                
                ${node.description && node.summary ? `
                    <div style="margin-bottom: 18px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #C9A96E; letter-spacing: 1px;">📝 详述</h3>
                        <p style="margin: 0; color: #A89070; line-height: 1.9; font-size: 14px;">${node.description}</p>
                    </div>
                ` : ''}
                
                ${node.content?.significance ? `
                    <div style="margin-bottom: 18px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #C9A96E; letter-spacing: 1px;">✨ 历史意义</h3>
                        <p style="margin: 0; color: #A89070; line-height: 1.9; font-size: 14px;">${node.content.significance}</p>
                    </div>
                ` : ''}
                
                ${node.content?.consequences?.length > 0 ? `
                    <div style="margin-bottom: 18px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #C9A96E; letter-spacing: 1px;">🔗 影响</h3>
                        <ul style="margin: 0; padding-left: 18px; color: #A89070; line-height: 2; font-size: 14px;">
                            ${node.content.consequences.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            
            <!-- 相关推荐 -->
            ${this.relatedNodes.length > 0 ? `
                <div style="padding: 0 28px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #C9A96E; letter-spacing: 1px;">📎 相关推荐</h3>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${this.relatedNodes.map(rn => `
                            <div class="related-node" data-id="${rn.id}" style="
                                background: rgba(212,168,83,0.05);
                                border: 1px solid rgba(212,168,83,0.1);
                                border-radius: 10px;
                                padding: 10px 14px;
                                cursor: pointer;
                                transition: all 0.2s;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            " onmouseover="this.style.borderColor='rgba(212,168,83,0.3)'" onmouseout="this.style.borderColor='rgba(212,168,83,0.1)'">
                                <div>
                                    <div style="font-size: 14px; color: #F0D68A;">${rn.name}</div>
                                    <div style="font-size: 12px; color: #8B7355; margin-top: 2px;">${rn.time?.displayDate || rn.time?.period || ''}${rn.location?.name ? ' · ' + rn.location.name : ''}</div>
                                </div>
                                <span style="color: #8B7355; font-size: 12px;">→</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- 标签 -->
            ${node.category?.tags?.length > 0 ? `
                <div style="padding: 16px 28px 0 28px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${node.category.tags.map(tag => `
                            <span style="
                                background: rgba(212,168,83,0.06);
                                border: 1px solid rgba(212,168,83,0.12);
                                color: #8B7355;
                                padding: 3px 10px;
                                border-radius: 12px;
                                font-size: 12px;
                            ">#${tag}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- 底部 -->
            <div style="
                margin: 18px 28px 0 28px;
                padding: 14px 0 18px 0;
                border-top: 1px solid rgba(212,168,83,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="font-size: 12px; color: #6B5D4D;">
                    <span>👁 ${node.metadata?.views || 0}</span>
                    <span style="margin-left: 12px;">${'⭐'.repeat(Math.min(importance, 5))}${'☆'.repeat(Math.max(5 - importance, 0))}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="
                        const s = this.querySelector('.like-count');
                        const v = parseInt(s.textContent) + 1;
                        s.textContent = v;
                        this.style.color = '#D4A853';
                    " style="
                        background: rgba(212,168,83,0.08);
                        border: 1px solid rgba(212,168,83,0.15);
                        color: #8B7355;
                        padding: 6px 14px;
                        border-radius: 14px;
                        cursor: pointer;
                        font-family: 'Noto Serif SC', serif;
                        font-size: 12px;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='rgba(212,168,83,0.3)'" onmouseout="this.style.borderColor='rgba(212,168,83,0.15)'">❤️ <span class="like-count">${node.metadata?.likes || 0}</span></button>
                    <button onclick="
                        if(navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href + '?node=${node.id}');
                            this.textContent = '✅ 已复制';
                            setTimeout(() => this.textContent = '📤 分享', 1500);
                        }
                    " style="
                        background: rgba(212,168,83,0.08);
                        border: 1px solid rgba(212,168,83,0.15);
                        color: #8B7355;
                        padding: 6px 14px;
                        border-radius: 14px;
                        cursor: pointer;
                        font-family: 'Noto Serif SC', serif;
                        font-size: 12px;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='rgba(212,168,83,0.3)'" onmouseout="this.style.borderColor='rgba(212,168,83,0.15)'">📤 分享</button>
                </div>
            </div>
        `;
        
        // 相关节点点击跳转
        this.card.querySelectorAll('.related-node').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                const targetNode = this.app.dataService.getNode(id);
                if (targetNode) {
                    this.show(targetNode);
                }
            });
        });
    }
    
    getCategoryAccent(category) {
        const colors = {
            politics: '#E85D5D',
            technology: '#4ABFB0',
            culture: '#B87FD8',
            economy: '#5CB870',
            military: '#E8943D'
        };
        return colors[category] || '#D4A853';
    }
    
    destroy() {
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
        }
        if (this.container) this.container.remove();
    }
}

window.NodeCard = NodeCard;
