#!/bin/bash
# 核心功能验证脚本

echo "🔍 历史之树核心功能验证"
echo "=========================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

# 检查函数
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# 1. 检查文件结构
echo "📁 检查文件结构..."

FILES=(
    "index.html"
    "core-fix-patch.js"
    "src/core/App.js"
    "src/core/EventBus.js"
    "src/core/StateManager.js"
    "src/models/HistoryNode.js"
    "src/services/DataService.js"
    "src/views/HistoryTree3D.js"
    "src/components/AIChat.js"
    "data/historical-dataset.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "文件存在: $file"
    else
        check_fail "文件缺失: $file"
    fi
done

echo ""

# 2. 检查HTTP服务器
echo "🌐 检查HTTP服务器..."
if lsof -i :8203 > /dev/null 2>&1; then
    check_pass "HTTP服务器运行中 (端口8203)"
else
    check_fail "HTTP服务器未运行"
    echo "    启动: python3 -m http.server 8203"
fi

echo ""

# 3. 检查修复脚本
echo "🔧 检查修复脚本..."

if grep -q "core-fix-patch.js" index.html; then
    check_pass "核心修复补丁已引用"
else
    check_fail "核心修复补丁未引用"
fi

if [ -f "core-fix-patch.js" ]; then
    check_pass "核心修复补丁文件存在"
else
    check_fail "核心修复补丁文件缺失"
fi

echo ""

# 4. 检查数据文件
echo "📊 检查数据文件..."

DATA_FILES=(
    "data/historical-dataset.js"
    "data/chinese-dynasties.js"
    "data/world-civilizations.js"
)

for file in "${DATA_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(wc -c < "$file")
        SIZE_KB=$((SIZE / 1024))
        check_pass "数据文件: $file (${SIZE_KB}KB)"
    else
        check_fail "数据文件缺失: $file"
    fi
done

echo ""

# 5. 检查CSS文件
echo "🎨 检查样式文件..."

CSS_FILES=(
    "css/style.css"
    "css/tree.css"
    "css/animations.css"
)

for file in "${CSS_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "样式文件: $file"
    else
        check_warn "样式文件缺失: $file"
    fi
done

echo ""

# 6. 检查插件
echo "🔌 检查插件..."

PLUGINS=(
    "src/plugins/ExportPlugin.js"
    "src/plugins/AnalyticsPlugin.js"
    "src/plugins/EducationPlugin.js"
    "src/plugins/CollectionPlugin.js"
)

for file in "${PLUGINS[@]}"; do
    if [ -f "$file" ]; then
        check_pass "插件: $(basename $file)"
    else
        check_warn "插件缺失: $(basename $file)"
    fi
done

echo ""

# 7. 总结
echo "=========================="
echo "📊 验证总结"
echo "=========================="

TOTAL=$((PASS + FAIL + WARN))
PERCENT=$((PASS * 100 / TOTAL))

echo -e "${GREEN}通过:${NC} $PASS"
echo -e "${RED}失败:${NC} $FAIL"
echo -e "${YELLOW}警告:${NC} $WARN"
echo "总计: $TOTAL"
echo "通过率: ${PERCENT}%"

echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ 所有关键检查通过！${NC}"
    echo ""
    echo "🚀 下一步:"
    echo "1. 在浏览器中访问: http://localhost:8203"
    echo "2. 打开浏览器开发者工具(F12)检查控制台"
    echo "3. 测试核心功能:"
    echo "   - 3D树形视图应正常显示"
    echo "   - 搜索功能应能查找历史节点"
    echo "   - 视图切换按钮应能切换不同视图"
    echo "   - AI聊天按钮(右下角)应能打开聊天面板"
else
    echo -e "${RED}❌ 发现问题需要修复${NC}"
    echo ""
    echo "🔧 修复建议:"
    if [ $FAIL -gt 0 ]; then
        echo "- 运行: npm install (安装依赖)"
        echo "- 检查: 缺失的文件"
    fi
fi

echo ""
echo "📝 测试URL:"
echo "   主应用: http://localhost:8203/index.html"
echo "   诊断页: http://localhost:8203/test.html"

exit $FAIL
