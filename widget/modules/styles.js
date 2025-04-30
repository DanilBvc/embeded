export const StyleManager = {
  addStyles: function() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .bw-ui-element {
        font-family: Arial, sans-serif;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        padding: 15px;
        max-width: 350px;
      }
      
      .bw-form-field {
        margin-bottom: 12px;
      }
      
      .bw-form-field label {
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
      }
      
      .bw-form-field input,
      .bw-form-field textarea,
      .bw-form-field select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .bw-form-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
      }
      
      .bw-form-buttons button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .bw-form-buttons button[type="submit"] {
        background-color: #4CAF50;
        color: white;
      }
      
      .bw-form-buttons button[type="button"] {
        background-color: #f1f1f1;
      }
      
      .bw-close-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        border: none;
        background: transparent;
        font-size: 20px;
        cursor: pointer;
      }
      
      .bw-notification {
        padding-right: 30px;
      }
      
      @keyframes bw-slide-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .bw-ui-element {
        animation: bw-slide-in 0.3s ease-out;
      }
    `;
    document.head.appendChild(styleEl);
  }
}; 