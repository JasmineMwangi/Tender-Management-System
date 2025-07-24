'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Bid extends Model {
        static associate(models) {
            Bid.belongsTo(models.User, { foreignKey: 'userId' });
            Bid.belongsTo(models.Tender, { foreignKey: 'tenderId' });
            Bid.hasMany(models.BidDocument, { foreignKey: 'bid_id' });
            Bid.hasOne(models.AiScore, { foreignKey: 'bid_id' });
        }
    }

    Bid.init({
        userId: DataTypes.INTEGER,
        tenderID: DataTypes.INTEGER,
        status: DataTypes.ENUM('submitted', 'reviewed', 'qualified', 'rejected', 'awarded'),
        type: DataTypes.STRING // Added type field
    }, {
        sequelize,
        modelName: 'Bid',
        paranoid: true,
        underscored: true
    });

    return Bid;
};
