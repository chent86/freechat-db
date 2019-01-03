const md5 = require('js-md5');
const cookie = require('cookie');

var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function create_session() {
  var result = "";
  for(var i = 0; i < 32; i++) {
    result += alphabet[Math.floor(Math.random()*62)];
  }
  return result;
}

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
          avatar: result[0].avatar,
          cover: result[0].cover
        };
        ctx.response.body = response;
        var new_session = create_session();
        await prepare.session.update({
          value: new_session
        },{
          where: {
            user_id:result[0].user_id
          }
        });
        ctx.set('Set-Cookie', cookie.serialize('freechat', new_session, {
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