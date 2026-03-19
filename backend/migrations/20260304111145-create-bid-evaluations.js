'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BidEvaluations', {
      id:          { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenderId:    { type: Sequelize.UUID, allowNull: false, references: { model: 'tenders', key: 'id' }, onDelete: 'CASCADE' },
      bidId:       { type: Sequelize.UUID, allowNull: false, references: { model: 'bids',    key: 'id' }, onDelete: 'CASCADE' },
      bidderId:    { type: Sequelize.UUID, allowNull: false, references: { model: 'users',   key: 'id' }, onDelete: 'CASCADE' },
      priceScore:      { type: Sequelize.DECIMAL(5,2) },
      qualityScore:    { type: Sequelize.DECIMAL(5,2) },
      timelineScore:   { type: Sequelize.DECIMAL(5,2) },
      experienceScore: { type: Sequelize.DECIMAL(5,2) },
      complianceScore: { type: Sequelize.DECIMAL(5,2) },
      totalScore:      { type: Sequelize.DECIMAL(5,2) },
      passesMandatoryChecks:  { type: Sequelize.BOOLEAN, defaultValue: true },
      disqualificationReason: { type: Sequelize.TEXT },
      rank:        { type: Sequelize.INTEGER },
      status:      { type: Sequelize.ENUM('pending','evaluated','awarded','rejected'), defaultValue: 'pending' },
      evaluatedAt: { type: Sequelize.DATE },
      evaluatedBy: { type: Sequelize.UUID, allowNull: true },
      createdAt:   { type: Sequelize.DATE, allowNull: false },
      updatedAt:   { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('BidEvaluations');
  }
};