'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      related_id: Sequelize.UUID,
      related_type: Sequelize.ENUM('tender', 'bid'),
      file_name: Sequelize.STRING,
      file_url: Sequelize.TEXT,
      uploaded_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('documents');
  }
};

