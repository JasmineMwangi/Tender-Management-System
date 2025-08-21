'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Fetch at least two bidders
    const [bidders] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'bidder' LIMIT 2;`
    );

    // 2️⃣ Fetch one tender
    const [tenders] = await queryInterface.sequelize.query(
      `SELECT id FROM tenders LIMIT 1;`
    );

    // 3️⃣ Validate
    if (!bidders.length) {
      throw new Error("❌ No bidder found. Please seed users first.");
    }
    if (!tenders.length) {
      throw new Error("❌ No tender found. Please seed tenders first.");
    }

    const tenderId = tenders[0].id;

    // 4️⃣ Insert bids (different users to avoid unique constraint error)
    await queryInterface.bulkInsert('bids', [
      {
        id: uuidv4(),
        userId: bidders[0].id,   // ✅ first bidder
        tenderId: tenderId,
        bidNumber: 'BID-001',
        amount: 250000,
        status: 'draft',
        type: 'technical',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      // {
      //   id: uuidv4(),
      //   userId: bidders.length > 1 ? bidders[1].id : bidders[0].id, // ✅ second bidder if available
      //   tenderId: tenderId,
      //   bidNumber: 'BID-002',
      //   amount: 180000,
      //   status: 'qualified',
      //   type: 'financial',
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      //   deletedAt: null
      // }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('bids', null, {});
  }
};
