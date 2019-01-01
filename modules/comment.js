const Sequelize = require('sequelize');

function defineComment(sequelize) {
  return sequelize.define('comment', {
    user_id: {
      type: Sequelize.INTEGER, 
    },
    post_id: {
      type: Sequelize.INTEGER,
    },
    content: {
      type: Sequelize.STRING(1000),
      allowNull: false
    }
  },
  {
    underscored: true,
    tableName: 'comment',
  })   
}

module.exports = defineComment;