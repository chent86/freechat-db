'use strict';

const Sequelize = require('sequelize');
const config = require("./config");
const sequelize = new Sequelize(config.db);
const defineUser = require('../modules/user');
const definePost = require('../modules/post');
const defineFriendShip = require('../modules/has_friend');
const defineLike = require('../modules/liked');
const defineComment = require('../modules/comment');

var user = defineUser(sequelize);
var post = definePost(sequelize);
var has_friend = defineFriendShip(sequelize);
var liked = defineLike(sequelize);
var comment = defineComment(sequelize);

user.belongsToMany(user, {as: 'from', through: 'has_friend', foreignKey: 'from_id'});
user.belongsToMany(user, {as: 'to', through: 'has_friend', foreignKey: 'to_id'});
post.belongsToMany(user, {through: 'liked', foreignKey: 'post_id'});
user.belongsToMany(post, {through: 'liked', foreignKey: 'user_id'});
post.belongsToMany(user, {through: 'comment', foreignKey: 'post_id'});
user.belongsToMany(post, {through: 'comment', foreignKey: 'user_id'});
user.hasMany(post, {foreignKey: 'user_id'});

module.exports = {
  sequelize,
  user,
  has_friend,
  post,
  comment
};