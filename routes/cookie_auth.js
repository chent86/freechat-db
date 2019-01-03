const md5 = require('js-md5');
const cookie = require('cookie');

function cookie_auth(router, personal_info, prepare) {
  router.all('/*', async (ctx, next) => {
    if(ctx.method == 'POST' && ctx.url == '/user') {
      try { // 在外层中间件捕获所有异常
        await next();
      } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
          message: err.message
        };
      }
    } else {
      var cookie_set = cookie.parse(ctx.request.header.cookie || '');
      auth = false;
      console.log(cookie_set.freechat);
      if(cookie_set.freechat != undefined) {
        var session = cookie_set.freechat;
        var search = await prepare.session.findAll({
          where: {
            value: session
          }
        });
        if(search.length == 1) {
          // 登录后得到的cookie有效期为一天
          if((new Date().getTime()-new Date(search[0].updated_at).getTime())/1000-28800 < 86400) {
            var user = await prepare.user.findAll({
              where: {
                user_id: search[0].user_id
              }
            });
            var correct_data = user[0].dataValues;
            auth = true;
          }
        }
      }
      if(auth) {
        personal_info.username = correct_data.username;
        personal_info.password = correct_data.password;
        personal_info.user_id = correct_data.user_id;
        try { // 在外层中间件捕获所有异常
          await next();
        } catch (err) {
          ctx.response.status = err.statusCode || err.status || 500;
          ctx.response.body = {
            message: err.message
          };
        }
      } else {
        ctx.response.status = 401;
      }
    }
  })
}

module.exports = cookie_auth;