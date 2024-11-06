const {DataTypes} = require('sequelize');

const sequelize = require('../orm');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },

});

module.exports = Task;