# 截图生成指南 / Screenshot Generation Guide

本文档说明如何为Chrome Web Store生成专业的扩展截图。

## 📸 截图规格要求

### Chrome Web Store 官方要求
| 类型 | 尺寸 | 格式 | 用途 |
|------|------|------|------|
| 小瓦片 | 640x400 | PNG/JPEG | 商店列表展示 |
| 大瓦片 | 1280x800 | PNG/JPEG | 商店详情页面 |
| 宣传横幅 | 1400x560 | PNG/JPEG | 精选扩展展示 |

### 文件要求
- 最大文件大小：2MB
- 推荐格式：PNG（更好的质量）
- 最少截图数量：1张
- 推荐截图数量：3-5张

## 🎨 可用模板

### 1. 主功能展示模板
**文件**: `screenshot-template.html`
**用途**: 展示扩展的核心功能和界面
**特点**:
- 左侧功能介绍面板
- 右侧视频控制演示
- 支持中英文切换
- 包含键盘快捷键展示

### 2. 设置界面模板
**文件**: `settings-screenshot.html`
**用途**: 展示扩展的设置界面和配置选项
**特点**:
- 模拟真实浏览器环境
- 完整的设置面板界面
- YouTube播放页面背景
- 悬浮控制面板展示

## 🛠️ 截图生成方法

### 方法一：浏览器截图（推荐）
```bash
# 1. 在浏览器中打开模板文件
open screenshot-template.html
open settings-screenshot.html

# 2. 调整浏览器窗口大小
# - 宽度: 1280px 
# - 高度: 800px
# - 缩放: 100%

# 3. 使用浏览器开发者工具
# - 按F12打开开发者工具
# - 点击"Device Toolbar"图标
# - 选择"Responsive"模式
# - 设置尺寸为1280x800

# 4. 截图
# - macOS: Cmd+Shift+4，然后选择区域
# - Windows: Win+Shift+S
# - 或使用浏览器截图功能
```

### 方法二：Puppeteer 自动截图
```javascript
const puppeteer = require('puppeteer');

async function generateScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // 设置视口大小
  await page.setViewport({ width: 1280, height: 800 });
  
  // 生成主功能截图 - 中文版
  await page.goto(`file://${__dirname}/screenshot-template.html`);
  await page.evaluate(() => switchLanguage('cn'));
  await page.screenshot({ 
    path: 'main-feature-cn.png',
    fullPage: false 
  });
  
  // 生成主功能截图 - 英文版
  await page.evaluate(() => switchLanguage('en'));
  await page.screenshot({ 
    path: 'main-feature-en.png',
    fullPage: false 
  });
  
  // 生成设置截图 - 中文版
  await page.goto(`file://${__dirname}/settings-screenshot.html`);
  await page.evaluate(() => switchLanguage('cn'));
  await page.screenshot({ 
    path: 'settings-interface-cn.png',
    fullPage: false 
  });
  
  // 生成设置截图 - 英文版
  await page.evaluate(() => switchLanguage('en'));
  await page.screenshot({ 
    path: 'settings-interface-en.png',
    fullPage: false 
  });
  
  await browser.close();
}

generateScreenshots();
```

### 方法三：在线截图工具
推荐工具：
- [Screenshot.rocks](https://screenshot.rocks/) - 专业截图工具
- [Browserframe](https://browserframe.com/) - 浏览器框架截图
- [PageSpeed Insights](https://pagespeed.web.dev/) - Google截图工具

## 📋 截图清单

### 必需截图 (3-4张)

#### 1. 主功能展示截图
- **文件名**: `01-main-features-cn.png` / `01-main-features-en.png`
- **内容**: 展示核心功能和键盘快捷键
- **模板**: `screenshot-template.html`
- **语言**: 中文/英文

#### 2. 设置界面截图
- **文件名**: `02-settings-panel-cn.png` / `02-settings-panel-en.png`
- **内容**: 展示详细的设置配置界面
- **模板**: `settings-screenshot.html`
- **语言**: 中文/英文

#### 3. 实际使用截图
- **文件名**: `03-youtube-demo-cn.png` / `03-youtube-demo-en.png`
- **内容**: 在实际视频网站上的使用效果
- **来源**: 实际浏览器截图（YouTube、Bilibili等）

### 可选截图 (1-2张)

#### 4. 多语言支持截图
- **文件名**: `04-multilingual-support.png`
- **内容**: 展示中英文界面对比
- **制作**: 拼接中英文界面截图

#### 5. 兼容性展示截图
- **文件名**: `05-compatibility-demo.png`
- **内容**: 展示在不同视频网站的兼容性
- **制作**: 多个网站界面的组合截图

## 🎯 截图最佳实践

### 视觉设计原则
1. **一致性**: 所有截图使用相同的视觉风格
2. **清晰度**: 确保文字和界面元素清晰可读
3. **重点突出**: 使用箭头、高亮等方式突出关键功能
4. **真实感**: 使用真实的使用场景和数据

### 内容组织原则
1. **功能优先**: 优先展示最重要的功能
2. **流程清晰**: 按照用户使用流程组织截图顺序
3. **场景完整**: 每张截图应该包含完整的使用场景

### 技术质量要求
1. **尺寸准确**: 严格按照1280x800像素制作
2. **色彩准确**: 确保颜色还原准确，避免偏色
3. **压缩合理**: 在保证质量的前提下控制文件大小
4. **格式统一**: 建议使用PNG格式保证质量

## 📱 不同语言版本

### 中文版截图重点
- 突出中文界面的完整性
- 展示本土化的用户体验
- 使用中文用户熟悉的视频网站（如Bilibili）

### 英文版截图重点
- 展示国际化的设计品质
- 使用英文用户熟悉的视频网站（如YouTube）
- 突出功能的通用性和专业性

## 🔧 截图后期处理

### 推荐工具
- **Photoshop**: 专业图像处理
- **Sketch**: UI设计和编辑
- **Figma**: 在线协作设计
- **GIMP**: 免费替代方案

### 处理步骤
1. **尺寸调整**: 确保精确的1280x800像素
2. **质量优化**: 调整亮度、对比度、饱和度
3. **细节修正**: 修复任何显示问题或瑕疵
4. **文件优化**: 压缩文件大小但保持质量

## 📊 截图效果验证

### 质量检查清单
- [ ] 尺寸准确（1280x800）
- [ ] 文字清晰可读
- [ ] 界面元素完整
- [ ] 颜色还原准确
- [ ] 文件大小合理（< 500KB）
- [ ] 格式正确（PNG推荐）

### A/B测试建议
- 准备2-3个不同风格的主要截图
- 在不同平台测试用户反馈
- 根据下载转化率优化截图

## 🚀 发布准备

### 文件命名规范
```
screenshots/
├── 01-main-features-cn-1280x800.png
├── 01-main-features-en-1280x800.png
├── 02-settings-panel-cn-1280x800.png
├── 02-settings-panel-en-1280x800.png
├── 03-youtube-demo-cn-1280x800.png
├── 03-youtube-demo-en-1280x800.png
└── 04-compatibility-demo-1280x800.png
```

### 上传顺序建议
1. 主功能展示截图（最重要）
2. 设置界面截图
3. 实际使用演示
4. 兼容性展示
5. 多语言对比

---

**提示**: 好的截图是扩展成功的关键因素之一。投入足够的时间制作高质量的截图，将显著提升用户的第一印象和下载意愿！📸✨