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
        // if (!Timers.instance) {
        //     Timers.instance = new Timers();
        // }
        // return this.instance;
        return Timers.instance ?? (Timers.instance = new Timers());
    }
  
    setTimer(userId, userName, typeOfReminder) {
      const now = new Date();   
      const interval = 30 * 60 * 1000; // 30 minutes in milliseconds
      const nextReminderDateTime = new Date(now.getTime() + interval);
      const nextReminderTime = nextReminderDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'}); // TODO : get current locale
      
      this.timers.push({
        'userId': userId,
        'userName':userName,
        'nextReminderTime': nextReminderTime,
        'type': typeOfReminder
      });
    }

    getTimers() {
      return this.timers;
    }
  
    cancelTimer(userId) {
      this.timers = this.timers.filter(timer => timer.userId !== userId);
    }
}

module.exports = {
    timers: Timers.getInstance()
}
