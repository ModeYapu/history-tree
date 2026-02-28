/**
 * 模型选择器UI组件
 */

class ModelSelector {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.modelManager = null;
    }
    
    render() {
        this.modelManager = this.app.modelManager;
        
        this.container = document.createElement('div');
        this.container.className = 'model-selector';
        this.container.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            width: 350px;
            max-height: 600px;
            background: rgba(26, 26, 46, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            display: none;
            flex-direction: column;
            overflow: hidden;
        `;
        
        this.container.innerHTML = `
            <div class="model-header" style="
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 16px; color: white;">
                        🤖 AI模型选择
                    </h3>
                    <button class="close-btn" style="
                        background: rgba(255, 255, 255, 0.1);
                        border: none;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 16px;
                    ">×</button>
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #888;">
                    当前模型: <span id="currentModelName" style="color: #667eea;">-</span>
                </div>
            </div>
            
            <div class="model-content" style="
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            ">
                <div class="model-section" style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #888;">
                        🚀 OpenAI 模型
                    </h4>
                    <div class="model-list" id="openaiModels"></div>
                </div>
                
                <div class="model-section" style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #888;">
                        💎 Google 模型
                    </h4>
                    <div class="model-list" id="googleModels"></div>
                </div>
                
                <div class="model-section" style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #888;">
                        🎭 Anthropic 模型
                    </h4>
                    <div class="model-list" id="anthropicModels"></div>
                </div>
                
                <div class="model-section" style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #888;">
                        🇨🇳 智谱AI 模型
                    </h4>
                    <div class="model-list" id="zhipuModels"></div>
                </div>
                
                <div class="model-section" style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #888;">
                        🏠 本地模型
                    </h4>
                    <div class="model-list" id="localModels"></div>
                </div>
            </div>
            
            <div class="model-footer" style="
                padding: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            ">
                <button class="settings-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: rgba(102, 126, 234, 0.2);
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                ">⚙️ API配置</button>
            </div>
        `;
        
        // 绑定事件
        this.container.querySelector('.close-btn').addEventListener('click', () => {
            this.hide();
        });
        
        this.container.querySelector('.settings-btn').addEventListener('click', () => {
            this.showSettings();
        });
        
        // 渲染模型列表
        this.renderModels();
        
        document.body.appendChild(this.container);
        
        return this.container;
    }
    
    renderModels() {
        const models = this.modelManager.getAvailableModels();
        
        // 按provider分组
        const grouped = {
            openai: [],
            google: [],
            anthropic: [],
            zhipu: [],
            local: []
        };
        
        models.forEach(model => {
            if (grouped[model.provider]) {
                grouped[model.provider].push(model);
            }
        });
        
        // 渲染各组
        Object.entries(grouped).forEach(([provider, modelList]) => {
            const container = this.container.querySelector(`#${provider}Models`);
            if (!container) return;
            
            container.innerHTML = modelList.map(model => `
                <div class="model-card ${model.id === this.modelManager.currentModel ? 'active' : ''} ${!model.available ? 'disabled' : ''}" 
                     data-model="${model.id}"
                     style="
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid ${model.id === this.modelManager.currentModel ? model.color : 'rgba(255, 255, 255, 0.1)'};
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 8px;
                    cursor: ${model.available ? 'pointer' : 'not-allowed'};
                    opacity: ${model.available ? 1 : 0.5};
                    transition: all 0.3s;
                ">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 20px; margin-right: 10px;">${model.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 13px; color: white;">
                                ${model.name}
                            </div>
                            <div style="font-size: 11px; color: #888;">
                                ${model.maxTokens} tokens
                            </div>
                        </div>
                        ${model.id === this.modelManager.currentModel ? `
                            <span style="
                                background: ${model.color};
                                color: white;
                                padding: 2px 8px;
                                border-radius: 10px;
                                font-size: 10px;
                            ">当前</span>
                        ` : ''}
                    </div>
                    <div style="font-size: 11px; color: #aaa; line-height: 1.4;">
                        ${model.description}
                    </div>
                    ${model.pricing.input > 0 ? `
                        <div style="font-size: 10px; color: #667eea; margin-top: 8px;">
                            💰 $${model.pricing.input}/$${model.pricing.output} per 1K tokens
                        </div>
                    ` : `
                        <div style="font-size: 10px; color: #22c55e; margin-top: 8px;">
                            🆓 免费
                        </div>
                    `}
                </div>
            `).join('');
            
            // 绑定点击事件
            container.querySelectorAll('.model-card:not(.disabled)').forEach(card => {
                card.addEventListener('click', () => {
                    const modelId = card.dataset.model;
                    this.selectModel(modelId);
                });
                
                card.addEventListener('mouseenter', () => {
                    if (!card.classList.contains('disabled')) {
                        card.style.background = 'rgba(102, 126, 234, 0.1)';
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.background = 'rgba(255, 255, 255, 0.05)';
                });
            });
        });
        
        // 更新当前模型名称
        const currentModel = this.modelManager.getCurrentModel();
        this.container.querySelector('#currentModelName').textContent = currentModel.name;
    }
    
    selectModel(modelId) {
        this.modelManager.selectModel(modelId);
        this.renderModels();
        
        // 通知应用
        this.app.eventBus.emit('model:change', {
            modelId,
            model: this.modelManager.getCurrentModel()
        });
        
        console.log(`✅ 已切换到模型: ${modelId}`);
    }
    
    showSettings() {
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'api-settings-panel';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: rgba(26, 26, 46, 0.98);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 30px;
            z-index: 2000;
        `;
        
        settingsPanel.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: white;">⚙️ API密钥配置</h3>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #888;">
                    OpenAI API Key
                </label>
                <input type="password" id="openaiKey" placeholder="sk-..." style="
                    width: 100%;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: white;
                    font-size: 13px;
                " />
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #888;">
                    Google API Key
                </label>
                <input type="password" id="googleKey" placeholder="AIza..." style="
                    width: 100%;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: white;
                    font-size: 13px;
                " />
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #888;">
                    Anthropic API Key
                </label>
                <input type="password" id="anthropicKey" placeholder="sk-ant-..." style="
                    width: 100%;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: white;
                    font-size: 13px;
                " />
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #888;">
                    智谱AI API Key
                </label>
                <input type="password" id="zhipuKey" placeholder="..." style="
                    width: 100%;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: white;
                    font-size: 13px;
                " />
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button class="save-btn" style="
                    flex: 1;
                    padding: 10px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                ">保存配置</button>
                <button class="cancel-btn" style="
                    flex: 1;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                ">取消</button>
            </div>
            
            <div style="margin-top: 15px; font-size: 11px; color: #666;">
                🔐 API密钥将安全存储在本地浏览器中
            </div>
        `;
        
        // 加载已保存的keys
        ['openai', 'google', 'anthropic', 'zhipu'].forEach(provider => {
            const key = this.modelManager.getApiKey(provider);
            if (key) {
                settingsPanel.querySelector(`#${provider}Key`).value = key;
            }
        });
        
        // 绑定事件
        settingsPanel.querySelector('.save-btn').addEventListener('click', () => {
            ['openai', 'google', 'anthropic', 'zhipu'].forEach(provider => {
                const key = settingsPanel.querySelector(`#${provider}Key`).value.trim();
                if (key) {
                    this.modelManager.setApiKey(provider, key);
                }
            });
            
            settingsPanel.remove();
            this.renderModels();
            
            alert('✅ API配置已保存');
        });
        
        settingsPanel.querySelector('.cancel-btn').addEventListener('click', () => {
            settingsPanel.remove();
        });
        
        document.body.appendChild(settingsPanel);
    }
    
    show() {
        this.container.style.display = 'flex';
    }
    
    hide() {
        this.container.style.display = 'none';
    }
    
    toggle() {
        if (this.container.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }
}

// 导出到全局
window.ModelSelector = ModelSelector;
