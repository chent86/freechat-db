const md5 = require('js-md5');
const cookie = require('cookie');

function cookie_auth(router, prepare, personal_info) {
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
      if(cookie_set.freechat != undefined) {
        var auth_data = JSON.parse(cookie_set.freechat);
        if(auth_data.username != undefined && auth_data.md5_value != undefined) {
          var search = await prepare.user.findAll({
            where: {
              username: auth_data.username
            }
          });
          if(search.length == 1) {
            var correct_data = search[0].dataValues;
            var correct_md5_value = md5(correct_data.username+correct_data.password);
            if(auth_data.md5_value == correct_md5_value)
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