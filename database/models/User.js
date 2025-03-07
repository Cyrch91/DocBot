'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Reminder, 
        { through: models.UserReminders }
      );
    }
  }
  
  User.init({
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
