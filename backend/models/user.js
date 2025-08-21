'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.CHAR(36), // Match your DB: char(36)
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },

    // Match DB field: 'name' not 'first_name' and 'last_name'
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
        notEmpty: true
      }
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [5, 255]
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase().trim());
      }
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255]
      }
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [10, 20]
      }
    },

    // Match DB enum values: 'admin','organization','bidder'
    role: {
      type: DataTypes.ENUM('admin', 'organization', 'bidder'),
      allowNull: false,
      defaultValue: 'bidder'
    },

    // Match DB enum: 'active','inactive','suspended'
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active'
    },

    // Match DB field: emailVerified (camelCase, not snake_case)
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    // Match DB field: lastLoginAt (camelCase, not snake_case)
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }

    // Remove timestamp fields - let Sequelize handle them automatically
    // since they're defined in the database with timestamps: true
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true, // Uses createdAt, updatedAt
    paranoid: true, // Uses deletedAt for soft deletes
    underscored: false, // Keep camelCase to match your DB

    // Explicitly define timestamp field names to match your DB
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',

    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['status']
      },
      {
        fields: ['deletedAt']
      }
    ],

    hooks: {
      beforeCreate: async (user) => {
        // No password hashing here; handled in the controller
      },

      beforeUpdate: async (user) => {
        // No password hashing here; handled in the controller
      }
    }
  });

  // Instance methods
  User.prototype.comparePassword = async function (password) {
    if (!password || !this.password) {
      return false;
    }
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.updateLastLogin = async function () {
    this.lastLoginAt = new Date();
    return await this.save();
  };

  User.prototype.isActive = function () {
    return this.status === 'active';
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    // Remove sensitive fields
    delete values.password;
    return values;
  };

  // Class methods
  User.findByEmail = async function (email) {
    return await this.findOne({
      where: { email: email.toLowerCase().trim() }
    });
  };

  User.findActiveByEmail = async function (email) {
    return await this.findOne({
      where: {
        email: email.toLowerCase().trim(),
        status: 'active',
        deletedAt: null
      }
    });
  };

  // Associations
  User.associate = (models) => {
    // Only define if models exist
    if (models.Tender) {
      User.hasMany(models.Tender, {
        foreignKey: 'organisationId', // Adjust based on your Tender model
        as: 'tenders'
      });
    }

    if (models.Bid) {
      User.hasMany(models.Bid, {
        foreignKey: 'userId', // Adjust based on your Bid model
        as: 'bids'
      });
    }
    User.associate = (models) => {
      User.belongsToMany(models.Role, {
        through: "userRoles",
        foreignKey: "userId",
      });
    }

     User.belongsToMany(models.Role, {
      through: 'Userroles',
      foreignKey: 'userId',
      otherKey: 'roleId'
     });
    
  };

  return User;
};