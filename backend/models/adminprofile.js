// models/adminprofile.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const AdminProfile = sequelize.define('AdminProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    profileImage: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(100),
      defaultValue: 'Administration'
    },
    role: {
      type: DataTypes.STRING(100),
      defaultValue: 'Super Admin'
    }
  }, {
    tableName: 'admin_profiles',
    timestamps: true
  });

  AdminProfile.associate = (models) => {
    // AdminProfile.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return AdminProfile;
};