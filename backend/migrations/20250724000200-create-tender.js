'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tenders', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            title: Sequelize.STRING,
            description: Sequelize.TEXT,
            deadline: Sequelize.DATE,
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'open',
            },
            organizationId: {
                type: Sequelize.UUID,
                references: { model: 'Users', key: 'id' },
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Tenders');
    },
};