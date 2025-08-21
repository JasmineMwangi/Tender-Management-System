'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the organisation user (role = 'organization')
    const [orgUser] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'organization' LIMIT 1;`
    );

    if (!orgUser.length) {
      throw new Error("No organisation user found. Please seed users first.");
    }

    await queryInterface.bulkInsert('tenders', [
      {
        id: uuidv4(),
        organisationId: orgUser[0].id,  // dynamically assigned
        title: 'Supply Office Furniture',
        description: 'Supply and deliver executive office furniture.',
        category: 'Procurement',
        budget: 500000.00,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        requirements: 'Supplier must provide 2-year warranty',
        contactEmail: 'procurement@org.com',
        contactPhone: '+254711223344',
        location: 'Nairobi',
        status: 'published', // ✅ matches ENUM
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tenders', null, {});
  }
};
