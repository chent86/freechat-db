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

function sort_by_date(a, b) {
  return a.created_at<b.created_at;
}

function post_middleware(router, personal_info, prepare) {
  router.post('/post', async (ctx, next) => {
    var data = ctx.request.body;
    if(data != null) {
      if(data.user_id == personal_info.user_id) {
        await next();
        ctx.response.body["dataValues"]["username"] = personal_info.username; // 返回数据中添加username
      } else {
        ctx.response.status = 403;
      }
    } else {
      ctx.response.status = 400;
    }
  });
  router.get(/\/post/, async (ctx, next) => {
    if(ctx.url != '/post/home') {
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
    } else {
      await next();
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
  router.get('/post/home', async (ctx, next) => {
    var search = await prepare.has_friend.findAll({　// 获取自己和所有好友的id
      where: {
        from_id:personal_info.user_id
      },
      attributes: ['to_id']
    });
    search.push({"to_id": personal_info.user_id}); 
    var post_set = [];
    for(var i = 0; i < search.length; i++) {　// 获取自己和所有好友的动态
      var user_post = await prepare.post.findAll({
        where: {
          user_id:search[i].to_id
        }
      });
      user_post.forEach(user_post_item=>{
        post_set.push(user_post_item); 
      });
    }
    for(var i = 0; i < post_set.length; i++) { 
      var user_data = await prepare.user.findOne({ // 往动态添加用户名
        where: {
          user_id:post_set[i].user_id
        },
        attributes: ['username']
      });
      post_set[i]["dataValues"]["username"] = user_data.username;
      var like_data = await prepare.liked.findAll({ // 往动态添加是否点赞
        where: {
          user_id:personal_info.user_id,
          post_id:post_set[i]["dataValues"].post_id
        }
      });
      if(like_data.length == 0) {
        post_set[i]["dataValues"]["like"] = 0;
      } else {
        post_set[i]["dataValues"]["like"] = 1;
      }
    }
    post_set.sort(sort_by_date);
    for(var i = 0; i < post_set.length; i++) {
      var comment_set = await prepare.comment.findAll({  // 获取每个动态的所有评论
        where: {
          post_id:post_set[i].post_id
        }
      });
      post_set[i]["dataValues"]["comment"] = [];
      comment_set.forEach(element => {
        post_set[i]["dataValues"]["comment"].push(element["dataValues"]);
      });
      for(var j = 0; j < post_set[i]["dataValues"]["comment"].length; j++) {  // 为每条评论添加用户名
        var user_data = await prepare.user.findOne({
          where: {
            user_id:post_set[i]["dataValues"]["comment"][j].user_id
          },
          attributes: ['username']
        });
        post_set[i]["dataValues"]["comment"][j]["username"] = user_data.username;
      }
      // post_set[i]["dataValues"]["comment"].sort(sort_by_date)
    }
    ctx.response.body= post_set;
  });
}

module.exports = post_middleware;