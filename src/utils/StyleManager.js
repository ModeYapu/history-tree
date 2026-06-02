/**
 * 样式管理器 - 统一样式管理，减少代码重复
 * 提供常用样式预设和安全的样式应用方法
 */

class StyleManager {
    // 预定义样式
    static styles = {
        // 面板样式
        panel: {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '400px',
            background: 'linear-gradient(165deg, rgba(42, 33, 24, 0.98), rgba(26, 20, 16, 0.99))',
            backdropFilter: 'blur(20px) saturate(1.5)',
            borderRadius: '16px',
            border: '1px solid rgba(212, 168, 83, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(212, 168, 83, 0.05)'
        },

        // 按钮样式
        button: {
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '14px',
            fontWeight: '500'
        },

        primaryButton: {
            background: 'linear-gradient(135deg, #D4A853, #B8860B)',
            color: '#1a1410',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s'
        },

        secondaryButton: {
            background: 'rgba(212, 168, 83, 0.1)',
            border: '1px solid rgba(212, 168, 83, 0.2)',
            color: '#C9A96E',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s'
        },

        // 输入框样式
        input: {
            padding: '11px 16px',
            background: 'rgba(212, 168, 83, 0.06)',
            border: '1px solid rgba(212, 168, 83, 0.15)',
            borderRadius: '22px',
            color: '#F5E6C8',
            fontSize: '13px',
            fontFamily: "'Noto Serif SC', serif",
            outline: 'none',
            transition: 'border-color 0.3s'
        },

        // 容器样式
        flexContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },

        // 文本样式
        title: {
            fontSize: '17px',
            fontWeight: 'bold',
            color: '#F0D68A',
            margin: '0',
            letterSpacing: '1px'
        },

        subtitle: {
            fontSize: '12px',
            color: '#8B7355',
            margin: '4px 0 0 0'
        },

        bodyText: {
            fontSize: '13px',
            color: '#C9A96E',
            lineHeight: '1.8'
        },

        // 卡片样式
        card: {
            background: 'rgba(212, 168, 83, 0.08)',
            border: '1px solid rgba(212, 168, 83, 0.12)',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '12px'
        },

        // 消息样式
        userMessage: {
            background: 'linear-gradient(135deg, rgba(212, 168, 83, 0.2), rgba(184, 134, 11, 0.15))',
            border: '1px solid rgba(212, 168, 83, 0.25)',
            color: '#F5E6C8',
            padding: '11px 16px',
            borderRadius: '12px',
            marginBottom: '10px',
            marginLeft: '30px',
            fontSize: '13px',
            lineHeight: '1.7'
        },

        aiMessage: {
            background: 'rgba(212, 168, 83, 0.06)',
            border: '1px solid rgba(212, 168, 83, 0.1)',
            color: '#C9A96E',
            padding: '11px 16px',
            borderRadius: '12px',
            marginBottom: '10px',
            marginRight: '20px',
            fontSize: '13px',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap'
        },

        // 浮动按钮样式
        floatingButton: {
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, rgba(212, 168, 83, 0.2), rgba(184, 134, 11, 0.15))',
            backdropFilter: 'blur(10px)',
            color: '#F0D68A',
            border: '1px solid rgba(212, 168, 83, 0.3)',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(212, 168, 83, 0.15)',
            transition: 'all 0.3s'
        },

        // 头部样式
        header: {
            background: 'linear-gradient(135deg, rgba(212, 168, 83, 0.15), rgba(184, 134, 11, 0.1))',
            color: '#F0D68A',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(212, 168, 83, 0.15)'
        },

        // 滚动容器样式
        scrollContainer: {
            flex: '1',
            overflowY: 'auto',
            padding: '16px',
            background: 'transparent'
        }
    };

    // 颜色常量
    static colors = {
        primary: '#D4A853',
        secondary: '#B8860B',
        background: '#2a2119',
        text: '#F5E6C8',
        textSecondary: '#C9A96E',
        textMuted: '#8B7355',
        border: 'rgba(212, 168, 83, 0.2)',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };

    // 字体常量
    static fonts = {
        primary: "'Noto Serif SC', 'SimSun', serif",
        mono: "'Courier New', monospace",
        sans: "'Arial', sans-serif"
    };

    // 间距常量
    static spacing = {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
    };

    /**
     * 应用样式到元素
     *
     * @param {HTMLElement} element - 目标元素
     * @param {Object} styles - 样式对象
     */
    static applyStyles(element, styles) {
        if (!element || !styles) return;

        Object.entries(styles).forEach(([property, value]) => {
            // 转换驼峰命名到CSS属性名
            const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
            element.style[cssProperty] = value;
        });
    }

    /**
     * 创建带样式的元素
     *
     * @param {string} tagName - 标签名
     * @param {string|Object} styleName - 样式名称或样式对象
     * @param {string} content - 内容
     * @param {Object} attributes - 属性对象
     * @returns {HTMLElement} - 创建的元素
     */
    static createStyledElement(tagName, styleName, content = '', attributes = {}) {
        const element = document.createElement(tagName);

        // 应用样式
        if (typeof styleName === 'string') {
            const styles = this.styles[styleName];
            if (styles) {
                this.applyStyles(element, styles);
            }
        } else if (typeof styleName === 'object') {
            this.applyStyles(element, styleName);
        }

        // 设置属性
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                // 使用安全的方式设置innerHTML
                if (window.SecurityUtils) {
                    SecurityUtils.setSafeContent(element, value, false);
                } else {
                    element.textContent = value;
                }
            } else {
                element.setAttribute(key, value);
            }
        });

        // 设置内容
        if (content && !attributes.textContent) {
            element.textContent = content;
        }

        return element;
    }

    /**
     * 创建带样式的按钮
     *
     * @param {string} text - 按钮文本
     * @param {string} styleName - 样式名称
     * @param {Function} onClick - 点击事件处理函数
     * @returns {HTMLButtonElement} - 创建的按钮
     */
    static createButton(text, styleName = 'button', onClick = null) {
        const button = this.createStyledElement('button', styleName, text);
        button.type = 'button';

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    /**
     * 创建带样式的输入框
     *
     * @param {string} placeholder - 占位符文本
     * @param {string} type - 输入框类型
     * @returns {HTMLInputElement} - 创建的输入框
     */
    static createInput(placeholder = '', type = 'text') {
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        this.applyStyles(input, this.styles.input);

        // 添加焦点效果
        input.addEventListener('focus', () => {
            input.style.borderColor = 'rgba(212, 168, 83, 0.4)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(212, 168, 83, 0.15)';
        });

        return input;
    }

    /**
     * 创建带样式的卡片
     *
     * @param {string} title - 卡片标题
     * @param {string} content - 卡片内容
     * @returns {HTMLElement} - 创建的卡片
     */
    static createCard(title, content) {
        const card = this.createStyledElement('div', 'card');

        if (title) {
            const titleEl = this.createStyledElement('h3', 'title', title);
            titleEl.style.marginBottom = '8px';
            card.appendChild(titleEl);
        }

        if (content) {
            const contentEl = this.createStyledElement('p', 'bodyText', content);
            card.appendChild(contentEl);
        }

        return card;
    }

    /**
     * 创建带样式的消息气泡
     *
     * @param {string} text - 消息文本
     * @param {string} type - 消息类型 ('user' 或 'ai')
     * @returns {HTMLElement} - 创建的消息元素
     */
    static createMessage(text, type = 'ai') {
        const styleName = type === 'user' ? 'userMessage' : 'aiMessage';
        return this.createStyledElement('div', styleName, text);
    }

    /**
     * 添加悬停效果
     *
     * @param {HTMLElement} element - 目标元素
     * @param {Object} hoverStyles - 悬停时的样式
     * @param {Object} normalStyles - 正常时的样式
     */
    static addHoverEffect(element, hoverStyles, normalStyles = {}) {
        element.addEventListener('mouseenter', () => {
            this.applyStyles(element, hoverStyles);
        });

        element.addEventListener('mouseleave', () => {
            this.applyStyles(element, normalStyles);
        });
    }

    /**
     * 添加动画效果
     *
     * @param {HTMLElement} element - 目标元素
     * @param {string} animationName - 动画名称
     * @param {number} duration - 持续时间（毫秒）
     */
    static addAnimation(element, animationName, duration = 300) {
        element.style.animation = `${animationName} ${duration}ms ease-out`;
    }

    /**
     * 创建响应式样式
     *
     * @param {Object} breakpoints - 断点配置
     * @returns {Object} - 媒体查询对象
     */
    static createResponsive(breakpoints) {
        const mediaQueries = {};

        Object.entries(breakpoints).forEach(([breakpoint, styles]) => {
            const query = window.matchMedia(breakpoint);
            mediaQueries[breakpoint] = {
                query,
                styles,
                matches: query.matches
            };
        });

        return mediaQueries;
    }

    /**
     * 深度合并样式
     *
     * @param {Object} target - 目标样式对象
     * @param {Object} source - 源样式对象
     * @returns {Object} - 合并后的样式对象
     */
    static mergeStyles(target, source) {
        return { ...target, ...source };
    }

    /**
     * 创建渐变背景
     *
     * @param {Array<string>} colors - 颜色数组
     * @param {string} direction - 渐变方向
     * @returns {string} - CSS渐变字符串
     */
    static createGradient(colors, direction = '135deg') {
        return `linear-gradient(${direction}, ${colors.join(', ')})`;
    }

    /**
     * 添加盒子阴影
     *
     * @param {HTMLElement} element - 目标元素
     * @param {string} shadow - 阴影样式
     */
    static addShadow(element, shadow = '0 4px 20px rgba(212, 168, 83, 0.15)') {
        element.style.boxShadow = shadow;
    }

    /**
     * 设置圆角
     *
     * @param {HTMLElement} element - 目标元素
     * @param {string|number} radius - 圆角大小
     */
    static setBorderRadius(element, radius = '8px') {
        element.style.borderRadius = typeof radius === 'number' ? `${radius}px` : radius;
    }

    /**
     * 添加过渡效果
     *
     * @param {HTMLElement} element - 目标元素
     * @param {string} properties - CSS属性
     * @param {number} duration - 持续时间（毫秒）
     * @param {string} timing - 时间函数
     */
    static addTransition(element, properties = 'all', duration = 300, timing = 'ease') {
        element.style.transition = `${properties} ${duration}ms ${timing}`;
    }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleManager;
} else {
    window.StyleManager = StyleManager;
}