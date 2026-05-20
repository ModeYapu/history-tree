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

        // 创建头部
        const header = this.createHeader();
        this.container.appendChild(header);

        // 创建内容区域
        const content = this.createContent();
        this.container.appendChild(content);

        // 创建底部
        const footer = this.createFooter();
        this.container.appendChild(footer);

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

    /**
     * 创建头部
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'model-header';
        header.style.cssText = 'padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);';

        const headerTop = document.createElement('div');
        headerTop.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

        const title = document.createElement('h3');
        title.style.cssText = 'margin: 0; font-size: 16px; color: white;';
        title.textContent = '🤖 AI模型选择';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
        `;
        closeBtn.textContent = '×';

        headerTop.appendChild(title);
        headerTop.appendChild(closeBtn);

        const currentModelDiv = document.createElement('div');
        currentModelDiv.style.cssText = 'margin-top: 10px; font-size: 12px; color: #888;';
        currentModelDiv.innerHTML = '当前模型: <span id="currentModelName" style="color: #667eea;">-</span>';

        header.appendChild(headerTop);
        header.appendChild(currentModelDiv);

        return header;
    }

    /**
     * 创建内容区域
     */
    createContent() {
        const content = document.createElement('div');
        content.className = 'model-content';
        content.style.cssText = 'flex: 1; overflow-y: auto; padding: 15px;';

        const sections = [
            { id: 'openaiModels', title: '🚀 OpenAI 模型' },
            { id: 'googleModels', title: '💎 Google 模型' },
            { id: 'anthropicModels', title: '🎭 Anthropic 模型' },
            { id: 'zhipuModels', title: '🇨🇳 智谱AI 模型' },
            { id: 'localModels', title: '🏠 本地模型' }
        ];

        sections.forEach(({ id, title }) => {
            const section = document.createElement('div');
            section.className = 'model-section';
            section.style.cssText = 'margin-bottom: 20px;';

            const h4 = document.createElement('h4');
            h4.style.cssText = 'margin: 0 0 10px 0; font-size: 13px; color: #888;';
            h4.textContent = title;

            const list = document.createElement('div');
            list.className = 'model-list';
            list.id = id;

            section.appendChild(h4);
            section.appendChild(list);
            content.appendChild(section);
        });

        return content;
    }

    /**
     * 创建底部
     */
    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'model-footer';
        footer.style.cssText = 'padding: 15px; border-top: 1px solid rgba(255, 255, 255, 0.1);';

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-btn';
        settingsBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            background: rgba(102, 126, 234, 0.2);
            border: 1px solid rgba(102, 126, 234, 0.3);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
        `;
        settingsBtn.textContent = '⚙️ API配置';

        footer.appendChild(settingsBtn);

        return footer;
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

            // 清空现有内容
            container.innerHTML = '';

            modelList.forEach(model => {
                const card = this.createModelCard(model);
                container.appendChild(card);
            });
        });

        // 更新当前模型名称
        const currentModel = this.modelManager.getCurrentModel();
        this.container.querySelector('#currentModelName').textContent = currentModel.name;
    }

    /**
     * 创建模型卡片
     */
    createModelCard(model) {
        const isCurrent = model.id === this.modelManager.currentModel;
        const borderColor = isCurrent ? model.color : 'rgba(255, 255, 255, 0.1)';
        const opacity = model.available ? 1 : 0.5;
        const cursor = model.available ? 'pointer' : 'not-allowed';

        const card = document.createElement('div');
        card.className = `model-card ${isCurrent ? 'active' : ''} ${!model.available ? 'disabled' : ''}`;
        card.dataset.model = model.id;
        card.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid ${borderColor};
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            cursor: ${cursor};
            opacity: ${opacity};
            transition: all 0.3s;
        `;

        // 顶部行
        const topRow = document.createElement('div');
        topRow.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px;';

        const iconSpan = document.createElement('span');
        iconSpan.style.cssText = 'font-size: 20px; margin-right: 10px;';
        iconSpan.textContent = model.icon;

        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'flex: 1;';

        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = 'font-weight: bold; font-size: 13px; color: white;';
        nameDiv.textContent = model.name;

        const tokensDiv = document.createElement('div');
        tokensDiv.style.cssText = 'font-size: 11px; color: #888;';
        tokensDiv.textContent = `${model.maxTokens} tokens`;

        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(tokensDiv);

        topRow.appendChild(iconSpan);
        topRow.appendChild(infoDiv);

        if (isCurrent) {
            const currentBadge = document.createElement('span');
            currentBadge.style.cssText = `
                background: ${model.color};
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 10px;
            `;
            currentBadge.textContent = '当前';
            topRow.appendChild(currentBadge);
        }

        // 描述
        const descDiv = document.createElement('div');
        descDiv.style.cssText = 'font-size: 11px; color: #aaa; line-height: 1.4;';
        descDiv.textContent = model.description;

        // 价格信息
        const priceDiv = document.createElement('div');
        priceDiv.style.cssText = 'margin-top: 8px; font-size: 10px;';

        if (model.pricing.input > 0) {
            priceDiv.style.color = '#667eea';
            priceDiv.textContent = `💰 $${model.pricing.input}/$${model.pricing.output} per 1K tokens`;
        } else {
            priceDiv.style.color = '#22c55e';
            priceDiv.textContent = '🆓 免费';
        }

        card.appendChild(topRow);
        card.appendChild(descDiv);
        card.appendChild(priceDiv);

        // 绑定事件
        if (model.available) {
            card.addEventListener('click', () => {
                this.selectModel(model.id);
            });

            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('disabled')) {
                    card.style.background = 'rgba(102, 126, 234, 0.1)';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = 'rgba(255, 255, 255, 0.05)';
            });
        }

        return card;
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

        // 标题
        const title = document.createElement('h3');
        title.style.cssText = 'margin: 0 0 20px 0; color: white;';
        title.textContent = '⚙️ API密钥配置';
        settingsPanel.appendChild(title);

        // API密钥输入框
        const providers = [
            { id: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...' },
            { id: 'google', label: 'Google API Key', placeholder: 'AIza...' },
            { id: 'anthropic', label: 'Anthropic API Key', placeholder: 'sk-ant-...' },
            { id: 'zhipu', label: '智谱AI API Key', placeholder: '...' }
        ];

        providers.forEach(({ id, label, placeholder }) => {
            const inputGroup = this.createInputGroup(label, placeholder, id);
            settingsPanel.appendChild(inputGroup);
        });

        // 按钮区域
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = 'display: flex; gap: 10px;';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
        `;
        saveBtn.textContent = '保存配置';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
        `;
        cancelBtn.textContent = '取消';

        buttonDiv.appendChild(saveBtn);
        buttonDiv.appendChild(cancelBtn);
        settingsPanel.appendChild(buttonDiv);

        // 提示信息
        const hint = document.createElement('div');
        hint.style.cssText = 'margin-top: 15px; font-size: 11px; color: #666;';
        hint.textContent = '🔐 API密钥将安全存储在本地浏览器中';
        settingsPanel.appendChild(hint);

        // 加载已保存的keys
        ['openai', 'google', 'anthropic', 'zhipu'].forEach(provider => {
            const key = this.modelManager.getApiKey(provider);
            if (key) {
                settingsPanel.querySelector(`#${provider}Key`).value = key;
            }
        });

        // 绑定事件
        saveBtn.addEventListener('click', () => {
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

        cancelBtn.addEventListener('click', () => {
            settingsPanel.remove();
        });

        document.body.appendChild(settingsPanel);
    }

    /**
     * 创建输入框组
     */
    createInputGroup(label, placeholder, id) {
        const group = document.createElement('div');
        group.style.cssText = 'margin-bottom: 15px;';

        const labelEl = document.createElement('label');
        labelEl.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px; color: #888;';
        labelEl.textContent = label;

        const input = document.createElement('input');
        input.type = 'password';
        input.id = `${id}Key`;
        input.placeholder = placeholder;
        input.style.cssText = `
            width: 100%;
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: white;
            font-size: 13px;
        `;

        group.appendChild(labelEl);
        group.appendChild(input);

        return group;
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
