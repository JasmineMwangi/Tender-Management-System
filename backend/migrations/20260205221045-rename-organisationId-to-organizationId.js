'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename column from organisationId to organizationId
    await queryInterface.renameColumn(
      'tenders',              // table name
      'organisationId',       // old column name
      'organizationId'        // new column name
    );
  },

  async down(queryInterface, Sequelize) {
    // Rollback: rename back to organisationId
    await queryInterface.renameColumn(
      'tenders',
      'organizationId',
      'organisationId'
    );
  }
};
