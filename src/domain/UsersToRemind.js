module.exports = {
    getInstance: function() {
        return UsersToRemind.instance || (UsersToRemind.instance = new UsersToRemind());
    }
};

class UsersToRemind {
    static instance;

    constructor() {
        if (UsersToRemind.instance) {
            throw new Error("UsersToRemind is a singleton and cannot be instantiated more than once.");
        }
        UsersToRemind.instance = this;
        this.back = [];
        this.water = [];
    }
}