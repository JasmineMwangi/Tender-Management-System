module.exports = (sequelize, DataTypes) => {
  const TenderRecommendation = sequelize.define('TenderRecommendation', {
    id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId:   { type: DataTypes.INTEGER, allowNull: false },
    tenderId: { type: DataTypes.INTEGER, allowNull: false },

    matchScore:      { type: DataTypes.DECIMAL(5,2) }, // 0–100
    matchReasons:    { type: DataTypes.JSON },          // array of reason strings
    matchBreakdown:  { type: DataTypes.JSON },          // { category:30, location:20, ... }

    isSaved:    { type: DataTypes.BOOLEAN, defaultValue: false },
    isApplied:  { type: DataTypes.BOOLEAN, defaultValue: false },
    isDismissed:{ type: DataTypes.BOOLEAN, defaultValue: false },
    generatedAt:{ type: DataTypes.DATE,    defaultValue: DataTypes.NOW }
  });

  TenderRecommendation.associate = (models) => {
    TenderRecommendation.belongsTo(models.User,   { foreignKey: 'userId' });
    TenderRecommendation.belongsTo(models.Tender, { foreignKey: 'tenderId' });
  };

  return TenderRecommendation;
};