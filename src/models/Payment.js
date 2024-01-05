const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_id: {
        type: DataTypes.STRING(45),
    },
    payment_mode: {
        type: DataTypes.ENUM('Upi', 'Netbanking'),
    },
    payment_status: {
        type: DataTypes.ENUM('Sucessfull', 'Pending'),
    },
    type: {
        type: DataTypes.ENUM('Withdraw', 'Deposit'),
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

module.exports = Payment;
