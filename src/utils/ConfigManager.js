/**
 * 配置管理器 - 安全地管理环境变量和配置
 * 防止敏感信息泄露到客户端代码
 */

class ConfigManager {
    constructor() {
        this.config = {};
        this.isInitialized = false;
        this.requiredEnvVars = [];
    }

    /**
     * 初始化配置管理器
     *
     * @param {Object} options - 配置选项
     */
    initialize(options = {}) {
        if (this.isInitialized) {
            console.warn('ConfigManager already initialized');
            return;
        }

        const {
            env = {},
            requiredEnvVars = [],
            allowClientAccess = false
        } = options;

        this.requiredEnvVars = requiredEnvVars;
        this.allowClientAccess = allowClientAccess;

        // 验证必需的环境变量
        this.validateRequiredEnvVars(env);

        // 加载配置
        this.loadConfig(env);

        this.isInitialized = true;
        console.log('✅ ConfigManager initialized');
    }

    /**
     * 验证必需的环境变量
     *
     * @param {Object} env - 环境变量对象
     * @throws {Error} - 如果缺少必需的环境变量
     */
    validateRequiredEnvVars(env) {
        const missing = [];

        this.requiredEnvVars.forEach(varName => {
            if (!env[varName]) {
                missing.push(varName);
            }
        });

        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }

    /**
     * 加载配置
     *
     * @param {Object} env - 环境变量对象
     */
    loadConfig(env) {
        // 应用基础配置
        this.config.app = {
            name: env.APP_NAME || '历史之树',
            version: env.APP_VERSION || '4.0.0',
            env: env.NODE_ENV || 'development',
            debug: env.DEBUG === 'true',
            apiTimeout: parseInt(env.API_TIMEOUT) || 30000,
            maxRetries: parseInt(env.MAX_RETRIES) || 3
        };

        // AI服务配置 - 仅保留非敏感信息
        this.config.ai = {
            timeout: this.config.app.apiTimeout,
            maxRetries: this.config.app.maxRetries,
            // 存储模型配置，但不存储API密钥
            models: {
                anthropic: env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
                openai: env.OPENAI_MODEL || 'gpt-4-turbo-preview',
                deepseek: env.DEEPSEEK_MODEL || 'deepseek-chat',
                gemini: env.GEMINI_MODEL || 'gemini-3.0'
            }
        };

        // 功能开关配置
        this.config.features = {
            aiChat: env.FEATURE_AI_CHAT !== 'false',
            view3D: env.FEATURE_3D_VIEW !== 'false',
            mapView: env.FEATURE_MAP_VIEW !== 'false',
            networkView: env.FEATURE_NETWORK_VIEW !== 'false',
            export: env.FEATURE_EXPORT !== 'false'
        };

        // 数据源配置
        this.config.data = {
            source: env.DATA_SOURCE || './data/history-data.json',
            cacheEnabled: env.CACHE_ENABLED !== 'false',
            cacheTTL: parseInt(env.CACHE_TTL) || 3600000
        };

        // MCP服务器配置
        this.config.mcp = {
            port: parseInt(env.MCP_SERVER_PORT) || 3000,
            host: env.MCP_SERVER_HOST || 'localhost',
            authEnabled: env.MCP_AUTH_ENABLED === 'true'
        };

        // 安全地移除敏感信息
        this.sanitizeConfig();
    }

    /**
     * 清理配置中的敏感信息
     */
    sanitizeConfig() {
        // 不将API密钥存储在客户端可访问的配置中
        // API密钥应该只在服务器端使用
        const sensitiveKeys = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN'];

        Object.keys(this.config).forEach(category => {
            Object.keys(this.config[category]).forEach(key => {
                const upperKey = key.toUpperCase();
                if (sensitiveKeys.some(sensitive => upperKey.includes(sensitive))) {
                    delete this.config[category][key];
                }
            });
        });
    }

    /**
     * 获取配置值
     *
     * @param {string} path - 配置路径，如 'app.name'
     * @param {*} defaultValue - 默认值
     * @returns {*} - 配置值
     */
    get(path, defaultValue = null) {
        const keys = path.split('.');
        let value = this.config;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }

        return value;
    }

    /**
     * 设置配置值
     *
     * @param {string} path - 配置路径
     * @param {*} value - 配置值
     */
    set(path, value) {
        const keys = path.split('.');
        let current = this.config;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
    }

    /**
     * 获取API配置（仅用于服务器端）
     *
     * @param {string} provider - 服务提供商
     * @returns {Object|null} - API配置或null
     */
    getAPIConfig(provider) {
        // 在客户端环境中，不返回API密钥
        if (typeof window !== 'undefined') {
            console.warn('API keys should not be accessed on the client side');
            return null;
        }

        // 在服务器端环境中，从环境变量获取
        if (typeof process !== 'undefined' && process.env) {
            const configs = {
                anthropic: {
                    apiKey: process.env.ANTHROPIC_API_KEY,
                    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'
                },
                openai: {
                    apiKey: process.env.OPENAI_API_KEY,
                    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'
                },
                deepseek: {
                    apiKey: process.env.DEEPSEEK_API_KEY,
                    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
                },
                gemini: {
                    apiKey: process.env.GEMINI_API_KEY,
                    model: process.env.GEMINI_MODEL || 'gemini-3.0'
                }
            };

            return configs[provider] || null;
        }

        return null;
    }

    /**
     * 检查功能是否启用
     *
     * @param {string} featureName - 功能名称
     * @returns {boolean} - 功能是否启用
     */
    isFeatureEnabled(featureName) {
        return this.get(`features.${featureName}`, false);
    }

    /**
     * 获取所有配置（用于调试，不包含敏感信息）
     *
     * @returns {Object} - 配置对象
     */
    getAll() {
        return { ...this.config };
    }

    /**
     * 重置配置
     */
    reset() {
        this.config = {};
        this.isInitialized = false;
        console.log('🔄 ConfigManager reset');
    }

    /**
     * 验证配置完整性
     *
     * @returns {boolean} - 配置是否有效
     */
    validate() {
        const required = ['app', 'ai', 'features', 'data', 'mcp'];

        for (const key of required) {
            if (!this.config[key]) {
                console.error(`Missing required configuration: ${key}`);
                return false;
            }
        }

        return true;
    }

    /**
     * 导出配置为JSON（不包含敏感信息）
     *
     * @returns {string} - JSON字符串
     */
    toJSON() {
        return JSON.stringify(this.config, null, 2);
    }
}

// 创建全局实例
const configManager = new ConfigManager();

// 在Node.js环境中导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
    module.exports.default = configManager;
} else {
    // 在浏览器环境中导出
    window.ConfigManager = ConfigManager;
    window.configManager = configManager;
}