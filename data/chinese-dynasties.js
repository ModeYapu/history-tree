/**
 * 中国历代王朝数据集
 * 包含各朝代的重要事件、人物和时间线
 */

const ChineseDynasties = {
    // 先秦时期
    preQin: {
        name: '先秦',
        period: { start: -2070, end: -221 },
        color: '#8B4513',
        events: [
            { id: 'xia_founding', name: '夏朝建立', year: -2070, type: 'event', importance: 5, description: '大禹建立夏朝，中国历史上第一个王朝', location: '河南', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'xia_decline', name: '夏朝衰落', year: -1600, type: 'event', importance: 3, description: '夏桀暴政，夏朝衰落', location: '河南', category: 'politics', tags: ['衰落', '暴政'] },
            { id: 'shang_founding', name: '商朝建立', year: -1600, type: 'event', importance: 5, description: '商汤灭夏，建立商朝', location: '河南', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'shang_capital_move', name: '盘庚迁殷', year: -1300, type: 'event', importance: 4, description: '商王盘庚迁都于殷', location: '安阳', category: 'politics', tags: ['迁都', '商朝'] },
            { id: 'bronze_age_peak', name: '青铜文化鼎盛', year: -1200, type: 'event', importance: 4, description: '商朝青铜文化达到鼎盛，司母戊鼎铸造', location: '安阳', category: 'culture', tags: ['青铜', '艺术'] },
            { id: 'oracle_bones', name: '甲骨文使用', year: -1250, type: 'event', importance: 5, description: '商朝广泛使用甲骨文字', location: '安阳', category: 'culture', tags: ['文字', '考古'] },
            { id: 'zhou_founding', name: '周朝建立', year: -1046, type: 'event', importance: 5, description: '周武王伐纣，建立周朝', location: '陕西', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'duke_of_zhou', name: '周公摄政', year: -1042, type: 'event', importance: 5, description: '周公旦摄政，制礼作乐', location: '陕西', category: 'culture', tags: ['礼乐', '政治'] },
            { id: 'spring_autumn', name: '春秋时期开始', year: -770, type: 'event', importance: 4, description: '周平王东迁，春秋时期开始', location: '河南', category: 'politics', tags: ['时期', '分裂'] },
            { id: 'qi_hegemony', name: '齐桓公称霸', year: -651, type: 'event', importance: 4, description: '齐桓公成为春秋首霸', location: '山东', category: 'politics', tags: ['霸主', '春秋'] },
            { id: 'jin_rise', name: '晋文公称霸', year: -632, type: 'event', importance: 4, description: '晋文公城濮之战称霸', location: '山西', category: 'military', tags: ['霸主', '战争'] },
            { id: 'wue_rise', name: '吴越争霸', year: -494, type: 'event', importance: 4, description: '吴越两国争霸', location: '江浙', category: 'military', tags: ['争霸', '战争'] },
            { id: 'warring_states', name: '战国时期开始', year: -475, type: 'event', importance: 4, description: '三家分晋，战国时期开始', location: '山西', category: 'politics', tags: ['时期', '分裂'] },
            { id: 'shang_yang_reform', name: '商鞅变法', year: -356, type: 'event', importance: 5, description: '秦孝公任用商鞅变法', location: '咸阳', category: 'politics', tags: ['变法', '改革'] },
            { id: 'qin_unification', name: '秦统一六国', year: -221, type: 'event', importance: 5, description: '秦始皇统一中国，建立秦朝', location: '咸阳', category: 'politics', tags: ['统一', '帝国'] },
            { id: 'great_wall_qin', name: '秦筑长城', year: -214, type: 'event', importance: 4, description: '蒙恬率军修筑长城', location: '北方', category: 'military', tags: ['防御', '建筑'] },
            { id: 'terracotta_army', name: '兵马俑建造', year: -246, type: 'event', importance: 5, description: '秦始皇陵兵马俑开始建造', location: '西安', category: 'culture', tags: ['艺术', '陵墓'] },
            { id: 'book_burning', name: '焚书坑儒', year: -213, type: 'event', importance: 5, description: '秦始皇下令焚书坑儒', location: '咸阳', category: 'culture', tags: ['文化', '专制'] }
        ],
        persons: [
            { id: 'yu', name: '大禹', year: -2070, type: 'person', importance: 5, description: '夏朝建立者，治水英雄', location: '山西', category: 'politics', tags: ['君主', '治水'] },
            { id: 'tang_of_shang', name: '商汤', year: -1600, type: 'person', importance: 5, description: '商朝建立者', location: '河南', category: 'politics', tags: ['君主'] },
            { id: 'king_wu', name: '周武王', year: -1046, type: 'person', importance: 5, description: '周朝建立者', location: '陕西', category: 'politics', tags: ['君主'] },
            { id: 'confucius', name: '孔子', year: -551, type: 'person', importance: 5, description: '儒家学派创始人', location: '山东', category: 'culture', tags: ['哲学家', '教育家'] },
            { id: 'laozi', name: '老子', year: -571, type: 'person', importance: 5, description: '道家学派创始人', location: '河南', category: 'culture', tags: ['哲学家'] },
            { id: 'sun_tzu', name: '孙子', year: -544, type: 'person', importance: 5, description: '《孙子兵法》作者', location: '山东', category: 'military', tags: ['军事家', '思想家'] },
            { id: 'qin_shi_huang', name: '秦始皇', year: -259, type: 'person', importance: 5, description: '中国第一位皇帝', location: '咸阳', category: 'politics', tags: ['皇帝', '统一者'] },
            { id: 'li_si', name: '李斯', year: -284, type: 'person', importance: 4, description: '秦国丞相，法家代表人物', location: '楚国', category: 'politics', tags: ['政治家', '法家'] }
        ]
    },

    // 汉朝
    han: {
        name: '汉朝',
        period: { start: -202, end: 220 },
        color: '#DAA520',
        events: [
            { id: 'western_han', name: '西汉建立', year: -202, type: 'event', importance: 5, description: '刘邦建立西汉', location: '长安', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'baiqi_church', name: '白登之围', year: -200, type: 'event', importance: 4, description: '汉高祖被匈奴围困于白登', location: '山西', category: 'military', tags: ['战争', '匈奴'] },
            { id: 'lvzhi_rule', name: '吕后专权', year: -188, type: 'event', importance: 4, description: '吕后临朝称制', location: '长安', category: 'politics', tags: ['政治', '女主'] },
            { id: 'wen_jing_rule', name: '文景之治', year: -180, type: 'event', importance: 5, description: '汉文帝、汉景帝休养生息', location: '长安', category: 'politics', tags: ['盛世', '治理'] },
            { id: 'silk_road', name: '丝绸之路开通', year: -138, type: 'event', importance: 5, description: '张骞出使西域，开通丝绸之路', location: '西域', category: 'economy', tags: ['贸易', '外交'] },
            { id: 'hanyu_treaty', name: '汉越和亲', year: -133, type: 'event', importance: 4, description: '汉与匈奴和亲政策', location: '北方', category: 'politics', tags: ['外交', '和亲'] },
            { id: 'wei_qing_huo_qubing', name: '卫青霍去病北击匈奴', year: -119, type: 'event', importance: 5, description: '汉武帝派卫青、霍去病大破匈奴', location: '漠北', category: 'military', tags: ['战争', '征服'] },
            { id: 'sima_xiangru', name: '汉赋兴盛', year: -118, type: 'event', importance: 4, description: '司马相如等汉赋家创作繁荣', location: '长安', category: 'culture', tags: ['文学', '汉赋'] },
            { id: 'tianan_protection', name: '推恩令', year: -127, type: 'event', importance: 5, description: '汉武帝颁布推恩令削弱诸侯', location: '长安', category: 'politics', tags: ['政治', '集权'] },
            { id: 'sima_qian_shiji', name: '《史记》成书', year: -91, type: 'event', importance: 5, description: '司马迁完成《史记》', location: '长安', category: 'culture', tags: ['史学', '文学'] },
            { id: 'hoshu_rule', name: '霍光辅政', year: -74, type: 'event', importance: 4, description: '霍光辅佐汉昭帝、汉宣帝', location: '长安', category: 'politics', tags: ['政治', '辅政'] },
            { id: 'xuan_yuan_rule', name: '昭宣中兴', year: -70, type: 'event', importance: 4, description: '汉昭帝、汉宣帝时期的中兴', location: '长安', category: 'politics', tags: ['盛世', '中兴'] },
            { id: 'wang_mang', name: '王莽篡汉', year: 8, type: 'event', importance: 4, description: '王莽建立新朝', location: '长安', category: 'politics', tags: ['篡位', '新朝'] },
            { id: 'eastern_han', name: '东汉建立', year: 25, type: 'event', importance: 5, description: '刘秀建立东汉', location: '洛阳', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'ming_zhang_rule', name: '明章之治', year: 60, type: 'event', importance: 4, description: '汉明帝、汉章帝时期繁荣', location: '洛阳', category: 'politics', tags: ['盛世', '治理'] },
            { id: 'buddhism_in', name: '佛教传入中国', year: 67, type: 'event', importance: 5, description: '汉明帝时期佛教正式传入中国', location: '洛阳', category: 'culture', tags: ['宗教', '文化'] },
            { id: 'cai_lun_paper', name: '蔡伦改进造纸术', year: 105, type: 'event', importance: 5, description: '蔡伦改进造纸术', location: '洛阳', category: 'technology', tags: ['发明', '技术'] },
            { id: 'ban_gu_hanshu', name: '《汉书》成书', year: 92, type: 'event', importance: 4, description: '班固完成《汉书》', location: '洛阳', category: 'culture', tags: ['史学', '文学'] },
            { id: 'eunuch_power', name: '外戚宦官专权', year: 130, type: 'event', importance: 4, description: '外戚与宦官交替专权', location: '洛阳', category: 'politics', tags: ['政治', '腐败'] },
            { id: 'yellow_turban', name: '黄巾起义', year: 184, type: 'event', importance: 4, description: '张角领导黄巾起义', location: '全国', category: 'military', tags: ['起义', '宗教'] },
            { id: 'dong_zhuo', name: '董卓之乱', year: 189, type: 'event', importance: 4, description: '董卓进京，乱政', location: '洛阳', category: 'politics', tags: ['动乱', '权臣'] },
            { id: 'three_kingdoms', name: '三国时期开始', year: 220, type: 'event', importance: 5, description: '汉朝灭亡，三国时期开始', location: '全国', category: 'politics', tags: ['分裂', '三国'] }
        ],
        persons: [
            { id: 'liu_bang', name: '刘邦', year: -256, type: 'person', importance: 5, description: '汉高祖，西汉建立者', location: '沛县', category: 'politics', tags: ['皇帝'] },
            { id: 'han_wudi', name: '汉武帝', year: -156, type: 'person', importance: 5, description: '开创汉武盛世', location: '长安', category: 'politics', tags: ['皇帝', '盛世'] },
            { id: 'zhang_qian', name: '张骞', year: -164, type: 'person', importance: 5, description: '丝绸之路开拓者', location: '汉中', category: 'economy', tags: ['外交家', '探险家'] },
            { id: 'sima_qian', name: '司马迁', year: -145, type: 'person', importance: 5, description: '《史记》作者', location: '夏阳', category: 'culture', tags: ['史学家', '文学家'] },
            { id: 'liu_xiu', name: '刘秀', year: -5, type: 'person', importance: 5, description: '光武帝，东汉建立者', location: '南阳', category: 'politics', tags: ['皇帝'] },
            { id: 'cai_lun', name: '蔡伦', year: 63, type: 'person', importance: 5, description: '改进造纸术', location: '桂阳', category: 'technology', tags: ['发明家'] },
            { id: 'zhang_heng', name: '张衡', year: 78, type: 'person', importance: 5, description: '发明地动仪', location: '南阳', category: 'technology', tags: ['科学家', '发明家'] },
            { id: 'zhuge_liang', name: '诸葛亮', year: 181, type: 'person', importance: 5, description: '蜀汉丞相', location: '琅琊', category: 'politics', tags: ['政治家', '军事家'] }
        ]
    },

    // 魏晋南北朝
    wei_jin: {
        name: '魏晋南北朝',
        period: { start: 220, end: 581 },
        color: '#CD853F',
        events: [
            { id: 'three_kingdoms_start', name: '三国鼎立', year: 220, type: 'event', importance: 5, description: '魏蜀吴三国鼎立', location: '全国', category: 'politics', tags: ['分裂', '三国'] },
            { id: 'zhuge_liang_southern', name: '诸葛亮南征', year: 225, type: 'event', importance: 4, description: '诸葛亮平定南中', location: '云南', category: 'military', tags: ['征战', '平定'] },
            { id: 'five_northern_expeditions', name: '诸葛亮北伐', year: 228, type: 'event', importance: 5, description: '诸葛亮五次北伐曹魏', location: '关中', category: 'military', tags: ['北伐', '战争'] },
            { id: 'shu_fall', name: '蜀汉灭亡', year: 263, type: 'event', importance: 4, description: '曹魏灭蜀汉', location: '成都', category: 'military', tags: ['灭亡', '战争'] },
            { id: 'wei_abdication', name: '魏帝禅让', year: 265, type: 'event', importance: 4, description: '司马炎接受魏帝禅让', location: '洛阳', category: 'politics', tags: ['禅让', '篡位'] },
            { id: 'jin_unification', name: '西晋统一', year: 280, type: 'event', importance: 4, description: '司马炎灭吴，统一中国', location: '洛阳', category: 'politics', tags: ['统一', '王朝'] },
            { id: 'eight_princes', name: '八王之乱', year: 291, type: 'event', importance: 4, description: '西晋皇室内部纷争', location: '洛阳', category: 'military', tags: ['内乱', '八王'] },
            { id: 'five_hu', name: '五胡乱华', year: 304, type: 'event', importance: 5, description: '五胡十六国开始', location: '北方', category: 'military', tags: ['入侵', '混乱'] },
            { id: 'yongjia_disaster', name: '永嘉之乱', year: 311, type: 'event', importance: 5, description: '匈奴攻陷洛阳，西晋衰亡', location: '洛阳', category: 'military', tags: ['战乱', '灭亡'] },
            { id: 'eastern_jin', name: '东晋建立', year: 317, type: 'event', importance: 4, description: '司马睿建立东晋', location: '建康', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'wang_dao_politics', name: '王导执政', year: 323, type: 'event', importance: 4, description: '王导辅佐晋元帝', location: '建康', category: 'politics', tags: ['政治', '辅政'] },
            { id: 'fei_river', name: '淝水之战', year: 383, type: 'event', importance: 5, description: '东晋击败前秦苻坚', location: '安徽', category: 'military', tags: ['战争', '胜利'] },
            { id: 'xie_an_family', name: '谢氏家族兴起', year: 390, type: 'event', importance: 4, description: '谢安、谢玄等谢氏家族掌权', location: '建康', category: 'politics', tags: ['家族', '政治'] },
            { id: 'yuanjia_rule', name: '元嘉之治', year: 440, type: 'event', importance: 4, description: '南朝宋文帝统治时期', location: '建康', category: 'politics', tags: ['盛世', '治理'] },
            { id: 'northern_southern', name: '南北朝开始', year: 420, type: 'event', importance: 4, description: '东晋灭亡，南北朝开始', location: '全国', category: 'politics', tags: ['分裂', '南北朝'] },
            { id: 'northern_wei_reform', name: '北魏孝文帝改革', year: 490, type: 'event', importance: 5, description: '孝文帝推行汉化改革', location: '洛阳', category: 'politics', tags: ['改革', '汉化'] },
            { id: 'liang_wudi_buddhism', name: '梁武帝崇佛', year: 520, type: 'event', importance: 4, description: '梁武帝萧衍大力推崇佛教', location: '建康', category: 'culture', tags: ['佛教', '宗教'] },
            { id: 'hou_jing_rebellion', name: '侯景之乱', year: 548, type: 'event', importance: 5, description: '侯景叛乱，南朝衰弱', location: '建康', category: 'military', tags: ['叛乱', '战争'] },
            { id: 'northern_zhou_split', name: '北周分立', year: 557, type: 'event', importance: 4, description: '西魏为北周取代', location: '长安', category: 'politics', tags: ['政权', '更迭'] },
            { id: 'yang_jian_rise', name: '杨坚掌权', year: 580, type: 'event', importance: 5, description: '杨坚掌握北周大权', location: '长安', category: 'politics', tags: ['掌权', '篡位'] }
        ],
        persons: [
            { id: 'cao_cao', name: '曹操', year: 155, type: 'person', importance: 5, description: '魏国奠基人', location: '沛国', category: 'politics', tags: ['政治家', '军事家', '诗人'] },
            { id: 'liu_bei', name: '刘备', year: 161, type: 'person', importance: 5, description: '蜀汉建立者', location: '涿郡', category: 'politics', tags: ['皇帝'] },
            { id: 'sun_quan', name: '孙权', year: 182, type: 'person', importance: 5, description: '东吴建立者', location: '吴郡', category: 'politics', tags: ['皇帝'] },
            { id: 'sima_yan', name: '司马炎', year: 236, type: 'person', importance: 4, description: '晋武帝，西晋建立者', location: '河内', category: 'politics', tags: ['皇帝'] },
            { id: 'tao_yuanming', name: '陶渊明', year: 352, type: 'person', importance: 5, description: '田园诗人', location: '浔阳', category: 'culture', tags: ['诗人', '文学家'] },
            { id: 'wang_xizhi', name: '王羲之', year: 303, type: 'person', importance: 5, description: '书圣', location: '琅琊', category: 'culture', tags: ['书法家', '艺术家'] }
        ]
    },

    // 隋唐
    sui_tang: {
        name: '隋唐',
        period: { start: 581, end: 907 },
        color: '#FFD700',
        events: [
            { id: 'sui_founding', name: '隋朝建立', year: 581, type: 'event', importance: 5, description: '杨坚建立隋朝', location: '长安', category: 'politics', tags: ['建立', '统一'] },
            { id: 'sui_unification', name: '隋统一中国', year: 589, type: 'event', importance: 5, description: '隋灭陈，统一中国', location: '建康', category: 'politics', tags: ['统一', '战争'] },
            { id: 'kaihuang_rule', name: '开皇之治', year: 590, type: 'event', importance: 5, description: '隋文帝开皇年间的治世', location: '长安', category: 'politics', tags: ['盛世', '治理'] },
            { id: 'grand_canal', name: '大运河开凿', year: 605, type: 'event', importance: 5, description: '隋炀帝开凿大运河', location: '全国', category: 'technology', tags: ['建设', '交通'] },
            { id: 'sui_korea_war', name: '隋征高句丽', year: 612, type: 'event', importance: 4, description: '隋炀帝三征高句丽', location: '朝鲜', category: 'military', tags: ['战争', '失败'] },
            { id: 'sui_rebellion', name: '隋末农民起义', year: 613, type: 'event', importance: 5, description: '瓦岗军等农民起义', location: '全国', category: 'military', tags: ['起义', '战争'] },
            { id: 'tang_founding', name: '唐朝建立', year: 618, type: 'event', importance: 5, description: '李渊建立唐朝', location: '长安', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'xuanwu_gate', name: '玄武门之变', year: 626, type: 'event', importance: 5, description: '李世民发动玄武门之变', location: '长安', category: 'politics', tags: ['政变', '夺权'] },
            { id: 'zhenguan_reign', name: '贞观之治', year: 627, type: 'event', importance: 5, description: '唐太宗开创贞观之治', location: '长安', category: 'politics', tags: ['盛世', '治理'] },
            { id: 'xuanzang_pilgrimage', name: '玄奘西行', year: 629, type: 'event', importance: 5, description: '玄奘前往印度取经', location: '西域', category: 'culture', tags: ['宗教', '旅行'] },
            { id: 'tang_taizong_korea', name: '唐征高句丽', year: 645, type: 'event', importance: 4, description: '唐太宗征高句丽', location: '朝鲜', category: 'military', tags: ['战争', '征伐'] },
            { id: 'tang_gaozong', name: '唐高宗统治', year: 650, type: 'event', importance: 4, description: '唐高宗时期唐朝版图最大', location: '长安', category: 'politics', tags: ['盛世', '扩张'] },
            { id: 'wu_zetian_rise', name: '武则天称帝', year: 690, type: 'event', importance: 5, description: '武则天建立武周', location: '洛阳', category: 'politics', tags: ['皇帝', '女性'] },
            { id: 'kaiyuan_era', name: '开元盛世', year: 713, type: 'event', importance: 5, description: '唐玄宗开创开元盛世', location: '长安', category: 'politics', tags: ['盛世', '繁荣'] },
            { id: 'tang_poetry_peak', name: '唐诗兴盛', year: 720, type: 'event', importance: 5, description: '李白、杜甫等诗人活跃', location: '长安', category: 'culture', tags: ['诗歌', '文学'] },
            { id: 'jianzhen_east', name: '鉴真东渡', year: 753, type: 'event', importance: 4, description: '鉴真到达日本', location: '日本', category: 'culture', tags: ['宗教', '外交'] },
            { id: 'an_lushan', name: '安史之乱', year: 755, type: 'event', importance: 5, description: '安禄山叛乱', location: '北方', category: 'military', tags: ['叛乱', '战争'] },
            { id: 'tang_decline', name: '藩镇割据', year: 780, type: 'event', importance: 4, description: '安史之乱后藩镇割据', location: '全国', category: 'politics', tags: ['分裂', '割据'] },
            { id: 'yongzai_reform', name: '永贞革新', year: 805, type: 'event', importance: 4, description: '顺宗时期革新运动', location: '长安', category: 'politics', tags: ['改革', '革新'] },
            { id: 'huang_chao', name: '黄巢起义', year: 875, type: 'event', importance: 4, description: '黄巢领导农民起义', location: '全国', category: 'military', tags: ['起义', '农民'] },
            { id: 'tang_downfall', name: '唐朝灭亡', year: 907, type: 'event', importance: 5, description: '朱温篡唐', location: '长安', category: 'politics', tags: ['灭亡', '王朝'] },
            { id: 'wudai_shiguo_begin', name: '五代十国开始', year: 907, type: 'event', importance: 4, description: '唐朝灭亡后进入五代十国时期', location: '全国', category: 'politics', tags: ['分裂', '五代'] }
        ],
        persons: [
            { id: 'yang_jian', name: '隋文帝', year: 541, type: 'person', importance: 5, description: '隋朝建立者', location: '弘农', category: 'politics', tags: ['皇帝', '统一者'] },
            { id: 'li_yuan', name: '唐高祖', year: 566, type: 'person', importance: 5, description: '唐朝建立者', location: '长安', category: 'politics', tags: ['皇帝'] },
            { id: 'li_shimin', name: '唐太宗', year: 598, type: 'person', importance: 5, description: '开创贞观之治', location: '长安', category: 'politics', tags: ['皇帝', '明君'] },
            { id: 'wu_zetian', name: '武则天', year: 624, type: 'person', importance: 5, description: '中国唯一女皇帝', location: '并州', category: 'politics', tags: ['皇帝', '女性'] },
            { id: 'li_longji', name: '唐玄宗', year: 685, type: 'person', importance: 5, description: '开创开元盛世', location: '长安', category: 'politics', tags: ['皇帝', '盛世'] },
            { id: 'li_bai', name: '李白', year: 701, type: 'person', importance: 5, description: '诗仙', location: '碎叶', category: 'culture', tags: ['诗人', '浪漫主义'] },
            { id: 'du_fu', name: '杜甫', year: 712, type: 'person', importance: 5, description: '诗圣', location: '巩县', category: 'culture', tags: ['诗人', '现实主义'] },
            { id: 'bai_juyi', name: '白居易', year: 772, type: 'person', importance: 5, description: '现实主义诗人', location: '太原', category: 'culture', tags: ['诗人'] },
            { id: 'xuanzang', name: '玄奘', year: 602, type: 'person', importance: 5, description: '佛经翻译家', location: '洛阳', category: 'culture', tags: ['僧人', '翻译家'] },
            { id: 'yan_zhenqing', name: '颜真卿', year: 709, type: 'person', importance: 4, description: '书法家', location: '京兆', category: 'culture', tags: ['书法家'] }
        ]
    },

    // 宋朝
    song: {
        name: '宋朝',
        period: { start: 960, end: 1279 },
        color: '#E6B800',
        events: [
            { id: 'chenqiao_mutiny', name: '陈桥兵变', year: 960, type: 'event', importance: 5, description: '赵匡胤陈桥兵变，黄袍加身', location: '开封', category: 'politics', tags: ['政变', '建立'] },
            { id: 'northern_song', name: '北宋建立', year: 960, type: 'event', importance: 5, description: '赵匡胤建立北宋', location: '开封', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'cup_wine_relieve', name: '杯酒释兵权', year: 961, type: 'event', importance: 5, description: '宋太祖解除将领兵权', location: '开封', category: 'politics', tags: ['政治', '集权'] },
            { id: 'song_taizong', name: '宋太宗统一', year: 979, type: 'event', importance: 4, description: '宋太宗灭北汉，基本统一', location: '太原', category: 'military', tags: ['统一', '战争'] },
            { id: 'chanyuan_treaty', name: '澶渊之盟', year: 1005, type: 'event', importance: 4, description: '宋辽澶渊之盟', location: '澶渊', category: 'politics', tags: ['条约', '和平'] },
            { id: 'song_technology', name: '宋科技发展', year: 1010, type: 'event', importance: 4, description: '宋朝科技文化繁荣', location: '开封', category: 'technology', tags: ['科技', '文化'] },
            { id: 'qingli_reform', name: '庆历新政', year: 1043, type: 'event', importance: 4, description: '范仲淹推行庆历新政', location: '开封', category: 'politics', tags: ['改革', '新政'] },
            { id: 'printing_invention', name: '毕昇发明活字印刷', year: 1040, type: 'event', importance: 5, description: '毕昇发明泥活字印刷术', location: '中国', category: 'technology', tags: ['发明', '技术'] },
            { id: 'gunpowder_weapons', name: '火药武器化', year: 1044, type: 'event', importance: 5, description: '《武经总要》记载火药配方', location: '中国', category: 'technology', tags: ['发明', '军事'] },
            { id: 'wang_anshi_reform', name: '王安石变法', year: 1069, type: 'event', importance: 5, description: '王安石推行新法', location: '开封', category: 'politics', tags: ['改革', '变法'] },
            { id: 'compass_navigation', name: '指南针用于航海', year: 1080, type: 'event', importance: 5, description: '指南针开始用于航海', location: '中国', category: 'technology', tags: ['发明', '技术'] },
            { id: 'yuanfu_reform', name: '元祐更化', year: 1086, type: 'event', importance: 4, description: '司马光废除新法', location: '开封', category: 'politics', tags: ['政治', '改革'] },
            { id: 'song_culture_peak', name: '宋词兴盛', year: 1100, type: 'event', importance: 5, description: '苏轼、黄庭坚等词人活跃', location: '开封', category: 'culture', tags: ['文学', '宋词'] },
            { id: 'four_inventions', name: '四大发明成熟', year: 1100, type: 'event', importance: 5, description: '造纸、印刷、火药、指南针四大发明成熟', location: '中国', category: 'technology', tags: ['发明', '科技'] },
            { id: 'huizong_dao', name: '宋徽宗道君', year: 1111, type: 'event', importance: 4, description: '宋徽宗崇道', location: '开封', category: 'culture', tags: ['宗教', '道教'] },
            { id: 'jingkang_incident', name: '靖康之变', year: 1127, type: 'event', importance: 5, description: '金兵攻陷开封，北宋灭亡', location: '开封', category: 'military', tags: ['战争', '灭亡'] },
            { id: 'southern_song', name: '南宋建立', year: 1127, type: 'event', importance: 5, description: '赵构建立南宋', location: '临安', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'shaoxing_peace', name: '绍兴和议', year: 1141, type: 'event', importance: 4, description: '宋金绍兴和议', location: '临安', category: 'politics', tags: ['条约', '和平'] },
            { id: 'yue_fei_death', name: '岳飞被害', year: 1142, type: 'event', importance: 5, description: '岳飞被秦桧陷害', location: '临安', category: 'military', tags: ['冤案', '英雄'] },
            { id: 'longxing_northern', name: '隆兴北伐', year: 1163, type: 'event', importance: 4, description: '张浚北伐', location: '中原', category: 'military', tags: ['北伐', '战争'] },
            { id: 'kai_xi_northern', name: '开禧北伐', year: 1206, type: 'event', importance: 4, description: '韩侂胄北伐', location: '中原', category: 'military', tags: ['北伐', '战争'] },
            { id: 'song_economy_peak', name: '南宋经济繁荣', year: 1200, type: 'event', importance: 5, description: '南宋经济达到鼎盛', location: '江南', category: 'economy', tags: ['经济', '繁荣'] },
            { id: 'mongol_invasion_song', name: '蒙宋战争', year: 1235, type: 'event', importance: 5, description: '蒙古开始进攻南宋', location: '四川', category: 'military', tags: ['战争', '入侵'] },
            { id: 'diezhi_chuanxi', name: '钓鱼城之战', year: 1259, type: 'event', importance: 5, description: '蒙哥汗死于钓鱼城', location: '重庆', category: 'military', tags: ['战争', '胜利'] },
            { id: 'xianyang_battle', name: '襄阳之战', year: 1273, type: 'event', importance: 5, description: '襄阳失守，南宋危亡', location: '湖北', category: 'military', tags: ['战争', '失败'] },
            { id: 'song_fall', name: '南宋灭亡', year: 1279, type: 'event', importance: 5, description: '崖山海战，南宋灭亡', location: '广东', category: 'military', tags: ['灭亡', '战争'] }
        ],
        persons: [
            { id: 'zhao_kuangyin', name: '赵匡胤', year: 927, type: 'person', importance: 5, description: '宋太祖，北宋建立者', location: '涿州', category: 'politics', tags: ['皇帝'] },
            { id: 'wang_anshi', name: '王安石', year: 1021, type: 'person', importance: 5, description: '政治家、文学家', location: '临川', category: 'politics', tags: ['改革家', '文学家'] },
            { id: 'su_shi', name: '苏轼', year: 1037, type: 'person', importance: 5, description: '文学家、书画家', location: '眉山', category: 'culture', tags: ['文学家', '诗人', '画家'] },
            { id: 'li_qingzhao', name: '李清照', year: 1084, type: 'person', importance: 5, description: '女词人', location: '济南', category: 'culture', tags: ['诗人', '女性'] },
            { id: 'bi_sheng', name: '毕昇', year: 970, type: 'person', importance: 5, description: '活字印刷术发明者', location: '蕲州', category: 'technology', tags: ['发明家'] },
            { id: 'shen_kuo', name: '沈括', year: 1031, type: 'person', importance: 5, description: '科学家，《梦溪笔谈》作者', location: '钱塘', category: 'technology', tags: ['科学家', '博物学家'] },
            { id: 'sima_guang', name: '司马光', year: 1019, type: 'person', importance: 5, description: '史学家，《资治通鉴》作者', location: '夏县', category: 'culture', tags: ['史学家', '政治家'] },
            { id: 'yue_fei', name: '岳飞', year: 1103, type: 'person', importance: 5, description: '抗金名将', location: '汤阴', category: 'military', tags: ['军事家', '民族英雄'] },
            { id: 'xin_qiji', name: '辛弃疾', year: 1140, type: 'person', importance: 5, description: '词人', location: '历城', category: 'culture', tags: ['诗人', '爱国'] },
            { id: 'zhu_xi', name: '朱熹', year: 1130, type: 'person', importance: 5, description: '理学家', location: '婺源', category: 'culture', tags: ['哲学家', '理学家'] }
        ]
    },

    // 元朝
    yuan: {
        name: '元朝',
        period: { start: 1271, end: 1368 },
        color: '#808080',
        events: [
            { id: 'mongol_unification', name: '蒙古统一', year: 1206, type: 'event', importance: 5, description: '成吉思汗统一蒙古各部', location: '蒙古', category: 'politics', tags: ['统一', '蒙古'] },
            { id: 'mongol_expansion', name: '蒙古扩张', year: 1211, type: 'event', importance: 5, description: '蒙古开始向外扩张', location: '中亚', category: 'military', tags: ['扩张', '征服'] },
            { id: 'kublai_rise', name: '忽必烈即位', year: 1260, type: 'event', importance: 5, description: '忽必烈成为蒙古大汗', location: '开平', category: 'politics', tags: ['即位', '可汗'] },
            { id: 'yuan_founding', name: '元朝建立', year: 1271, type: 'event', importance: 5, description: '忽必烈建立元朝', location: '大都', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'forbidden_city', name: '大都建设', year: 1272, type: 'event', importance: 4, description: '开始建设元大都', location: '北京', category: 'technology', tags: ['建设', '建筑'] },
            { id: 'song_destruction', name: '南宋灭亡', year: 1279, type: 'event', importance: 5, description: '元军灭南宋', location: '崖山', category: 'military', tags: ['灭亡', '统一'] },
            { id: 'yuan_system', name: '行省制度', year: 1285, type: 'event', importance: 5, description: '元朝建立行省制度', location: '大都', category: 'politics', tags: ['制度', '行政'] },
            { id: 'maritime_expeditions', name: '海上贸易', year: 1280, type: 'event', importance: 4, description: '发展海上丝绸之路', location: '沿海', category: 'economy', tags: ['贸易', '外交'] },
            { id: 'yuan_culture', name: '元曲兴盛', year: 1290, type: 'event', importance: 5, description: '关汉卿等元曲家创作活跃', location: '大都', category: 'culture', tags: ['戏曲', '文学'] },
            { id: ' expedition_japan', name: '元征日本', year: 1274, type: 'event', importance: 4, description: '元朝两次远征日本', location: '日本', category: 'military', tags: ['战争', '失败'] },
            { id: 'expedition_vietnam', name: '元征安南', year: 1285, type: 'event', importance: 4, description: '元朝征伐安南', location: '越南', category: 'military', tags: ['战争', '失败'] },
            { id: 'yuan_economy', name: '元朝经济', year: 1300, type: 'event', importance: 4, description: '元朝经济繁荣，贸易发达', location: '大都', category: 'economy', tags: ['经济', '贸易'] },
            { id: 'ayuribala_reform', name: '爱育黎拔力八达改革', year: 1312, type: 'event', importance: 4, description: '元仁宗推行汉化改革', location: '大都', category: 'politics', tags: ['改革', '汉化'] },
            { id: 'yuan Decline', name: '元朝衰落', year: 1333, type: 'event', importance: 4, description: '元顺帝时期元朝衰落', location: '大都', category: 'politics', tags: ['衰落', '腐败'] },
            { id: 'red_turban', name: '红巾军起义', year: 1351, type: 'event', importance: 5, description: '红巾军起义', location: '全国', category: 'military', tags: ['起义', '农民'] },
            { id: 'zhu_rise', name: '朱元璋崛起', year: 1356, type: 'event', importance: 5, description: '朱元璋攻占集庆', location: '南京', category: 'military', tags: ['崛起', '起义'] },
            { id: 'yuan_fall', name: '元朝灭亡', year: 1368, type: 'event', importance: 5, description: '明军攻入大都，元朝灭亡', location: '大都', category: 'military', tags: ['灭亡', '战争'] }
        ],
        persons: [
            { id: 'kublai_khan', name: '忽必烈', year: 1215, type: 'person', importance: 5, description: '元世祖，元朝建立者', location: '蒙古', category: 'politics', tags: ['皇帝'] },
            { id: 'marco_polo', name: '马可·波罗', year: 1254, type: 'person', importance: 4, description: '意大利旅行家', location: '威尼斯', category: 'culture', tags: ['旅行家', '商人'] },
            { id: 'guan_dao', name: '关汉卿', year: 1220, type: 'person', importance: 5, description: '戏曲家', location: '大都', category: 'culture', tags: ['戏曲家', '文学家'] },
            { id: 'zhu_yuanzhang', name: '朱元璋', year: 1328, type: 'person', importance: 5, description: '明朝建立者', location: '濠州', category: 'politics', tags: ['皇帝', '起义'] }
        ]
    },

    // 明朝
    ming: {
        name: '明朝',
        period: { start: 1368, end: 1644 },
        color: '#DC143C',
        events: [
            { id: 'ming_founding', name: '明朝建立', year: 1368, type: 'event', importance: 5, description: '朱元璋建立明朝', location: '南京', category: 'politics', tags: ['建立', '王朝'] },
            { id: 'hongwu_reform', name: '洪武之治', year: 1370, type: 'event', importance: 5, description: '明太祖洪武年间的治世', location: '南京', category: 'politics', tags: ['盛世', '治理'] },
            { id: 'hu_weiyong_case', name: '胡惟庸案', year: 1380, type: 'event', importance: 4, description: '明太祖废除丞相制度', location: '南京', category: 'politics', tags: ['政治', '集权'] },
            { id: 'lan_yu_case', name: '蓝玉案', year: 1393, type: 'event', importance: 4, description: '明太祖诛杀功臣', location: '南京', category: 'politics', tags: ['政治', '清洗'] },
            { id: 'jingnan_campaign', name: '靖难之役', year: 1399, type: 'event', importance: 5, description: '朱棣起兵夺取皇位', location: '北方', category: 'military', tags: ['政变', '战争'] },
            { id: 'yongle_move_capital', name: '永乐迁都', year: 1421, type: 'event', importance: 5, description: '明成祖迁都北京', location: '北京', category: 'politics', tags: ['迁都', '政治'] },
            { id: 'yongle_encylopedia', name: '《永乐大典》编成', year: 1408, type: 'event', importance: 5, description: '世界最大的百科全书', location: '南京', category: 'culture', tags: ['文化', '编撰'] },
            { id: 'zheng_he_voyage', name: '郑和下西洋', year: 1405, type: 'event', importance: 5, description: '郑和开始七下西洋', location: '西洋', category: 'economy', tags: ['外交', '航海'] },
            { id: 'forbidden_city_built', name: '紫禁城建成', year: 1420, type: 'event', importance: 5, description: '北京紫禁城建成', location: '北京', category: 'technology', tags: ['建筑', '皇宫'] },
            { id: 'tumu_crisis', name: '土木堡之变', year: 1449, type: 'event', importance: 4, description: '明英宗被瓦剌俘虏', location: '土木堡', category: 'military', tags: ['战争', '危机'] },
            { id: 'chenghua_reign', name: '成化新政', year: 1465, type: 'event', importance: 4, description: '明宪宗成化年间的治理', location: '北京', category: 'politics', tags: ['政治', '治理'] },
            { id: 'hongzhi_reign', name: '弘治中兴', year: 1488, type: 'event', importance: 5, description: '明孝宗弘治年间的中兴', location: '北京', category: 'politics', tags: ['盛世', '中兴'] },
            { id: 'zhengde_reign', name: '正德年间', year: 1506, type: 'event', importance: 4, description: '明武宗正德年间', location: '北京', category: 'politics', tags: ['政治', '皇帝'] },
            { id: 'great_wall_ming', name: '明长城修建', year: 1500, type: 'event', importance: 4, description: '大规模修建明长城', location: '北方', category: 'military', tags: ['防御', '建筑'] },
            { id: 'wang_yangming', name: '王阳明心学', year: 1520, type: 'event', importance: 5, description: '王阳明提出心学思想', location: '贵州', category: 'culture', tags: ['哲学', '思想'] },
            { id: 'jiajing_reign', name: '嘉靖年间', year: 1522, type: 'event', importance: 4, description: '明世宗嘉靖年间', location: '北京', category: 'politics', tags: ['政治', '皇帝'] },
            { id: 'longqing_reign', name: '隆庆新政', year: 1567, type: 'event', importance: 4, description: '明穆宗隆庆年间的改革', location: '北京', category: 'politics', tags: ['改革', '政治'] },
            { id: 'wanli_reign', name: '万历中兴', year: 1573, type: 'event', importance: 5, description: '明神宗万历初年张居正改革', location: '北京', category: 'politics', tags: ['盛世', '改革'] },
            { id: 'three_campaigns', name: '万历三大征', year: 1592, type: 'event', importance: 4, description: '万历年间三次大规模战争', location: '全国', category: 'military', tags: ['战争', '征伐'] },
            { id: 'donglin_academy', name: '东林党议', year: 1604, type: 'event', importance: 4, description: '东林书院建立，东林党兴起', location: '无锡', category: 'culture', tags: ['政治', '学术'] },
            { id: 'manchu_rise', name: '后金崛起', year: 1616, type: 'event', importance: 5, description: '努尔哈赤建立后金', location: '赫图阿拉', category: 'military', tags: ['崛起', '战争'] },
            { id: 'ming_decline', name: '明朝衰落', year: 1620, type: 'event', importance: 4, description: '明末天启、崇祯年间衰落', location: '北京', category: 'politics', tags: ['衰落', '腐败'] },
            { id: 'li_zicheng', name: '李自成进京', year: 1644, type: 'event', importance: 5, description: '李自成攻入北京', location: '北京', category: 'military', tags: ['起义', '战争'] },
            { id: 'chongzhen_suicide', name: '崇祯自缢', year: 1644, type: 'event', importance: 5, description: '明思宗崇祯皇帝自缢煤山', location: '北京', category: 'politics', tags: ['灭亡', '悲剧'] }
        ],
        persons: [
            { id: 'ming_taizu', name: '明太祖', year: 1328, type: 'person', importance: 5, description: '明朝建立者', location: '濠州', category: 'politics', tags: ['皇帝'] },
            { id: 'yongle_emperor', name: '明成祖', year: 1360, type: 'person', importance: 5, description: '迁都北京，开创永乐盛世', location: '北平', category: 'politics', tags: ['皇帝', '盛世'] },
            { id: 'zheng_he', name: '郑和', year: 1371, type: 'person', importance: 5, description: '航海家', location: '云南', category: 'economy', tags: ['航海家', '外交家'] },
            { id: 'wang_yangming', name: '王阳明', year: 1472, type: 'person', importance: 5, description: '心学家', location: '余姚', category: 'culture', tags: ['哲学家', '教育家'] },
            { id: 'li_shizhen', name: '李时珍', year: 1518, type: 'person', importance: 5, description: '医学家，《本草纲目》作者', location: '蕲春', category: 'technology', tags: ['医学家', '药物学家'] },
            { id: 'xu_xiake', name: '徐霞客', year: 1587, type: 'person', importance: 4, description: '地理学家', location: '江阴', category: 'technology', tags: ['地理学家', '旅行家'] },
            { id: 'tang_xianzu', name: '汤显祖', year: 1550, type: 'person', importance: 4, description: '戏曲家', location: '临川', category: 'culture', tags: ['戏曲家', '文学家'] },
            { id: 'song_yingxing', name: '宋应星', year: 1587, type: 'person', importance: 4, description: '科学家，《天工开物》作者', location: '奉新', category: 'technology', tags: ['科学家'] },
            { id: 'wei_zhongxian', name: '魏忠贤', year: 1568, type: 'person', importance: 3, description: '宦官专权代表', location: '肃宁', category: 'politics', tags: ['宦官', '权臣'] },
            { id: 'li_zicheng', name: '李自成', year: 1606, type: 'person', importance: 5, description: '农民起义领袖', location: '米脂', category: 'military', tags: ['起义领袖', '农民'] }
        ]
    },

    // 清朝
    qing: {
        name: '清朝',
        period: { start: 1644, end: 1912 },
        color: '#1E90FF',
        events: [
            { id: 'nurhaci_rise', name: '努尔哈赤崛起', year: 1616, type: 'event', importance: 5, description: '努尔哈赤建立后金', location: '赫图阿拉', category: 'politics', tags: ['兴起', '后金'] },
            { id: 'qing_entry', name: '清军入关', year: 1644, type: 'event', importance: 5, description: '清军入关占领北京', location: '北京', category: 'military', tags: ['战争', '统一'] },
            { id: 'shunzhi_reign', name: '顺治帝即位', year: 1644, type: 'event', importance: 4, description: '福临即位为顺治帝', location: '北京', category: 'politics', tags: ['皇帝', '入关'] },
            { id: 'kangxi_reign', name: '康熙盛世开始', year: 1661, type: 'event', importance: 5, description: '康熙帝开启康乾盛世', location: '北京', category: 'politics', tags: ['盛世', '治理'] },
            { id: 'revolt_three_feudatories', name: '三藩之乱', year: 1673, type: 'event', importance: 4, description: '吴三桂等叛乱', location: '南方', category: 'military', tags: ['叛乱', '战争'] },
            { id: 'taiwan_unification', name: '台湾统一', year: 1683, type: 'event', importance: 4, description: '清朝统一台湾', location: '台湾', category: 'politics', tags: ['统一', '台湾'] },
            { id: 'treaty_nerchinsk', name: '尼布楚条约', year: 1689, type: 'event', importance: 4, description: '中俄签订尼布楚条约', location: '尼布楚', category: 'politics', tags: ['条约', '边界'] },
            { id: 'kangxi Dictionary', name: '康熙字典编成', year: 1716, type: 'event', importance: 4, description: '《康熙字典》编成', location: '北京', category: 'culture', tags: ['文化', '字典'] },
            { id: 'yongzheng_reign', name: '雍正改革', year: 1723, type: 'event', importance: 5, description: '雍正帝推行新政', location: '北京', category: 'politics', tags: ['改革', '治理'] },
            { id: 'qianlong_reign', name: '乾隆盛世', year: 1736, type: 'event', importance: 5, description: '乾隆帝统治时期', location: '北京', category: 'politics', tags: ['盛世', '繁荣'] },
            { id: 'ten_campaigns', name: '十全武功', year: 1755, type: 'event', importance: 5, description: '乾隆帝十次军事胜利', location: '边疆', category: 'military', tags: ['战争', '扩张'] },
            { id: 'siku_quanshu', name: '《四库全书》编成', year: 1782, type: 'event', importance: 5, description: '中国最大的丛书', location: '北京', category: 'culture', tags: ['文化', '编撰'] },
            { id: 'jiaqing_reign', name: '嘉庆帝即位', year: 1796, type: 'event', importance: 3, description: '嘉庆帝即位', location: '北京', category: 'politics', tags: ['皇帝', '即位'] },
            { id: 'white_lotus_rebellion', name: '白莲教起义', year: 1796, type: 'event', importance: 4, description: '白莲教大起义', location: '川楚', category: 'military', tags: ['起义', '宗教'] },
            { id: 'opium_war', name: '第一次鸦片战争', year: 1840, type: 'event', importance: 5, description: '中英鸦片战争', location: '沿海', category: 'military', tags: ['战争', '殖民'] },
            { id: 'treaty_nanjing', name: '南京条约', year: 1842, type: 'event', importance: 5, description: '中英签订南京条约', location: '南京', category: 'politics', tags: ['条约', '不平等'] },
            { id: 'taiping_rebellion', name: '太平天国起义', year: 1851, type: 'event', importance: 5, description: '洪秀全领导起义', location: '广西', category: 'military', tags: ['起义', '农民'] },
            { id: 'second_opium_war', name: '第二次鸦片战争', year: 1856, type: 'event', importance: 4, description: '英法联军侵华', location: '广州', category: 'military', tags: ['战争', '殖民'] },
            { id: 'tongzhi_restoration', name: '同治中兴', year: 1862, type: 'event', importance: 4, description: '洋务运动开始', location: '北京', category: 'politics', tags: ['改革', '中兴'] },
            { id: 'sino_japanese_war', name: '甲午战争', year: 1894, type: 'event', importance: 5, description: '中日甲午战争', location: '黄海', category: 'military', tags: ['战争', '海战'] },
            { id: 'treaty_shimonoseki', name: '马关条约', year: 1895, type: 'event', importance: 5, description: '中日签订马关条约', location: '日本', category: 'politics', tags: ['条约', '不平等'] },
            { id: 'hundred_days_reform', name: '百日维新', year: 1898, type: 'event', importance: 5, description: '戊戌变法', location: '北京', category: 'politics', tags: ['改革', '变法'] },
            { id: 'boxer_rebellion', name: '义和团运动', year: 1899, type: 'event', importance: 4, description: '义和团运动', location: '北方', category: 'military', tags: ['起义', '反帝'] },
            { id: 'eight_nation_alliance', name: '八国联军', year: 1900, type: 'event', importance: 5, description: '八国联军侵华', location: '北京', category: 'military', tags: ['战争', '入侵'] },
            { id: 'late_qing_reforms', name: '清末新政', year: 1901, type: 'event', importance: 4, description: '清政府推行新政', location: '北京', category: 'politics', tags: ['改革', '新政'] },
            { id: 'revolutionary_alliance', name: '同盟会成立', year: 1905, type: 'event', importance: 5, description: '孙中山建立同盟会', location: '东京', category: 'politics', tags: ['政党', '革命'] },
            { id: 'xinhai_revolution', name: '辛亥革命', year: 1911, type: 'event', importance: 5, description: '武昌起义爆发', location: '武昌', category: 'politics', tags: ['革命', '共和'] },
            { id: 'qing_abdication', name: '清朝灭亡', year: 1912, type: 'event', importance: 5, description: '溥仪退位', location: '北京', category: 'politics', tags: ['灭亡', '王朝'] }
        ],
        persons: [
            { id: 'nurhaci', name: '努尔哈赤', year: 1559, type: 'person', importance: 5, description: '后金建立者', location: '赫图阿拉', category: 'politics', tags: ['可汗', '统一者'], relations: { influenced: ['kangxi'], contemporary: ['li_chengliang'] } },
            { id: 'huang_taiji', name: '皇太极', year: 1592, type: 'person', importance: 4, description: '改国号为清', location: '沈阳', category: 'politics', tags: ['皇帝', '建立'], relations: { caused_by: ['nurhaci'], influenced: ['shunzhi'] } },
            { id: 'kangxi', name: '康熙帝', year: 1654, type: 'person', importance: 5, description: '开创康熙盛世', location: '北京', category: 'politics', tags: ['皇帝', '明君'], relations: { influenced: ['yongzheng', 'qianlong'] } },
            { id: 'yongzheng', name: '雍正帝', year: 1678, type: 'person', importance: 4, description: '推行新政', location: '北京', category: 'politics', tags: ['皇帝', '改革'], relations: { caused_by: ['kangxi'], influenced: ['qianlong'] } },
            { id: 'qianlong', name: '乾隆帝', year: 1711, type: 'person', importance: 5, description: '康乾盛世顶峰', location: '北京', category: 'politics', tags: ['皇帝', '盛世'], relations: { caused_by: ['yongzheng'] } },
            { id: 'cao_xueqin', name: '曹雪芹', year: 1715, type: 'person', importance: 5, description: '《红楼梦》作者', location: '南京', category: 'culture', tags: ['文学家', '小说家'], relations: { contemporary: ['qianlong'] } },
            { id: 'lin_zexu', name: '林则徐', year: 1785, type: 'person', importance: 5, description: '虎门销烟', location: '福州', category: 'politics', tags: ['政治家', '禁烟'], relations: { influenced: ['zeng_guofan'] } },
            { id: 'hong_xiuquan', name: '洪秀全', year: 1814, type: 'person', importance: 5, description: '太平天国领袖', location: '花县', category: 'military', tags: ['起义领袖', '宗教'], relations: { opposed: ['zeng_guofan'] } },
            { id: 'zeng_guofan', name: '曾国藩', year: 1811, type: 'person', importance: 4, description: '湘军首领', location: '湘乡', category: 'military', tags: ['军事家', '政治家'], relations: { influenced: ['li_hongzhang'], opposed: ['hong_xiuquan'] } },
            { id: 'zuo_zongtang', name: '左宗棠', year: 1812, type: 'person', importance: 4, description: '收复新疆', location: '湘阴', category: 'military', tags: ['军事家', '政治家'], relations: { contemporary: ['zeng_guofan', 'li_hongzhang'] } },
            { id: 'li_hongzhang', name: '李鸿章', year: 1823, type: 'person', importance: 4, description: '洋务运动领袖', location: '合肥', category: 'politics', tags: ['政治家', '外交家'], relations: { caused_by: ['zeng_guofan'] } },
            { id: 'kang_youwei', name: '康有为', year: 1858, type: 'person', importance: 5, description: '维新派领袖', location: '南海', category: 'politics', tags: ['改革家', '思想家'], relations: { influenced: ['liang_qichao'] } },
            { id: 'liang_qichao', name: '梁启超', year: 1873, type: 'person', importance: 5, description: '维新派领袖', location: '新会', category: 'politics', tags: ['改革家', '思想家'], relations: { caused_by: ['kang_youwei'] } },
            { id: 'sun_yat_sen', name: '孙中山', year: 1866, type: 'person', importance: 5, description: '革命先行者', location: '香山', category: 'politics', tags: ['革命家', '国父'], relations: { opposed: ['qing_government'] } },
            { id: 'puyi', name: '溥仪', year: 1906, type: 'person', importance: 4, description: '末代皇帝', location: '北京', category: 'politics', tags: ['皇帝', '末代'], relations: { opposed: ['sun_yat_sen'] } }
        ]
    }
};

// 将所有数据展平为单个数组，方便导入
const ChineseDynastiesData = {
    all: [],
    events: [],
    persons: [],
    dynasties: [],

    init() {
        Object.entries(ChineseDynasties).forEach(([key, dynasty]) => {
            // 添加朝代信息
            this.dynasties.push({
                id: key,
                name: dynasty.name,
                start: dynasty.period.start,
                end: dynasty.period.end,
                color: dynasty.color
            });

            // 处理事件
            if (dynasty.events) {
                dynasty.events.forEach(event => {
                    this.all.push({
                        ...event,
                        period: dynasty.name,
                        dynasty: key
                    });
                    this.events.push({
                        ...event,
                        period: dynasty.name,
                        dynasty: key
                    });
                });
            }

            // 处理人物
            if (dynasty.persons) {
                dynasty.persons.forEach(person => {
                    this.all.push({
                        ...person,
                        period: dynasty.name,
                        dynasty: key
                    });
                    this.persons.push({
                        ...person,
                        period: dynasty.name,
                        dynasty: key
                    });
                });
            }
        });
    },

    getStats() {
        return {
            dynasties: this.dynasties.length,
            events: this.events.length,
            persons: this.persons.length,
            total: this.all.length
        };
    }
};

// 初始化
ChineseDynastiesData.init();

// 导出到全局
window.ChineseDynasties = ChineseDynasties;
window.ChineseDynastiesData = ChineseDynastiesData;
