import { Utils } from './utils.js';

export class SessionManager {
  constructor() {
    this.sessionId = Utils.generateSessionId();
    this.sessionData = {
      started: new Date().toISOString(),
      pageUrl: window.location.href,
      referrer: document.referrer,
      deviceData: {},
      behaviorData: {
        clicks: 0,
        mouseMoves: 0,
        scrolls: 0,
        timeOnPage: 0
      },
      interactions: []
    };
   
    this.collectDeviceInfo();
  }
  
  collectDeviceInfo() {
    const { userAgent, language, platform } = navigator;
    const { width, height } = window.screen;
    
    console.log({
      userAgent,
      language,
      platform,
      screenWidth: width,
      screenHeight: height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      clientId: Utils.getCookie('client_id') || Utils.setCookie('client_id', this.sessionId)
    }, 'session data')

    this.sessionData.deviceData = {
      userAgent,
      language,
      platform,
      screenWidth: width,
      screenHeight: height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      clientId: Utils.getCookie('client_id') || Utils.setCookie('client_id', this.sessionId)
    };
  }
  
  recordInteraction(type, data) {
    this.sessionData.interactions.push({
      type,
      data,
      timestamp: new Date().toISOString()
    });
  }
  
  getSessionData() {
    return this.sessionData;
  }
  
  getSessionId() {
    return this.sessionId;
  }
  
  clearInteractions() {
    this.sessionData.interactions = [];
  }
} 