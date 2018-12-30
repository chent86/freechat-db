'use strict';

const Sequelize = require('sequelize');
const config = require("./config");
const sequelize = new Sequelize(config.db);
const defineUser = require('../modules/users');
const defineGame = require('../modules/games');
const defineAttend = require('../modules/attend');

var user = defineUser(sequelize);
var game = defineGame(sequelize);
var attend = defineAttend(sequelize);

game.belongsToMany(user, {through: attend});  //默认外码 game_gid 和 user_uid

// const Op = Sequelize.Op;
// user.findAll({
//     where: {
//         id:{
//             [Op.gt]: 1
//         }
//     }
// }).then(user => {
//     console.log(user)
//   })

module.exports = {
    sequelize
};