const Sequelize = require('sequelize');

function defineSession(sequelize) {
  return sequelize.define('session', {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    value: {
      type: Sequelize.INTEGER,
    }
  },
  {
    underscored: true,
    tableName: 'session',
  })   
}

module.exports = defineSession;