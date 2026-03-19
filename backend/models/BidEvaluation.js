module.exports = (sequelize, DataTypes) => {
  const BidEvaluation = sequelize.define('BidEvaluation', {
    id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenderId:      { type: DataTypes.INTEGER, allowNull: false },
    bidId:         { type: DataTypes.INTEGER, allowNull: false },
    bidderId:      { type: DataTypes.INTEGER, allowNull: false },

    // Raw input scores (0–10)
    priceScore:      { type: DataTypes.DECIMAL(5,2) },
    qualityScore:    { type: DataTypes.DECIMAL(5,2) },
    timelineScore:   { type: DataTypes.DECIMAL(5,2) },
    experienceScore: { type: DataTypes.DECIMAL(5,2) },
    complianceScore: { type: DataTypes.DECIMAL(5,2) },

    // Weighted total
    totalScore:      { type: DataTypes.DECIMAL(5,2) },

    // Rule-based flags
    passesMandatoryChecks: { type: DataTypes.BOOLEAN, defaultValue: true },
    disqualificationReason:{ type: DataTypes.TEXT },

    rank:   { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('pending','evaluated','awarded','rejected'), defaultValue: 'pending' },
    evaluatedAt: { type: DataTypes.DATE },
    evaluatedBy: { type: DataTypes.INTEGER } // userId
  });

  BidEvaluation.associate = (models) => {
    BidEvaluation.belongsTo(models.Tender, { foreignKey: 'tenderId' });
    BidEvaluation.belongsTo(models.Bid,    { foreignKey: 'bidId' });
    BidEvaluation.belongsTo(models.User,   { foreignKey: 'bidderId' });
  };

  return BidEvaluation;
};