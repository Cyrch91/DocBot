'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reminders', [
      {
        name: 'water',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'back',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reminders', null, {});
  }
};
