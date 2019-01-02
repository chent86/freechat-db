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
        var response = {
          username: result[0].username,
          user_id: result[0].user_id,
          avatar: result[0].avatar
        };
        ctx.response.body = response;
        var random_num = Math.floor(Math.random()*1000);
        await prepare.session.update({
          value: random_num
        },{
          where: {
            user_id:result[0].user_id
          }
        });
        var md5_value = md5(data.username+data.password+random_num);
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
  });
  router.get('/auth', async (ctx, next) => {
    ctx.response.status = 405;
  });
}

module.exports = password_auth;