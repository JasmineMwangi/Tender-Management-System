'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Attachments', [
      {
        id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
        tenderId: '8b488335-7b13-432d-9425-8c20440c4776',
        userId: '56d41a64-601c-4d91-b7a9-81dd59c5b2b6',
        filePath: 'uploads/documents/technical_proposal.pdf',
        fileType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        id: '5c0a7893-2f7a-4bb3-92e0-234a523e19a0',
        tenderId: '8b488335-7b13-432d-9425-8c20440c4776',
        userId: '56d41a64-601c-4d91-b7a9-81dd59c5b2b6',
        filePath: 'uploads/documents/financial_quote.xlsx',
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Attachments', {
      file_path: [
        'uploads/documents/technical_proposal.pdf',
        'uploads/documents/financial_quote.xlsx'
      ]
    }, {});
  }
};
