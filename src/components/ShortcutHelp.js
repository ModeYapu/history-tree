/**
 * 快捷键帮助面板组件
 * 显示所有可用的键盘快捷键
 */

class ShortcutHelp {
    constructor() {
        this.container = null;
        this.isVisible = false;
        this.shortcuts = this.getShortcuts();
    }

    /**
     * 获取快捷键列表
     */
    getShortcuts() {
        return {
            '视图切换': [
                { key: 'Ctrl + 1', desc: '树形视图' },
                { key: 'Ctrl + 2', desc: '时间轴视图' },
                { key: 'Ctrl + 3', desc: '地图视图' },
                { key: 'Ctrl + 4', desc: '网络视图' },
                { key: 'Ctrl + 5', desc: '卡片视图' },
                { key: 'Ctrl + 6', desc: '历史问答' },
                { key: 'Ctrl + 7', desc: '对比视图' },
                { key: 'Ctrl + 8', desc: '故事生成器' }
            ],
            '搜索导航': [
                { key: 'Ctrl + K', desc: '聚焦搜索框' },
                { key: 'Esc', desc: '关闭面板/清除搜索' },
                { key: '↑ / ↓', desc: '选择结果' },
                { key: 'Enter', desc: '确认选择' }
            ],
            '功能操作': [
                { key: 'Ctrl + E', desc: '导出数据' },
                { key: 'Ctrl + Q', desc: '历史问答' },
                { key: 'Ctrl + Shift + C', desc: '收藏面板' },
                { key: '?', desc: '显示此帮助' }
            ]
        };
    }

    /**
     * 创建面板
     */
    create() {
        this.container = document.createElement('div');
        this.container.className = 'shortcut-help-overlay';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const panel = document.createElement('div');
        panel.className = 'shortcut-help-panel';
        panel.style.cssText = `
            background: linear-gradient(145deg, rgba(42, 33, 24, 0.98), rgba(26, 20, 16, 0.98));
            border: 1px solid rgba(212, 168, 83, 0.3);
            border-radius: 16px;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        // 头部
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(212, 168, 83, 0.15);
        `;

        const title = document.createElement('h2');
        title.textContent = '⌨️ 快捷键';
        title.style.cssText = `
            font-size: 20px;
            color: #F0D68A;
            margin: 0;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #C9A96E;
            font-size: 24px;
            cursor: pointer;
            padding: 4px 8px;
            transition: color 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.color = '#F0D68A';
        closeBtn.onmouseout = () => closeBtn.style.color = '#C9A96E';
        closeBtn.onclick = () => this.hide();

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 内容
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 20px 24px;
            overflow-y: auto;
            max-height: calc(80vh - 80px);
        `;

        Object.entries(this.shortcuts).forEach(([category, items]) => {
            const section = document.createElement('div');
            section.style.cssText = `
                margin-bottom: 24px;
            `;

            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = category;
            sectionTitle.style.cssText = `
                font-size: 14px;
                color: #C9A96E;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
            `;

            const grid = document.createElement('div');
            grid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px 20px;
            `;

            items.forEach(item => {
                const row = document.createElement('div');
                row.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 12px;
                    background: rgba(212, 168, 83, 0.05);
                    border-radius: 8px;
                    transition: background 0.2s;
                `;
                row.onmouseover = () => row.style.background = 'rgba(212, 168, 83, 0.1)';
                row.onmouseout = () => row.style.background = 'rgba(212, 168, 83, 0.05)';

                const key = document.createElement('code');
                key.textContent = item.key;
                key.style.cssText = `
                    background: rgba(212, 168, 83, 0.15);
                    color: #F0D68A;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-family: 'Consolas', monospace;
                    border: 1px solid rgba(212, 168, 83, 0.2);
                `;

                const desc = document.createElement('span');
                desc.textContent = item.desc;
                desc.style.cssText = `
                    color: #FFF5E0;
                    font-size: 14px;
                `;

                row.appendChild(key);
                row.appendChild(desc);
                grid.appendChild(row);
            });

            section.appendChild(sectionTitle);
            section.appendChild(grid);
            content.appendChild(section);
        });

        // 底部提示
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 16px 24px;
            border-top: 1px solid rgba(212, 168, 83, 0.15);
            text-align: center;
            color: #A8916B;
            font-size: 13px;
        `;
        footer.textContent = '按 ? 或 Esc 关闭此面板';

        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(footer);
        this.container.appendChild(panel);

        // 点击遮罩关闭
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });

        document.body.appendChild(this.container);
    }

    /**
     * 显示面板
     */
    show() {
        if (!this.container) {
            this.create();
        }

        this.container.style.display = 'flex';
        setTimeout(() => {
            this.container.style.opacity = '1';
            this.container.querySelector('.shortcut-help-panel').style.transform = 'scale(1)';
        }, 10);
        this.isVisible = true;
    }

    /**
     * 隐藏面板
     */
    hide() {
        if (!this.container) return;

        this.container.style.opacity = '0';
        this.container.querySelector('.shortcut-help-panel').style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (this.container) {
                this.container.style.display = 'none';
            }
        }, 300);
        this.isVisible = false;
    }

    /**
     * 切换显示
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * 添加快捷键按钮到界面
     */
    addShortcutButton() {
        const btn = document.createElement('button');
        btn.className = 'shortcut-help-btn';
        btn.innerHTML = '⌨️';
        btn.title = '快捷键 (按 ?)';
        btn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(145deg, rgba(212, 168, 83, 0.2), rgba(184, 134, 11, 0.15));
            backdrop-filter: blur(10px);
            border: 1px solid rgba(212, 168, 83, 0.3);
            color: #F0D68A;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(212, 168, 83, 0.15);
            z-index: 999;
            transition: all 0.3s;
        `;

        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 6px 30px rgba(212, 168, 83, 0.25)';
        });

        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 20px rgba(212, 168, 83, 0.15)';
        });

        btn.addEventListener('click', () => this.show());

        document.body.appendChild(btn);
    }

    /**
     * 绑定全局快捷键
     */
    bindGlobalShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ? 键显示帮助
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                // 确保不是在输入框中
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.show();
                }
            }
            // Esc 关闭帮助
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    /**
     * 初始化
     */
    init() {
        this.addShortcutButton();
        this.bindGlobalShortcuts();
    }
}

// 导出到全局
window.ShortcutHelp = ShortcutHelp;
