'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Attachments', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            fileUrl: Sequelize.STRING,
            filePath: Sequelize.STRING, // Added filePath
            fileType: Sequelize.STRING,
            tenderId: {
                type: Sequelize.UUID,
                references: { model: 'Tenders', key: 'id' },
                allowNull: true,
            },
            bidId: {
                type: Sequelize.UUID,
                references: { model: 'Bids', key: 'id' },
                allowNull: true,
            },
            userId: {
                type: Sequelize.UUID,
                references: { model: 'Users', key: 'id' },
                allowNull: true,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Attachments');
    },
};