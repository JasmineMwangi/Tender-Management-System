'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AuditLogs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
      },
      action: Sequelize.STRING,
      entity: Sequelize.STRING,
      entityId: Sequelize.UUID,
      createdAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('AuditLogs');
  },
};