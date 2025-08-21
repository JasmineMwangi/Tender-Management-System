'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable('roles');
  }
};

// This migration creates the Roles table with a UUID primary key and a unique name field.
// It allows for the definition of various roles that can be assigned to users in the system.
// The `createdAt` and `updatedAt` fields are included for tracking record creation and modification times.
// This is useful for implementing role-based access control in the application, where each user can have a specific role.
// The `down` method ensures that the table can be dropped if needed,
// maintaining the ability to revert the migration.
// This migration is essential for setting up the foundational roles structure in the application.
// It allows for flexible role management, enabling the assignment of specific roles to users.
// This is particularly useful in applications that require different levels of access or functionality for different users,
// such as admin panels or user management systems.
// By defining roles in a separate table, the application can easily manage and query roles without hardcoding them into the application logic.
// This approach promotes better maintainability and scalability as the application grows and evolves.
// It also allows for future expansion, such as adding new roles or modifying existing ones without significant changes to the codebase.
// Overall, this migration is a crucial step in establishing a robust user management system that can adapt to changing requirements and user needs.
// It sets the groundwork for implementing role-based access control, which is a common requirement in modern web applications.
// By having a dedicated Roles table, the application can efficiently manage user permissions and access rights,
// ensuring that users only have access to the features and data they are authorized to see.
// This enhances security and user experience by providing a clear structure for user roles and permissions.
// Additionally, it allows for easier auditing and tracking of user actions based on their roles,
// which is important for compliance and monitoring purposes.
// This migration is a foundational piece of the application's architecture,
// enabling the implementation of a flexible and scalable user management system.
// It provides a clear and organized way to manage user roles,
// ensuring that the application can grow and adapt to future needs without significant rework.
// By establishing a Roles table, the application can easily integrate with other components,
// such as permissions and user profiles, to create a comprehensive user management solution. 
