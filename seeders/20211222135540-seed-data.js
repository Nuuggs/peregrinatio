'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = [{
      username: 'bryan',
      email: 'bryan@bryan.com',
      password: 'pass123',
      created_at: new Date(),
      updated_at: new Date(),
    }];

    await queryInterface.bulkInsert('users', user);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
  
};
