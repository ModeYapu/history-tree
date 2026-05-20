/**
 * 安全工具类 - 防止XSS攻击和其他安全漏洞
 * 提供安全的DOM操作方法
 */

class SecurityUtils {
    /**
     * 安全地设置元素的HTML内容
     * 如果需要HTML，使用白名单过滤；否则使用textContent
     *
     * @param {HTMLElement} element - 目标元素
     * @param {string} content - 要设置的内容
     * @param {boolean} allowHTML - 是否允许HTML标签（默认false）
     */
    static setSafeContent(element, content, allowHTML = false) {
        if (!element || !content) return;

        if (allowHTML) {
            // 只允许安全的HTML标签和属性
            element.innerHTML = this.sanitizeHTML(content);
        } else {
            // 完全避免HTML，使用纯文本
            element.textContent = content;
        }
    }

    /**
     * 清理HTML内容，移除潜在的危险标签和属性
     *
     * @param {string} html - 原始HTML
     * @returns {string} - 清理后的安全HTML
     */
    static sanitizeHTML(html) {
        if (!html) return '';

        // 创建临时div来解析HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 移除危险的标签和属性
        this.cleanElement(tempDiv);

        return tempDiv.innerHTML;
    }

    /**
     * 递归清理元素和其子元素
     *
     * @param {HTMLElement} element - 要清理的元素
     */
    static cleanElement(element) {
        // 移除script标签和事件处理程序
        const dangerousTags = ['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'FORM'];
        const dangerousAttrs = [
            'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
            'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
            'javascript:', 'data:', 'vbscript:'
        ];

        // 移除危险标签
        const elements = element.querySelectorAll('*');
        elements.forEach(el => {
            // 检查是否是危险标签
            if (dangerousTags.includes(el.tagName)) {
                el.remove();
                return;
            }

            // 检查和移除危险属性
            Array.from(el.attributes).forEach(attr => {
                const attrName = attr.name.toLowerCase();
                const attrValue = attr.value.toLowerCase();

                // 移除事件处理程序
                if (attrName.startsWith('on')) {
                    el.removeAttribute(attr.name);
                    return;
                }

                // 移除包含javascript:等危险协议的属性
                if (dangerousAttrs.some(dangerous =>
                    attrValue.includes(dangerous))) {
                    el.removeAttribute(attr.name);
                }
            });
        });
    }

    /**
     * 安全地创建带样式的元素
     *
     * @param {string} tagName - 标签名
     * @param {Object} styles - 样式对象
     * @param {string} content - 内容
     * @param {Object} attributes - 属性对象
     * @returns {HTMLElement} - 创建的元素
     */
    static createStyledElement(tagName, styles = {}, content = '', attributes = {}) {
        const element = document.createElement(tagName);

        // 应用样式
        if (styles && typeof styles === 'object') {
            Object.assign(element.style, styles);
        }

        // 设置属性
        if (attributes && typeof attributes === 'object') {
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'textContent') {
                    element.textContent = value;
                } else if (key === 'innerHTML') {
                    // 使用安全的innerHTML设置
                    this.setSafeContent(element, value, true);
                } else {
                    element.setAttribute(key, value);
                }
            });
        }

        // 设置内容
        if (content && !attributes.textContent) {
            this.setSafeContent(element, content, false);
        }

        return element;
    }

    /**
     * 安全地转义HTML特殊字符
     *
     * @param {string} text - 原始文本
     * @returns {string} - 转义后的文本
     */
    static escapeHTML(text) {
        if (!text) return '';

        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 验证URL是否安全
     *
     * @param {string} url - 要验证的URL
     * @returns {boolean} - URL是否安全
     */
    static isSafeURL(url) {
        if (!url) return false;

        try {
            const parsed = new URL(url, window.location.origin);
            const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

            return safeProtocols.includes(parsed.protocol);
        } catch (e) {
            return false;
        }
    }

    /**
     * 安全地设置链接
     *
     * @param {HTMLAnchorElement} link - 链接元素
     * @param {string} url - URL地址
     */
    static setSafeLink(link, url) {
        if (this.isSafeURL(url)) {
            link.href = url;
            link.rel = 'noopener noreferrer'; // 安全最佳实践
        } else {
            console.warn('Unsafe URL detected:', url);
            link.href = '#';
            link.removeAttribute('href');
        }
    }

    /**
     * 清理用户输入，移除潜在的注入攻击
     *
     * @param {string} input - 用户输入
     * @returns {string} - 清理后的输入
     */
    static sanitizeUserInput(input) {
        if (!input || typeof input !== 'string') return '';

        // 移除控制字符
        let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

        // 转义HTML特殊字符
        cleaned = this.escapeHTML(cleaned);

        return cleaned.trim();
    }

    /**
     * 验证CSS值是否安全
     *
     * @param {string} cssValue - CSS值
     * @returns {boolean} - CSS值是否安全
     */
    static isSafeCSS(cssValue) {
        if (!cssValue) return true;

        // 检查危险的CSS关键词
        const dangerousPatterns = [
            /javascript:/i,
            /expression:/i,
            /behavior:/i,
            /binding:/i,
            /@import/i,
            /<[^>]*>/g  // HTML标签
        ];

        return !dangerousPatterns.some(pattern => pattern.test(cssValue));
    }

    /**
     * 安全地设置CSS样式
     *
     * @param {HTMLElement} element - 目标元素
     * @param {string} property - CSS属性
     * @param {string} value - CSS值
     */
    static setSafeStyle(element, property, value) {
        if (!element || !property || !value) return;

        if (this.isSafeCSS(value)) {
            element.style[property] = value;
        } else {
            console.warn('Unsafe CSS value detected:', { property, value });
        }
    }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
} else {
    window.SecurityUtils = SecurityUtils;
}