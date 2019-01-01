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

function post_middleware(router, personal_info, prepare) {
  router.post('/post', async (ctx, next) => {
    var data = ctx.request.body;
    if(data != null) {
      if(data.user_id == personal_info.user_id) {
        await next();
      } else {
        ctx.response.status = 403;
      }
    } else {
      ctx.response.status = 400;
    }
  });
  router.get(/\/post/, async (ctx, next) => {
    var data = parseUrl(ctx.url);
    if(data == null || data[0].user_id == null) {  // 只能查看自己与好友的post
      ctx.response.status = 400;
    } else {
      var search = await prepare.has_friend.findAll({
        where: {
          from_id: personal_info.user_id,
          to_id: data[0].user_id
        }
      });
      if(search.length == 1 || data[0].user_id == personal_info.user_id) {
        await next();
      } else {
        ctx.response.status = 403;
      }
    }
  });
  router.put(/\/post/, async (ctx, next) => {
    ctx.response.status = 405;
  });
  router.delete(/\/post/, async (ctx, next) => {
    if(ctx.url == '/post')
      ctx.response.status = 403;
    else {
      var data = parseUrl(ctx.url);
      if(data == null || data[0].post_id == null) {
        ctx.response.status = 400;
      } else { // 只能删除自己的动态
        var search = await prepare.post.findAll({
          where: {
            post_id: data[0].post_id,
            user_id:  personal_info.user_id
          }
        });
        if(search.length == 1) {
          await next();
        } else {
          ctx.response.status = 403;
        }
      }
    }
  });  
}

module.exports = post_middleware;