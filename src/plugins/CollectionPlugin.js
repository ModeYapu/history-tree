/**
 * 收藏插件 - 历史节点收藏与合集系统 v1.0
 * 支持收藏节点、创建自定义合集、合集封面生成、收藏面板UI
 */

class CollectionPlugin {
    static STORAGE_KEY = 'historyTree_collections';
    static FAVORITES_KEY = 'historyTree_favorites';

    static COLLECTION_COLORS = [
        { name: '紫韵', value: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: '珊瑚', value: '#f5576c', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: '海洋', value: '#4facfe', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { name: '森林', value: '#43e97b', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { name: '日落', value: '#fa709a', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { name: '星空', value: '#a18cd1', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
        { name: '火焰', value: '#f46b45', gradient: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)' },
        { name: '青色', value: '#30cfd0', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
    ];

    static COLLECTION_ICONS = [
        { id: 'star', icon: '⭐', name: '星光' },
        { id: 'heart', icon: '❤️', name: '心形' },
        { id: 'book', icon: '📚', name: '书籍' },
        { id: 'crown', icon: '👑', name: '皇冠' },
        { id: 'sparkle', icon: '✨', name: '闪光' },
        { id: 'diamond', icon: '💎', name: '钻石' },
        { id: 'scroll', icon: '📜', name: '卷轴' },
        { id: 'trophy', icon: '🏆', name: '奖杯' }
    ];

    constructor(app) {
        this.app = app;
        this.name = 'collection';
        this.version = '1.0.0';

        this.favorites = new Set();
        this.collections = [];
        this.colors = [...CollectionPlugin.COLLECTION_COLORS];
        this.icons = [...CollectionPlugin.COLLECTION_ICONS];

        this.uiContainer = null;
        this.isVisible = false;
        this.currentView = 'favorites';

        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupGlobalActions();
        console.log('💎 Collection Plugin initialized');
    }

    /**
     * 加载数据
     */
    loadData() {
        try {
            // 加载收藏
            const favoritesData = localStorage.getItem(CollectionPlugin.FAVORITES_KEY);
            if (favoritesData) {
                this.favorites = new Set(JSON.parse(favoritesData));
            }

            // 加载合集
            const collectionsData = localStorage.getItem(CollectionPlugin.STORAGE_KEY);
            if (collectionsData) {
                this.collections = JSON.parse(collectionsData);
            }
        } catch (e) {
            console.warn('Failed to load collection data:', e);
        }
    }

    /**
     * 保存数据
     */
    saveData() {
        try {
            localStorage.setItem(CollectionPlugin.FAVORITES_KEY, JSON.stringify([...this.favorites]));
            localStorage.setItem(CollectionPlugin.STORAGE_KEY, JSON.stringify(this.collections));
        } catch (e) {
            console.warn('Failed to save collection data:', e);
        }
    }

    /**
     * 设置全局操作
     */
    setupGlobalActions() {
        // 添加收藏按钮到节点卡片
        this.app.eventBus.on('node:card:render', (card) => {
            this.addFavoriteButton(card);
        });
    }

    /**
     * 添加收藏按钮
     */
    addFavoriteButton(card) {
        const nodeId = card.dataset.nodeId;
        if (!nodeId) return;

        const btn = document.createElement('button');
        btn.className = 'favorite-btn';
        btn.innerHTML = this.favorites.has(nodeId) ? '❤️' : '🤍';
        btn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: transform 0.2s;
            z-index: 10;
        `;

        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(nodeId);
            btn.innerHTML = this.favorites.has(nodeId) ? '❤️' : '🤍';
        });

        card.appendChild(btn);
    }

    /**
     * 切换收藏状态
     */
    toggleFavorite(nodeId) {
        if (this.favorites.has(nodeId)) {
            this.favorites.delete(nodeId);
            this.app.eventBus.emit('collection:unfavorited', nodeId);
        } else {
            this.favorites.add(nodeId);
            this.app.eventBus.emit('collection:favorited', nodeId);
        }
        this.saveData();
        return this.favorites.has(nodeId);
    }

    /**
     * 检查是否已收藏
     */
    isFavorite(nodeId) {
        return this.favorites.has(nodeId);
    }

    /**
     * 获取收藏列表
     */
    getFavorites() {
        return [...this.favorites].map(id => this.app.dataService?.getNode(id)).filter(Boolean);
    }

    /**
     * 创建合集
     */
    createCollection(options = {}) {
        const {
            name = '新建合集',
            description = '',
            color = this.colors[Math.floor(Math.random() * this.colors.length)],
            icon = this.icons[0],
            coverImage = null
        } = options;

        const collection = {
            id: 'collection_' + Date.now(),
            name,
            description,
            color,
            icon,
            coverImage,
            nodes: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.collections.push(collection);
        this.saveData();

        this.app.eventBus.emit('collection:created', collection);
        return collection;
    }

    /**
     * 更新合集
     */
    updateCollection(collectionId, updates) {
        const index = this.collections.findIndex(c => c.id === collectionId);
        if (index !== -1) {
            this.collections[index] = {
                ...this.collections[index],
                ...updates,
                updatedAt: Date.now()
            };
            this.saveData();
            this.app.eventBus.emit('collection:updated', this.collections[index]);
            return this.collections[index];
        }
        return null;
    }

    /**
     * 删除合集
     */
    deleteCollection(collectionId) {
        const index = this.collections.findIndex(c => c.id === collectionId);
        if (index !== -1) {
            const deleted = this.collections.splice(index, 1)[0];
            this.saveData();
            this.app.eventBus.emit('collection:deleted', deleted);
            return true;
        }
        return false;
    }

    /**
     * 添加节点到合集
     */
    addNodeToCollection(collectionId, nodeId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (collection && !collection.nodes.includes(nodeId)) {
            collection.nodes.push(nodeId);
            collection.updatedAt = Date.now();
            this.saveData();
            this.app.eventBus.emit('collection:nodeAdded', { collectionId, nodeId });
            return true;
        }
        return false;
    }

    /**
     * 从合集移除节点
     */
    removeNodeFromCollection(collectionId, nodeId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (collection) {
            const index = collection.nodes.indexOf(nodeId);
            if (index !== -1) {
                collection.nodes.splice(index, 1);
                collection.updatedAt = Date.now();
                this.saveData();
                this.app.eventBus.emit('collection:nodeRemoved', { collectionId, nodeId });
                return true;
            }
        }
        return false;
    }

    /**
     * 获取合集
     */
    getCollection(collectionId) {
        return this.collections.find(c => c.id === collectionId);
    }

    /**
     * 获取所有合集
     */
    getCollections() {
        return this.collections;
    }

    /**
     * 获取合集中的节点
     */
    getCollectionNodes(collectionId) {
        const collection = this.getCollection(collectionId);
        if (!collection) return [];

        return collection.nodes
            .map(id => this.app.dataService?.getNode(id))
            .filter(Boolean);
    }

    /**
     * 生成合集封面
     */
    generateCollectionCover(collectionId) {
        const collection = this.getCollection(collectionId);
        if (!collection) return null;

        const nodes = this.getCollectionNodes(collectionId);
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');

        // 背景渐变
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, collection.color.value);
        gradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 图标
        ctx.font = '60px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(collection.icon.icon, canvas.width / 2, 100);

        // 标题
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#333';
        ctx.fillText(collection.name, canvas.width / 2, 160);

        // 节点数量
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#666';
        ctx.fillText(`${collection.nodes.length} 个项目`, canvas.width / 2, 190);

        // 描述
        if (collection.description) {
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#999';
            const words = collection.description.substring(0, 30);
            ctx.fillText(words + (collection.description.length > 30 ? '...' : ''), canvas.width / 2, 220);
        }

        return canvas.toDataURL('image/png');
    }

    /**
     * 显示收藏面板
     */
    showPanel() {
        if (this.isVisible) {
            this.hidePanel();
            return;
        }

        this.createPanel();
        this.isVisible = true;
    }

    /**
     * 隐藏收藏面板
     */
    hidePanel() {
        if (this.uiContainer) {
            this.uiContainer.remove();
            this.uiContainer = null;
        }
        this.isVisible = false;
    }

    /**
     * 创建面板
     */
    createPanel() {
        const container = document.createElement('div');
        container.className = 'collection-panel';
        container.style.cssText = `
            position: fixed;
            top: 0;
            right: -400px;
            width: 380px;
            height: 100vh;
            background: white;
            box-shadow: -2px 0 20px rgba(0,0,0,0.1);
            z-index: 1500;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        `;

        // 头部
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('h2');
        title.textContent = '我的收藏';
        title.style.cssText = 'margin: 0; font-size: 18px;';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
        `;
        closeBtn.addEventListener('click', () => this.hidePanel());

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 标签页
        const tabs = document.createElement('div');
        tabs.style.cssText = `
            display: flex;
            border-bottom: 1px solid #eee;
        `;

        const favoritesTab = document.createElement('button');
        favoritesTab.textContent = `收藏 (${this.favorites.size})`;
        favoritesTab.style.cssText = `
            flex: 1;
            padding: 15px;
            background: white;
            border: none;
            border-bottom: 2px solid #667eea;
            cursor: pointer;
            font-size: 14px;
            color: #667eea;
        `;

        const collectionsTab = document.createElement('button');
        collectionsTab.textContent = `合集 (${this.collections.length})`;
        collectionsTab.style.cssText = `
            flex: 1;
            padding: 15px;
            background: white;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            font-size: 14px;
            color: #999;
        `;

        tabs.appendChild(favoritesTab);
        tabs.appendChild(collectionsTab);

        // 内容区
        const content = document.createElement('div');
        content.className = 'collection-content';
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        `;

        // 底部操作区
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 15px 20px;
            border-top: 1px solid #eee;
        `;

        const createCollectionBtn = document.createElement('button');
        createCollectionBtn.textContent = '+ 新建合集';
        createCollectionBtn.style.cssText = `
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
        `;
        createCollectionBtn.addEventListener('click', () => this.showCreateCollectionModal());

        footer.appendChild(createCollectionBtn);

        container.appendChild(header);
        container.appendChild(tabs);
        container.appendChild(content);
        container.appendChild(footer);

        document.body.appendChild(container);

        // 动画显示
        setTimeout(() => {
            container.style.right = '0';
        }, 10);

        this.uiContainer = container;
        this.contentArea = content;

        // 切换标签
        const switchTab = (tab) => {
            if (tab === 'favorites') {
                favoritesTab.style.borderBottomColor = '#667eea';
                favoritesTab.style.color = '#667eea';
                collectionsTab.style.borderBottomColor = 'transparent';
                collectionsTab.style.color = '#999';
                this.currentView = 'favorites';
                this.renderFavorites();
            } else {
                collectionsTab.style.borderBottomColor = '#667eea';
                collectionsTab.style.color = '#667eea';
                favoritesTab.style.borderBottomColor = 'transparent';
                favoritesTab.style.color = '#999';
                this.currentView = 'collections';
                this.renderCollections();
            }
        };

        favoritesTab.addEventListener('click', () => switchTab('favorites'));
        collectionsTab.addEventListener('click', () => switchTab('collections'));

        // 默认显示收藏
        this.renderFavorites();
    }

    /**
     * 渲染收藏列表
     */
    renderFavorites() {
        if (!this.contentArea) return;

        const favorites = this.getFavorites();

        if (favorites.length === 0) {
            this.contentArea.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 60px 20px;
                    color: #999;
                ">
                    <div style="font-size: 48px; margin-bottom: 15px;">🤍</div>
                    <div>还没有收藏任何内容</div>
                    <div style="font-size: 12px; margin-top: 10px;">点击节点卡片上的心形图标即可收藏</div>
                </div>
            `;
            return;
        }

        this.contentArea.innerHTML = favorites.map(node => `
            <div class="favorite-item" data-node-id="${node.id}" style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: #f8f9ff;
                border-radius: 8px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: background 0.2s;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${this.getCategoryColor(node)};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                ">${node.name.charAt(0)}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 500; color: #333; margin-bottom: 2px;">${node.name}</div>
                    <div style="font-size: 11px; color: #999;">${node.time?.displayDate || '时间不详'}</div>
                </div>
                <button class="remove-favorite" data-node-id="${node.id}" style="
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    padding: 5px;
                    font-size: 16px;
                ">✕</button>
            </div>
        `).join('');

        // 添加事件
        this.contentArea.querySelectorAll('.favorite-item').forEach(item => {
            item.addEventListener('mouseenter', () => item.style.background = '#f0f0ff');
            item.addEventListener('mouseleave', () => item.style.background = '#f8f9ff');

            const nodeId = item.dataset.nodeId;

            // 点击查看详情
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-favorite')) {
                    this.app?.showView('tree3d', { nodeId });
                }
            });

            // 移除收藏
            item.querySelector('.remove-favorite').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(nodeId);
                this.renderFavorites();
                // 更新标签计数
                const tabs = this.uiContainer.querySelectorAll('.collection-panel > div:nth-child(2) button');
                tabs[0].textContent = `收藏 (${this.favorites.size})`;
            });
        });
    }

    /**
     * 渲染合集列表
     */
    renderCollections() {
        if (!this.contentArea) return;

        if (this.collections.length === 0) {
            this.contentArea.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 60px 20px;
                    color: #999;
                ">
                    <div style="font-size: 48px; margin-bottom: 15px;">📚</div>
                    <div>还没有创建任何合集</div>
                    <div style="font-size: 12px; margin-top: 10px;">点击下方按钮创建你的第一个合集</div>
                </div>
            `;
            return;
        }

        this.contentArea.innerHTML = this.collections.map(collection => `
            <div class="collection-item" data-collection-id="${collection.id}" style="
                background: white;
                border-radius: 12px;
                overflow: hidden;
                margin-bottom: 15px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                cursor: pointer;
            ">
                <div style="
                    height: 80px;
                    background: ${collection.color.gradient};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                ">
                    <div style="font-size: 36px;">${collection.icon.icon}</div>
                    <button class="collection-menu" data-collection-id="${collection.id}" style="
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: rgba(255,255,255,0.3);
                        border: none;
                        border-radius: 50%;
                        width: 28px;
                        height: 28px;
                        cursor: pointer;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">⋮</button>
                </div>
                <div style="padding: 15px;">
                    <div style="font-weight: 500; color: #333; margin-bottom: 5px;">${collection.name}</div>
                    <div style="font-size: 12px; color: #999;">
                        ${collection.nodes.length} 个项目
                        ${collection.description ? ' · ' + collection.description.substring(0, 30) + (collection.description.length > 30 ? '...' : '') : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // 添加事件
        this.contentArea.querySelectorAll('.collection-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('collection-menu')) {
                    const collectionId = item.dataset.collectionId;
                    this.showCollectionDetail(collectionId);
                }
            });

            // 菜单按钮
            const menuBtn = item.querySelector('.collection-menu');
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const collectionId = menuBtn.dataset.collectionId;
                this.showCollectionMenu(collectionId, menuBtn);
            });
        });
    }

    /**
     * 显示合集详情
     */
    showCollectionDetail(collectionId) {
        const collection = this.getCollection(collectionId);
        if (!collection) return;

        const nodes = this.getCollectionNodes(collectionId);

        const modal = document.createElement('div');
        modal.className = 'collection-detail-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 16px;
            width: 600px;
            max-width: 90vw;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // 头部
        const header = document.createElement('div');
        header.style.cssText = `
            height: 120px;
            background: ${collection.color.gradient};
            padding: 20px;
            color: white;
            position: relative;
        `;

        header.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 10px;">${collection.icon.icon}</div>
            <h2 style="margin: 0; font-size: 24px;">${collection.name}</h2>
            <div style="font-size: 14px; opacity: 0.9; margin-top: 5px;">${collection.nodes.length} 个项目</div>
            ${collection.description ? `<div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">${collection.description}</div>` : ''}

            <button id="closeDetail" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255,255,255,0.3);
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                font-size: 18px;
                color: white;
            ">✕</button>
        `;

        // 节点列表
        const nodesContainer = document.createElement('div');
        nodesContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        `;

        if (nodes.length === 0) {
            nodesContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    这个合集还没有添加任何项目
                </div>
            `;
        } else {
            nodesContainer.innerHTML = nodes.map(node => `
                <div class="collection-node-item" data-node-id="${node.id}" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                ">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: ${this.getCategoryColor(node)};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                    ">${node.name.charAt(0)}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #333;">${node.name}</div>
                        <div style="font-size: 11px; color: #999;">${node.time?.displayDate || '时间不详'}</div>
                    </div>
                </div>
            `).join('');

            // 添加点击事件
            nodesContainer.querySelectorAll('.collection-node-item').forEach(item => {
                item.addEventListener('mouseenter', () => item.style.background = '#f8f9ff');
                item.addEventListener('mouseleave', () => item.style.background = 'transparent');
                item.addEventListener('click', () => {
                    const nodeId = item.dataset.nodeId;
                    modal.remove();
                    this.app?.showView('tree3d', { nodeId });
                });
            });
        }

        // 底部
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 15px 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        `;

        footer.innerHTML = `
            <button id="addToCollection" style="
                flex: 1;
                padding: 12px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            ">添加项目</button>
            <button id="editCollection" style="
                flex: 1;
                padding: 12px;
                background: #f0f0f0;
                color: #666;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            ">编辑合集</button>
        `;

        content.appendChild(header);
        content.appendChild(nodesContainer);
        content.appendChild(footer);
        modal.appendChild(content);

        document.body.appendChild(modal);

        // 事件绑定
        document.getElementById('closeDetail').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.getElementById('addToCollection')?.addEventListener('click', () => {
            this.showAddNodeModal(collectionId);
        });

        document.getElementById('editCollection')?.addEventListener('click', () => {
            modal.remove();
            this.showEditCollectionModal(collectionId);
        });
    }

    /**
     * 显示创建合集模态框
     */
    showCreateCollectionModal() {
        this.showCollectionEditModal(null);
    }

    /**
     * 显示编辑合集模态框
     */
    showEditCollectionModal(collectionId) {
        const collection = this.getCollection(collectionId);
        this.showCollectionEditModal(collection);
    }

    /**
     * 显示合集编辑模态框
     */
    showCollectionEditModal(collection) {
        const isEdit = collection !== null;

        const modal = document.createElement('div');
        modal.className = 'collection-edit-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2500;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 16px;
            width: 450px;
            max-width: 90vw;
            padding: 25px;
        `;

        content.innerHTML = `
            <h2 style="margin: 0 0 20px 0;">${isEdit ? '编辑合集' : '创建合集'}</h2>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333;">合集名称</label>
                <input type="text" id="collectionName" value="${collection?.name || ''}" placeholder="输入合集名称..." style="
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                    box-sizing: border-box;
                " />
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333;">描述（可选）</label>
                <textarea id="collectionDesc" placeholder="添加合集描述..." style="
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                    resize: vertical;
                    min-height: 60px;
                    box-sizing: border-box;
                ">${collection?.description || ''}</textarea>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333;">选择颜色</label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${this.colors.map((c, i) => `
                        <button class="color-option" data-color="${i}" style="
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            border: 2px solid ${collection?.color.value === c.value ? '#333' : 'transparent'};
                            background: ${c.gradient};
                            cursor: pointer;
                            transition: transform 0.2s;
                        "></button>
                    `).join('')}
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333;">选择图标</label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${this.icons.map(icon => `
                        <button class="icon-option" data-icon="${icon.id}" style="
                            width: 44px;
                            height: 44px;
                            border: 2px solid ${collection?.icon.id === icon.id ? '#333' : '#ddd'};
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            font-size: 20px;
                            transition: all 0.2s;
                        ">${icon.icon}</button>
                    `).join('')}
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="saveCollection" style="
                    flex: 1;
                    padding: 12px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                ">${isEdit ? '保存修改' : '创建合集'}</button>
                <button id="cancelCollection" style="
                    flex: 1;
                    padding: 12px;
                    background: #f0f0f0;
                    color: #666;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                ">取消</button>
            </div>

            ${isEdit ? `
                <button id="deleteCollection" style="
                    width: 100%;
                    margin-top: 15px;
                    padding: 12px;
                    background: #fff;
                    color: #f44336;
                    border: 1px solid #f44336;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                ">删除合集</button>
            ` : ''}
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 状态
        let selectedColor = collection ? this.colors.findIndex(c => c.value === collection.color.value) : 0;
        let selectedIcon = collection ? this.icons.findIndex(i => i.id === collection.icon.id) : 0;

        // 更新颜色选择
        modal.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.color-option').forEach(b => b.style.borderColor = 'transparent');
                btn.style.borderColor = '#333';
                selectedColor = parseInt(btn.dataset.color);
            });
        });

        // 更新图标选择
        modal.querySelectorAll('.icon-option').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.icon-option').forEach(b => {
                    b.style.borderColor = '#ddd';
                });
                btn.style.borderColor = '#333';
                selectedIcon = parseInt(btn.dataset.icon);
            });
        });

        // 保存
        document.getElementById('saveCollection').addEventListener('click', () => {
            const name = document.getElementById('collectionName').value.trim();
            const description = document.getElementById('collectionDesc').value.trim();

            if (!name) {
                alert('请输入合集名称');
                return;
            }

            const data = {
                name,
                description,
                color: this.colors[selectedColor],
                icon: this.icons[selectedIcon]
            };

            if (isEdit) {
                this.updateCollection(collection.id, data);
            } else {
                this.createCollection(data);
            }

            modal.remove();
            this.renderCollections();

            // 更新标签计数
            const tabs = this.uiContainer.querySelectorAll('.collection-panel > div:nth-child(2) button');
            tabs[1].textContent = `合集 (${this.collections.length})`;
        });

        // 取消
        document.getElementById('cancelCollection').addEventListener('click', () => modal.remove());

        // 删除
        document.getElementById('deleteCollection')?.addEventListener('click', () => {
            if (confirm('确定要删除这个合集吗？')) {
                this.deleteCollection(collection.id);
                modal.remove();
                this.renderCollections();

                // 更新标签计数
                const tabs = this.uiContainer.querySelectorAll('.collection-panel > div:nth-child(2) button');
                tabs[1].textContent = `合集 (${this.collections.length})`;
            }
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * 显示添加节点模态框
     */
    showAddNodeModal(collectionId) {
        const modal = document.createElement('div');
        modal.className = 'add-node-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2500;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 16px;
            width: 500px;
            max-width: 90vw;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
        `;

        content.innerHTML = `
            <div style="
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h2 style="margin: 0;">添加项目到合集</h2>
                <button id="closeAddModal" style="
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                ">✕</button>
            </div>

            <div style="padding: 15px;">
                <input type="text" id="nodeSearchInput" placeholder="搜索历史节点..." style="
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                    box-sizing: border-box;
                " />
            </div>

            <div id="nodeSearchResults" style="
                flex: 1;
                overflow-y: auto;
                padding: 0 15px 15px;
            "></div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 搜索功能
        const searchInput = document.getElementById('nodeSearchInput');
        const resultsDiv = document.getElementById('nodeSearchResults');

        const searchNodes = (query) => {
            if (!query.trim()) {
                resultsDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">请输入搜索关键词</div>';
                return;
            }

            const nodes = Array.from(this.app.dataService?.nodes.values() || [])
                .filter(n => n.name?.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 20);

            if (nodes.length === 0) {
                resultsDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">未找到匹配结果</div>';
                return;
            }

            resultsDiv.innerHTML = nodes.map(node => {
                const isAdded = this.getCollection(collectionId)?.nodes.includes(node.id);
                return `
                    <div class="node-search-result" data-node-id="${node.id}" style="
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px;
                        border-radius: 8px;
                        margin-bottom: 8px;
                        cursor: pointer;
                        background: ${isAdded ? '#f0f0f0' : '#f8f9ff'};
                        opacity: ${isAdded ? 0.6 : 1};
                    ">
                        <div style="
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            background: ${this.getCategoryColor(node)};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                        ">${node.name.charAt(0)}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 500; color: #333;">${node.name}</div>
                            <div style="font-size: 11px; color: #999;">${node.time?.displayDate || '时间不详'}</div>
                        </div>
                        ${isAdded ? '<span style="color: #4caf50; font-size: 12px;">✓ 已添加</span' : ''}
                    </div>
                `;
            }).join('');

            // 添加点击事件
            resultsDiv.querySelectorAll('.node-search-result').forEach(item => {
                item.addEventListener('click', () => {
                    const nodeId = item.dataset.nodeId;
                    if (this.addNodeToCollection(collectionId, nodeId)) {
                        searchNodes(searchInput.value);
                    }
                });
            });
        };

        searchInput.addEventListener('input', (e) => searchNodes(e.target.value));
        searchNodes('');

        // 关闭
        document.getElementById('closeAddModal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * 显示合集菜单
     */
    showCollectionMenu(collectionId, button) {
        const menu = document.createElement('div');
        menu.className = 'collection-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.15);
            z-index: 3000;
            min-width: 150px;
            overflow: hidden;
        `;

        const rect = button.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = (rect.bottom + 5) + 'px';

        menu.innerHTML = `
            <button class="menu-item" data-action="view" style="
                width: 100%;
                padding: 12px 16px;
                background: white;
                border: none;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
            ">查看详情</button>
            <button class="menu-item" data-action="edit" style="
                width: 100%;
                padding: 12px 16px;
                background: white;
                border: none;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
            ">编辑</button>
            <button class="menu-item" data-action="delete" style="
                width: 100%;
                padding: 12px 16px;
                background: white;
                border: none;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
                color: #f44336;
            ">删除</button>
        `;

        document.body.appendChild(menu);

        // 事件
        menu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('mouseenter', () => item.style.background = '#f5f5f5');
            item.addEventListener('mouseleave', () => item.style.background = 'white');
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                menu.remove();

                switch (action) {
                    case 'view':
                        this.showCollectionDetail(collectionId);
                        break;
                    case 'edit':
                        this.showEditCollectionModal(collectionId);
                        break;
                    case 'delete':
                        if (confirm('确定要删除这个合集吗？')) {
                            this.deleteCollection(collectionId);
                            this.renderCollections();
                        }
                        break;
                }
            });
        });

        // 点击外部关闭
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 0);
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 全局快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.showPanel();
            }
        });
    }

    /**
     * 辅助方法：获取分类颜色
     */
    getCategoryColor(node) {
        const colors = {
            politics: '#ff6b6b',
            technology: '#4ecdc4',
            culture: '#a855f7',
            economy: '#22c55e',
            military: '#f97316',
            default: '#999'
        };
        return colors[node.category?.primary] || colors.default;
    }

    /**
     * 销毁
     */
    destroy() {
        this.hidePanel();
        this.favorites.clear();
        this.collections = [];
    }
}

window.CollectionPlugin = CollectionPlugin;
