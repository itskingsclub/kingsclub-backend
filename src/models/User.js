const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING(45),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    referral_code: {
        type: DataTypes.STRING(45),
    },
    invite_code: {
        type: DataTypes.STRING(45),
    },
    admin: {
        type: DataTypes.STRING(45),
    },
    block: {
        type: DataTypes.STRING(45),
    },
    total_coin: {
        type: DataTypes.FLOAT,
    },
});

module.exports = User;