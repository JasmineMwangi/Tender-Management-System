"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure there are bids
    const [bids] = await queryInterface.sequelize.query(
      `SELECT id, tenderId, userId FROM bids LIMIT 1;`
    );

    if (!bids || bids.length === 0) {
      throw new Error("❌ No bids found. Seed bids before evaluations.");
    }

    const bid = bids[0];

    await queryInterface.bulkInsert("evaluations", [
      {
        id: uuidv4(),
        evaluationNumber: "EV-001",
        bidId: bid.id,           // ✅ real bid
        tenderId: bid.tenderId,  // ✅ matching tender
        evaluationType: "overall",
        evaluationPhase: "final_assessment",
        overallScore: 85.5,
        maxPossibleScore: 100.0,
        technicalWeight: 0.7,
        financialWeight: 0.3,
        status: "completed",
        evaluatedBy: bid.userId,
        createdBy: bid.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("evaluations", null, {});
  },
};
