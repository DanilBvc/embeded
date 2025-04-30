const Session = require('../models/Session');

const sessions = new Map();

const sessionController = {
  getSessions() {
    return sessions;
  },
  
  getSession(sessionId) {
    return sessions.get(sessionId);
  },
  
  createSession(sessionId, socketId, initialData) {
    const session = new Session(sessionId, socketId, initialData);
    sessions.set(sessionId, session);
    return session;
  },
  
  updateSession(sessionId, behaviorData, lastInteractions) {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    session.updateActivity();
    session.updateBehaviorData(behaviorData);
    session.addInteractions(lastInteractions);
    
    return session;
  },
  
  endSession(sessionId) {
    const session = sessions.get(sessionId);
    if (session) {
      sessions.delete(sessionId);
    }
    return session;
  },
  
  markElementShown(sessionId, elementId) {
    const session = sessions.get(sessionId);
    if (session) {
      session.addShownElement(elementId);
    }
    return session;
  },
  
  addFormSubmission(sessionId, formId, data) {
    const session = sessions.get(sessionId);
    if (session) {
      session.addFormSubmission(formId, data);
    }
    return session;
  },
  
  markDisconnected(sessionId) {
    const session = sessions.get(sessionId);
    if (session) {
      session.markDisconnected();
    }
    return session;
  },
  
  getStats() {
    return {
      activeSessions: sessions.size,
      totalInteractions: Array.from(sessions.values()).reduce((sum, session) => 
        sum + (session.totalInteractions || 0), 0)
    };
  }
};

module.exports = sessionController; 