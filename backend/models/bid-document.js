'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BidDocument extends Model {
    static associate(models) {
      BidDocument.belongsTo(models.Bid, { foreignKey: 'bid_id' });
    }
  }

  BidDocument.init({
    bid_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    file_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BidDocument',
    paranoid: true,
    underscored: true
  });

  return BidDocument;
};