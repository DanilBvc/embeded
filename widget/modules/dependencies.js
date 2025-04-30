export const DependencyLoader = {
  loadAll: function() {
    return this.loadSocketIO();
  },
  
  loadSocketIO: function() {
    return new Promise((resolve) => {
      const socketScript = document.createElement('script');
      socketScript.src = 'https://cdn.socket.io/4.4.1/socket.io.min.js';
      socketScript.onload = resolve;
      document.head.appendChild(socketScript);
    });
  }
}; 