# Chrome Web Store 上架素材清单

## 📍 素材位置总览

### 🎨 商店图标 (Store Icons) ✅
**位置:** `assets/icons/`
- ✅ `icon128.png` - 128x128像素 (Chrome Web Store必需)
- ✅ `icon48.png` - 48x48像素
- ✅ `icon32.png` - 32x32像素
- ✅ `icon16.png` - 16x16像素

**状态:** ✅ 已准备就绪

### 📝 商店描述 (Store Descriptions) ✅
**位置:** `store/descriptions/`
- ✅ `store_description_en_updated.md` - 英文版描述 (已更新)
- ✅ `store_description_cn_updated.md` - 中文版描述 (已更新)

**状态:** ✅ 已准备就绪

### 📸 展示截图 (Screenshots) ⚠️
**位置:** `store/screenshots/`
**需要创建的截图 (1280x800 或 640x400):**

1. **主界面截图** - 显示扩展弹窗设置界面
2. **功能演示截图** - 显示视频页面上的键盘快捷键效果
3. **速度控制截图** - 显示倍速选择功能
4. **多语言截图** - 展示中英文切换功能
5. **兼容性截图** - 显示在不同视频网站的工作效果

**状态:** ⚠️ 需要手动创建

### 🎨 推广图片 (Promotional Images) ⚠️
**位置:** `store/promotional/`
**需要创建的推广图片:**

1. **Large Promo Tile (920x680)** - 大型推广瓦片
2. **Marquee Promo Tile (1400x560)** - 横幅推广瓦片  
3. **Small Promo Tile (440x280)** - 小型推广瓦片

**状态:** ⚠️ 需要设计创建

## 📋 上架信息填写指南

### 基本信息
- **扩展名称:** Video Speed Controller / 视频速度控制器
- **简短描述:** 见 `store_description_*_updated.md` 文件
- **详细描述:** 见 `store_description_*_updated.md` 文件
- **分类:** 效率工具 (Productivity)
- **语言:** 英语、中文

### 隐私信息
- **数据收集:** 无
- **主机权限用途:** 控制所有网站上的视频元素
- **权限说明:**
  - `storage`: 保存用户设置
  - `activeTab`: 与当前标签页的视频交互
  - `tabs`: 跨标签页同步设置

### 版本信息
- **当前版本:** 1.1.0 (移除悬浮窗版本)
- **ZIP文件:** `release/VideoSpeedControl_v1.1.0_no_floating_*.zip`

## 🚀 上架步骤

### 1. 准备素材 ✅ (部分完成)
- [x] 商店图标
- [x] 扩展ZIP文件  
- [x] 商店描述文本
- [ ] 展示截图 (需要创建)
- [ ] 推广图片 (需要创建)

### 2. Chrome Web Store 开发者控制台
1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
2. 上传扩展ZIP文件
3. 填写商店信息
4. 上传截图和推广图片
5. 设置隐私政策和权限说明
6. 提交审核

### 3. 审核要点
- ✅ 功能描述清晰准确
- ✅ 不收集用户数据
- ✅ 权限使用合理
- ✅ 代码质量良好
- ⚠️ 需要完整的截图展示

## 📞 技术支持信息
- **开发者支持邮箱:** (需要提供)
- **隐私政策链接:** (如需要，可创建简单页面)
- **使用条款:** (可选)

## ⚠️ 待办事项
1. **创建展示截图** (必需)
2. **设计推广图片** (建议)
3. **准备开发者账户** ($5 一次性注册费)
4. **填写完整的商店信息**
5. **提交审核**

## 📁 文件结构
```
store/
├── descriptions/
│   ├── store_description_en_updated.md    ✅
│   └── store_description_cn_updated.md    ✅
├── screenshots/                           ⚠️ 需要创建实际截图
│   ├── GENERATE_SCREENSHOTS.md
│   ├── screenshot-template.html
│   └── settings-screenshot.html
├── promotional/                           ⚠️ 需要创建推广图片
│   ├── README.md
│   └── promo-banner.html
└── CHROME_STORE_CHECKLIST.md             ✅ 本文件
```