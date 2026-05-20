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

        // 创建头部
        const header = this.createHeader();
        this.container.appendChild(header);

        // 创建内容区域
        const content = this.createContent();
        this.container.appendChild(content);

        // 创建输入区域
        const inputDiv = this.createInput();
        this.container.appendChild(inputDiv);

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

    /**
     * 创建头部
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'philosophy-header';
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: white;
        `;

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

        const titleDiv = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.style.cssText = 'margin: 0; font-size: 20px;';
        h2.textContent = '🧠 哲学思辨';

        const p = document.createElement('p');
        p.style.cssText = 'margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;';
        p.textContent = '深度分析与哲学思辨';

        titleDiv.appendChild(h2);
        titleDiv.appendChild(p);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
        `;
        closeBtn.textContent = '×';

        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(closeBtn);
        header.appendChild(headerDiv);

        return header;
    }

    /**
     * 创建内容区域
     */
    createContent() {
        const content = document.createElement('div');
        content.className = 'philosophy-content';
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            color: white;
        `;

        const sections = [
            { title: '🔍 关联发现', className: 'discovery-content', color: '#667eea' },
            { title: '💭 哲学思辨', className: 'philosophy-content-inner', color: '#a855f7' },
            { title: '⚖️ 多元视角', className: 'perspectives-content', color: '#22c55e' },
            { title: '💡 核心洞察', className: 'wisdom-content', color: '#f59e0b' }
        ];

        sections.forEach(({ title, className, color }) => {
            const section = document.createElement('div');
            section.className = 'analysis-section';
            if (className !== 'discovery-content') {
                section.style.marginTop = '30px';
            }

            const h3 = document.createElement('h3');
            h3.style.cssText = 'font-size: 16px; margin: 0 0 15px 0;';
            h3.style.color = color;
            h3.textContent = title;

            const contentDiv = document.createElement('div');
            contentDiv.className = className;

            section.appendChild(h3);
            section.appendChild(contentDiv);
            content.appendChild(section);
        });

        return content;
    }

    /**
     * 创建输入区域
     */
    createInput() {
        const inputDiv = document.createElement('div');
        inputDiv.className = 'philosophy-input';
        inputDiv.style.cssText = `
            padding: 15px;
            background: rgba(0,0,0,0.3);
            border-top: 1px solid rgba(255,255,255,0.1);
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'question-input';
        input.placeholder = '提出哲学问题...';
        input.style.cssText = `
            width: 100%;
            padding: 12px 15px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            color: white;
            font-size: 14px;
            outline: none;
        `;

        inputDiv.appendChild(input);

        return inputDiv;
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
        container.replaceChildren();

        if (!discovery || (!discovery.causal?.length && !discovery.dialectical?.length)) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'color: #666;';
            emptyDiv.textContent = '暂无发现';
            container.appendChild(emptyDiv);
            return;
        }

        // 因果发现
        if (discovery.causal && discovery.causal.length > 0) {
            const causalDiv = document.createElement('div');
            causalDiv.style.cssText = 'margin-bottom: 15px;';

            const h4 = document.createElement('h4');
            h4.style.cssText = 'font-size: 14px; margin: 0 0 10px 0; color: #4ecdc4;';
            h4.textContent = '🔗 因果链条';
            causalDiv.appendChild(h4);

            discovery.causal.forEach(c => {
                const item = document.createElement('div');
                item.style.cssText = `
                    background: rgba(255,255,255,0.05);
                    padding: 10px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    border-left: 3px solid #4ecdc4;
                `;

                const eventDiv = document.createElement('div');
                eventDiv.style.cssText = 'font-weight: bold; margin-bottom: 5px;';
                eventDiv.textContent = c.event;

                const mechDiv = document.createElement('div');
                mechDiv.style.cssText = 'font-size: 12px; color: #aaa;';
                mechDiv.textContent = c.mechanism;

                const confDiv = document.createElement('div');
                confDiv.style.cssText = 'font-size: 11px; color: #888; margin-top: 5px;';
                confDiv.textContent = `置信度: ${(c.confidence * 100).toFixed(0)}%`;

                item.appendChild(eventDiv);
                item.appendChild(mechDiv);
                item.appendChild(confDiv);
                causalDiv.appendChild(item);
            });

            container.appendChild(causalDiv);
        }

        // 辩证发现
        if (discovery.dialectical && discovery.dialectical.length > 0) {
            const dialecticalDiv = document.createElement('div');
            dialecticalDiv.style.cssText = 'margin-bottom: 15px;';

            const h4 = document.createElement('h4');
            h4.style.cssText = 'font-size: 14px; margin: 0 0 10px 0; color: #a855f7;';
            h4.textContent = '⚖️ 辩证关系';
            dialecticalDiv.appendChild(h4);

            discovery.dialectical.forEach(d => {
                const item = document.createElement('div');
                item.style.cssText = `
                    background: rgba(168, 85, 247, 0.1);
                    padding: 10px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                `;

                const contradictionDiv = document.createElement('div');
                contradictionDiv.style.cssText = 'font-size: 12px; color: #aaa; margin-bottom: 5px;';
                contradictionDiv.textContent = `矛盾：${d.contradiction}`;

                const flexDiv = document.createElement('div');
                flexDiv.style.cssText = 'display: flex; gap: 8px; font-size: 11px;';

                const thesisSpan = document.createElement('span');
                thesisSpan.style.cssText = 'flex: 1; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 4px;';
                thesisSpan.textContent = `正题：${d.thesis}`;

                const antithesisSpan = document.createElement('span');
                antithesisSpan.style.cssText = 'flex: 1; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 4px;';
                antithesisSpan.textContent = `反题：${d.antithesis}`;

                flexDiv.appendChild(thesisSpan);
                flexDiv.appendChild(antithesisSpan);

                const synthesisDiv = document.createElement('div');
                synthesisDiv.style.cssText = 'font-size: 12px; margin-top: 5px; color: #22c55e;';
                synthesisDiv.textContent = `合题：${d.synthesis}`;

                item.appendChild(contradictionDiv);
                item.appendChild(flexDiv);
                item.appendChild(synthesisDiv);
                dialecticalDiv.appendChild(item);
            });

            container.appendChild(dialecticalDiv);
        }
    }
    
    renderPhilosophy(philosophy) {
        const container = this.container.querySelector('.philosophy-content-inner');
        container.replaceChildren();

        const dimensions = [
            { key: 'ontological', name: '本体论', icon: '🎯' },
            { key: 'epistemological', name: '认识论', icon: '👁️' },
            { key: 'axiological', name: '价值论', icon: '💎' },
            { key: 'historical', name: '历史哲学', icon: '📜' },
            { key: 'social', name: '社会哲学', icon: '👥' },
            { key: 'technological', name: '技术哲学', icon: '⚙️' }
        ];

        let hasContent = false;

        dimensions.forEach(dim => {
            if (philosophy && philosophy[dim.key]) {
                hasContent = true;
                const p = philosophy[dim.key];

                const item = document.createElement('div');
                item.style.cssText = `
                    background: rgba(255,255,255,0.05);
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 12px;
                `;

                const headerDiv = document.createElement('div');
                headerDiv.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px;';

                const iconSpan = document.createElement('span');
                iconSpan.style.cssText = 'font-size: 20px; margin-right: 10px;';
                iconSpan.textContent = dim.icon;

                const h4 = document.createElement('h4');
                h4.style.cssText = 'margin: 0; font-size: 14px; color: #667eea;';
                h4.textContent = dim.name;

                headerDiv.appendChild(iconSpan);
                headerDiv.appendChild(h4);

                const questionDiv = document.createElement('div');
                questionDiv.style.cssText = 'font-size: 13px; color: #aaa; margin-bottom: 8px;';
                questionDiv.textContent = p.question;

                const analysisDiv = document.createElement('div');
                analysisDiv.style.cssText = 'font-size: 12px; color: #ccc; line-height: 1.6;';
                analysisDiv.textContent = p.analysis;

                const insightDiv = document.createElement('div');
                insightDiv.style.cssText = `
                    margin-top: 10px;
                    padding: 8px;
                    background: rgba(102, 126, 234, 0.2);
                    border-radius: 6px;
                    font-size: 12px;
                    color: #667eea;
                `;
                insightDiv.textContent = `💡 ${p.insight}`;

                item.appendChild(headerDiv);
                item.appendChild(questionDiv);
                item.appendChild(analysisDiv);
                item.appendChild(insightDiv);

                container.appendChild(item);
            }
        });

        if (!hasContent) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'color: #666;';
            emptyDiv.textContent = '暂无哲学思辨';
            container.appendChild(emptyDiv);
        }
    }
    
    renderPerspectives(perspectives) {
        const container = this.container.querySelector('.perspectives-content');
        container.replaceChildren();

        if (!perspectives || Object.keys(perspectives).length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'color: #666;';
            emptyDiv.textContent = '暂无多元视角';
            container.appendChild(emptyDiv);
            return;
        }

        Object.entries(perspectives).forEach(([key, p]) => {
            const item = document.createElement('div');
            item.style.cssText = `
                background: rgba(255,255,255,0.05);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 12px;
            `;

            const h4 = document.createElement('h4');
            h4.style.cssText = 'font-size: 14px; margin: 0 0 10px 0; color: #22c55e;';
            h4.textContent = p.view;

            const argumentDiv = document.createElement('div');
            argumentDiv.style.cssText = 'font-size: 12px; color: #4ecdc4; margin-bottom: 8px;';
            argumentDiv.textContent = `✓ ${p.argument}`;

            const counterDiv = document.createElement('div');
            counterDiv.style.cssText = 'font-size: 12px; color: #ff6b6b;';
            counterDiv.textContent = `✗ ${p.counterArgument}`;

            item.appendChild(h4);
            item.appendChild(argumentDiv);
            item.appendChild(counterDiv);

            container.appendChild(item);
        });
    }
    
    renderWisdom(wisdom) {
        const container = this.container.querySelector('.wisdom-content');
        container.replaceChildren();

        if (!wisdom) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'color: #666;';
            emptyDiv.textContent = '暂无核心洞察';
            container.appendChild(emptyDiv);
            return;
        }

        const wisdomDiv = document.createElement('div');
        wisdomDiv.style.cssText = `
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
            padding: 20px;
            border-radius: 12px;
        `;

        // 核心洞察
        const insightSection = document.createElement('div');
        insightSection.style.cssText = 'margin-bottom: 15px;';

        const insightLabel = document.createElement('div');
        insightLabel.style.cssText = 'font-size: 12px; color: #888; margin-bottom: 5px;';
        insightLabel.textContent = '核心洞察';

        const insightContent = document.createElement('div');
        insightContent.style.cssText = 'font-size: 16px; font-weight: bold; color: #667eea;';
        insightContent.textContent = wisdom.insight;

        insightSection.appendChild(insightLabel);
        insightSection.appendChild(insightContent);
        wisdomDiv.appendChild(insightSection);

        // 历史教训
        const lessonSection = document.createElement('div');
        lessonSection.style.cssText = 'margin-bottom: 15px;';

        const lessonLabel = document.createElement('div');
        lessonLabel.style.cssText = 'font-size: 12px; color: #888; margin-bottom: 5px;';
        lessonLabel.textContent = '历史教训';

        const lessonContent = document.createElement('div');
        lessonContent.style.cssText = 'font-size: 14px; color: #ccc;';
        lessonContent.textContent = wisdom.lesson;

        lessonSection.appendChild(lessonLabel);
        lessonSection.appendChild(lessonContent);
        wisdomDiv.appendChild(lessonSection);

        // 当代意义
        const relevanceSection = document.createElement('div');

        const relevanceLabel = document.createElement('div');
        relevanceLabel.style.cssText = 'font-size: 12px; color: #888; margin-bottom: 5px;';
        relevanceLabel.textContent = '当代意义';

        const relevanceContent = document.createElement('div');
        relevanceContent.style.cssText = 'font-size: 14px; color: #22c55e;';
        relevanceContent.textContent = wisdom.relevance;

        relevanceSection.appendChild(relevanceLabel);
        relevanceSection.appendChild(relevanceContent);
        wisdomDiv.appendChild(relevanceSection);

        container.appendChild(wisdomDiv);
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

        const h4 = document.createElement('h4');
        h4.style.cssText = 'margin: 0 0 10px 0; color: #22c55e;';
        h4.textContent = '🤖 AI回答';

        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'font-size: 13px; color: #ccc; line-height: 1.6;';
        contentDiv.textContent = answer.directAnswer;

        answerDiv.appendChild(h4);
        answerDiv.appendChild(contentDiv);

        container.appendChild(answerDiv);

        // 滚动到答案
        answerDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    showLoading() {
        const container = this.container.querySelector('.philosophy-content');
        container.replaceChildren();

        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: #667eea;
        `;

        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = 'font-size: 48px; margin-bottom: 20px;';
        iconDiv.textContent = '🧠';

        const textDiv = document.createElement('div');
        textDiv.style.cssText = 'font-size: 16px;';
        textDiv.textContent = 'AI正在进行深度哲学思辨...';

        const hintDiv = document.createElement('div');
        hintDiv.style.cssText = 'font-size: 12px; color: #888; margin-top: 10px;';
        hintDiv.textContent = '运用多种哲学维度进行分析';

        loadingDiv.appendChild(iconDiv);
        loadingDiv.appendChild(textDiv);
        loadingDiv.appendChild(hintDiv);

        container.appendChild(loadingDiv);
    }
    
    hideLoading() {
        // 加载完成，内容由renderAnalysis填充
    }

    /**
     * 销毁组件，清理资源防止内存泄漏
     */
    destroy() {
        // 清理事件监听器
        if (this.container) {
            const closeBtn = this.container.querySelector('.close-btn');
            const questionInput = this.container.querySelector('.question-input');

            if (closeBtn) {
                const newBtn = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newBtn, closeBtn);
            }
            if (questionInput) {
                const newInput = questionInput.cloneNode(true);
                questionInput.parentNode.replaceChild(newInput, questionInput);
            }
        }

        // 清理定时器
        if (this.analysisTimer) {
            clearTimeout(this.analysisTimer);
            this.analysisTimer = null;
        }

        // 清理容器
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }

        this.container = null;
        this.app = null;
    }
}

// 导出到全局
window.PhilosophyUI = PhilosophyUI;
