'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },

    proposedTimeline: {
      type: DataTypes.STRING,
      allowNull: true
    },

    proposalDocument: {  // ✅ match database column
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
       type: DataTypes.ENUM('submitted', 'reviewed', 'qualified', 'rejected', 'awarded'),
      //  type: DataTypes.ENUM('under review', 'accepted', 'withdrawn', 'pending' ),
      defaultValue: 'submitted'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: { // ✅ match actual DB field
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    bidNumber: {
      type: DataTypes.STRING,
      allowNull: false,       // still required
      unique: true            // optional but preferred
    },



    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tenders',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    paranoid: true,
    deletedAt: 'deletedAt',
    tableName: 'bids',
    underscored: false
  });

  Bid.associate = models => {
    Bid.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user' // alias remains okay
    });
    
    Bid.belongsTo(models.Tender, {
      foreignKey: 'tenderId',
      as: 'tender'
    });
  };

  return Bid;
};
