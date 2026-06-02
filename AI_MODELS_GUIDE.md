# 🤖 AI模型接入指南

## 📋 支持的模型

### OpenAI 模型

#### GPT-5.2 Turbo ⚡
```
模型ID: gpt-5.2-turbo
特点: 快速响应，强大推理
上下文: 128K tokens
价格: $0.015/$0.06 per 1K tokens
适用: 快速对话、日常任务
```

#### GPT-5.2 🧠
```
模型ID: gpt-5.2
特点: 深度推理，超大上下文
上下文: 256K tokens
价格: $0.03/$0.12 per 1K tokens
适用: 复杂分析、深度思考
```

#### O3 Mini 💎
```
模型ID: o3-mini
特点: 高效推理，性价比高
上下文: 64K tokens
价格: $0.005/$0.015 per 1K tokens
适用: 成本敏感场景
```

---

### Google 模型

#### Gemini 3.0 Pro 💎
```
模型ID: gemini-3.0-pro
特点: 多模态，快速响应
上下文: 128K tokens
价格: $0.01/$0.03 per 1K tokens
适用: 多模态任务
```

#### Gemini 3.0 Ultra 🌟
```
模型ID: gemini-3.0-ultra
特点: 深度理解，超大上下文
上下文: 256K tokens
价格: $0.02/$0.06 per 1K tokens
适用: 复杂推理
```

---

### Anthropic 模型

#### Claude 3.5 Sonnet 🎭
```
模型ID: claude-3.5-sonnet
特点: 深度分析，哲学思辨
上下文: 200K tokens
价格: $0.003/$0.015 per 1K tokens
适用: 哲学思辨、深度分析
```

#### Claude 3.7 Opus 👑
```
模型ID: claude-3.7-opus
特点: 极致推理，创意写作
上下文: 200K tokens
价格: $0.015/$0.075 per 1K tokens
适用: 最强推理能力
```

---

### 智谱AI 模型

#### GLM-5 Plus 🇨🇳
```
模型ID: glm-5-plus
特点: 中文优化，多模态
上下文: 128K tokens
价格: $0.01/$0.01 per 1K tokens
适用: 中文任务
```

---

### 本地模型

#### DeepSeek V3 🏠
```
模型ID: deepseek-v3
特点: 免费，隐私保护
上下文: 64K tokens
价格: 免费
适用: 本地部署
```

#### Qwen 2.5 72B 🏠
```
模型ID: qwen-2.5-72b
特点: 开源，多语言
上下文: 32K tokens
价格: 免费
适用: 本地部署
```

---

## 🔑 API密钥配置

### 1. OpenAI

**获取密钥**:
1. 访问 https://platform.openai.com/api-keys
2. 创建新的API密钥
3. 复制密钥

**配置**:
```
在应用中点击 "⚙️ API配置"
输入 OpenAI API Key
点击保存
```

**密钥格式**: `sk-proj-...`

---

### 2. Google (Gemini)

**获取密钥**:
1. 访问 https://makersuite.google.com/app/apikey
2. 创建API密钥
3. 复制密钥

**配置**:
```
输入 Google API Key
点击保存
```

**密钥格式**: `AIza...`

---

### 3. Anthropic (Claude)

**获取密钥**:
1. 访问 https://console.anthropic.com/
2. 创建API密钥
3. 复制密钥

**配置**:
```
输入 Anthropic API Key
点击保存
```

**密钥格式**: `sk-ant-...`

---

### 4. 智谱AI

**获取密钥**:
1. 访问 https://open.bigmodel.cn/
2. 创建API密钥
3. 复制密钥

**配置**:
```
输入 智谱AI API Key
点击保存
```

---

## 💡 使用建议

### 按场景选择模型

**哲学思辨**:
- 推荐: Claude 3.5 Sonnet
- 备选: Claude 3.7 Opus, GPT-5.2

**快速对话**:
- 推荐: GPT-5.2 Turbo
- 备选: Gemini 3.0 Pro, O3 Mini

**中文任务**:
- 推荐: GLM-5 Plus
- 备选: DeepSeek V3, Qwen 2.5

**成本敏感**:
- 推荐: O3 Mini
- 备选: Claude 3.5 Sonnet, DeepSeek V3

**隐私保护**:
- 推荐: DeepSeek V3
- 备选: Qwen 2.5 72B

---

## 📊 成本对比

| 模型 | 输入价格 | 输出价格 | 适用场景 |
|------|----------|----------|----------|
| O3 Mini | $0.005 | $0.015 | 成本最优 |
| Claude 3.5 Sonnet | $0.003 | $0.015 | 性价比高 |
| GPT-5.2 Turbo | $0.015 | $0.06 | 快速响应 |
| Gemini 3.0 Pro | $0.01 | $0.03 | 平衡选择 |
| GLM-5 Plus | $0.01 | $0.01 | 中文最优 |
| DeepSeek V3 | 免费 | 免费 | 隐私保护 |

---

## 🔐 安全说明

### API密钥存储
```
✅ 密钥存储在浏览器localStorage
✅ 不会上传到服务器
✅ 仅在本地使用
⚠️ 不要在公共电脑上保存密钥
```

### 使用建议
```
1. 定期更换API密钥
2. 设置使用限额
3. 监控使用情况
4. 及时关闭不用的密钥
```

---

## 🚀 快速开始

### 1. 配置API密钥
```
点击右上角 "🤖 AI模型"
→ 点击 "⚙️ API配置"
→ 输入至少一个API密钥
→ 保存配置
```

### 2. 选择模型
```
在模型列表中选择一个可用模型
点击即可切换
```

### 3. 开始使用
```
现在可以使用AI功能了！
- 智能问答
- 哲学思辨
- 关联发现
```

---

## ❓ 常见问题

### Q: 为什么模型显示"不可用"？
```
A: 该模型的API密钥未配置
   → 点击 "⚙️ API配置"
   → 输入对应的API密钥
```

### Q: 如何查看使用情况？
```
A: 系统会自动记录使用统计
   包括调用次数、token使用、费用估算
```

### Q: 推荐哪个模型？
```
A: 
- 哲学思辨: Claude 3.5 Sonnet
- 日常使用: GPT-5.2 Turbo
- 中文任务: GLM-5 Plus
- 成本优先: O3 Mini
```

### Q: 本地模型如何使用？
```
A: 需要先在本地部署模型服务
   确保服务运行在 localhost:8000
   然后即可使用本地模型
```

---

## 📞 技术支持

```
OpenAI: https://platform.openai.com/docs
Google: https://ai.google.dev/docs
Anthropic: https://docs.anthropic.com
智谱AI: https://open.bigmodel.cn/dev/api
```

---

**版本**: v4.4  
**更新**: 2026-02-28

**接入GPT-5.2和Gemini 3.0，让历史之树更强大！** 🚀
