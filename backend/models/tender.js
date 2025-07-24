'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Tender extends Model {
        static associate(models) {
            Tender.belongsTo(models.Organization, { foreignKey: 'organization_id' });
            Tender.hasMany(models.Bid, { foreignKey: 'tender_id' });
            Tender.hasMany(models.TenderDocument, { foreignKey: 'tender_id' });
        }
    }

    Tender.init({
        organization_id: DataTypes.INTEGER,
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        budget: DataTypes.FLOAT,
        deadline: DataTypes.DATE,
        status: DataTypes.STRING // Added status field
    }, {
        sequelize,
        modelName: 'Tender',
        paranoid: true,
        underscored: true
    });

    return Tender;
};
