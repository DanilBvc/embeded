import { Utils } from './utils.js';

export class Tracker {
  constructor(sessionManager, config) {
    this.session = sessionManager;
    this.config = config;
    this.startTime = null;
  }
  
  startTracking() {
    this.setupEventListeners();
    this.startTrackingTime();
  }
  
  setupEventListeners() {
    document.addEventListener('click', (e) => {
      this.session.sessionData.behaviorData.clicks++;
      this.session.recordInteraction('click', {
        x: e.clientX,
        y: e.clientY,
        target: e.target.tagName,
        timestamp: new Date().toISOString()
      });
    });
    
    let lastMoveTime = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMoveTime > 100) { 
        lastMoveTime = now;
        this.session.sessionData.behaviorData.mouseMoves++;
      }
    });
    
    let lastScrollTime = 0;
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScrollTime > 100) {
        lastScrollTime = now;
        this.session.sessionData.behaviorData.scrolls++;
        this.session.recordInteraction('scroll', {
          scrollY: window.scrollY,
          maxScroll: Utils.getScrollPercentage(),
          timestamp: new Date().toISOString()
        });
      }
    });
  }
  
  startTrackingTime() {
    this.startTime = Date.now();
    setInterval(() => {
      this.session.sessionData.behaviorData.timeOnPage = 
        Math.floor((Date.now() - this.startTime) / 1000);
    }, 1000);
  }
} 