module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: DataTypes.DECIMAL,
    status: {
      type: DataTypes.ENUM('submitted', 'accepted', 'rejected'),
      defaultValue: 'submitted'
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Bid.associate = models => {
    Bid.belongsTo(models.tender, { foreignKey: 'tenderId', as: 'tender' });
    Bid.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Bid;
};
