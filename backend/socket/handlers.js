const config = require('../config');
const sessionController = require('../controllers/sessionController');
const ruleService = require('../services/ruleService');

function setupSocketHandlers(io) {
  ruleService.setupPeriodicChecks(io);
  
  io.on('connection', (socket) => {
    console.log('Client connected');
    let currentSessionId = null;
    
    socket.on('session_start', ({ sessionId, initialData }) => {
      console.log('Session started:', sessionId);
      currentSessionId = sessionId;
      
      sessionController.createSession(sessionId, socket.id, initialData);
      ruleService.checkRules(io, sessionId);
    });
    
    socket.on('update_session', ({ sessionId, behaviorData, lastInteractions }) => {
      sessionController.updateSession(sessionId, behaviorData, lastInteractions);
      ruleService.checkRules(io, sessionId);
    });
    
    socket.on('session_end', ({ sessionId, duration }) => {
      const session = sessionController.getSession(sessionId);
      if (session) {
        console.log(`Session ${sessionId} ended after ${duration} seconds`);
        sessionController.endSession(sessionId);
      }
    });
    
    socket.on('element_shown', ({ sessionId, elementId }) => {
      sessionController.markElementShown(sessionId, elementId);
    });
    
    socket.on('form_submit', ({ sessionId, formId, data }) => {
      console.log(`Form ${formId} submitted for session ${sessionId}:`, data);
      
      const session = sessionController.addFormSubmission(sessionId, formId, data);
      if (session) {
        socket.emit('form_received', { success: true, formId });
      }
    });
    
    socket.on('form_canceled', ({ sessionId, formId }) => {
      console.log(`Form ${formId} canceled for session ${sessionId}`);
    });
    
    socket.on('notification_closed', ({ sessionId, notificationId, autoClose }) => {
      console.log(`Notification ${notificationId} closed for session ${sessionId}`);
    });
    
    socket.on('banner_closed', ({ sessionId, bannerId }) => {
      console.log(`Banner ${bannerId} closed for session ${sessionId}`);
    });
    
    socket.on('banner_action', ({ sessionId, bannerId, action }) => {
      console.log(`Banner ${bannerId} action "${action}" for session ${sessionId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      
      if (currentSessionId) {
        const session = sessionController.markDisconnected(currentSessionId);
        
        if (session) {
          setTimeout(() => {
            const currentSession = sessionController.getSession(currentSessionId);
            if (currentSession && currentSession.disconnectedAt) {
              sessionController.endSession(currentSessionId);
            }
          }, config.SESSION_CLEANUP_TIMEOUT);
        }
      }
    });
  });
}

module.exports = setupSocketHandlers; 