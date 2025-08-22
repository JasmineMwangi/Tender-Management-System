// models/Permission.js
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define("Permission", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  },
    {
      tableName: "permissions",   // 👈 exact name in DB
      timestamps: true  
    }
);

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: "rolepermissions",
      as: "roles",
      foreignKey: "permissionId",
    });
  };

  return Permission;
};
