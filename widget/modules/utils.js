export const Utils = {
  generateSessionId: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  getPositionStyles: function(position = 'bottom-right') {
    const styles = {};
    
    if (position.includes('top')) {
      styles.top = '20px';
    } else if (position.includes('bottom')) {
      styles.bottom = '20px';
    } else {
      styles.top = '50%';
      styles.transform = 'translateY(-50%)';
    }
    
    if (position.includes('left')) {
      styles.left = '20px';
    } else if (position.includes('right')) {
      styles.right = '20px';
    } else {
      styles.left = '50%';
      styles.transform = (styles.transform || '') + ' translateX(-50%)';
    }
    
    return styles;
  },
  
  getScrollPercentage: function() {
    const h = document.documentElement;
    const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';
    
    return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
  },
  
  getCookie: function(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  },
  
  setCookie: function(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}${expires}; path=/`;
    return value;
  }
}; 