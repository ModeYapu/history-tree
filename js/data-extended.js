// 扩展历史数据 - 更多历史节点

const extendedHistoryData = {
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
                            description: "美索不达米亚地区出现的最早文明之一，发明了楔形文字，建立了城邦制度。",
                            importance: 5,
                            tags: ["文明", "文字", "城邦"],
                            category: "culture",
                            image: "sumer.jpg",
                            location: "美索不达米亚"
                        },
                        {
                            name: "古埃及文明",
                            type: "event",
                            year: "公元前3100年",
                            description: "尼罗河流域诞生的伟大文明，建造了金字塔、狮身人面像等奇迹，发明了象形文字。",
                            importance: 5,
                            tags: ["文明", "建筑", "金字塔"],
                            category: "culture",
                            image: "egypt.jpg",
                            location: "尼罗河流域"
                        },
                        {
                            name: "印度河文明",
                            type: "event",
                            year: "公元前2600年",
                            description: "古印度次大陆的青铜时代文明，城市规划先进，排水系统完善。",
                            importance: 4,
                            tags: ["文明", "城市规划"],
                            category: "culture",
                            location: "印度河流域"
                        },
                        {
                            name: "夏朝建立",
                            type: "event",
                            year: "公元前2070年",
                            description: "中国历史上第一个世袭制朝代，标志着中华文明的开始。",
                            importance: 5,
                            tags: ["中国", "朝代", "文明"],
                            category: "politics",
                            location: "黄河流域"
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
                            description: "巴比伦国王汉谟拉比颁布的法典，世界上最早的成文法之一，刻在石柱上。",
                            importance: 5,
                            tags: ["法律", "巴比伦", "成文法"],
                            category: "politics",
                            location: "巴比伦"
                        },
                        {
                            name: "商朝",
                            type: "event",
                            year: "公元前1600年",
                            description: "中国历史上第二个朝代，甲骨文的诞生时期，青铜器制作达到高峰。",
                            importance: 4,
                            tags: ["中国", "文字", "青铜器"],
                            category: "culture",
                            location: "中国"
                        },
                        {
                            name: "特洛伊战争",
                            type: "event",
                            year: "公元前1250年",
                            description: "古希腊与小亚细亚特洛伊城之间的战争，成为后世文学艺术的重要题材。",
                            importance: 4,
                            tags: ["战争", "希腊", "神话"],
                            category: "military",
                            location: "特洛伊"
                        },
                        {
                            name: "周朝建立",
                            type: "event",
                            year: "公元前1046年",
                            description: "周武王灭商建周，开创了封建制度，建立了礼乐文明。",
                            importance: 5,
                            tags: ["中国", "封建", "礼乐"],
                            category: "politics",
                            location: "中国"
                        },
                        {
                            name: "大卫王统一以色列",
                            type: "event",
                            year: "公元前1000年",
                            description: "大卫王统一以色列十二支派，建立以色列王国，定都耶路撒冷。",
                            importance: 4,
                            tags: ["以色列", "统一", "宗教"],
                            category: "politics",
                            location: "耶路撒冷"
                        }
                    ]
                },
                {
                    name: "早期思想",
                    type: "branch",
                    category: "culture",
                    children: [
                        {
                            name: "荷马史诗",
                            type: "event",
                            year: "公元前800年",
                            description: "荷马创作的《伊利亚特》和《奥德赛》，西方文学的奠基之作。",
                            importance: 5,
                            tags: ["文学", "史诗", "希腊"],
                            category: "culture"
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
                            name: "波斯帝国",
                            type: "event",
                            year: "公元前550年",
                            description: "居鲁士大帝建立波斯帝国，成为古代世界最大的帝国之一。",
                            importance: 5,
                            tags: ["帝国", "波斯", "征服"],
                            category: "politics",
                            location: "波斯"
                        },
                        {
                            name: "秦始皇统一中国",
                            type: "event",
                            year: "公元前221年",
                            description: "秦始皇统一六国，建立中国第一个中央集权制帝国，统一文字、度量衡。",
                            importance: 5,
                            tags: ["统一", "帝国", "中国"],
                            category: "politics",
                            location: "中国"
                        },
                        {
                            name: "罗马帝国建立",
                            type: "event",
                            year: "公元前27年",
                            description: "屋大维成为奥古斯都，罗马共和国转变为罗马帝国，开启罗马和平时代。",
                            importance: 5,
                            tags: ["罗马", "帝国", "和平"],
                            category: "politics",
                            location: "罗马"
                        },
                        {
                            name: "汉朝建立",
                            type: "event",
                            year: "公元前202年",
                            description: "刘邦建立汉朝，开创了中国历史上的黄金时代，丝绸之路由此开启。",
                            importance: 5,
                            tags: ["中国", "汉朝", "丝绸之路"],
                            category: "politics",
                            location: "中国"
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
                            description: "中国伟大的思想家、教育家，儒家学派创始人，提出仁、义、礼、智、信等理念。",
                            importance: 5,
                            tags: ["哲学", "教育", "儒家"],
                            category: "culture",
                            image: "confucius.jpg",
                            location: "中国"
                        },
                        {
                            name: "老子",
                            type: "person",
                            year: "约公元前571年-公元前471年",
                            description: "道家学派创始人，著有《道德经》，主张无为而治。",
                            importance: 5,
                            tags: ["哲学", "道家", "道德经"],
                            category: "culture",
                            location: "中国"
                        },
                        {
                            name: "苏格拉底",
                            type: "person",
                            year: "公元前470年-公元前399年",
                            description: "古希腊哲学家，西方哲学的奠基者之一，提出"认识你自己"。",
                            importance: 5,
                            tags: ["哲学", "希腊", "辩证法"],
                            category: "culture",
                            location: "雅典"
                        },
                        {
                            name: "柏拉图",
                            type: "person",
                            year: "公元前427年-公元前347年",
                            description: "古希腊哲学家，创立了柏拉图学院，著有《理想国》。",
                            importance: 5,
                            tags: ["哲学", "学院", "理想国"],
                            category: "culture",
                            location: "雅典"
                        },
                        {
                            name: "亚里士多德",
                            type: "person",
                            year: "公元前384年-公元前322年",
                            description: "古希腊哲学家、科学家，被誉为"百科全书式"的人物，亚历山大大帝的老师。",
                            importance: 5,
                            tags: ["哲学", "科学", "百科全书"],
                            category: "culture",
                            location: "雅典"
                        },
                        {
                            name: "释迦牟尼",
                            type: "person",
                            year: "约公元前563年-公元前483年",
                            description: "佛教创始人，原名乔达摩·悉达多，在菩提树下悟道成佛。",
                            importance: 5,
                            tags: ["宗教", "佛教", "觉悟"],
                            category: "culture",
                            location: "印度"
                        }
                    ]
                },
                {
                    name: "军事征服",
                    type: "branch",
                    category: "military",
                    children: [
                        {
                            name: "亚历山大大帝东征",
                            type: "event",
                            year: "公元前334年-公元前323年",
                            description: "马其顿国王亚历山大征服波斯、埃及、印度等地，建立了横跨欧亚非的帝国。",
                            importance: 5,
                            tags: ["征服", "马其顿", "帝国"],
                            category: "military",
                            location: "欧亚非"
                        },
                        {
                            name: "布匿战争",
                            type: "event",
                            year: "公元前264年-公元前146年",
                            description: "罗马与迦太基之间的三次战争，罗马最终获胜，成为地中海霸主。",
                            importance: 4,
                            tags: ["战争", "罗马", "迦太基"],
                            category: "military",
                            location: "地中海"
                        },
                        {
                            name: "汉尼拔翻越阿尔卑斯山",
                            type: "event",
                            year: "公元前218年",
                            description: "迦太基名将汉尼拔率军翻越阿尔卑斯山，突袭罗马。",
                            importance: 5,
                            tags: ["军事", "战术", "奇迹"],
                            category: "military",
                            location: "阿尔卑斯山"
                        }
                    ]
                },
                {
                    name: "科技发明",
                    type: "branch",
                    category: "technology",
                    children: [
                        {
                            name: "阿基米德原理",
                            type: "event",
                            year: "公元前250年",
                            description: "阿基米德发现浮力定律，奠定了流体力学基础。",
                            importance: 5,
                            tags: ["科学", "物理", "浮力"],
                            category: "technology"
                        },
                        {
                            name: "造纸术发明",
                            type: "event",
                            year: "公元105年",
                            description: "蔡伦改进造纸术，促进了文化的传播和保存。",
                            importance: 5,
                            tags: ["发明", "中国", "四大发明"],
                            category: "technology",
                            location: "中国"
                        },
                        {
                            name: "地心说",
                            type: "event",
                            year: "公元150年",
                            description: "托勒密提出地心说，统治天文学一千多年。",
                            importance: 4,
                            tags: ["天文学", "宇宙观"],
                            category: "technology"
                        }
                    ]
                },
                {
                    name: "经济贸易",
                    type: "branch",
                    category: "economy",
                    children: [
                        {
                            name: "丝绸之路开通",
                            type: "event",
                            year: "公元前139年",
                            description: "张骞出使西域，开通了连接东西方的丝绸之路，促进了贸易文化交流。",
                            importance: 5,
                            tags: ["贸易", "交流", "中国"],
                            category: "economy",
                            location: "欧亚大陆"
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
                            description: "穆罕默德在麦加创立伊斯兰教，深刻影响了世界历史。",
                            importance: 5,
                            tags: ["宗教", "伊斯兰", "文化"],
                            category: "culture",
                            location: "麦加"
                        },
                        {
                            name: "十字军东征",
                            type: "event",
                            year: "1096年-1291年",
                            description: "基督教国家发动的系列军事远征，争夺圣地耶路撒冷。",
                            importance: 4,
                            tags: ["宗教", "军事", "耶路撒冷"],
                            category: "military",
                            location: "中东"
                        },
                        {
                            name: "但丁《神曲》",
                            type: "event",
                            year: "1320年",
                            description: "但丁完成《神曲》，被视为中世纪文学的巅峰之作。",
                            importance: 5,
                            tags: ["文学", "诗歌", "意大利"],
                            category: "culture"
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
                            description: "李渊建立唐朝，开创了中国历史的黄金时代，文化繁荣，对外开放。",
                            importance: 5,
                            tags: ["中国", "盛世", "文化"],
                            category: "politics",
                            location: "长安"
                        },
                        {
                            name: "阿拉伯帝国",
                            type: "event",
                            year: "632年",
                            description: "穆罕默德去世后，阿拉伯帝国迅速扩张，成为横跨欧亚非的大帝国。",
                            importance: 5,
                            tags: ["帝国", "阿拉伯", "扩张"],
                            category: "politics",
                            location: "中东"
                        },
                        {
                            name: "蒙古帝国",
                            type: "event",
                            year: "1206年",
                            description: "成吉思汗统一蒙古各部，建立横跨欧亚的大帝国，改变了世界格局。",
                            importance: 5,
                            tags: ["蒙古", "征服", "帝国"],
                            category: "military",
                            location: "蒙古"
                        },
                        {
                            name: "元朝建立",
                            type: "event",
                            year: "1271年",
                            description: "忽必烈建立元朝，蒙古人统治中国，促进了东西方文化交流。",
                            importance: 5,
                            tags: ["中国", "蒙古", "统一"],
                            category: "politics",
                            location: "大都（北京）"
                        },
                        {
                            name: "明朝建立",
                            type: "event",
                            year: "1368年",
                            description: "朱元璋推翻元朝统治，建立明朝，恢复了汉人统治。",
                            importance: 5,
                            tags: ["中国", "朝代", "恢复"],
                            category: "politics",
                            location: "南京"
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
                            description: "毕昇发明活字印刷术，大大提高了印刷效率，推动了知识传播。",
                            importance: 5,
                            tags: ["发明", "中国", "四大发明"],
                            category: "technology",
                            location: "中国"
                        },
                        {
                            name: "指南针应用",
                            type: "event",
                            year: "11世纪",
                            description: "指南针应用于航海，促进了地理大发现。",
                            importance: 5,
                            tags: ["发明", "航海", "四大发明"],
                            category: "technology",
                            location: "中国"
                        },
                        {
                            name: "火药发明",
                            type: "event",
                            year: "9世纪",
                            description: "中国炼丹家发明火药，后传入欧洲，改变了战争形态。",
                            importance: 5,
                            tags: ["发明", "军事", "四大发明"],
                            category: "military",
                            location: "中国"
                        },
                        {
                            name: "造纸术传入欧洲",
                            type: "event",
                            year: "1150年",
                            description: "造纸术经阿拉伯传入欧洲，促进了欧洲文化发展。",
                            importance: 4,
                            tags: ["技术传播", "文化"],
                            category: "technology"
                        }
                    ]
                },
                {
                    name: "战争冲突",
                    type: "branch",
                    category: "military",
                    children: [
                        {
                            name: "百年战争",
                            type: "event",
                            year: "1337年-1453年",
                            description: "英法两国之间长达116年的战争，法国最终获胜。",
                            importance: 4,
                            tags: ["战争", "英国", "法国"],
                            category: "military",
                            location: "欧洲"
                        },
                        {
                            name: "黑死病",
                            type: "event",
                            year: "1347年-1351年",
                            description: "鼠疫席卷欧洲，造成约三分之一人口死亡，深刻改变了欧洲社会。",
                            importance: 5,
                            tags: ["瘟疫", "灾难", "欧洲"],
                            category: "culture",
                            location: "欧洲"
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
                            description: "文艺复兴时期的博学家，画家、发明家，创作了《蒙娜丽莎》《最后的晚餐》等杰作。",
                            importance: 5,
                            tags: ["艺术", "科学", "全能"],
                            category: "culture",
                            image: "davinci.jpg"
                        },
                        {
                            name: "米开朗基罗",
                            type: "person",
                            year: "1475年-1564年",
                            description: "意大利雕塑家、画家，文艺复兴三杰之一，创作了《大卫》《创世纪》等作品。",
                            importance: 5,
                            tags: ["艺术", "雕塑", "绘画"],
                            category: "culture"
                        },
                        {
                            name: "拉斐尔",
                            type: "person",
                            year: "1483年-1520年",
                            description: "意大利画家，文艺复兴三杰之一，以《雅典学院》等作品闻名。",
                            importance: 5,
                            tags: ["艺术", "绘画"],
                            category: "culture"
                        },
                        {
                            name: "莎士比亚",
                            type: "person",
                            year: "1564年-1616年",
                            description: "英国剧作家、诗人，创作了《哈姆雷特》《罗密欧与朱丽叶》等经典作品。",
                            importance: 5,
                            tags: ["文学", "戏剧", "诗歌"],
                            category: "culture"
                        }
                    ]
                },
                {
                    name: "地理大发现",
                    type: "branch",
                    category: "technology",
                    children: [
                        {
                            name: "哥伦布发现新大陆",
                            type: "event",
                            year: "1492年",
                            description: "哥伦布航行到达美洲，开启了大航海时代，改变了世界历史。",
                            importance: 5,
                            tags: ["航海", "发现", "美洲"],
                            category: "technology",
                            location: "大西洋"
                        },
                        {
                            name: "麦哲伦环球航行",
                            type: "event",
                            year: "1519年-1522年",
                            description: "麦哲伦船队完成人类首次环球航行，证明了地球是圆的。",
                            importance: 5,
                            tags: ["航海", "环球", "地理"],
                            category: "technology"
                        },
                        {
                            name: "郑和下西洋",
                            type: "event",
                            year: "1405年-1433年",
                            description: "郑和七次下西洋，展示了明朝的强大实力，促进了海外交流。",
                            importance: 5,
                            tags: ["航海", "中国", "交流"],
                            category: "technology",
                            location: "印度洋"
                        }
                    ]
                },
                {
                    name: "宗教改革",
                    type: "branch",
                    category: "culture",
                    children: [
                        {
                            name: "马丁·路德宗教改革",
                            type: "event",
                            year: "1517年",
                            description: "马丁·路德发表《九十五条论纲》，开启宗教改革，动摇了天主教会权威。",
                            importance: 5,
                            tags: ["宗教", "改革", "基督教"],
                            category: "culture",
                            location: "德国"
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
                            description: "瓦特改良蒸汽机，开启了工业革命，人类社会进入蒸汽时代。",
                            importance: 5,
                            tags: ["工业", "技术", "革命"],
                            category: "technology",
                            location: "英国"
                        },
                        {
                            name: "珍妮纺纱机",
                            type: "event",
                            year: "1764年",
                            description: "哈格里夫斯发明珍妮纺纱机，提高了纺织效率。",
                            importance: 4,
                            tags: ["发明", "工业", "纺织"],
                            category: "technology"
                        },
                        {
                            name: "电力应用",
                            type: "event",
                            year: "1879年",
                            description: "爱迪生发明实用电灯泡，改变了人类生活方式，开启了电气时代。",
                            importance: 5,
                            tags: ["发明", "电力", "爱迪生"],
                            category: "technology"
                        },
                        {
                            name: "电话发明",
                            type: "event",
                            year: "1876年",
                            description: "贝尔发明电话，革命性地改变了通信方式。",
                            importance: 5,
                            tags: ["发明", "通信", "贝尔"],
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
                            name: "英国光荣革命",
                            type: "event",
                            year: "1688年",
                            description: "英国发生光荣革命，确立了君主立宪制，为现代民主奠定基础。",
                            importance: 5,
                            tags: ["革命", "民主", "英国"],
                            category: "politics",
                            location: "英国"
                        },
                        {
                            name: "美国独立",
                            type: "event",
                            year: "1776年",
                            description: "美国发表《独立宣言》，建立共和制国家，影响了世界民主进程。",
                            importance: 5,
                            tags: ["独立", "民主", "美国"],
                            category: "politics",
                            location: "北美"
                        },
                        {
                            name: "法国大革命",
                            type: "event",
                            year: "1789年",
                            description: "法国人民推翻君主专制，传播自由、平等、博爱理念。",
                            importance: 5,
                            tags: ["革命", "民主", "法国"],
                            category: "politics",
                            location: "巴黎"
                        },
                        {
                            name: "拿破仑称帝",
                            type: "event",
                            year: "1804年",
                            description: "拿破仑加冕称帝，建立了法兰西第一帝国，横扫欧洲。",
                            importance: 5,
                            tags: ["帝国", "征服", "法国"],
                            category: "military",
                            location: "巴黎"
                        }
                    ]
                },
                {
                    name: "科学进步",
                    type: "branch",
                    category: "technology",
                    children: [
                        {
                            name: "哥白尼日心说",
                            type: "event",
                            year: "1543年",
                            description: "哥白尼发表《天体运行论》，提出日心说，颠覆了地心说。",
                            importance: 5,
                            tags: ["科学", "天文学", "革命"],
                            category: "technology"
                        },
                        {
                            name: "牛顿万有引力",
                            type: "event",
                            year: "1687年",
                            description: "牛顿发表《自然哲学的数学原理》，提出万有引力定律和三大运动定律。",
                            importance: 5,
                            tags: ["科学", "物理", "牛顿"],
                            category: "technology"
                        },
                        {
                            name: "达尔文进化论",
                            type: "event",
                            year: "1859年",
                            description: "达尔文发表《物种起源》，提出进化论，改变了人类对生命的认识。",
                            importance: 5,
                            tags: ["科学", "生物", "进化"],
                            category: "technology"
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
                            description: "人类历史上首次全球性战争，造成约1000万人死亡。",
                            importance: 5,
                            tags: ["战争", "全球", "灾难"],
                            category: "military",
                            location: "全球"
                        },
                        {
                            name: "第二次世界大战",
                            type: "event",
                            year: "1939年-1945年",
                            description: "人类历史上规模最大的战争，造成约7000万人死亡。",
                            importance: 5,
                            tags: ["战争", "全球", "灾难"],
                            category: "military",
                            location: "全球"
                        },
                        {
                            name: "珍珠港事件",
                            type: "event",
                            year: "1941年",
                            description: "日本偷袭珍珠港，美国参战，改变二战格局。",
                            importance: 5,
                            tags: ["战争", "美国", "日本"],
                            category: "military",
                            location: "夏威夷"
                        },
                        {
                            name: "诺曼底登陆",
                            type: "event",
                            year: "1944年",
                            description: "盟军在诺曼底登陆，开辟欧洲第二战场。",
                            importance: 5,
                            tags: ["战争", "登陆", "二战"],
                            category: "military",
                            location: "法国"
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
                            tags: ["科学", "物理", "爱因斯坦"],
                            category: "technology"
                        },
                        {
                            name: "原子弹爆炸",
                            type: "event",
                            year: "1945年",
                            description: "美国在日本广岛、长崎投下原子弹，人类进入核时代。",
                            importance: 5,
                            tags: ["核武器", "战争", "科技"],
                            category: "military",
                            location: "日本"
                        },
                        {
                            name: "DNA双螺旋结构",
                            type: "event",
                            year: "1953年",
                            description: "沃森和克里克发现DNA双螺旋结构，开启分子生物学时代。",
                            importance: 5,
                            tags: ["科学", "生物", "基因"],
                            category: "technology"
                        },
                        {
                            name: "互联网诞生",
                            type: "event",
                            year: "1969年",
                            description: "ARPANET建立，开启了互联网时代。",
                            importance: 5,
                            tags: ["技术", "网络", "互联网"],
                            category: "technology",
                            location: "美国"
                        },
                        {
                            name: "阿波罗登月",
                            type: "event",
                            year: "1969年",
                            description: "阿姆斯特朗成为第一个踏上月球的人类。",
                            importance: 5,
                            tags: ["航天", "登月", "美国"],
                            category: "technology",
                            location: "月球"
                        },
                        {
                            name: "人工智能",
                            type: "event",
                            year: "1956年",
                            description: "达特茅斯会议标志着人工智能学科的诞生。",
                            importance: 5,
                            tags: ["技术", "AI", "智能"],
                            category: "technology"
                        },
                        {
                            name: "智能手机",
                            type: "event",
                            year: "2007年",
                            description: "苹果发布iPhone，开启智能手机时代。",
                            importance: 5,
                            tags: ["技术", "手机", "苹果"],
                            category: "technology"
                        },
                        {
                            name: "ChatGPT发布",
                            type: "event",
                            year: "2022年",
                            description: "OpenAI发布ChatGPT，AI进入大众生活。",
                            importance: 5,
                            tags: ["AI", "语言模型", "技术"],
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
                            description: "毛泽东宣布中华人民共和国成立，中国人民站起来了。",
                            importance: 5,
                            tags: ["中国", "建国", "历史"],
                            category: "politics",
                            location: "北京"
                        },
                        {
                            name: "改革开放",
                            type: "event",
                            year: "1978年",
                            description: "邓小平推动改革开放，中国经济腾飞，成为世界第二大经济体。",
                            importance: 5,
                            tags: ["中国", "经济", "改革"],
                            category: "economy",
                            location: "中国"
                        },
                        {
                            name: "香港回归",
                            type: "event",
                            year: "1997年",
                            description: "香港回归祖国，洗刷百年国耻。",
                            importance: 5,
                            tags: ["中国", "统一", "香港"],
                            category: "politics",
                            location: "香港"
                        },
                        {
                            name: "北京奥运会",
                            type: "event",
                            year: "2008年",
                            description: "北京成功举办第29届夏季奥运会，向世界展示中国。",
                            importance: 5,
                            tags: ["中国", "体育", "国际"],
                            category: "culture",
                            location: "北京"
                        }
                    ]
                },
                {
                    name: "全球化",
                    type: "branch",
                    category: "economy",
                    children: [
                        {
                            name: "联合国成立",
                            type: "event",
                            year: "1945年",
                            description: "联合国成立，致力于维护世界和平与安全。",
                            importance: 5,
                            tags: ["国际", "和平", "组织"],
                            category: "politics",
                            location: "纽约"
                        },
                        {
                            name: "欧盟成立",
                            type: "event",
                            year: "1993年",
                            description: "欧洲联盟成立，欧洲一体化进程加快。",
                            importance: 5,
                            tags: ["欧洲", "一体化", "经济"],
                            category: "economy",
                            location: "欧洲"
                        },
                        {
                            name: "中国加入WTO",
                            type: "event",
                            year: "2001年",
                            description: "中国加入世界贸易组织，深度融入全球经济体系。",
                            importance: 5,
                            tags: ["中国", "经济", "全球化"],
                            category: "economy",
                            location: "中国"
                        }
                    ]
                }
            ]
        }
    ]
};

// 合并数据（如果有原有数据）
if (typeof historyData !== 'undefined') {
    // 使用扩展数据替换原数据
    historyData = extendedHistoryData;
}

// 导出扩展数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = extendedHistoryData;
}
