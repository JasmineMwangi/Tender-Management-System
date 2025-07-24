'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Notification.init({
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    message: DataTypes.TEXT,
    read_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Notification',
    paranoid: true,
    underscored: true
  });

  return Notification;
};
