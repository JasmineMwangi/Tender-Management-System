'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Jane',
        lastName: 'Mwangi',
        email: 'jane@example.com',
        phone: '0712345678',
        organization: 'BuildVision Ltd',
        password: hashedPassword,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '0798765432',
        organization: 'Nairobi County',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
