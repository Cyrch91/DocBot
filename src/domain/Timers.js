module.exports = {
    getInstance: Timers.getInstance,
};

class Timers {
    static instance;
  
    constructor() {
        Timers.instance = this;
        this.timers = {};
    }

    getInstance() {
        return Timers.instance || (Timers.instance = new Timers());
    }
  
    setTimer(userName, callback, interval) {
      this.timers[userName] = setInterval(callback, interval);
    }
  
    cancelTimer(userName) {
      clearInterval(this.timers[userName]);
      delete this.timers[userName];
    }
}