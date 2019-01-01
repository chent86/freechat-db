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

function has_friend_middleware(router, personal_info) {
  router.post('/has_friend', async (ctx, next) => {
    var data = ctx.request.body;
    if(data != null) {
      if(personal_info.user_id == data.from_id) {
        if(data.from_id == data.to_id) {
          ctx.response.status = 400;
          ctx.response.body = "cannot make friend with yourself";
        } else {
          await next();
        }
      } else {
        ctx.response.status = 403;
      }
    } else {
      ctx.response.status = 400;
    }
  });
  router.put(/\/has_friend/, async (ctx, next) => {
    ctx.response.status = 405;
  });
  router.delete(/\/has_friend/, async (ctx, next) => {
    if(ctx.url == '/has_friend')
    ctx.response.status = 403;
  else {
    var data = parseUrl(ctx.url);
    if(data == null || data[0].from_id != personal_info.user_id || data.length != 2 || data[1].to_id == null) {  // 只能删除自己的账号
      ctx.response.status = 400;
      console.log('oh');
    } else {
      await next();
    }
  }
  });  
}

module.exports = has_friend_middleware;