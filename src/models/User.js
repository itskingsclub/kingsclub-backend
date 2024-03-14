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
    bank_name: {
        type: DataTypes.ENUM(
            'Allahabad Bank', 'American Express', 'Andhra Bank',
            'Axis Bank', 'Bandhan Bank', 'Bank of Baroda',
            'Bank of India', 'Bank of Maharashtra', 'Canara Bank',
            'Catholic Syrian Bank Ltd.', 'Central Bank of India', 'Citibank',
            'City Union Bank', 'Corporation Bank', 'DCB Bank',
            'Dena Bank', 'Deutsche Bank', 'Dhanlaxmi Bank',
            'DBS Bank', 'Federal Bank', 'HDFC Bank',
            'HSBC Bank', 'ICICI Bank', 'IDBI Bank',
            'IDFC Bank', 'Indian Bank', 'Indian Overseas Bank',
            'IndusInd Bank', 'J&K Bank', 'Karnataka Bank',
            'Karur Vysya Bank', 'Kotak Mahindra Bank', 'Lakshmi Vilas Bank',
            'Nainital Bank', 'Oriental Bank of Commerce', 'Punjab & Sind Bank',
            'Punjab National Bank', 'RBL Bank', 'South Indian Bank',
            'Standard Chartered Bank', 'State Bank of India', 'Syndicate Bank',
            'Tamilnad Mercantile Bank', 'UCO Bank', 'Union Bank of India',
            'United Bank of India', 'Vijaya Bank', 'YES Bank'
        ),
    },
    account_number: {
        type: DataTypes.STRING(45),
    },
    ifsc_code: {
        type: DataTypes.STRING(45),
    },
    holder_name: {
        type: DataTypes.STRING(45),
    },
    upi_id: {
        type: DataTypes.STRING(45),
    },
});

module.exports = User;