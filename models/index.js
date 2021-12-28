const sequeliezePackage = require('sequelize');
const allConfig = require('../config/config');

const userModel = require('./userModel');
const gameModel = require('./gameModel');

const { Sequelize } = sequeliezePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};
console.log(env);

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = userModel(sequelize, Sequelize.DataTypes);
db.Game = gameModel(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Game);
db.Game.belongsTo(db.User);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;