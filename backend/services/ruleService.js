const sessionController = require('../controllers/sessionController');

const ruleService = {
  checkRules(io, sessionId) {
    const session = sessionController.getSession(sessionId);
    if (!session) return;
    
    const socket = io.sockets.sockets.get(session.socketId);
    if (!socket) return;
    
    if (session.behaviorData.timeOnPage >= 30 && 
        !session.hasShownElement('feedback-form')) {
      socket.emit('show_element', {
        id: 'feedback-form',
        type: 'form',
        position: 'bottom-right',
        content: {
          id: 'feedback-form',
          title: 'How do you like our site?',
          fields: [
            {
              name: 'rating',
              type: 'select',
              label: 'Rating',
              required: true,
              options: [
                { value: '5', label: 'Excellent' },
                { value: '4', label: 'Good' },
                { value: '3', label: 'Average' },
                { value: '2', label: 'Poor' },
                { value: '1', label: 'Terrible' }
              ]
            },
            {
              name: 'comment',
              type: 'textarea',
              label: 'Comment',
              placeholder: 'Share your thoughts...'
            }
          ],
          submitButton: {
            text: 'Submit'
          },
          cancelButton: {
            text: 'Not now'
          }
        }
      });
    }
    
    if (session.interactions.some(i => i.type === 'scroll' && i.data.maxScroll >= 25) && 
        !session.hasShownElement('cookie-notification')) {
      socket.emit('show_element', {
        id: 'cookie-notification',
        type: 'notification',
        position: 'bottom-left',
        content: {
          id: 'cookie-notification',
          title: 'We use cookies',
          message: 'This site uses cookies to improve user experience.',
          timeout: 8000 
        }
      });
    }
    
    if (session.behaviorData.clicks >= 10 && 
        !session.hasShownElement('activity-banner')) {
      socket.emit('show_element', {
        id: 'activity-banner',
        type: 'banner',
        position: 'top',
        style: {
          width: '100%',
          maxWidth: '100%',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd'
        },
        content: {
          id: 'activity-banner',
          content: `
            <div style="text-align: center; padding: 10px;">
              <h3>Welcome active user!</h3>
              <p>You're actively exploring our site. You might be interested in our special offer.</p>
              <button data-bw-action="show_offer" style="background-color: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                Learn more
              </button>
            </div>
          `,
          closable: true
        }
      });
    }
  },
  
  setupPeriodicChecks(io) {
    const config = require('../config');
    const sessionController = require('../controllers/sessionController');
    
    setInterval(() => {
      const sessions = sessionController.getSessions();
      sessions.forEach((session, sessionId) => {
        if (!session.disconnectedAt) {
          this.checkRules(io, sessionId);
        }
      });
    }, config.RULES_CHECK_INTERVAL);
  }
};

module.exports = ruleService; 