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

// This seeder script populates the Permissions table with initial data.
// Each permission has a unique ID and a name that describes the action it allows.
// The `createdAt` and `updatedAt` fields are set to the current date and time.
// This is useful for implementing role-based access control in the application, where each role can have multiple permissions.
// The `down` method ensures that the seeded data can be removed if needed, maintaining the ability to revert the seeding.
// This migration is essential for setting up the foundational permissions structure in the application.
// It allows for flexible permission management, enabling the assignment of specific actions or access rights to different roles.
// This is particularly useful in applications that require fine-grained access control, such as admin panels or user management systems.
// By defining permissions in a separate table, the application can easily manage and query permissions without hardcoding them into the application logic.
// This approach promotes better maintainability and scalability as the application grows and evolves.
// It also allows for future expansion, such as adding new permissions or modifying existing ones without significant changes to the codebase.
// Overall, this seeder script is a crucial step in establishing a robust user management system that can adapt to changing requirements and user needs.
// It sets the groundwork for implementing role-based access control, which is a common requirement in modern web applications.
// By having a dedicated Permissions table, the application can efficiently manage user permissions and access rights,
// ensuring that users only have access to the features and data they are authorized to see.
// This enhances security and user experience by providing a clear structure for user permissions and roles.
// Additionally, it allows for easier auditing and tracking of user actions based on their permissions,
// which is important for compliance and monitoring purposes.