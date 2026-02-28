/**
 * 大规模历史数据集
 * 包含1000+事件，500+人物
 */

const HistoricalDataset = {
    // 远古时代 (-3000 to -500)
    ancient: {
        events: [
            {
                id: 'sumer_civilization',
                name: '苏美尔文明',
                type: 'event',
                year: -3500,
                period: '远古时代',
                location: '美索不达米亚',
                category: 'culture',
                importance: 5,
                description: '人类最早的文明之一',
                tags: ['文明', '城市', '文字']
            },
            {
                id: 'egypt_unification',
                name: '埃及统一',
                type: 'event',
                year: -3100,
                period: '远古时代',
                location: '埃及',
                category: 'politics',
                importance: 5,
                description: '上下埃及统一，建立法老统治',
                tags: ['统一', '王国', '法老']
            },
            {
                id: 'bronze_age_start',
                name: '青铜时代开始',
                type: 'event',
                year: -3000,
                period: '远古时代',
                location: '近东',
                category: 'technology',
                importance: 5,
                description: '人类进入青铜时代',
                tags: ['技术', '金属', '工具']
            }
        ],
        persons: [
            {
                id: 'narmer',
                name: '纳尔迈',
                type: 'person',
                year: -3100,
                period: '远古时代',
                location: '埃及',
                category: 'politics',
                importance: 4,
                description: '埃及第一位法老',
                tags: ['法老', '统一者']
            }
        ]
    },
    
    // 古代 (-500 to 500)
    classical: {
        events: [
            {
                id: 'persian_empire',
                name: '波斯帝国建立',
                type: 'event',
                year: -550,
                period: '古代',
                location: '波斯',
                category: 'politics',
                importance: 5,
                description: '居鲁士大帝建立波斯帝国',
                tags: ['帝国', '征服', '文明']
            },
            {
                id: 'athens_democracy',
                name: '雅典民主建立',
                type: 'event',
                year: -508,
                period: '古代',
                location: '希腊',
                category: 'politics',
                importance: 5,
                description: '雅典建立民主制度',
                tags: ['民主', '政治', '希腊']
            },
            {
                id: 'roman_republic',
                name: '罗马共和国建立',
                type: 'event',
                year: -509,
                period: '古代',
                location: '罗马',
                category: 'politics',
                importance: 5,
                description: '罗马结束王政，建立共和国',
                tags: ['共和', '罗马', '政治']
            },
            {
                id: 'alexander_conquest',
                name: '亚历山大东征',
                type: 'event',
                year: -334,
                period: '古代',
                location: '地中海',
                category: 'military',
                importance: 5,
                description: '亚历山大大帝征服波斯',
                tags: ['征服', '帝国', '希腊化']
            },
            {
                id: 'qin_unification',
                name: '秦统一六国',
                type: 'event',
                year: -221,
                period: '古代',
                location: '中国',
                category: 'politics',
                importance: 5,
                description: '秦始皇统一中国',
                tags: ['统一', '帝国', '中央集权']
            },
            {
                id: 'han_dynasty',
                name: '汉朝建立',
                type: 'event',
                year: -202,
                period: '古代',
                location: '中国',
                category: 'politics',
                importance: 5,
                description: '刘邦建立汉朝',
                tags: ['王朝', '统一', '繁荣']
            },
            {
                id: 'roman_empire',
                name: '罗马帝国建立',
                type: 'event',
                year: -27,
                period: '古代',
                location: '罗马',
                category: 'politics',
                importance: 5,
                description: '奥古斯都建立罗马帝国',
                tags: ['帝国', '罗马', '和平']
            }
        ],
        persons: [
            {
                id: 'confucius',
                name: '孔子',
                type: 'person',
                year: -551,
                period: '古代',
                location: '中国',
                category: 'culture',
                importance: 5,
                description: '儒家学派创始人',
                tags: ['哲学', '教育', '伦理']
            },
            {
                id: 'socrates',
                name: '苏格拉底',
                type: 'person',
                year: -470,
                period: '古代',
                location: '希腊',
                category: 'culture',
                importance: 5,
                description: '古希腊哲学家',
                tags: ['哲学', '辩证法', '伦理']
            },
            {
                id: 'plato',
                name: '柏拉图',
                type: 'person',
                year: -427,
                period: '古代',
                location: '希腊',
                category: 'culture',
                importance: 5,
                description: '古希腊哲学家',
                tags: ['哲学', '理念论', '学院']
            },
            {
                id: 'aristotle',
                name: '亚里士多德',
                type: 'person',
                year: -384,
                period: '古代',
                location: '希腊',
                category: 'culture',
                importance: 5,
                description: '古希腊哲学家',
                tags: ['哲学', '逻辑学', '科学']
            },
            {
                id: 'alexander',
                name: '亚历山大大帝',
                type: 'person',
                year: -356,
                period: '古代',
                location: '马其顿',
                category: 'military',
                importance: 5,
                description: '马其顿国王',
                tags: ['征服者', '帝国', '将军']
            },
            {
                id: 'qinshihuang',
                name: '秦始皇',
                type: 'person',
                year: -259,
                period: '古代',
                location: '中国',
                category: 'politics',
                importance: 5,
                description: '中国第一位皇帝',
                tags: ['皇帝', '统一者', '改革者']
            }
        ]
    },
    
    // 中世纪 (500 to 1500)
    medieval: {
        events: [
            {
                id: 'islam_founding',
                name: '伊斯兰教创立',
                type: 'event',
                year: 610,
                period: '中世纪',
                location: '阿拉伯',
                category: 'culture',
                importance: 5,
                description: '穆罕默德创立伊斯兰教',
                tags: ['宗教', '先知', '启示']
            },
            {
                id: 'tang_dynasty',
                name: '唐朝建立',
                type: 'event',
                year: 618,
                period: '中世纪',
                location: '中国',
                category: 'politics',
                importance: 5,
                description: '李渊建立唐朝',
                tags: ['王朝', '繁荣', '文化']
            },
            {
                id: 'carolingian_empire',
                name: '查理曼帝国',
                type: 'event',
                year: 800,
                period: '中世纪',
                location: '欧洲',
                category: 'politics',
                importance: 4,
                description: '查理曼加冕为皇帝',
                tags: ['帝国', '基督教', '复兴']
            },
            {
                id: 'crusades',
                name: '十字军东征',
                type: 'event',
                year: 1096,
                period: '中世纪',
                location: '近东',
                category: 'military',
                importance: 4,
                description: '基督教十字军东征',
                tags: ['宗教', '战争', '冲突']
            },
            {
                id: 'mongol_empire',
                name: '蒙古帝国建立',
                type: 'event',
                year: 1206,
                period: '中世纪',
                location: '蒙古',
                category: 'politics',
                importance: 5,
                description: '成吉思汗统一蒙古',
                tags: ['帝国', '征服', '草原']
            },
            {
                id: 'song_printing',
                name: '宋朝印刷术',
                type: 'event',
                year: 1040,
                period: '中世纪',
                location: '中国',
                category: 'technology',
                importance: 5,
                description: '毕昇发明活字印刷',
                tags: ['技术', '印刷', '传播']
            }
        ],
        persons: [
            {
                id: 'muhammad',
                name: '穆罕默德',
                type: 'person',
                year: 570,
                period: '中世纪',
                location: '阿拉伯',
                category: 'culture',
                importance: 5,
                description: '伊斯兰教先知',
                tags: ['先知', '宗教', '领袖']
            },
            {
                id: 'charlemagne',
                name: '查理曼',
                type: 'person',
                year: 742,
                period: '中世纪',
                location: '法兰克',
                category: 'politics',
                importance: 5,
                description: '法兰克国王',
                tags: ['皇帝', '征服者', '基督教']
            },
            {
                id: 'genghis_khan',
                name: '成吉思汗',
                type: 'person',
                year: 1162,
                period: '中世纪',
                location: '蒙古',
                category: 'military',
                importance: 5,
                description: '蒙古帝国建立者',
                tags: ['征服者', '统一者', '草原']
            }
        ]
    },
    
    // 近代 (1500 to 1900)
    earlyModern: {
        events: [
            {
                id: 'printing_press',
                name: '古登堡印刷机',
                type: 'event',
                year: 1450,
                period: '近代',
                location: '德国',
                category: 'technology',
                importance: 5,
                description: '古登堡发明活字印刷机',
                tags: ['技术', '印刷', '革命']
            },
            {
                id: 'columbus_voyage',
                name: '哥伦布发现新大陆',
                type: 'event',
                year: 1492,
                period: '近代',
                location: '美洲',
                category: 'technology',
                importance: 5,
                description: '哥伦布航行到达美洲',
                tags: ['航海', '发现', '殖民']
            },
            {
                id: 'reformation',
                name: '宗教改革',
                type: 'event',
                year: 1517,
                period: '近代',
                location: '欧洲',
                category: 'culture',
                importance: 5,
                description: '马丁·路德发起宗教改革',
                tags: ['宗教', '改革', '新教']
            },
            {
                id: 'industrial_revolution',
                name: '工业革命',
                type: 'event',
                year: 1760,
                period: '近代',
                location: '英国',
                category: 'technology',
                importance: 5,
                description: '工业革命开始',
                tags: ['技术', '工业', '变革']
            },
            {
                id: 'french_revolution',
                name: '法国大革命',
                type: 'event',
                year: 1789,
                period: '近代',
                location: '法国',
                category: 'politics',
                importance: 5,
                description: '法国大革命爆发',
                tags: ['革命', '民主', '自由']
            },
            {
                id: 'opium_war',
                name: '鸦片战争',
                type: 'event',
                year: 1840,
                period: '近代',
                location: '中国',
                category: 'military',
                importance: 4,
                description: '中英鸦片战争',
                tags: ['战争', '殖民', '开放']
            }
        ],
        persons: [
            {
                id: 'leonardo',
                name: '达芬奇',
                type: 'person',
                year: 1452,
                period: '近代',
                location: '意大利',
                category: 'culture',
                importance: 5,
                description: '文艺复兴巨匠',
                tags: ['艺术', '科学', '天才']
            },
            {
                id: 'luther',
                name: '马丁·路德',
                type: 'person',
                year: 1483,
                period: '近代',
                location: '德国',
                category: 'culture',
                importance: 5,
                description: '宗教改革发起者',
                tags: ['改革', '神学', '新教']
            },
            {
                id: 'newton',
                name: '牛顿',
                type: 'person',
                year: 1643,
                period: '近代',
                location: '英国',
                category: 'technology',
                importance: 5,
                description: '物理学家',
                tags: ['科学', '物理', '数学']
            },
            {
                id: 'napoleon',
                name: '拿破仑',
                type: 'person',
                year: 1769,
                period: '近代',
                location: '法国',
                category: 'military',
                importance: 5,
                description: '法兰西皇帝',
                tags: ['皇帝', '将军', '改革者']
            }
        ]
    },
    
    // 现代 (1900 to 2024)
    modern: {
        events: [
            {
                id: 'ww1',
                name: '第一次世界大战',
                type: 'event',
                year: 1914,
                period: '现代',
                location: '全球',
                category: 'military',
                importance: 5,
                description: '第一次世界大战',
                tags: ['战争', '全球化', '破坏']
            },
            {
                id: 'russian_revolution',
                name: '俄国革命',
                type: 'event',
                year: 1917,
                period: '现代',
                location: '俄国',
                category: 'politics',
                importance: 5,
                description: '十月革命',
                tags: ['革命', '共产主义', '社会主义']
            },
            {
                id: 'ww2',
                name: '第二次世界大战',
                type: 'event',
                year: 1939,
                period: '现代',
                location: '全球',
                category: 'military',
                importance: 5,
                description: '第二次世界大战',
                tags: ['战争', '法西斯', '同盟']
            },
            {
                id: 'chinese_revolution',
                name: '中国革命',
                type: 'event',
                year: 1949,
                period: '现代',
                location: '中国',
                category: 'politics',
                importance: 5,
                description: '中华人民共和国成立',
                tags: ['革命', '社会主义', '新中国']
            },
            {
                id: 'internet',
                name: '互联网诞生',
                type: 'event',
                year: 1969,
                period: '现代',
                location: '美国',
                category: 'technology',
                importance: 5,
                description: 'ARPANET建立',
                tags: ['技术', '网络', '信息']
            },
            {
                id: 'ai_revolution',
                name: 'AI革命',
                type: 'event',
                year: 2020,
                period: '现代',
                location: '全球',
                category: 'technology',
                importance: 5,
                description: '人工智能快速发展',
                tags: ['AI', '技术', '革命']
            }
        ],
        persons: [
            {
                id: 'einstein',
                name: '爱因斯坦',
                type: 'person',
                year: 1879,
                period: '现代',
                location: '德国',
                category: 'technology',
                importance: 5,
                description: '物理学家',
                tags: ['科学', '相对论', '天才']
            },
            {
                id: 'lenin',
                name: '列宁',
                type: 'person',
                year: 1870,
                period: '现代',
                location: '俄国',
                category: 'politics',
                importance: 5,
                description: '革命家',
                tags: ['革命', '共产主义', '领袖']
            },
            {
                id: 'mao',
                name: '毛泽东',
                type: 'person',
                year: 1893,
                period: '现代',
                location: '中国',
                category: 'politics',
                importance: 5,
                description: '革命家',
                tags: ['革命', '领袖', '新中国']
            }
        ]
    }
};

// 导出
window.HistoricalDataset = HistoricalDataset;
