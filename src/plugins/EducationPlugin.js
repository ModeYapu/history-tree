/**
 * 教育插件 - 测验和学习系统
 */

class EducationPlugin {
    constructor(app) {
        this.app = app;
        this.name = 'education';
        this.version = '1.0.0';
        
        this.currentQuiz = null;
        this.score = 0;
        this.progress = {
            completed: 0,
            total: 0,
            percentage: 0
        };
    }
    
    init() {
        console.log('📚 Education Plugin initialized');
    }
    
    /**
     * 生成测验
     */
    generateQuiz(options = {}) {
        const {
            type = 'multiple-choice',
            category = null,
            period = null,
            count = 10
        } = options;
        
        // 获取数据
        const filters = {};
        if (category) filters.category = category;
        if (period) filters.period = period;
        
        const nodes = this.app.dataService.filter(filters);
        
        // 随机选择
        const selected = this.shuffle(nodes).slice(0, count);
        
        // 生成问题
        const questions = selected.map(node => this.createQuestion(node, type));
        
        this.currentQuiz = {
            questions,
            currentIndex: 0,
            score: 0,
            startTime: Date.now()
        };
        
        return this.currentQuiz;
    }
    
    /**
     * 创建问题
     */
    createQuestion(node, type) {
        const templates = {
            'multiple-choice': () => this.createMultipleChoice(node),
            'timeline': () => this.createTimelineQuestion(node),
            'matching': () => this.createMatchingQuestion(node)
        };
        
        return templates[type] ? templates[type]() : this.createMultipleChoice(node);
    }
    
    /**
     * 创建选择题
     */
    createMultipleChoice(node) {
        const questionTypes = [
            {
                question: `${node.name}发生在哪个时期？`,
                correct: node.time.period,
                getOptions: () => this.getPeriodOptions(node.time.period)
            },
            {
                question: `${node.name}属于哪个类别？`,
                correct: node.category.primary,
                getOptions: () => this.getCategoryOptions(node.category.primary)
            },
            {
                question: `${node.name}发生在哪一年？`,
                correct: node.time.displayDate,
                getOptions: () => this.getYearOptions(node.time.year)
            }
        ];
        
        const template = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        return {
            type: 'multiple-choice',
            node: node,
            question: template.question,
            options: template.getOptions(),
            correct: template.correct,
            userAnswer: null,
            isCorrect: null
        };
    }
    
    /**
     * 创建时间线问题
     */
    createTimelineQuestion(node) {
        const nodes = this.app.dataService.filter({ period: node.time.period });
        const selected = this.shuffle(nodes).slice(0, 4);
        
        return {
            type: 'timeline',
            question: '请按时间顺序排列以下事件：',
            nodes: selected,
            correctOrder: selected.map(n => n.id).sort((a, b) => {
                const nodeA = this.app.dataService.getNode(a);
                const nodeB = this.app.dataService.getNode(b);
                return nodeA.time.year - nodeB.time.year;
            }),
            userOrder: [],
            isCorrect: null
        };
    }
    
    /**
     * 创建匹配题
     */
    createMatchingQuestion(node) {
        const nodes = this.app.dataService.filter({ period: node.time.period });
        const selected = this.shuffle(nodes).slice(0, 5);
        
        return {
            type: 'matching',
            question: '请将事件与年份匹配：',
            pairs: selected.map(n => ({
                event: n.name,
                year: n.time.displayDate
            })),
            userMatches: {},
            isCorrect: null
        };
    }
    
    /**
     * 获取时期选项
     */
    getPeriodOptions(correct) {
        const periods = ['远古时代', '古代', '中世纪', '近代', '现代'];
        return this.shuffle([correct, ...periods.filter(p => p !== correct)].slice(0, 4));
    }
    
    /**
     * 获取分类选项
     */
    getCategoryOptions(correct) {
        const categories = ['政治', '科技', '文化', '经济', '军事'];
        const map = {
            politics: '政治',
            technology: '科技',
            culture: '文化',
            economy: '经济',
            military: '军事'
        };
        return this.shuffle([map[correct], ...categories.filter(c => c !== map[correct])].slice(0, 4));
    }
    
    /**
     * 获取年份选项
     */
    getYearOptions(correctYear) {
        const options = [correctYear];
        const offset = Math.floor(Math.random() * 100) + 50;
        
        options.push(correctYear - offset);
        options.push(correctYear + offset);
        options.push(correctYear - offset * 2);
        
        return this.shuffle(options).map(y => {
            if (y === null) return '未知';
            return y < 0 ? `公元前${Math.abs(y)}年` : `${y}年`;
        });
    }
    
    /**
     * 提交答案
     */
    submitAnswer(answer) {
        if (!this.currentQuiz) return null;
        
        const question = this.currentQuiz.questions[this.currentQuiz.currentIndex];
        question.userAnswer = answer;
        question.isCorrect = answer === question.correct;
        
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
        
        if (this.currentQuiz.currentIndex >= this.currentQuiz.questions.length) {
            return this.finishQuiz();
        }
        
        return this.currentQuiz.questions[this.currentQuiz.currentIndex];
    }
    
    /**
     * 完成测验
     */
    finishQuiz() {
        const result = {
            score: this.currentQuiz.score,
            total: this.currentQuiz.questions.length,
            percentage: (this.currentQuiz.score / this.currentQuiz.questions.length) * 100,
            time: Date.now() - this.currentQuiz.startTime,
            questions: this.currentQuiz.questions
        };
        
        // 更新进度
        this.progress.completed++;
        this.progress.total++;
        this.progress.percentage = (this.progress.completed / this.progress.total) * 100;
        
        return result;
    }
    
    /**
     * 获取学习路径
     */
    getLearningPath(topic) {
        const paths = {
            'chinese-history': {
                name: '中国历史',
                levels: [
                    { name: '先秦', nodes: this.app.dataService.filter({ period: '远古时代' }) },
                    { name: '秦汉', nodes: this.app.dataService.filter({ period: '古代' }) },
                    { name: '唐宋', nodes: this.app.dataService.filter({ period: '中世纪' }) }
                ]
            },
            'world-history': {
                name: '世界历史',
                levels: [
                    { name: '古代文明', nodes: [] },
                    { name: '中世纪', nodes: [] },
                    { name: '近现代', nodes: [] }
                ]
            }
        };
        
        return paths[topic] || paths['chinese-history'];
    }
    
    /**
     * 工具函数：打乱数组
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    destroy() {
        this.currentQuiz = null;
    }
}

window.EducationPlugin = EducationPlugin;
