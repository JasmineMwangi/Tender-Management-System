'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bids', [
      {
        id: 'c0a8c001-1111-4e80-91e0-1111bids0001',
        user_id: '56d41a64-601c-4d91-b7a9-81dd59c5b2b6', // Bidder Max
        tender_id: '8b488335-7b13-432d-9425-8c20440c4776', // Replace with actual tender UUID
        amount: 250000,
        status: 'submitted',
        type: 'technical',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        id: 'c0a8c001-2222-4e80-91e0-2222bids0002',
        user_id: '56d41a64-601c-4d91-b7a9-81dd59c5b2b6', // Bidder Max again
        tender_id: '8b488335-7b13-432d-9425-8c20440c4776', // Replace with actual tender UUID
        amount: 180000,
        status: 'reviewed',
        type: 'financial',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bids', null, {});
  }
};
