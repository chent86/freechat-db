const router = require('koa-router')()

const prepare = require('./lib/prepare');
const RestQL = require('koa-restql');
const models = prepare.sequelize.models;
const restql = new RestQL(models);

function hide_password(ctx) {
  for(i = 0; i < ctx.body.length; i++)
    ctx.body[i].dataValues.password = "";
}

function setRoute(app) {
  router.all('/auth', async (ctx, next) => {
    ctx.body = 'auth!';
  })
  router.all('/*', async (ctx, next) => {
    auth=true;
    if(auth) {              // 进入restql前的权限认证
      await next()          // restql根据url访问数据库，返回结果
      if(ctx.url === '/user')  //进行返回数据的处理
        hide_password(ctx);
    } else {
      ctx.body = "error";
    }
  })
  app.use(router.routes())
  app.use(restql.routes())
}

module.exports = setRoute