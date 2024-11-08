const sequelize = require('../orm');
const Type = require('./Type');
const Task = require('./Task');

Task.belongsTo(Type);
Type.hasMany(Task);

//sequelize.sync({alter: true})

module.exports = { 
  Type: Type,
  Task: Task
}; 