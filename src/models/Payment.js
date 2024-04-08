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
    },
    payment_id: {
        type: DataTypes.STRING(45),
    },
    payment_mode: {
        type: DataTypes.ENUM('Upi', 'Netbanking', 'Admin'),
    },
    payment_status: {
        type: DataTypes.ENUM('Sucessfull', 'Pending', 'Fraud', 'Cancel'),
    },
    type: {
        type: DataTypes.ENUM('Withdraw', 'Deposit'),
    },
    remark: {
        type: DataTypes.STRING(100),
    },
    image: {
        type: DataTypes.STRING,
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

// Define associations
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Payment;
