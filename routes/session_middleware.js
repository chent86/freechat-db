 
function session_middleware(router) {
  router.all(/\/session/, async (ctx, next) => {
    ctx.response.status = 400;
  });
}

module.exports = session_middleware;