module.exports = {
    getInstance() {
        return Timers.instance || (Timers.instance = new Timers());
    }
}

class Timers {
    static instance;
  
    constructor() {
        if (Timers.instance) {
            throw new Error("Timers is a singleton and cannot be instantiated more than once.");
        }
        Timers.instance = this;
        this.timers = {};
    }
  
    setTimer(userName, callback, interval) {
      this.timers[userName] = setInterval(callback, interval);
    }
  
    cancelTimer(userName) {
      clearInterval(this.timers[userName]);
      delete this.timers[userName];
    }
}