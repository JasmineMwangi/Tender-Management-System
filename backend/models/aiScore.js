
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AiScore extends Model {
    static associate(models) {
      AiScore.belongsTo(models.Bid, { foreignKey: 'bid_id' });
    }
  }

  AiScore.init({
    bid_id: { type: DataTypes.INTEGER, unique: true },
    score: DataTypes.FLOAT,
    details: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'AiScore',
    paranoid: true,
    underscored: true
  });

  return AiScore;
};
