'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Organization, { foreignKey: 'user_id' });
      User.hasMany(models.Bid, { foreignKey: 'user_id' });
      User.hasMany(models.Message, { foreignKey: 'sender_id', as: 'SentMessages' });
      User.hasMany(models.Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });
      User.hasMany(models.Notification, { foreignKey: 'user_id' });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'organization', 'bidder')
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
    underscored: true
  });

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

User.hasOne(Organization, { foreignKey: 'user_id' });
Organization.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Bid, { foreignKey: 'user_id' });
Bid.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });

User.hasMany(Notification, { foreignKey: 'user_id' });


  return User;
};