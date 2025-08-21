'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Fetch one bid
    const [bids] = await queryInterface.sequelize.query(
      `SELECT id FROM bids LIMIT 1;`
    );

    // 2️⃣ Fetch one user for uploadedBy
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users LIMIT 1;`
    );

    if (!bids.length) {
      throw new Error("❌ No bids found. Please seed bids first.");
    }
    if (!users.length) {
      throw new Error("❌ No users found. Please seed users first.");
    }

    const bidId = bids[0].id;
    const userId = users[0].id; // uploader

    // 3️⃣ Insert attachments
    await queryInterface.bulkInsert('attachments', [
      {
        id: uuidv4(),
        bidId: bidId,
        uploadedBy: userId,
        filename: 'proposal.pdf',
        originalName: 'My_Proposal.pdf',
        fileUrl: '/uploads/proposal.pdf',
        filePath: '/var/data/uploads/proposal.pdf',
        fileSize: 102400, // ~100KB
        fileType: 'application/pdf',
        fileExtension: '.pdf',
        category: 'bid_proposal',
        description: 'Technical proposal for tender',
        isPublic: false,
        isRequired: true,
        status: 'active',
        checksum: null,
        downloadCount: 0,
        lastAccessedAt: null,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: uuidv4(),
        bidId: bidId,
        uploadedBy: userId,
        filename: 'budget.xlsx',
        originalName: 'Budget.xlsx',
        fileUrl: '/uploads/budget.xlsx',
        filePath: '/var/data/uploads/budget.xlsx',
        fileSize: 204800, // ~200KB
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileExtension: '.xlsx',
        category: 'financial_document',
        description: 'Financial breakdown',
        isPublic: false,
        isRequired: true,
        status: 'active',
        checksum: null,
        downloadCount: 0,
        lastAccessedAt: null,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('attachments', null, {});
  }
};
