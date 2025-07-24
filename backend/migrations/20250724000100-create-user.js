'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: Sequelize.STRING,
            email: {
                type: Sequelize.STRING,
                unique: true,
            },
            password: Sequelize.STRING,
            phone: Sequelize.STRING, // Added phone field
            role: Sequelize.ENUM('admin', 'organization', 'bidder'),
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Users');
    },
};