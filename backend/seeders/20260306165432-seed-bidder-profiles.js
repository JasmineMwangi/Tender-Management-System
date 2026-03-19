'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Insert extra bidder users matching your exact users table columns
      await queryInterface.bulkInsert('users', [
        {
          id: uuidv4(),
          name: 'James Mwangi',
          email: 'james@constructa.ke',
          password: hashedPassword,
          phone: '+254711000001',
          role: 'bidder',
          status: 'active',
          emailVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: uuidv4(),
          name: 'Alice Wanjiru',
          email: 'alice@buildtech.ke',
          password: hashedPassword,
          phone: '+254711000002',
          role: 'bidder',
          status: 'active',
          emailVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: uuidv4(),
          name: 'Peter Otieno',
          email: 'peter@infraco.ke',
          password: hashedPassword,
          phone: '+254711000003',
          role: 'bidder',
          status: 'active',
          emailVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: uuidv4(),
          name: 'Mary Njoki',
          email: 'mary@metrobuilt.ke',
          password: hashedPassword,
          phone: '+254711000004',
          role: 'bidder',
          status: 'active',
          emailVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: uuidv4(),
          name: 'David Kipchoge',
          email: 'david@greenenergy.ke',
          password: hashedPassword,
          phone: '+254711000005',
          role: 'bidder',
          status: 'active',
          emailVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: uuidv4(),
          name: 'Susan Achieng',
          email: 'susan@techsol.ke',
          password: hashedPassword,
          phone: '+254711000006',
          role: 'bidder',
          status: 'active',
          emailVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ], { ignoreDuplicates: true });

      console.log('✅ Extra bidder users seeded successfully');
    } catch (err) {
      console.error('❌ Bidder profiles seeder failed:', err.message);
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: [
        'james@constructa.ke', 'alice@buildtech.ke', 'peter@infraco.ke',
        'mary@metrobuilt.ke',  'david@greenenergy.ke', 'susan@techsol.ke'
      ]
    }, {});
  }
};