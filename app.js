const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const setRoute=require('./router');

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

//消去前缀`api`
app.use(async (ctx, next) => {
  if(ctx.request.url.substring(0,4) === '/api')
    ctx.redirect(ctx.request.url.substring(4,ctx.request.url.length))
  await next();
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
setRoute(app);

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
