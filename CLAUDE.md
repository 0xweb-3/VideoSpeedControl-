# VideoSpeedControl Chrome Extension
# 视频速度控制 Chrome扩展

## Project Overview
A Chrome browser extension that provides advanced video speed control with customizable keyboard shortcuts and precise playback management.

## Core Features
- **Keyboard Shortcuts**: 
  - Z: Rewind 30s (customizable)
  - X: Rewind 10s (customizable) 
  - C: Forward 10s (customizable)
  - V: Forward 30s (customizable)
- **Speed Control**: 1x, 1.5x, 2x, 2.5x, 3x playback speeds
- **Floating Control Panel**: Draggable overlay with speed controls
- **Settings**: Customizable time intervals and shortcuts
- **Internationalization**: Auto-detect browser language (EN/CN)

## Development Commands

### Testing

#### Manual Testing
```bash
# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select project directory
# 4. Open tests/manual/test-page.html for comprehensive testing
# 5. Test on video sites like YouTube, Bilibili, etc.

# Quick test commands
open tests/manual/test-page.html          # Open test page in browser
open chrome://extensions/                 # Open Chrome extensions page
```

#### Unit Testing
```bash
# Run unit tests (requires Jest or similar test runner)
# Tests are located in tests/unit/
# To run tests in browser:
# 1. Open browser developer console
# 2. Load test files from tests/unit/
# 3. Run test suites

# Example test execution
node tests/unit/content-script.test.js     # If using Node.js environment
```

#### Integration Testing
```bash
# Integration tests verify component interaction
# Located in tests/integration/
# Run in Chrome extension environment

# Test extension messaging
# Test settings synchronization  
# Test cross-tab functionality
```

### Linting & Code Quality
```bash
# No specific build process needed - direct Chrome extension loading
# Validate manifest.json syntax
cat manifest.json | python -m json.tool > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Validate JavaScript syntax
node -c content/content.js && echo "Content script: OK" || echo "Content script: Error"
node -c popup/popup.js && echo "Popup script: OK" || echo "Popup script: Error"  
node -c background/background.js && echo "Background script: OK" || echo "Background script: Error"

# Check HTML validation
html5validator popup/popup.html           # If html5validator is installed
```

### File Structure
```
video-speed-control/
├── manifest.json              # Extension configuration
├── popup/                     # Extension popup
│   ├── popup.html            # Settings interface
│   ├── popup.js              # Popup functionality
│   └── popup.css             # Popup styling
├── content/                   # Content scripts
│   └── content.js            # Main extension logic
├── background/               # Service worker
│   └── background.js         # Background processes
├── assets/                   # Icons, images, styles
│   ├── icons/                # Extension icons
│   └── styles/               # CSS files
├── _locales/                 # Internationalization
│   ├── en/messages.json      # English translations
│   └── zh_CN/messages.json   # Chinese translations
├── tests/                    # Test files
│   ├── manual/               # Manual test pages
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── store/                    # Chrome Web Store materials
│   ├── descriptions/         # Store descriptions
│   ├── screenshots/          # App screenshots
│   └── promotional/          # Marketing images
├── docs/                     # Documentation
│   ├── README.md             # English docs
│   ├── README_CN.md          # Chinese docs
│   └── USER_GUIDE.md         # User guide
└── README.md                 # Main project README (Chinese)
```

## Development Guidelines

### Chrome Extension Best Practices
- Use Manifest V3 specifications
- Minimize permissions requested
- Handle video element detection dynamically
- Ensure keyboard shortcut conflicts are avoided
- Test across multiple video platforms

### Code Style
- Use ES6+ modern JavaScript
- Implement error handling for all video operations
- Use Chrome Extension APIs properly (storage, i18n)
- Maintain responsive design for different screen sizes

### Internationalization
- All user-facing text must use Chrome i18n API
- Support English and Chinese locales
- Auto-detect browser language preference
- Fallback to English if locale not supported

### Testing Checklist

#### Manual Testing Checklist
- [ ] Test on YouTube
- [ ] Test on Bilibili  
- [ ] Test on local HTML5 videos
- [ ] Test keyboard shortcuts don't conflict with page inputs
- [ ] Test floating panel drag functionality
- [ ] Test settings persistence across browser restarts
- [ ] Test language switching (EN/CN)
- [ ] Test multiple video elements on same page
- [ ] Test speed controls (1x, 1.5x, 2x, 2.5x, 3x)
- [ ] Test visual feedback for keyboard actions
- [ ] Test panel show/hide functionality
- [ ] Test settings customization (time intervals)

#### Automated Testing
- [ ] Unit tests pass for VideoController class
- [ ] Integration tests pass for Chrome APIs
- [ ] Settings synchronization tests pass
- [ ] Message passing tests pass
- [ ] Performance tests within acceptable limits

#### Compatibility Testing  
- [ ] Chrome 88+ versions
- [ ] Windows, macOS, Linux compatibility
- [ ] Different screen resolutions
- [ ] RTL language support
- [ ] High contrast mode
- [ ] Reduced motion preferences

### Chrome Web Store Preparation
- [ ] Create 128x128 icon
- [ ] Take screenshots (1280x800 or 640x400)
- [ ] Write store description (English & Chinese)
- [ ] Create promotional images
- [ ] Test on different Chrome versions

## File Locations
- Icons: `assets/icons/`
- Localization: `_locales/en/` and `_locales/zh_CN/`
- Store assets: `store/`
- Documentation: `docs/`

## Notes
- Extension works on all websites with video elements
- Settings are synced across Chrome instances
- Floating panel position is remembered per site
- Speed controls apply to all detected video elements