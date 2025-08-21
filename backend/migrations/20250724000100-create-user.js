'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                validate: {
                    len: [2, 100]
                }
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
                // Will store hashed password, so needs sufficient length
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true,
                validate: {
                    is: /^[\+]?[1-9][\d]{0,15}$/  // Basic international phone validation
                }
            },
            role: {
                type: Sequelize.ENUM('admin', 'organization', 'bidder'),
                allowNull: false,
                defaultValue: 'bidder'
            },
            status: {
                type: Sequelize.ENUM('active', 'inactive', 'suspended'),
                allowNull: false,
                defaultValue: 'active'
            },
            emailVerified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            lastLoginAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                // For soft deletes - Sequelize paranoid mode
            },
        });

        // Add indexes for performance
        await queryInterface.addIndex('users', ['email'], {
            unique: true,
            name: 'users_email_unique'
        });
        
        await queryInterface.addIndex('users', ['role'], {
            name: 'users_role_index'
        });
        
        await queryInterface.addIndex('users', ['status'], {
            name: 'users_status_index'
        });

        // Composite index for common queries
        await queryInterface.addIndex('users', ['role', 'status'], {
            name: 'users_role_status_index'
        });

        // Index for soft delete queries
        await queryInterface.addIndex('users', ['deletedAt'], {
            name: 'users_deleted_at_index'
        });
    },

    down: async (queryInterface) => {
        // Drop indexes first (optional, as they'll be dropped with table)
        await queryInterface.removeIndex('users', 'users_email_unique');
        await queryInterface.removeIndex('users', 'users_role_index');
        await queryInterface.removeIndex('users', 'users_status_index');
        await queryInterface.removeIndex('users', 'users_role_status_index');
        await queryInterface.removeIndex('users', 'users_deleted_at_index');
        
        // Drop the table
        await queryInterface.dropTable('Users');
    },
};