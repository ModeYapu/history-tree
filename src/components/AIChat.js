/**
 * AI聊天组件 - 智能历史助手
 * 古风主题版本
 */

class AIChat {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
    }
    
    render() {
        this.container = document.createElement('div');
        this.container.className = 'ai-chat-panel';
        this.container.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 400px;
            height: 560px;
            background: linear-gradient(165deg, rgba(42, 33, 24, 0.98), rgba(26, 20, 16, 0.99));
            backdrop-filter: blur(20px) saturate(1.5);
            border-radius: 16px;
            border: 1px solid rgba(212, 168, 83, 0.2);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(212, 168, 83, 0.05);
            display: none;
            flex-direction: column;
            z-index: 1001;
            overflow: hidden;
            font-family: 'Noto Serif SC', 'SimSun', serif;
        `;
        
        this.container.innerHTML = `
            <div class="chat-header" style="
                background: linear-gradient(135deg, rgba(212, 168, 83, 0.15), rgba(184, 134, 11, 0.1));
                color: #F0D68A;
                padding: 18px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(212, 168, 83, 0.15);
            ">
                <div>
                    <h3 style="margin: 0; font-size: 17px; letter-spacing: 1px;">📜 历史问道</h3>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #8B7355;">以史为鉴，可以知兴替</p>
                </div>
                <button class="close-btn" style="
                    background: rgba(212, 168, 83, 0.1);
                    border: 1px solid rgba(212, 168, 83, 0.2);
                    color: #C9A96E;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s;
                " onmouseover="this.style.background='rgba(212,168,83,0.2)'" onmouseout="this.style.background='rgba(212,168,83,0.1)'">×</button>
            </div>
            
            <div class="chat-messages" style="
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: transparent;
            ">
                <div class="message ai-message" style="
                    background: rgba(212, 168, 83, 0.08);
                    border: 1px solid rgba(212, 168, 83, 0.12);
                    padding: 14px 16px;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    color: #C9A96E;
                    font-size: 13px;
                    line-height: 1.8;
                ">
                    <div style="color: #F0D68A; margin-bottom: 8px;">📜 欢迎</div>
                    我是历史之树的AI助手，可以帮你：
                    <ul style="margin: 8px 0 0 0; padding-left: 18px; color: #8B7355;">
                        <li>🔍 搜索历史事件和人物</li>
                        <li>📖 讲述历史故事和背景</li>
                        <li>🔗 发现历史关联与影响</li>
                        <li>💡 推荐感兴趣的内容</li>
                    </ul>
                </div>
            </div>
            
            <div class="chat-input" style="
                padding: 14px 16px;
                background: rgba(26, 20, 16, 0.5);
                border-top: 1px solid rgba(212, 168, 83, 0.1);
            ">
                <div style="display: flex; gap: 10px;">
                    <input type="text" class="message-input" placeholder="输入历史问题..." style="
                        flex: 1;
                        padding: 11px 16px;
                        background: rgba(212, 168, 83, 0.06);
                        border: 1px solid rgba(212, 168, 83, 0.15);
                        border-radius: 22px;
                        color: #F5E6C8;
                        font-size: 13px;
                        font-family: 'Noto Serif SC', serif;
                        outline: none;
                        transition: border-color 0.3s;
                    " onfocus="this.style.borderColor='rgba(212,168,83,0.4)'" onblur="this.style.borderColor='rgba(212,168,83,0.15)'" />
                    <button class="send-btn" style="
                        background: linear-gradient(135deg, #D4A853, #B8860B);
                        color: #1a1410;
                        border: none;
                        width: 42px;
                        height: 42px;
                        border-radius: 50%;
                        font-size: 16px;
                        cursor: pointer;
                        transition: transform 0.2s;
                        font-weight: bold;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">→</button>
                </div>
                <div class="quick-questions" style="
                    margin-top: 10px;
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                ">
                    <button class="quick-q" data-q="秦统一六国" style="
                        background: rgba(212, 168, 83, 0.08);
                        border: 1px solid rgba(212, 168, 83, 0.12);
                        color: #C9A96E;
                        padding: 5px 12px;
                        border-radius: 14px;
                        font-size: 12px;
                        font-family: 'Noto Serif SC', serif;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='rgba(212,168,83,0.3)'" onmouseout="this.style.borderColor='rgba(212,168,83,0.12)'">秦统一六国</button>
                    <button class="quick-q" data-q="推荐重要事件" style="
                        background: rgba(212, 168, 83, 0.08);
                        border: 1px solid rgba(212, 168, 83, 0.12);
                        color: #C9A96E;
                        padding: 5px 12px;
                        border-radius: 14px;
                        font-size: 12px;
                        font-family: 'Noto Serif SC', serif;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='rgba(212,168,83,0.3)'" onmouseout="this.style.borderColor='rgba(212,168,83,0.12)'">推荐重要事件</button>
                    <button class="quick-q" data-q="分析历史趋势" style="
                        background: rgba(212, 168, 83, 0.08);
                        border: 1px solid rgba(212, 168, 83, 0.12);
                        color: #C9A96E;
                        padding: 5px 12px;
                        border-radius: 14px;
                        font-size: 12px;
                        font-family: 'Noto Serif SC', serif;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='rgba(212,168,83,0.3)'" onmouseout="this.style.borderColor='rgba(212,168,83,0.12)'">分析历史趋势</button>
                    <button class="quick-q" data-q="丝绸之路" style="
                        background: rgba(212, 168, 83, 0.08);
                        border: 1px solid rgba(212, 168, 83, 0.12);
                        color: #C9A96E;
                        padding: 5px 12px;
                        border-radius: 14px;
                        font-size: 12px;
                        font-family: 'Noto Serif SC', serif;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='rgba(212,168,83,0.3)'" onmouseout="this.style.borderColor='rgba(212,168,83,0.12)'">丝绸之路</button>
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
                const q = btn.getAttribute('data-q') || btn.textContent;
                this.container.querySelector('.message-input').value = q;
                this.sendMessage();
            });
        });
        
        // 切换按钮
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'ai-toggle-btn';
        this.toggleButton.innerHTML = '📜';
        this.toggleButton.title = '历史问道';
        this.toggleButton.style.cssText = `
            position: fixed;
            right: 24px;
            bottom: 24px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(145deg, rgba(212, 168, 83, 0.2), rgba(184, 134, 11, 0.15));
            backdrop-filter: blur(10px);
            color: #F0D68A;
            border: 1px solid rgba(212, 168, 83, 0.3);
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(212, 168, 83, 0.15);
            z-index: 1000;
            transition: all 0.3s;
        `;
        this.toggleButton.addEventListener('mouseover', () => {
            this.toggleButton.style.transform = 'scale(1.1)';
            this.toggleButton.style.boxShadow = '0 6px 30px rgba(212, 168, 83, 0.25)';
        });
        this.toggleButton.addEventListener('mouseout', () => {
            this.toggleButton.style.transform = 'scale(1)';
            this.toggleButton.style.boxShadow = '0 4px 20px rgba(212, 168, 83, 0.15)';
        });
        this.toggleButton.addEventListener('click', () => this.toggle());
        document.body.appendChild(this.toggleButton);
        
        document.body.appendChild(this.container);
        
        return this.container;
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.container.style.display = 'flex';
            this.container.style.animation = 'chatSlideIn 0.3s ease-out';
            this.toggleButton.style.display = 'none';
            // 聚焦输入框
            setTimeout(() => {
                this.container.querySelector('.message-input').focus();
            }, 300);
        } else {
            this.container.style.display = 'none';
            this.toggleButton.style.display = 'block';
        }
    }
    
    sendMessage() {
        const input = this.container.querySelector('.message-input');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // 显示用户消息
        this.addMessage(message, 'user');
        input.value = '';
        
        // 显示思考中
        this.showTyping();
        
        // 获取AI回复
        setTimeout(() => {
            this.hideTyping();
            const response = this.getAIResponse(message);
            this.addMessage(response, 'ai');
        }, 600 + Math.random() * 400);
    }
    
    showTyping() {
        this.isTyping = true;
        const messagesContainer = this.container.querySelector('.chat-messages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            color: #8B7355;
            font-size: 12px;
        `;
        typingDiv.innerHTML = `
            <span style="animation: typingDot 1.4s infinite">●</span>
            <span style="animation: typingDot 1.4s infinite 0.2s; opacity: 0.5">●</span>
            <span style="animation: typingDot 1.4s infinite 0.4s; opacity: 0.3">●</span>
            <span style="margin-left: 6px;">思索中...</span>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTyping() {
        this.isTyping = false;
        const typing = this.container.querySelector('.typing-indicator');
        if (typing) typing.remove();
    }
    
    addMessage(text, type) {
        const messagesContainer = this.container.querySelector('.chat-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (type === 'user') {
            messageDiv.style.cssText = `
                background: linear-gradient(135deg, rgba(212, 168, 83, 0.2), rgba(184, 134, 11, 0.15));
                border: 1px solid rgba(212, 168, 83, 0.25);
                color: #F5E6C8;
                padding: 11px 16px;
                border-radius: 12px;
                margin-bottom: 10px;
                margin-left: 30px;
                font-size: 13px;
                line-height: 1.7;
                animation: msgFadeIn 0.3s ease-out;
            `;
        } else {
            messageDiv.style.cssText = `
                background: rgba(212, 168, 83, 0.06);
                border: 1px solid rgba(212, 168, 83, 0.1);
                color: #C9A96E;
                padding: 11px 16px;
                border-radius: 12px;
                margin-bottom: 10px;
                margin-right: 20px;
                font-size: 13px;
                line-height: 1.7;
                white-space: pre-wrap;
                animation: msgFadeIn 0.3s ease-out;
            `;
        }
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    getAIResponse(question) {
        const lowerQ = question.toLowerCase();
        
        // 搜索相关内容
        const results = this.app.dataService.search(question, { limit: 5 });
        
        if (results.length > 0) {
            const first = results[0];
            const timeStr = first.time?.displayDate || first.time?.year || '';
            const periodStr = first.time?.period || '';
            
            let response = `📖 ${first.name}`;
            if (timeStr) response += `（${timeStr}）`;
            if (periodStr) response += ` · ${periodStr}`;
            response += '\n\n';
            response += first.description || first.summary || '暂无详细描述';
            response += '\n\n';
            
            if (results.length > 1) {
                response += `📎 另找到 ${results.length - 1} 个相关内容：\n`;
                for (let i = 1; i < Math.min(4, results.length); i++) {
                    const r = results[i];
                    response += `  · ${r.name}（${r.time?.displayDate || r.time?.year || ''}）\n`;
                }
            }
            
            // 推荐相关
            if (first.category?.tags?.length > 0) {
                response += `\n💡 试试搜索：${first.category.tags.slice(0, 3).join('、')}`;
            }
            
            return response;
        }
        
        // 预设回复
        if (lowerQ.includes('推荐') || lowerQ.includes('重要')) {
            const allNodes = Array.from(this.app.dataService.nodes.values());
            const important = allNodes
                .filter(n => n.metadata?.importance >= 4 && n.type !== 'period' && n.type !== 'branch')
                .sort((a, b) => (b.metadata?.importance || 0) - (a.metadata?.importance || 0))
                .slice(0, 6);
            
            if (important.length > 0) {
                let response = '🌟 推荐重要历史事件：\n\n';
                important.forEach((n, i) => {
                    const year = n.time?.displayDate || n.time?.year || '';
                    response += `${i + 1}. ${n.name}（${year}）\n`;
                    if (n.description) response += `   ${n.description}\n`;
                });
                response += '\n点击节点可查看详情 ✨';
                return response;
            }
            
            return '我推荐你了解：\n\n1. 秦始皇统一六国（前221年）\n2. 汉朝建立（前202年）\n3. 丝绸之路开通（前139年）\n4. 造纸术发明（105年）\n5. 唐朝盛世（618年）\n\n这些都是改变历史进程的重大事件！';
        }
        
        if (lowerQ.includes('趋势') || lowerQ.includes('分析') || lowerQ.includes('统计')) {
            const allNodes = Array.from(this.app.dataService.nodes.values())
                .filter(n => n.type === 'event' || n.type === 'person');
            
            // 按分类统计
            const categoryCount = {};
            const periodCount = {};
            allNodes.forEach(n => {
                const cat = n.category?.primary || '其他';
                const period = n.time?.period || '未知';
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
                periodCount[period] = (periodCount[period] || 0) + 1;
            });
            
            let response = `📊 数据概览（共 ${allNodes.length} 条记录）\n\n`;
            response += '【按领域分布】\n';
            const catNames = { politics: '政治', technology: '科技', culture: '文化', economy: '经济', military: '军事' };
            for (const [k, v] of Object.entries(categoryCount).sort((a, b) => b[1] - a[1])) {
                const name = catNames[k] || k;
                const bar = '█'.repeat(Math.ceil(v / Math.max(...Object.values(categoryCount)) * 10));
                response += `  ${name} ${bar} ${v}\n`;
            }
            
            response += '\n【按时期分布】\n';
            for (const [k, v] of Object.entries(periodCount).sort((a, b) => b[1] - a[1])) {
                response += `  ${k}: ${v} 条\n`;
            }
            
            return response;
        }
        
        if (lowerQ.includes('帮助') || lowerQ.includes('怎么') || lowerQ.includes('用法')) {
            return '📜 使用指南：\n\n• 直接输入关键词搜索历史事件\n• 输入人名查看人物介绍\n• 说"推荐"获取重要事件\n• 说"分析"查看数据统计\n• 点击3D树上的节点查看详情\n• 用 Ctrl+K 快速搜索\n\n试试输入"唐朝"或"李白"吧！';
        }
        
        return `抱歉，我没有找到"${question}"的相关信息。\n\n试试这些：\n• 秦始皇、汉朝、唐朝\n• 造纸术、火药、指南针\n• 苏格拉底、孔子、李白\n• 输入"推荐"获取热门内容`;
    }
    
    destroy() {
        if (this.container) this.container.remove();
        if (this.toggleButton) this.toggleButton.remove();
    }
}

window.AIChat = AIChat;
