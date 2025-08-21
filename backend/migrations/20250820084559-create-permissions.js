'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('permissions');
  }
};

// };
// This migration creates a Permissions table with a UUID primary key and a unique name field.
// It allows for the definition of various permissions that can be assigned to roles in the system.
// The `createdAt` and `updatedAt` fields are included for tracking record creation and modification times.
// This is useful for implementing role-based access control in the application, where each role can have multiple permissions.
// The `down` method ensures that the table can be dropped if needed, maintaining the ability to revert the migration.
// This migration is essential for setting up the foundational permissions structure in the application.
// It allows for flexible permission management, enabling the assignment of specific actions or access rights to different roles.
// This is particularly useful in applications that require fine-grained access control, such as admin panels or user management systems.
// By defining permissions in a separate table, the application can easily manage and query permissions without hardcoding them into the application logic.
// This approach promotes better maintainability and scalability as the application grows and evolves.  