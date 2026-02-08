'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tender = sequelize.define('Tender', { // Capitalized model name
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    budget: DataTypes.DECIMAL(15, 2),
    deadline: DataTypes.DATEONLY,
    requirements: DataTypes.TEXT,
    contactEmail: DataTypes.STRING,
    contactPhone: DataTypes.STRING,
    location: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('draft', 'published', 'pending', 'closed'),
      defaultValue: 'draft'
    },
    organizationId: { // Match the foreign key name used in User model
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    paranoid: true,
    deletedAt: 'deletedAt',
    tableName: 'tenders',
    underscored: false, // Use camelCase for model attributes
  });
  Tender.associate = models => {
    Tender.belongsTo(models.User, { 
      foreignKey: 'organizationId', 
      as: 'organization' 
    });
    Tender.hasMany(models.Bid, { 
      foreignKey: 'tenderId',
      as: 'bids'
    });
  };

  return Tender;
};