/**
 * 预定义历史问答题目库
 * 补充 QuizEngine 自动生成的问题
 */

const QuizQuestions = {
    // 中国历史题目
    chinese: {
        // 秦汉
        qin_han: [
            {
                id: 'ch_qh_001',
                type: 'multiple-choice',
                category: 'politics',
                period: '秦汉',
                difficulty: 'easy',
                question: '秦始皇统一六国后，建立了什么政治制度？',
                options: ['分封制', '郡县制', '行省制', '州县制'],
                correct: '郡县制',
                explanation: '秦始皇废除了分封制，在全国范围内推行郡县制，加强了中央集权。'
            },
            {
                id: 'ch_qh_002',
                type: 'multiple-choice',
                category: 'culture',
                period: '秦汉',
                difficulty: 'medium',
                question: '汉武帝时期派遣谁出使西域，开通了丝绸之路？',
                options: ['班超', '张骞', '卫青', '霍去病'],
                correct: '张骞',
                explanation: '张骞两次出使西域，开辟了中西交通的丝绸之路。'
            },
            {
                id: 'ch_qh_003',
                type: 'true-false',
                category: 'technology',
                period: '秦汉',
                difficulty: 'easy',
                question: '蔡伦改进造纸术是在西汉时期。',
                correct: false,
                explanation: '蔡伦改进造纸术是在东汉时期（公元105年），而非西汉。'
            },
            {
                id: 'ch_qh_004',
                type: 'multiple-choice',
                category: 'military',
                period: '秦汉',
                difficulty: 'medium',
                question: '汉武帝时期击败匈奴的名将是？',
                options: ['韩信', '彭越', '卫青和霍去病', '李广'],
                correct: '卫青和霍去病',
                explanation: '卫青和霍去病是汉武帝时期抗击匈奴的主要将领。'
            }
        ],

        // 唐宋
        tang_song: [
            {
                id: 'ch_ts_001',
                type: 'multiple-choice',
                category: 'politics',
                period: '唐宋',
                difficulty: 'easy',
                question: '唐朝的盛世时期"贞观之治"的皇帝是谁？',
                options: ['唐高祖', '唐太宗', '唐玄宗', '武则天'],
                correct: '唐太宗',
                explanation: '贞观之治是唐太宗李世民在位期间的清明政治。'
            },
            {
                id: 'ch_ts_002',
                type: 'multiple-choice',
                category: 'culture',
                period: '唐宋',
                difficulty: 'medium',
                question: '被尊称为"诗仙"的唐代诗人是？',
                options: ['杜甫', '白居易', '李白', '王维'],
                correct: '李白',
                explanation: '李白被称为"诗仙"，杜甫被称为"诗圣"。'
            },
            {
                id: 'ch_ts_003',
                type: 'multiple-choice',
                category: 'technology',
                period: '唐宋',
                difficulty: 'medium',
                question: '宋朝时期哪位科学家发明了活字印刷术？',
                options: ['沈括', '毕昇', '苏颂', '秦九韶'],
                correct: '毕昇',
                explanation: '北宋平民毕昇发明了泥活字印刷术。'
            },
            {
                id: 'ch_ts_004',
                type: 'fill-blank',
                category: 'military',
                period: '唐宋',
                difficulty: 'medium',
                question: '唐朝发生的重大叛乱是____之乱。',
                correct: '安史',
                explanation: '安史之乱（755-763年）是唐朝由盛转衰的转折点。'
            },
            {
                id: 'ch_ts_005',
                type: 'true-false',
                category: 'culture',
                period: '唐宋',
                difficulty: 'easy',
                question: '王阳明的"心学"思想形成于明朝。',
                correct: true,
                explanation: '王阳明是明朝著名思想家，创立了心学体系。'
            }
        ],

        // 明清
        ming_qing: [
            {
                id: 'ch_mq_001',
                type: 'multiple-choice',
                category: 'military',
                period: '明清',
                difficulty: 'medium',
                question: '明朝郑和下西洋的次数是？',
                options: ['5次', '6次', '7次', '8次'],
                correct: '7次',
                explanation: '郑和从1405年到1433年共七次下西洋。'
            },
            {
                id: 'ch_mq_002',
                type: 'multiple-choice',
                category: 'politics',
                period: '明清',
                difficulty: 'easy',
                question: '清朝最后一个皇帝是？',
                options: ['光绪帝', '宣统帝', '同治帝', '咸丰帝'],
                correct: '宣统帝',
                explanation: '宣统帝溥仪是清朝最后一位皇帝，也是中国历史上最后一位皇帝。'
            },
            {
                id: 'ch_mq_003',
                type: 'multiple-choice',
                category: 'economy',
                period: '明清',
                difficulty: 'medium',
                question: '清朝"康乾盛世"不包括哪位皇帝？',
                options: ['康熙帝', '雍正帝', '乾隆帝', '嘉庆帝'],
                correct: '嘉庆帝',
                explanation: '康乾盛世指康熙、雍正、乾隆三朝。'
            }
        ]
    },

    // 世界历史题目
    world: {
        // 古代文明
        ancient: [
            {
                id: 'world_an_001',
                type: 'multiple-choice',
                category: 'culture',
                period: '古代',
                difficulty: 'medium',
                question: '古埃及人发明的文字系统是？',
                options: ['楔形文字', '象形文字', '字母文字', '甲骨文'],
                correct: '象形文字',
                explanation: '古埃及人使用象形文字（Hieroglyphs）记录信息。'
            },
            {
                id: 'world_an_002',
                type: 'multiple-choice',
                category: 'politics',
                period: '古代',
                difficulty: 'easy',
                question: '世界第一部成文法典《汉谟拉比法典》诞生于哪个文明？',
                options: ['古埃及', '古巴比伦', '古希腊', '古罗马'],
                correct: '古巴比伦',
                explanation: '《汉谟拉比法典》是古巴比伦国王汉谟拉比颁布的法典。'
            },
            {
                id: 'world_an_003',
                type: 'timeline-order',
                category: 'politics',
                period: '古代',
                difficulty: 'hard',
                question: '请将以下古希腊历史人物按时间顺序排列：',
                options: ['亚历山大大帝', '苏格拉底', '柏拉图', '亚里士多德'],
                correct: ['苏格拉底', '柏拉图', '亚里士多德', '亚历山大大帝'],
                explanation: '苏格拉底（前470-前399）→ 柏拉图（前428-前348）→ 亚里士多德（前384-前322）→ 亚历山大大帝（前356-前323）'
            }
        ],

        // 中世纪与文艺复兴
        medieval_renaissance: [
            {
                id: 'world_mr_001',
                type: 'multiple-choice',
                category: 'culture',
                period: '文艺复兴',
                difficulty: 'medium',
                question: '文艺复兴起源于哪个国家？',
                options: ['法国', '英国', '意大利', '西班牙'],
                correct: '意大利',
                explanation: '文艺复兴起源于14世纪的意大利，特别是佛罗伦萨。'
            },
            {
                id: 'world_mr_002',
                type: 'multiple-choice',
                category: 'technology',
                period: '文艺复兴',
                difficulty: 'easy',
                question: '古腾堡发明了什么技术推动了知识传播？',
                options: ['造纸术', '活字印刷术', '蒸汽机', '电报'],
                correct: '活字印刷术',
                explanation: '1450年左右，古腾堡发明了金属活字印刷术。'
            },
            {
                id: 'world_mr_003',
                type: 'multiple-choice',
                category: 'culture',
                period: '文艺复兴',
                difficulty: 'medium',
                question: '达芬奇的代表作《蒙娜丽莎》创作于哪个时期？',
                options: ['13世纪', '14世纪', '15-16世纪', '17世纪'],
                correct: '15-16世纪',
                explanation: '《蒙娜丽莎》创作于1503-1519年间。'
            }
        ],

        // 近代历史
        modern: [
            {
                id: 'world_mod_001',
                type: 'multiple-choice',
                category: 'economy',
                period: '近代',
                difficulty: 'medium',
                question: '工业革命最早起源于哪个国家？',
                options: ['美国', '德国', '英国', '法国'],
                correct: '英国',
                explanation: '工业革命18世纪60年代首先发生在英国。'
            },
            {
                id: 'world_mod_002',
                type: 'true-false',
                category: 'politics',
                period: '近代',
                difficulty: 'easy',
                question: '美国独立战争发生在18世纪末。',
                correct: true,
                explanation: '美国独立战争（1775-1783）确实发生在18世纪末。'
            },
            {
                id: 'world_mod_003',
                type: 'multiple-choice',
                category: 'culture',
                period: '近代',
                difficulty: 'medium',
                question: '法国大革命爆发的年份是？',
                options: ['1776年', '1789年', '1799年', '1815年'],
                correct: '1789年',
                explanation: '法国大革命于1789年7月14日攻占巴士底狱开始。'
            }
        ]
    },

    // 综合题目
    mixed: [
        {
            id: 'mixed_001',
            type: 'multiple-choice',
            category: 'culture',
            difficulty: 'hard',
            question: '以下哪项不是中国古代四大发明？',
            options: ['造纸术', '印刷术', '火药', '地动仪'],
            correct: '地动仪',
            explanation: '四大发明是造纸术、印刷术、火药、指南针。地动仪是张衡发明的，但不属于四大发明。'
        },
        {
            id: 'mixed_002',
            type: 'timeline-order',
            category: 'politics',
            difficulty: 'hard',
            question: '请按时间顺序排列以下重大历史事件：',
            options: ['文艺复兴开始', '美国独立战争', '法国大革命', '工业革命'],
            correct: ['文艺复兴开始', '工业革命', '美国独立战争', '法国大革命'],
            explanation: '文艺复兴（14世纪）→ 工业革命（18世纪60年代）→ 美国独立战争（1775-1783）→ 法国大革命（1789）'
        },
        {
            id: 'mixed_003',
            type: 'multiple-choice',
            category: 'economy',
            difficulty: 'medium',
            question: '丝绸之路大约在哪个朝代达到鼎盛？',
            options: ['秦朝', '汉朝', '唐朝', '宋朝'],
            correct: '唐朝',
            explanation: '唐朝时期丝绸之路达到鼎盛，连接了东西方文明。'
        }
    ]
};

// 题目管理器
const QuizQuestionManager = {
    /**
     * 获取指定类别的题目
     */
    getByCategory(category, count = 10) {
        const allQuestions = [];

        // 收集所有相关题目
        Object.values(QuizQuestions).forEach(group => {
            Object.values(group).forEach(questions => {
                questions.forEach(q => {
                    if (q.category === category) {
                        allQuestions.push(q);
                    }
                });
            });
        });

        return this.shuffle(allQuestions).slice(0, count);
    },

    /**
     * 获取指定时期的题目
     */
    getByPeriod(period, count = 10) {
        const questions = QuizQuestions.chinese[period] || QuizQuestions.world[period] || [];
        return this.shuffle([...questions]).slice(0, count);
    },

    /**
     * 获取指定难度的题目
     */
    getByDifficulty(difficulty, count = 10) {
        const allQuestions = [];

        Object.values(QuizQuestions).forEach(group => {
            Object.values(group).forEach(questions => {
                questions.forEach(q => {
                    if (q.difficulty === difficulty) {
                        allQuestions.push(q);
                    }
                });
            });
        });

        return this.shuffle(allQuestions).slice(0, count);
    },

    /**
     * 获取随机题目
     */
    getRandom(count = 10) {
        const allQuestions = [];

        Object.values(QuizQuestions).forEach(group => {
            Object.values(group).forEach(questions => {
                allQuestions.push(...questions);
            });
        });

        return this.shuffle(allQuestions).slice(0, count);
    },

    /**
     * 混淆数组
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * 获取题目统计
     */
    getStats() {
        let total = 0;
        const byCategory = {};
        const byDifficulty = {};

        Object.entries(QuizQuestions).forEach(([groupKey, group]) => {
            Object.entries(group).forEach(([periodKey, questions]) => {
                questions.forEach(q => {
                    total++;
                    byCategory[q.category] = (byCategory[q.category] || 0) + 1;
                    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
                });
            });
        });

        return { total, byCategory, byDifficulty };
    }
};

// 导出到全局
window.QuizQuestions = QuizQuestions;
window.QuizQuestionManager = QuizQuestionManager;
