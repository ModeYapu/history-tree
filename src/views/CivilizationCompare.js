/**
 * 文明对比视图 - CivilizationCompare.js
 * 提供双文明横向对比，支持雷达图和时间线重叠显示
 */

class CivilizationCompare {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        this.options = {
            ...options
        };

        this.selectedCivilizations = [];
        this.chineseDynasties = this._extractChineseDynasties();
        this.worldCivilizations = window.WorldCivilizations || {};

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.createUI();
        this.bindEvents();
    }

    createUI() {
        const html = `
            <div class="civilization-compare-container">
                <!-- 控制面板 -->
                <div class="compare-controls">
                    <div class="compare-selection">
                        <div class="selection-group">
                            <h3>选择文明/朝代 1</h3>
                            <select id="civ1-select" class="civ-select">
                                <option value="">请选择...</option>
                            </select>
                        </div>
                        <div class="selection-group">
                            <h3>选择文明/朝代 2</h3>
                            <select id="civ2-select" class="civ-select">
                                <option value="">请选择...</option>
                            </select>
                        </div>
                    </div>
                    <button id="compare-btn" class="compare-btn" disabled>开始对比</button>
                </div>

                <!-- 对比结果区域 -->
                <div id="compare-results" class="compare-results hidden">
                    <!-- 标题 -->
                    <div class="compare-header">
                        <h2 id="compare-title">文明对比</h2>
                    </div>

                    <!-- 时间线重叠图 -->
                    <div class="timeline-overlap-section">
                        <h3>📅 时间线重叠</h3>
                        <div id="timeline-overlap" class="timeline-overlap"></div>
                    </div>

                    <!-- 雷达图 -->
                    <div class="radar-chart-section">
                        <h3>📊 综合实力对比</h3>
                        <div id="radar-chart" class="radar-chart"></div>
                    </div>

                    <!-- 详细对比卡片 -->
                    <div class="compare-details">
                        <div class="detail-card" id="detail-card-1"></div>
                        <div class="detail-card" id="detail-card-2"></div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;

        // 填充下拉菜单
        this.populateSelects();
    }

    populateSelects() {
        const civ1Select = document.getElementById('civ1-select');
        const civ2Select = document.getElementById('civ2-select');

        if (!civ1Select || !civ2Select) return;

        let options = '<option value="">请选择...</option>';

        // 中国朝代
        options += '<optgroup label="🇨🇳 中国朝代">';
        this.chineseDynasties.forEach(dynasty => {
            options += `<option value="china-${dynasty.id}">${dynasty.name} (${dynasty.start} ~ ${dynasty.end})</option>`;
        });
        options += '</optgroup>';

        // 世界文明
        options += '<optgroup label="🌍 世界文明">';
        const worldCivs = this.worldCivilizations.civilizations || [];
        worldCivs.forEach(civ => {
            options += `<option value="world-${civ.id}">${civ.name}</option>`;
        });
        options += '</optgroup>';

        civ1Select.innerHTML = options;
        civ2Select.innerHTML = options;
    }

    bindEvents() {
        const civ1Select = document.getElementById('civ1-select');
        const civ2Select = document.getElementById('civ2-select');
        const compareBtn = document.getElementById('compare-btn');

        if (civ1Select && civ2Select && compareBtn) {
            civ1Select.addEventListener('change', () => this.checkSelection());
            civ2Select.addEventListener('change', () => this.checkSelection());
            compareBtn.addEventListener('click', () => this.performComparison());
        }
    }

    checkSelection() {
        const civ1Select = document.getElementById('civ1-select');
        const civ2Select = document.getElementById('civ2-select');
        const compareBtn = document.getElementById('compare-btn');

        if (compareBtn) {
            compareBtn.disabled = !(civ1Select.value && civ2Select.value);
        }
    }

    getCivilizationData(value) {
        if (!value) return null;

        const [type, id] = value.split('-');

        if (type === 'china') {
            const dynasty = this.chineseDynasties.find(d => d.id === id);
            if (dynasty) {
                return {
                    type: 'chinese',
                    id: dynasty.id,
                    name: dynasty.name,
                    start: parseInt(dynasty.start),
                    end: parseInt(dynasty.end),
                    capital: dynasty.capital,
                    achievements: dynasty.achievements || [],
                    description: dynasty.description || '',
                    military: this.calculateScore(dynasty, 'military'),
                    economy: this.calculateScore(dynasty, 'economy'),
                    culture: this.calculateScore(dynasty, 'culture'),
                    technology: this.calculateScore(dynasty, 'technology'),
                    territory: this.calculateScore(dynasty, 'territory')
                };
            }
        } else if (type === 'world') {
            const civData = this.worldCivilizations[id];
            if (civData) {
                return {
                    type: 'world',
                    id: id,
                    name: civData.name,
                    start: this.getCivilizationStart(civData),
                    end: this.getCivilizationEnd(civData),
                    region: civData.region,
                    achievements: civData.achievements || [],
                    description: civData.description || '',
                    military: this.calculateScore(civData, 'military'),
                    economy: this.calculateScore(civData, 'economy'),
                    culture: this.calculateScore(civData, 'culture'),
                    technology: this.calculateScore(civData, 'technology'),
                    territory: this.calculateScore(civData, 'territory')
                };
            }
        }

        return null;
    }

    getCivilizationStart(civ) {
        if (civ.events && civ.events.length > 0) {
            return Math.min(...civ.events.map(e => e.year));
        }
        if (civ.persons && civ.persons.length > 0) {
            return Math.min(...civ.persons.map(p => p.year));
        }
        return -3000;
    }

    getCivilizationEnd(civ) {
        if (civ.events && civ.events.length > 0) {
            return Math.max(...civ.events.map(e => e.year));
        }
        if (civ.persons && civ.persons.length > 0) {
            return Math.max(...civ.persons.map(p => p.year));
        }
        return 2025;
    }

    calculateScore(data, dimension) {
        // 基于事件、人物和成就计算得分
        let score = 50; // 基础分

        if (data.events) {
            const relevantEvents = data.events.filter(e =>
                e.category === dimension ||
                e.tags?.includes(dimension)
            );
            score += relevantEvents.length * 5;
        }

        if (data.persons) {
            const relevantPersons = data.persons.filter(p =>
                p.category === dimension ||
                p.tags?.includes(dimension)
            );
            score += relevantPersons.length * 3;
        }

        if (data.achievements) {
            const relevantAchievements = data.achievements.filter(a =>
                a.type === dimension ||
                a.category === dimension
            );
            score += relevantAchievements.length * 4;
        }

        return Math.min(100, Math.max(10, score));
    }

    performComparison() {
        const civ1Select = document.getElementById('civ1-select');
        const civ2Select = document.getElementById('civ2-select');
        const resultsDiv = document.getElementById('compare-results');

        const civ1 = this.getCivilizationData(civ1Select.value);
        const civ2 = this.getCivilizationData(civ2Select.value);

        if (!civ1 || !civ2) return;

        this.selectedCivilizations = [civ1, civ2];

        // 显示结果区域
        resultsDiv.classList.remove('hidden');

        // 更新标题
        document.getElementById('compare-title').textContent =
            `${civ1.name} vs ${civ2.name}`;

        // 渲染各个部分
        this.renderTimelineOverlap(civ1, civ2);
        this.renderRadarChart(civ1, civ2);
        this.renderDetailCards(civ1, civ2);
    }

    renderTimelineOverlap(civ1, civ2) {
        const container = document.getElementById('timeline-overlap');
        if (!container) return;

        const minYear = Math.min(civ1.start, civ2.start);
        const maxYear = Math.max(civ1.end, civ2.end);
        const totalYears = maxYear - minYear;

        // 计算两个文明的位置
        const civ1Start = ((civ1.start - minYear) / totalYears) * 100;
        const civ1End = ((civ1.end - minYear) / totalYears) * 100;
        const civ2Start = ((civ2.start - minYear) / totalYears) * 100;
        const civ2End = ((civ2.end - minYear) / totalYears) * 100;

        const civ1Width = civ1End - civ1Start;
        const civ2Width = civ2End - civ2Start;

        // 计算重叠
        const overlapStart = Math.max(civ1Start, civ2Start);
        const overlapEnd = Math.min(civ1End, civ2End);
        const hasOverlap = overlapEnd > overlapStart;
        const overlapWidth = hasOverlap ? overlapEnd - overlapStart : 0;

        const html = `
            <div class="timeline-overlap-visual">
                <div class="timeline-axis">
                    <div class="axis-label start">${minYear < 0 ? `公元前${Math.abs(minYear)}年` : `${minYear}年`}</div>
                    <div class="axis-bar"></div>
                    <div class="axis-label end">${maxYear > 0 ? `公元${maxYear}年` : `公元前${Math.abs(maxYear)}年`}</div>
                </div>

                <div class="civ-bar-container">
                    <div class="civ-bar civ1-bar"
                         style="left: ${civ1Start}%; width: ${civ1Width}%; background: ${civ1.type === 'chinese' ? '#c9302c' : '#d9534f'};">
                        <span class="civ-label">${civ1.name}</span>
                    </div>
                </div>

                <div class="civ-bar-container">
                    <div class="civ-bar civ2-bar"
                         style="left: ${civ2Start}%; width: ${civ2Width}%; background: ${civ2.type === 'chinese' ? '#5bc0de' : '#4cae4c'};">
                        <span class="civ-label">${civ2.name}</span>
                    </div>
                </div>

                ${hasOverlap ? `
                <div class="overlap-indicator">
                    <div class="overlap-bar"
                         style="left: ${overlapStart}%; width: ${overlapWidth}%; background: rgba(255, 193, 7, 0.7);">
                        <span class="overlap-label">同时期: ${Math.round(overlapWidth / 100 * totalYears)}年</span>
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="timeline-info">
                <p><strong>${civ1.name}</strong>: ${this.formatYear(civ1.start)} ~ ${this.formatYear(civ1.end)} (${civ1.end - civ1.start}年)</p>
                <p><strong>${civ2.name}</strong>: ${this.formatYear(civ2.start)} ~ ${this.formatYear(civ2.end)} (${civ2.end - civ2.start}年)</p>
                ${hasOverlap ? `
                <p class="overlap-highlight">🎯 两个文明有 ${Math.round(overlapWidth / 100 * totalYears)} 年的重叠时期</p>
                ` : '<p class="no-overlap">❌ 两个文明没有同时期</p>'}
            </div>
        `;

        container.innerHTML = html;
    }

    formatYear(year) {
        if (year < 0) {
            return `公元前${Math.abs(year)}年`;
        }
        return `公元${year}年`;
    }

    renderRadarChart(civ1, civ2) {
        const container = document.getElementById('radar-chart');
        if (!container) return;

        const dimensions = [
            { name: '军事实力', key: 'military' },
            { name: '经济规模', key: 'economy' },
            { name: '文化成就', key: 'culture' },
            { name: '科技创新', key: 'technology' },
            { name: '领土面积', key: 'territory' }
        ];

        const svgSize = 350;
        const centerX = svgSize / 2;
        const centerY = svgSize / 2;
        const radius = 120;
        const levels = 5;

        let svg = `<svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">`;

        // 绘制网格
        for (let i = levels; i >= 1; i--) {
            const levelRadius = (radius / levels) * i;
            svg += `<circle cx="${centerX}" cy="${centerY}" r="${levelRadius}"
                    fill="none" stroke="#ddd" stroke-width="1" opacity="0.5"/>`;
        }

        // 绘制轴线和标签
        dimensions.forEach((dim, i) => {
            const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // 轴线
            svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}"
                    stroke="#ddd" stroke-width="1" opacity="0.5"/>`;

            // 标签
            const labelX = centerX + Math.cos(angle) * (radius + 25);
            const labelY = centerY + Math.sin(angle) * (radius + 25);
            svg += `<text x="${labelX}" y="${labelY}"
                    text-anchor="middle" dominant-baseline="middle"
                    font-size="12" fill="#666">${dim.name}</text>`;
        });

        // 绘制数据多边形
        const colors = [
            civ1.type === 'chinese' ? 'rgba(201, 48, 44, 0.5)' : 'rgba(217, 83, 79, 0.5)',
            civ2.type === 'chinese' ? 'rgba(91, 192, 222, 0.5)' : 'rgba(76, 174, 76, 0.5)'
        ];
        const strokeColors = [
            civ1.type === 'chinese' ? '#c9302c' : '#d9534f',
            civ2.type === 'chinese' ? '#5bc0de' : '#4cae4c'
        ];

        [civ1, civ2].forEach((civ, civIndex) => {
            let points = '';
            dimensions.forEach((dim, i) => {
                const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
                const value = civ[dim.key] / 100; // 归一化
                const x = centerX + Math.cos(angle) * radius * value;
                const y = centerY + Math.sin(angle) * radius * value;
                points += `${x},${y} `;
            });

            // 绘制多边形
            svg += `<polygon points="${points}" fill="${colors[civIndex]}"
                    stroke="${strokeColors[civIndex]}" stroke-width="2"/>`;

            // 绘制点
            dimensions.forEach((dim, i) => {
                const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
                const value = civ[dim.key] / 100;
                const x = centerX + Math.cos(angle) * radius * value;
                const y = centerY + Math.sin(angle) * radius * value;
                svg += `<circle cx="${x}" cy="${y}" r="4" fill="${strokeColors[civIndex]}"/>`;
            });
        });

        // 图例
        svg += `
            <g transform="translate(20, 20)">
                <rect x="0" y="0" width="15" height="15" fill="${colors[0]}" stroke="${strokeColors[0]}"/>
                <text x="20" y="12" font-size="12" fill="#666">${civ1.name}</text>
            </g>
            <g transform="translate(20, 40)">
                <rect x="0" y="0" width="15" height="15" fill="${colors[1]}" stroke="${strokeColors[1]}"/>
                <text x="20" y="12" font-size="12" fill="#666">${civ2.name}</text>
            </g>
        `;

        svg += '</svg>';

        // 添加图例
        const legendHtml = `
            <div class="radar-legend">
                <div class="legend-item">
                    <span class="legend-color" style="background: ${strokeColors[0]}"></span>
                    <span>${civ1.name}</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background: ${strokeColors[1]}"></span>
                    <span>${civ2.name}</span>
                </div>
            </div>
        `;

        container.innerHTML = svg + legendHtml;
    }

    renderDetailCards(civ1, civ2) {
        const card1 = document.getElementById('detail-card-1');
        const card2 = document.getElementById('detail-card-2');

        if (card1) {
            card1.innerHTML = this.createDetailCard(civ1);
        }

        if (card2) {
            card2.innerHTML = this.createDetailCard(civ2);
        }
    }

    createDetailCard(civ) {
        const achievements = civ.achievements || [];
        const achievementsList = achievements.map(a => `<li>${a}</li>`).join('');

        return `
            <div class="detail-card-content">
                <h3>${civ.name}</h3>
                <div class="detail-meta">
                    <p><strong>时期:</strong> ${this.formatYear(civ.start)} ~ ${this.formatYear(civ.end)}</p>
                    <p><strong>持续时间:</strong> ${civ.end - civ.start} 年</p>
                    ${civ.capital ? `<p><strong>都城:</strong> ${civ.capital}</p>` : ''}
                    ${civ.region ? `<p><strong>地区:</strong> ${civ.region}</p>` : ''}
                </div>

                <div class="detail-scores">
                    <h4>实力评分</h4>
                    <div class="score-bar">
                        <span class="score-label">军事</span>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${civ.military}%"></div>
                        </div>
                        <span class="score-value">${civ.military}</span>
                    </div>
                    <div class="score-bar">
                        <span class="score-label">经济</span>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${civ.economy}%"></div>
                        </div>
                        <span class="score-value">${civ.economy}</span>
                    </div>
                    <div class="score-bar">
                        <span class="score-label">文化</span>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${civ.culture}%"></div>
                        </div>
                        <span class="score-value">${civ.culture}</span>
                    </div>
                    <div class="score-bar">
                        <span class="score-label">科技</span>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${civ.technology}%"></div>
                        </div>
                        <span class="score-value">${civ.technology}</span>
                    </div>
                    <div class="score-bar">
                        <span class="score-label">领土</span>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${civ.territory}%"></div>
                        </div>
                        <span class="score-value">${civ.territory}</span>
                    </div>
                </div>

                ${civ.description ? `
                <div class="detail-description">
                    <h4>简介</h4>
                    <p>${civ.description}</p>
                </div>
                ` : ''}

                ${achievements.length > 0 ? `
                <div class="detail-achievements">
                    <h4>主要成就</h4>
                    <ul>${achievementsList}</ul>
                </div>
                ` : ''}
            </div>
        `;
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
window.CivilizationCompare = CivilizationCompare;