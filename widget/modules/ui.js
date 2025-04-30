import { Utils } from './utils.js';

export class UIManager {
  constructor(sessionManager) {
    this.session = sessionManager;
    this.socket = null;
  }
  
  setSocket(socket) {
    this.socket = socket;
  }
  
  renderUIElement(config) {
    const { type, content, position, style, id } = config;
    
    if (document.getElementById(`bw-element-${id}`)) {
      return;
    }
    
    const container = document.createElement('div');
    container.id = `bw-element-${id}`;
    container.className = `bw-ui-element bw-${type}`;
    
    Object.assign(container.style, {
      position: 'fixed',
      zIndex: 10000,
      ...Utils.getPositionStyles(position),
      ...style
    });
    
    switch (type) {
      case 'form':
        this.renderForm(container, content);
        break;
      case 'notification':
        this.renderNotification(container, content);
        break;
      case 'banner':
        this.renderBanner(container, content);
        break;
      default:
        container.innerHTML = content;
    }
    
    document.body.appendChild(container);
    
    if (this.socket) {
      this.socket.emit('element_shown', { 
        sessionId: this.session.getSessionId(), 
        elementId: id 
      });
    }
  }
  
  renderForm(container, formConfig) {
    const { title, fields, submitButton, cancelButton } = formConfig;
    
    const formTitle = document.createElement('h3');
    formTitle.textContent = title;
    container.appendChild(formTitle);
    
    const form = document.createElement('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      this.socket.emit('form_submit', { 
        sessionId: this.session.getSessionId(), 
        formId: formConfig.id,
        data 
      });
      
      container.remove();
    });
    
    fields.forEach(field => {
      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'bw-form-field';
      
      if (field.label) {
        const label = document.createElement('label');
        label.textContent = field.label;
        label.htmlFor = `field-${field.name}`;
        fieldContainer.appendChild(label);
      }
      
      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
      } else if (field.type === 'select') {
        input = document.createElement('select');
        (field.options || []).forEach(option => {
          const optEl = document.createElement('option');
          optEl.value = option.value;
          optEl.textContent = option.label;
          input.appendChild(optEl);
        });
      } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
      }
      
      input.id = `field-${field.name}`;
      input.name = field.name;
      input.required = field.required || false;
      input.placeholder = field.placeholder || '';
      
      fieldContainer.appendChild(input);
      form.appendChild(fieldContainer);
    });
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'bw-form-buttons';
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = submitButton?.text || 'Submit';
    buttonsContainer.appendChild(submitBtn);
    
    if (cancelButton) {
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = cancelButton.text || 'Cancel';
      cancelBtn.addEventListener('click', () => {
        container.remove();
        this.socket.emit('form_canceled', { 
          sessionId: this.session.getSessionId(), 
          formId: formConfig.id 
        });
      });
      buttonsContainer.appendChild(cancelBtn);
    }
    
    form.appendChild(buttonsContainer);
    container.appendChild(form);
  }
  
  renderNotification(container, notification) {
    container.innerHTML = `
      <div class="bw-notification-content">
        ${notification.title ? `<h4>${notification.title}</h4>` : ''}
        <p>${notification.message}</p>
      </div>
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'bw-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      container.remove();
      this.socket.emit('notification_closed', { 
        sessionId: this.session.getSessionId(), 
        notificationId: notification.id 
      });
    });
    container.appendChild(closeBtn);
    
    if (notification.timeout) {
      setTimeout(() => {
        if (document.body.contains(container)) {
          container.remove();
          this.socket.emit('notification_closed', { 
            sessionId: this.session.getSessionId(), 
            notificationId: notification.id,
            autoClose: true
          });
        }
      }, notification.timeout);
    }
  }
  
  renderBanner(container, banner) {
    container.innerHTML = banner.content;
    
    if (banner.closable !== false) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'bw-close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', () => {
        container.remove();
        this.socket.emit('banner_closed', { 
          sessionId: this.session.getSessionId(), 
          bannerId: banner.id 
        });
      });
      container.appendChild(closeBtn);
    }
    
    const buttons = container.querySelectorAll('[data-bw-action]');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-bw-action');
        this.socket.emit('banner_action', { 
          sessionId: this.session.getSessionId(), 
          bannerId: banner.id,
          action
        });
        
        if (button.getAttribute('data-bw-close') !== 'false') {
          container.remove();
        }
      });
    });
  }
} 