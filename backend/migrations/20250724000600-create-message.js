'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Messages', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            senderId: {
                type: Sequelize.UUID,
                references: { model: 'Users', key: 'id' },
            },
            recipientId: {
                type: Sequelize.UUID,
                references: { model: 'Users', key: 'id' },
            },
            tenderId: {
                type: Sequelize.UUID,
                references: { model: 'Tenders', key: 'id' },
            },
            subject: {
                type: Sequelize.STRING,
            },
            message: Sequelize.TEXT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Messages');
    },
};