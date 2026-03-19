'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('permissions', [
      { id: 'aaa11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'view_admin_dashboard', createdAt: new Date(), updatedAt: new Date() },
      { id: 'aaa22222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'view_system_health', createdAt: new Date(), updatedAt: new Date() },
      { id: 'aaa33333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'view_organisation_dashboard', createdAt: new Date(), updatedAt: new Date() },
      { id: 'aaa44444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'view_bidder_dashboard', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};

