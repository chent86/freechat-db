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

function uesr_middleware(router, personal_info, prepare) {
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
      await prepare.session.create({ // 创建session
        user_id:ctx.response.body["dataValues"].user_id
      });
      ctx.response.body = "OK";
    }
  });
  router.get(/\/user/, async (ctx, next) => {
    if(ctx.url == '/user/count') {
      await next();
    } else {
      await next();
      if(Array.isArray(ctx.body))
        hide_password(ctx); 　// 处理数组(隐藏密码)
      else
        ctx.body.dataValues.password = ""; // 处理对象(隐藏密码)
    }
  });
  router.put(/\/user/, async (ctx, next) => {
    var data = ctx.request.body;
    if(personal_info.username != data.username) { // 只能更新自己的信息
      ctx.response.status = 403;
    }
    else {
      await next();
      ctx.response.body = "OK";
    }
  });
  router.delete(/\/user/, async (ctx, next) => {
    if(ctx.url == '/user')
      ctx.response.status = 403;
    else {
      var data = parseUrl(ctx.url);
      if(data == null || data[0].username != personal_info.username) {  // 只能删除自己的账号
        ctx.response.status = 403;
      } else {
        await next();
      }
    }
  });

  router.get('/user/count', async (ctx, next) => {
    var data = {};
    var post_count = await prepare.post.findAll({ // 我的动态数量
      where: {
        user_id: personal_info.user_id
      }
    });
    data["post_count"] = post_count.length; 
    var follower_count = await prepare.has_friend.findAll({ // 我的粉丝数量
      where: {
        to_id: personal_info.user_id
      }
    });
    data["follower_count"] = follower_count.length;
    var following_count = await prepare.has_friend.findAll({ // 我的关注数量
      where: {
        from_id: personal_info.user_id
      }
    });
    data["following_count"] = following_count.length; 
    var comment_count = await prepare.comment.findAll({ // 我的关注数量
      where: {
        user_id: personal_info.user_id
      }
    });
    data["comment_count"] = comment_count.length;
    ctx.response.body = data;    
  });
}

module.exports = uesr_middleware;