'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'Sender' });
            Message.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'Receiver' });
        }
    }

    Message.init({
        senderId: DataTypes.UUID,
        recipientId: DataTypes.UUID,
        subject: DataTypes.STRING, // Added subject field
        content: DataTypes.TEXT,
        read_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Message',
        paranoid: true,
        underscored: true
    });

    return Message;
};
