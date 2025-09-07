# VideoSpeedControl Chrome Extension
# 智能视频控制器 Chrome扩展

A powerful Chrome browser extension that provides intelligent video playback control with customizable keyboard shortcuts and advanced speed management.

## 🚀 Features

### ⌨️ Keyboard Shortcuts
- **Z Key**: Rewind 30 seconds (default, customizable)
- **X Key**: Rewind 10 seconds (default, customizable)
- **C Key**: Forward 10 seconds (default, customizable)
- **V Key**: Forward 30 seconds (default, customizable)

### 🎛️ Speed Control
- Multiple playback speeds: 1x, 1.5x, 2x, 2.5x, 3x
- Floating control panel with drag-and-drop functionality
- Visual feedback for all actions
- Smooth speed transitions

### 🌍 Internationalization
- English interface
- Chinese (中文) interface
- Auto-detection based on browser language
- Easy language switching in settings

### ⚙️ Customization
- Adjust time intervals for each keyboard shortcut
- Show/hide floating control panel
- Persistent settings across browser sessions
- Per-website panel positioning

## 📦 Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store
2. Search for "Video Speed Controller"
3. Click "Add to Chrome"
4. Confirm the installation

### Manual Installation (Development)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension should now appear in your browser

## 🎯 Usage

### Quick Start
1. Visit any website with HTML5 videos (YouTube, Vimeo, etc.)
2. Use keyboard shortcuts to control playback:
   - **Z**: Skip back 30 seconds
   - **X**: Skip back 10 seconds  
   - **C**: Skip forward 10 seconds
   - **V**: Skip forward 30 seconds
3. Use the floating panel for speed control
4. Access settings by clicking the extension icon

### Floating Control Panel
- Automatically appears when videos are detected
- Drag to reposition anywhere on the screen
- Click speed buttons (1x, 1.5x, 2x, 2.5x, 3x) for instant speed changes
- Close button to hide panel temporarily

### Settings Configuration
- Click the extension icon in the toolbar
- Customize keyboard shortcut time intervals
- Toggle floating panel visibility
- Change interface language
- All settings are automatically saved

## 🌐 Compatibility

### Supported Websites
- YouTube
- Vimeo
- Netflix  
- Twitch
- Coursera
- Khan Academy
- Any website with HTML5 video elements

### Browser Requirements
- Chrome 88 or later
- Manifest V3 support
- JavaScript enabled

## 🔧 Development

### Project Structure
```
smart-video-controller/
├── manifest.json              # Extension configuration
├── popup/                     # Settings popup
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/                   # Content scripts
│   └── content.js
├── background/               # Service worker
│   └── background.js
├── assets/                   # Resources
│   ├── icons/
│   ├── images/
│   └── styles/
├── _locales/                 # Internationalization
│   ├── en/messages.json
│   └── zh_CN/messages.json
└── docs/                     # Documentation
```

### Building
No build process required. This is a pure JavaScript Chrome extension.

### Testing
1. Load the extension in developer mode
2. Visit various video websites
3. Test keyboard shortcuts and speed controls
4. Verify settings persistence
5. Test internationalization

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use modern ES6+ JavaScript
- Follow Chrome extension best practices
- Implement proper error handling
- Add comments for complex logic
- Maintain accessibility standards

### Internationalization
- Add new locales in `_locales/` directory
- Use `chrome.i18n.getMessage()` for all user-facing text
- Update `manifest.json` with new locales
- Test language switching functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🐛 Bug Reports

Found a bug? Please create an issue with:
- Chrome version
- Extension version  
- Steps to reproduce
- Expected vs actual behavior
- Website where issue occurred

## 💡 Feature Requests

Have an idea for improvement? We'd love to hear it!
- Create an issue describing the feature
- Explain the use case
- Include mockups if applicable

## 📊 Version History

### v1.0.0 (Current)
- Initial release
- Basic keyboard shortcuts
- Speed control panel
- Internationalization support
- Settings customization

## 🎖️ Acknowledgments

- Chrome Extension API documentation
- Open source community feedback
- Beta testers and early adopters
- Internationalization contributors

---

**Happy video watching!** 🎬✨