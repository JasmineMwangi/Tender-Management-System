'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('AuditLogs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true, // System actions might not have a user
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL', // Keep audit log even if user is deleted
            },
            action: {
                type: Sequelize.ENUM(
                    'CREATE',
                    'READ',
                    'UPDATE',
                    'DELETE',
                    'LOGIN',
                    'LOGOUT',
                    'EXPORT',
                    'IMPORT',
                    'APPROVE',
                    'REJECT',
                    'SUBMIT'
                ),
                allowNull: false,
                comment: 'Type of action performed',
            },
            entity: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: 'Entity/table name that was affected',
                validate: {
                    len: [1, 100],
                    notEmpty: true,
                }
            },
            entityId: {
                type: Sequelize.UUID,
                allowNull: true, // Some actions might not target specific entities
                comment: 'ID of the affected entity',
            },
            oldValues: {
                type: Sequelize.JSON,
                allowNull: true,
                comment: 'Previous values before change (for UPDATE actions)',
            },
            newValues: {
                type: Sequelize.JSON,
                allowNull: true,
                comment: 'New values after change (for CREATE/UPDATE actions)',
            },
            ipAddress: {
                type: Sequelize.STRING(45), // IPv6 support
                allowNull: true,
                validate: {
                    isIP: true,
                }
            },
            userAgent: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'User agent string from request',
            },
            sessionId: {
                type: Sequelize.STRING(128),
                allowNull: true,
                comment: 'Session identifier',
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Human readable description of the action',
            },
            metadata: {
                type: Sequelize.JSON,
                allowNull: true,
                comment: 'Additional context data',
            },
            severity: {
                type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
                defaultValue: 'LOW',
                allowNull: false,
                comment: 'Severity level of the action',
            },
            status: {
                type: Sequelize.ENUM('SUCCESS', 'FAILURE', 'PENDING'),
                defaultValue: 'SUCCESS',
                allowNull: false,
                comment: 'Status of the action',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            // Table options
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            engine: 'InnoDB',
            comment: 'Audit trail for all system actions',
            indexes: [
                {
                    name: 'idx_audit_logs_user_id',
                    fields: ['userId'],
                },
                {
                    name: 'idx_audit_logs_action',
                    fields: ['action'],
                },
                {
                    name: 'idx_audit_logs_entity',
                    fields: ['entity'],
                },
                {
                    name: 'idx_audit_logs_entity_id',
                    fields: ['entityId'],
                },
                {
                    name: 'idx_audit_logs_created_at',
                    fields: ['createdAt'],
                },
                {
                    name: 'idx_audit_logs_severity',
                    fields: ['severity'],
                },
                {
                    name: 'idx_audit_logs_status',
                    fields: ['status'],
                },
                {
                    name: 'idx_audit_logs_ip_address',
                    fields: ['ipAddress'],
                },
                {
                    // Composite index for common queries
                    name: 'idx_audit_logs_entity_action_created',
                    fields: ['entity', 'action', 'createdAt'],
                },
                {
                    // Composite index for user activity queries
                    name: 'idx_audit_logs_user_created',
                    fields: ['userId', 'createdAt'],
                },
                {
                    // Composite index for security monitoring
                    name: 'idx_audit_logs_severity_created',
                    fields: ['severity', 'createdAt'],
                },
            ],
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('auditLogs');
    },
};