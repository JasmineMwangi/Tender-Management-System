'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      Organization.belongsTo(models.User, { foreignKey: 'user_id' });
      Organization.hasMany(models.Tender, { foreignKey: 'organisationId' });
    }
  }

  Organization.init({
    name: DataTypes.STRING,
    industry: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Organization',
    paranoid: true,
    underscored: false
  });

//   Organization.hasMany(Tender, { foreignKey: 'organization_id' });
// Tender.belongsTo(Organization, { foreignKey: 'organization_id' });


  return Organization;
};
