//api路由配置文件
var router = require('koa-router')();

router.get('/',async (ctx)=>{
    ctx.body = '我是api页面';
})


module.exports = router.routes();