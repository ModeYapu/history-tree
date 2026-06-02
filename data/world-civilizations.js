/**
 * 世界文明数据集
 * 包含世界各大文明的重要事件、人物和时间线
 */

const WorldCivilizations = {
    // 美索不达米亚文明
    mesopotamia: {
        name: '美索不达米亚文明',
        region: '中东',
        color: '#CD853F',
        timeRange: { start: -4000, end: -539 },
        achievements: ['楔形文字', '汉谟拉比法典', '六十进制', '最早的城市'],
        declineCause: '波斯帝国征服',
        relationships: [
            { target: 'egypt', type: 'cultural', note: '文字与建筑交流' },
            { target: 'india', type: 'trade', via: '陆路贸易' }
        ],
        events: [
            { id: 'sumer_cities', name: '苏美尔城邦', year: -4000, type: 'event', importance: 5, description: '苏美尔人建立城邦', location: '美索不达米亚', category: 'politics', tags: ['文明', '城邦'] },
            { id: 'cuneiform', name: '楔形文字', year: -3200, type: 'event', importance: 5, description: '苏美尔人发明楔形文字', location: '美索不达米亚', category: 'culture', tags: ['文字', '发明'] },
            { id: 'akkadian_empire', name: '阿卡德帝国', year: -2334, type: 'event', importance: 5, description: '萨尔贡建立阿卡德帝国', location: '美索不达米亚', category: 'politics', tags: ['帝国', '统一'] },
            { id: 'hammurabi_code', name: '汉谟拉比法典', year: -1754, type: 'event', importance: 5, description: '汉谟拉比颁布法典', location: '巴比伦', category: 'culture', tags: ['法律', '法典'] },
            { id: 'assyrian_empire', name: '亚述帝国', year: -911, type: 'event', importance: 5, description: '亚述帝国崛起', location: '美索不达米亚', category: 'military', tags: ['帝国', '军事'] },
            { id: 'nebuchadnezzar', name: '巴比伦之囚', year: -586, type: 'event', importance: 4, description: '尼布甲尼撒二世征服犹太王国', location: '巴比伦', category: 'military', tags: ['战争', '征服'] }
        ],
        persons: [
            { id: 'sargon', name: '萨尔贡', year: -2334, type: 'person', importance: 5, description: '阿卡德帝国建立者', location: '基什', category: 'politics', tags: ['国王', '征服者'] },
            { id: 'hammurabi', name: '汉谟拉比', year: -1810, type: 'person', importance: 5, description: '巴比伦国王', location: '巴比伦', category: 'politics', tags: ['国王', '立法者'] },
            { id: 'gilgamesh', name: '吉尔伽美什', year: -2700, type: 'person', importance: 5, description: '乌鲁克国王，史诗主角', location: '乌鲁克', category: 'culture', tags: ['国王', '传说'] }
        ]
    },

    // 古埃及文明
    egypt: {
        name: '古埃及文明',
        region: '北非',
        color: '#DAA520',
        timeRange: { start: -3100, end: -30 },
        achievements: ['金字塔', '象形文字', '纸草', '木乃伊技术', '天文学'],
        declineCause: '被罗马征服，克利奥帕特拉七世自杀',
        relationships: [
            { target: 'mesopotamia', type: 'cultural', note: '文字与建筑交流' },
            { target: 'greece', type: 'cultural', note: '托勒密王朝' }
        ],
        events: [
            { id: 'egypt_unification', name: '埃及统一', year: -3100, type: 'event', importance: 5, description: '美尼斯统一上下埃及', location: '埃及', category: 'politics', tags: ['统一', '王朝'] },
            { id: 'pyramids', name: '金字塔建造', year: -2580, type: 'event', importance: 5, description: '胡夫金字塔建成', location: '吉萨', category: 'technology', tags: ['建筑', '陵墓'] },
            { id: 'hieroglyphs', name: '象形文字', year: -3200, type: 'event', importance: 5, description: '埃及象形文字使用', location: '埃及', category: 'culture', tags: ['文字', '发明'] },
            { id: 'hyksos_invasion', name: '喜克索斯入侵', year: -1650, type: 'event', importance: 4, description: '喜克索斯人入侵埃及', location: '埃及', category: 'military', tags: ['入侵', '战争'] },
            { id: 'ramses_temple', name: '阿布辛贝神庙', year: -1264, type: 'event', importance: 4, description: '拉美西斯二世建造神庙', location: '努比亚', category: 'culture', tags: ['建筑', '宗教'] },
            { id: 'alexandria_founding', name: '亚历山大城建立', year: -331, type: 'event', importance: 5, description: '亚历山大大帝建立亚历山大城', location: '埃及', category: 'politics', tags: ['建立', '城市'] },
            { id: 'library_alexandria', name: '亚历山大图书馆', year: -288, type: 'event', importance: 5, description: '建立亚历山大图书馆', location: '亚历山大', category: 'culture', tags: ['文化', '教育'] },
            { id: 'cleopatra_death', name: '埃及灭亡', year: -30, type: 'event', importance: 5, description: '克里奥帕特拉七世去世，埃及成为罗马行省', location: '埃及', category: 'politics', tags: ['灭亡', '罗马'] }
        ],
        persons: [
            { id: 'narmer', name: '美尼斯', year: -3100, type: 'person', importance: 5, description: '埃及第一位法老', location: '埃及', category: 'politics', tags: ['法老', '统一者'] },
            { id: 'khufu', name: '胡夫', year: -2589, type: 'person', importance: 5, description: '建造大金字塔', location: '埃及', category: 'politics', tags: ['法老', '建造者'] },
            { id: 'ramses_ii', name: '拉美西斯二世', year: -1303, type: 'person', importance: 5, description: '最伟大的法老之一', location: '埃及', category: 'politics', tags: ['法老', '建造者'] },
            { id: 'cleopatra', name: '克里奥帕特拉七世', year: -69, type: 'person', importance: 5, description: '埃及最后一位法老', location: '埃及', category: 'politics', tags: ['法老', '女王'] },
            { id: 'imhotep', name: '伊姆霍特普', year: -2600, type: 'person', importance: 5, description: '建筑师，医学家', location: '孟菲斯', category: 'technology', tags: ['建筑师', '医学家'] }
        ]
    },

    // 古希腊文明
    greece: {
        name: '古希腊文明',
        region: '欧洲',
        color: '#4169E1',
        timeRange: { start: -2000, end: -146 },
        achievements: ['民主制度', '哲学（苏格拉底/柏拉图/亚里士多德）', '奥林匹克', '几何学', '戏剧'],
        declineCause: '被罗马征服',
        relationships: [
            { target: 'egypt', type: 'cultural', note: '亚历山大城、托勒密王朝' },
            { target: 'roman', type: 'cultural', note: '罗马继承希腊文化' },
            { target: 'india', type: 'cultural', note: '亚历山大东征带来文化交流' },
            { target: 'mesopotamia', type: 'war', note: '波斯战争' }
        ],
        events: [
            { id: 'minoan_civilization', name: '米诺斯文明', year: -2000, type: 'event', importance: 4, description: '克里特岛米诺斯文明兴起', location: '克里特', category: 'culture', tags: ['文明', '海岛'] },
            { id: 'mycenaean_civilization', name: '迈锡尼文明', year: -1600, type: 'event', importance: 4, description: '迈锡尼文明兴起', location: '希腊', category: 'culture', tags: ['文明', '城邦'] },
            { id: 'trojan_war', name: '特洛伊战争', year: -1194, type: 'event', importance: 5, description: '特洛伊战争', location: '特洛伊', category: 'military', tags: ['战争', '传说'] },
            { id: 'first_olympics', name: '第一届奥运会', year: -776, type: 'event', importance: 5, description: '第一届古代奥运会', location: '奥林匹亚', category: 'culture', tags: ['体育', '节日'] },
            { id: 'dracon_laws', name: '德拉古法典', year: -621, type: 'event', importance: 4, description: '雅典颁布德拉古法典', location: '雅典', category: 'culture', tags: ['法律', '宪法'] },
            { id: 'solon_reforms', name: '梭伦改革', year: -594, type: 'event', importance: 5, description: '梭伦改革雅典宪法', location: '雅典', category: 'politics', tags: ['改革', '宪法'] },
            { id: 'persian_wars', name: '希波战争', year: -490, type: 'event', importance: 5, description: '希腊与波斯战争', location: '希腊', category: 'military', tags: ['战争', '防御'] },
            { id: 'golden_age_athens', name: '雅典黄金时代', year: -448, type: 'event', importance: 5, description: '伯里克利开启雅典黄金时代', location: '雅典', category: 'culture', tags: ['盛世', '文化'] },
            { id: 'peloponnesian_war', name: '伯罗奔尼撒战争', year: -431, type: 'event', importance: 5, description: '雅典与斯巴达战争', location: '希腊', category: 'military', tags: ['战争', '内战'] },
            { id: 'philip_conquest', name: '菲利普统一希腊', year: -338, type: 'event', importance: 4, description: '马其顿菲利普二世统一希腊', location: '希腊', category: 'politics', tags: ['统一', '征服'] },
            { id: 'alexander_campaign', name: '亚历山大东征', year: -334, type: 'event', importance: 5, description: '亚历山大大帝东征', location: '亚洲', category: 'military', tags: ['征服', '帝国'] },
            { id: 'hellenistic_period', name: '希腊化时代', year: -323, type: 'event', importance: 5, description: '希腊化时代开始', location: '地中海', category: 'culture', tags: ['时期', '文化'] }
        ],
        persons: [
            { id: 'homer', name: '荷马', year: -750, type: 'person', importance: 5, description: '《伊利亚特》《奥德赛》作者', location: '小亚细亚', category: 'culture', tags: ['诗人', '史诗'], relations: { influenced: ['socrates', 'plato', 'alexander'] } },
            { id: 'sappho', name: '萨福', year: -630, type: 'person', importance: 5, description: '古希腊女诗人', location: '莱斯博斯', category: 'culture', tags: ['诗人', '女性'], relations: { contemporary: ['alon', 'anacreon'] } },
            { id: 'thespis', name: '泰斯庇斯', year: -534, type: 'person', importance: 4, description: '悲剧创始人', location: '雅典', category: 'culture', tags: ['剧作家', '悲剧'], relations: { influenced: ['sophocles', 'euripides'] } },
            { id: 'pythagoras', name: '毕达哥拉斯', year: -570, type: 'person', importance: 5, description: '数学家、哲学家', location: '萨摩斯', category: 'technology', tags: ['数学家', '哲学家'], relations: { influenced: ['plato'], contemporary: ['socrates'] } },
            { id: 'socrates', name: '苏格拉底', year: -470, type: 'person', importance: 5, description: '哲学家', location: '雅典', category: 'culture', tags: ['哲学家', '教育家'], relations: { influenced: ['plato', 'xenophon'], contemporary: ['pericles', 'herodotus'] } },
            { id: 'plato', name: '柏拉图', year: -428, type: 'person', importance: 5, description: '哲学家', location: '雅典', category: 'culture', tags: ['哲学家', '学院'], relations: { caused_by: ['socrates'], influenced: ['aristotle'], contemporary: ['xenophon'] } },
            { id: 'aristotle', name: '亚里士多德', year: -384, type: 'person', importance: 5, description: '哲学家、科学家', location: '斯塔吉拉', category: 'technology', tags: ['哲学家', '科学家'], relations: { caused_by: ['plato'], influenced: ['alexander', 'euclid'], contemporary: ['alexander'] } },
            { id: 'herodotus', name: '希罗多德', year: -484, type: 'person', importance: 5, description: '历史学家', location: '哈利卡纳苏', category: 'culture', tags: ['历史学家', '作家'], relations: { contemporary: ['socrates', 'pericles'], influenced: ['thucydides'] } },
            { id: 'pericles', name: '伯里克利', year: -495, type: 'person', importance: 5, description: '雅典政治家', location: '雅典', category: 'politics', tags: ['政治家', '民主'], relations: { contemporary: ['socrates', 'phidias', 'herodotus'] } },
            { id: 'alexander', name: '亚历山大大帝', year: -356, type: 'person', importance: 5, description: '征服者', location: '佩拉', category: 'military', tags: ['国王', '征服者'], relations: { caused_by: ['philip_ii', 'aristotle'], influenced: ['ptolemy', 'seleucus'] } },
            { id: 'euclid', name: '欧几里得', year: -325, type: 'person', importance: 5, description: '几何学家', location: '亚历山大', category: 'technology', tags: ['数学家', '几何'], relations: { caused_by: ['aristotle', 'plato'], influenced: ['archimedes'] } },
            { id: 'archimedes', name: '阿基米德', year: -287, type: 'person', importance: 5, description: '科学家、发明家', location: '叙拉古', category: 'technology', tags: ['科学家', '发明家'], relations: { caused_by: ['euclid'], contemporary: ['erasatosthenes'] } },
            { id: 'hippocrates', name: '希波克拉底', year: -460, type: 'person', importance: 5, description: '医学之父', location: '科斯', category: 'technology', tags: ['医学家', '科学'], relations: { influenced: ['galen'], contemporary: ['socrates', 'democritus'] } }
        ]
    },

    // 古罗马文明
    roman: {
        name: '古罗马文明',
        region: '欧洲',
        color: '#DC143C',
        timeRange: { start: -753, end: 476 },
        achievements: ['罗马法', '道路系统', '混凝土', '共和制', '基督教国教化'],
        declineCause: '蛮族入侵、内部腐败、经济崩溃',
        relationships: [
            { target: 'greece', type: 'cultural', note: '继承希腊文化' },
            { target: 'byzantine', type: 'successor', note: '东罗马延续' },
            { target: 'egypt', type: 'war', note: '征服埃及' },
            { target: 'east_asia', type: 'trade', via: '丝绸之路' }
        ],
        events: [
            { id: 'roman_founding', name: '罗马建立', year: -753, type: 'event', importance: 5, description: '罗慕路斯建立罗马', location: '罗马', category: 'politics', tags: ['建立', '城市'] },
            { id: 'roman_republic', name: '罗马共和国', year: -509, type: 'event', importance: 5, description: '罗马共和国建立', location: '罗马', category: 'politics', tags: ['共和国', '宪法'] },
            { id: 'twelve_tables', name: '十二铜表法', year: -451, type: 'event', importance: 5, description: '罗马颁布十二铜表法', location: '罗马', category: 'culture', tags: ['法律', '法典'] },
            { id: 'punic_wars', name: '布匿战争', year: -264, type: 'event', importance: 5, description: '罗马与迦太基战争', location: '地中海', category: 'military', tags: ['战争', '征服'] },
            { id: 'spartacus_revolt', name: '斯巴达克斯起义', year: -73, type: 'event', importance: 4, description: '斯巴达克斯领导奴隶起义', location: '意大利', category: 'military', tags: ['起义', '奴隶'] },
            { id: 'caesar_crossing', name: '凯撒渡过卢比孔河', year: -49, type: 'event', importance: 5, description: '凯撒渡过卢比孔河', location: '卢比孔河', category: 'military', tags: ['战争', '内战'] },
            { id: 'roman_empire', name: '罗马帝国', year: -27, type: 'event', importance: 5, description: '奥古斯都建立罗马帝国', location: '罗马', category: 'politics', tags: ['帝国', '建立'] },
            { id: 'pax_romana', name: '罗马和平', year: 27, type: 'event', importance: 5, description: '罗马和平时期开始', location: '罗马', category: 'politics', tags: ['和平', '盛世'] },
            { id: 'colosseum', name: '罗马斗兽场建成', year: 80, type: 'event', importance: 4, description: '罗马斗兽场建成', location: '罗马', category: 'technology', tags: ['建筑', '娱乐'] },
            { id: 'christianity legalized', name: '基督教合法化', year: 313, type: 'event', importance: 5, description: '米兰敕令', location: '米兰', category: 'culture', tags: ['宗教', '法律'] },
            { id: 'constantinople_founding', name: '君士坦丁堡建立', year: 330, type: 'event', importance: 5, description: '君士坦丁堡建成', location: '拜占庭', category: 'technology', tags: ['城市', '建立'] },
            { id: 'rome_fall', name: '西罗马灭亡', year: 476, type: 'event', importance: 5, description: '西罗马帝国灭亡', location: '罗马', category: 'politics', tags: ['灭亡', '帝国'] }
        ],
        persons: [
            { id: 'romulus', name: '罗慕路斯', year: -771, type: 'person', importance: 5, description: '罗马建立者', location: '阿尔巴隆加', category: 'politics', tags: ['国王', '传说'] },
            { id: 'julius_caesar', name: '尤利乌斯·凯撒', year: -100, type: 'person', importance: 5, description: '军事家、政治家', location: '罗马', category: 'military', tags: ['将军', '独裁官'] },
            { id: 'cicero', name: '西塞罗', year: -106, type: 'person', importance: 5, description: '演说家、政治家', location: '阿尔皮诺', category: 'culture', tags: ['演说家', '哲学家'] },
            { id: 'augustus', name: '奥古斯都', year: -63, type: 'person', importance: 5, description: '罗马第一任皇帝', location: '罗马', category: 'politics', tags: ['皇帝', '建立者'] },
            { id: 'nero', name: '尼禄', year: 37, type: 'person', importance: 4, description: '罗马皇帝', location: '罗马', category: 'politics', tags: ['皇帝', '暴君'] },
            { id: 'trajan', name: '图拉真', year: 53, type: 'person', importance: 5, description: '罗马皇帝', location: '西班牙', category: 'military', tags: ['皇帝', '征服者'] },
            { id: 'marcus_aurelius', name: '马可·奥勒留', year: 121, type: 'person', importance: 5, description: '哲学家皇帝', location: '罗马', category: 'culture', tags: ['皇帝', '哲学家'] },
            { id: 'constantine', name: '君士坦丁大帝', year: 272, type: 'person', importance: 5, description: '第一位基督教皇帝', location: '塞尔维亚', category: 'politics', tags: ['皇帝', '基督徒'] },
            { id: 'justinian', name: '查士丁尼大帝', year: 483, type: 'person', importance: 5, description: '东罗马皇帝', location: '达尔达尼亚', category: 'politics', tags: ['皇帝', '法学家'] },
            { id: 'virgil', name: '维吉尔', year: -70, type: 'person', importance: 5, description: '诗人', location: '曼图亚', category: 'culture', tags: ['诗人', '史诗'] },
            { id: 'seneca', name: '塞内卡', year: -4, type: 'person', importance: 4, description: '哲学家、剧作家', location: '科尔多瓦', category: 'culture', tags: ['哲学家', '作家'] }
        ]
    },

    // 古印度文明
    india: {
        name: '古印度文明',
        region: '南亚',
        color: '#FF6347',
        timeRange: { start: -3300, end: 550 },
        achievements: ['佛教', '印度教', '零的发明', '阿育吠陀', '瑜伽'],
        declineCause: '外族入侵（白匈奴、伊斯兰征服）',
        relationships: [
            { target: 'east_asia', type: 'cultural', note: '佛教东传' },
            { target: 'greece', type: 'cultural', note: '亚历山大东征' },
            { target: 'islamic', type: 'war', note: '伊斯兰征服' }
        ],
        events: [
            { id: 'indus_valley', name: '印度河文明', year: -3300, type: 'event', importance: 5, description: '印度河文明兴起', location: '印度河流域', category: 'culture', tags: ['文明', '城市'] },
            { id: 'vedic_period', name: '吠陀时期', year: -1500, type: 'event', importance: 5, description: '吠陀时期开始', location: '北印度', category: 'culture', tags: ['时期', '宗教'] },
            { id: 'buddha_enlightenment', name: '佛陀悟道', year: -528, type: 'event', importance: 5, description: '释迦牟尼悟道', location: '菩提伽耶', category: 'culture', tags: ['宗教', '佛教'] },
            { id: 'mahavira', name: '大雄悟道', year: -527, type: 'event', importance: 4, description: '大雄创立耆那教', location: '印度', category: 'culture', tags: ['宗教', '耆那教'] },
            { id: 'mauryan_empire', name: '孔雀帝国', year: -322, type: 'event', importance: 5, description: '旃陀罗笈多建立孔雀帝国', location: '印度', category: 'politics', tags: ['帝国', '统一'] },
            { id: 'ashoka_reign', name: '阿育王统治', year: -268, type: 'event', importance: 5, description: '阿育王统一印度', location: '印度', category: 'politics', tags: ['皇帝', '佛教'] },
            { id: 'gupta_empire', name: '笈多帝国', year: 320, type: 'event', importance: 5, description: '笈多帝国黄金时代', location: '印度', category: 'politics', tags: ['帝国', '盛世'] },
            { id: 'chandra_gupta_ii', name: '超日王统治', year: 380, type: 'event', importance: 4, description: '超日王统治时期', location: '印度', category: 'politics', tags: ['皇帝', '盛世'] },
            { id: 'zero_invented', name: '零的发明', year: 500, type: 'event', importance: 5, description: '印度数学家发明零', location: '印度', category: 'technology', tags: ['数学', '发明'] },
            { id: 'ayurveda', name: '阿育吠陀', year: -500, type: 'event', importance: 4, description: '阿育吠陀医学体系', location: '印度', category: 'technology', tags: ['医学', '健康'] }
        ],
        persons: [
            { id: 'siddhartha', name: '释迦牟尼', year: -563, type: 'person', importance: 5, description: '佛教创始人', location: '蓝毗尼', category: 'culture', tags: ['佛陀', '宗教'] },
            { id: 'mahavira', name: '大雄', year: -599, type: 'person', importance: 4, description: '耆那教创始人', location: '印度', category: 'culture', tags: ['宗教', '圣人'] },
            { id: 'chanakya', name: '考底利耶', year: -371, type: 'person', importance: 5, description: '政治家、思想家', location: '印度', category: 'politics', tags: ['政治家', '思想家'] },
            { id: 'chandragupta', name: '旃陀罗笈多', year: -340, type: 'person', importance: 5, description: '孔雀帝国建立者', location: '印度', category: 'politics', tags: ['皇帝', '建立者'] },
            { id: 'ashoka', name: '阿育王', year: -304, type: 'person', importance: 5, description: '孔雀皇帝', location: '印度', category: 'politics', tags: ['皇帝', '佛教'] },
            { id: 'aryabhata', name: '阿耶波多', year: 476, type: 'person', importance: 5, description: '数学家、天文学家', location: '印度', category: 'technology', tags: ['数学家', '天文学家'] },
            { id: 'brahmagupta', name: '婆罗摩笈多', year: 598, type: 'person', importance: 5, description: '数学家', location: '印度', category: 'technology', tags: ['数学家', '零'] },
            { id: 'kalidasa', name: '迦梨陀娑', year: 400, type: 'person', importance: 5, description: '剧作家、诗人', location: '印度', category: 'culture', tags: ['剧作家', '诗人'] }
        ]
    },

    // 伊斯兰文明
    islamic: {
        name: '伊斯兰文明',
        region: '中东',
        color: '#2E8B57',
        timeRange: { start: 570, end: 1924 },
        achievements: ['代数学', '医学（伊本·西那）', '翻译运动', '清真寺建筑', '阿拉伯数字传播'],
        declineCause: '奥斯曼帝国解体',
        relationships: [
            { target: 'india', type: 'war', note: '伊斯兰征服' },
            { target: 'medieval_europe', type: 'war', note: '十字军战争' },
            { target: 'east_asia', type: 'trade', via: '丝绸之路' },
            { target: 'renaissance', type: 'cultural', note: '知识西传' },
            { target: 'byzantine', type: 'war', note: '攻陷君士坦丁堡' }
        ],
        events: [
            { id: 'muhammad_birth', name: '穆罕默德出生', year: 570, type: 'event', importance: 5, description: '先知穆罕默德出生', location: '麦加', category: 'culture', tags: ['宗教', '先知'] },
            { id: 'revelation', name: '启示降临', year: 610, type: 'event', importance: 5, description: '穆罕默德接受启示', location: '麦加', category: 'culture', tags: ['宗教', '启示'] },
            { id: 'hijra', name: '希吉拉（迁徙）', year: 622, type: 'event', importance: 5, description: '穆罕默德从麦加迁徙到麦地那', location: '麦地那', category: 'politics', tags: ['迁徙', '伊斯兰历'] },
            { id: 'islamic_expansion', name: '伊斯兰扩张', year: 632, type: 'event', importance: 5, description: '伊斯兰帝国开始扩张', location: '中东', category: 'military', tags: ['征服', '扩张'] },
            { id: 'battle_of_qadisiyyah', name: '卡迪西亚战役', year: 636, type: 'event', importance: 4, description: '穆斯林征服波斯', location: '伊拉克', category: 'military', tags: ['战争', '征服'] },
            { id: 'ummah', name: '乌玛建立', year: 622, type: 'event', importance: 4, description: '伊斯兰共同体建立', location: '麦地那', category: 'politics', tags: ['政治', '宗教'] },
            { id: 'house_of_wisdom', name: '智慧宫建立', year: 832, type: 'event', importance: 5, description: '巴格达智慧宫建立', location: '巴格达', category: 'culture', tags: ['学术', '翻译'] },
            { id: 'golden_age', name: '伊斯兰黄金时代', year: 800, type: 'event', importance: 5, description: '伊斯兰文明黄金时代', location: '中东', category: 'culture', tags: ['盛世', '学术'] },
            { id: 'ottoman_empire', name: '奥斯曼帝国', year: 1299, type: 'event', importance: 5, description: '奥斯曼帝国建立', location: '安纳托利亚', category: 'politics', tags: ['帝国', '建立'] },
            { id: 'fall_of_constantinople', name: '君士坦丁堡陷落', year: 1453, type: 'event', importance: 5, description: '奥斯曼帝国攻陷君士坦丁堡', location: '伊斯坦布尔', category: 'military', tags: ['战争', '征服'] }
        ],
        persons: [
            { id: 'muhammad', name: '穆罕默德', year: 570, type: 'person', importance: 5, description: '伊斯兰教先知', location: '麦加', category: 'culture', tags: ['先知', '宗教'] },
            { id: 'abu_bakr', name: '阿布·伯克尔', year: 573, type: 'person', importance: 4, description: '第一任哈里发', location: '麦加', category: 'politics', tags: ['哈里发', ' companions'] },
            { id: 'umar_ibn_khattab', name: '欧麦尔', year: 584, type: 'person', importance: 4, description: '第二任哈里发', location: '麦加', category: 'politics', tags: ['哈里发', '征服者'] },
            { id: 'ali', name: '阿里', year: 600, type: 'person', importance: 4, description: '第四任哈里发', location: '麦加', category: 'politics', tags: ['哈里发', 'imam'] },
            { id: 'al_khwarizmi', name: '花拉子米', year: 780, type: 'person', importance: 5, description: '数学家、天文学家', location: '花拉子模', category: 'technology', tags: ['数学家', '代数学'] },
            { id: 'al_razi', name: '拉齐', year: 854, type: 'person', importance: 4, description: '医学家', location: '赖伊', category: 'technology', tags: ['医学家', '化学家'] },
            { id: 'avicenna', name: '伊本·西那', year: 980, type: 'person', importance: 5, description: '医学家、哲学家', location: '布哈拉', category: 'technology', tags: ['医学家', '哲学家'] },
            { id: 'al_biruni', name: '比鲁尼', year: 973, type: 'person', importance: 5, description: '博学家', location: '花拉子模', category: 'technology', tags: ['博学家', '天文学家'] },
            { id: 'rumi', name: '鲁米', year: 1207, type: 'person', importance: 5, description: '苏菲诗人', location: '巴尔赫', category: 'culture', tags: ['诗人', '苏菲'] },
            { id: 'suleiman', name: '苏莱曼大帝', year: 1494, type: 'person', importance: 5, description: '奥斯曼皇帝', location: '特拉布宗', category: 'politics', tags: ['皇帝', '立法者'] }
        ]
    },

    // 中世纪欧洲
    medieval_europe: {
        name: '中世纪欧洲',
        region: '欧洲',
        color: '#708090',
        timeRange: { start: 476, end: 1453 },
        achievements: ['大学制度', '哥特式建筑', '骑士制度', '行会制度'],
        declineCause: '黑死病、百年战争、文艺复兴兴起',
        relationships: [
            { target: 'roman', type: 'successor', note: '西罗马崩溃后的继承' },
            { target: 'islamic', type: 'war', note: '十字军东征' },
            { target: 'byzantine', type: 'cultural', note: '东正教影响' },
            { target: 'mongol', type: 'war', note: '蒙古西征' },
            { target: 'renaissance', type: 'successor', note: '过渡到文艺复兴' }
        ],
        events: [
            { id: 'charlemagne_crowned', name: '查理曼加冕', year: 800, type: 'event', importance: 5, description: '查理曼加冕为皇帝', location: '罗马', category: 'politics', tags: ['皇帝', '加冕'] },
            { id: 'treaty_of_verdun', name: '凡尔登条约', year: 843, type: 'event', importance: 4, description: '查理曼帝国分裂', location: '凡尔登', category: 'politics', tags: ['条约', '分裂'] },
            { id: 'norman_conquest', name: '诺曼征服', year: 1066, type: 'event', importance: 5, description: '威廉征服英格兰', location: '英格兰', category: 'military', tags: ['征服', '战争'] },
            { id: 'first_crusade', name: '第一次十字军东征', year: 1096, type: 'event', importance: 5, description: '第一次十字军东征', location: '圣地', category: 'military', tags: ['战争', '宗教'] },
            { id: 'magna_carta', name: '大宪章', year: 1215, type: 'event', importance: 5, description: '英王约翰签署大宪章', location: '英格兰', category: 'culture', tags: ['法律', '自由'] },
            { id: 'mongol_invasion_europe', name: '蒙古入侵欧洲', year: 1236, type: 'event', importance: 4, description: '蒙古军队入侵欧洲', location: '东欧', category: 'military', tags: ['入侵', '战争'] },
            { id: 'black_death', name: '黑死病', year: 1347, type: 'event', importance: 5, description: '黑死病席卷欧洲', location: '欧洲', category: 'economy', tags: ['瘟疫', '灾难'] },
            { id: 'hundred_years_war', name: '百年战争', year: 1337, type: 'event', importance: 5, description: '英法百年战争', location: '法国', category: 'military', tags: ['战争', '百年'] },
            { id: 'fall_of_constantinople_medieval', name: '君士坦丁堡陷落', year: 1453, type: 'event', importance: 5, description: '东罗马帝国灭亡', location: '伊斯坦布尔', category: 'military', tags: ['战争', '灭亡'] }
        ],
        persons: [
            { id: 'charlemagne', name: '查理曼大帝', year: 742, type: 'person', importance: 5, description: '法兰克国王', location: '法兰克', category: 'politics', tags: ['国王', '皇帝'] },
            { id: 'william_conqueror', name: '威廉一世', year: 1028, type: 'person', importance: 5, description: '征服者威廉', location: '诺曼底', category: 'military', tags: ['国王', '征服者'] },
            { id: 'richard_lionheart', name: '理查一世', year: 1157, type: 'person', importance: 4, description: '狮心王理查', location: '英格兰', category: 'military', tags: ['国王', '十字军'] },
            { id: 'joan_of_arc', name: '圣女贞德', year: 1412, type: 'person', importance: 5, description: '法国民族英雄', location: '法国', category: 'military', tags: ['英雄', '圣女'] },
            { id: 'thomas_aquinas', name: '托马斯·阿奎那', year: 1225, type: 'person', importance: 5, description: '神学家、哲学家', location: '意大利', category: 'culture', tags: ['神学家', '哲学家'] },
            { id: 'dante', name: '但丁', year: 1265, type: 'person', importance: 5, description: '诗人', location: '佛罗伦萨', category: 'culture', tags: ['诗人', '神曲'] },
            { id: 'chaucer', name: '乔叟', year: 1343, type: 'person', importance: 4, description: '诗人', location: '伦敦', category: 'culture', tags: ['诗人', '作家'] },
            { id: 'genghis_khan_europe', name: '成吉思汗', year: 1162, type: 'person', importance: 5, description: '蒙古帝国建立者', location: '蒙古', category: 'military', tags: ['征服者', '可汗'] }
        ]
    },

    // 美洲文明
    americas: {
        name: '美洲文明',
        region: '美洲',
        color: '#228B22',
        timeRange: { start: -1500, end: 1533 },
        achievements: ['玛雅历法', '印加道路系统', '零的概念', '农业（玉米/土豆）'],
        declineCause: '欧洲殖民者征服',
        relationships: [
            { target: 'renaissance', type: 'war', note: '哥伦布发现美洲' },
            { target: 'enlightenment', type: 'cultural', note: '黄金白银流入欧洲' }
        ],
        events: [
            // 玛雅文明
            { id: 'maya_preclassic', name: '玛雅前古典期', year: -2000, type: 'event', importance: 4, description: '玛雅文明开始发展', location: '中美洲', category: 'culture', tags: ['文明', '玛雅'] },
            { id: 'maya_el_mirador', name: '埃尔米拉多', year: -600, type: 'event', importance: 4, description: '玛雅埃尔米拉多城市发展', location: '危地马拉', category: 'culture', tags: ['城市', '建筑'] },
            { id: 'maya_writing', name: '玛雅文字', year: -300, type: 'event', importance: 5, description: '玛雅文字系统发展', location: '中美洲', category: 'culture', tags: ['文字', '发明'] },
            { id: 'teotihuacan_built', name: '特奥蒂瓦坎', year: 100, type: 'event', importance: 5, description: '特奥蒂瓦坎城市建设', location: '墨西哥', category: 'technology', tags: ['城市', '金字塔'] },
            { id: 'tikal_built', name: '蒂卡尔建成', year: 200, type: 'event', importance: 4, description: '蒂卡尔成为玛雅大城市', location: '危地马拉', category: 'culture', tags: ['城市', '玛雅'] },
            { id: 'copan_built', name: '科潘建成', year: 426, type: 'event', importance: 4, description: '科潘王朝建立', location: '洪都拉斯', category: 'politics', tags: ['王朝', '玛雅'] },
            { id: 'palenque_built', name: '帕伦克繁荣', year: 600, type: 'event', importance: 4, description: '帕伦克城繁荣时期', location: '墨西哥', category: 'culture', tags: ['城市', '玛雅'] },
            { id: 'chichen_itza', name: '奇琴伊察', year: 850, type: 'event', importance: 5, description: '奇琴伊察建立', location: '墨西哥', category: 'culture', tags: ['城市', '金字塔'] },
            { id: 'maya_collapse', name: '玛雅崩溃', year: 900, type: 'event', importance: 5, description: '玛雅古典期崩溃', location: '中美洲', category: 'politics', tags: ['崩溃', '文明'] },
            { id: 'mayan_calendar', name: '玛雅历法', year: 500, type: 'event', importance: 5, description: '玛雅历法系统成熟', location: '中美洲', category: 'technology', tags: ['历法', '天文'] },
            // 阿兹特克文明
            { id: 'aztec_migration', name: '阿兹特克迁徙', year: 1100, type: 'event', importance: 4, description: '阿兹特克人迁徙到墨西哥谷', location: '墨西哥', category: 'politics', tags: ['迁徙', '阿兹特克'] },
            { id: 'tenochtitlan_founded', name: '特诺奇蒂特兰建立', year: 1325, type: 'event', importance: 5, description: '阿兹特克首都建立', location: '墨西哥', category: 'politics', tags: ['城市', '建立'] },
            { id: 'aztec_triple_alliance', name: '阿兹特克三国同盟', year: 1428, type: 'event', importance: 5, description: '阿兹特克三国同盟成立', location: '墨西哥', category: 'politics', tags: ['同盟', '帝国'] },
            { id: 'moctezuma_i', name: '蒙特祖马一世', year: 1440, type: 'event', importance: 4, description: '蒙特祖马一世扩张', location: '墨西哥', category: 'military', tags: ['扩张', '皇帝'] },
            { id: 'templo_mayor', name: '大神殿建成', year: 1487, type: 'event', importance: 5, description: '特诺奇蒂特兰大神殿建成', location: '墨西哥', category: 'culture', tags: ['建筑', '宗教'] },
            { id: 'aztec_conquest', name: '阿兹特克被征服', year: 1521, type: 'event', importance: 5, description: '西班牙征服阿兹特克', location: '墨西哥', category: 'military', tags: ['征服', '灭亡'] },
            // 印加文明
            { id: 'inca_beginnings', name: '印加兴起', year: 1200, type: 'event', importance: 4, description: '印加王国开始', location: '秘鲁', category: 'politics', tags: ['王国', '兴起'] },
            { id: 'pachacutec_reign', name: '帕查库特克统治', year: 1438, type: 'event', importance: 5, description: '帕查库特克建立印加帝国', location: '库斯科', category: 'politics', tags: ['皇帝', '帝国'] },
            { id: 'machu_picchu_built', name: '马丘比丘建成', year: 1450, type: 'event', importance: 5, description: '马丘比丘城堡建成', location: '秘鲁', category: 'technology', tags: ['建筑', '堡垒'] },
            { id: 'inca_road_system', name: '印加道路系统', year: 1400, type: 'event', importance: 5, description: '印加道路网建成', location: '安第斯', category: 'technology', tags: ['交通', '建设'] },
            { id: 'inca_expansion', name: '印加扩张', year: 1463, type: 'event', importance: 5, description: '印加帝国最大扩张', location: '南美', category: 'military', tags: ['扩张', '帝国'] },
            { id: 'inca_civil_war', name: '印加内战', year: 1529, type: 'event', importance: 4, description: '瓦斯卡尔与阿塔瓦尔帕内战', location: '秘鲁', category: 'military', tags: ['内战', '冲突'] },
            { id: 'inca_conquest', name: '印加被征服', year: 1533, type: 'event', importance: 5, description: '西班牙征服印加帝国', location: '秘鲁', category: 'military', tags: ['征服', '灭亡'] }
        ],
        persons: [
            // 玛雅人物
            { id: 'pakal', name: '帕卡尔大帝', year: 603, type: 'person', importance: 5, description: '帕伦克国王', location: '墨西哥', category: 'politics', tags: ['国王', '玛雅'] },
            { id: 'kakupacal', name: '卡库·帕卡尔', year: 734, type: 'person', importance: 4, description: '科潘国王', location: '洪都拉斯', category: 'politics', tags: ['国王', '玛雅'] },
            // 阿兹特克人物
            { id: 'acamapichtli', name: '阿卡马皮奇特利', year: 1367, type: 'person', importance: 4, description: '第一位阿兹特克皇帝', location: '墨西哥', category: 'politics', tags: ['皇帝', '建立'] },
            { id: 'itzcoatl', name: '伊兹科瓦特尔', year: 1380, type: 'person', importance: 5, description: '阿兹特克皇帝', location: '墨西哥', category: 'politics', tags: ['皇帝', '改革'] },
            { id: 'moctezuma_i', name: '蒙特祖马一世', year: 1398, type: 'person', importance: 5, description: '阿兹特克皇帝', location: '墨西哥', category: 'military', tags: ['皇帝', '征服者'] },
            { id: 'ahuitzotl', name: '阿维特佐特尔', year: 1481, type: 'person', importance: 4, description: '阿兹特克皇帝', location: '墨西哥', category: 'military', tags: ['皇帝', '扩张'] },
            { id: 'moctezuma_ii', name: '蒙特祖马二世', year: 1466, type: 'person', importance: 5, description: '阿兹特克末代皇帝', location: '墨西哥', category: 'politics', tags: ['皇帝', '灭亡'] },
            // 印加人物
            { id: 'pachacutec', name: '帕查库特克', year: 1418, type: 'person', importance: 5, description: '印加帝国建立者', location: '秘鲁', category: 'politics', tags: ['皇帝', '建立'] },
            { id: 'tupac_yupanqui', name: '图帕克·尤潘基', year: 1441, type: 'person', importance: 5, description: '印加皇帝', location: '秘鲁', category: 'military', tags: ['皇帝', '征服者'] },
            { id: 'huayna_capac', name: '瓦伊纳·卡帕克', year: 1465, type: 'person', importance: 5, description: '印加皇帝', location: '秘鲁', category: 'military', tags: ['皇帝', '扩张'] },
            { id: 'atahualpa', name: '阿塔瓦尔帕', year: 1502, type: 'person', importance: 5, description: '末代印加皇帝', location: '秘鲁', category: 'politics', tags: ['皇帝', '被俘'] }
        ]
    },

    // 非洲文明（除埃及外）
    africa: {
        name: '非洲文明',
        region: '非洲',
        color: '#FF8C00',
        timeRange: { start: -3000, end: 1600 },
        achievements: ['努比亚金字塔', '桑海帝国学术', '斯瓦西里贸易城邦', '马里帝国财富'],
        declineCause: '大西洋奴隶贸易',
        relationships: [
            { target: 'egypt', type: 'cultural', note: '尼罗河文明联系' },
            { target: 'islamic', type: 'trade', note: '跨撒哈拉贸易' },
            { target: 'medieval_europe', type: 'trade', note: '地中海贸易' }
        ],
        events: [
            { id: 'kush_kingdom', name: '库施王国', year: -800, type: 'event', importance: 4, description: '努比亚库施王国兴起', location: '苏丹', category: 'politics', tags: ['王国', '非洲'] },
            { id: 'axum_founding', name: '阿克苏姆建立', year: 100, type: 'event', importance: 5, description: '阿克苏姆王国建立', location: '埃塞俄比亚', category: 'politics', tags: ['王国', '建立'] },
            { id: 'axum_christianity', name: '阿克苏姆皈依基督教', year: 330, type: 'event', importance: 5, description: '埃扎纳皈依基督教', location: '埃塞俄比亚', category: 'culture', tags: ['宗教', '基督教'] },
            { id: 'ghana_empire', name: '加纳帝国', year: 700, type: 'event', importance: 5, description: '加纳帝国兴起', location: '西非', category: 'politics', tags: ['帝国', '贸易'] },
            { id: 'ghana_gold_trade', name: '加纳黄金贸易', year: 800, type: 'event', importance: 4, description: '加纳控制跨撒哈拉贸易', location: '西非', category: 'economy', tags: ['贸易', '黄金'] },
            { id: 'mali_empire', name: '马里帝国', year: 1235, type: 'event', importance: 5, description: '松迪亚塔建立马里帝国', location: '西非', category: 'politics', tags: ['帝国', '建立'] },
            { id: 'mansi_musa', name: '曼萨·穆萨朝觐', year: 1324, type: 'event', importance: 5, description: '曼萨·穆萨麦加朝觐', location: '埃及', category: 'culture', tags: ['朝觐', '财富'] },
            { id: 'timbuktu_center', name: '廷巴克图学术中心', year: 1350, type: 'event', importance: 5, description: '廷巴克图成为学术中心', location: '马里', category: 'culture', tags: ['学术', '伊斯兰'] },
            { id: 'songhai_empire', name: '桑海帝国', year: 1464, type: 'event', importance: 5, description: '桑海帝国兴起', location: '西非', category: 'politics', tags: ['帝国', '兴起'] },
            { id: 'songhai_peak', name: '桑海帝国全盛', year: 1493, type: 'event', importance: 5, description: '桑海帝国达到全盛', location: '西非', category: 'politics', tags: ['帝国', '全盛'] },
            { id: 'great_zimbabwe', name: '大津巴布韦', year: 1100, type: 'event', importance: 5, description: '大津巴布韦文明兴起', location: '津巴布韦', category: 'culture', tags: ['文明', '建筑'] },
            { id: 'zimbabwe_gold_trade', name: '津巴布韦贸易', year: 1200, type: 'event', importance: 4, description: '津巴布韦控制印度洋贸易', location: '津巴布韦', category: 'economy', tags: ['贸易', '黄金'] },
            { id: 'kilwa_sultanate', name: '基尔瓦苏丹国', year: 1000, type: 'event', importance: 4, description: '斯瓦希里海岸贸易城邦', location: '坦桑尼亚', category: 'economy', tags: ['贸易', '伊斯兰'] },
            { id: 'benin_kingdom', name: '贝宁王国', year: 1180, type: 'event', importance: 4, description: '贝宁王国兴起', location: '尼日利亚', category: 'culture', tags: ['王国', '艺术'] },
            { id: 'ife_art', name: '伊费艺术', year: 1100, type: 'event', importance: 5, description: '伊费青铜头像艺术', location: '尼日利亚', category: 'culture', tags: ['艺术', '青铜'] }
        ],
        persons: [
            { id: 'sundiata', name: '松迪亚塔', year: 1217, type: 'person', importance: 5, description: '马里帝国建立者', location: '马里', category: 'politics', tags: ['皇帝', '建立者'] },
            { id: 'mansa_musa', name: '曼萨·穆萨', year: 1280, type: 'person', importance: 5, description: '马里最富有的皇帝', location: '马里', category: 'politics', tags: ['皇帝', '财富'] },
            { id: 'sunni_ali', name: '桑尼·阿里', year: 1464, type: 'person', importance: 5, description: '桑海帝国皇帝', location: '尼日尔', category: 'military', tags: ['皇帝', '征服者'] },
            { id: 'askia_muhammad', name: '阿斯基亚·穆罕默德', year: 1443, type: 'person', importance: 5, description: '桑海帝国皇帝', location: '尼日尔', category: 'politics', tags: ['皇帝', '改革'] },
            { id: 'ezana', name: '埃扎纳', year: 320, type: 'person', importance: 4, description: '阿克苏姆皇帝', location: '埃塞俄比亚', category: 'politics', tags: ['皇帝', '基督教'] }
        ]
    },

    // 文艺复兴与近代欧洲
    renaissance: {
        name: '文艺复兴与近代欧洲',
        region: '欧洲',
        color: '#9370DB',
        timeRange: { start: 1400, end: 1600 },
        achievements: ['印刷术', '文艺复兴艺术', '宗教改革', '大航海', '日心说'],
        declineCause: '过渡到启蒙时代',
        relationships: [
            { target: 'medieval_europe', type: 'successor', note: '中世纪之后的觉醒' },
            { target: 'islamic', type: 'cultural', note: '伊斯兰知识传入' },
            { target: 'east_asia', type: 'technology', note: '造纸术、指南针西传' },
            { target: 'americas', type: 'exploration', note: '哥伦布发现美洲' },
            { target: 'japanese', type: 'cultural', note: '浮世绘影响' },
            { target: 'enlightenment', type: 'successor', note: '进入启蒙时代' }
        ],
        events: [
            { id: 'renaissance_begin', name: '文艺复兴开始', year: 1400, type: 'event', importance: 5, description: '意大利文艺复兴开始', location: '佛罗伦萨', category: 'culture', tags: ['时期', '文化'] },
            { id: 'printing_press', name: '印刷机发明', year: 1440, type: 'event', importance: 5, description: '古腾堡发明活字印刷机', location: '德国', category: 'technology', tags: ['发明', '印刷'] },
            { id: 'fall_of_constantinople', name: '君士坦丁堡陷落', year: 1453, type: 'event', importance: 5, description: '东罗马帝国灭亡', location: '伊斯坦布尔', category: 'military', tags: ['战争', '灭亡'] },
            { id: 'war_of_roses', name: '玫瑰战争', year: 1455, type: 'event', importance: 4, description: '英格兰玫瑰战争', location: '英格兰', category: 'military', tags: ['战争', '内战'] },
            { id: 'gutenberg_bible', name: '古腾堡圣经', year: 1455, type: 'event', importance: 5, description: '第一部印刷圣经', location: '德国', category: 'culture', tags: ['印刷', '宗教'] },
            { id: 'spanish_inquisition', name: '西班牙宗教裁判', year: 1478, type: 'event', importance: 4, description: '西班牙建立宗教裁判所', location: '西班牙', category: 'politics', tags: ['宗教', '裁判'] },
            { id: 'columbus_voyage', name: '哥伦布首航', year: 1492, type: 'event', importance: 5, description: '哥伦布发现美洲', location: '美洲', category: 'economy', tags: ['探险', '发现'] },
            { id: 'treaty_tordesillas', name: '托尔德西里亚斯条约', year: 1494, type: 'event', importance: 4, description: '教皇分割新世界', location: '西班牙', category: 'politics', tags: ['条约', '殖民'] },
            { id: 'davinci_paintings', name: '达芬奇创作期', year: 1490, type: 'event', importance: 5, description: '达芬奇创作名作', location: '米兰', category: 'culture', tags: ['艺术', '绘画'] },
            { id: 'reformation', name: '宗教改革', year: 1517, type: 'event', importance: 5, description: '路德发起宗教改革', location: '德国', category: 'culture', tags: ['宗教', '改革'] },
            { id: 'magellan_expedition', name: '麦哲伦环球航行', year: 1519, type: 'event', importance: 5, description: '麦哲伦开始环球航行', location: '大西洋', category: 'economy', tags: ['探险', '环球'] },
            { id: 'sack_of_rome', name: '罗马之劫', year: 1527, type: 'event', importance: 4, description: '神圣罗马帝国军队攻陷罗马', location: '罗马', category: 'military', tags: ['战争', '洗劫'] },
            { id: 'council_of_trent', name: '特伦特会议', year: 1545, type: 'event', importance: 5, description: '天主教反宗教改革', location: '意大利', category: 'culture', tags: ['宗教', '会议'] },
            { id: 'copernicus_theory', name: '哥白尼日心说', year: 1543, type: 'event', importance: 5, description: '哥白尼出版天体运行论', location: '波兰', category: 'technology', tags: ['科学', '天文'] },
            { id: 'act_of_supremacy', name: '至尊法案', year: 1534, type: 'event', importance: 5, description: '英格兰国王成为教会领袖', location: '英格兰', category: 'politics', tags: ['法律', '宗教'] },
            { id: 'eighty_years_war', name: '八十年战争', year: 1568, type: 'event', importance: 4, description: '荷兰独立战争', location: '尼德兰', category: 'military', tags: ['战争', '独立'] },
            { id: 'spanish_armada', name: '西班牙无敌舰队', year: 1588, type: 'event', importance: 5, description: '英国击败西班牙无敌舰队', location: '英吉利海峡', category: 'military', tags: ['海战', '胜利'] },
            { id: 'edict_of_nantes', name: '南特敕令', year: 1598, type: 'event', importance: 5, description: '法国宗教宽容法令', location: '法国', category: 'politics', tags: ['法律', '宗教'] }
        ],
        persons: [
            { id: 'leonardo_da_vinci', name: '达芬奇', year: 1452, type: 'person', importance: 5, description: '文艺复兴巨匠', location: '佛罗伦萨', category: 'culture', tags: ['艺术家', '发明家'] },
            { id: 'michelangelo', name: '米开朗基罗', year: 1475, type: 'person', importance: 5, description: '雕塑家、画家', location: '佛罗伦萨', category: 'culture', tags: ['艺术家', '雕塑'] },
            { id: 'raphael', name: '拉斐尔', year: 1483, type: 'person', importance: 5, description: '画家、建筑师', location: '乌尔比诺', category: 'culture', tags: ['艺术家', '绘画'] },
            { id: 'gutenberg', name: '古腾堡', year: 1400, type: 'person', importance: 5, description: '印刷机发明者', location: '德国', category: 'technology', tags: ['发明家', '印刷'] },
            { id: 'martin_luther', name: '马丁·路德', year: 1483, type: 'person', importance: 5, description: '宗教改革发起者', location: '德国', category: 'culture', tags: ['宗教', '改革'] },
            { id: 'christopher_columbus', name: '哥伦布', year: 1451, type: 'person', importance: 5, description: '发现美洲', location: '意大利', category: 'economy', tags: ['探险家', '航海'] },
            { id: 'ferdinand_magellan', name: '麦哲伦', year: 1480, type: 'person', importance: 5, description: '环球航海家', location: '葡萄牙', category: 'economy', tags: ['探险家', '航海'] },
            { id: 'nicolaus_copernicus', name: '哥白尼', year: 1473, type: 'person', importance: 5, description: '天文学家', location: '波兰', category: 'technology', tags: ['科学家', '天文'] },
            { id: 'henry_viii', name: '亨利八世', year: 1491, type: 'person', importance: 5, description: '英格兰国王', location: '英格兰', category: 'politics', tags: ['国王', '改革'] },
            { id: 'elizabeth_i', name: '伊丽莎白一世', year: 1533, type: 'person', importance: 5, description: '英格兰女王', location: '英格兰', category: 'politics', tags: ['女王', '盛世'] },
            { id: 'william_shakespeare', name: '莎士比亚', year: 1564, type: 'person', importance: 5, description: '剧作家', location: '英格兰', category: 'culture', tags: ['作家', '戏剧'] },
            { id: 'galileo', name: '伽利略', year: 1564, type: 'person', importance: 5, description: '科学家', location: '意大利', category: 'technology', tags: ['科学家', '天文'] }
        ]
    },

    // 启蒙时代与革命
    east_asia: {
        name: '东亚文明',
        region: '东亚',
        color: '#DC143C',
        timeRange: { start: -2070, end: 1912 },
        achievements: ['甲骨文', '青铜器', '造纸术', '指南针', '火药', '活字印刷', '丝绸', '科举制度'],
        declineCause: '西方工业革命冲击，封建制度僵化',
        relationships: [
            { target: 'mesopotamia', type: 'trade', via: '丝绸之路' },
            { target: 'islamic', type: 'trade', via: '丝绸之路' },
            { target: 'renaissance', type: 'technology', note: '造纸术、指南针西传' },
            { target: 'medieval_europe', type: 'trade', via: '马可·波罗' },
            { target: 'india', type: 'cultural', via: '佛教传播' }
        ],
        events: [
            { id: 'xia_dynasty', name: '夏朝建立', year: -2070, type: 'event', importance: 5, description: '大禹建夏，中国第一个王朝', location: '河南', category: 'politics', tags: ['王朝', '建立'] },
            { id: 'han_silk_road', name: '丝绸之路开辟', year: -138, type: 'event', importance: 5, description: '张骞出使西域，开辟丝绸之路', location: '长安', category: 'economy', tags: ['贸易', '外交'] },
            { id: 'paper_invention', name: '造纸术发明', year: 105, type: 'event', importance: 5, description: '蔡伦改进造纸术，传槽世界', location: '洛阳', category: 'technology', tags: ['发明', '传播'] },
            { id: 'compass_invention', name: '指南针发明', year: 1040, type: 'event', importance: 5, description: '中国发明指南针，后传入欧洲', location: '中国', category: 'technology', tags: ['发明', '航海'] },
            { id: 'gunpowder_invention', name: '火药发明', year: 850, type: 'event', importance: 5, description: '炼丹师意外发明火药', location: '中国', category: 'technology', tags: ['发明', '军事'] }
        ],
        persons: [
            { id: 'confucius', name: '孔子', year: -551, type: 'person', importance: 5, description: '儒家创始人', location: '鲁国', category: 'culture', tags: ['哲学家', '教育'] },
            { id: 'laozi', name: '老子', year: -571, type: 'person', importance: 5, description: '道家创始人', location: '楚国', category: 'culture', tags: ['哲学家', '道家'] },
            { id: 'qin_shihuang', name: '秦始皇', year: -259, type: 'person', importance: 5, description: '统一中国第一位皇帝', location: '咸阳', category: 'politics', tags: ['皇帝', '统一'] },
            { id: 'zhang_qian', name: '张骞', year: -164, type: 'person', importance: 5, description: '丝绸之路开拓者', location: '汉中', category: 'economy', tags: ['探险', '外交'] }
        ]
    },

    mongol: {
        name: '蒙古帝国',
        region: '欧亚大陆',
        color: '#8B4513',
        timeRange: { start: 1206, end: 1368 },
        achievements: ['横扫欧亚大陆', '驿站制度', '跨大陆贸易网络', '宗教宽容'],
        declineCause: '帝国分裂为四大汗国，内部分裂',
        relationships: [
            { target: 'islamic', type: 'war', note: '攻陷巴格达' },
            { target: 'medieval_europe', type: 'war', note: '西征至东欧' },
            { target: 'east_asia', type: 'war', note: '征服宋朝' },
            { target: 'india', type: 'war', note: '入侵印度' }
        ],
        events: [
            { id: 'genghis_unification', name: '成吉思汗统一蒙古', year: 1206, type: 'event', importance: 5, description: '铁木真统一蒙古各部，被尊为成吉思汗', location: '蒙古草原', category: 'politics', tags: ['统一', '帝国'] },
            { id: 'mongol_baghdad', name: '攻陷巴格达', year: 1258, type: 'event', importance: 5, description: '蒙古军队攻陷阿拔斯王朝首都巴格达', location: '巴格达', category: 'military', tags: ['征服', '战争'] },
            { id: 'mongol_yuan', name: '建立元朝', year: 1271, type: 'event', importance: 5, description: '忽必烈建立元朝，定都大都', location: '北京', category: 'politics', tags: ['王朝', '建立'] },
            { id: 'pax_mongolica', name: '蒙古和平', year: 1270, type: 'event', importance: 4, description: '蒙古帝国带来欧亚大陆和平贸易时期', location: '欧亚', category: 'economy', tags: ['和平', '贸易'] }
        ],
        persons: [
            { id: 'genghis_khan', name: '成吉思汗', year: 1162, type: 'person', importance: 5, description: '蒙古帝国创始人', location: '蒙古', category: 'military', tags: ['征服者', '领袖'] },
            { id: 'kublai_khan', name: '忽必烈', year: 1215, type: 'person', importance: 5, description: '元朝建立者', location: '蒙古', category: 'politics', tags: ['皇帝', '建设者'] }
        ]
    },

    byzantine: {
        name: '拜占庭帝国',
        region: '地中海东部',
        color: '#800080',
        timeRange: { start: 330, end: 1453 },
        achievements: ['查士丁尼法典', '东正教传播', '圣索菲亚大教堂', '保存古希腊罗马文化'],
        declineCause: '奥斯曼帝国攻陷君士坦丁堡',
        relationships: [
            { target: 'roman', type: 'successor', note: '东罗马帝国延续' },
            { target: 'islamic', type: 'war', note: '多次战争冲突' },
            { target: 'medieval_europe', type: 'cultural', note: '文化传播' },
            { target: 'renaissance', type: 'cultural', note: '学者西迁带去古典知识' }
        ],
        events: [
            { id: 'constantinople_founding', name: '君士坦丁堡建城', year: 330, type: 'event', importance: 5, description: '君士坦丁大帝迁都拜占庭', location: '君士坦丁堡', category: 'politics', tags: ['迁都', '建立'] },
            { id: 'justinian_code', name: '查士丁尼法典', year: 529, type: 'event', importance: 5, description: '编纂罗马法大全，影响至今', location: '君士坦丁堡', category: 'culture', tags: ['法律', '编纂'] },
            { id: 'hagia_sophia', name: '圣索菲亚大教堂建成', year: 537, type: 'event', importance: 5, description: '拜占庭建筑巅峰之作', location: '君士坦丁堡', category: 'technology', tags: ['建筑', '宗教'] },
            { id: 'iconoclasm', name: '圣像破坏运动', year: 726, type: 'event', importance: 4, description: '拜占庭皇帝禁止崇拜圣像', location: '拜占庭', category: 'culture', tags: ['宗教', '争议'] },
            { id: 'great_schism', name: '东西教会大分裂', year: 1054, type: 'event', importance: 5, description: '天主教与东正教正式分裂', location: '君士坦丁堡', category: 'culture', tags: ['宗教', '分裂'] },
            { id: 'byzantine_fall', name: '君士坦丁堡陷落', year: 1453, type: 'event', importance: 5, description: '奥斯曼帝国攻陷君士坦丁堡，拜占庭灭亡', location: '君士坦丁堡', category: 'military', tags: ['灭亡', '战争'] }
        ],
        persons: [
            { id: 'constantine_great', name: '君士坦丁大帝', year: 272, type: 'person', importance: 5, description: '第一位基督教皇帝', location: '塞尔维亚', category: 'politics', tags: ['皇帝', '基督教'] },
            { id: 'justinian_i', name: '查士丁尼一世', year: 483, type: 'person', importance: 5, description: '编篡法典的皇帝', location: '达尔达尼亚', category: 'politics', tags: ['皇帝', '法学家'] }
        ]
    },

    japanese: {
        name: '日本文明',
        region: '东亚',
        color: '#FF6347',
        timeRange: { start: -300, end: 2025 },
        achievements: ['武士道精神', '浮世绘', '茶道', '明治维新', '动漫文化'],
        declineCause: '少子化、经济停滞',
        relationships: [
            { target: 'east_asia', type: 'cultural', note: '汉字、佛教传入' },
            { target: 'medieval_europe', type: 'trade', note: '南蛮贸易' },
            { target: 'renaissance', type: 'cultural', note: '浮世绘影响印象派' },
            { target: 'enlightenment', type: 'trade', note: '黑船来航' }
        ],
        events: [
            { id: 'yayoi_period', name: '弥生时代', year: -300, type: 'event', importance: 4, description: '水稻种植传入日本，开始农业社会', location: '日本', category: 'culture', tags: ['时代', '农业'] },
            { id: 'taika_reform', name: '大化改新', year: 645, type: 'event', importance: 5, description: '效仿唐朝进行政治改革', location: '奈良', category: 'politics', tags: ['改革', '政治'] },
            { id: 'kamakura_shogunate', name: '镰仓幕府建立', year: 1192, type: 'event', importance: 5, description: '日本第一个武士政权', location: '镰仓', category: 'politics', tags: ['幕府', '武士'] },
            { id: 'sengoku_period', name: '战国时代', year: 1467, type: 'event', importance: 4, description: '群雄割据的动荡时期', location: '日本', category: 'military', tags: ['内战', '分裂'] },
            { id: 'edo_period', name: '江户时代开始', year: 1603, type: 'event', importance: 5, description: '德川家康统一日本，开启260年和平', location: '江户', category: 'politics', tags: ['统一', '和平'] },
            { id: 'meiji_restoration', name: '明治维新', year: 1868, type: 'event', importance: 5, description: '推翻幕府，全面西化改革', location: '东京', category: 'politics', tags: ['改革', '近代化'] }
        ],
        persons: [
            { id: 'prince_shotoku', name: '圣德太子', year: 574, type: 'person', importance: 5, description: '推行佛教、制定宪法', location: '奈良', category: 'politics', tags: ['摄政', '改革'] },
            { id: 'tokugawa_leyasu', name: '德川家康', year: 1543, type: 'person', importance: 5, description: '江户幕府创始人', location: '冈崎', category: 'politics', tags: ['将军', '统一'] },
            { id: 'emperor_meiji', name: '明治天皇', year: 1852, type: 'person', importance: 5, description: '推行明治维新', location: '东京', category: 'politics', tags: ['天皇', '近代化'] }
        ]
    },

    enlightenment: {
        name: '启蒙时代与革命',
        region: '欧美',
        color: '#4169E1',
        timeRange: { start: 1600, end: 1815 },
        achievements: ['科学方法', '启蒙思想', '民主制度', '工业革命', '人权概念'],
        declineCause: '演变为近现代民族国家体系',
        relationships: [
            { target: 'renaissance', type: 'successor', note: '文艺复兴的延续' },
            { target: 'east_asia', type: 'trade', note: '东西方贸易与冲突' },
            { target: 'japanese', type: 'trade', note: '黑船来航' }
        ],
        events: [
            { id: 'scientific_revolution', name: '科学革命', year: 1600, type: 'event', importance: 5, description: '现代科学兴起', location: '欧洲', category: 'technology', tags: ['科学', '革命'] },
            { id: 'thirty_years_war', name: '三十年战争', year: 1618, type: 'event', importance: 5, description: '欧洲宗教战争', location: '德国', category: 'military', tags: ['战争', '宗教'] },
            { id: 'westphalia_peace', name: '威斯特伐利亚和约', year: 1648, type: 'event', importance: 5, description: '建立现代国家体系', location: '德国', category: 'politics', tags: ['条约', '主权'] },
            { id: 'english_civil_war', name: '英国内战', year: 1642, type: 'event', importance: 4, description: '议会与国王战争', location: '英格兰', category: 'military', tags: ['战争', '内战'] },
            { id: 'glorious_revolution', name: '光荣革命', year: 1688, type: 'event', importance: 5, description: '英国君主立宪制确立', location: '英格兰', category: 'politics', tags: ['革命', '宪法'] },
            { id: 'newton_principia', name: '牛顿原理', year: 1687, type: 'event', importance: 5, description: '牛顿发表自然哲学原理', location: '英国', category: 'technology', tags: ['科学', '物理'] },
            { id: 'enlightenment_start', name: '启蒙时代开始', year: 1700, type: 'event', importance: 5, description: '理性主义兴起', location: '法国', category: 'culture', tags: ['时期', '思想'] },
            { id: 'industrial_revolution', name: '工业革命', year: 1760, type: 'event', importance: 5, description: '英国工业革命开始', location: '英国', category: 'technology', tags: ['工业', '革命'] },
            { id: 'american_revolution', name: '美国革命', year: 1775, type: 'event', importance: 5, description: '美国独立战争', location: '美国', category: 'politics', tags: ['革命', '独立'] },
            { id: 'french_revolution', name: '法国大革命', year: 1789, type: 'event', importance: 5, description: '法国大革命爆发', location: '法国', category: 'politics', tags: ['革命', '民主'] },
            { id: 'declaration_rights', name: '人权宣言', year: 1789, type: 'event', importance: 5, description: '法国通过人权宣言', location: '法国', category: 'culture', tags: ['法律', '人权'] },
            { id: 'napoleonic_wars', name: '拿破仑战争', year: 1803, type: 'event', importance: 5, description: '拿破仑征服欧洲', location: '欧洲', category: 'military', tags: ['战争', '征服'] },
            { id: 'congress_vienna', name: '维也纳会议', year: 1815, type: 'event', importance: 5, description: '欧洲战后重组', location: '奥地利', category: 'politics', tags: ['会议', '外交'] }
        ],
        persons: [
            { id: 'isaac_newton', name: '牛顿', year: 1643, type: 'person', importance: 5, description: '物理学家、数学家', location: '英国', category: 'technology', tags: ['科学家', '物理'] },
            { id: 'john_locke', name: '约翰·洛克', year: 1632, type: 'person', importance: 5, description: '哲学家', location: '英国', category: 'culture', tags: ['哲学家', '启蒙'] },
            { id: 'voltaire', name: '伏尔泰', year: 1694, type: 'person', importance: 5, description: '启蒙思想家', location: '法国', category: 'culture', tags: ['作家', '哲学'] },
            { id: 'montesquieu', name: '孟德斯鸠', year: 1689, type: 'person', importance: 5, description: '政治哲学家', location: '法国', category: 'culture', tags: ['哲学家', '政治'] },
            { id: 'rousseau', name: '卢梭', year: 1712, type: 'person', importance: 5, description: '哲学家', location: '瑞士', category: 'culture', tags: ['哲学家', '社会'] },
            { id: 'adam_smith', name: '亚当·斯密', year: 1723, type: 'person', importance: 5, description: '经济学家', location: '苏格兰', category: 'economy', tags: ['经济学家', '国富论'] },
            { id: 'george_washington', name: '乔治·华盛顿', year: 1732, type: 'person', importance: 5, description: '美国首任总统', location: '美国', category: 'politics', tags: ['总统', '建国'] },
            { id: 'thomas_jefferson', name: '托马斯·杰斐逊', year: 1743, type: 'person', importance: 5, description: '美国开国元勋', location: '美国', category: 'politics', tags: ['总统', '独立'] },
            { id: 'napoleon', name: '拿破仑', year: 1769, type: 'person', importance: 5, description: '法国皇帝', location: '法国', category: 'military', tags: ['皇帝', '征服者'] },
            { id: 'louis_xvi', name: '路易十六', year: 1754, type: 'person', importance: 4, description: '法国国王', location: '法国', category: 'politics', tags: ['国王', '处决'] },
            { id: 'maximilien_robespierre', name: '罗伯斯庇尔', year: 1758, type: 'person', importance: 5, description: '法国革命领袖', location: '法国', category: 'politics', tags: ['领袖', '恐怖'] }
        ]
    }
};

// 整理数据
const WorldCivilizationsData = {
    all: [],
    events: [],
    persons: [],
    civilizations: [],

    init() {
        Object.entries(WorldCivilizations).forEach(([key, civ]) => {
            // 添加文明信息
            this.civilizations.push({
                id: key,
                name: civ.name,
                region: civ.region,
                color: civ.color
            });

            // 处理事件
            if (civ.events) {
                civ.events.forEach(event => {
                    this.all.push({
                        ...event,
                        civilization: civ.name,
                        civKey: key,
                        region: civ.region
                    });
                    this.events.push({
                        ...event,
                        civilization: civ.name,
                        civKey: key,
                        region: civ.region
                    });
                });
            }

            // 处理人物
            if (civ.persons) {
                civ.persons.forEach(person => {
                    this.all.push({
                        ...person,
                        civilization: civ.name,
                        civKey: key,
                        region: civ.region
                    });
                    this.persons.push({
                        ...person,
                        civilization: civ.name,
                        civKey: key,
                        region: civ.region
                    });
                });
            }
        });
    },

    getStats() {
        return {
            civilizations: this.civilizations.length,
            events: this.events.length,
            persons: this.persons.length,
            total: this.all.length
        };
    }
};

// 初始化
WorldCivilizationsData.init();

// 导出到全局
window.WorldCivilizations = WorldCivilizations;
window.WorldCivilizationsData = WorldCivilizationsData;
