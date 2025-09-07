// Background service worker for Video Speed Controller extension

class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    this.setupInstallHandler();
    this.setupMessageHandlers();
    this.setupStorageSync();
  }

  setupInstallHandler() {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.setDefaultSettings();
        this.openWelcomePage();
      } else if (details.reason === 'update') {
        this.handleUpdate(details.previousVersion);
      }
    });
  }

  async setDefaultSettings() {
    const defaultSettings = {
      keyZ: 30,
      keyX: 10,
      keyC: 10,
      keyV: 30,
      language: 'auto',
      version: chrome.runtime.getManifest().version
    };

    try {
      await chrome.storage.sync.set(defaultSettings);
      console.log('Default settings initialized');
    } catch (error) {
      console.error('Failed to set default settings:', error);
    }
  }

  openWelcomePage() {
    // Optionally open a welcome/instructions page
    // chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
  }

  async handleUpdate(previousVersion) {
    try {
      const currentVersion = chrome.runtime.getManifest().version;
      console.log(`Extension updated from ${previousVersion} to ${currentVersion}`);
      
      // Handle any migration logic here
      const settings = await chrome.storage.sync.get();
      settings.version = currentVersion;
      await chrome.storage.sync.set(settings);
    } catch (error) {
      console.error('Failed to handle update:', error);
    }
  }

  setupMessageHandlers() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      try {
        switch (request.action) {
          case 'getSettings':
            this.handleGetSettings(sendResponse);
            return true; // Will respond asynchronously
            
          case 'saveSettings':
            this.handleSaveSettings(request.settings, sendResponse);
            return true;
            
          case 'resetSettings':
            this.handleResetSettings(sendResponse);
            return true;

            
          default:
            console.warn('Unknown action:', request.action);
            sendResponse({ success: false, error: 'Unknown action' });
            return false;
        }
      } catch (error) {
        console.error('Error in message handler:', error);
        sendResponse({ success: false, error: error.message });
        return false;
      }
    });
  }

  async handleGetSettings(sendResponse) {
    try {
      const settings = await chrome.storage.sync.get();
      sendResponse({ success: true, settings });
    } catch (error) {
      console.error('Failed to get settings:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleSaveSettings(settings, sendResponse) {
    try {
      await chrome.storage.sync.set(settings);
      
      // Notify all content scripts about settings update
      const tabs = await chrome.tabs.query({});
      tabs.forEach(async (tab) => {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: settings
          });
        } catch (error) {
          // Ignore errors for tabs without content script
        }
      });
      
      sendResponse({ success: true });
    } catch (error) {
      console.error('Failed to save settings:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleResetSettings(sendResponse) {
    try {
      await this.setDefaultSettings();
      const settings = await chrome.storage.sync.get();
      sendResponse({ success: true, settings });
    } catch (error) {
      console.error('Failed to reset settings:', error);
      sendResponse({ success: false, error: error.message });
    }
  }


  setupStorageSync() {
    // Listen for storage changes to keep everything in sync
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        console.log('Settings changed:', changes);
        
        // Broadcast changes to all content scripts
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              action: 'settingsChanged',
              changes: changes
            }).catch(() => {
              // Ignore errors for tabs without content script
            });
          });
        });
      }
    });
  }
}

// Initialize the background service
new BackgroundService();

// Handle extension context menu (optional future feature)
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'videoSpeedControl') {
//     // Handle context menu action
//   }
// });

// Optional: Add context menu for videos
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'videoSpeedControl',
//     title: 'Video Speed Control',
//     contexts: ['video']
//   });
// });

// Performance monitoring (optional)
chrome.runtime.onStartup.addListener(() => {
  console.log('Video Speed Controller extension started');
});

// Handle uninstall feedback (optional)
chrome.runtime.setUninstallURL('https://forms.gle/example-uninstall-feedback');