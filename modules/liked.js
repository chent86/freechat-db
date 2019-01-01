const Sequelize = require('sequelize');

function defineLike(sequelize) {
  return sequelize.define('liked', {
    user_id: {
      type: Sequelize.INTEGER, 
    },
    post_id: {
      type: Sequelize.INTEGER,
    }
  },
  {
    underscored: true,
    tableName: 'liked',
  })   
}

module.exports = defineLike;