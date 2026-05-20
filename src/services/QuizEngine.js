/**
 * 历史问答引擎 v1.0
 * 基于现有数据自动生成选择题、计分系统、进度跟踪
 */

class QuizEngine {
    static QUESTION_TYPES = {
        MULTIPLE_CHOICE: 'multiple-choice',
        TIMELINE_ORDER: 'timeline-order',
        MATCHING: 'matching',
        TRUE_FALSE: 'true-false',
        FILL_BLANK: 'fill-blank'
    };

    static PERIODS = [
        { name: '春秋', start: -770, end: -476 },
        { name: '战国', start: -475, end: -221 },
        { name: '秦汉', start: -221, end: 220 },
        { name: '三国', start: 220, end: 280 },
        { name: '唐宋', start: 618, end: 1279 },
        { name: '明清', start: 1368, end: 1911 },
        { name: '近现代', start: 1911, end: 2024 }
    ];

    static CATEGORIES = ['politics', 'technology', 'culture', 'economy', 'military'];

    static CATEGORY_NAMES = {
        politics: '政治',
        technology: '科技',
        culture: '文化',
        economy: '经济',
        military: '军事'
    };

    static LOCATIONS = ['长安', '洛阳', '北京', '南京', '开封', '杭州', '成都'];

    static STORAGE_KEY = 'historyTree_quizProgress';
    static MAX_HISTORY_SIZE = 20;

    constructor(app) {
        this.app = app;
        this.name = 'quizEngine';
        this.version = '1.0.0';

        this.currentQuiz = null;
        this.quizHistory = [];

        this.stats = {
            totalQuizzes: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            averageScore: 0
        };

        this.questionTypes = QuizEngine.QUESTION_TYPES;
        this.periods = [...QuizEngine.PERIODS];
        this.categories = [...QuizEngine.CATEGORIES];

        this.uiContainer = null;
        this.isVisible = false;
        this.quizContent = null;
        this.quizFooter = null;
    }

    /**
     * 初始化
     */
    init() {
        this.loadProgress();
        this.setupEventListeners();
        console.log('📝 Quiz Engine initialized');
    }

    /**
     * 生成测验
     */
    generateQuiz(options = {}) {
        const {
            type = null,
            category = null,
            period = null,
            difficulty = 'medium',
            count = 10
        } = options;

        // 获取符合条件的节点
        const nodes = this.getEligibleNodes({ category, period, count: count * 3 });

        if (nodes.length < count) {
            console.warn(`Not enough nodes for quiz: found ${nodes.length}, need ${count}`);
        }

        // 随机选择节点
        const selectedNodes = this.shuffle(nodes).slice(0, Math.min(count, nodes.length));

        // 生成问题
        const questions = selectedNodes.map((node, index) => {
            const questionType = type || this.selectQuestionType(difficulty);
            return this.createQuestion(node, questionType, index);
        });

        // 创建测验
        this.currentQuiz = {
            id: 'quiz_' + Date.now(),
            questions,
            currentIndex: 0,
            score: 0,
            startTime: Date.now(),
            answers: {},
            options: { category, period, difficulty }
        };

        return this.currentQuiz;
    }

    /**
     * 获取符合条件的节点
     */
    getEligibleNodes(filters) {
        let nodes = Array.from(this.app.dataService.nodes.values());

        // 过滤掉没有足够信息的节点
        nodes = nodes.filter(node => {
            return node.name && node.time?.year && node.summary;
        });

        if (filters.category) {
            nodes = nodes.filter(n => n.category?.primary === filters.category);
        }

        if (filters.period) {
            const periodData = this.periods.find(p => p.name === filters.period);
            if (periodData) {
                nodes = nodes.filter(n => {
                    const year = n.time?.year;
                    return year >= periodData.start && year <= periodData.end;
                });
            }
        }

        return nodes;
    }

    /**
     * 选择问题类型
     */
    selectQuestionType(difficulty) {
        const types = {
            easy: [this.questionTypes.MULTIPLE_CHOICE, this.questionTypes.TRUE_FALSE],
            medium: [this.questionTypes.MULTIPLE_CHOICE, this.questionTypes.TRUE_FALSE, this.questionTypes.FILL_BLANK],
            hard: [this.questionTypes.MULTIPLE_CHOICE, this.questionTypes.TIMELINE_ORDER, this.questionTypes.MATCHING]
        };

        const availableTypes = types[difficulty] || types.medium;
        return availableTypes[Math.floor(Math.random() * availableTypes.length)];
    }

    /**
     * 创建问题
     */
    createQuestion(node, type, index) {
        const creators = {
            [this.questionTypes.MULTIPLE_CHOICE]: () => this.createMultipleChoiceQuestion(node),
            [this.questionTypes.TIMELINE_ORDER]: () => this.createTimelineQuestion(node),
            [this.questionTypes.MATCHING]: () => this.createMatchingQuestion(node),
            [this.questionTypes.TRUE_FALSE]: () => this.createTrueFalseQuestion(node),
            [this.questionTypes.FILL_BLANK]: () => this.createFillBlankQuestion(node)
        };

        const question = creators[type] ? creators[type]() : this.createMultipleChoiceQuestion(node);
        question.index = index;
        return question;
    }

    /**
     * 创建选择题
     */
    createMultipleChoiceQuestion(node) {
        const templates = [
            {
                question: `【{name}】发生在哪个时期？`,
                correct: () => this.getPeriodForYear(node.time.year),
                getOptions: (correct) => this.getPeriodOptions(correct)
            },
            {
                question: `【{name}】属于哪个类别？`,
                correct: () => this.getCategoryName(node.category.primary),
                getOptions: (correct) => this.getCategoryOptions(correct)
            },
            {
                question: `【{name}】发生在哪一年？`,
                correct: () => node.time.displayDate,
                getOptions: (correct) => this.getYearOptions(node.time.year, correct)
            },
            {
                question: `【{name}】的主要地点在哪里？`,
                correct: () => node.location.name || '未知',
                getOptions: (correct) => this.getLocationOptions(correct)
            }
        ];

        const template = templates[Math.floor(Math.random() * templates.length)];
        const correct = template.correct();
        const options = template.getOptions(correct);

        return {
            type: this.questionTypes.MULTIPLE_CHOICE,
            nodeId: node.id,
            question: template.question.replace('{name}', node.name),
            options,
            correct,
            userAnswer: null,
            isCorrect: null,
            explanation: node.summary
        };
    }

    /**
     * 创建时间排序题
     */
    createTimelineQuestion(node) {
        // 获取同一时期的其他节点
        const year = node.time.year;
        const nodes = this.getEligibleNodes({});

        // 找到时间相近的节点
        const nearbyNodes = nodes
            .filter(n => Math.abs(n.time.year - year) < 200)
            .sort((a, b) => Math.abs(a.time.year - year) - Math.abs(b.time.year - year))
            .slice(0, 5);

        if (nearbyNodes.length < 3) {
            return this.createMultipleChoiceQuestion(node);
        }

        const events = nearbyNodes.map(n => ({
            id: n.id,
            name: n.name,
            year: n.time.year,
            displayDate: n.time.displayDate
        }));

        // 按年份排序作为正确答案
        const correctOrder = [...events].sort((a, b) => a.year - b.year).map(e => e.id);

        return {
            type: this.questionTypes.TIMELINE_ORDER,
            nodeId: node.id,
            question: '请将以下历史事件按时间顺序排列（从早到晚）：',
            events,
            correctOrder,
            userOrder: [],
            isCorrect: null
        };
    }

    /**
     * 创建匹配题
     */
    createMatchingQuestion(node) {
        const nodes = this.getEligibleNodes({});
        const selected = this.shuffle([...nodes].filter(n => n.time.year)).slice(0, 5);

        const pairs = selected.map(n => ({
            id: n.id,
            event: n.name,
            year: n.time.displayDate
        }));

        return {
            type: this.questionTypes.MATCHING,
            nodeId: node.id,
            question: '请将历史事件与对应的时间进行匹配：',
            pairs,
            userMatches: {},
            isCorrect: null
        };
    }

    /**
     * 创建判断题
     */
    createTrueFalseQuestion(node) {
        const statements = [
            { text: `【${node.name}】发生在${this.getPeriodForYear(node.time.year)}`, correct: true },
            { text: `【${node.name}】发生在${this.getCategoryName(node.category.primary)}领域`, correct: true },
            { text: `【${node.name}】发生在公元${Math.abs(node.time.year)}年`, correct: node.time.year > 0 }
        ];

        const selected = statements[Math.floor(Math.random() * statements.length)];

        // 50%概率反转正确答案
        const isReversed = Math.random() < 0.5;
        const question = isReversed
            ? selected.text.replace(this.getPeriodForYear(node.time.year) || this.getCategoryName(node.category.primary), this.getRandomOtherOption(node))
            : selected.text;

        return {
            type: this.questionTypes.TRUE_FALSE,
            nodeId: node.id,
            question: question + '。这个说法正确吗？',
            correct: isReversed ? !selected.correct : selected.correct,
            userAnswer: null,
            isCorrect: null,
            explanation: node.summary
        };
    }

    /**
     * 创建填空题
     */
    createFillBlankQuestion(node) {
        const templates = [
            { template: `______发生在${node.time.displayDate}。`, answer: node.name },
            { template: `${node.name}发生在______。`, answer: node.time.displayDate },
            { template: `${node.name}是______领域的重要事件。`, answer: this.getCategoryName(node.category.primary) }
        ];

        const selected = templates[Math.floor(Math.random() * templates.length)];

        return {
            type: this.questionTypes.FILL_BLANK,
            nodeId: node.id,
            question: selected.template,
            correct: selected.answer,
            userAnswer: null,
            isCorrect: null,
            explanation: node.summary
        };
    }

    /**
     * 提交答案
     */
    submitAnswer(questionIndex, answer) {
        if (!this.currentQuiz) return null;

        const question = this.currentQuiz.questions[questionIndex];
        if (!question) return null;

        question.userAnswer = answer;

        // 根据题目类型判断正确性
        switch (question.type) {
            case this.questionTypes.MULTIPLE_CHOICE:
            case this.questionTypes.TRUE_FALSE:
            case this.questionTypes.FILL_BLANK:
                question.isCorrect = answer === question.correct;
                break;

            case this.questionTypes.TIMELINE_ORDER:
                question.isCorrect = JSON.stringify(answer) === JSON.stringify(question.correctOrder);
                question.userOrder = answer;
                break;

            case this.questionTypes.MATCHING:
                const allCorrect = question.pairs.every(pair => answer[pair.id] === pair.year);
                question.isCorrect = allCorrect;
                question.userMatches = answer;
                break;
        }

        // 记录答案
        this.currentQuiz.answers[questionIndex] = {
            answer,
            isCorrect: question.isCorrect,
            time: Date.now() - this.currentQuiz.startTime
        };

        // 更新分数
        if (question.isCorrect) {
            this.currentQuiz.score++;
        }

        return question;
    }

    /**
     * 下一题
     */
    nextQuestion() {
        if (!this.currentQuiz) return null;

        this.currentQuiz.currentIndex++;

        // 检查是否完成
        if (this.currentQuiz.currentIndex >= this.currentQuiz.questions.length) {
            return this.finishQuiz();
        }

        return this.currentQuiz.questions[this.currentQuiz.currentIndex];
    }

    /**
     * 跳转到指定题目
     */
    goToQuestion(index) {
        if (!this.currentQuiz) return null;
        if (index < 0 || index >= this.currentQuiz.questions.length) return null;

        this.currentQuiz.currentIndex = index;
        return this.currentQuiz.questions[index];
    }

    /**
     * 完成测验
     */
    finishQuiz() {
        if (!this.currentQuiz) return null;

        const result = {
            id: this.currentQuiz.id,
            score: this.currentQuiz.score,
            total: this.currentQuiz.questions.length,
            percentage: (this.currentQuiz.score / this.currentQuiz.questions.length) * 100,
            duration: Date.now() - this.currentQuiz.startTime,
            questions: this.currentQuiz.questions,
            options: this.currentQuiz.options
        };

        // 更新统计
        this.updateStats(result);

        // 保存到历史
        this.quizHistory.push(result);
        this.saveProgress();

        // 触发事件
        this.app.eventBus.emit('quiz:completed', result);

        // 清空当前测验
        this.currentQuiz = null;

        return result;
    }

    /**
     * 更新统计
     */
    updateStats(result) {
        this.stats.totalQuizzes++;
        this.stats.totalQuestions += result.total;
        this.stats.correctAnswers += result.score;

        // 计算平均分
        this.stats.averageScore = (this.stats.correctAnswers / this.stats.totalQuestions) * 100;
    }

    /**
     * 获取统计
     */
    getStats() {
        return {
            ...this.stats,
            history: this.quizHistory
        };
    }

    /**
     * 获取进度
     */
    getProgress() {
        if (!this.currentQuiz) return null;

        return {
            current: this.currentQuiz.currentIndex + 1,
            total: this.currentQuiz.questions.length,
            percentage: ((this.currentQuiz.currentIndex + 1) / this.currentQuiz.questions.length) * 100,
            score: this.currentQuiz.score
        };
    }

    /**
     * 显示测验UI
     */
    showUI(options = {}) {
        if (this.isVisible) return;

        this.uiContainer = this.createUIContainer();
        document.body.appendChild(this.uiContainer);
        this.isVisible = true;

        // 自动开始测验
        if (options.autoStart !== false) {
            this.startNewQuiz(options);
        }
    }

    /**
     * 隐藏测验UI
     */
    hideUI() {
        if (this.uiContainer) {
            this.uiContainer.remove();
            this.uiContainer = null;
        }
        this.isVisible = false;
    }

    /**
     * 创建UI容器
     */
    createUIContainer() {
        const container = document.createElement('div');
        container.className = 'quiz-ui-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            right: -400px;
            width: 380px;
            height: 100vh;
            background: white;
            box-shadow: -2px 0 20px rgba(0,0,0,0.1);
            z-index: 2000;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        `;

        // 头部
        const header = document.createElement('div');
        header.className = 'quiz-header';
        header.style.cssText = `
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('h2');
        title.textContent = '历史问答';
        title.style.cssText = 'margin: 0; font-size: 18px;';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
        `;
        closeBtn.addEventListener('click', () => this.hideUI());

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 内容区
        const content = document.createElement('div');
        content.className = 'quiz-content';
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        `;

        // 底部控制栏
        const footer = document.createElement('div');
        footer.className = 'quiz-footer';
        footer.style.cssText = `
            padding: 15px 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(footer);

        // 添加样式
        setTimeout(() => {
            container.style.right = '0';
        }, 10);

        this.quizContent = content;
        this.quizFooter = footer;

        return container;
    }

    /**
     * 开始新测验
     */
    startNewQuiz(options) {
        const quiz = this.generateQuiz(options);
        this.renderQuestion(quiz.questions[0]);
        this.renderFooter();
    }

    /**
     * 渲染问题
     */
    renderQuestion(question) {
        if (!this.quizContent) return;

        this.quizContent.innerHTML = '';

        // 进度条
        const progress = this.getProgress();
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 100%;
            height: 6px;
            background: #eee;
            border-radius: 3px;
            margin-bottom: 20px;
            overflow: hidden;
        `;

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background: #667eea;
            border-radius: 3px;
            transition: width 0.3s ease;
        `;
        progressFill.style.width = progress ? `${progress.percentage}%` : '0%';

        progressBar.appendChild(progressFill);

        // 问题编号
        const questionNumber = document.createElement('div');
        questionNumber.style.cssText = `
            color: #999;
            font-size: 14px;
            margin-bottom: 10px;
        `;
        questionNumber.textContent = `问题 ${question.index + 1} / ${this.currentQuiz.questions.length}`;

        // 问题内容
        const questionText = document.createElement('div');
        questionText.style.cssText = `
            font-size: 16px;
            font-weight: 500;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #333;
        `;
        questionText.textContent = question.question;

        this.quizContent.appendChild(progressBar);
        this.quizContent.appendChild(questionNumber);
        this.quizContent.appendChild(questionText);

        // 根据类型渲染选项
        switch (question.type) {
            case this.questionTypes.MULTIPLE_CHOICE:
                this.renderMultipleChoiceOptions(question);
                break;
            case this.questionTypes.TRUE_FALSE:
                this.renderTrueFalseOptions(question);
                break;
            case this.questionTypes.FILL_BLANK:
                this.renderFillBlankInput(question);
                break;
            case this.questionTypes.TIMELINE_ORDER:
                this.renderTimelineOrderOptions(question);
                break;
            case this.questionTypes.MATCHING:
                this.renderMatchingOptions(question);
                break;
        }
    }

    /**
     * 渲染选择题选项
     */
    renderMultipleChoiceOptions(question) {
        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';

        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.style.cssText = `
                padding: 12px 16px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s ease;
                font-size: 14px;
            `;
            optionBtn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

            optionBtn.addEventListener('mouseenter', () => {
                optionBtn.style.borderColor = '#667eea';
                optionBtn.style.background = '#f8f9ff';
            });

            optionBtn.addEventListener('mouseleave', () => {
                optionBtn.style.borderColor = '#e0e0e0';
                optionBtn.style.background = 'white';
            });

            optionBtn.addEventListener('click', () => {
                this.handleAnswer(question.index, option);
            });

            optionsContainer.appendChild(optionBtn);
        });

        this.quizContent.appendChild(optionsContainer);
    }

    /**
     * 渲染判断题选项
     */
    renderTrueFalseOptions(question) {
        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = 'display: flex; gap: 15px;';

        const options = [
            { value: true, label: '正确 ✓' },
            { value: false, label: '错误 ✗' }
        ];

        options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.style.cssText = `
                flex: 1;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s ease;
            `;
            optionBtn.textContent = option.label;

            optionBtn.addEventListener('click', () => {
                this.handleAnswer(question.index, option.value);
            });

            optionsContainer.appendChild(optionBtn);
        });

        this.quizContent.appendChild(optionsContainer);
    }

    /**
     * 渲染填空题输入
     */
    renderFillBlankInput(question) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '请输入答案...';
        input.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        `;

        const submitBtn = document.createElement('button');
        submitBtn.textContent = '提交答案';
        submitBtn.style.cssText = `
            margin-top: 15px;
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
        `;

        submitBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                this.handleAnswer(question.index, input.value.trim());
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.handleAnswer(question.index, input.value.trim());
            }
        });

        this.quizContent.appendChild(input);
        this.quizContent.appendChild(submitBtn);
    }

    /**
     * 渲染时间排序题选项
     */
    renderTimelineOrderOptions(question) {
        const container = document.createElement('div');
        container.style.cssText = `
            border: 2px dashed #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            min-height: 200px;
        `;

        const items = this.shuffle([...question.events]);

        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.draggable = true;
            itemDiv.style.cssText = `
                padding: 10px 15px;
                background: #f8f9ff;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                margin-bottom: 8px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            itemDiv.innerHTML = `
                <span>${item.name}</span>
                <span style="color: #999; font-size: 12px;">拖动排序</span>
            `;

            // 拖拽事件
            itemDiv.addEventListener('dragstart', () => {
                itemDiv.style.opacity = '0.5';
            });

            itemDiv.addEventListener('dragend', () => {
                itemDiv.style.opacity = '1';
            });

            container.appendChild(itemDiv);
        });

        const submitBtn = document.createElement('button');
        submitBtn.textContent = '提交排序';
        submitBtn.style.cssText = `
            margin-top: 15px;
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        `;

        submitBtn.addEventListener('click', () => {
            const order = question.events.map(e => e.id);
            this.handleAnswer(question.index, order);
        });

        this.quizContent.appendChild(container);
        this.quizContent.appendChild(submitBtn);
    }

    /**
     * 渲染匹配题选项
     */
    renderMatchingOptions(question) {
        const container = document.createElement('div');
        container.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px;';

        const years = this.shuffle([...question.pairs].map(p => p.year));

        question.pairs.forEach(pair => {
            const pairDiv = document.createElement('div');
            pairDiv.style.cssText = `
                padding: 10px;
                background: #f8f9ff;
                border-radius: 6px;
                font-size: 12px;
            `;
            pairDiv.innerHTML = `<strong>${pair.event}</strong>`;

            const select = document.createElement('select');
            select.style.cssText = `
                width: 100%;
                margin-top: 5px;
                padding: 5px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
            `;
            select.innerHTML = '<option value="">请选择</option>' +
                years.map(y => `<option value="${y}">${y}</option>`).join('');

            pairDiv.appendChild(select);
            container.appendChild(pairDiv);
        });

        const submitBtn = document.createElement('button');
        submitBtn.textContent = '提交匹配';
        submitBtn.style.cssText = `
            grid-column: 1 / -1;
            margin-top: 15px;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        `;

        submitBtn.addEventListener('click', () => {
            const matches = {};
            question.pairs.forEach(pair => {
                matches[pair.id] = pair.year;
            });
            this.handleAnswer(question.index, matches);
        });

        this.quizContent.appendChild(container);
        this.quizContent.appendChild(submitBtn);
    }

    /**
     * 渲染底部控制栏
     */
    renderFooter() {
        if (!this.quizFooter) return;

        const progress = this.getProgress();

        this.quizFooter.innerHTML = `
            <div style="color: #666; font-size: 14px;">
                得分: <strong style="color: #667eea;">${progress ? progress.score : 0}</strong> / ${this.currentQuiz ? this.currentQuiz.questions.length : 0}
            </div>
            <button id="skipBtn" style="
                padding: 8px 16px;
                background: #f0f0f0;
                color: #666;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            ">跳过</button>
        `;

        document.getElementById('skipBtn').addEventListener('click', () => {
            this.nextQuestion();
        });
    }

    /**
     * 处理答案
     */
    handleAnswer(questionIndex, answer) {
        const result = this.submitAnswer(questionIndex, answer);

        if (result) {
            // 显示反馈
            this.showAnswerFeedback(result);

            // 延迟后进入下一题
            setTimeout(() => {
                const next = this.nextQuestion();
                if (next && typeof next === 'object') {
                    this.renderQuestion(next);
                    this.renderFooter();
                } else if (typeof next === 'object' && next.total !== undefined) {
                    // 测验完成
                    this.showResults(next);
                }
            }, 1500);
        }
    }

    /**
     * 显示答案反馈
     */
    showAnswerFeedback(result) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 30px 40px;
            background: ${result.isCorrect ? '#4caf50' : '#f44336'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 3000;
            text-align: center;
            animation: popIn 0.3s ease;
        `;

        feedback.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 10px;">
                ${result.isCorrect ? '✓' : '✗'}
            </div>
            <div style="font-size: 18px; font-weight: bold;">
                ${result.isCorrect ? '回答正确！' : '回答错误'}
            </div>
            ${!result.isCorrect && result.explanation ? `
                <div style="margin-top: 10px; font-size: 14px; opacity: 0.9;">
                    正确答案: ${result.correct}
                </div>
            ` : ''}
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.animation = 'popOut 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 1200);
    }

    /**
     * 显示测验结果
     */
    showResults(result) {
        if (!this.quizContent) return;

        const percentage = result.percentage;
        let grade, gradeColor;

        if (percentage >= 90) {
            grade = '优秀';
            gradeColor = '#4caf50';
        } else if (percentage >= 70) {
            grade = '良好';
            gradeColor = '#2196f3';
        } else if (percentage >= 60) {
            grade = '及格';
            gradeColor = '#ff9800';
        } else {
            grade = '需加强';
            gradeColor = '#f44336';
        }

        this.quizContent.innerHTML = `
            <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 64px; margin-bottom: 20px;">
                    ${percentage >= 60 ? '🎉' : '📚'}
                </div>
                <h2 style="margin: 0 0 10px 0; color: #333;">测验完成！</h2>
                <div style="
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 8px solid ${gradeColor};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 20px auto;
                    font-size: 32px;
                    font-weight: bold;
                    color: ${gradeColor};
                ">
                    ${Math.round(percentage)}%
                </div>
                <div style="font-size: 18px; color: #666; margin-bottom: 20px;">
                    答对 ${result.score} / ${result.total} 题
                </div>
                <div style="
                    display: inline-block;
                    padding: 8px 20px;
                    background: ${gradeColor};
                    color: white;
                    border-radius: 20px;
                    font-size: 14px;
                    margin-bottom: 20px;
                ">
                    评级: ${grade}
                </div>
                <div style="color: #999; font-size: 14px;">
                    用时: ${Math.round(result.duration / 1000)} 秒
                </div>
            </div>
        `;

        this.quizFooter.innerHTML = `
            <button id="retryBtn" style="
                padding: 10px 20px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            ">再测一次</button>
            <button id="closeBtn" style="
                padding: 10px 20px;
                background: #f0f0f0;
                color: #666;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            ">关闭</button>
        `;

        document.getElementById('retryBtn').addEventListener('click', () => {
            this.startNewQuiz(this.currentQuiz ? this.currentQuiz.options : {});
        });

        document.getElementById('closeBtn').addEventListener('click', () => {
            this.hideUI();
        });
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        this.app.eventBus.on('quiz:start', (options) => {
            this.showUI(options);
        });
    }

    /**
     * 保存进度
     */
    saveProgress() {
        try {
            localStorage.setItem(QuizEngine.STORAGE_KEY, JSON.stringify({
                stats: this.stats,
                history: this.quizHistory.slice(-QuizEngine.MAX_HISTORY_SIZE)
            }));
        } catch (e) {
            console.warn('Failed to save quiz progress:', e);
        }
    }

    /**
     * 加载进度
     */
    loadProgress() {
        try {
            const data = localStorage.getItem(QuizEngine.STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                this.stats = { ...this.stats, ...parsed.stats };
                this.quizHistory = parsed.history || [];
            }
        } catch (e) {
            console.warn('Failed to load quiz progress:', e);
        }
    }

    /**
     * 辅助方法：获取年份选项
     */
    getYearOptions(correctYear, correctDisplay) {
        const options = [correctDisplay];
        const offsets = [50, 100, 200, 500];

        offsets.forEach(offset => {
            const year = correctYear + offset * (Math.random() > 0.5 ? 1 : -1);
            options.push(year < 0 ? `公元前${Math.abs(year)}年` : `${year}年`);
        });

        return this.shuffle(options).slice(0, 4);
    }

    /**
     * 辅助方法：获取时期选项
     */
    getPeriodOptions(correct) {
        const options = [correct];
        this.periods.forEach(p => {
            if (p.name !== correct) options.push(p.name);
        });
        return this.shuffle(options).slice(0, 4);
    }

    /**
     * 辅助方法：获取分类选项
     */
    getCategoryOptions(correct) {
        const options = [correct];
        this.categories.forEach(c => {
            const name = this.getCategoryName(c);
            if (name !== correct) options.push(name);
        });
        return this.shuffle(options).slice(0, 4);
    }

    /**
     * 辅助方法：获取地点选项
     */
    getLocationOptions(correct) {
        const options = [correct, ...QuizEngine.LOCATIONS.filter(loc => loc !== correct)];
        return this.shuffle(options).slice(0, 4);
    }

    /**
     * 辅助方法：获取分类名称
     */
    getCategoryName(category) {
        return QuizEngine.CATEGORY_NAMES[category] || category;
    }

    /**
     * 辅助方法：根据年份获取时期
     */
    getPeriodForYear(year) {
        return this.periods.find(p => year >= p.start && year <= p.end)?.name || '未知';
    }

    /**
     * 辅助方法：获取随机其他选项
     */
    getRandomOtherOption(node) {
        const year = node.time?.year || 0;
        const otherPeriods = this.periods.filter(p => !(year >= p.start && year <= p.end));
        return otherPeriods[Math.floor(Math.random() * otherPeriods.length)]?.name || '其他';
    }

    /**
     * 辅助方法：打乱数组
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * 销毁
     */
    destroy() {
        this.hideUI();
        this.currentQuiz = null;
    }
}

window.QuizEngine = QuizEngine;
