"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ✅ fetch two users
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users LIMIT 2;`
    );

    if (!users || users.length < 2) {
      throw new Error("❌ Not enough users to seed messages. Please seed users first.");
    }

    await queryInterface.bulkInsert("Messages", [
      {
        id: uuidv4(),
        senderId: users[0].id,   // ✅ real user
        recipientId: users[1].id,
        //receiverId: users[1].id, // ✅ real user
        subject: "Re: Hello, this is a test message",
        tenderId: null,          // or link to an existing tender if required
        message: "Hello, this is a test message",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        senderId: users[1].id,
        //receiverId: users[1].id,
         recipientId: users[1].id,
        subject: "Re: Hello, this is a test message",
        tenderId: null,
        message: "Reply to your message",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Messages", null, {});
  },
};
