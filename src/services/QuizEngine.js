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

    // 预设题目库
    static PRESET_QUESTIONS = {
        // 中国朝代题目
        chinese_dynasties: [
            {
                type: 'multiple-choice',
                question: '秦始皇统一六国是在哪一年？',
                options: ['前221年', '前230年', '前206年', '前210年'],
                correct: '前221年',
                explanation: '秦始皇于前221年统一六国，建立了中国历史上第一个大一统王朝。'
            },
            {
                type: 'multiple-choice',
                question: '汉朝的开国皇帝是？',
                options: ['刘邦', '项羽', '刘彻', '刘备'],
                correct: '刘邦',
                explanation: '刘邦（汉高祖）于前202年建立汉朝，定都长安。'
            },
            {
                type: 'multiple-choice',
                question: '唐朝盛世"贞观之治"的皇帝是？',
                options: ['唐太宗', '唐高宗', '唐玄宗', '唐中宗'],
                correct: '唐太宗',
                explanation: '唐太宗李世民在位期间（626-649年）政治清明，经济繁荣，史称"贞观之治"。'
            },
            {
                type: 'multiple-choice',
                question: '"丝绸之路"主要由哪位皇帝时期开通？',
                options: ['汉武帝', '汉文帝', '汉景帝', '汉光武帝'],
                correct: '汉武帝',
                explanation: '汉武帝派张骞出使西域（前138年），开辟了连接中西方的丝绸之路。'
            },
            {
                type: 'multiple-choice',
                question: '明朝的开国皇帝是？',
                options: ['朱元璋', '朱棣', '朱允炆', '朱厚照'],
                correct: '朱元璋',
                explanation: '朱元璋（明太祖）于1368年建立明朝，定都南京。'
            },
            {
                type: 'multiple-choice',
                question: '中国历史上唯一的女皇帝是？',
                options: ['武则天', '吕后', '慈禧', '贾南风'],
                correct: '武则天',
                explanation: '武则天是中国历史上唯一的女皇帝，改国号为"周"（690-705年）。'
            },
            {
                type: 'multiple-choice',
                question: '"开元盛世"出现在哪个朝代？',
                options: ['唐朝', '宋朝', '明朝', '清朝'],
                correct: '唐朝',
                explanation: '唐玄宗李隆基在位前期（713-741年），国力达到顶峰，史称"开元盛世"。'
            },
            {
                type: 'multiple-choice',
                question: '清朝的最后一个皇帝是？',
                options: ['溥仪', '光绪', '同治', '咸丰'],
                correct: '溥仪',
                explanation: '溥仪（宣统帝）是清朝最后一位皇帝，1912年退位。'
            },
            {
                type: 'timeline-order',
                question: '请将以下朝代按时间顺序排列（从早到晚）：',
                events: [
                    { id: 'qin', name: '秦朝' },
                    { id: 'han', name: '汉朝' },
                    { id: 'tang', name: '唐朝' },
                    { id: 'song', name: '宋朝' }
                ],
                correctOrder: ['qin', 'han', 'tang', 'song'],
                explanation: '秦朝（前221-前207）→ 汉朝（前202-220）→ 唐朝（618-907）→ 宋朝（960-1279）'
            },
            {
                type: 'true-false',
                question: '三国时期包括魏、蜀、吴三个政权。',
                correct: true,
                explanation: '三国时期（220-280年）确实包括魏、蜀（蜀汉）、吴三个政权。'
            },
            {
                type: 'true-false',
                question: '宋朝是中国历史上疆域最大的朝代。',
                correct: false,
                explanation: '元朝和清朝的疆域都比宋朝大。宋朝虽然经济文化繁荣，但军事较弱。'
            },
            {
                type: 'fill-blank',
                question: '____是中国历史上第一个大一统的封建王朝。',
                correct: '秦朝',
                explanation: '秦始皇于前221年统一六国，建立了中国历史上第一个大一统王朝——秦朝。'
            }
        ],
        // 世界文明题目
        world_civilizations: [
            {
                type: 'multiple-choice',
                question: '古埃及文明发源于哪条河流域？',
                options: ['尼罗河', '底格里斯河', '印度河', '黄河'],
                correct: '尼罗河',
                explanation: '古埃及文明发源于非洲东北部的尼罗河流域。'
            },
            {
                type: 'multiple-choice',
                question: '世界上最早的成文法典是？',
                options: ['《汉谟拉比法典》', '《十二铜表法》', '《拿破仑法典》', '《查士丁尼法典》'],
                correct: '《汉谟拉比法典》',
                explanation: '古巴比伦国王汉谟拉比颁布的《汉谟拉比法典》是世界上最早的成文法典（约前1754年）。'
            },
            {
                type: 'multiple-choice',
                question: '古希腊最著名的城邦民主制出现在？',
                options: ['雅典', '斯巴达', '科林斯', '底比斯'],
                correct: '雅典',
                explanation: '雅典在公元前5世纪建立了世界上最早的民主制度。'
            },
            {
                type: 'multiple-choice',
                question: '罗马帝国何时分裂为东西两部？',
                options: ['395年', '27年', '476年', '800年'],
                correct: '395年',
                explanation: '罗马皇帝狄奥多西一世于395年将帝国分裂为东西两部。'
            },
            {
                type: 'multiple-choice',
                question: '亚历山大大帝是哪国人？',
                options: ['马其顿', '希腊', '波斯', '埃及'],
                correct: '马其顿',
                explanation: '亚历山大大帝是马其顿王国的国王，建立了横跨欧亚非的庞大帝国。'
            },
            {
                type: 'multiple-choice',
                question: '《荷马史诗》包括《伊利亚特》和？',
                options: ['《奥德赛》', '《埃涅阿斯纪》', '《神曲》', '《失乐园》'],
                correct: '《奥德赛》',
                explanation: '《荷马史诗》包括《伊利亚特》和《奥德赛》两部，是古希腊最重要的史诗作品。'
            },
            {
                type: 'timeline-order',
                question: '请将以下文明按出现时间排序（从早到晚）：',
                events: [
                    { id: 'mesopotamia', name: '美索不达米亚文明' },
                    { id: 'egypt', name: '古埃及文明' },
                    { id: 'greece', name: '古希腊文明' },
                    { id: 'rome', name: '古罗马文明' }
                ],
                correctOrder: ['mesopotamia', 'egypt', 'greece', 'rome'],
                explanation: '美索不达米亚（前4000年）→ 古埃及（前3100年）→ 古希腊（前800年）→ 古罗马（前753年）'
            },
            {
                type: 'true-false',
                question: '金字塔是古埃及的陵墓建筑。',
                correct: true,
                explanation: '金字塔是古埃及法老的陵墓，其中最著名的是吉萨金字塔群。'
            },
            {
                type: 'true-false',
                question: '斯巴达以其民主制度闻名于世。',
                correct: false,
                explanation: '斯巴达以军事寡头制度著称，民主制度是雅典的特色。'
            },
            {
                type: 'fill-blank',
                question: '____是古罗马最著名的圆形斗兽场，建于公元72-80年。',
                correct: '罗马斗兽场',
                explanation: '罗马斗兽场（Colosseum）是古罗马建筑的代表，可容纳5万观众。'
            }
        ],
        // 中西对比题目
        comparison: [
            {
                type: 'multiple-choice',
                question: '孔子与苏格拉底大约生活在同一时代，他们的核心思想都是？',
                options: ['伦理道德', '自然科学', '军事战略', '经济贸易'],
                correct: '伦理道德',
                explanation: '孔子强调"仁"和"礼"，苏格拉底追求"善"和"美德"，都关注伦理道德问题。'
            },
            {
                type: 'multiple-choice',
                question: '中国的"四大发明"中，哪一项传入欧洲后促进了宗教改革？',
                options: ['印刷术', '造纸术', '火药', '指南针'],
                correct: '印刷术',
                explanation: '印刷术传入欧洲后，使《圣经》得以大量印刷，促进了宗教改革的发展。'
            },
            {
                type: 'true-false',
                question: '汉朝和罗马帝国是同一时期存在的两大帝国。',
                correct: true,
                explanation: '汉朝（前202-220）与罗马帝国（前27-476）在1-2世纪同时存在，被称为"丝路两端"的两大帝国。'
            },
            {
                type: 'multiple-choice',
                question: '以下哪项不是中国独有的发明？',
                options: ['阿拉伯数字', '造纸术', '印刷术', '火药'],
                correct: '阿拉伯数字',
                explanation: '阿拉伯数字由古印度发明，经阿拉伯人传入欧洲。造纸术、印刷术、火药都是中国发明。'
            }
        ],
        // 科技文化题目
        technology_culture: [
            {
                type: 'multiple-choice',
                question: '造纸术是由谁改进的？',
                options: ['蔡伦', '毕昇', '张衡', '祖冲之'],
                correct: '蔡伦',
                explanation: '东汉蔡伦于105年改进了造纸术，使纸张得以广泛使用。'
            },
            {
                type: 'multiple-choice',
                question: '活字印刷术的发明者是？',
                options: ['毕昇', '蔡伦', '沈括', '王祯'],
                correct: '毕昇',
                explanation: '北宋毕昇发明了泥活字印刷术，大大提高了印刷效率。'
            },
            {
                type: 'multiple-choice',
                question: '《本草纲目》的作者是？',
                options: ['李时珍', '孙思邈', '华佗', '张仲景'],
                correct: '李时珍',
                explanation: '明代李时珍历时27年完成《本草纲目》，是中国古代药物学的集大成之作。'
            },
            {
                type: 'multiple-choice',
                question: '兵马俑是哪个朝代的陪葬品？',
                options: ['秦朝', '汉朝', '唐朝', '明朝'],
                correct: '秦朝',
                explanation: '秦始皇兵马俑是秦始皇陵的陪葬品，建于前3世纪。'
            },
            {
                type: 'true-false',
                question: '中国古代的"四大发明"包括造纸术、印刷术、火药和指南针。',
                correct: true,
                explanation: '四大发明是中国古代对世界文明的重要贡献。'
            },
            {
                type: 'fill-blank',
                question: '____是中国古代最著名的军事著作，被誉为"兵学圣典"。',
                correct: '《孙子兵法》',
                explanation: '《孙子兵法》由春秋时期孙武所著，是世界军事史上最重要的著作之一。'
            }
        ]
    };

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
            count = 10,
            source = 'auto'
        } = options;

        let questions = [];

        // 如果指定使用预设题目
        if (source !== 'data') {
            // 尝试从预设题目中获取
            const presetQuestions = this.getPresetQuestions(options);
            if (presetQuestions.length >= count) {
                questions = this.shuffle([...presetQuestions]).slice(0, count);
                questions = questions.map((q, index) => ({
                    ...q,
                    index,
                    userAnswer: null,
                    isCorrect: null
                }));
            } else {
                // 预设题目不足，补充生成题目
                const remaining = count - questions.length;
                const generatedQuestions = this.generateQuestionsFromData({
                    type, category, period, difficulty, count: remaining
                });
                questions = [...questions, ...generatedQuestions];
            }
        }

        // 如果题目仍然不足，从数据生成
        if (questions.length < count) {
            const remaining = count - questions.length;
            const generatedQuestions = this.generateQuestionsFromData({
                type, category, period, difficulty, count: remaining
            });
            questions = [...questions, ...generatedQuestions];
        }

        // 创建测验
        this.currentQuiz = {
            id: 'quiz_' + Date.now(),
            questions,
            currentIndex: 0,
            score: 0,
            startTime: Date.now(),
            answers: {},
            options: { category, period, difficulty, source }
        };

        return this.currentQuiz;
    }

    /**
     * 获取预设题目
     */
    getPresetQuestions(options) {
        const { category, period, topic } = options;
        let questions = [];

        // 根据主题选择题目集
        if (topic === 'chinese' || period?.includes('秦') || period?.includes('汉') || period?.includes('唐') || period?.includes('宋') || period?.includes('明') || period?.includes('清')) {
            questions = [...QuizEngine.PRESET_QUESTIONS.chinese_dynasties];
        } else if (topic === 'world' || topic === 'civilization') {
            questions = [...QuizEngine.PRESET_QUESTIONS.world_civilizations];
        } else if (topic === 'comparison') {
            questions = [...QuizEngine.PRESET_QUESTIONS.comparison];
        } else if (category === 'technology' || category === 'culture') {
            questions = [...QuizEngine.PRESET_QUESTIONS.technology_culture];
        } else {
            // 没有特定主题时，混合所有题目
            questions = [
                ...QuizEngine.PRESET_QUESTIONS.chinese_dynasties,
                ...QuizEngine.PRESET_QUESTIONS.world_civilizations,
                ...QuizEngine.PRESET_QUESTIONS.comparison,
                ...QuizEngine.PRESET_QUESTIONS.technology_culture
            ];
        }

        // 过滤题目类型
        if (options.type) {
            questions = questions.filter(q => q.type === options.type);
        }

        return questions;
    }

    /**
     * 获取可用的题目集列表
     */
    getAvailableQuizSets() {
        return [
            {
                id: 'chinese',
                name: '中国朝代',
                description: '中国古代各朝代的历史事件和人物',
                icon: '🏯',
                count: QuizEngine.PRESET_QUESTIONS.chinese_dynasties.length,
                topics: ['秦朝', '汉朝', '唐朝', '宋朝', '明朝', '清朝', '三国']
            },
            {
                id: 'world',
                name: '世界文明',
                description: '世界古代文明的历史知识',
                icon: '🌍',
                count: QuizEngine.PRESET_QUESTIONS.world_civilizations.length,
                topics: ['古埃及', '古希腊', '古罗马', '美索不达米亚']
            },
            {
                id: 'comparison',
                name: '中西对比',
                description: '中国与西方历史的对比分析',
                icon: '🔄',
                count: QuizEngine.PRESET_QUESTIONS.comparison.length,
                topics: ['孔子vs苏格拉底', '汉朝vs罗马', '四大发明']
            },
            {
                id: 'technology',
                name: '科技文化',
                description: '中国古代科技与文化成就',
                icon: '📚',
                count: QuizEngine.PRESET_QUESTIONS.technology_culture.length,
                topics: ['四大发明', '医学', '建筑', '兵法']
            }
        ];
    }

    /**
     * 快速开始指定主题的测验
     */
    quickStart(topicId, count = 10) {
        const topicMap = {
            'chinese': 'chinese',
            'world': 'world',
            'comparison': 'comparison',
            'technology': 'technology_culture'
        };

        const topic = topicMap[topicId] || 'chinese';

        return this.generateQuiz({
            source: 'preset',
            topic,
            count
        });
    }

    /**
     * 从数据生成题目
     */
    generateQuestionsFromData(options) {
        const { type, category, period, difficulty, count } = options;

        // 获取符合条件的节点
        const nodes = this.getEligibleNodes({ category, period, count: count * 3 });

        if (nodes.length < count) {
            console.warn(`Not enough nodes for quiz: found ${nodes.length}, need ${count}`);
        }

        // 随机选择节点
        const selectedNodes = this.shuffle(nodes).slice(0, Math.min(count, nodes.length));

        // 生成问题
        return selectedNodes.map((node, index) => {
            const questionType = type || this.selectQuestionType(difficulty);
            return this.createQuestion(node, questionType, index);
        });
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
