'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', { // Using sequelize.define for consistency
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    proposal: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('submitted', 'reviewed', 'qualified', 'rejected', 'awarded'),
      defaultValue: 'submitted'
    },
    type: DataTypes.STRING,
    bidderId: { // Match the foreign key name used in User model
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    tenderId: { // Match the foreign key name used in Tender model
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tenders',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    tableName: 'bids',
    underscored: true
  });

  Bid.associate = models => {
    Bid.belongsTo(models.User, { 
      foreignKey: 'bidderId',
      as: 'bidder' 
    });
    Bid.belongsTo(models.Tender, { 
      foreignKey: 'tenderId',
      as: 'tender' 
    });
  };

  return Bid;
};