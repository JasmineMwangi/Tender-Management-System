'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bid_anomalies', {
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
      reason: Sequelize.TEXT,
      severity: Sequelize.ENUM('low', 'medium', 'high'),
      detected_at: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('bid_anomalies');
  }
};

