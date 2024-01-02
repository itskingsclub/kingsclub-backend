const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Challenge = sequelize.define('Challenge', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        autoIncrement: true
    },
    creator: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    joiner: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    creator_result: {
        type: DataTypes.ENUM('Waiting', 'Win', 'Lose', 'Cancel'),
    },
    joiner_result: {
        type: DataTypes.ENUM('Waiting', 'Win', 'Lose', 'Cancel'),
    },
    challenge_status: {
        type: DataTypes.ENUM('Waiting', 'Processing', 'Playing', 'Clear', 'Review', 'Fraud', 'Cancel'),
        allowNull: false,
    },
    room_code: {
        type: DataTypes.STRING(45),
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    expiry_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    admin_approval: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

module.exports = Challenge;
