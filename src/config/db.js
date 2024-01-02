const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const { mysql2 } = require('mysql2');// Needed to fix sequelize issues with WebPack

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
});

module.exports = sequelize;