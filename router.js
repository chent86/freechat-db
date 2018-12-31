const router = require('koa-router')()
const prepare = require('./lib/prepare');
const RestQL = require('koa-restql');
const models = prepare.sequelize.models;
const restql = new RestQL(models);
const md5 = require('js-md5');
const cookie = require('cookie');

const password_auth = require('./routes/password_auth');
const cookie_auth = require('./routes/cookie_auth');
const user_middleware = require('./routes/user_middleware');
var personal_info = new Object(); // 记录当前用户信息

function setRoute(app) {
  password_auth(router, prepare); // 密码认证
  cookie_auth(router, prepare, personal_info);   // cookie认证
  user_middleware(router, personal_info);        // 处理返回的user信息
  app.use(router.routes())
  app.use(restql.routes())
}

module.exports = setRoute