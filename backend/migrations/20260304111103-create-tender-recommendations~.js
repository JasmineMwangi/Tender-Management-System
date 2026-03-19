'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AnomalyFlags', {
      id:       { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenderId: { type: Sequelize.UUID, allowNull: true, references: { model: 'tenders', key: 'id' }, onDelete: 'CASCADE' },
      bidId:    { type: Sequelize.UUID, allowNull: true, references: { model: 'bids',    key: 'id' }, onDelete: 'CASCADE' },
      bidderId: { type: Sequelize.UUID, allowNull: true, references: { model: 'users',   key: 'id' }, onDelete: 'CASCADE' },
      flagType: {
        type: Sequelize.ENUM(
          'price_outlier','duplicate_bid','shill_bidding',
          'deadline_manipulation','cover_pricing','below_cost_bid',
          'bid_rotation','document_similarity'
        ),
        allowNull: false
      },
      severity:         { type: Sequelize.ENUM('low','medium','high','critical') },
      description:      { type: Sequelize.TEXT },
      statisticalValue: { type: Sequelize.DECIMAL(10,4) },
      threshold:        { type: Sequelize.DECIMAL(10,4) },
      detectionMethod:  { type: Sequelize.STRING },
      status:     { type: Sequelize.ENUM('open','reviewed','dismissed','escalated'), defaultValue: 'open' },
      reviewedBy: { type: Sequelize.UUID, allowNull: true },
      reviewNote: { type: Sequelize.TEXT },
      createdAt:  { type: Sequelize.DATE, allowNull: false },
      updatedAt:  { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('AnomalyFlags');
  }
};