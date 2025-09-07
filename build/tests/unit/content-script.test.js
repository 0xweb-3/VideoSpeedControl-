/**
 * Unit Tests for Video Speed Controller Content Script
 * 
 * These tests verify the core functionality of the VideoController class
 * Run these tests in a browser environment with access to Chrome APIs
 */

// Mock Chrome APIs for testing
const mockChrome = {
  storage: {
    sync: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve())
    }
  },
  i18n: {
    getMessage: jest.fn((key, substitutions) => {
      const messages = {
        'speedControl': 'Speed Control',
        'rewindSeconds': `Rewind ${substitutions?.[0] || '30'} seconds`,
        'forwardSeconds': `Forward ${substitutions?.[0] || '30'} seconds`
      };
      return messages[key] || key;
    })
  }
};

// Mock global objects
global.chrome = mockChrome;
global.document = {
  createElement: jest.fn(() => ({
    innerHTML: '',
    style: {},
    addEventListener: jest.fn(),
    appendChild: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      toggle: jest.fn()
    }
  })),
  body: {
    appendChild: jest.fn()
  },
  head: {
    appendChild: jest.fn()
  },
  addEventListener: jest.fn(),
  querySelectorAll: jest.fn(() => [])
};

global.window = {
  innerWidth: 1920,
  innerHeight: 1080
};

// Load the VideoController class (simplified for testing)
class VideoController {
  constructor() {
    this.videos = new Set();
    this.settings = {
      keyZ: 30,
      keyX: 10,
      keyC: 10,
      keyV: 30,
      showPanel: true
    };
  }

  addVideo(video) {
    if (this.videos.has(video)) return;
    this.videos.add(video);
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
    this.videos.forEach(video => {
      video.playbackRate = speed;
    });
  }

  validateSettings(settings) {
    const validKeys = ['keyZ', 'keyX', 'keyC', 'keyV'];
    return validKeys.every(key => {
      const value = settings[key];
      return typeof value === 'number' && value >= 1 && value <= 300;
    });
  }
}

// Test Suite
describe('VideoController', () => {
  let controller;

  beforeEach(() => {
    controller = new VideoController();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize with default settings', () => {
      expect(controller.settings.keyZ).toBe(30);
      expect(controller.settings.keyX).toBe(10);
      expect(controller.settings.keyC).toBe(10);
      expect(controller.settings.keyV).toBe(30);
      expect(controller.settings.showPanel).toBe(true);
    });

    test('should initialize empty video set', () => {
      expect(controller.videos.size).toBe(0);
    });
  });

  describe('Video Management', () => {
    test('should add video to set', () => {
      const mockVideo = { currentTime: 0, duration: 100 };
      controller.addVideo(mockVideo);
      expect(controller.videos.has(mockVideo)).toBe(true);
      expect(controller.videos.size).toBe(1);
    });

    test('should not add duplicate video', () => {
      const mockVideo = { currentTime: 0, duration: 100 };
      controller.addVideo(mockVideo);
      controller.addVideo(mockVideo);
      expect(controller.videos.size).toBe(1);
    });

    test('should handle multiple videos', () => {
      const video1 = { currentTime: 0, duration: 100 };
      const video2 = { currentTime: 0, duration: 200 };
      
      controller.addVideo(video1);
      controller.addVideo(video2);
      
      expect(controller.videos.size).toBe(2);
    });
  });

  describe('Video Seeking', () => {
    test('should seek forward correctly', () => {
      const mockVideo = { currentTime: 30, duration: 100 };
      controller.addVideo(mockVideo);
      
      controller.seekVideos(10);
      expect(mockVideo.currentTime).toBe(40);
    });

    test('should seek backward correctly', () => {
      const mockVideo = { currentTime: 30, duration: 100 };
      controller.addVideo(mockVideo);
      
      controller.seekVideos(-10);
      expect(mockVideo.currentTime).toBe(20);
    });

    test('should not seek beyond video start', () => {
      const mockVideo = { currentTime: 5, duration: 100 };
      controller.addVideo(mockVideo);
      
      controller.seekVideos(-10);
      expect(mockVideo.currentTime).toBe(0);
    });

    test('should not seek beyond video end', () => {
      const mockVideo = { currentTime: 95, duration: 100 };
      controller.addVideo(mockVideo);
      
      controller.seekVideos(10);
      expect(mockVideo.currentTime).toBe(100);
    });

    test('should handle multiple videos seeking', () => {
      const video1 = { currentTime: 30, duration: 100 };
      const video2 = { currentTime: 45, duration: 200 };
      
      controller.addVideo(video1);
      controller.addVideo(video2);
      
      controller.seekVideos(10);
      
      expect(video1.currentTime).toBe(40);
      expect(video2.currentTime).toBe(55);
    });

    test('should handle invalid video duration', () => {
      const mockVideo = { currentTime: 30, duration: NaN };
      controller.addVideo(mockVideo);
      
      const originalTime = mockVideo.currentTime;
      controller.seekVideos(10);
      
      // Should not change time if duration is invalid
      expect(mockVideo.currentTime).toBe(originalTime);
    });
  });

  describe('Speed Control', () => {
    test('should set playback speed for single video', () => {
      const mockVideo = { playbackRate: 1 };
      controller.addVideo(mockVideo);
      
      controller.setPlaybackSpeed(2);
      expect(mockVideo.playbackRate).toBe(2);
    });

    test('should set playback speed for multiple videos', () => {
      const video1 = { playbackRate: 1 };
      const video2 = { playbackRate: 1 };
      
      controller.addVideo(video1);
      controller.addVideo(video2);
      
      controller.setPlaybackSpeed(1.5);
      
      expect(video1.playbackRate).toBe(1.5);
      expect(video2.playbackRate).toBe(1.5);
    });

    test('should handle extreme speed values', () => {
      const mockVideo = { playbackRate: 1 };
      controller.addVideo(mockVideo);
      
      // Test maximum speed
      controller.setPlaybackSpeed(3);
      expect(mockVideo.playbackRate).toBe(3);
      
      // Test minimum speed  
      controller.setPlaybackSpeed(0.25);
      expect(mockVideo.playbackRate).toBe(0.25);
    });
  });

  describe('Settings Validation', () => {
    test('should validate correct settings', () => {
      const validSettings = {
        keyZ: 30,
        keyX: 10,
        keyC: 15,
        keyV: 60
      };
      
      expect(controller.validateSettings(validSettings)).toBe(true);
    });

    test('should reject settings with invalid values', () => {
      const invalidSettings = {
        keyZ: 0,    // Below minimum
        keyX: 10,
        keyC: 15,
        keyV: 400   // Above maximum
      };
      
      expect(controller.validateSettings(invalidSettings)).toBe(false);
    });

    test('should reject settings with non-numeric values', () => {
      const invalidSettings = {
        keyZ: '30',  // String instead of number
        keyX: 10,
        keyC: 15,
        keyV: 30
      };
      
      expect(controller.validateSettings(invalidSettings)).toBe(false);
    });

    test('should reject settings with missing keys', () => {
      const incompleteSettings = {
        keyZ: 30,
        keyX: 10
        // Missing keyC and keyV
      };
      
      expect(controller.validateSettings(incompleteSettings)).toBe(false);
    });
  });
});

// Integration-style tests for keyboard event handling
describe('Keyboard Event Handling', () => {
  let controller;

  beforeEach(() => {
    controller = new VideoController();
  });

  test('should handle Z key for rewind', () => {
    const mockVideo = { currentTime: 60, duration: 100 };
    controller.addVideo(mockVideo);
    
    // Simulate Z key press
    controller.seekVideos(-controller.settings.keyZ);
    expect(mockVideo.currentTime).toBe(30);
  });

  test('should handle X key for rewind', () => {
    const mockVideo = { currentTime: 30, duration: 100 };
    controller.addVideo(mockVideo);
    
    // Simulate X key press
    controller.seekVideos(-controller.settings.keyX);
    expect(mockVideo.currentTime).toBe(20);
  });

  test('should handle C key for forward', () => {
    const mockVideo = { currentTime: 30, duration: 100 };
    controller.addVideo(mockVideo);
    
    // Simulate C key press
    controller.seekVideos(controller.settings.keyC);
    expect(mockVideo.currentTime).toBe(40);
  });

  test('should handle V key for forward', () => {
    const mockVideo = { currentTime: 30, duration: 100 };
    controller.addVideo(mockVideo);
    
    // Simulate V key press
    controller.seekVideos(controller.settings.keyV);
    expect(mockVideo.currentTime).toBe(60);
  });
});

// Performance Tests
describe('Performance', () => {
  let controller;

  beforeEach(() => {
    controller = new VideoController();
  });

  test('should handle large number of videos efficiently', () => {
    const startTime = performance.now();
    
    // Add 100 mock videos
    for (let i = 0; i < 100; i++) {
      const mockVideo = { currentTime: i, duration: 1000, playbackRate: 1 };
      controller.addVideo(mockVideo);
    }
    
    // Perform operations
    controller.seekVideos(10);
    controller.setPlaybackSpeed(2);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete operations in reasonable time (< 100ms)
    expect(duration).toBeLessThan(100);
    expect(controller.videos.size).toBe(100);
  });

  test('should handle rapid successive operations', () => {
    const mockVideo = { currentTime: 50, duration: 100, playbackRate: 1 };
    controller.addVideo(mockVideo);
    
    const startTime = performance.now();
    
    // Perform rapid operations
    for (let i = 0; i < 50; i++) {
      controller.seekVideos(1);
      controller.setPlaybackSpeed(1 + (i % 3) * 0.5);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete rapid operations efficiently
    expect(duration).toBeLessThan(50);
    expect(mockVideo.currentTime).toBe(100); // Should be capped at duration
  });
});

// Export for running in browser environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VideoController };
}