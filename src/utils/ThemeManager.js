/**
 * 主题管理器
 * 支持深色/浅色主题切换，带持久化存储
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = {
            dark: {
                name: '深色',
                icon: '🌙',
                colors: {
                    '--bg-primary': '#1a1410',
                    '--bg-secondary': '#2a2118',
                    '--bg-card': 'rgba(42, 33, 24, 0.92)',
                    '--bg-glass': 'rgba(42, 33, 24, 0.75)',
                    '--gold-primary': '#D4A853',
                    '--gold-light': '#F0D68A',
                    '--gold-dark': '#B8860B',
                    '--brown-primary': '#8B6914',
                    '--brown-light': '#C9A96E',
                    '--brown-dark': '#5D4037',
                    '--text-primary': '#FFF5E0',
                    '--text-secondary': '#F0D68A',
                    '--text-muted': '#C9A96E',
                    '--text-dim': '#A8916B',
                    '--red-accent': '#C0392B',
                    '--blue-accent': '#4A90B8',
                    '--purple-accent': '#8E6BA8',
                    '--green-accent': '#5A8F5A',
                    '--orange-accent': '#C97B2A',
                    '--border-subtle': 'rgba(212, 168, 83, 0.15)',
                    '--border-active': 'rgba(212, 168, 83, 0.4)',
                    '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
                    '--shadow-md': '0 4px 20px rgba(0, 0, 0, 0.4)',
                    '--shadow-lg': '0 8px 40px rgba(0, 0, 0, 0.5)',
                    '--shadow-gold': '0 0 20px rgba(212, 168, 83, 0.15)'
                }
            },
            light: {
                name: '浅色',
                icon: '☀️',
                colors: {
                    '--bg-primary': '#F5F1E8',
                    '--bg-secondary': '#FFFFFF',
                    '--bg-card': 'rgba(255, 255, 255, 0.95)',
                    '--bg-glass': 'rgba(255, 255, 255, 0.85)',
                    '--gold-primary': '#B8860B',
                    '--gold-light': '#D4A853',
                    '--gold-dark': '#8B6914',
                    '--brown-primary': '#8B6914',
                    '--brown-light': '#A8916B',
                    '--brown-dark': '#5D4037',
                    '--text-primary': '#2C2416',
                    '--text-secondary': '#5D4037',
                    '--text-muted': '#8B7355',
                    '--text-dim': '#A8916B',
                    '--red-accent': '#C0392B',
                    '--blue-accent': '#2980B9',
                    '--purple-accent': '#8E44AD',
                    '--green-accent': '#27AE60',
                    '--orange-accent': '#E67E22',
                    '--border-subtle': 'rgba(139, 105, 20, 0.15)',
                    '--border-active': 'rgba(139, 105, 20, 0.4)',
                    '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
                    '--shadow-md': '0 4px 20px rgba(0, 0, 0, 0.1)',
                    '--shadow-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
                    '--shadow-gold': '0 0 20px rgba(184, 134, 11, 0.15)'
                }
            }
        };

        this.listeners = new Set();
        this.init();
    }

    init() {
        // 从 localStorage 加载保存的主题
        const savedTheme = localStorage.getItem('history-tree-theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        } else {
            // 检测系统偏好
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                this.currentTheme = 'light';
            }
        }

        // 应用主题
        this.applyTheme(this.currentTheme);

        // 监听系统主题变化
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('history-tree-theme')) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(this.currentTheme);
                }
            });
        }
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // 更新背景渐变
        if (themeName === 'dark') {
            document.body.style.background = 'var(--bg-primary)';
            document.body.style.color = 'var(--text-primary)';
        } else {
            document.body.style.background = 'var(--bg-primary)';
            document.body.style.color = 'var(--text-primary)';
        }

        // 更新 meta theme-color
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = theme.colors['--bg-primary'];

        // 保存到 localStorage
        localStorage.setItem('history-tree-theme', themeName);

        // 通知监听器
        this.notifyListeners(themeName);
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(themeName) {
        if (this.themes[themeName] && themeName !== this.currentTheme) {
            this.currentTheme = themeName;
            this.applyTheme(themeName);
        }
    }

    getTheme() {
        return this.currentTheme;
    }

    getThemeInfo(themeName) {
        return this.themes[themeName] || this.themes[this.currentTheme];
    }

    getAllThemes() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            key,
            name: theme.name,
            icon: theme.icon
        }));
    }

    // 创建主题切换按钮
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle-btn';
        button.style.cssText = `
            padding: 8px 16px;
            background: rgba(212, 168, 83, 0.15);
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            color: var(--text-secondary);
            font-size: 14px;
            cursor: pointer;
            font-family: 'Noto Serif SC', serif;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
        `;

        this.updateButton(button);

        button.addEventListener('click', () => {
            this.toggle();
            this.updateButton(button);
        });

        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(212, 168, 83, 0.3)';
            button.style.borderColor = 'var(--border-active)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '';
            button.style.borderColor = '';
        });

        return button;
    }

    updateButton(button) {
        const theme = this.themes[this.currentTheme];
        button.innerHTML = `<span style="font-size: 16px;">${theme.icon}</span> ${theme.name}`;
    }

    // 创建主题选择器面板
    createThemeSelector() {
        const panel = document.createElement('div');
        panel.className = 'theme-selector-panel';
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 16px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            display: none;
        `;

        const title = document.createElement('div');
        title.className = 'theme-selector-title';
        title.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            color: var(--gold-primary);
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border-subtle);
        `;
        title.textContent = '🎨 主题选择';

        panel.appendChild(title);

        Object.entries(this.themes).forEach(([key, theme]) => {
            const themeOption = document.createElement('button');
            themeOption.className = 'theme-option';
            themeOption.style.cssText = `
                width: 100%;
                padding: 10px 12px;
                margin: 4px 0;
                background: ${this.currentTheme === key ? 'rgba(212, 168, 83, 0.25)' : 'rgba(212, 168, 83, 0.08)'};
                border: 1px solid ${this.currentTheme === key ? 'var(--border-active)' : 'var(--border-subtle)'};
                border-radius: 8px;
                color: var(--text-secondary);
                font-size: 13px;
                cursor: pointer;
                font-family: 'Noto Serif SC', serif;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.2s ease;
            `;

            const icon = document.createElement('span');
            icon.style.cssText = 'font-size: 18px;';
            icon.textContent = theme.icon;

            const name = document.createElement('span');
            name.textContent = theme.name;

            themeOption.appendChild(icon);
            themeOption.appendChild(name);

            themeOption.addEventListener('click', () => {
                this.setTheme(key);
                // 更新UI
                panel.querySelectorAll('.theme-option').forEach(opt => {
                    opt.style.background = 'rgba(212, 168, 83, 0.08)';
                    opt.style.borderColor = 'var(--border-subtle)';
                });
                themeOption.style.background = 'rgba(212, 168, 83, 0.25)';
                themeOption.style.borderColor = 'var(--border-active)';
            });

            panel.appendChild(themeOption);
        });

        return panel;
    }

    // 监听器管理
    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners(themeName) {
        this.listeners.forEach(callback => {
            try {
                callback(themeName, this.themes[themeName]);
            } catch (error) {
                console.error('Theme listener error:', error);
            }
        });
    }

    destroy() {
        this.listeners.clear();
    }
}

// 创建全局实例
const themeManager = new ThemeManager();

// 导出到全局
window.ThemeManager = ThemeManager;
window.themeManager = themeManager;
