'use strict';

const message = require('../models/message');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Messages', [
      {
        id: '1a2b3c4d-1111-2222-3333-444455556666',
        senderId: '693bdb97-b6d4-4185-bb3b-861112d74458', // User UUID
        recipientId: '56d41a64-601c-4d91-b7a9-81dd59c5b2b6', // Another User UUID
        subject: 'Clarification on Tender Document',
        message: 'Could you clarify the financial submission deadline?',
        tenderId: '8b488335-7b13-432d-9425-8c20440c4776',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        id: '6f7e8d9c-7777-8888-9999-aaaabbbbcccc',
        senderId: '693bdb97-b6d4-4185-bb3b-861112d74458',
        recipientId: '56d41a64-601c-4d91-b7a9-81dd59c5b2b6',
        subject: 'Re: Clarification on Tender Document',
        message: 'The financial deadline is the same as the overall closing date.',
        tenderId: '8b488335-7b13-432d-9425-8c20440c4776',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', {
      id: [
        '1a2b3c4d-1111-2222-3333-444455556666',
        '6f7e8d9c-7777-8888-9999-aaaabbbbcccc'
      ]
    }, {});
  }
};
