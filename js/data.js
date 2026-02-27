// 历史数据

const historyData = {
    name: "历史之树",
    children: [
        {
            name: "远古时代",
            period: "公元前3000年-公元前500年",
            type: "period",
            children: [
                {
                    name: "文明起源",
                    type: "branch",
                    category: "culture",
                    children: [
                        {
                            name: "苏美尔文明",
                            type: "event",
                            year: "公元前3500年",
                            description: "美索不达米亚地区出现的最早文明之一，发明了楔形文字。",
                            importance: 5,
                            tags: ["文明", "文字"],
                            category: "culture"
                        },
                        {
                            name: "古埃及文明",
                            type: "event",
                            year: "公元前3100年",
                            description: "尼罗河流域诞生的伟大文明，建造了金字塔等奇迹。",
                            importance: 5,
                            tags: ["文明", "建筑"],
                            category: "culture"
                        },
                        {
                            name: "夏朝建立",
                            type: "event",
                            year: "公元前2070年",
                            description: "中国历史上第一个世袭制朝代，标志着中华文明的开始。",
                            importance: 5,
                            tags: ["中国", "朝代"],
                            category: "politics"
                        }
                    ]
                },
                {
                    name: "早期王朝",
                    type: "branch",
                    category: "politics",
                    children: [
                        {
                            name: "汉谟拉比法典",
                            type: "event",
                            year: "公元前1754年",
                            description: "巴比伦国王汉谟拉比颁布的法典，世界上最早的成文法之一。",
                            importance: 5,
                            tags: ["法律", "巴比伦"],
                            category: "politics"
                        },
                        {
                            name: "商朝",
                            type: "event",
                            year: "公元前1600年",
                            description: "中国历史上第二个朝代，甲骨文的诞生时期。",
                            importance: 4,
                            tags: ["中国", "文字"],
                            category: "culture"
                        },
                        {
                            name: "周朝建立",
                            type: "event",
                            year: "公元前1046年",
                            description: "周武王灭商建周，开创了封建制度。",
                            importance: 5,
                            tags: ["中国", "封建"],
                            category: "politics"
                        }
                    ]
                }
            ]
        },
        {
            name: "古代",
            period: "公元前500年-公元500年",
            type: "period",
            children: [
                {
                    name: "政治统一",
                    type: "branch",
                    category: "politics",
                    children: [
                        {
                            name: "秦始皇统一中国",
                            type: "event",
                            year: "公元前221年",
                            description: "秦始皇统一六国，建立中国第一个中央集权制帝国。",
                            importance: 5,
                            tags: ["统一", "帝国"],
                            category: "politics"
                        },
                        {
                            name: "罗马帝国建立",
                            type: "event",
                            year: "公元前27年",
                            description: "屋大维成为奥古斯都，罗马共和国转变为罗马帝国。",
                            importance: 5,
                            tags: ["罗马", "帝国"],
                            category: "politics"
                        }
                    ]
                },
                {
                    name: "哲学思想",
                    type: "branch",
                    category: "culture",
                    children: [
                        {
                            name: "孔子",
                            type: "person",
                            year: "公元前551年-公元前479年",
                            description: "中国伟大的思想家、教育家，儒家学派创始人。",
                            importance: 5,
                            tags: ["哲学", "教育"],
                            category: "culture"
                        },
                        {
                            name: "苏格拉底",
                            type: "person",
                            year: "公元前470年-公元前399年",
                            description: "古希腊哲学家，西方哲学的奠基者之一。",
                            importance: 5,
                            tags: ["哲学", "希腊"],
                            category: "culture"
                        },
                        {
                            name: "柏拉图",
                            type: "person",
                            year: "公元前427年-公元前347年",
                            description: "古希腊哲学家，创立了柏拉图学院。",
                            importance: 5,
                            tags: ["哲学", "学院"],
                            category: "culture"
                        },
                        {
                            name: "亚里士多德",
                            type: "person",
                            year: "公元前384年-公元前322年",
                            description: "古希腊哲学家、科学家，被誉为"百科全书式"的人物。",
                            importance: 5,
                            tags: ["哲学", "科学"],
                            category: "culture"
                        }
                    ]
                },
                {
                    name: "科技发明",
                    type: "branch",
                    category: "technology",
                    children: [
                        {
                            name: "造纸术发明",
                            type: "event",
                            year: "公元105年",
                            description: "蔡伦改进造纸术，促进了文化的传播。",
                            importance: 5,
                            tags: ["发明", "中国"],
                            category: "technology"
                        }
                    ]
                }
            ]
        },
        {
            name: "中世纪",
            period: "500年-1500年",
            type: "period",
            children: [
                {
                    name: "宗教文化",
                    type: "branch",
                    category: "culture",
                    children: [
                        {
                            name: "伊斯兰教兴起",
                            type: "event",
                            year: "610年",
                            description: "穆罕默德创立伊斯兰教，深刻影响了世界历史。",
                            importance: 5,
                            tags: ["宗教", "文化"],
                            category: "culture"
                        },
                        {
                            name: "十字军东征",
                            type: "event",
                            year: "1096年-1291年",
                            description: "基督教国家发动的系列军事远征。",
                            importance: 4,
                            tags: ["宗教", "军事"],
                            category: "military"
                        }
                    ]
                },
                {
                    name: "东方帝国",
                    type: "branch",
                    category: "politics",
                    children: [
                        {
                            name: "唐朝建立",
                            type: "event",
                            year: "618年",
                            description: "李渊建立唐朝，开创了中国历史的黄金时代。",
                            importance: 5,
                            tags: ["中国", "盛世"],
                            category: "politics"
                        },
                        {
                            name: "蒙古帝国",
                            type: "event",
                            year: "1206年",
                            description: "成吉思汗统一蒙古各部，建立横跨欧亚的大帝国。",
                            importance: 5,
                            tags: ["蒙古", "征服"],
                            category: "military"
                        }
                    ]
                },
                {
                    name: "科技发展",
                    type: "branch",
                    category: "technology",
                    children: [
                        {
                            name: "活字印刷术",
                            type: "event",
                            year: "1040年",
                            description: "毕昇发明活字印刷术，推动了知识传播。",
                            importance: 5,
                            tags: ["发明", "中国"],
                            category: "technology"
                        },
                        {
                            name: "指南针应用",
                            type: "event",
                            year: "11世纪",
                            description: "指南针应用于航海，促进了地理大发现。",
                            importance: 5,
                            tags: ["发明", "航海"],
                            category: "technology"
                        }
                    ]
                }
            ]
        },
        {
            name: "近代",
            period: "1500年-1900年",
            type: "period",
            children: [
                {
                    name: "文艺复兴",
                    type: "branch",
                    category: "culture",
                    children: [
                        {
                            name: "达芬奇",
                            type: "person",
                            year: "1452年-1519年",
                            description: "文艺复兴时期的博学家，画家、发明家。",
                            importance: 5,
                            tags: ["艺术", "科学"],
                            category: "culture"
                        },
                        {
                            name: "米开朗基罗",
                            type: "person",
                            year: "1475年-1564年",
                            description: "意大利雕塑家、画家，文艺复兴三杰之一。",
                            importance: 5,
                            tags: ["艺术", "雕塑"],
                            category: "culture"
                        }
                    ]
                },
                {
                    name: "工业革命",
                    type: "branch",
                    category: "technology",
                    children: [
                        {
                            name: "蒸汽机改良",
                            type: "event",
                            year: "1769年",
                            description: "瓦特改良蒸汽机，开启了工业革命。",
                            importance: 5,
                            tags: ["工业", "技术"],
                            category: "technology"
                        },
                        {
                            name: "电力应用",
                            type: "event",
                            year: "1879年",
                            description: "爱迪生发明实用电灯泡，改变了人类生活方式。",
                            importance: 5,
                            tags: ["发明", "电力"],
                            category: "technology"
                        }
                    ]
                },
                {
                    name: "政治变革",
                    type: "branch",
                    category: "politics",
                    children: [
                        {
                            name: "法国大革命",
                            type: "event",
                            year: "1789年",
                            description: "推翻君主专制，传播自由、平等、博爱理念。",
                            importance: 5,
                            tags: ["革命", "民主"],
                            category: "politics"
                        },
                        {
                            name: "美国独立",
                            type: "event",
                            year: "1776年",
                            description: "美国发表《独立宣言》，建立共和制国家。",
                            importance: 5,
                            tags: ["独立", "民主"],
                            category: "politics"
                        }
                    ]
                }
            ]
        },
        {
            name: "现代",
            period: "1900年-至今",
            type: "period",
            children: [
                {
                    name: "世界大战",
                    type: "branch",
                    category: "military",
                    children: [
                        {
                            name: "第一次世界大战",
                            type: "event",
                            year: "1914年-1918年",
                            description: "人类历史上首次全球性战争。",
                            importance: 5,
                            tags: ["战争", "全球"],
                            category: "military"
                        },
                        {
                            name: "第二次世界大战",
                            type: "event",
                            year: "1939年-1945年",
                            description: "人类历史上规模最大的战争。",
                            importance: 5,
                            tags: ["战争", "全球"],
                            category: "military"
                        }
                    ]
                },
                {
                    name: "科技革命",
                    type: "branch",
                    category: "technology",
                    children: [
                        {
                            name: "相对论",
                            type: "event",
                            year: "1905年",
                            description: "爱因斯坦提出狭义相对论，革新了物理学。",
                            importance: 5,
                            tags: ["科学", "物理"],
                            category: "technology"
                        },
                        {
                            name: "互联网诞生",
                            type: "event",
                            year: "1969年",
                            description: "ARPANET建立，开启了互联网时代。",
                            importance: 5,
                            tags: ["技术", "网络"],
                            category: "technology"
                        },
                        {
                            name: "人工智能",
                            type: "event",
                            year: "1956年",
                            description: "达特茅斯会议标志着人工智能学科的诞生。",
                            importance: 5,
                            tags: ["技术", "AI"],
                            category: "technology"
                        }
                    ]
                },
                {
                    name: "新中国",
                    type: "branch",
                    category: "politics",
                    children: [
                        {
                            name: "中华人民共和国成立",
                            type: "event",
                            year: "1949年",
                            description: "毛泽东宣布中华人民共和国成立。",
                            importance: 5,
                            tags: ["中国", "建国"],
                            category: "politics"
                        },
                        {
                            name: "改革开放",
                            type: "event",
                            year: "1978年",
                            description: "邓小平推动改革开放，中国经济腾飞。",
                            importance: 5,
                            tags: ["中国", "经济"],
                            category: "economy"
                        }
                    ]
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = historyData;
}
