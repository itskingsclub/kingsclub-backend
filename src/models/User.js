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
    game_coin: {
        type: DataTypes.FLOAT,
    },
    win_coin: {
        type: DataTypes.FLOAT,
    },
    refer_coin: {
        type: DataTypes.FLOAT,
    },
    profile: {
        type: DataTypes.STRING,
    },
    date_of_birth: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING(45),
    },
    state: {
        type: DataTypes.STRING(45),
    },
    account_holder_name: {
        type: DataTypes.STRING(45),
    },
    bank_name: {
        type: DataTypes.STRING(45),
    },
    account_number: {
        type: DataTypes.STRING(45),
    },
    ifsc_code: {
        type: DataTypes.STRING(45),
    },
    upi_id: {
        type: DataTypes.STRING(45),
    },
});

module.exports = User;