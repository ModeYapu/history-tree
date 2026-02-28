/**
 * 哲学思辨界面组件
 */

class PhilosophyUI {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.currentAnalysis = null;
    }
    
    render() {
        this.container = document.createElement('div');
        this.container.className = 'philosophy-panel';
        this.container.style.cssText = `
            position: fixed;
            right: -500px;
            top: 80px;
            width: 480px;
            height: calc(100vh - 100px);
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 16px 0 0 16px;
            box-shadow: -4px 0 20px rgba(0,0,0,0.3);
            transition: right 0.3s ease;
            z-index: 1000;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        
        this.container.innerHTML = `
            <div class="philosophy-header" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                color: white;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="margin: 0; font-size: 20px;">🧠 哲学思辨</h2>
                        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">深度分析与哲学思辨</p>
                    </div>
                    <button class="close-btn" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 18px;
                    ">×</button>
                </div>
            </div>
            
            <div class="philosophy-content" style="
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                color: white;
            ">
                <div class="analysis-section">
                    <h3 style="font-size: 16px; margin: 0 0 15px 0; color: #667eea;">
                        🔍 关联发现
                    </h3>
                    <div class="discovery-content"></div>
                </div>
                
                <div class="analysis-section" style="margin-top: 30px;">
                    <h3 style="font-size: 16px; margin: 0 0 15px 0; color: #a855f7;">
                        💭 哲学思辨
                    </h3>
                    <div class="philosophy-content-inner"></div>
                </div>
                
                <div class="analysis-section" style="margin-top: 30px;">
                    <h3 style="font-size: 16px; margin: 0 0 15px 0; color: #22c55e;">
                        ⚖️ 多元视角
                    </h3>
                    <div class="perspectives-content"></div>
                </div>
                
                <div class="analysis-section" style="margin-top: 30px;">
                    <h3 style="font-size: 16px; margin: 0 0 15px 0; color: #f59e0b;">
                        💡 核心洞察
                    </h3>
                    <div class="wisdom-content"></div>
                </div>
            </div>
            
            <div class="philosophy-input" style="
                padding: 15px;
                background: rgba(0,0,0,0.3);
                border-top: 1px solid rgba(255,255,255,0.1);
            ">
                <input type="text" class="question-input" placeholder="提出哲学问题..." style="
                    width: 100%;
                    padding: 12px 15px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    outline: none;
                " />
            </div>
        `;
        
        // 绑定事件
        this.container.querySelector('.close-btn').addEventListener('click', () => {
            this.hide();
        });
        
        this.container.querySelector('.question-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.askQuestion(e.target.value);
                e.target.value = '';
            }
        });
        
        document.body.appendChild(this.container);
        
        return this.container;
    }
    
    show() {
        this.container.style.right = '0px';
    }
    
    hide() {
        this.container.style.right = '-500px';
    }
    
    async showAnalysis(nodeId) {
        this.show();
        this.showLoading();
        
        const analysis = await this.app.enhancedAI.deepAnalysis(nodeId);
        this.currentAnalysis = analysis;
        
        this.renderAnalysis(analysis);
        this.hideLoading();
    }
    
    renderAnalysis(analysis) {
        // 渲染关联发现
        this.renderDiscovery(analysis.discovery);
        
        // 渲染哲学思辨
        this.renderPhilosophy(analysis.philosophy);
        
        // 渲染多元视角
        this.renderPerspectives(analysis.perspectives);
        
        // 渲染核心洞察
        this.renderWisdom(analysis.wisdom);
    }
    
    renderDiscovery(discovery) {
        const container = this.container.querySelector('.discovery-content');
        
        let html = '';
        
        // 因果发现
        if (discovery.causal && discovery.causal.length > 0) {
            html += `
                <div style="margin-bottom: 15px;">
                    <h4 style="font-size: 14px; margin: 0 0 10px 0; color: #4ecdc4;">
                        🔗 因果链条
                    </h4>
                    ${discovery.causal.map(c => `
                        <div style="
                            background: rgba(255,255,255,0.05);
                            padding: 10px;
                            border-radius: 8px;
                            margin-bottom: 8px;
                            border-left: 3px solid #4ecdc4;
                        ">
                            <div style="font-weight: bold; margin-bottom: 5px;">${c.event}</div>
                            <div style="font-size: 12px; color: #aaa;">${c.mechanism}</div>
                            <div style="font-size: 11px; color: #888; margin-top: 5px;">
                                置信度: ${(c.confidence * 100).toFixed(0)}%
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // 辩证发现
        if (discovery.dialectical && discovery.dialectical.length > 0) {
            html += `
                <div style="margin-bottom: 15px;">
                    <h4 style="font-size: 14px; margin: 0 0 10px 0; color: #a855f7;">
                        ⚖️ 辩证关系
                    </h4>
                    ${discovery.dialectical.map(d => `
                        <div style="
                            background: rgba(168, 85, 247, 0.1);
                            padding: 10px;
                            border-radius: 8px;
                            margin-bottom: 8px;
                        ">
                            <div style="font-size: 12px; color: #aaa; margin-bottom: 5px;">矛盾：${d.contradiction}</div>
                            <div style="display: flex; gap: 8px; font-size: 11px;">
                                <span style="flex: 1; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 4px;">
                                    正题：${d.thesis}
                                </span>
                                <span style="flex: 1; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 4px;">
                                    反题：${d.antithesis}
                                </span>
                            </div>
                            <div style="font-size: 12px; margin-top: 5px; color: #22c55e;">
                                合题：${d.synthesis}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        container.innerHTML = html || '<div style="color: #666;">暂无发现</div>';
    }
    
    renderPhilosophy(philosophy) {
        const container = this.container.querySelector('.philosophy-content-inner');
        
        const dimensions = [
            { key: 'ontological', name: '本体论', icon: '🎯' },
            { key: 'epistemological', name: '认识论', icon: '👁️' },
            { key: 'axiological', name: '价值论', icon: '💎' },
            { key: 'historical', name: '历史哲学', icon: '📜' },
            { key: 'social', name: '社会哲学', icon: '👥' },
            { key: 'technological', name: '技术哲学', icon: '⚙️' }
        ];
        
        let html = '';
        
        dimensions.forEach(dim => {
            if (philosophy[dim.key]) {
                const p = philosophy[dim.key];
                html += `
                    <div style="
                        background: rgba(255,255,255,0.05);
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 12px;
                    ">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <span style="font-size: 20px; margin-right: 10px;">${dim.icon}</span>
                            <h4 style="margin: 0; font-size: 14px; color: #667eea;">${dim.name}</h4>
                        </div>
                        <div style="font-size: 13px; color: #aaa; margin-bottom: 8px;">
                            ${p.question}
                        </div>
                        <div style="font-size: 12px; color: #ccc; line-height: 1.6;">
                            ${p.analysis}
                        </div>
                        <div style="
                            margin-top: 10px;
                            padding: 8px;
                            background: rgba(102, 126, 234, 0.2);
                            border-radius: 6px;
                            font-size: 12px;
                            color: #667eea;
                        ">
                            💡 ${p.insight}
                        </div>
                    </div>
                `;
            }
        });
        
        container.innerHTML = html || '<div style="color: #666;">暂无哲学思辨</div>';
    }
    
    renderPerspectives(perspectives) {
        const container = this.container.querySelector('.perspectives-content');
        
        if (!perspectives || Object.keys(perspectives).length === 0) {
            container.innerHTML = '<div style="color: #666;">暂无多元视角</div>';
            return;
        }
        
        let html = '';
        
        Object.entries(perspectives).forEach(([key, p]) => {
            html += `
                <div style="
                    background: rgba(255,255,255,0.05);
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 12px;
                ">
                    <h4 style="font-size: 14px; margin: 0 0 10px 0; color: #22c55e;">
                        ${p.view}
                    </h4>
                    <div style="font-size: 12px; color: #4ecdc4; margin-bottom: 8px;">
                        ✓ ${p.argument}
                    </div>
                    <div style="font-size: 12px; color: #ff6b6b;">
                        ✗ ${p.counterArgument}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    renderWisdom(wisdom) {
        const container = this.container.querySelector('.wisdom-content');
        
        if (!wisdom) {
            container.innerHTML = '<div style="color: #666;">暂无核心洞察</div>';
            return;
        }
        
        container.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
                padding: 20px;
                border-radius: 12px;
            ">
                <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 5px;">核心洞察</div>
                    <div style="font-size: 16px; font-weight: bold; color: #667eea;">
                        ${wisdom.insight}
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 5px;">历史教训</div>
                    <div style="font-size: 14px; color: #ccc;">
                        ${wisdom.lesson}
                    </div>
                </div>
                
                <div>
                    <div style="font-size: 12px; color: #888; margin-bottom: 5px;">当代意义</div>
                    <div style="font-size: 14px; color: #22c55e;">
                        ${wisdom.relevance}
                    </div>
                </div>
            </div>
        `;
    }
    
    async askQuestion(question) {
        if (!this.currentAnalysis) {
            alert('请先选择一个历史节点进行分析');
            return;
        }
        
        const answer = await this.app.enhancedAI.philosophicalQA(question, {
            currentNode: this.currentAnalysis
        });
        
        // 显示答案
        this.showAnswer(answer);
    }
    
    showAnswer(answer) {
        // 在界面上显示答案
        const container = this.container.querySelector('.philosophy-content');
        
        const answerDiv = document.createElement('div');
        answerDiv.style.cssText = `
            background: rgba(34, 197, 94, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 3px solid #22c55e;
        `;
        
        answerDiv.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #22c55e;">🤖 AI回答</h4>
            <div style="font-size: 13px; color: #ccc; line-height: 1.6;">
                ${answer.directAnswer}
            </div>
        `;
        
        container.appendChild(answerDiv);
        
        // 滚动到答案
        answerDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    showLoading() {
        const container = this.container.querySelector('.philosophy-content');
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 300px;
                color: #667eea;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">🧠</div>
                <div style="font-size: 16px;">AI正在进行深度哲学思辨...</div>
                <div style="font-size: 12px; color: #888; margin-top: 10px;">
                    运用多种哲学维度进行分析
                </div>
            </div>
        `;
    }
    
    hideLoading() {
        // 加载完成，内容由renderAnalysis填充
    }
}

// 导出到全局
window.PhilosophyUI = PhilosophyUI;
