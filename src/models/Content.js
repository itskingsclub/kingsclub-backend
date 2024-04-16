const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const contents = sequelize.define('Content', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.JSON, // Store JSON data
        allowNull: false,
    },
});

module.exports = contents;