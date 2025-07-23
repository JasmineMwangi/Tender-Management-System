'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bid_evaluations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      bid_id: {
        type: Sequelize.UUID,
        references: {
          model: 'bids',
          key: 'id'
        }
      },
      score: Sequelize.FLOAT,
      comments: Sequelize.TEXT,
      created_at: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('bid_evaluations');
  }
};

