//用户页面路由
var router = require('koa-router')();

router.get('/',async (ctx)=>{
    await ctx.render('admin/user/list');
})

router.get('/add',async (ctx)=>{
    await ctx.render('admin/user/add');
})

module.exports = router.routes();