'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rolepermissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roles',   // ✅ must match roles table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'permissions',   // ✅ must match permissions table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Optional composite index for faster lookups
    await queryInterface.addIndex('rolepermissions', ['roleId', 'permissionId'], {
      unique: true,
      name: 'rolepermissions_role_permission_unique'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('rolepermissions');
  }
};


// This migration creates a many-to-many relationship table between Roles and Permissions.
// It allows roles to have multiple permissions and permissions to be assigned to multiple roles.   