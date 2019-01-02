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
  
function like_middleware(router, personal_info, prepare) {
  router.post('/liked', async (ctx, next) => {
    var data = ctx.request.body;
    if(data != null) {
      if(personal_info.user_id == data.user_id) {
        var search_post = await prepare.post.findAll({
          where: {
            post_id: data.post_id
          }
        });
        if(search_post.length != 1) {
          ctx.response.status = 400;
        } else {
          var check_friendship = await prepare.has_friend.findAll({
            where: {
              from_id: personal_info.user_id,
              to_id: search_post[0].user_id
            }
          });
          if(check_friendship.length != 1 && search_post[0].user_id != personal_info.user_id) { // 不是好友(自己除外)不能点赞
            ctx.response.status = 403;
          } else {
            await next();
          }
        }
      } else {
        ctx.response.status = 403;
      }
    } else {
      ctx.response.status = 400;
    }
  });
  router.put(/\/liked/, async (ctx, next) => {
    ctx.response.status = 405;
  });
  router.delete(/\/liked/, async (ctx, next) => {
    if(ctx.url == '/liked')
      ctx.response.status = 403;
    else {
      var data = parseUrl(ctx.url);
      if(data == null || data[0].user_id == null || data.length != 2 || data[1].post_id == null) {  // 只能取消自己的点赞
        ctx.response.status = 400;
      } else if(data[0].user_id != personal_info.user_id) {
        ctx.response.status = 403;
      } else {
        await next();
      }
    }
  });  
}

module.exports = like_middleware;