const BaseModel = require('./BaseModel');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ...BaseModel,
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    phone: {
      type: DataTypes.STRING
    },
    organization: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'organisation', 'bidder',),
      defaultValue: 'bidder' // Default role is 'bidder'
    }
  }, {
    tableName: 'users',         // 👈 matches snake_case, lowercase
    timestamps: true,           // Sequelize adds created_at, updated_at
    underscored: true,          // Maps all keys to snake_case
    paranoid: true,             // Enables soft deletes (deleted_at)
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  // Password comparison method
  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, user.password);
  };

  return User;
};
