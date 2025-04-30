(function() {
    const BehavioralWidget = {
      init: async function() {
        const config = {
          serverUrl: 'http://localhost:8080',
          trackingInterval: 5000 
        };
        
        try {
          const { DependencyLoader } = await import('./modules/dependencies.js');
          await DependencyLoader.loadAll();
          
          const { SessionManager } = await import('./modules/session.js');
          const { Tracker } = await import('./modules/tracking.js');
          const { UIManager } = await import('./modules/ui.js');
          const { SocketManager } = await import('./modules/socket.js');
          const { StyleManager } = await import('./modules/styles.js');
          
          const session = new SessionManager();
          const tracker = new Tracker(session, config);
          const ui = new UIManager(session);
          const socket = new SocketManager(config.serverUrl, session, tracker, ui);
          
          StyleManager.addStyles();
          
          tracker.startTracking();
          
          console.log('Behavioral widget initialized successfully');
        } catch (error) {
          console.error('Failed to initialize behavioral widget:', error);
        }
      }
    };
    
    if (document.readyState === 'complete') {
      BehavioralWidget.init();
    } else {
      window.addEventListener('load', BehavioralWidget.init);
    }
  })();