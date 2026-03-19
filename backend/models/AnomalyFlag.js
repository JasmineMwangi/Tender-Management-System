module.exports = (sequelize, DataTypes) => {
  const AnomalyFlag = sequelize.define('AnomalyFlag', {
    id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenderId: { type: DataTypes.INTEGER },
    bidId:    { type: DataTypes.INTEGER },
    bidderId: { type: DataTypes.INTEGER },

    flagType: {
      type: DataTypes.ENUM(
        'price_outlier',        // bid price too far from mean
        'duplicate_bid',        // same company submitting near-identical bids
        'shill_bidding',        // multiple bids from related entities
        'deadline_manipulation',// bid submitted in last minutes repeatedly
        'cover_pricing',        // losing bidder coordinates with winner
        'below_cost_bid',       // price suspiciously low (dumping)
        'bid_rotation',         // same winner keeps rotating across tenders
        'document_similarity'   // copy-paste documents across bids
      ),
      allowNull: false
    },

    severity:    { type: DataTypes.ENUM('low','medium','high','critical') },
    description: { type: DataTypes.TEXT },

    // Statistical evidence
    statisticalValue: { type: DataTypes.DECIMAL(10,4) }, // e.g. z-score
    threshold:        { type: DataTypes.DECIMAL(10,4) },
    detectionMethod:  { type: DataTypes.STRING },        // 'z-score','IQR','rule'

    status: { type: DataTypes.ENUM('open','reviewed','dismissed','escalated'), defaultValue: 'open' },
    reviewedBy: { type: DataTypes.INTEGER },
    reviewNote: { type: DataTypes.TEXT }
  });

  AnomalyFlag.associate = (models) => {
    AnomalyFlag.belongsTo(models.Tender, { foreignKey: 'tenderId' });
    AnomalyFlag.belongsTo(models.Bid,    { foreignKey: 'bidId' });
  };

  return AnomalyFlag;
};