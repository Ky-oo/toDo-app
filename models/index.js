const sequelize = require('../orm');
const Type = require('./Type');
const Task = require('./Task');
const User = require('./User');

Task.belongsTo(Type);
Type.hasMany(Task);
User.hasMany(Task);
Task.belongsTo(User);

//sequelize.sync({alter: true})

module.exports = { 
  Type: Type,
  Task: Task,
  User: User
}; 