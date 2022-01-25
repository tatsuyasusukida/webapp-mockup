module.exports = function (sequelize, DataTypes) {
  const todo = sequelize.define('todo', { // <1>
    date: {type: DataTypes.DATE, allowNull: false}, // <2>
    content: {type: DataTypes.TEXT, allowNull: false}, // <3>
  }, {freezeTableName: true}) // <4>

  return todo
}