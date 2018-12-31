const md5 = require('js-md5');
const cookie = require('cookie');

function password_auth(router, prepare) {
  router.post('/auth', async (ctx, next) => {
    var data = ctx.request.body;
    if( data.username == null || data.password == null) {
      ctx.response.status = 401;
    } else {
      var result = await prepare.user.findAll({
        where: {
          username: data.username,
          password: data.password
        }
      });
      if(result.length == 1) {
        ctx.response.body = "OK";
        var md5_value = md5(data.username+data.password);
        var cookie_value = {
          "username": data.username,
          "md5_value": md5_value 
        };
        ctx.set('Set-Cookie', cookie.serialize('freechat', JSON.stringify(cookie_value), {
          httpOnly: true,
          maxAge: 60 * 60 * 24, // 1 day
        }));
      }
      else
        ctx.response.status = 401;
    }
  })
}

module.exports = password_auth;