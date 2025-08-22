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
  },
    {
      tableName: "roles",   // 👈 exact name in DB
      timestamps: true
    }
  );

  Role.associate = (models) => {
    Role.belongsToMany(models.Permission, {
      through: "rolepermissions",  // 👈 match migration
      foreignKey: "roleId",
      otherKey: "permissionId",
      as: "permissions"
    });

    Role.belongsToMany(models.User, {
      through: { model: "userrole" },
      foreignKey: "roleId",
      otherKey: "userId",
      as: "users"
    });

  };


  return Role;
};
