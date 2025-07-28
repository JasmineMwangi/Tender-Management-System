'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Messages', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            senderId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT', // Prevent deletion of user if they have messages
            },
            recipientId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            tenderId: {
                type: Sequelize.UUID,
                allowNull: true, // Messages might not always be related to tenders
                references: {
                    model: 'tenders',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL', // Keep message if tender is deleted
            },
            subject: {
                type: Sequelize.STRING(255), // Explicit length limit
                allowNull: false,
                validate: {
                    len: [1, 255] // Ensure subject is not empty
                }
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            readAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true, // For soft deletes
            },
        }, {
            // Table options
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            engine: 'InnoDB',
            indexes: [
                {
                    name: 'idx_messages_sender_id',
                    fields: ['senderId'],
                },
                {
                    name: 'idx_messages_recipient_id',
                    fields: ['recipientId'],
                },
                {
                    name: 'idx_messages_tender_id',
                    fields: ['tenderId'],
                },
                {
                    name: 'idx_messages_created_at',
                    fields: ['createdAt'],
                },
                {
                    name: 'idx_messages_is_read',
                    fields: ['isRead'],
                },
                {
                    name: 'idx_messages_deleted_at',
                    fields: ['deletedAt'],
                },
                {
                    // Composite index for common queries
                    name: 'idx_messages_recipient_read_created',
                    fields: ['recipientId', 'isRead', 'createdAt'],
                },
            ],
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('messages');
    },
};