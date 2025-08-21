// models/UserRole.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'user_roles',   // 👈 matches your migration
    freezeTableName: true,     // prevents Sequelize from pluralizing again
    timestamps: true           // createdAt, updatedAt
  });

  UserRole.associate = function(models) {
    // many-to-many between User and Role
    UserRole.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    UserRole.belongsTo(models.Role, { foreignKey: 'roleId', onDelete: 'CASCADE' });
  };

  return UserRole;
};
