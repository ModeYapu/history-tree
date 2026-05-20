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

        // 清空现有内容
        this.card.innerHTML = '';

        // 顶部装饰线
        const topLine = document.createElement('div');
        topLine.style.cssText = `
            height: 3px;
            background: linear-gradient(90deg, transparent, ${catColor}, transparent);
            border-radius: 16px 16px 0 0;
        `;
        this.card.appendChild(topLine);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.style.cssText = `
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
        `;
        closeBtn.textContent = '×';
        closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'rgba(212,168,83,0.2)'; });
        closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'rgba(212,168,83,0.08)'; });
        closeBtn.addEventListener('click', () => { this.container.style.display = 'none'; });
        this.card.appendChild(closeBtn);

        // 头部
        const header = document.createElement('div');
        header.style.cssText = 'padding: 28px 28px 0 28px;';

        const tagsDiv = document.createElement('div');
        tagsDiv.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 14px;';

        const typeTag = this.createTag(typeStr, '#8B7355');
        tagsDiv.appendChild(typeTag);

        if (catStr) {
            const catTag = this.createTag(catStr, catColor);
            tagsDiv.appendChild(catTag);
        }

        const title = document.createElement('h2');
        title.style.cssText = `
            margin: 0 0 12px 0;
            font-size: 24px;
            font-weight: 700;
            color: #F0D68A;
            letter-spacing: 1px;
            line-height: 1.3;
        `;
        title.textContent = node.name;

        const metaDiv = document.createElement('div');
        metaDiv.style.cssText = 'display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; color: #8B7355;';

        if (timeStr) {
            const timeSpan = document.createElement('span');
            timeSpan.textContent = `📅 ${timeStr}`;
            metaDiv.appendChild(timeSpan);
        }
        if (periodStr) {
            const periodSpan = document.createElement('span');
            periodSpan.textContent = `📜 ${periodStr}`;
            metaDiv.appendChild(periodSpan);
        }
        if (locationStr) {
            const locationSpan = document.createElement('span');
            locationSpan.textContent = `📍 ${locationStr}`;
            metaDiv.appendChild(locationSpan);
        }

        header.appendChild(tagsDiv);
        header.appendChild(title);
        header.appendChild(metaDiv);
        this.card.appendChild(header);

        // 分隔线
        const divider = document.createElement('div');
        divider.style.cssText = `
            margin: 18px 28px;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent);
        `;
        this.card.appendChild(divider);

        // 正文
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'padding: 0 28px;';

        if (node.summary || node.description) {
            contentDiv.appendChild(this.createSection('📖 概述', node.summary || node.description));
        }

        if (node.description && node.summary) {
            contentDiv.appendChild(this.createSection('📝 详述', node.description));
        }

        if (node.content?.significance) {
            contentDiv.appendChild(this.createSection('✨ 历史意义', node.content.significance));
        }

        if (node.content?.consequences?.length > 0) {
            const section = this.createSection('🔗 影响', '');
            const ul = document.createElement('ul');
            ul.style.cssText = 'margin: 0; padding-left: 18px; color: #A89070; line-height: 2; font-size: 14px;';
            node.content.consequences.forEach(c => {
                const li = document.createElement('li');
                li.textContent = c;
                ul.appendChild(li);
            });
            section.appendChild(ul);
            contentDiv.appendChild(section);
        }

        this.card.appendChild(contentDiv);

        // 相关推荐
        if (this.relatedNodes.length > 0) {
            const relatedDiv = document.createElement('div');
            relatedDiv.style.cssText = 'padding: 0 28px;';

            const relatedTitle = document.createElement('h3');
            relatedTitle.style.cssText = 'margin: 0 0 10px 0; font-size: 15px; color: #C9A96E; letter-spacing: 1px;';
            relatedTitle.textContent = '📎 相关推荐';
            relatedDiv.appendChild(relatedTitle);

            const relatedList = document.createElement('div');
            relatedList.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

            this.relatedNodes.forEach(rn => {
                const item = this.createRelatedNodeItem(rn);
                relatedList.appendChild(item);
            });

            relatedDiv.appendChild(relatedList);
            this.card.appendChild(relatedDiv);
        }

        // 标签
        if (node.category?.tags?.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.style.cssText = 'padding: 16px 28px 0 28px;';
            const tagsFlex = document.createElement('div');
            tagsFlex.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px;';

            node.category.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.style.cssText = `
                    background: rgba(212,168,83,0.06);
                    border: 1px solid rgba(212,168,83,0.12);
                    color: #8B7355;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                `;
                tagEl.textContent = `#${tag}`;
                tagsFlex.appendChild(tagEl);
            });

            tagsContainer.appendChild(tagsFlex);
            this.card.appendChild(tagsContainer);
        }

        // 底部
        const footer = this.createFooter(node, importance);
        this.card.appendChild(footer);

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

    /**
     * 创建标签元素
     */
    createTag(text, color) {
        const span = document.createElement('span');
        span.style.cssText = `
            font-size: 13px;
            color: ${color};
            background: rgba(212,168,83,0.08);
            border: 1px solid rgba(212,168,83,0.12);
            padding: 3px 10px;
            border-radius: 10px;
        `;
        span.textContent = text;
        return span;
    }

    /**
     * 创建内容区块
     */
    createSection(title, content) {
        const div = document.createElement('div');
        div.style.cssText = 'margin-bottom: 18px;';

        const h3 = document.createElement('h3');
        h3.style.cssText = 'margin: 0 0 8px 0; font-size: 15px; color: #C9A96E; letter-spacing: 1px;';
        h3.textContent = title;
        div.appendChild(h3);

        if (content) {
            const p = document.createElement('p');
            p.style.cssText = 'margin: 0; color: #A89070; line-height: 1.9; font-size: 14px;';
            p.textContent = content;
            div.appendChild(p);
        }

        return div;
    }

    /**
     * 创建相关节点项
     */
    createRelatedNodeItem(node) {
        const item = document.createElement('div');
        item.className = 'related-node';
        item.dataset.id = node.id;
        item.style.cssText = `
            background: rgba(212,168,83,0.05);
            border: 1px solid rgba(212,168,83,0.1);
            border-radius: 10px;
            padding: 10px 14px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        item.addEventListener('mouseenter', () => { item.style.borderColor = 'rgba(212,168,83,0.3)'; });
        item.addEventListener('mouseleave', () => { item.style.borderColor = 'rgba(212,168,83,0.1)'; });

        const leftDiv = document.createElement('div');

        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = 'font-size: 14px; color: #F0D68A;';
        nameDiv.textContent = node.name;

        const detailDiv = document.createElement('div');
        detailDiv.style.cssText = 'font-size: 12px; color: #8B7355; margin-top: 2px;';
        const timeText = node.time?.displayDate || node.time?.period || '';
        const locationText = node.location?.name ? ` · ${node.location.name}` : '';
        detailDiv.textContent = `${timeText}${locationText}`;

        leftDiv.appendChild(nameDiv);
        leftDiv.appendChild(detailDiv);

        const arrow = document.createElement('span');
        arrow.style.cssText = 'color: #8B7355; font-size: 12px;';
        arrow.textContent = '→';

        item.appendChild(leftDiv);
        item.appendChild(arrow);

        return item;
    }

    /**
     * 创建底部
     */
    createFooter(node, importance) {
        const footer = document.createElement('div');
        footer.style.cssText = `
            margin: 18px 28px 0 28px;
            padding: 14px 0 18px 0;
            border-top: 1px solid rgba(212,168,83,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const statsDiv = document.createElement('div');
        statsDiv.style.cssText = 'font-size: 12px; color: #6B5D4D;';

        const viewsSpan = document.createElement('span');
        viewsSpan.textContent = `👁 ${node.metadata?.views || 0}`;

        const starsSpan = document.createElement('span');
        starsSpan.style.marginLeft = '12px';
        starsSpan.textContent = `${'⭐'.repeat(Math.min(importance, 5))}${'☆'.repeat(Math.max(5 - importance, 0))}`;

        statsDiv.appendChild(viewsSpan);
        statsDiv.appendChild(starsSpan);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.cssText = 'display: flex; gap: 8px;';

        const likeBtn = document.createElement('button');
        likeBtn.style.cssText = `
            background: rgba(212,168,83,0.08);
            border: 1px solid rgba(212,168,83,0.15);
            color: #8B7355;
            padding: 6px 14px;
            border-radius: 14px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
            font-size: 12px;
            transition: all 0.2s;
        `;
        const likeCount = document.createElement('span');
        likeCount.className = 'like-count';
        likeCount.textContent = node.metadata?.likes || 0;
        likeBtn.appendChild(document.createTextNode('❤️ '));
        likeBtn.appendChild(likeCount);
        likeBtn.addEventListener('click', () => {
            const v = parseInt(likeCount.textContent) + 1;
            likeCount.textContent = v;
            likeBtn.style.color = '#D4A853';
        });
        likeBtn.addEventListener('mouseenter', () => { likeBtn.style.borderColor = 'rgba(212,168,83,0.3)'; });
        likeBtn.addEventListener('mouseleave', () => { likeBtn.style.borderColor = 'rgba(212,168,83,0.15)'; });

        const shareBtn = document.createElement('button');
        shareBtn.style.cssText = `
            background: rgba(212,168,83,0.08);
            border: 1px solid rgba(212,168,83,0.15);
            color: #8B7355;
            padding: 6px 14px;
            border-radius: 14px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
            font-size: 12px;
            transition: all 0.2s;
        `;
        shareBtn.textContent = '📤 分享';
        shareBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href + `?node=${node.id}`);
                shareBtn.textContent = '✅ 已复制';
                setTimeout(() => { shareBtn.textContent = '📤 分享'; }, 1500);
            }
        });
        shareBtn.addEventListener('mouseenter', () => { shareBtn.style.borderColor = 'rgba(212,168,83,0.3)'; });
        shareBtn.addEventListener('mouseleave', () => { shareBtn.style.borderColor = 'rgba(212,168,83,0.15)'; });

        buttonsDiv.appendChild(likeBtn);
        buttonsDiv.appendChild(shareBtn);

        footer.appendChild(statsDiv);
        footer.appendChild(buttonsDiv);

        return footer;
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
