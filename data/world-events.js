/**
 * 世界历史事件数据集 (World Historical Events)
 * 包含 50+ 全球重大历史事件，涵盖公元前 3000 年至 2025 年
 */

const worldEvents = [
  // === 古埃及时代 ===
  {
    id: 'we-001',
    name: '吉萨大金字塔建造',
    year: -2560,
    period: 'ancient',
    civilization: 'egypt',
    category: 'architecture',
    significance: '古代世界七大奇迹之一',
    description: '胡夫法老下令建造吉萨大金字塔，高146米，是古代世界最高建筑',
    location: '埃及吉萨',
    impact: 'high'
  },
  {
    id: 'we-002',
    name: '埃及象形文字发明',
    year: -3200,
    period: 'ancient',
    civilization: 'egypt',
    category: 'technology',
    significance: '人类最早的文字系统之一',
    description: '古埃及人发明象形文字，用于记录宗教、行政和历史',
    location: '埃及',
    impact: 'medium'
  },
  {
    id: 'we-003',
    name: '图坦卡蒙法老登基',
    year: -1332,
    period: 'ancient',
    civilization: 'egypt',
    category: 'politics',
    significance: '新王国时期的著名法老',
    description: '图坦卡蒙9岁登基，18岁去世，其陵墓在1922年被发现，震惊世界',
    location: '埃及底比斯',
    impact: 'medium'
  },

  // === 古希腊时代 ===
  {
    id: 'we-004',
    name: '雅典民主制度建立',
    year: -508,
    period: 'ancient',
    civilization: 'greece',
    category: 'politics',
    significance: '西方民主制度的起源',
    description: '克里斯提尼改革，建立雅典民主制度，成年男性公民可直接参与政治',
    location: '雅典',
    impact: 'very-high'
  },
  {
    id: 'we-005',
    name: '苏格拉底出生',
    year: -470,
    period: 'ancient',
    civilization: 'greece',
    category: 'philosophy',
    significance: '西方哲学奠基人',
    description: '苏格拉底开创了西方哲学的思辨传统，提出"认识你自己"',
    location: '雅典',
    impact: 'very-high'
  },
  {
    id: 'we-006',
    name: '柏拉图创立学园',
    year: -387,
    period: 'ancient',
    civilization: 'greece',
    category: 'education',
    significance: '西方第一所高等教育机构',
    description: '柏拉图在雅典创立学园，讲授哲学、数学、天文学等学科',
    location: '雅典',
    impact: 'very-high'
  },
  {
    id: 'we-007',
    name: '亚历山大东征开始',
    year: -334,
    period: 'ancient',
    civilization: 'greece',
    category: 'warfare',
    significance: '希腊化时代的开端',
    description: '亚历山大率军东征，征服波斯、埃及、印度，建立横跨欧亚非的大帝国',
    location: '小亚细亚',
    impact: 'very-high'
  },
  {
    id: 'we-008',
    name: '亚里士多德去世',
    year: -322,
    period: 'ancient',
    civilization: 'greece',
    category: 'philosophy',
    significance: '百科全书式学者',
    description: '亚里士多德建立逻辑学、生物学、物理学等多学科体系，影响后世两千年',
    location: '优卑亚岛',
    impact: 'very-high'
  },

  // === 古罗马时代 ===
  {
    id: 'we-009',
    name: '罗马共和国建立',
    year: -509,
    period: 'ancient',
    civilization: 'rome',
    category: 'politics',
    significance: '共和制度的典范',
    description: '罗马人推翻国王统治，建立共和制，由执政官、元老院和公民大会治理',
    location: '罗马',
    impact: 'very-high'
  },
  {
    id: 'we-010',
    name: '尤利乌斯·凯撒遇刺',
    year: -44,
    period: 'ancient',
    civilization: 'rome',
    category: 'politics',
    significance: '共和国时代的终结',
    description: '凯撒在元老院被布鲁图斯等人刺杀，引发内战，共和制走向终结',
    location: '罗马元老院',
    impact: 'high'
  },
  {
    id: 'we-011',
    name: '奥古斯都建立帝制',
    year: -27,
    period: 'ancient',
    civilization: 'rome',
    category: 'politics',
    significance: '罗马帝国时代的开始',
    description: '屋大维获得"奥古斯都"称号，成为罗马第一位皇帝，开启罗马和平时代',
    location: '罗马',
    impact: 'very-high'
  },
  {
    id: 'we-012',
    name: '罗马帝国分裂',
    year: 395,
    period: 'medieval',
    civilization: 'rome',
    category: 'politics',
    significance: '东西罗马分离',
    description: '狄奥多西一世死后，帝国分裂为东罗马和西罗马两部分',
    location: '君士坦丁堡',
    impact: 'high'
  },
  {
    id: 'we-013',
    name: '西罗马帝国灭亡',
    year: 476,
    period: 'medieval',
    civilization: 'rome',
    category: 'politics',
    significance: '古代欧洲的终结',
    description: '奥多亚克废黜罗慕路斯·奥古斯都，西罗马帝国灭亡，欧洲进入中世纪',
    location: '拉文纳',
    impact: 'very-high'
  },

  // === 中世纪欧洲 ===
  {
    id: 'we-014',
    name: '第一次十字军东征',
    year: 1096,
    period: 'medieval',
    civilization: 'europe',
    category: 'warfare',
    significance: '宗教战争的开始',
    description: '教皇乌尔班二世发起十字军东征，目标是从穆斯林手中收复圣地耶路撒冷',
    location: '欧洲各地',
    impact: 'high'
  },
  {
    id: 'we-015',
    name: '蒙古帝国建立',
    year: 1206,
    period: 'medieval',
    civilization: 'mongolia',
    category: 'politics',
    significance: '世界历史上最大的陆权帝国',
    description: '成吉思汗统一蒙古各部，建立蒙古帝国，横扫欧亚大陆',
    location: '蒙古草原',
    impact: 'very-high'
  },
  {
    id: 'we-016',
    name: '马可·波罗到达中国',
    year: 1275,
    period: 'medieval',
    civilization: 'china',
    category: 'exploration',
    significance: '中西文化交流的重要事件',
    description: '意大利旅行家马可·波罗抵达元大都（北京），在元朝任职17年',
    location: '元大都',
    impact: 'high'
  },
  {
    id: 'we-017',
    name: '黑死病大流行',
    year: 1347,
    period: 'medieval',
    civilization: 'europe',
    category: 'disaster',
    significance: '人类历史上最严重的瘟疫',
    description: '黑死病从亚洲传入欧洲，导致欧洲人口减少30-50%，彻底改变社会结构',
    location: '全欧洲',
    impact: 'very-high'
  },
  {
    id: 'we-018',
    name: '百年战争结束',
    year: 1453,
    period: 'medieval',
    civilization: 'europe',
    category: 'warfare',
    significance: '英法关系的转折点',
    description: '英法百年战争以法国胜利告终，贞德的贡献被后人传颂',
    location: '法国',
    impact: 'medium'
  },

  // === 文艺复兴 ===
  {
    id: 'we-019',
    name: '达芬奇完成《蒙娜丽莎》',
    year: 1503,
    period: 'renaissance',
    civilization: 'italy',
    category: 'art',
    significance: '文艺复兴的巅峰之作',
    description: '列奥纳多·达芬奇创作《蒙娜丽莎》，至今仍是世界最著名的画作',
    location: '佛罗伦萨',
    impact: 'very-high'
  },
  {
    id: 'we-020',
    name: '米开朗基罗完成《大卫像》',
    year: 1504,
    period: 'renaissance',
    civilization: 'italy',
    category: 'art',
    significance: '文艺复兴雕塑的杰作',
    description: '米开朗基罗创作《大卫像》，展现了人体美的极致',
    location: '佛罗伦萨',
    impact: 'high'
  },
  {
    id: 'we-021',
    name: '哥白尼发表《天体运行论》',
    year: 1543,
    period: 'renaissance',
    civilization: 'poland',
    category: 'science',
    significance: '科学革命的开始',
    description: '哥白尼提出日心说，挑战地心说，开创了天文学新纪元',
    location: '波兰',
    impact: 'very-high'
  },
  {
    id: 'we-022',
    name: '莎士比亚出生',
    year: 1564,
    period: 'renaissance',
    civilization: 'england',
    category: 'literature',
    significance: '英国文学史上最伟大的作家',
    description: '莎士比亚创作了《哈姆雷特》《罗密欧与朱丽叶》等不朽剧作',
    location: '英国斯特拉福德',
    impact: 'very-high'
  },
  {
    id: 'we-023',
    name: '伽利略发明望远镜',
    year: 1609,
    period: 'renaissance',
    civilization: 'italy',
    category: 'science',
    significance: '现代天文学的诞生',
    description: '伽利略改进望远镜，观察木星卫星和太阳黑子，支持哥白尼日心说',
    location: '威尼斯',
    impact: 'very-high'
  },

  // === 大航海时代 ===
  {
    id: 'we-024',
    name: '哥伦布发现新大陆',
    year: 1492,
    period: 'age-of-exploration',
    civilization: 'spain',
    category: 'exploration',
    significance: '连接东西半球的历史时刻',
    description: '哥伦布横渡大西洋，到达美洲，开启欧洲殖民时代',
    location: '巴哈马群岛',
    impact: 'very-high'
  },
  {
    id: 'we-025',
    name: '麦哲伦环球航行开始',
    year: 1519,
    period: 'age-of-exploration',
    civilization: 'spain',
    category: 'exploration',
    significance: '人类首次环球航行',
    description: '麦哲伦率领船队开始环球航行，他本人在菲律宾去世，船队继续完成航程',
    location: '西班牙塞维利亚',
    impact: 'very-high'
  },
  {
    id: 'we-026',
    name: '瓦斯科·达·伽马到达印度',
    year: 1498,
    period: 'age-of-exploration',
    civilization: 'portugal',
    category: 'exploration',
    significance: '开辟欧洲到印度的新航路',
    description: '葡萄牙航海家达·伽马绕过好望角，到达印度卡利卡特',
    location: '印度卡利卡特',
    impact: 'high'
  },
  {
    id: 'we-027',
    name: '西班牙无敌舰队覆灭',
    year: 1588,
    period: 'age-of-exploration',
    civilization: 'england',
    category: 'warfare',
    significance: '英国海上霸权的开始',
    description: '英国海军击败西班牙无敌舰队，确立海上霸主地位',
    location: '英吉利海峡',
    impact: 'high'
  },

  // === 工业革命 ===
  {
    id: 'we-028',
    name: '詹姆斯·瓦特改良蒸汽机',
    year: 1776,
    period: 'industrial',
    civilization: 'england',
    category: 'technology',
    significance: '工业革命的核心技术',
    description: '瓦特改良蒸汽机，大大提高效率，成为工厂和交通的动力源',
    location: '英国',
    impact: 'very-high'
  },
  {
    id: 'we-029',
    name: '美国独立宣言发表',
    year: 1776,
    period: 'industrial',
    civilization: 'usa',
    category: 'politics',
    significance: '美国独立的里程碑',
    description: '北美13个殖民地发表《独立宣言》，宣布脱离英国统治',
    location: '费城',
    impact: 'very-high'
  },
  {
    id: 'we-030',
    name: '法国大革命爆发',
    year: 1789,
    period: 'industrial',
    civilization: 'france',
    category: 'politics',
    significance: '现代民主思想的传播',
    description: '法国人民攻占巴士底狱，推翻君主制，建立共和国',
    location: '巴黎',
    impact: 'very-high'
  },
  {
    id: 'we-031',
    name: '拿破仑加冕称帝',
    year: 1804,
    period: 'industrial',
    civilization: 'france',
    category: 'politics',
    significance: '拿破仑时代的开始',
    description: '拿破仑在巴黎圣母院加冕为法兰西皇帝，征服欧洲大部分地区',
    location: '巴黎',
    impact: 'high'
  },
  {
    id: 'we-032',
    name: '史蒂芬森发明蒸汽机车',
    year: 1829,
    period: 'industrial',
    civilization: 'england',
    category: 'technology',
    significance: '铁路时代的开始',
    description: '乔治·史蒂芬森发明"火箭号"蒸汽机车，开启铁路运输时代',
    location: '英国',
    impact: 'high'
  },
  {
    id: 'we-033',
    name: '爱迪生发明电灯',
    year: 1879,
    period: 'industrial',
    civilization: 'usa',
    category: 'technology',
    significance: '电气化时代的到来',
    description: '托马斯·爱迪生发明实用电灯，开启人类照明新纪元',
    location: '美国门洛帕克',
    impact: 'very-high'
  },
  {
    id: 'we-034',
    name: '德国统一',
    year: 1871,
    period: 'industrial',
    civilization: 'germany',
    category: 'politics',
    significance: '欧洲格局的重大变化',
    description: '普鲁士统一德意志诸邦，建立德意志帝国，俾斯麦成为首相',
    location: '凡尔赛宫',
    impact: 'high'
  },

  // === 近现代 ===
  {
    id: 'we-035',
    name: '第一次世界大战爆发',
    year: 1914,
    period: 'modern',
    civilization: 'global',
    category: 'warfare',
    significance: '第一次全球性战争',
    description: '萨拉热窝事件引发第一次世界大战，卷入33个国家，死亡超过1000万人',
    location: '全球',
    impact: 'very-high'
  },
  {
    id: 'we-036',
    name: '俄国十月革命',
    year: 1917,
    period: 'modern',
    civilization: 'russia',
    category: 'politics',
    significance: '第一个社会主义国家建立',
    description: '列宁领导的布尔什维克推翻临时政府，建立苏维埃政权',
    location: '圣彼得堡',
    impact: 'very-high'
  },
  {
    id: 'we-037',
    name: '爱因斯坦发表相对论',
    year: 1915,
    period: 'modern',
    civilization: 'germany',
    category: 'science',
    significance: '现代物理学的基石',
    description: '爱因斯坦发表广义相对论，革命性地改变了人类对时空的理解',
    location: '德国柏林',
    impact: 'very-high'
  },
  {
    id: 'we-038',
    name: '第二次世界大战爆发',
    year: 1939,
    period: 'modern',
    civilization: 'global',
    category: 'warfare',
    significance: '人类历史上最致命的战争',
    description: '德国入侵波兰，引发第二次世界大战，全球约7000万人死亡',
    location: '全球',
    impact: 'very-high'
  },
  {
    id: 'we-039',
    name: '原子弹投放广岛',
    year: 1945,
    period: 'modern',
    civilization: 'usa',
    category: 'warfare',
    significance: '核时代的开始',
    description: '美国在广岛投下第一颗原子弹，首次展示核武器的毁灭性力量',
    location: '日本广岛',
    impact: 'very-high'
  },
  {
    id: 'we-040',
    name: '联合国成立',
    year: 1945,
    period: 'modern',
    civilization: 'global',
    category: 'politics',
    significance: '最重要的国际组织',
    description: '第二次世界大战后成立联合国，旨在维护国际和平与安全',
    location: '纽约',
    impact: 'very-high'
  },
  {
    id: 'we-041',
    name: '中华人民共和国成立',
    year: 1949,
    period: 'modern',
    civilization: 'china',
    category: 'politics',
    significance: '新中国诞生',
    description: '毛泽东在天安门宣布中华人民共和国成立',
    location: '北京',
    impact: 'high'
  },
  {
    id: 'we-042',
    name: 'DNA双螺旋结构发现',
    year: 1953,
    period: 'modern',
    civilization: 'england',
    category: 'science',
    significance: '分子生物学的开端',
    description: '沃森和克里克发现DNA双螺旋结构，揭开生命遗传的奥秘',
    location: '英国剑桥',
    impact: 'very-high'
  },
  {
    id: 'we-043',
    name: '人类首次登月',
    year: 1969,
    period: 'modern',
    civilization: 'usa',
    category: 'exploration',
    significance: '人类太空探索的里程碑',
    description: '阿波罗11号宇航员尼尔·阿姆斯特朗成为第一个登上月球的人',
    location: '月球',
    impact: 'very-high'
  },
  {
    id: 'we-044',
    name: '柏林墙倒塌',
    year: 1989,
    period: 'modern',
    civilization: 'germany',
    category: 'politics',
    significance: '冷战结束的象征',
    description: '柏林墙被人民拆除，象征东西德统一和冷战的结束',
    location: '柏林',
    impact: 'very-high'
  },
  {
    id: 'we-045',
    name: '万维网（WWW）发明',
    year: 1989,
    period: 'modern',
    civilization: 'england',
    category: 'technology',
    significance: '信息时代的开始',
    description: '蒂姆·伯纳斯-李发明万维网，彻底改变人类获取信息的方式',
    location: '欧洲核子研究中心',
    impact: 'very-high'
  },
  {
    id: 'we-046',
    name: '苏联解体',
    year: 1991,
    period: 'modern',
    civilization: 'russia',
    category: 'politics',
    significance: '冷战正式结束',
    description: '苏联正式解体，15个加盟共和国独立，标志着两极格局的结束',
    location: '莫斯科',
    impact: 'very-high'
  },
  {
    id: 'we-047',
    name: '人类基因组计划完成',
    year: 2003,
    period: 'modern',
    civilization: 'global',
    category: 'science',
    significance: '生命科学的重大突破',
    description: '人类基因组测序完成，揭示人类生命的遗传密码',
    location: '全球',
    impact: 'high'
  },
  {
    id: 'we-048',
    name: '智能手机时代开始',
    year: 2007,
    period: 'modern',
    civilization: 'usa',
    category: 'technology',
    significance: '移动互联网的爆发',
    description: '苹果发布第一代iPhone，开启智能手机和移动互联网时代',
    location: '美国',
    impact: 'very-high'
  },
  {
    id: 'we-049',
    name: 'COVID-19 全球大流行',
    year: 2020,
    period: 'modern',
    civilization: 'global',
    category: 'disaster',
    significance: '21世纪最大的全球公共卫生危机',
    description: '新型冠状病毒在全球传播，影响数十亿人，改变人类生活方式',
    location: '全球',
    impact: 'very-high'
  },
  {
    id: 'we-050',
    name: '人工智能生成内容突破',
    year: 2022,
    period: 'modern',
    civilization: 'global',
    category: 'technology',
    significance: 'AI时代的里程碑',
    description: 'ChatGPT等大型语言模型发布，展示AI生成内容的强大能力',
    location: '全球',
    impact: 'high'
  },
  {
    id: 'we-051',
    name: '阿克苏姆帝国兴起',
    year: 100,
    period: 'ancient',
    civilization: 'ethiopia',
    category: 'politics',
    significance: '非洲重要古代文明',
    description: '阿克苏姆帝国在埃塞俄比亚兴起，成为红海贸易中心',
    location: '埃塞俄比亚',
    impact: 'medium'
  },
  {
    id: 'we-052',
    name: '玛雅文明黄金时代',
    year: 250,
    period: 'ancient',
    civilization: 'maya',
    category: 'culture',
    significance: '美洲重要古代文明',
    description: '玛雅文明进入古典期，在天文、数学、建筑方面取得卓越成就',
    location: '中美洲',
    impact: 'medium'
  }
];

// 工具函数（挂载到全局对象）
function getEventsByPeriod(period) {
  return worldEvents.filter(e => e.period === period);
}

function getEventsByCivilization(civilization) {
  return worldEvents.filter(e => e.civilization === civilization);
}

function getEventsByYearRange(startYear, endYear) {
  return worldEvents.filter(e => e.year >= startYear && e.year <= endYear);
}

function getHighImpactEvents() {
  return worldEvents.filter(e => e.impact === 'very-high' || e.impact === 'high');
}

function searchEvents(query) {
  const lowerQuery = query.toLowerCase();
  return worldEvents.filter(e =>
    e.name.toLowerCase().includes(lowerQuery) ||
    e.description.toLowerCase().includes(lowerQuery) ||
    e.location.toLowerCase().includes(lowerQuery) ||
    e.category.toLowerCase().includes(lowerQuery)
  );
}

// 数据访问器
const WorldEventsData = {
  events: worldEvents,
  all: worldEvents,

  init() {
    console.log('WorldEventsData 初始化完成', worldEvents.length);
  },

  getStats() {
    return {
      events: worldEvents.length,
      total: worldEvents.length
    };
  }
};

// 初始化
WorldEventsData.init();

// 导出到全局
window.worldEvents = worldEvents;
window.WorldEventsData = WorldEventsData;