class Session {
  constructor(sessionId, socketId, initialData) {
    this.id = sessionId;
    this.socketId = socketId;
    this.startedAt = new Date();
    this.lastActivity = new Date();
    this.initialData = initialData;
    this.totalInteractions = 0;
    this.behaviorData = initialData.behaviorData;
    this.interactions = [];
    this.shownElements = [];
    this.formSubmissions = [];
  }

  updateActivity() {
    this.lastActivity = new Date();
  }

  updateBehaviorData(newData) {
    this.behaviorData = { ...this.behaviorData, ...newData };
  }

  addInteractions(interactions) {
    if (interactions && interactions.length) {
      this.interactions.push(...interactions);
      this.totalInteractions += interactions.length;
      
      if (this.interactions.length > 100) {
        this.interactions = this.interactions.slice(-100);
      }
    }
  }

  addShownElement(elementId) {
    this.shownElements.push({
      elementId,
      shownAt: new Date()
    });
  }

  hasShownElement(elementId) {
    return this.shownElements.some(el => el.elementId === elementId);
  }

  addFormSubmission(formId, data) {
    if (!this.formSubmissions) {
      this.formSubmissions = [];
    }
    
    this.formSubmissions.push({
      formId,
      submittedAt: new Date(),
      data
    });
  }

  markDisconnected() {
    this.disconnectedAt = new Date();
  }
}

module.exports = Session; 