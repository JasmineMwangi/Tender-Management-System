'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userrole', {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE'
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

    await queryInterface.addConstraint('userrole', {
      fields: ['userId', 'roleId'],
      type: 'primary key',
      name: 'pk_userrole'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('userrole');
  }
};

// This migration creates a many-to-many relationship table between Users and Roles.
// It allows users to have multiple roles and roles to be assigned to multiple users.
// This is essential for implementing role-based access control in the application,
// enabling flexible user management and permission assignments.
// The `createdAt` and `updatedAt` fields are included for tracking record creation and modification times.
// The `down` method ensures that the table can be dropped if needed, maintaining the ability to revert the migration.
// This migration is crucial for establishing a robust user management system that can adapt to changing requirements and user needs.
// It provides a clear and organized way to manage user roles, ensuring that the application can grow and evolve without significant rework.
// By having a dedicated UserRoles table, the application can efficiently manage and query user roles without hardcoding them into the application logic.
// This approach promotes better maintainability and scalability as the application grows and evolves.
// It also allows for future expansion, such as adding new roles or modifying existing ones without significant changes to the codebase.
// Overall, this migration is a foundational piece of the application's architecture,
// enabling the implementation of a flexible and scalable user management system.
// It sets the groundwork for implementing role-based access control, which is a common requirement in modern web applications.
// By establishing a UserRoles table, the application can easily integrate with other components,
// such as permissions and user profiles, to create a comprehensive user management solution.
// This migration is essential for setting up the foundational user roles structure in the application.
// It allows for flexible role management, enabling the assignment of specific roles to users.
// This is particularly useful in applications that require different levels of access or functionality for different users,
// such as admin panels or user management systems.
// By defining user roles in a separate table, the application can easily manage and query roles without hardcoding them into the application logic.
// This approach promotes better maintainability and scalability as the application grows and evolves.
// It also allows for easier auditing and tracking of user actions based on their roles,
// which is important for compliance and monitoring purposes.
// This migration is a crucial step in establishing a robust user management system that can adapt to future needs.
// It provides a clear and organized way to manage user roles, ensuring that the application can efficiently handle user permissions and access rights.
// This enhances security and user experience by providing a structured approach to user management.
// Additionally, it allows for easier integration with other components of the application,
// such as authentication and authorization systems, to create a cohesive user management solution.
// By implementing this migration, the application can ensure that user roles are managed effectively,
// enabling the assignment of specific roles to users and allowing for fine-grained access control.
// This is particularly important in applications that require different levels of access or functionality for different users,
// such as admin panels or user management systems.
// Overall, this migration is a foundational piece of the application's architecture,
// enabling the implementation of a flexible and scalable user management system.
// It provides a clear and organized way to manage user roles, ensuring that the application can grow and adapt to future needs without significant rework.
// By establishing a UserRoles table, the application can easily integrate with other components,
// such as permissions and user profiles, to create a comprehensive user management solution that meets the needs of the application and its users.
// This migration is essential for setting up the foundational user roles structure in the application.
// It allows for flexible role management, enabling the assignment of specific roles to users.
// This is particularly useful in applications that require different levels of access or functionality for different users,
// such as admin panels or user management systems.
// By defining user roles in a separate table, the application can easily manage and query roles without
// hardcoding them into the application logic.
// This approach promotes better maintainability and scalability as the application grows and evolves.
// It also allows for easier auditing and tracking of user actions based on their roles,
// which is important for compliance and monitoring purposes.
// This migration is a crucial step in establishing a robust user management system that can adapt to future needs.
// It provides a clear and organized way to manage user roles, ensuring that the application can efficiently
// handle user permissions and access rights.
// This enhances security and user experience by providing a structured approach to user management.
// Additionally, it allows for easier integration with other components of the application,
// such as authentication and authorization systems, to create a cohesive user management solution.
// By implementing this migration, the application can ensure that user roles are managed effectively,
// enabling the assignment of specific roles to users and allowing for fine-grained access control.
// This is particularly important in applications that require different levels of access or functionality for different users,
// such as admin panels or user management systems.
// Overall, this migration is a foundational piece of the application's architecture,
// enabling the implementation of a flexible and scalable user management system.
// It provides a clear and organized way to manage user roles, ensuring that the application can grow
// and adapt to future needs without significant rework.
// By establishing a UserRoles table, the application can easily integrate with other components,
// such as permissions and user profiles, to create a comprehensive user management solution that meets the needs
// of the application and its users.
// This migration is essential for setting up the foundational user roles structure in the application.
// It allows for flexible role management, enabling the assignment of specific roles to users.
// This is particularly useful in applications that require different levels of access or functionality for different users,
// such as admin panels or user management systems.
// By defining user roles in a separate table, the application can easily manage and query roles without
// hardcoding them into the application logic.
// This approach promotes better maintainability and scalability as the application grows and evolves.
// It also allows for easier auditing and tracking of user actions based on their roles,
// which is important for compliance and monitoring purposes.   
