/**
 * AI聊天组件 - 智能历史助手
 */

class AIChat {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.messages = [];
        this.isOpen = false;
    }
    
    render() {
        this.container = document.createElement('div');
        this.container.className = 'ai-chat-panel';
        this.container.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 380px;
            height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            z-index: 1001;
            overflow: hidden;
        `;
        
        this.container.innerHTML = `
            <div class="chat-header" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <h3 style="margin: 0; font-size: 18px;">🤖 历史AI助手</h3>
                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">随时为您解答历史问题</p>
                </div>
                <button class="close-btn" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    font-size: 18px;
                    cursor: pointer;
                ">×</button>
            </div>
            
            <div class="chat-messages" style="
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f8f8f8;
            ">
                <div class="message ai-message" style="
                    background: white;
                    padding: 12px 15px;
                    border-radius: 12px;
                    margin-bottom: 10px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                ">
                    <div style="font-size: 14px; line-height: 1.6;">
                        你好！我是历史AI助手。我可以帮你：
                    </div>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 13px; color: #666;">
                        <li>搜索历史事件和人物</li>
                        <li>解释历史背景和意义</li>
                        <li>分析历史关系和影响</li>
                        <li>推荐相关内容</li>
                    </ul>
                </div>
            </div>
            
            <div class="chat-input" style="
                padding: 15px;
                background: white;
                border-top: 1px solid #eee;
            ">
                <div style="display: flex; gap: 10px;">
                    <input type="text" class="message-input" placeholder="问我任何历史问题..." style="
                        flex: 1;
                        padding: 12px 15px;
                        border: 1px solid #ddd;
                        border-radius: 20px;
                        font-size: 14px;
                        outline: none;
                    " />
                    <button class="send-btn" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        font-size: 18px;
                        cursor: pointer;
                    ">→</button>
                </div>
                <div class="quick-questions" style="
                    margin-top: 10px;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                ">
                    <button class="quick-q" style="
                        background: #f0f0f0;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 12px;
                        font-size: 12px;
                        cursor: pointer;
                    ">秦始皇统一六国</button>
                    <button class="quick-q" style="
                        background: #f0f0f0;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 12px;
                        font-size: 12px;
                        cursor: pointer;
                    ">推荐重要事件</button>
                    <button class="quick-q" style="
                        background: #f0f0f0;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 12px;
                        font-size: 12px;
                        cursor: pointer;
                    ">分析历史趋势</button>
                </div>
            </div>
        `;
        
        // 绑定事件
        this.container.querySelector('.close-btn').addEventListener('click', () => this.toggle());
        this.container.querySelector('.send-btn').addEventListener('click', () => this.sendMessage());
        this.container.querySelector('.message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // 快捷问题
        this.container.querySelectorAll('.quick-q').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelector('.message-input').value = btn.textContent;
                this.sendMessage();
            });
        });
        
        // 切换按钮
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'ai-toggle-btn';
        this.toggleButton.innerHTML = '🤖';
        this.toggleButton.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            z-index: 1000;
            transition: transform 0.3s;
        `;
        this.toggleButton.addEventListener('click', () => this.toggle());
        document.body.appendChild(this.toggleButton);
        
        document.body.appendChild(this.container);
        
        return this.container;
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.container.style.display = 'flex';
            this.toggleButton.style.display = 'none';
        } else {
            this.container.style.display = 'none';
            this.toggleButton.style.display = 'block';
        }
    }
    
    sendMessage() {
        const input = this.container.querySelector('.message-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // 显示用户消息
        this.addMessage(message, 'user');
        input.value = '';
        
        // 获取AI回复
        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addMessage(response, 'ai');
        }, 500);
    }
    
    addMessage(text, type) {
        const messagesContainer = this.container.querySelector('.chat-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.style.cssText = `
            background: ${type === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
            color: ${type === 'user' ? 'white' : '#333'};
            padding: 12px 15px;
            border-radius: 12px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-left: ${type === 'user' ? '40px' : '0'};
            margin-right: ${type === 'ai' ? '40px' : '0'};
            font-size: 14px;
            line-height: 1.6;
        `;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    getAIResponse(question) {
        const lowerQ = question.toLowerCase();
        
        // 搜索相关内容
        const results = this.app.dataService.search(question, { limit: 3 });
        
        if (results.length > 0) {
            const first = results[0];
            return `${first.name}（${first.time.displayDate}）\n\n${first.summary}\n\n还找到${results.length - 1}个相关结果。`;
        }
        
        // 预设回复
        if (lowerQ.includes('推荐') || lowerQ.includes('重要')) {
            return '我推荐你了解：\n\n1. 秦始皇统一六国（公元前221年）\n2. 汉朝建立（公元前202年）\n3. 丝绸之路开通（公元前139年）\n\n这些都是改变历史进程的重大事件！';
        }
        
        if (lowerQ.includes('趋势') || lowerQ.includes('分析')) {
            return '根据历史数据分析：\n\n📊 政治事件占40%\n📊 文化事件占25%\n📊 科技事件占20%\n📊 经济事件占15%\n\n可以看出政治在历史进程中占主导地位。';
        }
        
        return '抱歉，我没有找到相关信息。试试问我：\n\n• 秦始皇是谁？\n• 汉朝什么时候建立？\n• 推荐重要历史事件';
    }
    
    destroy() {
        if (this.container) this.container.remove();
        if (this.toggleButton) this.toggleButton.remove();
    }
}

window.AIChat = AIChat;
