function hide_password(ctx) {
  for(i = 0; i < ctx.body.length; i++)
    ctx.body[i].dataValues.password = "";
}

function parseUrl(url){
  var result = [];
  var query = url.split("?")[1];
  var queryArr = query.split("&");
  queryArr.forEach(function(item){
      var obj = {};
      var value = item.split("=")[1];
      var key = item.split("=")[0];
      obj[key] = value;
      result.push(obj);
  });
  return result;
}

function uesr_middleware(router, personal_info) {
  router.post('/user', async (ctx, next) => {
    var data = ctx.request.body;
    if(data != null && data.username != null && data.username.length == 0) {
      ctx.response.body = "username cannot be empty";
      ctx.response.status = 400;
    } else if(data != null && data.password != null && data.password.length == 0) {
      ctx.response.body = "password cannot be empty";
      ctx.response.status = 400;
    } else {
      await next();
      ctx.response.body = "OK";
    }
  });
  router.get(/\/user/, async (ctx, next) => {
    await next();
    if(Array.isArray(ctx.body))
      hide_password(ctx); 　// 处理数组(隐藏密码)
    else
      ctx.body.dataValues.password = ""; // 处理对象(隐藏密码)
  });
  router.put(/\/user/, async (ctx, next) => {
    var data = ctx.request.body;
    if(personal_info.username != data.username) { // 只能更新自己的信息
      ctx.response.status = 405;
    }
    else {
      await next();
      ctx.response.body = "OK";
    }
  });
  router.delete(/\/user/, async (ctx, next) => {
    if(ctx.url == '/user')
      ctx.response.status = 405;
    else {
      var data = parseUrl(ctx.url);
      if(data == null || data[0].username != personal_info.username) {  // 只能删除自己的账号
        ctx.response.status = 405;
      } else {
        await next();
      }
    }
  });  
}

module.exports = uesr_middleware;