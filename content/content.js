class VideoController {
  constructor() {
    this.videos = new Set();
    this.settings = {
      keyZ: 30,
      keyX: 10, 
      keyC: 10,
      keyV: 30
    };
    this.i18nMessages = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadI18nMessages();
    this.observeVideos();
    this.setupKeyboardListeners();
    this.setupStorageListener();
    this.startVideoDetection();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(this.settings);
      this.settings = { ...this.settings, ...result };
    } catch (error) {
      console.log('Using default settings');
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set(this.settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  async loadI18nMessages() {
    try {
      // Try to get localized messages
      this.i18nMessages = {
        speedControl: chrome.i18n?.getMessage('speedControl') || '速度控制'
      };
    } catch (error) {
      // Fallback to Chinese if i18n is not available
      this.i18nMessages = {
        speedControl: '速度控制'
      };
    }
  }

  getMessage(key, defaultValue = '') {
    return this.i18nMessages[key] || defaultValue;
  }

  setupStorageListener() {
    // Listen for settings changes
    if (chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
          // Update settings when they change
          Object.keys(changes).forEach(key => {
            if (this.settings.hasOwnProperty(key)) {
              this.settings[key] = changes[key].newValue;
              console.log(`VideoSpeedControl: Setting ${key} updated to ${changes[key].newValue}`);
            }
          });
        }
      });
    }
  }

  observeVideos() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'VIDEO') {
              this.addVideo(node);
            }
            const videos = node.querySelectorAll?.('video');
            videos?.forEach(video => this.addVideo(video));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  addVideo(video) {
    if (this.videos.has(video)) return;
    
    this.videos.add(video);
    
    video.addEventListener('emptied', () => {
      this.videos.delete(video);
    });
  }

  startVideoDetection() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => this.addVideo(video));
  }

  setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      if (this.videos.size === 0) return;

      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          this.seekVideos(-this.settings.keyZ);
          this.showFeedback(`-${this.settings.keyZ}s`);
          break;
        case 'x':
          e.preventDefault();
          this.seekVideos(-this.settings.keyX);
          this.showFeedback(`-${this.settings.keyX}s`);
          break;
        case 'c':
          e.preventDefault();
          this.seekVideos(this.settings.keyC);
          this.showFeedback(`+${this.settings.keyC}s`);
          break;
        case 'v':
          e.preventDefault();
          this.seekVideos(this.settings.keyV);
          this.showFeedback(`+${this.settings.keyV}s`);
          break;
      }
    });
  }

  seekVideos(seconds) {
    this.videos.forEach(video => {
      if (video.duration && !isNaN(video.duration)) {
        const newTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
        video.currentTime = newTime;
      }
    });
  }

  setPlaybackSpeed(speed) {
    console.log('VideoSpeedControl: Setting playback speed to', speed, 'for', this.videos.size, 'videos');
    
    if (this.videos.size === 0) {
      console.warn('VideoSpeedControl: No videos found to set speed');
      this.showFeedback('没有找到视频元素');
      return false;
    }
    
    let successCount = 0;
    this.videos.forEach(video => {
      if (video && video.readyState >= 1) {
        video.playbackRate = speed;
        successCount++;
        console.log('VideoSpeedControl: Set speed for video:', video, 'readyState:', video.readyState);
      }
    });
    
    if (successCount > 0) {
      this.showFeedback(`${speed}x (${successCount}个视频)`);
      return true;
    } else {
      this.showFeedback(`无法设置速度 - 检查视频状态`);
      return false;
    }
  }

  showFeedback(text, duration = 1000) {
    let feedback = document.getElementById('vsc-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'vsc-feedback';
      feedback.className = 'vsc-feedback';
      
      // Add inline styles for feedback
      feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        z-index: 1000000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      
      document.body.appendChild(feedback);
    }
    
    feedback.textContent = text;
    feedback.style.opacity = '1';
    
    setTimeout(() => {
      feedback.style.opacity = '0';
    }, duration);
  }
}

// Message handling for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'setSpeed') {
      const controller = window.videoController;
      if (controller) {
        const result = controller.setPlaybackSpeed(request.speed);
        sendResponse({ success: result, videosFound: controller.videos.size });
      } else {
        sendResponse({ success: false, error: 'Controller not initialized' });
      }
    } else if (request.action === 'updateSettings') {
      const controller = window.videoController;
      if (controller && request.settings) {
        // Update controller settings
        controller.settings = { ...controller.settings, ...request.settings };
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Controller not available or no settings provided' });
      }
    } else {
      sendResponse({ success: false, error: 'Unknown action: ' + request.action });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
  return true;
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.videoController = new VideoController();
  });
} else {
  window.videoController = new VideoController();
}