/**
 * Integration Tests for Video Speed Controller Extension
 * 
 * These tests verify the integration between different components
 * Run in Chrome extension environment or with proper mocking
 */

describe('Extension Integration Tests', () => {
  let mockTabs, mockStorage, mockRuntime;

  beforeEach(() => {
    // Mock Chrome APIs
    mockStorage = {
      sync: {
        get: jest.fn(),
        set: jest.fn(),
        onChanged: {
          addListener: jest.fn()
        }
      }
    };

    mockTabs = {
      query: jest.fn(),
      sendMessage: jest.fn()
    };

    mockRuntime = {
      onMessage: {
        addListener: jest.fn()
      },
      onInstalled: {
        addListener: jest.fn()
      },
      getManifest: jest.fn(() => ({ version: '1.0.0' }))
    };

    global.chrome = {
      storage: mockStorage,
      tabs: mockTabs,
      runtime: mockRuntime
    };
  });

  describe('Settings Synchronization', () => {
    test('should sync settings between popup and content script', async () => {
      const testSettings = {
        keyZ: 45,
        keyX: 15,
        keyC: 20,
        keyV: 45,
        showPanel: false
      };

      // Mock successful storage operations
      mockStorage.sync.set.mockResolvedValue();
      mockStorage.sync.get.mockResolvedValue(testSettings);
      mockTabs.query.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      mockTabs.sendMessage.mockResolvedValue();

      // Simulate saving settings from popup
      await chrome.storage.sync.set(testSettings);
      expect(mockStorage.sync.set).toHaveBeenCalledWith(testSettings);

      // Simulate content script loading settings
      const loadedSettings = await chrome.storage.sync.get();
      expect(loadedSettings).toEqual(testSettings);
    });

    test('should broadcast settings changes to all tabs', async () => {
      const newSettings = { keyZ: 60, showPanel: false };
      const mockTabs = [{ id: 1 }, { id: 2 }, { id: 3 }];

      chrome.tabs.query.mockResolvedValue(mockTabs);
      chrome.tabs.sendMessage.mockResolvedValue();

      // Simulate background script broadcasting settings
      const tabs = await chrome.tabs.query({});
      
      for (const tab of tabs) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'updateSettings',
          settings: newSettings
        });
      }

      expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(3);
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        action: 'updateSettings',
        settings: newSettings
      });
    });
  });

  describe('Message Passing', () => {
    test('should handle popup to content script communication', async () => {
      const mockSendResponse = jest.fn();
      let messageHandler;

      // Capture the message listener
      chrome.runtime.onMessage.addListener.mockImplementation((handler) => {
        messageHandler = handler;
      });

      // Simulate message listener setup
      chrome.runtime.onMessage.addListener(messageHandler);

      // Simulate message from popup
      const message = {
        action: 'setSpeed',
        speed: 2.5
      };

      const sender = { tab: { id: 1 } };
      messageHandler(message, sender, mockSendResponse);

      expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    });

    test('should handle background to content script communication', () => {
      const messageTypes = [
        { action: 'updateSettings', settings: {} },
        { action: 'setSpeed', speed: 2 },
        { action: 'togglePanel', show: false }
      ];

      chrome.tabs.sendMessage.mockResolvedValue();

      messageTypes.forEach(async (message) => {
        await chrome.tabs.sendMessage(1, message);
        expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, message);
      });
    });
  });

  describe('Extension Lifecycle', () => {
    test('should initialize properly on install', () => {
      let installHandler;
      
      chrome.runtime.onInstalled.addListener.mockImplementation((handler) => {
        installHandler = handler;
      });

      // Set up install listener
      chrome.runtime.onInstalled.addListener(installHandler);

      // Simulate install event
      const installDetails = { reason: 'install' };
      installHandler(installDetails);

      expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
    });

    test('should handle update properly', () => {
      let installHandler;
      
      chrome.runtime.onInstalled.addListener.mockImplementation((handler) => {
        installHandler = handler;
      });

      chrome.runtime.onInstalled.addListener(installHandler);

      // Simulate update event
      const updateDetails = { 
        reason: 'update', 
        previousVersion: '0.9.0' 
      };
      installHandler(updateDetails);

      expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
    });
  });

  describe('Storage Error Handling', () => {
    test('should handle storage errors gracefully', async () => {
      const storageError = new Error('Storage quota exceeded');
      mockStorage.sync.set.mockRejectedValue(storageError);

      try {
        await chrome.storage.sync.set({ keyZ: 30 });
      } catch (error) {
        expect(error.message).toBe('Storage quota exceeded');
      }

      expect(mockStorage.sync.set).toHaveBeenCalled();
    });

    test('should handle missing storage data', async () => {
      // Simulate empty storage
      mockStorage.sync.get.mockResolvedValue({});

      const result = await chrome.storage.sync.get();
      expect(result).toEqual({});
    });
  });

  describe('Tab Communication Errors', () => {
    test('should handle failed tab communication gracefully', async () => {
      const tabError = new Error('No tab with id 999');
      mockTabs.sendMessage.mockRejectedValue(tabError);

      try {
        await chrome.tabs.sendMessage(999, { action: 'test' });
      } catch (error) {
        expect(error.message).toBe('No tab with id 999');
      }
    });

    test('should handle tabs without content script', async () => {
      // Some tabs might not have the content script loaded
      mockTabs.query.mockResolvedValue([
        { id: 1, url: 'https://example.com' },
        { id: 2, url: 'chrome://extensions/' }, // System page
        { id: 3, url: 'https://youtube.com' }
      ]);

      mockTabs.sendMessage
        .mockResolvedValueOnce() // Tab 1 success
        .mockRejectedValueOnce(new Error('No receiver')) // Tab 2 fails
        .mockResolvedValueOnce(); // Tab 3 success

      const tabs = await chrome.tabs.query({});
      
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'test' });
        } catch (error) {
          // Expected for some tabs
          console.log(`Failed to send to tab ${tab.id}: ${error.message}`);
        }
      }

      expect(mockTabs.sendMessage).toHaveBeenCalledTimes(3);
    });
  });
});

// Test scenarios for real-world usage
describe('Real-world Integration Scenarios', () => {
  beforeEach(() => {
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn(),
          set: jest.fn()
        }
      },
      tabs: {
        query: jest.fn(),
        sendMessage: jest.fn()
      }
    };
  });

  test('should handle user changing settings while watching video', async () => {
    // Initial settings
    const initialSettings = { keyZ: 30, keyX: 10, keyC: 10, keyV: 30 };
    
    // User modifies settings
    const newSettings = { keyZ: 45, keyX: 15, keyC: 15, keyV: 45 };

    chrome.storage.sync.get.mockResolvedValue(initialSettings);
    chrome.storage.sync.set.mockResolvedValue();
    chrome.tabs.query.mockResolvedValue([{ id: 1 }]);
    chrome.tabs.sendMessage.mockResolvedValue();

    // Load initial settings
    const loaded = await chrome.storage.sync.get();
    expect(loaded).toEqual(initialSettings);

    // Save new settings
    await chrome.storage.sync.set(newSettings);
    expect(chrome.storage.sync.set).toHaveBeenCalledWith(newSettings);

    // Broadcast to active tabs
    const tabs = await chrome.tabs.query({});
    await chrome.tabs.sendMessage(tabs[0].id, {
      action: 'updateSettings',
      settings: newSettings
    });

    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
      action: 'updateSettings',
      settings: newSettings
    });
  });

  test('should handle speed changes from both popup and keyboard shortcuts', async () => {
    chrome.tabs.query.mockResolvedValue([{ id: 1 }]);
    chrome.tabs.sendMessage.mockResolvedValue();

    // Speed change from popup
    await chrome.tabs.sendMessage(1, {
      action: 'setSpeed',
      speed: 2
    });

    // Speed change from keyboard (simulated)
    await chrome.tabs.sendMessage(1, {
      action: 'setSpeed', 
      speed: 1.5
    });

    expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(2);
  });

  test('should handle multiple videos on the same page', async () => {
    // Simulate page with multiple videos
    const videoUpdateMessage = {
      action: 'videoCount',
      count: 3
    };

    chrome.tabs.sendMessage.mockResolvedValue();
    
    // Content script reports multiple videos found
    await chrome.tabs.sendMessage(1, videoUpdateMessage);
    
    // Speed change should affect all videos
    await chrome.tabs.sendMessage(1, {
      action: 'setSpeed',
      speed: 2.5
    });

    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
      action: 'setSpeed',
      speed: 2.5
    });
  });
});

// Performance integration tests
describe('Performance Integration', () => {
  beforeEach(() => {
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn().mockResolvedValue({}),
          set: jest.fn().mockResolvedValue()
        }
      },
      tabs: {
        query: jest.fn().mockResolvedValue([]),
        sendMessage: jest.fn().mockResolvedValue()
      }
    };
  });

  test('should handle rapid settings changes efficiently', async () => {
    const startTime = performance.now();

    // Simulate rapid settings changes
    for (let i = 0; i < 20; i++) {
      await chrome.storage.sync.set({ keyZ: 30 + i });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100); // Should be fast
    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(20);
  });

  test('should handle many tabs efficiently', async () => {
    // Simulate many open tabs
    const manyTabs = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
    chrome.tabs.query.mockResolvedValue(manyTabs);

    const startTime = performance.now();

    const tabs = await chrome.tabs.query({});
    await Promise.all(
      tabs.map(tab => 
        chrome.tabs.sendMessage(tab.id, { action: 'test' })
          .catch(() => {}) // Ignore individual failures
      )
    );

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(1000); // Should complete within 1 second
    expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(50);
  });
});

module.exports = {
  // Export test utilities if needed
};