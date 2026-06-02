/**
 * 故事生成器 - 基于历史数据生成叙事性故事 v1.0
 * 支持多视角叙事、故事时间线展示、故事分享
 */

class StoryGenerator {
    static PERSPECTIVES = {
        emperor: {
            name: '皇帝视角',
            icon: '👑',
            color: '#FFD700',
            tone: '威严、宏观、权谋',
            focus: ['朝政', '战争', '治国', '外交', '继承人']
        },
        minister: {
            name: '大臣视角',
            icon: '📜',
            color: '#4A90D9',
            tone: '谨慎、智谋、忠诚',
            focus: ['政策', '奏折', '朝堂', '民生', '边防']
        },
        commoner: {
            name: '百姓视角',
            icon: '🌾',
            color: '#8B7355',
            tone: '质朴、感受、生活',
            focus: ['赋税', '收成', '迁徙', '集市', '节日']
        },
        scholar: {
            name: '文人视角',
            icon: '📚',
            color: '#9B59B6',
            tone: '雅致、感悟、批判',
            focus: ['科举', '诗文', '交游', '著述', '朝局']
        },
        general: {
            name: '武将视角',
            icon: '⚔️',
            color: '#E74C3C',
            tone: '豪迈、英勇、悲壮',
            focus: ['征伐', '练兵', '边关', '军备', '功勋']
        }
    };

    static STORY_TEMPLATES = {
        biography: {
            name: '人物传记',
            structure: ['出身', '少年', '成名', '巅峰', '晚年', '评价']
        },
        event: {
            name: '事件纪实',
            structure: ['起因', '经过', '高潮', '转折', '结果', '影响']
        },
        romance: {
            name: '传奇故事',
            structure: ['缘起', '相遇', '波折', '考验', '结局', '余韵']
        },
        mystery: {
            name: '历史谜案',
            structure: ['悬案', '线索', '推理', '假说', '揭秘', '启示']
        },
        epic: {
            name: '史诗叙事',
            structure: ['序幕', '发展', '冲突', '高潮', '决战', '终章']
        }
    };

    static LITERARY_STYLES = {
        classical: {
            name: '文言风',
            prefix: ['话说', '且说', '却说', '只因'],
            connector: ['于是', '然而', '不料', '此时'],
            ending: ['后人有诗赞曰', '此是后话', '欲知后事如何']
        },
        modern: {
            name: '白话风',
            prefix: ['在那个年代', '历史的长河中', '故事要从'],
            connector: ['然而', '就在这时', '谁也没有想到'],
            ending: ['这段历史告诉我们', '历史的回声', '让我们记住']
        },
        vivid: {
            name: '生动风',
            prefix: ['想象一下', '闭上眼睛', '让我们穿越回'],
            connector: ['突然', '就在千钧一发之际', '命运在此刻转折'],
            ending: ['这就是历史', '永远铭记', '传奇永不落幕']
        }
    };

    constructor(app) {
        this.app = app;
        this.stories = new Map();
        this.currentStory = null;
        this.storyHistory = [];
        this.container = null;

        // 故事缓存
        this.storyCache = new Map();
        this.cacheMaxSize = 50;

        // 事件绑定
        this.bindEvents();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        if (this.app.eventBus) {
            this.app.eventBus.on('node:select', (node) => {
                this.onNodeSelect(node);
            });
        }
    }

    /**
     * 初始化
     */
    init() {
        console.log('📖 故事生成器初始化完成');
    }

    /**
     * 节点选中处理
     */
    onNodeSelect(node) {
        // 预加载相关故事
        this.preloadStories(node.id);
    }

    /**
     * 预加载故事
     */
    async preloadStories(nodeId) {
        const cacheKey = `preload_${nodeId}`;
        if (this.storyCache.has(cacheKey)) return;

        const node = this.app.getNode(nodeId);
        if (!node) return;

        // 生成简短概述
        const summary = this.generateSummary(node);
        this.storyCache.set(cacheKey, { summary });
    }

    /**
     * 生成故事
     */
    generateStory(nodeId, options = {}) {
        const {
            perspective = 'emperor',
            template = 'biography',
            style = 'vivid',
            length = 'medium'
        } = options;

        const node = this.app.getNode(nodeId);
        if (!node) return null;

        const storyId = `story_${nodeId}_${perspective}_${template}_${Date.now()}`;
        const perspectiveConfig = StoryGenerator.PERSPECTIVES[perspective];
        const templateConfig = StoryGenerator.STORY_TEMPLATES[template];
        const styleConfig = StoryGenerator.LITERARY_STYLES[style];

        // 构建故事段落
        const sections = this.buildStorySections(node, templateConfig, perspectiveConfig, styleConfig, length);

        // 构建时间线
        const timeline = this.buildStoryTimeline(node, sections);

        // 计算故事统计
        const stats = this.calculateStoryStats(sections);

        const story = {
            id: storyId,
            nodeId,
            node,
            perspective,
            perspectiveConfig,
            template,
            templateConfig,
            style,
            styleConfig,
            sections,
            timeline,
            stats,
            createdAt: new Date().toISOString(),
            shareCode: this.generateShareCode()
        };

        // 缓存故事
        this.stories.set(storyId, story);
        this.storyHistory.push(storyId);

        return story;
    }

    /**
     * 生成多视角故事集
     */
    generateMultiPerspective(nodeId, options = {}) {
        const perspectives = Object.keys(StoryGenerator.PERSPECTIVES);
        const stories = [];

        for (const perspective of perspectives) {
            const story = this.generateStory(nodeId, {
                ...options,
                perspective
            });
            if (story) stories.push(story);
        }

        return {
            id: `multi_${nodeId}_${Date.now()}`,
            nodeId,
            stories,
            createdAt: new Date().toISOString()
        };
    }

    /**
     * 构建故事段落
     */
    buildStorySections(node, template, perspective, style, length) {
        const lengthConfig = {
            short: { paragraphsPerSection: 1, wordsPerParagraph: 80 },
            medium: { paragraphsPerSection: 2, wordsPerParagraph: 120 },
            long: { paragraphsPerSection: 3, wordsPerParagraph: 180 }
        };

        const config = lengthConfig[length] || lengthConfig.medium;
        const sections = [];

        template.structure.forEach((sectionName, index) => {
            const content = this.generateSectionContent(
                node, sectionName, index, perspective, style, config
            );

            sections.push({
                title: sectionName,
                index,
                content,
                perspective: perspective.name,
                icon: perspective.icon,
                color: perspective.color,
                keyEvents: this.extractKeyEvents(node, sectionName),
                metadata: {
                    wordCount: content.reduce((sum, p) => sum + p.length, 0),
                    readingTime: Math.ceil(content.reduce((sum, p) => sum + p.length, 0) / 200)
                }
            });
        });

        return sections;
    }

    /**
     * 生成段落内容
     */
    generateSectionContent(node, sectionName, sectionIndex, perspective, style, config) {
        const paragraphs = [];
        const nodeName = node.name || '历史人物';
        const nodeEra = node.era || node.dynasty || '古代';
        const nodeDesc = node.description || node.summary || '';
        const nodeEvents = node.events || [];

        for (let i = 0; i < config.paragraphsPerSection; i++) {
            let paragraph = '';

            // 开头段落
            if (sectionIndex === 0 && i === 0) {
                const prefix = style.prefix[Math.floor(Math.random() * style.prefix.length)];
                paragraph = `${prefix}${nodeEra}，${nodeName}的故事。`;
            }

            // 根据视角和段落名生成内容
            paragraph += this.generatePerspectiveContent(
                nodeName, nodeEra, nodeDesc, sectionName, perspective, nodeEvents
            );

            // 添加连接词
            if (i > 0) {
                const connector = style.connector[Math.floor(Math.random() * style.connector.length)];
                paragraph = connector + '，' + paragraph;
            }

            // 结尾
            if (sectionIndex === 5 && i === config.paragraphsPerSection - 1) {
                const ending = style.ending[Math.floor(Math.random() * style.ending.length)];
                paragraph += '。' + ending + '。';
            }

            // 补充到目标字数
            while (paragraph.length < config.wordsPerParagraph) {
                paragraph += this.generateAdditionalContent(node, sectionName, perspective);
            }

            paragraphs.push(paragraph);
        }

        return paragraphs;
    }

    /**
     * 生成视角相关内容
     */
    generatePerspectiveContent(nodeName, era, desc, sectionName, perspective, events) {
        const focusAreas = perspective.focus;
        const tone = perspective.tone;

        const contentMap = {
            emperor: {
                '出身': `${nodeName}生于${era}，天命所归，自幼便显露出帝王之气。朝中大臣纷纷议论，此子非凡，日后必成大器。`,
                '少年': `少年时代的${nodeName}，在宫中接受严格的帝王教育。研读经史子集，学习治国理政之道，同时也在密切关注着天下大势的变化。`,
                '成名': `${nodeName}以雷霆手段处置朝政，显示出过人的魄力和智慧。群臣折服，百姓称颂，一时间声威赫赫，四方来朝。`,
                '巅峰': `在${nodeName}的统治下，国力达到鼎盛。开疆拓土，文治武功，创造了令后世景仰的辉煌时代。`,
                '晚年': `步入晚年的${nodeName}，回首一生功过。虽有遗憾，但更多的是对盛世的满足与对后世的期许。`,
                '评价': `后世史家评价${nodeName}：雄才大略，开创盛世。功过参半，但无疑是中国历史上最具影响力的帝王之一。`
            },
            minister: {
                '出身': `臣出身寒门，少时苦读圣贤之书，立志报效朝廷。彼时天下初定，百废待兴，正是用人之际。`,
                '少年': `在科举中崭露头角，以优异的成绩进入仕途。初任地方小吏，勤勉奉公，深得上司赏识。`,
                '成名': `因一纸奏折引起朝廷注意，被召入京城。面对天子和满朝文武，侃侃而谈，条理分明，展现了非凡的政治才能。`,
                '巅峰': `官至极品，主持朝政。推行的政策使国力大增，百姓安居乐业。然而高处不胜寒，朝堂上的明争暗斗也愈发激烈。`,
                '晚年': `年迈致仕，归隐田园。回首一生，为国尽忠，虽历经风雨，但问心无愧。留下诸多奏疏文稿，以启后人。`,
                '评价': `一代名臣，忠心耿耿。其政策影响深远，为国家的繁荣稳定做出了不可磨灭的贡献。`
            },
            commoner: {
                '出身': `俺们老家就在这村子，祖祖辈辈种田为生。那年头，日子过得紧巴巴的，但乡里乡亲的都互帮互助。`,
                '少年': `小时候最大的愿望就是吃饱饭。跟着爹娘下地干活，偶尔去集市上卖些自家种的菜，那是最开心的时候。`,
                '成名': `后来朝廷换了新皇帝，说是要善待百姓。赋税确实少了一些，日子也慢慢好过了起来。村里还开了学堂，娃们都能读书了。`,
                '巅峰': `那几年风调雨顺，庄稼收成好。家家户户都盖了新房，集市上热闹得很。逢年过节还有庙会，大伙儿都乐呵呵的。`,
                '晚年': `人老了，干不动了。但看着儿孙满堂，日子越过越好，心里踏实。常给小辈们讲讲过去的故事，让他们知道现在的好日子来之不易。`,
                '评价': `这就是俺们老百姓的日子，平平淡淡才是真。那些大人物的故事听着是热闹，但真正关心的还是自家的那一亩三分地。`
            },
            scholar: {
                '出身': `吾自幼好学，博览群书。家中虽不富裕，但父母倾尽全力供吾读书，期望有朝一日能金榜题名。`,
                '少年': `十年寒窗，磨砺了心智。与同窗好友切磋学问，吟诗作对，好不风雅。也曾游历名山大川，广交天下名士。`,
                '成名': `终于一举成名，高中科举。然而官场的勾心斗角，远非书中所学。以笔为剑，以文载道，坚守文人风骨。`,
                '巅峰': `著书立说，传道授业。门下弟子遍布天下，学术成就斐然。然功名利禄皆为身外之物，唯有文章千古。`,
                '晚年': `归隐书斋，潜心著述。回首一生，虽未位极人臣，但以文传世，也算不虚此生。`,
                '评价': `一代文宗，学贯古今。其著作流传后世，影响了一代又一代的读书人。正所谓：文章千古事，得失寸心知。`
            },
            general: {
                '出身': `自幼习武，立志报国。从军之日，便知此生将与刀剑为伴，以马革裹尸为荣。`,
                '少年': `在军营中历练，从一名普通士兵做起。白天操练武艺，夜晚研读兵法。数次出生入死，屡立战功。`,
                '成名': `一场关键战役中，以少胜多，一战成名。朝廷嘉奖，将士们敬仰，从此威名远播，敌军闻风丧胆。`,
                '巅峰': `统领三军，征战四方。开疆拓土，保家卫国。那是一段金戈铁马的岁月，每一场战斗都是生死之间的考验。`,
                '晚年': `解甲归田，但军人之魂永不熄灭。教导后辈武艺，传授兵法心得。每每回望沙场，心中激荡难平。`,
                '评价': `一代名将，忠勇无双。其军事才能和爱国精神，为后世兵家所推崇。兵者，国之大事，不可不察也。`
            }
        };

        const perspectiveContent = contentMap[perspective.id?.split('_')[0] || 'emperor'];
        if (perspectiveContent && perspectiveContent[sectionName]) {
            return perspectiveContent[sectionName];
        }

        return `${era}时期，${nodeName}在${sectionName}方面有着重要的经历。这段历史展现了那个时代独特的风貌与精神。`;
    }

    /**
     * 生成补充内容
     */
    generateAdditionalContent(node, sectionName, perspective) {
        const additions = [
            `在这段时期，社会发生了深刻的变化。`,
            `人们的生活方式也在悄然改变。`,
            `文化交流达到了新的高度。`,
            `经济的发展推动了社会的进步。`,
            `这一时期的制度创新影响深远。`,
            `从历史的角度来看，这段经历意义重大。`,
            `后世的学者对此有着深入的研究。`,
            `这段历史给我们留下了宝贵的启示。`,
            `时代的洪流中，每个人都在书写自己的故事。`,
            `正是在这样的背景下，历史的车轮不断前行。`
        ];

        return additions[Math.floor(Math.random() * additions.length)];
    }

    /**
     * 提取关键事件
     */
    extractKeyEvents(node, sectionName) {
        const events = node.events || node.keyEvents || [];
        return events.slice(0, 3).map(e => ({
            year: e.year || e.date || '未知',
            title: e.title || e.name || '历史事件',
            description: e.description || e.summary || ''
        }));
    }

    /**
     * 构建故事时间线
     */
    buildStoryTimeline(node, sections) {
        const timeline = [];
        const nodeStartYear = node.startYear || node.year || -1000;
        const nodeEndYear = node.endYear || (nodeStartYear + 50);

        sections.forEach((section, index) => {
            const progress = index / (sections.length - 1);
            const year = Math.round(nodeStartYear + (nodeEndYear - nodeStartYear) * progress);

            timeline.push({
                year,
                title: section.title,
                summary: section.content[0] ? section.content[0].substring(0, 60) + '...' : '',
                sectionIndex: index,
                icon: section.icon,
                color: section.color
            });
        });

        return timeline;
    }

    /**
     * 计算故事统计
     */
    calculateStoryStats(sections) {
        const totalWords = sections.reduce((sum, s) => sum + s.metadata.wordCount, 0);
        const totalReadingTime = sections.reduce((sum, s) => sum + s.metadata.readingTime, 0);

        return {
            totalWords,
            totalReadingTime,
            sectionCount: sections.length,
            keyEvents: sections.reduce((sum, s) => sum + s.keyEvents.length, 0),
            readabilityScore: Math.min(100, Math.max(60, 85 + Math.floor(Math.random() * 15)))
        };
    }

    /**
     * 生成分享码
     */
    generateShareCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * 生成概述
     */
    generateSummary(node) {
        const name = node.name || '历史人物';
        const era = node.era || node.dynasty || '古代';
        const desc = node.description || node.summary || '一位影响深远的历史人物。';

        return `${name}，${era}时期${desc}`;
    }

    /**
     * 分享故事
     */
    shareStory(storyId) {
        const story = this.stories.get(storyId);
        if (!story) return null;

        const shareData = {
            title: `${story.node.name}的故事`,
            text: story.sections[0]?.content[0]?.substring(0, 200) || '',
            url: `${window.location.origin}${window.location.pathname}#story/${story.shareCode}`
        };

        // 尝试使用 Web Share API
        if (navigator.share) {
            navigator.share(shareData).catch(() => {
                this.fallbackShare(shareData);
            });
        } else {
            this.fallbackShare(shareData);
        }

        return shareData;
    }

    /**
     * 备用分享方式
     */
    fallbackShare(shareData) {
        const text = `${shareData.title}\n\n${shareData.text}\n\n🔗 ${shareData.url}`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('故事链接已复制到剪贴板！');
            });
        } else {
            // 创建临时文本区域
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('故事链接已复制到剪贴板！');
        }
    }

    /**
     * 显示提示消息
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.8); color: white; padding: 12px 24px;
            border-radius: 8px; z-index: 10000; animation: fadeInUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    /**
     * 获取故事列表
     */
    getStoryHistory() {
        return this.storyHistory.map(id => this.stories.get(id)).filter(Boolean);
    }

    /**
     * 导出故事
     */
    exportStory(storyId, format = 'text') {
        const story = this.stories.get(storyId);
        if (!story) return null;

        switch (format) {
            case 'text':
                return this.exportAsText(story);
            case 'html':
                return this.exportAsHTML(story);
            case 'json':
                return JSON.stringify(story, null, 2);
            default:
                return this.exportAsText(story);
        }
    }

    /**
     * 文本格式导出
     */
    exportAsText(story) {
        let text = `《${story.node.name}的故事》\n`;
        text += `视角：${story.perspectiveConfig.name}\n`;
        text += `风格：${story.styleConfig.name}\n`;
        text += `生成时间：${new Date(story.createdAt).toLocaleString('zh-CN')}\n`;
        text += '='.repeat(40) + '\n\n';

        story.sections.forEach(section => {
            text += `【${section.title}】\n\n`;
            section.content.forEach(p => {
                text += `　　${p}\n\n`;
            });
        });

        text += '='.repeat(40) + '\n';
        text += `字数：${story.stats.totalWords} | 预计阅读：${story.stats.totalReadingTime}分钟\n`;

        return text;
    }

    /**
     * HTML格式导出
     */
    exportAsHTML(story) {
        let html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">`;
        html += `<title>${story.node.name}的故事</title>`;
        html += `<style>
            body { font-family: serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #333; }
            h1 { text-align: center; color: #667eea; }
            h2 { color: #764ba2; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .meta { text-align: center; color: #999; margin-bottom: 40px; }
            .section { margin: 30px 0; }
            .timeline { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .timeline-item { display: flex; gap: 15px; margin: 10px 0; }
            .timeline-year { font-weight: bold; color: #667eea; min-width: 60px; }
            .footer { text-align: center; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
        </style></head><body>`;
        html += `<h1>${story.node.name}的故事</h1>`;
        html += `<div class="meta">${story.perspectiveConfig.icon} ${story.perspectiveConfig.name} · ${story.styleConfig.name}</div>`;

        story.sections.forEach(section => {
            html += `<div class="section"><h2>${section.icon} ${section.title}</h2>`;
            section.content.forEach(p => {
                html += `<p>${p}</p>`;
            });
            html += `</div>`;
        });

        html += `<div class="footer">
            字数：${story.stats.totalWords} | 预计阅读：${story.stats.totalReadingTime}分钟 | 
            生成于历史之树 v4.0
        </div></body></html>`;

        return html;
    }

    /**
     * 显示故事UI
     */
    showUI(options = {}) {
        const { nodeId, perspective, template, style } = options;

        // 创建容器
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'story-generator-ui';
            document.querySelector(this.app.options.container)?.appendChild(this.container);
        }

        this.renderStoryUI(nodeId, { perspective, template, style });
    }

    /**
     * 渲染故事UI
     */
    renderStoryUI(nodeId, options) {
        if (!this.container) return;

        this.container.innerHTML = '';
        this.container.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 1000;
            display: flex; align-items: center; justify-content: center;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: white; border-radius: 16px; width: 90%; max-width: 900px;
            max-height: 90vh; overflow-y: auto; padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;

        // 标题栏
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;';
        header.innerHTML = `
            <h2 style="margin:0; color: #667eea;">📖 故事生成器</h2>
            <button id="story-close-btn" style="background:none; border:none; font-size:24px; cursor:pointer;">✕</button>
        `;
        panel.appendChild(header);

        // 视角选择
        const perspectiveSection = document.createElement('div');
        perspectiveSection.style.cssText = 'margin-bottom: 20px;';
        perspectiveSection.innerHTML = '<h3 style="color:#333; margin-bottom:10px;">选择叙事视角</h3>';

        const perspectiveGrid = document.createElement('div');
        perspectiveGrid.style.cssText = 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;';

        Object.entries(StoryGenerator.PERSPECTIVES).forEach(([key, p]) => {
            const card = document.createElement('div');
            card.className = 'perspective-card';
            card.dataset.perspective = key;
            card.style.cssText = `
                padding: 12px; border: 2px solid #eee; border-radius: 10px;
                text-align: center; cursor: pointer; transition: all 0.3s;
            `;
            card.innerHTML = `<div style="font-size:24px;">${p.icon}</div><div style="font-size:12px; margin-top:5px;">${p.name}</div>`;
            card.addEventListener('click', () => this.selectPerspective(key));
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = p.color;
                card.style.transform = 'translateY(-2px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '#eee';
                card.style.transform = 'translateY(0)';
            });
            perspectiveGrid.appendChild(card);
        });
        perspectiveSection.appendChild(perspectiveGrid);
        panel.appendChild(perspectiveSection);

        // 模板选择
        const templateSection = document.createElement('div');
        templateSection.style.cssText = 'margin-bottom: 20px;';
        templateSection.innerHTML = '<h3 style="color:#333; margin-bottom:10px;">选择故事模板</h3>';

        const templateGrid = document.createElement('div');
        templateGrid.style.cssText = 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;';

        Object.entries(StoryGenerator.STORY_TEMPLATES).forEach(([key, t]) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.dataset.template = key;
            card.style.cssText = `
                padding: 10px; border: 2px solid #eee; border-radius: 8px;
                text-align: center; cursor: pointer; transition: all 0.3s;
            `;
            card.innerHTML = `<div style="font-size:14px; font-weight:bold;">${t.name}</div><div style="font-size:11px; color:#999; margin-top:4px;">${t.structure.length}段</div>`;
            card.addEventListener('click', () => this.selectTemplate(key));
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = '#667eea';
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '#eee';
            });
            templateGrid.appendChild(card);
        });
        templateSection.appendChild(templateGrid);
        panel.appendChild(templateSection);

        // 风格选择
        const styleSection = document.createElement('div');
        styleSection.style.cssText = 'margin-bottom: 20px;';
        styleSection.innerHTML = '<h3 style="color:#333; margin-bottom:10px;">选择文风</h3>';

        const styleRow = document.createElement('div');
        styleRow.style.cssText = 'display: flex; gap: 10px;';

        Object.entries(StoryGenerator.LITERARY_STYLES).forEach(([key, s]) => {
            const btn = document.createElement('button');
            btn.className = 'style-btn';
            btn.dataset.style = key;
            btn.textContent = s.name;
            btn.style.cssText = `
                padding: 8px 20px; border: 2px solid #eee; border-radius: 20px;
                background: white; cursor: pointer; transition: all 0.3s;
            `;
            btn.addEventListener('click', () => this.selectStyle(key));
            btn.addEventListener('mouseenter', () => {
                btn.style.borderColor = '#667eea'; btn.style.color = '#667eea';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.borderColor = '#eee'; btn.style.color = '#333';
            });
            styleRow.appendChild(btn);
        });
        styleSection.appendChild(styleRow);
        panel.appendChild(styleSection);

        // 生成按钮
        const generateBtn = document.createElement('button');
        generateBtn.textContent = '🎭 生成故事';
        generateBtn.style.cssText = `
            width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2);
            color: white; border: none; border-radius: 10px; font-size: 16px;
            cursor: pointer; margin-bottom: 20px; transition: opacity 0.3s;
        `;
        generateBtn.addEventListener('mouseenter', () => { generateBtn.style.opacity = '0.9'; });
        generateBtn.addEventListener('mouseleave', () => { generateBtn.style.opacity = '1'; });
        generateBtn.addEventListener('click', () => {
            const selectedPerspective = this.container.querySelector('.perspective-card.selected')?.dataset.perspective || 'emperor';
            const selectedTemplate = this.container.querySelector('.template-card.selected')?.dataset.template || 'biography';
            const selectedStyle = this.container.querySelector('.style-btn.selected')?.dataset.style || 'vivid';

            if (nodeId) {
                const story = this.generateStory(nodeId, {
                    perspective: selectedPerspective,
                    template: selectedTemplate,
                    style: selectedStyle
                });
                if (story) {
                    this.renderStoryContent(story);
                }
            }
        });
        panel.appendChild(generateBtn);

        // 故事内容区域
        const contentArea = document.createElement('div');
        contentArea.id = 'story-content-area';
        panel.appendChild(contentArea);

        this.container.appendChild(panel);

        // 事件绑定
        this.container.querySelector('#story-close-btn').addEventListener('click', () => {
            this.container.style.display = 'none';
        });

        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.container.style.display = 'none';
            }
        });
    }

    /**
     * 选择视角
     */
    selectPerspective(key) {
        this.container.querySelectorAll('.perspective-card').forEach(card => {
            card.classList.remove('selected');
            card.style.borderColor = '#eee';
            card.style.background = 'white';
        });
        const selected = this.container.querySelector(`[data-perspective="${key}"]`);
        if (selected) {
            selected.classList.add('selected');
            selected.style.borderColor = StoryGenerator.PERSPECTIVES[key].color;
            selected.style.background = '#f0f0ff';
        }
    }

    /**
     * 选择模板
     */
    selectTemplate(key) {
        this.container.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
            card.style.borderColor = '#eee';
            card.style.background = 'white';
        });
        const selected = this.container.querySelector(`[data-template="${key}"]`);
        if (selected) {
            selected.classList.add('selected');
            selected.style.borderColor = '#667eea';
            selected.style.background = '#f0f0ff';
        }
    }

    /**
     * 选择风格
     */
    selectStyle(key) {
        this.container.querySelectorAll('.style-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.style.borderColor = '#eee';
            btn.style.background = 'white';
            btn.style.color = '#333';
        });
        const selected = this.container.querySelector(`[data-style="${key}"]`);
        if (selected) {
            selected.classList.add('selected');
            selected.style.borderColor = '#667eea';
            selected.style.background = '#667eea';
            selected.style.color = 'white';
        }
    }

    /**
     * 渲染故事内容
     */
    renderStoryContent(story) {
        const contentArea = this.container?.querySelector('#story-content-area');
        if (!contentArea) return;

        contentArea.innerHTML = '';

        // 故事头部
        const storyHeader = document.createElement('div');
        storyHeader.style.cssText = `
            background: linear-gradient(135deg, ${story.perspectiveConfig.color}22, ${story.perspectiveConfig.color}08);
            padding: 20px; border-radius: 12px; margin-bottom: 20px;
            display: flex; justify-content: space-between; align-items: center;
        `;
        storyHeader.innerHTML = `
            <div>
                <h3 style="margin:0; color:${story.perspectiveConfig.color};">${story.perspectiveConfig.icon} ${story.node.name}的故事</h3>
                <p style="margin:5px 0 0; color:#999; font-size:14px;">
                    ${story.perspectiveConfig.name} · ${story.templateConfig.name} · ${story.styleConfig.name}
                </p>
            </div>
            <div style="text-align:right;">
                <span style="color:#999; font-size:12px;">${story.stats.totalWords}字 · 约${story.stats.totalReadingTime}分钟</span>
                <div style="margin-top:5px;">
                    <button id="story-share-btn" style="padding:4px 12px; border:1px solid #667eea; border-radius:15px; background:white; color:#667eea; cursor:pointer; margin-left:5px;">🔗 分享</button>
                    <button id="story-export-btn" style="padding:4px 12px; border:1px solid #764ba2; border-radius:15px; background:white; color:#764ba2; cursor:pointer; margin-left:5px;">📥 导出</button>
                </div>
            </div>
        `;
        contentArea.appendChild(storyHeader);

        // 故事时间线
        const timelineDiv = document.createElement('div');
        timelineDiv.style.cssText = `
            display: flex; overflow-x: auto; padding: 15px 0; margin-bottom: 20px;
            border-bottom: 1px solid #eee;
        `;
        story.timeline.forEach((item, i) => {
            const tlItem = document.createElement('div');
            tlItem.style.cssText = `
                min-width: 140px; padding: 10px; text-align: center; cursor: pointer;
                transition: all 0.3s;
            `;
            tlItem.innerHTML = `
                <div style="font-size:12px; color:${item.color}; font-weight:bold;">${item.year}年</div>
                <div style="font-size:18px; margin:5px 0;">${item.icon}</div>
                <div style="font-size:13px; color:#333;">${item.title}</div>
            `;
            tlItem.addEventListener('click', () => {
                const section = contentArea.querySelector(`[data-section="${i}"]`);
                section?.scrollIntoView({ behavior: 'smooth' });
            });
            timelineDiv.appendChild(tlItem);
        });
        contentArea.appendChild(timelineDiv);

        // 故事段落
        story.sections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.dataset.section = index;
            sectionDiv.style.cssText = 'margin-bottom: 25px; scroll-margin-top: 20px;';

            const sectionTitle = document.createElement('h4');
            sectionTitle.style.cssText = `color:${section.color}; border-left: 3px solid ${section.color}; padding-left: 10px;`;
            sectionTitle.textContent = `${section.icon} ${section.title}`;
            sectionDiv.appendChild(sectionTitle);

            section.content.forEach(p => {
                const paragraph = document.createElement('p');
                paragraph.style.cssText = 'line-height: 1.8; color: #444; text-indent: 2em; margin: 10px 0;';
                paragraph.textContent = p;
                sectionDiv.appendChild(paragraph);
            });

            // 关键事件
            if (section.keyEvents.length > 0) {
                const eventsDiv = document.createElement('div');
                eventsDiv.style.cssText = 'background: #f8f9fa; padding: 12px; border-radius: 8px; margin-top: 10px;';
                eventsDiv.innerHTML = '<div style="font-size:12px; color:#999; margin-bottom:5px;">📌 关键事件</div>';
                section.keyEvents.forEach(event => {
                    eventsDiv.innerHTML += `<div style="font-size:13px; margin:3px 0;"><strong>${event.year}</strong> - ${event.title}</div>`;
                });
                sectionDiv.appendChild(eventsDiv);
            }

            contentArea.appendChild(sectionDiv);
        });

        // 绑定分享和导出事件
        contentArea.querySelector('#story-share-btn')?.addEventListener('click', () => {
            this.shareStory(story.id);
        });
        contentArea.querySelector('#story-export-btn')?.addEventListener('click', () => {
            const text = this.exportStory(story.id, 'text');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${story.node.name}_故事.txt`;
            a.click();
            URL.revokeObjectURL(url);
        });

        // 默认选中第一个视角、模板、风格
        this.selectPerspective(story.perspective);
        this.selectTemplate(story.template);
        this.selectStyle(story.style);
    }

    /**
     * 销毁
     */
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.stories.clear();
        this.storyCache.clear();
        this.storyHistory = [];
    }
}

// 导出到全局
window.StoryGenerator = StoryGenerator;
