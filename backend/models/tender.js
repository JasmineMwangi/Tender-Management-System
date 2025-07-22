'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tender = sequelize.define('Tender', {
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
    }
  },
   {
    paranoid: true,               // Enables soft delete
    deleted_at: 'deleted_at',      // Use custom column name
    tableName: 'Tenders',
    created_at: 'created_at',
    updated_at: 'updated_at',
    timestamps: true              // Ensure createdAt/updatedAt are on
  },
  {
    tableName: 'Tenders',
  });
  return Tender;
};
