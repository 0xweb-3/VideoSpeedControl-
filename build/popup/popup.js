class PopupController {
  constructor() {
    this.settings = {
      keyZ: 30,
      keyX: 10,
      keyC: 10,
      keyV: 30,
      language: 'auto'
    };
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.setupI18n();
    this.setupUI();
    this.bindEvents();
    this.updateHelperText();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(this.settings);
      this.settings = { ...this.settings, ...result };
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set(this.settings);
      this.showNotification(chrome.i18n.getMessage('save') || 'Settings saved!');
      
      // Send message to content scripts to update settings
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: this.settings
          }, (response) => {
            if (chrome.runtime.lastError) {
              // Silently ignore errors for tabs that don't have the content script
              console.log(`Tab ${tab.id}: ${chrome.runtime.lastError.message}`);
            }
          });
        });
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showNotification('Failed to save settings', 'error');
    }
  }

  async setupI18n() {
    // Determine the language to use
    let currentLanguage = this.settings.language;
    
    if (currentLanguage === 'auto') {
      // Use Chrome's built-in language detection
      const browserLang = chrome.i18n.getUILanguage();
      currentLanguage = browserLang.startsWith('zh') ? 'zh_CN' : 'en';
    }
    
    // Apply internationalization to all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const messageKey = element.getAttribute('data-i18n');
      // Prioritize manual messages over Chrome i18n for consistent language switching
      let message = this.getMessage(messageKey, currentLanguage);
      
      // Only use Chrome i18n as fallback if no manual message found
      if (!message) {
        message = chrome.i18n.getMessage(messageKey);
      }
      
      if (message) {
        if (element.tagName === 'INPUT' && element.type === 'button') {
          element.value = message;
        } else {
          element.textContent = message;
        }
      }
    });

    // Handle template messages with placeholders
    document.querySelectorAll('[data-i18n-template]').forEach(element => {
      const messageKey = element.getAttribute('data-i18n-template');
      const seconds = element.getAttribute('data-seconds');
      // Prioritize manual messages over Chrome i18n
      let message = this.getMessage(messageKey, currentLanguage, [seconds]);
      
      // Only use Chrome i18n as fallback if no manual message found
      if (!message) {
        message = chrome.i18n.getMessage(messageKey, [seconds]);
      }
      
      if (message) {
        element.textContent = message;
      }
    });
  }
  
  getMessage(key, language, substitutions = []) {
    // Manual message lookup for language switching
    const messages = {
      'en': {
        'extensionName': 'Video Speed Controller',
        'keyboardShortcuts': 'Keyboard Shortcuts',
        'keyZ': 'Z Key',
        'keyX': 'X Key',
        'keyC': 'C Key', 
        'keyV': 'V Key',
        'seconds': 'seconds',
        'settings': 'Settings',
        'showPanel': 'Show Control Panel',
        'language': 'Language',
        'english': 'English',
        'chinese': '中文',
        'speedControl': 'Speed Control',
        'normalSpeed': 'Normal (1x)',
        'save': 'Save',
        'supportDeveloper': '💝 Support Developer',
        'rewindSeconds': 'Rewind $1 seconds',
        'forwardSeconds': 'Forward $1 seconds'
      },
      'zh_CN': {
        'extensionName': '视频速度控制器',
        'keyboardShortcuts': '键盘快捷键',
        'keyZ': 'Z键',
        'keyX': 'X键',
        'keyC': 'C键',
        'keyV': 'V键',
        'seconds': '秒',
        'settings': '设置',
        'showPanel': '显示控制面板',
        'language': '语言',
        'english': 'English',
        'chinese': '中文',
        'speedControl': '速度控制',
        'normalSpeed': '正常 (1x)',
        'save': '保存',
        'supportDeveloper': '💝 支持开发者',
        'rewindSeconds': '后退 $1 秒',
        'forwardSeconds': '快进 $1 秒'
      }
    };
    
    const langMessages = messages[language] || messages['en'];
    let message = langMessages[key];
    
    if (message && substitutions.length > 0) {
      substitutions.forEach((sub, index) => {
        message = message.replace(`$${index + 1}`, sub);
      });
    }
    
    return message;
  }

  setupUI() {
    // Load current settings into UI
    document.getElementById('keyZ').value = this.settings.keyZ;
    document.getElementById('keyX').value = this.settings.keyX;
    document.getElementById('keyC').value = this.settings.keyC;
    document.getElementById('keyV').value = this.settings.keyV;
    document.getElementById('language').value = this.settings.language;
  }

  bindEvents() {
    // Save button
    document.getElementById('saveBtn').addEventListener('click', () => {
      this.collectSettings();
      this.saveSettings();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetToDefaults();
    });

    // Speed buttons
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const speed = parseFloat(e.target.dataset.speed);
        this.setCurrentTabSpeed(speed);
        this.updateSpeedButtons(speed);
      });
    });

    // Input change listeners for live helper text update
    ['keyZ', 'keyX', 'keyC', 'keyV'].forEach(key => {
      document.getElementById(key).addEventListener('input', () => {
        this.updateHelperText();
      });
    });


    document.getElementById('language').addEventListener('change', async (e) => {
      this.settings.language = e.target.value;
      await this.saveSettings();
      // Re-apply i18n with new language
      await this.setupI18n();
      this.updateHelperText();
    });

    // Support developer link
    document.getElementById('supportLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ 
        url: chrome.runtime.getURL('support.html')
      });
    });
  }

  collectSettings() {
    this.settings.keyZ = parseInt(document.getElementById('keyZ').value) || 30;
    this.settings.keyX = parseInt(document.getElementById('keyX').value) || 10;
    this.settings.keyC = parseInt(document.getElementById('keyC').value) || 10;
    this.settings.keyV = parseInt(document.getElementById('keyV').value) || 30;
    this.settings.language = document.getElementById('language').value;
  }

  resetToDefaults() {
    const defaults = {
      keyZ: 30,
      keyX: 10,
      keyC: 10,
      keyV: 30,
      language: 'auto'
    };
    
    this.settings = { ...defaults };
    this.setupUI();
    this.updateHelperText();
    this.saveSettings();
  }

  updateHelperText() {
    const keyZ = document.getElementById('keyZ').value || 30;
    const keyX = document.getElementById('keyX').value || 10;
    const keyC = document.getElementById('keyC').value || 10;
    const keyV = document.getElementById('keyV').value || 30;

    // Determine current language
    let currentLanguage = this.settings.language;
    if (currentLanguage === 'auto') {
      const browserLang = chrome.i18n.getUILanguage();
      currentLanguage = browserLang.startsWith('zh') ? 'zh_CN' : 'en';
    }

    const helpTexts = document.querySelectorAll('.help-text p span');
    if (helpTexts.length >= 4) {
      helpTexts[0].textContent = this.getMessage('rewindSeconds', currentLanguage, [keyZ]) || `Rewind ${keyZ} seconds`;
      helpTexts[1].textContent = this.getMessage('rewindSeconds', currentLanguage, [keyX]) || `Rewind ${keyX} seconds`;
      helpTexts[2].textContent = this.getMessage('forwardSeconds', currentLanguage, [keyC]) || `Forward ${keyC} seconds`;
      helpTexts[3].textContent = this.getMessage('forwardSeconds', currentLanguage, [keyV]) || `Forward ${keyV} seconds`;
    }
  }

  async setCurrentTabSpeed(speed) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'setSpeed',
          speed: speed
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Failed to send message:', chrome.runtime.lastError.message);
            this.showNotification('无法连接到页面，请刷新页面后重试', 'error');
          } else if (response && response.success) {
            this.showNotification(`速度设置为 ${speed}x (找到${response.videosFound || 0}个视频)`);
          } else {
            console.error('Speed setting failed:', response?.error);
            const errorMsg = response?.videosFound === 0 ? 
              '没有找到视频元素，请确保页面有视频并已加载' : 
              '设置速度失败: ' + (response?.error || '未知错误');
            this.showNotification(errorMsg, 'error');
          }
        });
      }
    } catch (error) {
      console.error('Failed to set speed:', error);
      this.showNotification('设置速度失败', 'error');
    }
  }

  updateSpeedButtons(activeSpeed) {
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.speed) === activeSpeed);
    });
  }

  showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'speedChanged') {
    const popup = new PopupController();
    popup.updateSpeedButtons(request.speed);
  }
});

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});