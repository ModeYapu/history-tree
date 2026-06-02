# 🌳 历史之树 - 持续精进 SDD

## 项目概述
交互式历史可视化 Web 应用，以树形结构展现人类历史进程。
纯 JavaScript（ES Module），无打包器，CDN 依赖。

## 技术栈
- **前端**: 原生 JS (ES Module) + CSS3
- **可视化**: D3.js v7 (树形图) + Three.js r128 (3D) + Leaflet (地图)
- **搜索**: Fuse.js 模糊搜索
- **AI**: MCP Server + 多模型管理
- **数据**: 静态 JS 数据文件 (data/*.js)

## 项目结构
```
src/
├── core/          App.js, EventBus.js, StateManager.js, Router.js
├── models/        HistoryNode.js
├── views/         TreeView, TimelineView, MapView, NetworkView, CardView, ComparisonView, HistoryTree3D, EnhancedNetworkView
├── components/    NodeCard, SearchBar, FilterPanel, AIChat, EnhancedAIChat, EventModal, PhilosophyUI, ModelSelector
├── services/      DataService, SearchEngine, FuzzySearchEngine, AIConnectionEngine, EnhancedAIEngine, MultiModelManager, MCPClient, EventRelations, QuizEngine, StoryGenerator
├── plugins/       TimelinePlugin, ExportPlugin, CollectionPlugin, EducationPlugin, AnalyticsPlugin
├── utils/         ConfigManager, ErrorHandler, PerformanceOptimizer, ResourceManager, SecurityUtils, StyleManager, ThemeManager, VirtualScroll
└── main.js        入口文件

data/              chinese-dynasties.js, historical-dataset.js, world-civilizations.js
css/               style.css, tree.css, animations.css
```

## 循环精进工作流

按以下顺序循环执行，每轮完成后自动进入下一轮：

### Phase 1: Code Review（代码审查）
1. 逐模块审查所有源文件
2. 记录问题清单（bug、代码异味、安全风险、性能问题）
3. 按严重程度排序：P0(崩溃) > P1(功能错误) > P2(性能) > P3(代码质量)
4. 写入 `REVIEW_NOTES.md`

### Phase 2: 修复优化
1. 先修 P0、P1 问题
2. 再优化 P2 性能问题
3. 最后处理 P3 代码质量
4. 每修一个验证：打开 index.html 无报错

### Phase 3: 扩展开发
选择 1-2 个方向深入开发（从下方列表中选），完成后回到 Phase 1

## 扩展开发方向（按优先级）

### 🔴 高优先级
1. **数据丰富化** — 扩充历史数据集（更多朝代、世界文明、事件细节、人物关系）
2. **交互体验提升** — 动画优化、拖拽交互、触摸支持、键盘导航
3. **视图完善** — TimelineView 时间轴精度、MapView 地图标记、3D视图性能

### 🟡 中优先级
4. **AI 增强对话** — 优化 AIChat 组件、流式响应、历史知识问答
5. **关系网络** — EventRelations 深化、人物关系图谱、因果链可视化
6. **导出系统** — ExportPlugin 完善（PDF、SVG、JSON、分享链接）
7. **教育模块** — QuizEngine 题库丰富、学习路径、知识卡片

### 🟢 低优先级
8. **性能优化** — VirtualScroll 完善、懒加载、WebWorker 数据处理
9. **主题系统** — ThemeManager 多主题、自定义配色
10. **无障碍** — ARIA 标签、屏幕阅读器支持、键盘导航

## 代码规范
- 所有文件使用 ES Module（export/import）
- 变量命名：camelCase
- 类命名：PascalCase
- 常量：UPPER_SNAKE_CASE
- 注释：JSDoc 格式
- 错误处理：try/catch + ErrorHandler
- 状态管理：通过 StateManager，不要直接操作 DOM

## 验证标准
- 浏览器打开 index.html 无控制台错误
- 所有视图切换正常（树形/时间线/地图/网络/卡片/3D）
- 搜索功能正常
- AI 对话可用
- 数据加载完整

## 注意事项
- 不要引入打包工具（Webpack/Vite），保持纯 JS 架构
- CDN 依赖保持现有版本，除非有充分理由升级
- 不要删除现有功能，只扩展和优化
- 每个扩展方向完成后更新本文档的进度
