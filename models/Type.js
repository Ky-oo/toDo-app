const {DataTypes} = require('sequelize');

const sequelize = require('../orm');

const Type = sequelize.define('Type', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Type;