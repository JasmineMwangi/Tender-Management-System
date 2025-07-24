'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        name: 'John Admin',
        email: 'admin@mail.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'BlueTech Ltd',
        email: 'blt@tender.com',
        password: await bcrypt.hash('tender123', 10),
        role: 'organization',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Alpha Contender',
        email: 'alpha@bidder.com',
        password: await bcrypt.hash('bidder456', 10),
        role: 'bidder',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
