'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      { id: '11111111-1111-1111-1111-111111111111', name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { id: '22222222-2222-2222-2222-222222222222', name: 'organisation', createdAt: new Date(), updatedAt: new Date() },
      { id: '33333333-3333-3333-3333-333333333333', name: 'bidder', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
// This seeder script populates the Roles table with three predefined roles: admin, organisation, and bidder.
// Each role has a unique UUID as its ID and timestamps for creation and last update.
// The `up` method inserts the roles, while the `down` method removes them,
// allowing for easy rollback if needed.
// This is useful for setting up initial user roles in an application, enabling role-based access control.
// The roles can be used to manage permissions and access levels for different types of users in the system.
// This approach promotes better organization and management of user roles,
// ensuring that users have the appropriate permissions based on their roles.
