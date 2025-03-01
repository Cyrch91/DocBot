'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserReminders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  UserReminders.init({
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nextReminderTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
  }, {
    sequelize,
    modelName: 'UserReminders',
  });
  return UserReminders;
};
