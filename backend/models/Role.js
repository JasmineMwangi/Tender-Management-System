// models/Role.js
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
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
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.Permission, {
      through: "RolePermissions",
      foreignKey: "roleId",
    });
    Role.belongsToMany(models.User, {
      through: "UserRole",
      foreignKey: "roleId",
    });
  };

  return Role;
};
