export class SocketManager {
  constructor(serverUrl, sessionManager, tracker, uiManager) {
    this.serverUrl = serverUrl;
    this.session = sessionManager;
    this.tracker = tracker;
    this.uiManager = uiManager;
    this.socket = null;
    
    this.initialize();
  }
  
  initialize() {
    this.socket = io(this.serverUrl);
    window.socket = this.socket;
    
    this.uiManager.setSocket(this.socket);
    
    this.setupSocketEvents();
    this.setupDataTracking();
    this.setupPageUnload();
  }
  
  setupSocketEvents() {
    this.socket.on('connect', () => {
      console.log('Behavioral widget connected to server');
      this.socket.emit('session_start', { 
        sessionId: this.session.getSessionId(),
        initialData: this.session.getSessionData()
      });
    });
    
    this.socket.on('show_element', (data) => {
      this.uiManager.renderUIElement(data);
    });
  }
  
  setupDataTracking() {
    setInterval(() => {
      if (this.socket.connected) {
        this.socket.emit('update_session', { 
          sessionId: this.session.getSessionId(),
          behaviorData: this.session.getSessionData().behaviorData,
          lastInteractions: this.session.getSessionData().interactions.slice(-5)
        });
        this.session.clearInteractions();
      }
    }, 5000); 
  }
  
  setupPageUnload() {
    window.addEventListener('beforeunload', () => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('session_end', { 
          sessionId: this.session.getSessionId(),
          duration: this.session.getSessionData().behaviorData.timeOnPage
        });
      }
    });
  }
} 