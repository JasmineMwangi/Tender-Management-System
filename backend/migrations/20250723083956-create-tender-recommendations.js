'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tender_recommendations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      tender_id: {
        type: Sequelize.UUID,
        references: {
          model: 'tenders',
          key: 'id'
        }
      },
      score: Sequelize.FLOAT,
      recommended_at: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('tender_recommendations');
  }
};

