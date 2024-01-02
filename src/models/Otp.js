const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Otp = sequelize.define('Otp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    mobile: {
        type: DataTypes.STRING(45),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    pin: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    expiry: {
        type: DataTypes.DATE,
        allowNull: false
    },
});

module.exports = Otp;
