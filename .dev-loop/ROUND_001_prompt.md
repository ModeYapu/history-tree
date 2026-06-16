# History Tree — Round R001: 清理 + 核心功能修复

## 项目概况
- 交互式历史可视化应用（D3.js 树形结构）
- 原生 JavaScript + D3.js + Three.js
- 73,836 行 JS 代码，192 个 JS 文件
- 入口: index.html
- 数据: data/ 目录（中国朝代、世界文明、历史事件等）

## 本轮目标

### 1. 清理冗余文件
删除以下不需要的文件（用 trash 命令如果可用，否则用 rm）：
- `index.html.backup` — 备份文件
- `screenshot-homepage.png` — 截图
- `fix-core.js`, `fix-p0-issues.sh`, `quick-fix.sh`, `quick-optimize.sh`, `verify-fix.sh` — 一次性修复脚本
- `core-fix-patch.js` — 补丁文件
- `test.html`, `test-search-engine.html` — 测试页面
- `test-results/` — Playwright 测试结果
- `coverage/` — 覆盖率报告
- `logs/` — 日志目录
- `INSTALL_SH.md` 等过期文档（保留 README.md, CLAUDE.md, SDD.md）
- 所有 `*_REPORT.md`, *_SUMMARY.md`, FIX_*.md`, OPTIMIZATION_*.md` 等过期报告文件

### 2. 验证核心功能
- 检查 index.html 是否能正确加载
- 检查 src/main.js 入口和 app-starter.js
- 确保 D3 树形视图（TreeView.js）正常
- 确保数据文件（data/*.js）正确加载
- 运行 `npx jest --passWithNoTests` 看测试状态

### 3. 修复明显问题
- 如果有明显的 JS 错误（console.error 级别），修复
- 如果 main.js / app-starter.js 有导入问题，修复
- 如果数据文件格式问题，修复

### 4. 统计和报告
- 清理后项目大小
- 核心文件列表
- 发现的问题和修复内容

## 约束
- 不要重写架构，保持原生 JS
- 不要引入新依赖
- 不要修改 data/*.js 的内容（除非格式错误）
- 清理后必须能通过 `python3 -m http.server 8000` 正常启动

## 执行
1. 先 `ls -la` 查看全部文件
2. 按顺序删除冗余文件
3. 检查核心 JS 文件
4. 运行测试
5. git add -A && git commit -m "refactor: clean up redundant files and verify core functionality"
