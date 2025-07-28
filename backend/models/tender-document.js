'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TenderDocument extends Model {
    static associate(models) {
      TenderDocument.belongsTo(models.Tender, { foreignKey: 'tender_id' });
    }
  }

  TenderDocument.init({
    tender_id: DataTypes.INTEGER,
    file_url: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TenderDocument',
    paranoid: true,
    underscored: true
  });

  return TenderDocument;
};