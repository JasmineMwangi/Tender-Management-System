// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Tender = sequelize.define('tender', {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     title: DataTypes.STRING,
//     description: DataTypes.TEXT,
//     category: DataTypes.STRING,
//     budget: DataTypes.DECIMAL(15, 2),
//     deadline: DataTypes.DATEONLY,
//     requirements: DataTypes.TEXT,
//     contactEmail: DataTypes.STRING,
//     contactPhone: DataTypes.STRING,
//     location: DataTypes.STRING,
//     status: {
//       type: DataTypes.ENUM('draft', 'published', 'pending', 'closed'),
//       defaultValue: 'draft'
//     }
//   }, {
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//     paranoid: true,
//     deletedAt: 'deleted_at',
//     tableName: 'tenders' // Ensure lowercase name
//   });

//   Tender.associate = models => {
//     Tender.belongsTo(models.User, { foreignKey: 'organisationId', as: 'organisation' });
//     Tender.hasMany(models.Bid, { foreignKey: 'tenderId' });
//   };

//   return Tender;
// };
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tender = sequelize.define('tender', {
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
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    tableName: 'tenders' // Ensure lowercase name
  });

  Tender.associate = models => {
    Tender.belongsTo(models.User, { foreignKey: 'organisationId', as: 'organisation' });
    Tender.hasMany(models.Bid, { foreignKey: 'tenderId' });
  };

  return Tender;
};
