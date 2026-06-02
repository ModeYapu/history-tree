/**
 * 世界数据服务 - WorldDataService.js
 * 整合中国+世界历史数据，提供跨文明查询
 */

class WorldDataService {
    constructor() {
        this.chineseDynasties = []; // will be populated in init()
        this.worldEvents = [];
        this.worldCivilizations = {};

        this.init();
    }

    init() {
        // 加载数据
        this.chineseDynasties = this._extractChineseDynasties();
        this.worldEvents = window.worldEvents || [];
        this.worldCivilizations = window.WorldCivilizations || {};

        console.log('WorldDataService 初始化完成', {
            chineseDynasties: this.chineseDynasties.length,
            worldEvents: this.worldEvents.length,
            civilizations: Object.keys(this.worldCivilizations).length
        });
    }

    /**
     * 获取指定年份的同时期信息
     * @param {number} year - 年份（负数表示公元前）
     * @param {number} range - 范围（前后多少年）
     * @returns {Object} 包含中国和世界的同时期信息
     */
    getConcurrentInfo(year, range = 50) {
        const startYear = year - range;
        const endYear = year + range;

        // 获取同时期的中国朝代
        const concurrentDynasties = this.chineseDynasties.filter(dynasty =>
            dynasty.start <= endYear && dynasty.end >= startYear
        );

        // 获取同时期的世界事件
        const concurrentEvents = this.worldEvents.filter(event =>
            event.year >= startYear && event.year <= endYear
        );

        // 获取同时期的世界文明
        const concurrentCivilizations = [];
        Object.keys(this.worldCivilizations).forEach(civId => {
            const civData = this.worldCivilizations[civId];
            const civStart = this.getCivilizationStart(civData);
            const civEnd = this.getCivilizationEnd(civData);

            if (civStart <= endYear && civEnd >= startYear) {
                concurrentCivilizations.push({
                    id: civId,
                    name: civData.name,
                    region: civData.region,
                    start: civStart,
                    end: civEnd,
                    overlap: this.calculateOverlap(civStart, civEnd, startYear, endYear)
                });
            }
        });

        return {
            year: year,
            range: range,
            china: {
                dynasties: concurrentDynasties,
                total: concurrentDynasties.length
            },
            world: {
                events: concurrentEvents,
                civilizations: concurrentCivilizations,
                totalEvents: concurrentEvents.length,
                totalCivilizations: concurrentCivilizations.length
            }
        };
    }

    /**
     * 跨文明查询：获取指定文明在中国同时期的信息
     * @param {string} civId - 文明ID
     * @returns {Object} 包含中国朝代和世界文明的对比信息
     */
    getCrossCivilizationInfo(civId) {
        const civData = this.worldCivilizations[civId];
        if (!civData) {
            return { error: 'Civilization not found' };
        }

        const civStart = this.getCivilizationStart(civData);
        const civEnd = this.getCivilizationEnd(civData);

        // 获取同时期的中国朝代
        const concurrentDynasties = this.chineseDynasties.filter(dynasty =>
            dynasty.start <= civEnd && dynasty.end >= civStart
        );

        // 获取同时期的其他世界文明
        const concurrentCivilizations = [];
        Object.keys(this.worldCivilizations).forEach(otherCivId => {
            if (otherCivId === civId) return;

            const otherCivData = this.worldCivilizations[otherCivId];
            const otherStart = this.getCivilizationStart(otherCivData);
            const otherEnd = this.getCivilizationEnd(otherCivData);

            if (otherStart <= civEnd && otherEnd >= civStart) {
                concurrentCivilizations.push({
                    id: otherCivId,
                    name: otherCivData.name,
                    region: otherCivData.region,
                    start: otherStart,
                    end: otherEnd,
                    overlap: this.calculateOverlap(otherStart, otherEnd, civStart, civEnd)
                });
            }
        });

        // 按重叠时间排序
        concurrentCivilizations.sort((a, b) => b.overlap - a.overlap);

        return {
            civilization: {
                id: civId,
                name: civData.name,
                region: civData.region,
                start: civStart,
                end: civEnd,
                duration: civEnd - civStart
            },
            china: {
                concurrentDynasties: concurrentDynasties.map(d => ({
                    name: d.name,
                    start: d.start,
                    end: d.end,
                    capital: d.capital,
                    overlap: this.calculateOverlap(d.start, d.end, civStart, civEnd)
                }))
            },
            world: {
                concurrentCivilizations: concurrentCivilizations
            }
        };
    }

    /**
     * 时间范围过滤：获取指定时间范围内的所有数据
     * @param {number} startYear - 起始年份
     * @param {number} endYear - 结束年份
     * @returns {Object} 包含中国和世界的数据
     */
    getByTimeRange(startYear, endYear) {
        // 中国朝代
        const dynastiesInRange = this.chineseDynasties.filter(dynasty =>
            dynasty.start <= endYear && dynasty.end >= startYear
        );

        // 世界事件
        const eventsInRange = this.worldEvents.filter(event =>
            event.year >= startYear && event.year <= endYear
        );

        // 世界文明
        const civilizationsInRange = [];
        Object.keys(this.worldCivilizations).forEach(civId => {
            const civData = this.worldCivilizations[civId];
            const civStart = this.getCivilizationStart(civData);
            const civEnd = this.getCivilizationEnd(civData);

            if (civStart <= endYear && civEnd >= startYear) {
                civilizationsInRange.push({
                    id: civId,
                    name: civData.name,
                    region: civData.region,
                    start: civStart,
                    end: civEnd
                });
            }
        });

        return {
            timeRange: { start: startYear, end: endYear },
            china: {
                dynasties: dynastiesInRange,
                total: dynastiesInRange.length
            },
            world: {
                events: eventsInRange,
                civilizations: civilizationsInRange,
                totalEvents: eventsInRange.length,
                totalCivilizations: civilizationsInRange.length
            }
        };
    }

    /**
     * 文明关联查询：查找文明之间的关联关系
     * @param {string} civId - 文明ID
     * @param {number} depth - 搜索深度（可选，默认1）
     * @returns {Object} 包含关联文明和关系类型
     */
    getCivilizationRelations(civId, depth = 1) {
        const civData = this.worldCivilizations[civId];
        if (!civData) {
            return { error: 'Civilization not found' };
        }

        const civStart = this.getCivilizationStart(civData);
        const civEnd = this.getCivilizationEnd(civData);

        const relations = [];

        Object.keys(this.worldCivilizations).forEach(otherCivId => {
            if (otherCivId === civId) return;

            const otherCivData = this.worldCivilizations[otherCivId];
            const otherStart = this.getCivilizationStart(otherCivData);
            const otherEnd = this.getCivilizationEnd(otherCivData);

            // 检查时间重叠
            const hasOverlap = civStart <= otherEnd && civEnd >= otherStart;

            // 检查贸易路线关联（基于地理位置）
            const hasTradeRoute = this.hasTradeRoute(civData, otherCivData);

            // 检查战争关联（基于事件）
            const hasWar = this.hasWarRelation(civId, otherCivId);

            // 检查文化交流（基于人物和事件）
            const hasCulturalExchange = this.hasCulturalExchange(civId, otherCivId);

            if (hasOverlap || hasTradeRoute || hasWar || hasCulturalExchange) {
                const relationTypes = [];
                if (hasOverlap) relationTypes.push('concurrent');
                if (hasTradeRoute) relationTypes.push('trade');
                if (hasWar) relationTypes.push('war');
                if (hasCulturalExchange) relationTypes.push('cultural');

                relations.push({
                    id: otherCivId,
                    name: otherCivData.name,
                    region: otherCivData.region,
                    relationTypes: relationTypes,
                    overlap: hasOverlap ? this.calculateOverlap(civStart, civEnd, otherStart, otherEnd) : 0
                });
            }
        });

        return {
            civilization: {
                id: civId,
                name: civData.name,
                region: civData.region
            },
            relations: relations,
            total: relations.length
        };
    }

    /**
     * 搜索：跨文明搜索关键词
     * @param {string} query - 搜索关键词
     * @param {Array} types - 搜索类型（可选，如 ['person', 'event', 'location']）
     * @returns {Object} 包含匹配结果
     */
    search(query, types = null) {
        const lowerQuery = query.toLowerCase();

        const results = {
            query: query,
            chinese: {
                dynasties: [],
                persons: []
            },
            world: {
                events: [],
                persons: [],
                civilizations: [],
                locations: []
            }
        };

        // 搜索中国朝代
        if (!types || types.includes('civilization')) {
            results.chinese.dynasties = this.chineseDynasties.filter(d =>
                d.name.toLowerCase().includes(lowerQuery) ||
                (d.description && d.description.toLowerCase().includes(lowerQuery)) ||
                (d.capital && d.capital.toLowerCase().includes(lowerQuery))
            );
        }

        // 搜索世界事件
        if (!types || types.includes('event')) {
            results.world.events = this.worldEvents.filter(e =>
                e.name.toLowerCase().includes(lowerQuery) ||
                (e.description && e.description.toLowerCase().includes(lowerQuery)) ||
                (e.location && e.location.toLowerCase().includes(lowerQuery))
            );
        }

        // 搜索世界文明
        if (!types || types.includes('civilization')) {
            Object.keys(this.worldCivilizations).forEach(civId => {
                const civData = this.worldCivilizations[civId];
                if (civData.name.toLowerCase().includes(lowerQuery) ||
                    (civData.region && civData.region.toLowerCase().includes(lowerQuery))) {
                    results.world.civilizations.push({
                        id: civId,
                        name: civData.name,
                        region: civData.region
                    });
                }

                // 搜索人物
                if (!types || types.includes('person')) {
                    if (civData.persons) {
                        civData.persons.forEach(person => {
                            if (person.name.toLowerCase().includes(lowerQuery) ||
                                (person.description && person.description.toLowerCase().includes(lowerQuery))) {
                                results.world.persons.push({
                                    ...person,
                                    civilization: civData.name,
                                    civId: civId
                                });
                            }
                        });
                    }
                }
            });
        }

        // 提取地点
        if (!types || types.includes('location')) {
            const locations = new Set();
            this.worldEvents.forEach(e => {
                if (e.location && e.location.toLowerCase().includes(lowerQuery)) {
                    locations.add(e.location);
                }
            });
            results.world.locations = Array.from(locations);
        }

        return results;
    }

    /**
     * 获取特定历史问题的答案
     * @param {string} question - 问题（如 "唐朝同时期欧洲发生了什么"）
     * @returns {Object} 包含答案和相关信息
     */
    answerQuestion(question) {
        const lowerQuestion = question.toLowerCase();

        // 解析问题类型
        if (question.includes('同时期') || question.includes('同时')) {
            return this.answerConcurrentQuestion(question);
        } else if (question.includes('朝代') || question.includes('王朝')) {
            return this.answerDynastyQuestion(question);
        } else if (question.includes('文明') || question.includes('帝国')) {
            return this.answerCivilizationQuestion(question);
        } else if (question.includes('事件') || question.includes('发生')) {
            return this.answerEventQuestion(question);
        }

        return {
            question: question,
            answer: '抱歉，我无法理解这个问题。请尝试询问关于同时期、朝代、文明或事件的问题。',
            suggestions: [
                '唐朝同时期欧洲发生了什么？',
                '罗马帝国什么时候存在？',
                '丝绸之路经过哪些文明？',
                '公元前500年有哪些重要事件？'
            ]
        };
    }

    answerConcurrentQuestion(question) {
        // 提取朝代或文明名称
        const chinaMatches = this.chineseDynasties.filter(d =>
            question.includes(d.name)
        );

        const worldMatches = Object.keys(this.worldCivilizations).filter(civId =>
            question.includes(this.worldCivilizations[civId].name)
        );

        if (chinaMatches.length > 0) {
            const dynasty = chinaMatches[0];
            const info = this.getCrossCivilizationInfo('rome'); // 示例：对比罗马

            return {
                question: question,
                answer: `${dynasty.name}（${dynasty.start}年 ~ ${dynasty.end}年）时期，欧洲正处于古罗马时代。`,
                details: {
                    china: {
                        dynasty: dynasty.name,
                        period: `${dynasty.start}年 ~ ${dynasty.end}年`,
                        capital: dynasty.capital,
                        achievements: dynasty.achievements || []
                    },
                    world: {
                        concurrentCivilizations: info.world.concurrentCivilizations,
                        concurrentEvents: this.worldEvents.filter(e =>
                            e.year >= dynasty.start && e.year <= dynasty.end
                        ).slice(0, 5)
                    }
                }
            };
        }

        if (worldMatches.length > 0) {
            const civId = worldMatches[0];
            const info = this.getCrossCivilizationInfo(civId);

            return {
                question: question,
                answer: `${this.worldCivilizations[civId].name}时期，中国有${info.china.concurrentDynasties.length}个朝代与其同时期。`,
                details: info
            };
        }

        return {
            question: question,
            answer: '请指定具体的朝代或文明名称。',
            suggestions: this.chineseDynasties.slice(0, 5).map(d => d.name).concat(
                Object.keys(this.worldCivilizations).slice(0, 5).map(civId => this.worldCivilizations[civId].name)
            )
        };
    }

    answerDynastyQuestion(question) {
        const matches = this.chineseDynasties.filter(d =>
            question.includes(d.name)
        );

        if (matches.length > 0) {
            const dynasty = matches[0];
            return {
                question: question,
                answer: `${dynasty.name}存在于${dynasty.start}年至${dynasty.end}年，都城是${dynasty.capital}。`,
                details: dynasty
            };
        }

        return {
            question: question,
            answer: '未找到相关的朝代信息。',
            suggestions: this.chineseDynasties.slice(0, 5).map(d => d.name)
        };
    }

    answerCivilizationQuestion(question) {
        const matches = Object.keys(this.worldCivilizations).filter(civId =>
            question.includes(this.worldCivilizations[civId].name)
        );

        if (matches.length > 0) {
            const civId = matches[0];
            const civData = this.worldCivilizations[civId];
            const start = this.getCivilizationStart(civData);
            const end = this.getCivilizationEnd(civData);

            return {
                question: question,
                answer: `${civData.name}存在于${start}年至${end}年，位于${civData.region}地区。`,
                details: {
                    id: civId,
                    name: civData.name,
                    region: civData.region,
                    start: start,
                    end: end,
                    duration: end - start
                }
            };
        }

        return {
            question: question,
            answer: '未找到相关的文明信息。',
            suggestions: Object.keys(this.worldCivilizations).slice(0, 5).map(civId => this.worldCivilizations[civId].name)
        };
    }

    answerEventQuestion(question) {
        const matches = this.worldEvents.filter(e =>
            question.includes(e.name)
        );

        if (matches.length > 0) {
            const event = matches[0];
            return {
                question: question,
                answer: `${event.name}发生在${this.formatYear(event.year)}，地点是${event.location}。`,
                details: event
            };
        }

        return {
            question: question,
            answer: '未找到相关的事件信息。',
            suggestions: this.worldEvents.slice(0, 5).map(e => e.name)
        };
    }

    // 辅助方法
    getCivilizationStart(civData) {
        if (civData.events && civData.events.length > 0) {
            return Math.min(...civData.events.map(e => e.year));
        }
        if (civData.persons && civData.persons.length > 0) {
            return Math.min(...civData.persons.map(p => p.year));
        }
        return -3000;
    }

    getCivilizationEnd(civData) {
        if (civData.events && civData.events.length > 0) {
            return Math.max(...civData.events.map(e => e.year));
        }
        if (civData.persons && civData.persons.length > 0) {
            return Math.max(...civData.persons.map(p => p.year));
        }
        return 2025;
    }

    calculateOverlap(start1, end1, start2, end2) {
        const overlapStart = Math.max(start1, start2);
        const overlapEnd = Math.min(end1, end2);
        return Math.max(0, overlapEnd - overlapStart);
    }

    hasTradeRoute(civ1, civ2) {
        // 基于地理位置的简单判断
        const tradeRegions = {
            '中东': ['欧洲', '北非', '中亚'],
            '欧洲': ['中东', '北非', '中亚'],
            '中亚': ['中东', '欧洲', '南亚'],
            '南亚': ['中亚', '东南亚']
        };

        const region1 = civ1.region;
        const region2 = civ2.region;

        if (tradeRegions[region1] && tradeRegions[region1].includes(region2)) {
            return true;
        }

        return false;
    }

    hasWarRelation(civId1, civId2) {
        // 检查是否有战争相关的事件
        const warEvents = this.worldEvents.filter(e =>
            e.category === 'warfare' &&
            (e.description.includes(civId1) || e.description.includes(civId2))
        );
        return warEvents.length > 0;
    }

    hasCulturalExchange(civId1, civId2) {
        // 检查人物关系
        const civ1Data = this.worldCivilizations[civId1];
        const civ2Data = this.worldCivilizations[civId2];

        if (!civ1Data || !civ2Data) return false;

        if (!civ1Data.persons) return false;

        for (const person of civ1Data.persons) {
            if (person.relations) {
                const relatedIds = Object.values(person.relations).flat();
                for (const relatedId of relatedIds) {
                    if (civ2Data.persons && civ2Data.persons.some(p => p.id === relatedId)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    formatYear(year) {
        if (year < 0) {
            return `公元前${Math.abs(year)}年`;
        }
        return `公元${year}年`;
    }

    /**
     * 获取统计信息
     */
    getStats() {
        return {
            chineseDynasties: this.chineseDynasties.length,
            worldEvents: this.worldEvents.length,
            worldCivilizations: Object.keys(this.worldCivilizations).length,
            totalPersons: Object.values(this.worldCivilizations).reduce((sum, civ) => {
                return sum + (civ.persons ? civ.persons.length : 0);
            }, 0),
            totalEvents: Object.values(this.worldCivilizations).reduce((sum, civ) => {
                return sum + (civ.events ? civ.events.length : 0);
            }, 0)
        };
    }

    _extractChineseDynasties() {
        const cd = window.ChineseDynasties || {};
        return Object.entries(cd).map(([key, d]) => ({
            id: key,
            name: d.name,
            start: d.period ? d.period.start : 0,
            end: d.period ? d.period.end : 0,
            capital: d.capital || '',
            color: d.color || '#c9302c',
            achievements: d.achievements || [],
            description: d.description || '',
            events: d.events || [],
            persons: d.persons || []
        }));
    }
}



// 导出到全局
window.WorldDataService = WorldDataService;