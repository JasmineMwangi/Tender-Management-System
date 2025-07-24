'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Evaluations', [
      {
        id: 'c3d4e5f6-7890-1234-abcd-001122334455',
        bidId: 'c0a8c001-1111-4e80-91e0-1111bids0001',
        evaluatedBy: '3a8421e6-5fc1-4d31-a45b-2e7acbd45678',
        score: 85,
        remarks: 'Strong technical proposal, meets most requirements.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        id: 'd1a2b3c4-5678-9101-abcd-556677889900',
        bidId: 'c0a8c001-1111-4e80-91e0-1111bids0001',
        evaluatedBy: '3a8421e6-5fc1-4d31-a45b-2e7acbd45678',
        score: 72,
        remarks: 'Good effort, but lacks detail in financials.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Evaluations', {
      id: [
        'c3d4e5f6-7890-1234-abcd-001122334455',
        'd1a2b3c4-5678-9101-abcd-556677889900'
      ]
    }, {});
  }
};
