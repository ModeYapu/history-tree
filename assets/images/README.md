# 📸 图片资源说明

## 图片列表

历史之树支持为历史人物和事件添加图片。

### 推荐图片来源

1. **Wikimedia Commons** - 公有领域历史图片
   - https://commons.wikimedia.org/

2. **维基百科** - 历史人物画像
   - https://zh.wikipedia.org/

3. **Pixabay** - 免费图片素材
   - https://pixabay.com/

### 图片规格

- **格式**: JPG / PNG
- **推荐尺寸**: 800x600 或 4:3 比例
- **文件大小**: < 500KB
- **命名规范**: 小写字母+连字符，如 `confucius.jpg`

### 当前支持的图片

```
assets/images/
├── confucius.jpg      # 孔子
├── davinci.jpg        # 达芬奇
├── sumer.jpg          # 苏美尔文明
├── egypt.jpg          # 古埃及文明
└── ...                # 更多图片
```

### 如何添加图片

1. 将图片放入 `assets/images/` 目录
2. 在数据文件中添加 `image` 字段：

```json
{
  "name": "孔子",
  "type": "person",
  "image": "confucius.jpg",
  ...
}
```

3. 图片会自动显示在详情卡片中

### 图片版权

- 确保使用的图片是公有领域或已获得授权
- 推荐使用 100 年以上的历史图片（通常已进入公有领域）
- 注明图片来源和版权信息

### 图片优化

建议使用图片压缩工具：
- **TinyPNG** - https://tinypng.com/
- **Squoosh** - https://squoosh.app/

---

**注意**: 当前版本图片为占位符，需要用户自行添加实际图片资源。
