'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const hashedPassword = await bcrypt.hash('password123', 10);

      await queryInterface.bulkInsert('Users', [
        {
          id: uuidv4(),
          name: 'Admin User',
          email: 'admin@gmail.com',
          password: hashedPassword,
          phone: '+254700000001',
          role: 'admin',
          status: 'active',
          emailVerified: true,
          lastLoginAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Org User',
          email: 'org@gmail.com',
          password: hashedPassword,
          phone: '+254700000002',
          role: 'organization',
          status: 'active',
          emailVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Bidder User',
          email: 'bidder@gmail.com',
          password: hashedPassword,
          phone: '+254700000003',
          role: 'bidder',
          status: 'active',
          emailVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], { ignoreDuplicates: true });

      console.log("✅ Users seeded successfully");
    } catch (err) {
      console.error("❌ Seeder failed:", err.errors ? err.errors.map(e => e.message) : err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
