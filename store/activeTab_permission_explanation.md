# activeTab权限使用说明

## 中文版本 (提交时使用)

**需请求activeTab的理由：**

本扩展需要activeTab权限来实现以下核心功能：

1. **检测视频元素**
   - 在用户当前浏览的标签页中识别HTML5视频元素（<video>标签）
   - 自动发现页面中动态加载的视频内容
   - 支持各种视频网站的不同视频播放器结构

2. **应用播放速度控制**
   - 当用户通过扩展弹窗选择播放速度时，将速度设置（1x、1.5x、2x、2.5x、3x）应用到当前标签页的视频
   - 确保速度调整能够实时生效，无需刷新页面
   - 支持页面中存在多个视频时的批量速度控制

3. **响应键盘快捷键**
   - 监听用户按下的Z、X、C、V键盘快捷键
   - 根据用户设置的时间间隔执行视频的快进和快退操作
   - 防止快捷键与页面输入框冲突（当焦点在输入框时不响应）

4. **提供视觉反馈**
   - 在用户操作后显示临时的状态提示（如"2x"、"+10s"等）
   - 确保用户清楚了解当前的操作结果
   - 提示信息以非侵入式方式显示在页面中央

该权限仅在以下情况下激活：
- 用户主动点击扩展图标
- 用户按下键盘快捷键
- 用户在扩展弹窗中调整设置

该权限不会：
- 读取页面的文本内容或用户输入
- 访问用户的个人信息或表单数据
- 在后台监控用户的浏览行为
- 修改页面除视频控制外的任何内容

---

## English Version (备用)

**Why do you need the "activeTab" permission:**

This extension requires activeTab permission to enable the following core functionalities:

1. **Detect Video Elements**
   - Identify HTML5 video elements (<video> tags) in the user's currently active tab
   - Automatically discover dynamically loaded video content on the page
   - Support different video player structures across various video websites

2. **Apply Playback Speed Control**
   - When users select playback speed through the extension popup, apply speed settings (1x, 1.5x, 2x, 2.5x, 3x) to videos in the current tab
   - Ensure speed adjustments take effect immediately without page refresh
   - Support batch speed control when multiple videos exist on the page

3. **Respond to Keyboard Shortcuts**
   - Listen for user-pressed Z, X, C, V keyboard shortcuts
   - Execute video skip forward/backward operations based on user-configured time intervals
   - Prevent shortcut conflicts with page input fields (no response when focus is in input boxes)

4. **Provide Visual Feedback**
   - Display temporary status notifications after user operations (such as "2x", "+10s", etc.)
   - Ensure users clearly understand the result of their current operation
   - Show feedback messages in a non-intrusive way at the center of the page

This permission is only activated when:
- User actively clicks the extension icon
- User presses keyboard shortcuts
- User adjusts settings in the extension popup

This permission will NOT:
- Read page text content or user input
- Access user personal information or form data
- Monitor user browsing behavior in the background
- Modify any page content other than video controls