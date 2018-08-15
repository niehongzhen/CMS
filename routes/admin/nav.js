//导航路由
var router = require('koa-router')();

//引入自定义模块
var Db = require('../../model/db.js');
var tools = require('../../model/tools.js');

router.get('/', async (ctx)=>{
    var sortJson = {
        'add_time':-1
    };
    //查询数据库，渲染数据
    var data = await Db.find('nav',{},{},{
        sortJson
    });
    await ctx.render('admin/nav/list',{
        list:data
    });
});

router.get('/add', async (ctx)=>{
    await ctx.render('admin/nav/add');
});

//增加提交
router.post('/doAdd', async (ctx)=>{
    let navName = ctx.request.body.navName.trim();
    let navUrl = ctx.request.body.navUrl.trim();
    let sort = ctx.request.body.sort;
    let add_time = tools.getTime();
    let status = ctx.request.body.status;

    var data = {
        navName,navUrl,sort,add_time,status
    }
    //连接数据库，添加导航数据
    var insertResult = await Db.insert('nav',data);
    try{
        if(insertResult.result.ok){
            ctx.body = '<script>alert("增加成功！");location.href="/admin/nav";</script>'
        }
    }catch(err){
        console.log(err);
    }
});

//编辑页面
router.get('/edit', async (ctx)=>{
    var _id = ctx.query.id;
    var data = await Db.find('nav',{'_id':Db.getObjectId(_id)});
    await ctx.render('admin/nav/edit',{
        list:data[0]
    })
});

//编辑页面保存
router.post('/doEdit', async (ctx)=>{
    let _id = ctx.request.body._id;
    let navName = ctx.request.body.navName;
    let navUrl = ctx.request.body.navUrl.trim();
    let sort = ctx.request.body.sort;
    let add_time = tools.getTime();
    let status = ctx.request.body.status;
    var data = {
        navName,navUrl,sort,add_time,status
    }
    //更新数据
    var updateResult = await Db.update('nav',{'_id':Db.getObjectId(_id)},data);
    try{
        if(updateResult.result.ok){
            ctx.body = '<script>alert("保存成功！");location.href="/admin/nav";</script>'
        }
    }catch (e) {
        console.log(e);
    }

})

module.exports = router.routes();