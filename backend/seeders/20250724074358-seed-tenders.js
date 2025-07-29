'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tenders', [
      {
        id: uuidv4(),
        organisationId: '6fa4e35a-997d-4675-b644-1b8bbd784238',
        title: 'Supply Office Furniture',
        description: 'Supply and deliver executive office furniture.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tenders', null, {});
  }
};
