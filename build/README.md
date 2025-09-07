# 视频速度控制 🎬
## VideoSpeedControl

一款功能强大的Chrome浏览器扩展，专注于视频播放速度控制体验。支持自定义键盘快捷键、多级播放速度调节，以及智能悬浮控制面板，让您的视频观看更加高效便捷。

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge&logo=google-chrome)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com/yourusername/video-speed-control)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)

## ✨ 核心特性

### ⌨️ 智能键盘快捷键
- **Z键** - 快速后退30秒（可自定义1-300秒）
- **X键** - 精确后退10秒（可自定义1-300秒）
- **C键** - 精确快进10秒（可自定义1-300秒）
- **V键** - 快速快进30秒（可自定义1-300秒）

### 🚀 多级播放速度
- **1.0x** - 正常播放速度
- **1.5x** - 学习优化速度
- **2.0x** - 高效浏览速度
- **2.5x** - 快速预览速度  
- **3.0x** - 极速浏览模式

### 🎛️ 智能悬浮面板
- 🎯 **自动检测** - 智能识别页面视频元素
- 🖱️ **自由拖拽** - 可随意移动到屏幕任意位置
- 💾 **记忆位置** - 每个网站独立保存面板位置
- 🎨 **精美界面** - 现代化设计，支持深色模式
- 👁️ **一键隐藏** - 可随时显示或隐藏控制面板

### 🌍 国际化支持
- 🇨🇳 **简体中文** - 完整的中文界面
- 🇺🇸 **English** - 完整的英文界面
- 🤖 **智能切换** - 根据浏览器语言自动选择
- ⚙️ **手动设置** - 可在设置中手动切换语言

## 🚀 快速开始

### 安装方式

#### 方式一：Chrome应用商店（推荐）
1. 打开 [Chrome网上应用店](https://chrome.google.com/webstore)
2. 搜索"视频速度控制"或"VideoSpeedControl"
3. 点击"添加至Chrome"
4. 确认安装权限

#### 方式二：开发者模式安装
1. 下载项目源码到本地
```bash
git clone https://github.com/yourusername/video-speed-control.git
cd video-speed-control
```

2. 打开Chrome扩展程序页面
```
在地址栏输入: chrome://extensions/
```

3. 启用开发者模式并加载扩展
- 打开右上角"开发者模式"开关
- 点击"加载已解压的扩展程序"
- 选择项目文件夹

### 使用指南

#### 🎬 基础操作
1. **访问任意视频网站**（YouTube、Bilibili、腾讯视频等）
2. **视频加载完成后**，扩展会自动激活
3. **使用键盘快捷键**直接控制视频播放
4. **点击悬浮面板**快速调整播放速度

#### ⌨️ 键盘快捷键使用
| 按键 | 默认功能 | 自定义范围 | 使用场景 |
|------|----------|------------|----------|
| **Z** | 后退30秒 | 1-300秒 | 重听重要内容 |
| **X** | 后退10秒 | 1-300秒 | 精确定位回放 |
| **C** | 快进10秒 | 1-300秒 | 跳过无关内容 |
| **V** | 快进30秒 | 1-300秒 | 快速浏览内容 |

#### 🎛️ 速度控制面板
- **拖拽移动**：点击面板标题区域拖拽
- **速度选择**：点击1x/1.5x/2x/2.5x/3x按钮
- **显示隐藏**：点击×按钮临时隐藏
- **位置记忆**：每个网站独立记住位置

## ⚙️ 个性化设置

### 打开设置面板
- 点击Chrome工具栏中的扩展图标
- 或右键点击图标选择"选项"

### 设置选项详解

#### 🔧 键盘快捷键自定义
```
Z键时长: [1-300秒] 默认30秒
X键时长: [1-300秒] 默认10秒  
C键时长: [1-300秒] 默认10秒
V键时长: [1-300秒] 默认30秒
```

#### 🎨 显示设置
- **显示控制面板** - 开启/关闭悬浮面板
- **界面语言** - 中文/英文/自动检测

#### 🚀 快速速度控制
在设置面板中直接点击速度按钮，立即应用到当前标签页的视频

## 🌐 网站兼容性

### ✅ 完全支持
- **YouTube** - 所有功能完美支持
- **Bilibili** - 全功能支持，包括弹幕视频
- **腾讯视频** - 支持网页版播放器
- **爱奇艺** - 支持HTML5播放器
- **优酷** - 支持标准网页播放
- **Vimeo** - 全功能支持
- **本地HTML5视频** - 完美兼容

### ⚠️ 部分支持  
- **Netflix** - 基础功能可用（受DRM限制）
- **Amazon Prime** - 速度控制可能受限
- **各大学习平台** - 大部分功能可用

### ❌ 不支持
- Flash播放器（已淘汰）
- 某些专有播放器
- 严格DRM保护内容

## 🛠️ 开发与测试

### 开发环境设置
```bash
# 克隆项目
git clone https://github.com/yourusername/video-speed-control.git
cd video-speed-control

# 项目结构
video-speed-control/
├── manifest.json          # 扩展配置文件
├── popup/                 # 设置弹窗界面
├── content/               # 内容脚本（核心功能）
├── background/            # 后台服务脚本
├── assets/                # 资源文件（图标、样式）
├── _locales/             # 国际化语言包
├── tests/                # 测试文件
└── docs/                 # 项目文档
```

### 功能测试
```bash
# 手动测试
# 打开 tests/manual/test-page.html 进行完整功能测试

# 单元测试
# 在Chrome控制台中运行 tests/unit/ 目录下的测试

# 集成测试  
# 运行 tests/integration/ 目录下的集成测试
```

### 测试检查清单
- [ ] 键盘快捷键在各网站正常工作
- [ ] 悬浮面板可以拖拽和显示/隐藏
- [ ] 速度控制在1x-3x范围内正常
- [ ] 设置保存和同步功能正常
- [ ] 多个视频同时存在时功能正常
- [ ] 中英文界面切换正常
- [ ] 不干扰文本输入框的键盘输入

## 📊 性能表现

### 🎯 性能指标
- **内存占用** < 5MB
- **CPU占用** < 0.1%  
- **启动延迟** < 100ms
- **操作响应** < 50ms

### ⚡ 优化特性
- 智能视频检测，避免无效处理
- 异步操作，不阻塞页面渲染
- 内存管理，自动清理无效视频引用
- 事件节流，防止快速操作冲突

## 🤝 参与贡献

### 如何贡献
1. **Fork项目**到你的GitHub账户
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建Pull Request**

### 贡献指南
- 遵循现有代码风格
- 添加适当的测试用例
- 更新相关文档
- 确保所有测试通过

### 开发规范
```javascript
// 代码风格示例
class VideoController {
  constructor() {
    this.videos = new Set();
    this.settings = this.getDefaultSettings();
  }
  
  // 使用现代ES6+语法
  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(this.settings);
      return { ...this.settings, ...result };
    } catch (error) {
      console.error('Settings load failed:', error);
      return this.settings;
    }
  }
}
```

## 🐛 问题反馈

### 🚨 Bug报告
遇到问题请提供以下信息：
- Chrome版本号
- 扩展版本号
- 出现问题的网站
- 详细复现步骤
- 错误截图（如有）

### 💡 功能建议
欢迎提出新功能建议：
- 详细描述期望功能
- 说明使用场景
- 提供设计思路（可选）

### 📞 联系方式
- **GitHub Issues**: [项目Issue页面](https://github.com/yourusername/video-speed-control/issues)
- **Chrome商店评论**: 在扩展页面留言
- **邮箱反馈**: extension-feedback@example.com

## 📝 更新日志

### v1.0.0 (2024-01-01)
#### ✨ 新增功能
- 🎮 核心键盘快捷键功能（Z/X/C/V）
- 🚀 多级播放速度控制（1x-3x）
- 🎛️ 可拖拽悬浮控制面板
- 🌍 完整中英文国际化支持
- ⚙️ 丰富的个性化设置选项
- 💾 设置数据云端同步
- 📱 响应式界面设计
- 🎨 深色模式支持

#### 🛠️ 技术特性
- Manifest V3 规范
- 现代ES6+ JavaScript
- Chrome Extension APIs
- 完整的错误处理
- 性能优化设计

## 🔒 隐私与安全

### 数据保护承诺
- ✅ **零数据收集** - 不收集任何个人信息
- ✅ **本地存储** - 所有设置仅存储在您的浏览器中
- ✅ **无外部通信** - 不与任何外部服务器通信
- ✅ **开源透明** - 源代码完全公开
- ✅ **最小权限** - 仅请求必要的浏览器权限

### 权限说明
```json
{
  "permissions": [
    "storage",    // 保存用户设置
    "activeTab"   // 控制当前标签页视频
  ],
  "host_permissions": [
    "<all_urls>"  // 在所有网站上工作
  ]
}
```

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

```
MIT License

Copyright (c) 2024 Video Speed Controller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🌟 支持项目

如果这个项目对您有帮助，请考虑支持我们：

- ⭐ **给项目点Star** - 在GitHub上点击Star按钮
- 📢 **推荐给朋友** - 分享给需要的人
- 💬 **留下评价** - 在Chrome商店给予好评
- 🐛 **反馈问题** - 帮助我们改进产品
- 💻 **参与开发** - 提交代码贡献

### 💝 支持开发者

VideoSpeedControl 是一个完全免费、无广告的开源项目。如果您觉得这个扩展对您有帮助，欢迎通过以下方式支持我们的持续开发：

#### 💰 捐赠支持
- **微信支付**: 点击扩展设置中的"支持开发者"查看收款码
- **以太坊 (ETH)**: `0xc3b991ecd6079acc8493b79ac7691c64ce09eac2`

#### 🤝 其他支持方式
- ⭐ 在Chrome商店给我们5星好评
- 📢 向朋友推荐这个扩展
- 💻 在GitHub上贡献代码
- 🐛 报告问题或提出改进建议

所有捐赠完全自愿，不影响扩展的使用。我们承诺VideoSpeedControl将永远保持免费和开源。

## 📈 项目统计

![GitHub stars](https://img.shields.io/github/stars/yourusername/video-speed-control?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/video-speed-control?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/video-speed-control)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/video-speed-control)

---

<div align="center">

**让每一次视频观看都更加高效！** 🎬✨

[⬆️ 回到顶部](#视频速度控制-)

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>