module.exports = {
    getInstance: function() {
        return UsersToRemind.instance || (UsersToRemind.instance = new UsersToRemind());
    }
};

class UsersToRemind {
    static instance;

    constructor() {
        UsersToRemind.instance = this;
        this.back = [];
        this.water = [];
    }
}