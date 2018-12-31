const Sequelize = require('sequelize');

function defineFriendShip(sequelize) {
  return sequelize.define('has_friend', {
    from_id: {
      type: Sequelize.INTEGER, 
    },
    to_id: {
      type: Sequelize.INTEGER,
    }
  },
  {
    underscored: true,
    tableName: 'has_friend',
  })   
}

module.exports = defineFriendShip;