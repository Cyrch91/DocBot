class Timers {
    static instance;
  
    constructor() {
      if (Timers.instance) {
          return Timers.instance;
      }
      Timers.instance = this;
      this.timers = [];
    }

    static getInstance() {
      return Timers.instance ?? (Timers.instance = new Timers());
    }
  
    setTimer(userId, userName, typeOfReminder, frequency) {
      const now = new Date();   
      const interval = frequency * 60 * 1000;
      const nextReminderDateTime = new Date(now.getTime() + interval);
      const nextReminderTime = nextReminderDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'}); // TODO : get current locale
      
      this.timers.push({
        'userId': userId,
        'userName':userName,
        'nextReminderTime': nextReminderTime,
        'type': {
          'typeOfReminder': typeOfReminder,
          'frequency': frequency
        }
      });
    }

    getTimers() {
      return this.timers;
    }

    updateTimer(userId) {
      const timerToUpdate = this.timers.filter(timer => timer.userId === userId);
      if (timerToUpdate.length >= 1) {
        const now = new Date();
        const interval = timerToUpdate[0].type.frequency * 60 * 1000;
        const nextReminderDateTime = new Date(now.getTime() + interval);
        timerToUpdate[0].nextReminderTime = nextReminderDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'});
      } else {
        console.log(`User ${userId} not found in timers list.`);
      }
    }
  
    cancelTimer(userId) {
      this.timers = this.timers.filter(timer => timer.userId !== userId);
    }
}

module.exports = {
    timers: Timers.getInstance()
}
