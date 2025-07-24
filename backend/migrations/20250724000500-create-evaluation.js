'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Evaluations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      bidId: {
        type: Sequelize.UUID,
        references: { model: 'Bids', key: 'id' },
      },
      score: Sequelize.FLOAT,
      remarks: Sequelize.TEXT,
      evaluatedBy: Sequelize.UUID,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Evaluations');
  },
};