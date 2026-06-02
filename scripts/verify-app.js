/**
 * 应用验证脚本 - 检查核心功能状态
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8203;
const BASE_URL = `http://localhost:${PORT}`;

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查服务器是否运行
async function checkServer() {
    return new Promise((resolve) => {
        http.get(BASE_URL, (res) => {
            log('✅ HTTP服务器运行正常', 'green');
            resolve(true);
        }).on('error', () => {
            log('❌ HTTP服务器未运行', 'red');
            resolve(false);
        });
    });
}

// 检查关键文件
function checkFiles() {
    log('\n📁 检查关键文件...', 'blue');

    const criticalFiles = [
        'index.html',
        'src/core/App.js',
        'src/core/EventBus.js',
        'src/services/DataService.js',
        'src/views/HistoryTree3D.js',
        'src/components/AIChat.js',
        'data/historical-dataset.js',
        'css/style.css',
        'css/tree.css'
    ];

    let missingFiles = [];

    for (const file of criticalFiles) {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            log(`  ✓ ${file}`, 'green');
        } else {
            log(`  ✗ ${file} - 缺失!`, 'red');
            missingFiles.push(file);
        }
    }

    return missingFiles;
}

// 检查数据文件
function checkDataFiles() {
    log('\n📊 检查数据文件...', 'blue');

    const dataFiles = [
        'data/historical-dataset.js',
        'data/chinese-dynasties.js',
        'data/world-civilizations.js'
    ];

    for (const file of dataFiles) {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const size = (content.length / 1024).toFixed(1);
            log(`  ✓ ${file} (${size} KB)`, 'green');
        } else {
            log(`  ✗ ${file} - 缺失!`, 'red');
        }
    }
}

// 分析HTML获取依赖
function analyzeHTML() {
    log('\n🔍 分析页面依赖...', 'blue');

    const htmlPath = path.join(__dirname, '..', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');

    // 提取script标签
    const scriptMatches = html.match(/<script[^>]+src="([^"]+)"/g) || [];
    const cssMatches = html.match(/<link[^>]+href="([^"]+\.css)"/g) || [];

    log(`  找到 ${scriptMatches.length} 个JS文件`, 'yellow');
    log(`  找到 ${cssMatches.length} 个CSS文件`, 'yellow');

    // 检查关键脚本
    const criticalScripts = [
        'src/core/App.js',
        'src/services/DataService.js',
        'src/views/HistoryTree3D.js',
        'src/components/AIChat.js',
        'data/historical-dataset.js'
    ];

    for (const script of criticalScripts) {
        if (html.includes(`src="${script}"`)) {
            log(`  ✓ ${script} 已引用`, 'green');
        } else {
            log(`  ✗ ${script} 未引用!`, 'red');
        }
    }
}

// 检查环境配置
function checkEnvConfig() {
    log('\n⚙️  检查环境配置...', 'blue');

    const envPath = path.join(__dirname, '..', 'mcp-server', '.env');
    const envExamplePath = path.join(__dirname, '..', 'mcp-server', '.env.example');

    if (fs.existsSync(envPath)) {
        log('  ✓ .env 文件存在', 'green');
        const env = fs.readFileSync(envPath, 'utf-8');

        // 检查API密钥配置
        if (env.includes('sk-xxxxx') || env.includes('your_api_key_here')) {
            log('  ⚠ API密钥未配置（使用占位符）', 'yellow');
        } else if (env.includes('sk-')) {
            log('  ✓ API密钥已配置', 'green');
        }
    } else {
        log('  ✗ .env 文件不存在', 'red');
        if (fs.existsSync(envExamplePath)) {
            log('    提示: 可以从 .env.example 复制配置', 'yellow');
        }
    }
}

// 生成诊断报告
async function generateReport() {
    log('\n📋 诊断报告', 'blue');
    log('=====================================', 'blue');

    const serverRunning = await checkServer();
    const missingFiles = checkFiles();
    checkDataFiles();
    analyzeHTML();
    checkEnvConfig();

    log('\n=====================================', 'blue');
    log('📊 总结:', 'blue');

    if (serverRunning && missingFiles.length === 0) {
        log('✅ 核心文件完整，服务器运行正常', 'green');
        log('\n建议检查事项:', 'yellow');
        log('1. 打开浏览器访问 http://localhost:8203', 'yellow');
        log('2. 检查浏览器控制台是否有JavaScript错误', 'yellow');
        log('3. 验证3D树形视图是否正常显示', 'yellow');
        log('4. 测试搜索和筛选功能', 'yellow');
        log('5. 检查AI聊天功能是否可用', 'yellow');
    } else {
        log('❌ 发现以下问题需要修复:', 'red');

        if (!serverRunning) {
            log('- HTTP服务器未运行，执行: python3 -m http.server 8203', 'red');
        }

        if (missingFiles.length > 0) {
            log('- 缺失关键文件:', 'red');
            missingFiles.forEach(file => log(`  • ${file}`, 'red'));
        }
    }

    log('\n如需进一步调试，请检查浏览器开发者工具的控制台输出', 'yellow');
}

// 运行诊断
generateReport().catch(console.error);
